import type { Project } from '../types/project';

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
        document.fonts.load('italic 700 32px "Confa Serif"'),
        document.fonts.load('400 22px "Confa Sans"'),
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
    const sources = ['asset:mark'];
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
    sources.push(...project.images.map((item) => item.src).filter(Boolean));
    return [...new Set(sources)];
}

export async function projectImages(project: Project): Promise<Map<string, HTMLImageElement>> {
    const loaded = await Promise.all(
        requiredAssetSources(project).map(async (source) => {
            return [source, await loadImage(source)] as const;
        }),
    );
    return new Map(loaded);
}
