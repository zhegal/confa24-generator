<template>
    <img
        v-if="original"
        :src="original"
        :alt="template.name"
        loading="lazy"
    />
    <canvas
        v-else
        ref="canvas"
        width="320"
        height="180"
        role="img"
        :aria-label="template.name"
    />
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref, watch } from 'vue';
    import { archive, assetRevision } from '../../services/localArchive';
    import { createProject } from '../../data/defaults';
    import { renderFrame } from '../../render';
    import type { TemplateDefinition } from '../../types/project';

    const props = defineProps<{ template: TemplateDefinition }>();
    const canvas = ref<HTMLCanvasElement>();
    const original = computed(() => archive.value.get(props.template.reference));
    let disposed = false;
    watch(
        [canvas, assetRevision],
        async () => {
            if (!canvas.value || original.value) {
                return;
            }
            const target = canvas.value;
            const frame = document.createElement('canvas');
            try {
                await renderFrame(frame, createProject(props.template.id));
                if (!disposed) {
                    target.getContext('2d')?.drawImage(frame, 0, 0, 320, 180);
                }
            } catch {
                target.getContext('2d')?.clearRect(0, 0, 320, 180);
            }
        },
        { immediate: true },
    );
    onBeforeUnmount(() => (disposed = true));
</script>
