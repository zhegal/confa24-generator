import type { ImageSettings, Tone } from '../types/project';
import type { Rectangle, RenderContext } from './types';

export const toneColors: Record<Tone, { background: string; text: string }> = {
    dark: { background: '#142128', text: '#ffffff' },
    light: { background: '#f5f5f5', text: '#000000' },
    urgent: { background: '#dee017', text: '#000000' },
    burgundy: { background: '#482120', text: '#ffffff' },
};

export function rect(
    ctx: CanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    width: number,
    height: number,
): void {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

export function drawImage(
    render: RenderContext,
    settings: ImageSettings,
    box: Rectangle,
    circle = false,
): void {
    const image = render.images.get(settings.src);
    if (!image) {
        return;
    }
    const { ctx } = render;
    ctx.save();
    ctx.beginPath();
    if (circle) {
        ctx.ellipse(
            box.x + box.width / 2,
            box.y + box.height / 2,
            box.width / 2,
            box.height / 2,
            0,
            0,
            Math.PI * 2,
        );
    } else {
        ctx.rect(box.x, box.y, box.width, box.height);
    }
    ctx.clip();
    const scale =
        (settings.fit === 'cover' ? Math.max : Math.min)(
            box.width / image.width,
            box.height / image.height,
        ) * settings.zoom;
    const width = image.width * scale;
    const height = image.height * scale;
    const x = box.x + (box.width - width) / 2 + (settings.x / 100) * box.width;
    const y = box.y + (box.height - height) / 2 + (settings.y / 100) * box.height;
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

export function drawMark(render: RenderContext, x: number, y: number, size: number): void {
    const image = render.images.get('asset:mark');
    if (!image) {
        return;
    }
    const { ctx } = render;
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.drawImage(image, x, y, size, size);
    ctx.restore();
}
