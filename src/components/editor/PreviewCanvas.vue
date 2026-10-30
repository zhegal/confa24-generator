<template>
    <div class="canvas-container" :aria-busy="rendering">
        <canvas
            ref="canvas"
            :width="FRAME_WIDTH"
            :height="FRAME_HEIGHT"
            role="img"
            :aria-label="`Кадр: ${project.content.title || project.content.category}`"
        />
        <div
            v-if="error"
            class="canvas-error"
            role="alert"
        >
            <AlertCircle :size="24" />
            <p>
                {{ error }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, ref, watch } from 'vue';
    import { AlertCircle } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { assetRevision } from '../../services/localArchive';
    import { renderFrame, FRAME_WIDTH, FRAME_HEIGHT } from '../../render';
    import type { Project } from '../../types/project';

    const { project, guides } = useEditorContext();
    const canvas = ref<HTMLCanvasElement>();
    const error = ref('');
    const rendering = ref(false);
    let sequence = 0;
    let timer: ReturnType<typeof setTimeout>;

    watch(
        [project, guides, canvas, assetRevision],
        () => {
            clearTimeout(timer);
            const current = ++sequence;
            timer = setTimeout(async () => {
                if (!canvas.value) {
                    return;
                }
                rendering.value = true;
                try {
                    const frame = document.createElement('canvas');
                    const snapshot = JSON.parse(JSON.stringify(project.value)) as Project;
                    await renderFrame(frame, snapshot, guides.value);
                    if (current === sequence && canvas.value) {
                        const ctx = canvas.value.getContext('2d')!;
                        ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
                        ctx.drawImage(frame, 0, 0);
                        error.value = '';
                    }
                } catch (value) {
                    if (current === sequence) {
                        error.value = value instanceof Error ? value.message : 'Ошибка отрисовки.';
                    }
                } finally {
                    if (current === sequence) {
                        rendering.value = false;
                    }
                }
            }, 35);
        },
        { deep: true, immediate: true },
    );

    onBeforeUnmount(() => {
        sequence++;
        clearTimeout(timer);
    });
</script>
