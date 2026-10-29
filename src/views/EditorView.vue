<template>
    <div :class="['studio', `mobile-${editor.mobilePanel.value}`]">
        <AppHeader />
        <div v-if="editor.initialized.value" class="studio-body">
            <TemplatePanel />
            <PreviewWorkspace />
            <InspectorPanel />
        </div>
        <div v-else class="studio-loading">
            <LoaderCircle :size="24" class="spin" />
            Восстанавливаем ваш эфир…
        </div>
        <MobileNavigation />
        <ReferenceLibrary v-if="editor.referenceOpen.value" />
        <ProjectLibrary v-if="editor.libraryOpen.value" />
        <Transition name="toast">
            <div
                v-if="editor.notice.value"
                class="toast-message"
                role="status"
            >
                <Info :size="17" />
                {{ editor.notice.value }}
                <button
                    class="icon-button"
                    aria-label="Закрыть уведомление"
                    @click="closeNotice"
                >
                    <X :size="15" />
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted, provide, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { Info, LoaderCircle, X } from '@lucide/vue';
    import { editorKey, useEditor } from '../composables/useEditor';
    import { templateIds, type TemplateId } from '../types/project';
    import AppHeader from '../components/editor/AppHeader.vue';
    import TemplatePanel from '../components/editor/TemplatePanel.vue';
    import PreviewWorkspace from '../components/editor/PreviewWorkspace.vue';
    import InspectorPanel from '../components/editor/InspectorPanel.vue';
    import MobileNavigation from '../components/editor/MobileNavigation.vue';
    import ReferenceLibrary from '../components/library/ReferenceLibrary.vue';
    import ProjectLibrary from '../components/library/ProjectLibrary.vue';

    const editor = useEditor();
    const route = useRoute();
    const router = useRouter();
    provide(editorKey, editor);

    onMounted(async () => {
        const id = String(route.params.template ?? '');
        const template = templateIds.includes(id as TemplateId) ? (id as TemplateId) : undefined;
        await editor.initialize(template);
        await router.replace(`/editor/${editor.project.value.template}`);
        window.addEventListener('keydown', onKeydown);
    });
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
    watch(
        () => route.params.template,
        (value) => {
            if (
                editor.initialized.value &&
                templateIds.includes(value as TemplateId) &&
                value !== editor.project.value.template
            ) {
                editor.chooseTemplate(value as TemplateId);
            }
        },
    );
    watch(
        () => editor.project.value.template,
        (value) => {
            if (editor.initialized.value && route.params.template !== value) {
                void router.replace(`/editor/${value}`);
            }
        },
    );

    function closeNotice(): void {
        editor.notice.value = '';
    }

    function onKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        if (target.closest('input, textarea, select, [contenteditable]')) {
            return;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
            event.preventDefault();
            if (event.shiftKey) {
                editor.redo();
            } else {
                editor.undo();
            }
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            editor.downloadProject();
        }
    }
</script>
