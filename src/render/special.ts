import { bodyFont, displayFont, drawText } from './text';
import { lowerPanelOffset } from './safe-area';
import { rect } from './primitives';
import type { RenderContext } from './types';

export function drawSpecial(render: RenderContext): void {
    const { ctx, project } = render;
    if (project.template === 'night') {
        drawText(
            ctx,
            project.content.title,
            { x: 360, y: 250, width: 550, height: 120 },
            {
                font: (size) => displayFont(project, size),
                size: 48,
                overflow: project.text.overflow,
                shadow: project.text.shadow,
            },
        );
    }
    if (project.template === 'music') {
        drawText(
            ctx,
            project.content.lyrics,
            { x: 75, y: 110, width: 820, height: 378 + lowerPanelOffset(project) },
            {
                font: (size) => displayFont(project, size),
                size: 23,
                overflow: project.text.overflow === 'clip' ? 'clip' : 'wrap',
                verticalAlign: 'bottom',
                shadow: true,
            },
        );
    }
    if (project.template === 'sport') {
        rect(ctx, '#272734dd', 225, 42, 230, 28);
        drawText(
            ctx,
            project.content.score,
            { x: 235, y: 46, width: 210, height: 24 },
            {
                font: (size) => bodyFont(project, size, true),
                size: 21,
                overflow: 'shrink',
            },
        );
    }
    if (project.template === 'traffic') {
        ctx.save();
        ctx.translate(0, lowerPanelOffset(project));
        rect(ctx, '#000000a0', 62, 410, 900, 81);
        drawText(
            ctx,
            project.content.street,
            { x: 82, y: 433, width: 650, height: 45 },
            {
                font: (size) => bodyFont(project, size),
                size: 36,
                overflow: project.text.overflow,
            },
        );
        [project.content.inward, project.content.outward].forEach((value, index) => {
            drawText(
                ctx,
                value,
                { x: 725 + index * 120, y: 412, width: 90, height: 50 },
                {
                    font: (size) => bodyFont(project, size, true),
                    size: 48,
                    color: '#00dd08',
                    align: 'center',
                    overflow: 'shrink',
                },
            );
            drawText(
                ctx,
                index ? 'из центра' : 'в центр',
                {
                    x: 715 + index * 120,
                    y: 463,
                    width: 110,
                    height: 26,
                },
                {
                    font: (size) => bodyFont(project, size),
                    size: 22,
                    align: 'center',
                },
            );
        });
        ctx.restore();
    }
}
