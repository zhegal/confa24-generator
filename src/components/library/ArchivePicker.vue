<template>
    <div :class="['archive-picker', { compact }]">
        <div v-if="!compact" class="archive-picker-description">
            <FolderOpen :size="25" />
            <div>
                <h3>
                    Оригиналы — только у вас
                </h3>
                <p>
                    Подключите папку references с файлами 1.png … 139.png. Файлы читаются локально и
                    никуда не отправляются.
                </p>
            </div>
        </div>
        <div class="archive-picker-actions">
            <label class="button" :class="{ 'is-loading': archiveLoading }">
                <FolderOpen :size="15" />
                {{ archiveLoading ? 'Подключение…' : 'Подключить папку' }}
                <input
                    type="file"
                    webkitdirectory
                    multiple
                    class="visually-hidden"
                    aria-label="Подключить папку референсов"
                    :disabled="archiveLoading"
                    @change="onFiles"
                />
            </label>
            <label class="button button-quiet">
                <Images :size="15" />
                Выбрать файлы
                <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    class="visually-hidden"
                    aria-label="Подключить отдельные референсы"
                    :disabled="archiveLoading"
                    @change="onFiles"
                />
            </label>
        </div>
        <small v-if="archive.size">
            Подключено кадров:
            {{ archive.size }}
            . Папка доступна до закрытия страницы.
        </small>
    </div>
</template>

<script setup lang="ts">
    import { FolderOpen, Images } from '@lucide/vue';
    import { archive, archiveLoading, connectArchive } from '../../services/localArchive';
    import { useEditorContext } from '../../composables/useEditorContext';

    defineProps<{ compact?: boolean }>();
    const { notify } = useEditorContext();

    async function onFiles(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) {
            return;
        }
        try {
            const count = await connectArchive(input.files);
            notify(`Подключено ${count} референсов. Оригинальная графика доступна в шаблонах.`);
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Не удалось подключить архив.');
        } finally {
            input.value = '';
        }
    }
</script>
