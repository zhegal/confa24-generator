<template>
    <div class="panel-intro">
        <span class="eyebrow">
            Локальная обработка
        </span>
        <p>
            Изображения остаются в вашем браузере. Прозрачность PNG сохраняется.
        </p>
    </div>
    <ImageSlot
        v-for="index in count"
        :key="`${project.template}-${index}`"
        :index="index - 1"
    />
    <div v-if="!count" class="empty-state">
        <ImageOff :size="28" />
        <p>
            В этом шаблоне нет изображений.
        </p>
        <small>
            Настройте текст и эфирные плашки в соседних вкладках.
        </small>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { ImageOff } from '@lucide/vue';
    import { templates } from '../../data/templates';
    import { useEditorContext } from '../../composables/useEditorContext';
    import ImageSlot from './ImageSlot.vue';

    const { project } = useEditorContext();
    const count = computed(
        () => templates.find((item) => item.id === project.value.template)!.images,
    );
</script>
