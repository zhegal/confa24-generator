import type { RenderContext } from './types';

const cache = new Map<string, HTMLCanvasElement>();

export function drawBackplate(render: RenderContext, kind: 'program' | 'silver' | 'gold'): void {
    const { ctx, project, images } = render;
    const source = images.get(`asset:${kind}-background`);
    if (!source) {
        throw new Error('Не удалось загрузить фон шаблона.');
    }
    if (kind === 'gold') {
        ctx.drawImage(source, 0, 0, 1024, 576);
        return;
    }
    const { background, accent, arc } = project.appearance;
    const key = `${source.src.slice(-70)}:${kind}:${background}:${accent}:${arc}`;
    let plate = cache.get(key);
    if (!plate) {
        plate = document.createElement('canvas');
        plate.width = 1024;
        plate.height = 576;
        const target = plate.getContext('2d')!;
        target.drawImage(source, 0, 0, 1024, 576);
        const pixels = target.getImageData(0, 0, 1024, 576);
        const mask = kind === 'program' ? images.get('asset:psd/program-mask') : undefined;
        let maskPixels: Uint8ClampedArray | undefined;
        if (mask) {
            target.clearRect(0, 0, 1024, 576);
            target.drawImage(mask, 0, 0);
            maskPixels = target.getImageData(0, 0, 1024, 576).data;
        }
        const base = channels(background);
        const tint = channels(accent);
        for (let index = 0; index < pixels.data.length; index += 4) {
            const r = pixels.data[index]!;
            const g = pixels.data[index + 1]!;
            const b = pixels.data[index + 2]!;
            const band = kind === 'program' && maskPixels && maskPixels[index + 3]! < 128;
            if (band) {
                const factor = arc ? (r + g + b) / (166 * 3) : 1;
                const color = arc ? tint : base;
                color.forEach((value, channel) => (pixels.data[index + channel] = value * factor));
            } else if (kind === 'silver') {
                const factor = (r + g + b) / (166 * 3);
                base.forEach((value, channel) => (pixels.data[index + channel] = value * factor));
            } else if (r < 100 && g < 100 && b < 100) {
                const factor = (r + g + b) / (47 * 3);
                base.forEach((value, channel) => (pixels.data[index + channel] = value * factor));
            }
        }
        target.putImageData(pixels, 0, 0);
        if (cache.size >= 24) {
            cache.delete(cache.keys().next().value!);
        }
        cache.set(key, plate);
    }
    ctx.drawImage(plate, 0, 0);
}

function channels(hex: string): number[] {
    return [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));
}
