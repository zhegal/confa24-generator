import type { Project } from '../types/project';
import { customFontName } from '../services/assets';
import type { Rectangle } from './types';

export function fontFamily(project: Project, kind: 'serif' | 'sans'): string {
    const custom = project.appearance[`${kind}Font`];
    if (custom) {
        return `"${customFontName(custom, kind)}"`;
    }
    return kind === 'serif' ? '"Confa Serif", Georgia, serif' : '"Confa Sans", Arial, sans-serif';
}

export function displayFont(project: Project, size: number, plain = false): string {
    const kind = project.style === 'classic' ? 'serif' : 'sans';
    const style = plain ? 'normal 400' : 'italic 700';
    return `${style} ${size * project.text.scale}px ${fontFamily(project, kind)}`;
}

export function bodyFont(project: Project, size: number, bold = false): string {
    return `${bold ? 700 : 400} ${size * project.text.scale}px ${fontFamily(project, 'sans')}`;
}

export function sourceFont(
    project: Project,
    size: number,
    kind: 'serif' | 'sans',
    weight = 400,
    italic = false,
): string {
    return `${italic ? 'italic' : 'normal'} ${weight} ${size * project.text.scale}px ${fontFamily(project, kind)}`;
}

export function wrapLines(
    value: string,
    width: number,
    measure: (value: string) => number,
): string[] {
    const result: string[] = [];
    for (const paragraph of value.split('\n')) {
        if (!paragraph) {
            result.push('');
            continue;
        }
        let line = '';
        for (const word of paragraph.split(/\s+/)) {
            const next = line ? `${line} ${word}` : word;
            if (measure(next) <= width) {
                line = next;
                continue;
            }
            if (line) {
                result.push(line);
            }
            line = '';
            for (const letter of word) {
                if (line && measure(line + letter) > width) {
                    result.push(line);
                    line = '';
                }
                line += letter;
            }
        }
        result.push(line);
    }
    return result;
}

export interface TextOptions {
    font: (size: number) => string;
    size: number;
    color?: string;
    align?: CanvasTextAlign;
    shadow?: boolean | { color: string; blur: number; offsetX: number; offsetY: number };
    lineHeight?: number;
    overflow?: Project['text']['overflow'];
    verticalAlign?: 'top' | 'bottom';
    baseline?: number;
    tracking?: number;
}

export function drawText(
    ctx: CanvasRenderingContext2D,
    value: string,
    box: Rectangle,
    options: TextOptions,
): void {
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();
    let size = options.size;
    const measure = (text: string) => ctx.measureText(text).width;
    const linesFor = () =>
        options.overflow === 'wrap' ? wrapLines(value, box.width, measure) : value.split('\n');
    ctx.font = options.font(size);
    const setTracking = () => {
        const pixels = Number(ctx.font.match(/([\d.]+)px/)?.[1] ?? size);
        ctx.letterSpacing = `${((options.tracking ?? 0) / 1000) * pixels}px`;
    };
    setTracking();
    let lines = linesFor();
    const lineHeight = () => {
        const pixels = Number(ctx.font.match(/([\d.]+)px/)?.[1] ?? size);
        return pixels * (options.lineHeight ?? 1.12);
    };
    let height = lineHeight();
    const exceedsHeight = () => {
        if (options.baseline === undefined) return lines.length * height > box.height;
        const pixels = Number(ctx.font.match(/([\d.]+)px/)?.[1] ?? size);
        return lines.some((line, index) => {
            const metrics = ctx.measureText(line);
            const ascent = metrics.actualBoundingBoxAscent ?? pixels * 0.75;
            const descent = metrics.actualBoundingBoxDescent ?? pixels * 0.25;
            const baseline = options.baseline! + index * height;
            return baseline - ascent < box.y || baseline + descent > box.y + box.height;
        });
    };
    if (options.overflow === 'shrink') {
        while (size > 8 && (lines.some((line) => measure(line) > box.width) || exceedsHeight())) {
            size -= 0.5;
            ctx.font = options.font(size);
            setTracking();
            height = lineHeight();
        }
    }
    lines = linesFor();
    ctx.fillStyle = options.color ?? '#ffffff';
    ctx.textBaseline = options.baseline === undefined ? 'top' : 'alphabetic';
    ctx.textAlign = options.align ?? 'left';
    if (options.shadow) {
        const shadow =
            typeof options.shadow === 'object'
                ? options.shadow
                : { color: '#000000aa', blur: 3, offsetX: 2, offsetY: 3 };
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
    }
    const x =
        options.align === 'center'
            ? box.x + box.width / 2
            : options.align === 'right'
              ? box.x + box.width
              : box.x;
    const y =
        options.baseline !== undefined
            ? options.baseline
            : options.verticalAlign === 'bottom'
              ? box.y + box.height - lines.length * height
              : box.y;
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * height));
    ctx.restore();
}
