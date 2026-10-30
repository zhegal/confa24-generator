import { describe, expect, it, vi } from 'vitest';
import { createProject } from '../src/data/defaults';
import { drawMark } from '../src/render/primitives';
import { parseProject } from '../src/services/files';
import type { Project } from '../src/types/project';

function renderMark(variant: Project['broadcast']['markVariant'], background: number[]) {
    const project = createProject();
    project.broadcast.markVariant = variant;
    let drawnFilter = '';
    const getImageData = vi.fn(() => ({ data: new Uint8ClampedArray(background) }));
    const context = {
        filter: 'none',
        save() {},
        restore() {},
        getTransform: () => ({ a: 1.25, d: 1.25, e: 0, f: 5 }),
        getImageData,
        drawImage(this: { filter: string }) {
            drawnFilter = this.filter;
        },
    } as unknown as CanvasRenderingContext2D;
    drawMark(
        { ctx: context, project, images: new Map([['asset:mark', {} as HTMLImageElement]]) },
        70,
        32,
        75,
    );
    return { drawnFilter, getImageData };
}

describe('broadcast emblem variants', () => {
    it('chooses white-on-black on a dark background and black-on-white on a light one', () => {
        expect(renderMark('auto', [12, 18, 30, 255]).drawnFilter).toBe('none');
        const light = renderMark('auto', [230, 240, 235, 255]);
        expect(light.drawnFilter).toBe('invert(1)');
        expect(light.getImageData).toHaveBeenCalledWith(88, 45, 94, 94);
    });

    it('honors a manual choice without reading the background', () => {
        const light = renderMark('light', [0, 0, 0, 255]);
        const dark = renderMark('dark', [255, 255, 255, 255]);
        expect(light.drawnFilter).toBe('invert(1)');
        expect(dark.drawnFilter).toBe('none');
        expect(light.getImageData).not.toHaveBeenCalled();
        expect(dark.getImageData).not.toHaveBeenCalled();
    });

    it('preserves a selected variant in portable projects and defaults old files to automatic', () => {
        const project = createProject();
        for (const variant of ['auto', 'light', 'dark'] as const) {
            project.broadcast.markVariant = variant;
            expect(parseProject(JSON.stringify(project)).broadcast.markVariant).toBe(variant);
        }
        const old = JSON.parse(JSON.stringify(project));
        delete old.broadcast.markVariant;
        expect(parseProject(JSON.stringify(old)).broadcast.markVariant).toBe('auto');
    });
});
