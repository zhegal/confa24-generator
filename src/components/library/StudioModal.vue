<template>
    <dialog
        :aria-label="title"
        ref="dialog"
        :class="['studio-modal', { 'studio-modal-wide': wide }]"
        @cancel="onCancel"
    >
        <div class="modal-shell">
            <header class="modal-header">
                <div>
                    <span class="eyebrow">
                        Конфа 24 · Studio
                    </span>
                    <h2>
                        {{ title }}
                    </h2>
                </div>
                <button
                    class="icon-button"
                    aria-label="Закрыть окно"
                    @click="$emit('close')"
                >
                    <X :size="21" />
                </button>
            </header>
            <div class="modal-content">
                <slot />
            </div>
        </div>
    </dialog>
</template>

<script setup lang="ts">
    import { onMounted, onBeforeUnmount, ref } from 'vue';
    import { X } from '@lucide/vue';

    defineProps<{ title: string; wide?: boolean }>();
    const emit = defineEmits<{ close: [] }>();
    const dialog = ref<HTMLDialogElement>();
    let previousFocus: HTMLElement | null = null;

    onMounted(() => {
        previousFocus = document.activeElement as HTMLElement | null;
        dialog.value?.showModal();
    });
    onBeforeUnmount(() => {
        dialog.value?.close();
        previousFocus?.focus();
    });

    function onCancel(event: Event): void {
        event.preventDefault();
        emit('close');
    }
</script>
