import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function files(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
    });
}

describe('asset boundary', () => {
    it('ships standalone graphics and no complete reference archive or thumbnails', () => {
        const paths = files('public');
        expect(paths.some((path) => /references|\d+\.(png|webp|jpg)$/.test(path))).toBe(false);
        const sources = files('src').filter((path) => /\.(vue|ts|css)$/.test(path));
        for (const path of sources) {
            expect(readFileSync(path, 'utf8'), path).not.toContain('public/references');
        }
    });
});
