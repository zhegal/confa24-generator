<template>
    <main class="preview-workspace">
        <PreviewToolbar
            :reference-visible="referenceVisible"
            @toggle-reference="referenceVisible = !referenceVisible"
        />
        <div class="workspace-stage">
            <div class="stage-topline">
                <span>
                    <Monitor :size="13" />
                    ПРОГРАММНЫЙ ВЫХОД
                </span>
                <span>
                    16:9
                    <span class="stage-dot">
                        ·
                    </span>
                    1280 × 720
                </span>
            </div>
            <div class="monitor-frame">
                <PreviewCanvas />
            </div>
            <div class="stage-caption">
                <span>
                    <span class="tiny-dot" />
                    Кадр обновляется автоматически
                </span>
                <button @click="referenceVisible = !referenceVisible">
                    {{ referenceVisible ? 'Скрыть референс' : 'Сравнить с оригиналом' }}
                    <ArrowUpRight :size="12" />
                </button>
            </div>
            <div v-if="referenceVisible" class="reference-comparison">
                <div class="stage-topline">
                    <span>
                        РЕФЕРЕНС
                        {{ project.reference }}
                    </span>
                    <span>
                        ОРИГИНАЛ · 1024 × 576
                    </span>
                </div>
                <img
                    v-if="archive.get(project.reference)"
                    :src="archive.get(project.reference)"
                    :alt="`Оригинальный референс ${project.reference}`"
                />
                <ArchivePicker v-else compact />
            </div>
            <div class="workspace-quick-actions">
                <button class="button" @click="randomize">
                    <Shuffle :size="15" />
                    Случайное наполнение
                </button>
                <button class="button button-quiet" @click="savePreset">
                    <BookmarkPlus :size="15" />
                    Сохранить пресет
                </button>
            </div>
            <p class="workspace-tip">
                <Sparkles :size="14" />
                Ваш эфир, ваши правила. Начните с шаблона и добавьте свои детали.
            </p>
        </div>
        <footer class="workspace-footer">
            <span>
                <ShieldCheck :size="13" />
                Всё остаётся в вашем браузере
            </span>
            <span>
                PNG
                <span>
                    ·
                </span>
                1280 × 720
                <span>
                    ·
                </span>
                без водяного знака
            </span>
        </footer>
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import {
        ArrowUpRight,
        BookmarkPlus,
        Monitor,
        ShieldCheck,
        Shuffle,
        Sparkles,
    } from '@lucide/vue';
    import { archive } from '../../services/localArchive';
    import ArchivePicker from '../library/ArchivePicker.vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import PreviewCanvas from './PreviewCanvas.vue';
    import PreviewToolbar from './PreviewToolbar.vue';

    const { project, randomize, savePreset } = useEditorContext();
    const referenceVisible = ref(false);
</script>
