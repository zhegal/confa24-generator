import type { Project } from '../types/project';
import psd from '../data/psd.json';

const images = new Map<string, Promise<HTMLImageElement>>();
const fonts = new Map<string, Promise<void>>();
let overrides = new Map<string, string>();

export function setAssetOverrides(value: Map<string, string>): void {
    overrides = value;
}

export function embeddedAsset(source: string): string {
    return overrides.get(source) ?? source;
}

export function publicUrl(path: string): string {
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

export function imageUrl(source: string): string {
    if (overrides.has(source)) {
        return overrides.get(source)!;
    }
    if (!source.startsWith('asset:')) {
        return source;
    }
    const name = source.slice(6);
    if (name.startsWith('psd/')) {
        return publicUrl(`assets/${name}.png`);
    }
    const marks = [
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
    ];
    const extension = marks.includes(name) ? 'png' : 'webp';
    return publicUrl(`assets/${name}.${extension}`);
}

export function loadImage(source: string): Promise<HTMLImageElement> {
    const url = imageUrl(source);
    if (!images.has(url)) {
        images.set(
            url,
            new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = () => {
                    images.delete(url);
                    reject(new Error('Не удалось загрузить изображение.'));
                };
                image.src = url;
            }),
        );
    }
    return images.get(url)!;
}

export function customFontName(source: string, kind: string): string {
    let hash = 5381;
    for (let i = 0; i < source.length; i += 31) {
        hash = ((hash << 5) + hash) ^ source.charCodeAt(i);
    }
    return `ConfaCustom${kind}${hash >>> 0}`;
}

export async function prepareFonts(project: Project): Promise<void> {
    await Promise.all([
        document.fonts.load('400 32px "Confa Serif"'),
        document.fonts.load('700 32px "Confa Serif"'),
        document.fonts.load('italic 700 32px "Confa Serif"'),
        document.fonts.load('400 22px "Confa Sans"'),
        document.fonts.load('italic 400 22px "Confa Sans"'),
        document.fonts.load('italic 300 22px "Confa Sans"'),
        document.fonts.load('500 22px "Confa Sans"'),
        document.fonts.load('italic 500 22px "Confa Sans"'),
        document.fonts.load('700 22px "Confa Sans"'),
        document.fonts.load('italic 700 32px "Confa Sans"'),
    ]);
    for (const kind of ['serif', 'sans'] as const) {
        const source = project.appearance[`${kind}Font`];
        if (!source) {
            continue;
        }
        const key = `${kind}:${source}`;
        if (!fonts.has(key)) {
            fonts.set(
                key,
                (async () => {
                    const face = new FontFace(customFontName(source, kind), `url(${source})`);
                    const loaded = await face.load();
                    document.fonts.add(loaded);
                })(),
            );
        }
        await fonts.get(key);
    }
}

export function requiredAssetSources(project: Project): string[] {
    const sources = [
        'asset:mark',
        ...requiredPsdAssets(project).map((name) => `asset:psd/${name}`),
    ];
    if (['ident', 'promo'].includes(project.template)) {
        sources.push('asset:mark-inverse');
    }
    if (project.template === 'program') {
        sources.push('asset:program-background');
    } else if (project.template === 'promo') {
        sources.push('asset:gold-background');
    } else if (project.appearance.texture) {
        sources.push('asset:silver-background');
    }
    if (!project.appearance.originalBackground && project.appearance.texture) {
        sources.push('asset:silver-background');
    }
    sources.push(...project.images.map((item) => item.src).filter(Boolean));
    return [...new Set(sources)];
}

function requiredPsdAssets(project: Project): (keyof typeof psd.assets)[] {
    const { broadcast, ticker } = project;
    const sources: (keyof typeof psd.assets)[] = [];
    if (broadcast.channel) {
        sources.push('channel-wordmark');
        if (broadcast.status !== 'none') sources.push('live');
    }
    if (broadcast.category) sources.push('category');
    if (broadcast.speaker) sources.push('speaker');
    else if (broadcast.headline) sources.push(broadcast.description ? 'description' : 'headline');
    if (ticker.enabled && ticker.mode !== 'none') {
        sources.push('ticker-base');
        if (ticker.mode === 'social' || ticker.mode === 'sms') sources.push(ticker.mode);
        else {
            if (ticker.metrics) sources.push('metrics');
            if (ticker.news) sources.push(ticker.newsTone === 'urgent' ? 'urgent-news' : 'news');
        }
    }
    if (project.template === 'bars') sources.push('bars');
    else if (project.template === 'ident')
        sources.push(project.style === 'classic' ? 'ident-classic' : 'ident-modern');
    else if (project.template === 'event') sources.push('event');
    else if (project.template === 'quote') sources.push('quote');
    if (
        !['bars', 'photo', 'music', 'sport', 'traffic', 'night', 'chat', 'promo'].includes(
            project.template,
        )
    ) {
        sources.push('background-gray', 'background-mint');
        if (project.style === 'modern' && project.appearance.texture)
            sources.push('background-triangles');
        if (project.template === 'program') sources.push('program-mask');
    }
    return sources;
}

export async function projectImages(project: Project): Promise<Map<string, HTMLImageElement>> {
    const loaded = await Promise.all(
        requiredAssetSources(project).map(async (source) => {
            return [source, await loadImage(source)] as const;
        }),
    );
    return new Map(loaded);
}
