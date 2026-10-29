<template>
    <StudioModal title="Мои проекты" @close="libraryOpen = false">
        <div class="library-toolbar">
            <p class="field-hint">
                Пресеты хранятся в этом браузере. Для переноса используйте файл проекта.
            </p>
            <button class="button button-primary" @click="savePreset">
                <Plus :size="16" />
                Сохранить текущий
            </button>
        </div>
        <div v-if="!saved.length" class="empty-state library-empty">
            <FolderOpen :size="35" />
            <h3>
                Здесь будут ваши эфиры
            </h3>
            <p>
                Сохраните текущий кадр, чтобы вернуться к нему позже.
            </p>
        </div>
        <div v-else class="saved-project-grid">
            <article
                v-for="item in saved"
                :key="item.id"
                class="saved-project-card"
            >
                <button class="saved-project-open" @click="openProject(item.project)">
                    <img :src="item.thumbnail" :alt="item.name" />
                    <strong>
                        {{ item.name }}
                    </strong>
                    <span>
                        {{ formatDate(item.updatedAt) }}
                    </span>
                </button>
                <button
                    class="icon-button delete-preset"
                    :aria-label="`Удалить пресет ${item.name}`"
                    @click="removePreset(item.id)"
                >
                    <Trash2 :size="15" />
                </button>
            </article>
        </div>
    </StudioModal>
</template>

<script setup lang="ts">
    import { FolderOpen, Plus, Trash2 } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import type { Project } from '../../types/project';
    import StudioModal from './StudioModal.vue';

    const { project, saved, libraryOpen, savePreset, removePreset, notify } = useEditorContext();
    const formatDate = (value: number) =>
        new Intl.DateTimeFormat('ru', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        }).format(value);

    function openProject(value: Project): void {
        project.value = JSON.parse(JSON.stringify(value));
        libraryOpen.value = false;
        notify('Пресет открыт.');
    }
</script>
