import psd from '../data/psd.json';
import { drawText, sourceFont, type TextOptions } from './text';
import type { Rectangle, RenderContext } from './types';

export const PSD_WIDTH = psd.width;
export const PSD_HEIGHT = psd.height;
export type PsdAsset = keyof typeof psd.assets;
export type PsdText = keyof typeof psd.text;

export function applyPsdShadow(render: RenderContext, name: PsdText): void {
    const shadow = psd.text[name].shadow;
    if (!shadow || !render.project.text.shadow) return;
    Object.assign(render.ctx, {
        shadowColor: shadow.color,
        shadowBlur: shadow.blur,
        shadowOffsetX: shadow.offsetX,
        shadowOffsetY: shadow.offsetY,
    });
}

const tinted = new Map<string, HTMLCanvasElement>();

export function drawPsdAsset(
    render: RenderContext,
    name: PsdAsset,
    box: Rectangle = psd.assets[name],
    color?: string,
): void {
    const image = render.images.get(`asset:psd/${name}`);
    if (!image) throw new Error(`Не удалось загрузить слой PSD: ${name}.`);
    let source: CanvasImageSource = image;
    if (color) {
        const key = `${name}:${image.src}:${color}`;
        let canvas = tinted.get(key);
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(image, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (tinted.size >= 24) tinted.delete(tinted.keys().next().value!);
            tinted.set(key, canvas);
        }
        source = canvas;
    }
    render.ctx.drawImage(source, box.x, box.y, box.width, box.height);
}

interface SourceTextOptions extends Partial<TextOptions> {
    run?: number;
}

export function drawPsdText(
    render: RenderContext,
    name: PsdText,
    value: string,
    box: Rectangle,
    options: SourceTextOptions = {},
): void {
    const source = psd.text[name];
    const style = source.styles[options.run ?? 0]!;
    const { project, ctx } = render;
    drawText(ctx, value, box, {
        font: (size) =>
            sourceFont(
                project,
                size,
                style.font.includes('Slab') ? 'serif' : 'sans',
                style.weight,
                style.italic,
            ),
        size: style.size,
        baseline: source.baseline,
        tracking: style.tracking,
        color: `rgb(${style.color.map((v) => Math.round(v * 255)).join(' ')})`,
        overflow: project.text.overflow,
        ...options,
        shadow:
            options.shadow === undefined || options.shadow === true
                ? project.text.shadow && source.shadow
                    ? source.shadow
                    : false
                : options.shadow,
    });
}
