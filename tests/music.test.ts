import { describe, expect, it } from 'vitest';
import { createProject } from '../src/data/defaults';
import { drawSpecial } from '../src/render/special';

interface TextCall {
    text: string;
    y: number;
    font: string;
}

function renderLyrics(count: number): TextCall[] {
    const calls: TextCall[] = [];
    const project = createProject('music');
    project.content.lyrics = Array.from({ length: count }, (_, index) => `Строка ${index}`).join(
        '\n',
    );
    const context = {
        font: '',
        save() {},
        restore() {},
        beginPath() {},
        rect() {},
        clip() {},
        measureText(text: string) {
            return { width: text.length * 10 };
        },
        fillText(this: { font: string }, text: string, _x: number, y: number) {
            calls.push({ text, y, font: this.font });
        },
    } as unknown as CanvasRenderingContext2D;
    drawSpecial({ ctx: context, project, images: new Map() });
    return calls;
}

describe('music lyrics placement', () => {
    it('grows upward while preserving the font and last-line position', () => {
        const short = renderLyrics(3);
        const long = renderLyrics(12);
        expect(long[0]!.y).toBeLessThan(short[0]!.y);
        expect(long.at(-1)!.y).toBeCloseTo(short.at(-1)!.y);
        expect(new Set(long.map((call) => call.font))).toEqual(new Set([short[0]!.font]));
        expect(long[0]!.font).toContain('23px');
    });
});
