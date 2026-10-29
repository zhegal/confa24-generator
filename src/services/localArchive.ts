import { ref } from 'vue';
import { loadImage, setAssetOverrides } from './assets';

export const archive = ref(new Map<number, string>());
export const archiveLoading = ref(false);
export const assetRevision = ref(0);

const crops: [string, number, number[]][] = [
    ['avatar', 16, [79, 126, 297, 297]],
    ['evening', 37, [79, 126, 297, 297]],
    ['night', 63, [79, 126, 297, 297]],
    ['politics', 47, [79, 126, 297, 297]],
    ['anime', 62, [79, 126, 297, 297]],
    ['bor', 95, [79, 126, 297, 297]],
    ['show', 96, [79, 126, 297, 297]],
    ['olympic', 115, [79, 126, 297, 297]],
    ['photo', 38, [160, 105, 700, 339]],
    ['portrait', 86, [158, 72, 552, 370]],
    ['product', 29, [80, 74, 338, 339]],
    ['road', 119, [0, 108, 1024, 310]],
    ['night-road', 93, [0, 110, 1024, 334]],
    ['music', 108, [0, 105, 1024, 339]],
    ['sport', 69, [0, 100, 1024, 344]],
    ['theatre', 101, [0, 100, 1024, 250]],
];

export async function connectArchive(files: FileList | File[]): Promise<number> {
    archiveLoading.value = true;
    const urls = new Map<number, string>();
    try {
        for (const file of Array.from(files)) {
            const match = file.name.match(/^(\d+)\.(png|jpe?g|webp)$/i);
            const id = Number(match?.[1]);
            if (id >= 1 && id <= 139 && file.size < 16000000) {
                urls.set(id, URL.createObjectURL(file));
            }
        }
        if (!urls.size) {
            throw new Error('В папке не найдены изображения с именами 1.png … 139.png.');
        }
        const overrides = new Map<string, string>();
        for (const [name, id, box] of crops) {
            const url = urls.get(id);
            if (!url) {
                continue;
            }
            const image = await loadImage(url);
            const canvas = document.createElement('canvas');
            const [x, y, width, height] = box as [number, number, number, number];
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            if (width === 297 && height === 297) {
                ctx.beginPath();
                ctx.arc(148.5, 148.5, 148.5, 0, Math.PI * 2);
                ctx.clip();
            }
            const scaleX = image.width / 1024;
            const scaleY = image.height / 576;
            ctx.drawImage(
                image,
                x * scaleX,
                y * scaleY,
                width * scaleX,
                height * scaleY,
                0,
                0,
                width,
                height,
            );
            overrides.set(`asset:${name}`, canvas.toDataURL('image/png'));
        }
        archive.value.forEach((url) => URL.revokeObjectURL(url));
        archive.value = urls;
        setAssetOverrides(overrides);
        assetRevision.value++;
        return urls.size;
    } catch (error) {
        urls.forEach((url) => URL.revokeObjectURL(url));
        throw error;
    } finally {
        archiveLoading.value = false;
    }
}
