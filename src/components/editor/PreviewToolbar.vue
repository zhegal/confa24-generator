<template>
    <div class="preview-toolbar">
        <div class="preview-title">
            <span class="live-dot" />
            <span>
                Предпросмотр
            </span>
            <span class="preview-divider">
                /
            </span>
            <span class="preview-template-name">
                {{ currentTemplate.name }}
            </span>
        </div>
        <div class="preview-actions">
            <button
                class="icon-button"
                title="Отменить · Ctrl/⌘ Z"
                :disabled="!canUndo"
                @click="undo"
            >
                <Undo2 :size="16" />
                <span class="visually-hidden">
                    Отменить
                </span>
            </button>
            <button
                class="icon-button"
                title="Повторить · Ctrl/⌘ Shift Z"
                :disabled="!canRedo"
                @click="redo"
            >
                <Redo2 :size="16" />
                <span class="visually-hidden">
                    Повторить
                </span>
            </button>
            <span class="toolbar-rule" />
            <button
                :class="['icon-button', { 'is-on': project.ticker.enabled }]"
                :aria-pressed="project.ticker.enabled"
                title="Нижняя информпанель целиком"
                @click="project.ticker.enabled = !project.ticker.enabled"
            >
                <PanelBottom :size="17" />
                <span class="visually-hidden">
                    Нижняя информпанель
                </span>
            </button>
            <button
                :class="['icon-button', { 'is-on': guides }]"
                :aria-pressed="guides"
                title="Безопасная область"
                @click="guides = !guides"
            >
                <Scan :size="17" />
                <span class="visually-hidden">
                    Направляющие
                </span>
            </button>
            <button
                :class="['icon-button', { 'is-on': referenceVisible }]"
                :aria-pressed="referenceVisible"
                title="Сравнить с референсом"
                @click="$emit('toggleReference')"
            >
                <Columns2 :size="17" />
                <span class="visually-hidden">
                    Сравнить с референсом
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { Columns2, PanelBottom, Redo2, Scan, Undo2 } from '@lucide/vue';
    import { templates } from '../../data/templates';
    import { useEditorContext } from '../../composables/useEditorContext';

    defineProps<{ referenceVisible: boolean }>();
    defineEmits<{ toggleReference: [] }>();
    const { project, guides, canUndo, canRedo, undo, redo } = useEditorContext();
    const currentTemplate = computed(() =>
        templates.find((item) => {
            return item.id === project.value.template;
        })!,
    );
</script>
