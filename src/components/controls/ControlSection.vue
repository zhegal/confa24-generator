<template>
    <details class="control-section" :open="open">
        <summary>
            <span>
                {{ title }}
            </span>
            <ChevronDown :size="14" />
        </summary>
        <div class="control-section-body">
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
    import { ChevronDown } from '@lucide/vue';

    withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: true });
</script>
