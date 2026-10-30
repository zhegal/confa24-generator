import { z } from 'zod';

export const templateIds = [
    'program',
    'photo',
    'material',
    'chat',
    'article',
    'event',
    'product',
    'bars',
    'ident',
    'quote',
    'table',
    'music',
    'sport',
    'traffic',
    'night',
    'promo',
    'collage',
] as const;

const text = z.string().max(12000);
const color = z.string().regex(/^#[0-9a-f]{6}$/i);
export const assetNames = [
    'mark',
    'mark-inverse',
    'avatar',
    'evening',
    'night',
    'politics',
    'anime',
    'bor',
    'show',
    'olympic',
    'gorodovoy',
    'program-background',
    'silver-background',
    'gold-background',
    'photo',
    'portrait',
    'product',
    'road',
    'night-road',
    'music',
    'sport',
    'theatre',
];

const imageSource = z
    .string()
    .max(24000000)
    .refine((value) => {
        return (
            !value ||
            (value.startsWith('asset:') && assetNames.includes(value.slice(6))) ||
            /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value)
        );
    }, 'Изображение должно быть локальным PNG, JPEG, WebP или GIF.');

export const imageSchema = z.object({
    src: imageSource,
    fit: z.enum(['cover', 'contain']),
    zoom: z.number().min(0.2).max(4),
    x: z.number().min(-100).max(100),
    y: z.number().min(-100).max(100),
});

const customFont = z
    .string()
    .max(8000000)
    .refine((value) => {
        return (
            !value ||
            /^data:(font\/[\w.-]+|application\/[\w.-]+|);base64,[a-z0-9+/=]+$/i.test(value)
        );
    }, 'Некорректный файл шрифта.');

export const projectSchema = z.object({
    version: z.literal(1),
    name: z.string().min(1).max(100),
    template: z.enum(templateIds),
    reference: z.number().int().min(1).max(139),
    style: z.enum(['classic', 'modern']),
    content: z.object({
        title: text,
        subtitle: text,
        body: text,
        category: text,
        author: text,
        role: text,
        venue: text,
        day: text,
        month: text,
        eventLabel: text,
        score: text,
        street: text,
        inward: text,
        outward: text,
        lyrics: text,
    }),
    appearance: z.object({
        broadcastSafe: z.boolean().default(false),
        originalBackground: z.boolean().default(true),
        accent: color,
        background: color,
        texture: z.boolean(),
        shade: z.number().min(0).max(0.8),
        circle: z.boolean(),
        arc: z.boolean(),
        serifFont: customFont,
        sansFont: customFont,
    }),
    images: z.array(imageSchema).length(4),
    broadcast: z.object({
        mark: z.boolean(),
        channel: z.boolean(),
        channelName: text,
        category: z.boolean(),
        categoryTone: z.enum(['dark', 'light', 'urgent', 'burgundy']),
        status: z.enum(['live', 'announcements', 'age', 'custom', 'none']),
        statusText: text,
        headline: z.boolean(),
        headlineText: text,
        headlineTone: z.enum(['dark', 'light', 'urgent', 'burgundy']),
        speaker: z.boolean().default(false),
        description: z.boolean(),
        descriptionText: text,
    }),
    ticker: z.object({
        enabled: z.boolean().default(true),
        mode: z.enum(['standard', 'social', 'sms', 'none']),
        metrics: z.boolean(),
        clock: z.boolean(),
        temperature: z.boolean(),
        mood: z.boolean(),
        stocks: z.boolean(),
        traffic: z.boolean(),
        news: z.boolean(),
        time: text,
        degrees: text,
        moodText: text,
        moodTone: z.enum(['green', 'yellow', 'red']),
        symbol: text,
        value: text,
        trend: z.enum(['up', 'down', 'flat']),
        street: text,
        trafficValue: z.number().int().min(0).max(10),
        street2: text,
        trafficValue2: z.number().int().min(0).max(10),
        direction: text,
        newsText: text,
        newsTone: z.enum(['dark', 'urgent']),
        newsOffset: z.number().min(0).max(200000),
        metricsOffset: z.number().min(0).max(200000),
        social: text,
        smsNumber: text,
        smsText: text,
    }),
    text: z.object({
        overflow: z.enum(['shrink', 'wrap', 'clip']),
        scale: z.number().min(0.65).max(1.5),
        shadow: z.boolean(),
    }),
});

export type Project = z.infer<typeof projectSchema>;
export type TemplateId = Project['template'];
export type ImageSettings = z.infer<typeof imageSchema>;
export type Tone = Project['broadcast']['headlineTone'];

export interface TemplateDefinition {
    id: TemplateId;
    name: string;
    description: string;
    group: string;
    reference: number;
    images: number;
}

export interface SavedProject {
    id: string;
    name: string;
    updatedAt: number;
    thumbnail: string;
    project: Project;
}
