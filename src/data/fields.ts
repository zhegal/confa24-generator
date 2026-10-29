import type { FieldDefinition } from '../types/fields';
import { options } from '../types/fields';

export const tones = options({
    dark: 'Тёмная',
    light: 'Светлая',
    urgent: 'Срочная · жёлтая',
    burgundy: 'Бордовая',
});

export const identityFields: FieldDefinition[] = [
    { path: 'broadcast.mark', label: 'Эмблема «К» слева', type: 'toggle' },
    { path: 'broadcast.channel', label: 'Логотип канала справа', type: 'toggle' },
    { path: 'broadcast.channelName', label: 'Название канала' },
    {
        path: 'broadcast.status',
        label: 'Статус эфира',
        type: 'select',
        options: options({
            live: 'Прямой эфир',
            announcements: 'Анонсы',
            age: '16+',
            custom: 'Свой текст',
            none: 'Без подписи',
        }),
    },
    { path: 'broadcast.category', label: 'Показывать рубрику', type: 'toggle' },
];

export const headlineFields: FieldDefinition[] = [
    { path: 'broadcast.headline', label: 'Главная плашка', type: 'toggle' },
    { path: 'broadcast.headlineText', label: 'Заголовок', type: 'textarea' },
    { path: 'broadcast.headlineTone', label: 'Стиль плашки', type: 'select', options: tones },
    { path: 'broadcast.description', label: 'Дополнительное описание', type: 'toggle' },
];

export const metricsFields: FieldDefinition[] = [
    { path: 'ticker.metrics', label: 'Полоса показателей', type: 'toggle' },
    { path: 'ticker.clock', label: 'Часы', type: 'toggle' },
    { path: 'ticker.time', label: 'Время', type: 'time' },
    { path: 'ticker.temperature', label: 'Температура', type: 'toggle' },
    { path: 'ticker.degrees', label: 'Градусы' },
    { path: 'ticker.mood', label: 'Состояние «В конфе»', type: 'toggle' },
    { path: 'ticker.moodText', label: 'Состояние' },
    {
        path: 'ticker.moodTone',
        label: 'Цвет состояния',
        type: 'select',
        options: options({ green: 'Зелёный', yellow: 'Жёлтый', red: 'Красный' }),
    },
    { path: 'ticker.stocks', label: 'Котировки', type: 'toggle' },
    { path: 'ticker.symbol', label: 'Название / тикер' },
    { path: 'ticker.value', label: 'Значение' },
    {
        path: 'ticker.trend',
        label: 'Динамика',
        type: 'select',
        options: options({ up: '▲ Рост', down: '▼ Падение', flat: '— Без изменений' }),
    },
    { path: 'ticker.traffic', label: 'Пробки', type: 'toggle' },
    { path: 'ticker.street', label: 'Первая улица' },
    { path: 'ticker.trafficValue', label: 'Пробки · первая улица', type: 'range', min: 0, max: 10 },
    { path: 'ticker.street2', label: 'Вторая улица' },
    {
        path: 'ticker.trafficValue2',
        label: 'Пробки · вторая улица',
        type: 'range',
        min: 0,
        max: 10,
    },
    { path: 'ticker.direction', label: 'Подпись баллов', hint: 'Например: в центр, из центра' },
    {
        path: 'ticker.metricsOffset',
        label: 'Позиция полосы, px',
        type: 'range',
        min: 0,
        max: 2000,
        step: 1,
        hint: 'Прокручивает показатели; часы остаются на месте.',
    },
];

export const newsFields: FieldDefinition[] = [
    { path: 'ticker.news', label: 'Новостная строка', type: 'toggle' },
    { path: 'ticker.newsText', label: 'Текст новости', type: 'textarea' },
    {
        path: 'ticker.newsTone',
        label: 'Стиль новости',
        type: 'select',
        options: options({ dark: 'Обычная', urgent: 'Молния · жёлтая' }),
    },
    {
        path: 'ticker.newsOffset',
        label: 'Видимая позиция, px',
        type: 'range',
        min: 0,
        max: 3000,
        step: 1,
        hint: 'Выберите, какой фрагмент строки попадёт в кадр.',
    },
];

export const appearanceFields: FieldDefinition[] = [
    {
        path: 'appearance.broadcastSafe',
        label: 'Телевизионная safe-зона',
        type: 'toggle',
        hint: 'EBU R95: графика внутри 5% от краёв. Выключите для исходной геометрии.',
    },
    {
        path: 'style',
        label: 'Оформление',
        type: 'select',
        options: options({
            classic: 'С засечками · классическое',
            modern: 'Без засечек · позднее',
        }),
    },
    { path: 'appearance.accent', label: 'Цвет акцента / дуги', type: 'color' },
    { path: 'appearance.background', label: 'Цвет фона', type: 'color' },
    { path: 'appearance.texture', label: 'Текстура серого фона', type: 'toggle' },
    {
        path: 'appearance.shade',
        label: 'Затемнение фона',
        type: 'range',
        min: 0,
        max: 0.8,
        step: 0.05,
    },
    {
        path: 'text.overflow',
        label: 'Если текст не помещается',
        type: 'select',
        options: options({
            shrink: 'Уменьшать шрифт',
            wrap: 'Переносить строки',
            clip: 'Обрезать',
        }),
    },
    {
        path: 'text.scale',
        label: 'Масштаб текста',
        type: 'range',
        min: 0.65,
        max: 1.5,
        step: 0.05,
    },
    { path: 'text.shadow', label: 'Тени у крупных надписей', type: 'toggle' },
];
