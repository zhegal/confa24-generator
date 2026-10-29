<template>
    <label :class="['field', { 'field-toggle': field.type === 'toggle' }]">
        <span :id="`${fieldId}-label`" class="field-label">
            {{ field.label }}
            <output
                v-if="field.type === 'range'"
                class="field-value"
                aria-hidden="true"
            >
                {{ value }}
            </output>
        </span>
        <input
            v-if="field.type === 'toggle'"
            :aria-labelledby="`${fieldId}-label`"
            type="checkbox"
            class="switch"
            :checked="Boolean(value)"
            @change="update(($event.target as HTMLInputElement).checked)"
        />
        <textarea
            v-else-if="field.type === 'textarea'"
            :value="String(value)"
            :aria-labelledby="`${fieldId}-label`"
            rows="3"
            @input="update(($event.target as HTMLTextAreaElement).value)"
        />
        <select
            v-else-if="field.type === 'select'"
            :aria-labelledby="`${fieldId}-label`"
            :value="String(value)"
            @change="onInput"
        >
            <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
        <div v-else-if="field.type === 'color'" class="color-control">
            <input
                :aria-labelledby="`${fieldId}-label`"
                type="color"
                :value="String(value)"
                @input="onInput"
            />
            <span>
                {{ String(value).toUpperCase() }}
            </span>
        </div>
        <input
            v-else
            :aria-labelledby="`${fieldId}-label`"
            :type="field.type ?? 'text'"
            :value="value as string | number"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            @input="onInput"
        />
        <small v-if="field.hint" class="field-hint">
            {{ field.hint }}
        </small>
    </label>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import type { FieldDefinition } from '../../types/fields';

    const props = defineProps<{ field: FieldDefinition }>();
    const { project } = useEditorContext();
    const fieldId = computed(() => props.field.path.replace(/\./g, '-'));
    const value = computed(() => {
        return props.field.path.split('.').reduce<unknown>((object, key) => {
            return (object as Record<string, unknown>)[key];
        }, project.value);
    });

    function update(next: unknown): void {
        const keys = props.field.path.split('.');
        let object = project.value as unknown as Record<string, unknown>;
        for (const key of keys.slice(0, -1)) {
            object = object[key] as Record<string, unknown>;
        }
        object[keys.at(-1)!] =
            props.field.path === 'name' && !String(next).trim() ? 'Мой эфир' : next;
    }

    function onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        update(
            ['range', 'number'].includes(props.field.type ?? '')
                ? Number(input.value)
                : input.value,
        );
    }
</script>
