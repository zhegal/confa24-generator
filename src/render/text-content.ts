import { drawImage, rect } from './primitives';
import { bodyFont, displayFont, drawText } from './text';
import type { RenderContext } from './types';

export function drawQuote(render: RenderContext): void {
    const { ctx, project } = render;
    rect(ctx, '#f5f5f5', 170, 125, 690, 280);
    drawText(
        ctx,
        project.content.author ? `${project.content.author}:` : '',
        {
            x: 190,
            y: 142,
            width: 650,
            height: 40,
        },
        {
            font: (size) => displayFont(project, size),
            size: 26,
            color: '#51427d',
            overflow: project.text.overflow,
        },
    );
    drawText(
        ctx,
        project.content.body,
        { x: 190, y: 190, width: 650, height: 200 },
        {
            font: (size) => bodyFont(project, size, true),
            size: 24,
            color: '#111111',
            overflow: project.text.overflow,
        },
    );
}

export function drawTable(render: RenderContext): void {
    const { ctx, project } = render;
    rect(ctx, '#a69d8060', 76, 186, 872, 174);
    drawImage(render, project.images[0]!, { x: 795, y: 200, width: 140, height: 140 });
    drawText(
        ctx,
        project.content.body,
        { x: 86, y: 201, width: 700, height: 150 },
        {
            font: (size) => bodyFont(project, size, true),
            size: 25,
            overflow: project.text.overflow,
            shadow: project.text.shadow,
        },
    );
}

export function drawChat(render: RenderContext): void {
    const { ctx, project } = render;
    rect(ctx, '#ffffff', 0, 0, 1024, 576);
    if (project.images[0]!.src) {
        drawImage(render, project.images[0]!, { x: 0, y: 0, width: 1024, height: 576 });
        return;
    }
    const rows = project.content.body.split('\n');
    let y = 30;
    for (let i = 0; i < rows.length && y < 444; i++) {
        const row = rows[i]!;
        const separator = row.indexOf(':');
        const author = separator >= 0 ? row.slice(0, separator) : 'Участник';
        const message = separator >= 0 ? row.slice(separator + 1).trim() : row;
        drawText(
            ctx,
            author,
            { x: 22, y, width: 112, height: 34 },
            {
                font: (size) => bodyFont(project, size),
                size: 13,
                color: '#3797ce',
            },
        );
        drawText(
            ctx,
            message,
            { x: 140, y, width: 740, height: 65 },
            {
                font: (size) => bodyFont(project, size),
                size: 14,
                color: '#111111',
                overflow: 'wrap',
            },
        );
        drawText(
            ctx,
            `21:${String(i + 10).padStart(2, '0')}`,
            {
                x: 938,
                y,
                width: 60,
                height: 24,
            },
            { font: (size) => bodyFont(project, size), size: 12, color: '#999999' },
        );
        y += 55;
        rect(ctx, '#f3f3f3', 22, y - 12, 976, 1);
    }
}

export function drawArticle(render: RenderContext): void {
    const { ctx, project } = render;
    if (project.images[0]!.src) {
        drawImage(render, project.images[0]!, { x: 120, y: 85, width: 784, height: 350 });
        return;
    }
    rect(ctx, '#ffffff', 120, 95, 784, 340);
    drawText(
        ctx,
        project.content.title,
        { x: 140, y: 120, width: 744, height: 50 },
        {
            font: (size) => bodyFont(project, size, true),
            size: 28,
            color: '#111111',
            overflow: project.text.overflow,
        },
    );
    rect(ctx, '#777777', 140, 176, 744, 1);
    drawText(
        ctx,
        project.content.body,
        { x: 140, y: 195, width: 744, height: 220 },
        {
            font: (size) => bodyFont(project, size),
            size: 21,
            color: '#111111',
            overflow: project.text.overflow,
        },
    );
}
