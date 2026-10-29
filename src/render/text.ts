import type { Project } from '../types/project';
import { customFontName } from '../services/assets';
import type { Rectangle } from './types';

export function fontFamily(project: Project, kind: 'serif' | 'sans'): string {
    const custom = project.appearance[`${kind}Font`];
    if (custom) {
        return `"${customFontName(custom, kind)}"`;
    }
    return kind === 'serif'
        ? 'Cambria, "Confa Serif", Georgia, serif'
        : 'Calibri, "Confa Sans", Arial, sans-serif';
}

export function displayFont(project: Project, size: number, plain = false): string {
    const kind = project.style === 'classic' ? 'serif' : 'sans';
    const style = plain ? 'normal 400' : 'italic 700';
    return `${style} ${size * project.text.scale}px ${fontFamily(project, kind)}`;
}

export function bodyFont(project: Project, size: number, bold = false): string {
    return `${bold ? 700 : 400} ${size * project.text.scale}px ${fontFamily(project, 'sans')}`;
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

interface TextOptions {
    font: (size: number) => string;
    size: number;
    color?: string;
    align?: CanvasTextAlign;
    shadow?: boolean;
    lineHeight?: number;
    overflow?: Project['text']['overflow'];
    verticalAlign?: 'top' | 'bottom';
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
    let lines = linesFor();
    const lineHeight = () => {
        const pixels = Number(ctx.font.match(/([\d.]+)px/)?.[1] ?? size);
        return pixels * (options.lineHeight ?? 1.12);
    };
    let height = lineHeight();
    if (options.overflow === 'shrink') {
        while (
            size > 8 &&
            (lines.some((line) => measure(line) > box.width) || lines.length * height > box.height)
        ) {
            size -= 0.5;
            ctx.font = options.font(size);
            height = lineHeight();
        }
    }
    lines = linesFor();
    ctx.fillStyle = options.color ?? '#ffffff';
    ctx.textBaseline = 'top';
    ctx.textAlign = options.align ?? 'left';
    if (options.shadow) {
        ctx.shadowColor = '#000000aa';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 3;
    }
    const x =
        options.align === 'center'
            ? box.x + box.width / 2
            : options.align === 'right'
              ? box.x + box.width
              : box.x;
    const y =
        options.verticalAlign === 'bottom' ? box.y + box.height - lines.length * height : box.y;
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * height));
    ctx.restore();
}
