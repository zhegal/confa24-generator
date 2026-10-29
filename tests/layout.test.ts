import { describe, expect, it } from 'vitest';
import { wrapLines } from '../src/render/text';
import { normalizeBase } from '../vite.config';

describe('text overflow', () => {
    const measure = (text: string) => text.length;

    it('preserves explicit line breaks and empty paragraphs', () => {
        expect(wrapLines('Первый\n\nВторой', 20, measure)).toEqual(['Первый', '', 'Второй']);
    });

    it('wraps a long unbroken word without losing characters', () => {
        const text = 'СВЕРХСРОЧНОЕСООБЩЕНИЕ';
        const lines = wrapLines(text, 5, measure);
        expect(lines.every((line) => line.length <= 5)).toBe(true);
        expect(lines.join('')).toBe(text);
    });

    it('wraps at word boundaries', () => {
        expect(wrapLines('Сегодня в эфире', 10, measure)).toEqual(['Сегодня в', 'эфире']);
    });
});

describe('GitHub Pages paths', () => {
    it('supports root, repository paths and user-defined nested paths', () => {
        expect(normalizeBase('/')).toBe('/');
        expect(normalizeBase('confa24-generator')).toBe('/confa24-generator/');
        expect(normalizeBase('/tools/confa/')).toBe('/tools/confa/');
        expect(normalizeBase('')).toBe('/');
    });
});

describe('master information panel switch', () => {
    it('disables all panel drawing without clearing its contents', async () => {
        const { createProject } = await import('../src/data/defaults');
        const { drawTicker } = await import('../src/render/ticker');
        const project = createProject();
        const originalNews = project.ticker.newsText;
        project.ticker.enabled = false;
        const context = new Proxy(
            {},
            {
                get() {
                    throw new Error('Disabled information panel must not draw.');
                },
            },
        ) as CanvasRenderingContext2D;
        expect(() => drawTicker({ ctx: context, project, images: new Map() })).not.toThrow();
        expect(project.ticker.newsText).toBe(originalNews);
    });
});

describe('broadcast safe areas', () => {
    it('calculates EBU R95 graphic and action insets for a 720p frame', async () => {
        const { safeRectangle } = await import('../src/render/safe-area');
        expect(safeRectangle(1280, 720, 0.05)).toEqual({
            x: 64,
            y: 36,
            width: 1152,
            height: 648,
        });
        const action = safeRectangle(1280, 720, 0.035);
        expect(action.x).toBeCloseTo(44.8);
        expect(action.y).toBeCloseTo(25.2);
    });
});
