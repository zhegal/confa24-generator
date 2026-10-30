import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { createProject } from '../src/data/defaults';
import { templates } from '../src/data/templates';
import { requiredAssetSources, imageUrl } from '../src/services/assets';
import { parseProject } from '../src/services/files';
import { drawText } from '../src/render/text';

// Exercise every loading branch; a missing plate otherwise aborts PNG export.
describe('PSD integration', () => {
    it('resolves every required source for all layouts and panel modes', () => {
        for (const template of templates) {
            for (const style of ['classic', 'modern'] as const) {
                for (const mode of ['standard', 'social', 'sms', 'none'] as const) {
                    const project = createProject(template.id);
                    project.style = style;
                    project.appearance.originalBackground = false;
                    project.broadcast.speaker = mode === 'social';
                    project.broadcast.headline = true;
                    project.broadcast.description = mode === 'sms';
                    project.ticker.mode = mode;
                    project.ticker.newsTone = mode === 'standard' ? 'urgent' : 'dark';
                    for (const source of requiredAssetSources(project)) {
                        expect(
                            existsSync(`public${imageUrl(source)}`),
                            `${template.id}/${style}/${mode}: ${source}`,
                        ).toBe(true);
                    }
                }
            }
        }
    });

    it('opens older files with the source background and preserves explicit safe-area settings', () => {
        const old = JSON.parse(JSON.stringify(createProject()));
        delete old.appearance.originalBackground;
        old.appearance.broadcastSafe = true;
        const loaded = parseProject(JSON.stringify(old));
        expect(loaded.appearance.originalBackground).toBe(true);
        expect(loaded.appearance.broadcastSafe).toBe(true);
        expect(createProject().appearance.broadcastSafe).toBe(false);
    });
});

describe('PSD baseline placement', () => {
    it('shrinks text to fit the actual glyph bounds while keeping the source baseline', () => {
        const calls: { text: string; y: number; size: number }[] = [];
        const ctx = {
            font: '',
            save() {},
            restore() {},
            beginPath() {},
            rect() {},
            clip() {},
            measureText(this: { font: string }, value: string) {
                const size = Number(this.font.match(/([\d.]+)px/)![1]);
                return {
                    width: value.length * size * 0.5,
                    actualBoundingBoxAscent: size * 0.75,
                    actualBoundingBoxDescent: size * 0.25,
                };
            },
            fillText(this: { font: string }, text: string, _x: number, y: number) {
                calls.push({ text, y, size: Number(this.font.match(/([\d.]+)px/)![1]) });
            },
        } as unknown as CanvasRenderingContext2D;
        drawText(
            ctx,
            'Первый\nВторой',
            { x: 70, y: 440, width: 880, height: 50 },
            {
                font: (size) => `700 ${size}px Arial`,
                size: 40,
                baseline: 457,
                overflow: 'shrink',
            },
        );
        expect(calls[0]!.y).toBe(457);
        expect(calls).toHaveLength(2);
        for (const call of calls) {
            expect(call.y - call.size * 0.75).toBeGreaterThanOrEqual(440);
            expect(call.y + call.size * 0.25).toBeLessThanOrEqual(490);
        }
    });
});
