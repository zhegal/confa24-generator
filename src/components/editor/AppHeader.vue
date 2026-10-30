<template>
    <header class="app-header">
        <a
            class="brand"
            href="#/editor/program"
            aria-label="Конфа 24 — главная"
        >
            <span class="brand-mark">
                <img :src="publicUrl('favicon.png')" alt="" />
            </span>
            <span class="brand-name">
                КОНФА
                <span>
                    24
                </span>
                <small>
                    SCREENSHOT STUDIO
                </small>
            </span>
        </a>
        <div class="header-divider" />
        <div class="project-name-control">
            <input
                v-model="project.name"
                aria-label="Название проекта"
                maxlength="100"
                @blur="normalizeName"
            />
            <span>
                <span class="saved-dot" />
                {{ persistence }}
            </span>
        </div>
        <div class="header-actions">
            <button
                class="button header-library"
                aria-label="Мои проекты"
                @click="libraryOpen = true"
            >
                <FolderOpen :size="16" />
                <span>
                    Мои проекты
                </span>
            </button>
            <button
                class="icon-button"
                title="Открыть файл проекта"
                @click="fileInput?.click()"
            >
                <Upload :size="17" />
                <span class="visually-hidden">
                    Открыть файл проекта
                </span>
            </button>
            <button
                class="icon-button"
                title="Скачать файл проекта"
                @click="downloadProject"
            >
                <Save :size="17" />
                <span class="visually-hidden">
                    Скачать файл проекта
                </span>
            </button>
            <button
                class="button button-primary export-button"
                :disabled="busy"
                @click="exportPng"
            >
                <Download :size="16" />
                <span>
                    {{ busy ? 'Экспорт…' : 'Скачать PNG' }}
                </span>
                <kbd>
                    1280 × 720
                </kbd>
            </button>
        </div>
        <input
            ref="fileInput"
            type="file"
            class="visually-hidden"
            accept=".json"
            aria-label="Импорт проекта"
            @change="importFile"
        />
    </header>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Download, FolderOpen, Save, Upload } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { publicUrl } from '../../services/assets';
    import { MAX_PROJECT_BYTES, parseProject } from '../../services/files';

    const { project, persistence, libraryOpen, busy, downloadProject, exportPng, notify } =
        useEditorContext();
    const fileInput = ref<HTMLInputElement>();

    function normalizeName(): void {
        project.value.name = project.value.name.trim() || 'Мой эфир';
    }

    async function importFile(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) {
            return;
        }
        try {
            if (file.size > MAX_PROJECT_BYTES) {
                throw new Error('Файл проекта слишком большой. Максимум — 128 МБ.');
            }
            project.value = parseProject(await file.text());
            notify('Проект открыт. Изображения и настройки восстановлены.');
        } catch {
            notify('Не удалось открыть проект. Проверьте формат и версию файла.');
        }
    }
</script>
