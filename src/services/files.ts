import { projectSchema, type Project } from '../types/project';

export const MAX_PROJECT_BYTES = 128 * 1024 * 1024;

export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function projectFilename(name: string): string {
    return (
        name
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
            .trim()
            .slice(0, 80) || 'confa24'
    );
}

export function exportProject(project: Project): void {
    const json = JSON.stringify(project, null, 4);
    downloadBlob(
        new Blob([json], { type: 'application/json' }),
        `${projectFilename(project.name)}.confa24.json`,
    );
}

export function parseProject(value: string): Project {
    if (value.length > MAX_PROJECT_BYTES) {
        throw new Error('Файл проекта слишком большой. Максимум — 128 МБ.');
    }
    return projectSchema.parse(JSON.parse(value));
}

export async function readFile(file: File, maxSize: number): Promise<string> {
    if (file.size > maxSize) {
        throw new Error(`Файл слишком большой. Максимум — ${Math.round(maxSize / 1048576)} МБ.`);
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
        reader.readAsDataURL(file);
    });
}

export async function readImageFile(file: File): Promise<string> {
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
        throw new Error('Выберите PNG, JPEG, WebP или GIF.');
    }
    return readFile(file, 15000000);
}
