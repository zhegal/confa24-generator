<template>
    <aside class="inspector-panel" aria-label="Настройки кадра">
        <div class="panel-heading inspector-heading">
            <div>
                <span class="eyebrow">
                    Редактор
                </span>
                <h2>
                    Настройки кадра
                </h2>
            </div>
            <SlidersHorizontal :size="18" />
        </div>
        <div
            class="inspector-tabs"
            role="tablist"
            aria-label="Раздел настроек"
        >
            <button
                v-for="tab in tabs"
                :id="`tab-${tab.id}`"
                :key="tab.id"
                :class="{ active: activeTab === tab.id }"
                :aria-selected="activeTab === tab.id"
                :aria-controls="`panel-${tab.id}`"
                role="tab"
                @click="activeTab = tab.id"
            >
                <component :is="tab.icon" :size="16" />
                <span>
                    {{ tab.label }}
                </span>
            </button>
        </div>
        <div
            :id="`panel-${activeTab}`"
            class="inspector-body"
            role="tabpanel"
            :aria-labelledby="`tab-${activeTab}`"
        >
            <ContentPanel v-if="activeTab === 'content'" />
            <ImagesPanel v-if="activeTab === 'images'" />
            <BroadcastPanel v-if="activeTab === 'broadcast'" />
            <AppearancePanel v-if="activeTab === 'appearance'" />
        </div>
    </aside>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Image, Palette, Radio, SlidersHorizontal, Type } from '@lucide/vue';
    import ContentPanel from './ContentPanel.vue';
    import ImagesPanel from './ImagesPanel.vue';
    import BroadcastPanel from './BroadcastPanel.vue';
    import AppearancePanel from './AppearancePanel.vue';

    const activeTab = ref('content');
    const tabs = [
        { id: 'content', label: 'Текст', icon: Type },
        { id: 'images', label: 'Фото', icon: Image },
        { id: 'broadcast', label: 'Эфир', icon: Radio },
        { id: 'appearance', label: 'Стиль', icon: Palette },
    ];
</script>
