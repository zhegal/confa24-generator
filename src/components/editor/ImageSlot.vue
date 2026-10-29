<template>
    <ControlSection :title="`Изображение ${index + 1}`" :open="index === 0">
        <label
            class="upload-zone"
            @dragover.prevent
            @drop.prevent="onDrop"
        >
            <img
                v-if="image.src"
                :src="imageUrl(image.src)"
                alt="Загруженное изображение"
            />
            <div class="upload-zone-label">
                <Upload :size="18" />
                <span>
                    {{ image.src ? 'Заменить изображение' : 'Загрузить или перетащить' }}
                </span>
                <small>
                    PNG, JPG, WebP, GIF · до 15 МБ
                </small>
            </div>
            <input
                type="file"
                class="visually-hidden"
                accept="image/png,image/jpeg,image/webp,image/gif"
                :aria-label="`Загрузить изображение ${index + 1}`"
                @change="onFile"
            />
        </label>
        <div class="image-actions">
            <button
                class="button button-small"
                :disabled="!image.src"
                @click="reset"
            >
                <RotateCcw :size="13" />
                Кадрирование
            </button>
            <button
                class="icon-button"
                aria-label="Удалить изображение"
                @click="image.src = ''"
            >
                <Trash2 :size="15" />
            </button>
        </div>
        <label class="field">
            <span class="field-label">
                Из коллекции
            </span>
            <select :value="image.src.startsWith('asset:') ? image.src : ''" @change="chooseAsset">
                <option value="">
                    Выбрать материал…
                </option>
                <option
                    v-for="asset in assets"
                    :key="asset.id"
                    :value="`asset:${asset.id}`"
                >
                    {{ asset.name }}
                </option>
            </select>
        </label>
        <template v-if="image.src">
            <FieldControl :field="fitField" />
            <FieldControl
                v-for="field in cropFields"
                :key="field.path"
                :field="field"
            />
        </template>
    </ControlSection>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { RotateCcw, Trash2, Upload } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { imageUrl, loadImage } from '../../services/assets';
    import { readImageFile } from '../../services/files';
    import { emptyImage } from '../../data/defaults';
    import { options, type FieldDefinition } from '../../types/fields';
    import ControlSection from '../controls/ControlSection.vue';
    import FieldControl from '../controls/FieldControl.vue';

    const props = defineProps<{ index: number }>();
    const { project, notify } = useEditorContext();
    const image = computed(() => project.value.images[props.index]!);
    const assets = [
        { id: 'avatar', name: 'Конфа-Информбюро' },
        { id: 'gorodovoy', name: 'Городовой' },
        { id: 'evening', name: 'Вечерняя конфа' },
        { id: 'night', name: 'Ночная конфа' },
        { id: 'politics', name: 'Минутки политики' },
        { id: 'anime', name: 'Аниме' },
        { id: 'bor', name: 'БОР-ТВ' },
        { id: 'show', name: 'Программа «ГОВНО»' },
        { id: 'olympic', name: 'Фаполимпиада' },
        { id: 'photo', name: 'Новостной кадр' },
        { id: 'portrait', name: 'Портрет' },
        { id: 'product', name: 'Передатчик' },
        { id: 'road', name: 'Городская улица' },
        { id: 'night-road', name: 'Ночная дорога' },
        { id: 'music', name: 'Музыкальный эфир' },
        { id: 'sport', name: 'Футбол' },
        { id: 'theatre', name: 'Театр' },
    ];
    const fitField = computed<FieldDefinition>(() => ({
        path: `images.${props.index}.fit`,
        label: 'Размещение',
        type: 'select',
        options: options({ cover: 'Заполнить область', contain: 'Вписать целиком' }),
    }));
    const cropFields = computed<FieldDefinition[]>(() => [
        {
            path: `images.${props.index}.zoom`,
            label: 'Масштаб',
            type: 'range',
            min: 0.2,
            max: 4,
            step: 0.05,
        },
        {
            path: `images.${props.index}.x`,
            label: 'По горизонтали',
            type: 'range',
            min: -100,
            max: 100,
            step: 1,
        },
        {
            path: `images.${props.index}.y`,
            label: 'По вертикали',
            type: 'range',
            min: -100,
            max: 100,
            step: 1,
        },
    ]);

    async function upload(file?: File): Promise<void> {
        if (!file) {
            return;
        }
        try {
            const src = await readImageFile(file);
            await loadImage(src);
            project.value.images[props.index] = emptyImage(src);
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Ошибка загрузки.');
        }
    }

    function onFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        void upload(input.files?.[0]);
        input.value = '';
    }

    function onDrop(event: DragEvent): void {
        void upload(event.dataTransfer?.files[0]);
    }

    function reset(): void {
        project.value.images[props.index] = emptyImage(image.value.src);
    }

    function chooseAsset(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value) {
            project.value.images[props.index] = emptyImage(value);
        }
    }
</script>
