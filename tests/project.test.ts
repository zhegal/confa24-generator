import { describe, expect, it } from 'vitest';
import { createProject } from '../src/data/defaults';
import { createFromReference, referenceTemplate } from '../src/data/references';
import { randomizeAll } from '../src/data/random';
import { templates } from '../src/data/templates';
import { parseProject, projectFilename } from '../src/services/files';
import { projectSchema } from '../src/types/project';

describe('portable projects', () => {
    it('creates valid presets for every supported composition', () => {
        for (const template of templates) {
            const project = createProject(template.id);
            expect(projectSchema.safeParse(project).success, template.id).toBe(true);
            expect(parseProject(JSON.stringify(project))).toEqual(project);
        }
    });

    it('covers all archive entries with valid editable presets', () => {
        for (let id = 1; id <= 139; id++) {
            const project = createFromReference(id);
            expect(templates.some((template) => template.id === referenceTemplate(id))).toBe(true);
            expect(projectSchema.safeParse(project).success, `reference ${id}`).toBe(true);
        }
    });

    it('round-trips image adjustments and a selected ticker position', () => {
        const project = createProject('photo');
        project.images[0] = {
            src: 'data:image/png;base64,aGVsbG8=',
            fit: 'contain',
            zoom: 2.25,
            x: -30,
            y: 25,
        };
        project.ticker.newsOffset = 417;
        project.text.overflow = 'wrap';
        expect(parseProject(JSON.stringify(project))).toEqual(project);
    });

    it('rejects external images, unknown assets and unsupported project versions', () => {
        const project = createProject();
        project.images[0]!.src = 'https://example.com/image.png';
        expect(() => parseProject(JSON.stringify(project))).toThrow();
        project.images[0]!.src = 'asset:unknown';
        expect(() => parseProject(JSON.stringify(project))).toThrow();
        const unsupported = { ...createProject(), version: 200 };
        expect(() => parseProject(JSON.stringify(unsupported))).toThrow();
    });

    it('rejects out-of-range crop and ticker values', () => {
        const project = createProject();
        project.images[0]!.zoom = 10;
        expect(projectSchema.safeParse(project).success).toBe(false);
        project.images[0]!.zoom = 1;
        project.ticker.trafficValue = -1;
        expect(projectSchema.safeParse(project).success).toBe(false);
    });

    it('keeps randomized states valid', () => {
        const project = createProject();
        for (let index = 0; index < 50; index++) {
            randomizeAll(project);
            expect(projectSchema.safeParse(project).success).toBe(true);
            expect(project.ticker.time).toMatch(/^\d{2}:\d{2}$/);
        }
    });

    it('produces safe download filenames', () => {
        expect(projectFilename('Эфир / 24:00?')).toBe('Эфир - 24-00-');
        expect(projectFilename('')).toBe('confa24');
    });
});

describe('standalone broadcast assets', () => {
    it('loads the generated backplates and inverse brand when required', async () => {
        const { requiredAssetSources } = await import('../src/services/assets');
        expect(requiredAssetSources(createProject('program'))).toContain(
            'asset:program-background',
        );
        expect(requiredAssetSources(createProject('material'))).toContain(
            'asset:silver-background',
        );
        expect(requiredAssetSources(createProject('promo'))).toContain('asset:gold-background');
        expect(requiredAssetSources(createProject('ident'))).toContain('asset:mark-inverse');
        expect(requiredAssetSources(createProject('night'))).toContain('asset:night-road');
    });
});
