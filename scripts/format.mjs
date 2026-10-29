import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { format, resolveConfig } from 'prettier';

async function files(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const groups = await Promise.all(
        entries.map((entry) => {
            const path = join(directory, entry.name);
            return entry.isDirectory() ? files(path) : [path];
        }),
    );
    return groups.flat();
}

const paths = [
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'vite.config.ts',
    'index.html',
    '.prettierrc.json',
];
for (const directory of ['src', 'tests', 'scripts', '.github/workflows']) {
    paths.push(...(await files(directory)));
}
for (const path of paths) {
    const source = await readFile(path, 'utf8');
    const configuration = await resolveConfig(path);
    const formatted = await format(source, { ...configuration, filepath: path });
    if (formatted !== source) {
        await writeFile(path, formatted);
    }
}
await import('./format-vue.mjs');
