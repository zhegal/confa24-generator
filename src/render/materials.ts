import { lowerPanelOffset } from './safe-area';
import { drawImage, rect } from './primitives';
import { bodyFont, displayFont, drawText } from './text';
import type { RenderContext } from './types';

export function drawMaterial(render: RenderContext): void {
    drawImage(render, render.project.images[0]!, {
        x: 158,
        y: 72,
        width: 552,
        height: 370,
    });
}

export function drawCollage(render: RenderContext, event = false): void {
    const active = render.project.images.filter((image) => image.src);
    const area = { x: 80, y: 110, width: 864, height: event ? 235 : 300 };
    const count = active.length;
    active.forEach((image, index) => {
        const columns = count === 1 ? 1 : 2;
        const rows = count > 2 ? 2 : 1;
        const width = (area.width - 20 * (columns - 1)) / columns;
        const height = (area.height - 12 * (rows - 1)) / rows;
        drawImage(render, image, {
            x: area.x + (index % columns) * (width + 20),
            y: area.y + Math.floor(index / columns) * (height + 12),
            width,
            height,
        });
    });
}

export function drawEvent(render: RenderContext): void {
    const { ctx, project } = render;
    const { content } = project;
    drawCollage(render, true);
    ctx.save();
    ctx.translate(0, lowerPanelOffset(project));
    rect(ctx, '#353b3e', 62, 356, 117, 24);
    rect(ctx, '#ccc9d5', 62, 383, 117, 108);
    rect(ctx, '#51427d', 182, 383, 780, 24);
    rect(ctx, '#353b3e', 182, 410, 780, 81);
    drawText(
        ctx,
        content.eventLabel,
        { x: 68, y: 359, width: 106, height: 20 },
        {
            font: (size) => bodyFont(project, size),
            size: 17,
            overflow: 'shrink',
        },
    );
    drawText(
        ctx,
        content.day,
        { x: 64, y: 391, width: 113, height: 66 },
        {
            font: (size) => bodyFont(project, size, true),
            size: 64,
            color: '#000000',
            align: 'center',
            overflow: 'shrink',
        },
    );
    drawText(
        ctx,
        content.month,
        { x: 64, y: 459, width: 113, height: 30 },
        {
            font: (size) => bodyFont(project, size, true),
            size: 26,
            color: '#000000',
            align: 'center',
            overflow: 'shrink',
        },
    );
    drawText(
        ctx,
        content.venue,
        { x: 192, y: 387, width: 760, height: 21 },
        {
            font: (size) => bodyFont(project, size),
            size: 20,
            overflow: project.text.overflow,
        },
    );
    drawText(
        ctx,
        content.title,
        { x: 192, y: 413, width: 760, height: 34 },
        {
            font: (size) => displayFont(project, size),
            size: 32,
            overflow: project.text.overflow,
        },
    );
    drawText(
        ctx,
        content.body,
        { x: 192, y: 448, width: 760, height: 42 },
        {
            font: (size) => bodyFont(project, size),
            size: 20,
            overflow: project.text.overflow,
        },
    );
    ctx.restore();
}

export function drawProduct(render: RenderContext): void {
    const { ctx, project } = render;
    drawImage(render, project.images[0]!, { x: 80, y: 74, width: 338, height: 339 });
    drawImage(render, project.images[1]!, { x: 490, y: 100, width: 300, height: 240 });
    rect(ctx, '#e7f0ef', 395, 354, 567, 40);
    rect(ctx, '#a8d62b', 395, 394, 567, 8);
    rect(ctx, '#142128', 395, 402, 567, 82);
    drawText(
        ctx,
        project.content.title,
        { x: 405, y: 361, width: 547, height: 33 },
        {
            font: (size) => displayFont(project, size),
            size: 32,
            color: '#000000',
            overflow: project.text.overflow,
        },
    );
    drawText(
        ctx,
        project.content.body,
        { x: 405, y: 414, width: 547, height: 70 },
        {
            font: (size) => bodyFont(project, size),
            size: 32,
            overflow: project.text.overflow,
        },
    );
}
