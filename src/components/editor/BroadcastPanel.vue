<template>
    <ControlSection title="Логотипы и рубрика">
        <FieldControl
            v-for="field in identityFields"
            :key="field.path"
            :field="field"
        />
        <FieldControl
            v-if="project.broadcast.status === 'custom'"
            :field="{ path: 'broadcast.statusText', label: 'Текст статуса' }"
        />
        <FieldControl
            :field="{
                path: 'broadcast.categoryTone',
                label: 'Стиль рубрики',
                type: 'select',
                options: tones,
            }"
        />
    </ControlSection>
    <ControlSection title="Главная плашка">
        <FieldControl
            v-for="field in headlineFields"
            :key="field.path"
            :field="field"
        />
        <FieldControl
            v-if="project.broadcast.description"
            :field="{
                path: 'broadcast.descriptionText',
                label: 'Описание',
                type: 'textarea',
            }"
        />
    </ControlSection>
    <ControlSection title="Нижняя информпанель">
        <FieldControl
            :field="{ path: 'ticker.enabled', label: 'Нижняя информпанель', type: 'toggle' }"
        />
        <FieldControl v-if="project.ticker.enabled" :field="modeField" />
        <template v-if="project.ticker.enabled && project.ticker.mode === 'social'">
            <FieldControl :field="{ path: 'ticker.social', label: 'Ссылка / текст' }" />
        </template>
        <template v-if="project.ticker.enabled && project.ticker.mode === 'sms'">
            <FieldControl :field="{ path: 'ticker.smsNumber', label: 'Номер SMS' }" />
            <FieldControl :field="{ path: 'ticker.smsText', label: 'Сообщение' }" />
        </template>
    </ControlSection>
    <template v-if="project.ticker.enabled && project.ticker.mode === 'standard'">
        <ControlSection title="Часы и показатели" :open="false">
            <button class="button button-small" @click="randomizeTicker">
                <Shuffle :size="14" />
                Заполнить случайно
            </button>
            <FieldControl
                v-for="field in positionedMetricsFields"
                :key="field.path"
                :field="field"
            />
        </ControlSection>
        <ControlSection title="Новостная строка" :open="false">
            <FieldControl
                v-for="field in positionedNewsFields"
                :key="field.path"
                :field="field"
            />
        </ControlSection>
    </template>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { bodyFont } from '../../render/text';
    import { Shuffle } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import {
        headlineFields,
        identityFields,
        metricsFields,
        newsFields,
        tones,
    } from '../../data/fields';
    import { options, type FieldDefinition } from '../../types/fields';
    import ControlSection from '../controls/ControlSection.vue';
    import FieldControl from '../controls/FieldControl.vue';

    const { project, randomizeTicker } = useEditorContext();
    const measure = document.createElement('canvas').getContext('2d')!;
    const positionedNewsFields = computed(() =>
        newsFields.map((field) => {
            if (field.path !== 'ticker.newsOffset') {
                return field;
            }
            measure.font = bodyFont(project.value, 21);
            const max = Math.min(
                200000,
                Math.ceil(measure.measureText(project.value.ticker.newsText).width),
            );
            return { ...field, max };
        }),
    );
    const positionedMetricsFields = computed(() =>
        metricsFields.map((field) => {
            if (field.path !== 'ticker.metricsOffset') {
                return field;
            }
            const ticker = project.value.ticker;
            measure.font = bodyFont(project.value, 22);
            const text = [
                ticker.degrees,
                ticker.symbol,
                ticker.value,
                ticker.street,
                ticker.street2,
                ticker.direction,
                ticker.moodText,
            ].join(' ');
            const max = Math.min(200000, Math.ceil(measure.measureText(text).width + 300));
            return { ...field, max };
        }),
    );
    const modeField: FieldDefinition = {
        path: 'ticker.mode',
        label: 'Режим',
        type: 'select',
        options: options({
            standard: 'Показатели + новости',
            social: 'Ссылка на соцсеть',
            sms: 'SMS-портал',
            none: 'Без нижнего блока',
        }),
    };
</script>
