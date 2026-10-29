<template>
    <ControlSection title="Оформление">
        <FieldControl
            v-for="field in appearanceFields"
            :key="field.path"
            :field="field"
        />
    </ControlSection>
    <ControlSection title="Свои шрифты" :open="false">
        <p class="field-hint">
            Можно заменить шрифты, сохранив весь макет. Файлы войдут в сохранённый проект.
        </p>
        <label
            v-for="font in fontKinds"
            :key="font.kind"
            class="font-upload"
        >
            <Type :size="17" />
            <span>
                {{ font.label }}
                <small>
                    {{
                        project.appearance[font.key]
                            ? 'Свой файл загружен'
                            : 'Системный + резервный'
                    }}
                </small>
            </span>
            <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                class="visually-hidden"
                :aria-label="font.label"
                @change="uploadFont($event, font.kind)"
            />
        </label>
        <button class="button button-small" @click="resetFonts">
            <RotateCcw :size="14" />
            Вернуть исходные шрифты
        </button>
    </ControlSection>
</template>

<script setup lang="ts">
    import { RotateCcw, Type } from '@lucide/vue';
    import { appearanceFields } from '../../data/fields';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { readFile } from '../../services/files';
    import { customFontName } from '../../services/assets';
    import ControlSection from '../controls/ControlSection.vue';
    import FieldControl from '../controls/FieldControl.vue';

    const { project, notify } = useEditorContext();
    const fontKinds = [
        { kind: 'serif', key: 'serifFont', label: 'Заголовки с засечками' },
        { kind: 'sans', key: 'sansFont', label: 'Шрифт без засечек' },
    ] as const;

    async function uploadFont(event: Event, kind: 'serif' | 'sans'): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) {
            return;
        }
        try {
            if (!/\.(ttf|otf|woff2?)$/i.test(file.name)) {
                throw new Error('Выберите TTF, OTF, WOFF или WOFF2.');
            }
            const source = await readFile(file, 5000000);
            const face = new FontFace(customFontName(source, kind), `url(${source})`);
            await face.load();
            project.value.appearance[`${kind}Font`] = source;
            notify('Шрифт загружен.');
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Не удалось загрузить шрифт.');
        }
    }

    function resetFonts(): void {
        project.value.appearance.serifFont = '';
        project.value.appearance.sansFont = '';
    }
</script>
