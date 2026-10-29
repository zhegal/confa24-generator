<template>
    <label class="field">
        <span class="field-label">
            Передача · готовое оформление
        </span>
        <select :value="current" @change="selectProgram">
            <option value="">
                Своя передача
            </option>
            <option
                v-for="program in programs"
                :key="program.id"
                :value="program.id"
            >
                {{ program.name }}
            </option>
        </select>
        <small class="field-hint">
            Оригинальные эмблемы сохранены вместе с их надписями и оформлением.
        </small>
    </label>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { programs } from '../../data/programs';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { emptyImage } from '../../data/defaults';

    const { project } = useEditorContext();
    const current = computed(
        () =>
            programs.find((program) => {
                return project.value.images[0]!.src === `asset:${program.id}`;
            })?.id ?? '',
    );

    function selectProgram(event: Event): void {
        const selected = programs.find((program) => {
            return program.id === (event.target as HTMLSelectElement).value;
        });
        if (!selected) {
            return;
        }
        project.value.content.title = selected.title;
        project.value.content.category = selected.name;
        project.value.appearance.accent = selected.accent;
        project.value.images[0] = emptyImage(`asset:${selected.id}`);
    }
</script>
