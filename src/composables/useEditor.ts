import { computed, onScopeDispose, ref, watch, type InjectionKey } from 'vue';
import { createProject } from '../data/defaults';
import { randomizeAll, randomizeTicker } from '../data/random';
import { createFromReference } from '../data/references';
import { deleteNamed, listSaved, loadDraft, saveNamed, storeDraft } from '../services/storage';
import { exportProject, projectFilename, downloadBlob } from '../services/files';
import { embeddedAsset } from '../services/assets';
import { renderFrame } from '../render';
import type { Project, SavedProject, TemplateId } from '../types/project';

export function useEditor() {
    const project = ref<Project>(createProject());
    const saved = ref<SavedProject[]>([]);
    const notice = ref('');
    const persistence = ref('Загрузка проекта…');
    const busy = ref(false);
    const initialized = ref(false);
    const guides = ref(false);
    const referenceOpen = ref(false);
    const libraryOpen = ref(false);
    const mobilePanel = ref<'templates' | 'preview' | 'settings'>('preview');
    const history = ref<string[]>([]);
    const future = ref<string[]>([]);
    let previous = JSON.stringify(project.value);
    let timer: ReturnType<typeof setTimeout>;
    let noticeTimer: ReturnType<typeof setTimeout>;
    let replaying = false;
    let revision = 0;

    function notify(message: string): void {
        notice.value = message;
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => (notice.value = ''), 6000);
    }

    function snapshot(): Project {
        const value = JSON.parse(JSON.stringify(project.value)) as Project;
        value.images.forEach((image) => (image.src = embeddedAsset(image.src)));
        return value;
    }

    watch(
        project,
        () => {
            if (!initialized.value) {
                return;
            }
            persistence.value = 'Сохраняется…';
            clearTimeout(timer);
            const currentRevision = ++revision;
            timer = setTimeout(async () => {
                const current = JSON.stringify(project.value);
                if (!replaying && current !== previous) {
                    history.value.push(previous);
                    const limit = Math.max(1, Math.min(15, Math.floor(24000000 / current.length)));
                    history.value = history.value.slice(-limit);
                    future.value = [];
                }
                previous = current;
                replaying = false;
                try {
                    await storeDraft(snapshot());
                    if (currentRevision === revision) {
                        persistence.value = 'Сохранено в браузере';
                    }
                } catch {
                    persistence.value = 'Автосохранение недоступно';
                    notify('Не удалось сохранить черновик. Скачайте файл проекта.');
                }
            }, 450);
        },
        { deep: true },
    );

    onScopeDispose(() => {
        clearTimeout(timer);
        clearTimeout(noticeTimer);
        if (initialized.value) {
            void storeDraft(snapshot()).catch(() => undefined);
        }
    });

    async function initialize(template?: TemplateId): Promise<void> {
        try {
            const [draft, projects] = await Promise.all([loadDraft(), listSaved()]);
            if (draft) {
                project.value = draft;
            }
            saved.value = projects;
            persistence.value = 'Сохранено в браузере';
        } catch {
            persistence.value = 'Автосохранение недоступно';
        }
        if (template && project.value.template !== template) {
            project.value = createProject(template);
        }
        previous = JSON.stringify(project.value);
        initialized.value = true;
    }

    function chooseTemplate(template: TemplateId): void {
        project.value = createProject(template);
        mobilePanel.value = 'preview';
    }

    function chooseReference(id: number): void {
        project.value = createFromReference(id);
        referenceOpen.value = false;
        mobilePanel.value = 'preview';
        notify('Загружена основа семейства. Референс доступен рядом с предпросмотром.');
    }

    function undo(): void {
        if (!history.value.length) {
            return;
        }
        future.value.push(JSON.stringify(project.value));
        replaying = true;
        project.value = JSON.parse(history.value.pop()!);
    }

    function redo(): void {
        if (!future.value.length) {
            return;
        }
        history.value.push(JSON.stringify(project.value));
        replaying = true;
        project.value = JSON.parse(future.value.pop()!);
    }

    async function exportPng(): Promise<void> {
        busy.value = true;
        try {
            const canvas = document.createElement('canvas');
            await renderFrame(canvas, snapshot());
            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    (value) =>
                        value ? resolve(value) : reject(new Error('Не удалось создать PNG.')),
                    'image/png',
                );
            });
            downloadBlob(blob, `${projectFilename(project.value.name)}.png`);
            notify('PNG 1280 × 720 готов.');
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Ошибка экспорта.');
        } finally {
            busy.value = false;
        }
    }

    async function savePreset(): Promise<void> {
        try {
            const canvas = document.createElement('canvas');
            const value = snapshot();
            await renderFrame(canvas, value);
            const small = document.createElement('canvas');
            small.width = 320;
            small.height = 180;
            small.getContext('2d')!.drawImage(canvas, 0, 0, 320, 180);
            await saveNamed({
                id: crypto.randomUUID(),
                name: value.name,
                project: value,
                updatedAt: Date.now(),
                thumbnail: small.toDataURL('image/webp', 0.7),
            });
            saved.value = await listSaved();
            notify('Пресет сохранён в «Мои проекты».');
        } catch {
            notify('Не удалось сохранить пресет. Скачайте файл проекта.');
        }
    }

    async function removePreset(id: string): Promise<void> {
        try {
            await deleteNamed(id);
            saved.value = await listSaved();
        } catch {
            notify('Не удалось удалить пресет.');
        }
    }

    return {
        project,
        saved,
        notice,
        persistence,
        busy,
        initialized,
        guides,
        referenceOpen,
        libraryOpen,
        mobilePanel,
        initialize,
        chooseTemplate,
        chooseReference,
        undo,
        redo,
        canUndo: computed(() => history.value.length > 0),
        canRedo: computed(() => future.value.length > 0),
        notify,
        exportPng,
        savePreset,
        removePreset,
        randomize: () => randomizeAll(project.value),
        randomizeTicker: () => randomizeTicker(project.value),
        downloadProject: () => exportProject(snapshot()),
    };
}

export type Editor = ReturnType<typeof useEditor>;
export const editorKey: InjectionKey<Editor> = Symbol.for('confa24-editor');
