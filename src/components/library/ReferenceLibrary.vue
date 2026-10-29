<template>
    <StudioModal
        title="Архив референсов"
        wide
        @close="referenceOpen = false"
    >
        <ArchivePicker v-if="!selected" />
        <template v-if="selected">
            <button class="button button-small" @click="selected = null">
                <ArrowLeft :size="15" />
                Назад к архиву
            </button>
            <img
                class="reference-detail-image"
                :src="archive.get(selected)"
                :alt="`Референс ${selected}`"
            />
            <div class="reference-detail-footer">
                <div>
                    <h3>
                        Референс
                        {{ selected }}
                    </h3>
                    <p>
                        Загрузится редактируемая основа этого семейства. Оригинал останется доступен
                        для сравнения.
                    </p>
                </div>
                <button class="button button-primary" @click="chooseReference(selected)">
                    <PanelsTopLeft :size="16" />
                    Взять за основу
                </button>
            </div>
        </template>
        <template v-else>
            <div class="library-toolbar">
                <label class="search-input">
                    <Search :size="16" />
                    <input v-model="query" placeholder="Номер или название шаблона…" />
                </label>
                <span class="library-count">
                    {{ filtered.length }}
                    / 139 кадров
                </span>
            </div>
            <div class="reference-grid">
                <button
                    v-for="id in filtered"
                    :key="id"
                    class="reference-card"
                    @click="selected = id"
                >
                    <img
                        :src="archive.get(id)"
                        :alt="`Открыть референс ${id}`"
                        loading="lazy"
                    />
                    <span>
                        <b>
                            {{ String(id).padStart(3, '0') }}
                        </b>
                        {{ nameFor(id) }}
                    </span>
                </button>
            </div>
            <div v-if="!filtered.length" class="empty-state">
                {{ archive.size ? 'Ничего не найдено' : 'Подключите папку с оригиналами' }}
            </div>
        </template>
    </StudioModal>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { ArrowLeft, PanelsTopLeft, Search } from '@lucide/vue';
    import { useEditorContext } from '../../composables/useEditorContext';
    import { archive } from '../../services/localArchive';
    import ArchivePicker from './ArchivePicker.vue';
    import { referenceTemplate } from '../../data/references';
    import { templates } from '../../data/templates';
    import StudioModal from './StudioModal.vue';

    const { referenceOpen, chooseReference } = useEditorContext();
    const selected = ref<number | null>(null);
    const query = ref('');
    const nameFor = (id: number) => {
        return templates.find((item) => item.id === referenceTemplate(id))!.name;
    };
    const filtered = computed(() =>
        [...archive.value.keys()]
            .sort((a, b) => a - b)
            .filter((id) => {
                return `${id} ${nameFor(id)}`.toLowerCase().includes(query.value.toLowerCase());
            }),
    );
</script>
