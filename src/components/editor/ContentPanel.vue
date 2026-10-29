<template>
    <ControlSection title="Содержимое кадра">
        <FieldControl :field="{ path: 'name', label: 'Имя проекта' }" />
        <ProgramPicker v-if="project.template === 'program'" />
        <FieldControl
            v-for="field in fields"
            :key="field.path"
            :field="field"
        />
    </ControlSection>
    <ControlSection v-if="project.template === 'program'" title="Композиция">
        <FieldControl :field="{ path: 'appearance.circle', label: 'Белый круг', type: 'toggle' }" />
        <FieldControl :field="{ path: 'appearance.arc', label: 'Цветная дуга', type: 'toggle' }" />
    </ControlSection>
    <div class="panel-note">
        <Info :size="15" />
        <p>
            Изображения, эфирные плашки и оформление настраиваются в соседних вкладках.
        </p>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import ProgramPicker from './ProgramPicker.vue';
    import { Info } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import type { FieldDefinition } from '../../types/fields';
    import ControlSection from '../controls/ControlSection.vue';
    import FieldControl from '../controls/FieldControl.vue';

    const { project } = useEditorContext();
    const fields = computed<FieldDefinition[]>(() => {
        const template = project.value.template;
        const result: FieldDefinition[] = [];
        const add = (name: string, label: string, textarea = false) => {
            result.push({
                path: `content.${name}`,
                label,
                type: textarea ? 'textarea' : 'text',
            });
        };
        if (['program', 'night', 'promo', 'article', 'event', 'product'].includes(template)) {
            add('title', 'Название / заголовок', true);
        }
        add('category', 'Название рубрики');
        if (['quote', 'material', 'photo'].includes(template)) {
            if (template !== 'quote') {
                result.push({
                    path: 'broadcast.speaker',
                    label: 'Подпись собеседника',
                    type: 'toggle',
                });
            }
            add('author', 'Имя / автор');
            add('role', 'Роль / подпись');
        }
        if (['event', 'product', 'quote', 'table', 'chat', 'article', 'ident'].includes(template)) {
            add('body', template === 'chat' ? 'Сообщения · Автор: текст' : 'Основной текст', true);
        }
        if (template === 'event') {
            add('eventLabel', 'Подпись над датой');
            add('day', 'Число');
            add('month', 'Месяц');
            add('venue', 'Место / адрес');
        }
        if (template === 'music') {
            add('lyrics', 'Текст песни', true);
        }
        if (template === 'sport') {
            add('score', 'Счёт / команды');
        }
        if (template === 'traffic') {
            add('street', 'Название улицы');
            add('inward', 'В центр');
            add('outward', 'Из центра');
        }
        return result;
    });
</script>
