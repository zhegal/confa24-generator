<template>
    <nav class="mobile-navigation" aria-label="Разделы редактора">
        <button
            v-for="item in items"
            :key="item.id"
            :class="{ active: mobilePanel === item.id }"
            :aria-pressed="mobilePanel === item.id"
            @click="mobilePanel = item.id"
        >
            <component :is="item.icon" :size="18" />
            {{ item.label }}
        </button>
    </nav>
</template>

<script setup lang="ts">
    import { Monitor, PanelsTopLeft, SlidersHorizontal } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';

    const { mobilePanel } = useEditorContext();
    const items = [
        { id: 'templates', label: 'Шаблоны', icon: PanelsTopLeft },
        { id: 'preview', label: 'Предпросмотр', icon: Monitor },
        { id: 'settings', label: 'Настройки', icon: SlidersHorizontal },
    ] as const;
</script>
