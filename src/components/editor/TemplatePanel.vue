<template>
    <aside class="template-panel" aria-label="Выбор шаблона">
        <div class="panel-heading">
            <div>
                <span class="eyebrow">
                    Основа вашего эфира
                </span>
                <h2>
                    Шаблоны
                    <span class="count-badge">
                        17
                    </span>
                </h2>
            </div>
            <PanelsTopLeft :size="18" />
        </div>
        <label class="search-input">
            <Search :size="15" />
            <input
                v-model="query"
                placeholder="Найти шаблон…"
                aria-label="Поиск шаблона"
            />
        </label>
        <div class="template-filters" aria-label="Группы шаблонов">
            <button
                v-for="item in templateGroups"
                :key="item"
                :class="{ active: group === item }"
                @click="group = item"
            >
                {{ item }}
            </button>
        </div>
        <div class="template-list">
            <button
                v-for="template in filtered"
                :key="template.id"
                :class="['template-card', { selected: project.template === template.id }]"
                :aria-pressed="project.template === template.id"
                @click="chooseTemplate(template.id)"
            >
                <div class="template-thumbnail">
                    <TemplateThumbnail :template="template" />
                    <span v-if="project.template === template.id" class="selected-indicator">
                        <Check :size="12" />
                    </span>
                </div>
                <span class="template-title">
                    {{ template.name }}
                </span>
                <span class="template-description">
                    {{ template.description }}
                </span>
            </button>
            <div v-if="!filtered.length" class="empty-state">
                Ничего не найдено
            </div>
        </div>
        <button class="reference-library-button" @click="referenceOpen = true">
            <Images :size="18" />
            <span>
                Все референсы
                <small>
                    Подключить локальный архив
                </small>
            </span>
            <ArrowUpRight :size="16" />
        </button>
    </aside>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { ArrowUpRight, Check, Images, PanelsTopLeft, Search } from '@lucide/vue';
    import { templates, templateGroups } from '../../data/templates';
    import TemplateThumbnail from './TemplateThumbnail.vue';
    import { useEditorContext } from '../../composables/useEditorContext';

    const { project, chooseTemplate, referenceOpen } = useEditorContext();
    const query = ref('');
    const group = ref('Все');
    const filtered = computed(() =>
        templates.filter((template) => {
            const matchesGroup = group.value === 'Все' || group.value === template.group;
            const matchesText = `${template.name} ${template.description}`
                .toLowerCase()
                .includes(query.value.toLowerCase());
            return matchesGroup && matchesText;
        }),
    );
</script>
