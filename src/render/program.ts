import { displayFont, drawText } from './text';
import { drawImage } from './primitives';
import type { RenderContext } from './types';

export function drawProgram(render: RenderContext): void {
    const { ctx, project } = render;
    if (project.appearance.circle) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(227.5, 274.5, 148.5, 0, Math.PI * 2);
        ctx.fill();
    }
    drawImage(
        render,
        project.images[0]!,
        {
            x: 79,
            y: 126,
            width: 297,
            height: 297,
        },
        project.appearance.circle,
    );
    const lines = project.content.title.split('\n').length;
    drawText(
        ctx,
        project.content.title,
        {
            x: 448,
            y: lines > 1 ? 234 : 244,
            width: 445,
            height: 148,
        },
        {
            font: (size) => displayFont(project, size),
            size: 50,
            overflow: project.text.overflow,
            shadow: project.text.shadow,
        },
    );
}

export function drawIdent(render: RenderContext): void {
    const { ctx, project } = render;
    if (project.images[0]!.src) {
        drawImage(render, project.images[0]!, { x: 410, y: 184, width: 205, height: 205 });
    } else {
        const mark = render.images.get('asset:mark-inverse');
        if (mark) {
            ctx.drawImage(mark, 414, 190, 195, 195);
        }
    }
    if (project.content.body) {
        drawText(
            ctx,
            project.content.body,
            {
                x: 630,
                y: 225,
                width: 210,
                height: 130,
            },
            {
                font: (size) => displayFont(project, size, true),
                size: 12,
                overflow: project.text.overflow,
                color: '#b0b0b0',
            },
        );
    }
}

export function drawPromo(render: RenderContext): void {
    const { ctx, project } = render;
    const lines = project.content.title.split('\n');
    lines.slice(0, 2).forEach((line, index) => {
        ctx.save();
        ctx.font = `900 76px ${'Arial, sans-serif'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#a7801b';
        ctx.lineWidth = 9;
        const size = Math.min(76, (880 / Math.max(1, ctx.measureText(line).width)) * 76);
        ctx.font = `900 ${size}px Arial, sans-serif`;
        ctx.strokeText(line, 512, index === 0 ? 122 : 363);
        ctx.fillStyle = '#f8ce3f';
        ctx.fillText(line, 512, index === 0 ? 122 : 363);
        ctx.restore();
    });
    if (project.images[0]!.src) {
        drawImage(render, project.images[0]!, { x: 393, y: 230, width: 240, height: 110 });
    } else {
        const mark = render.images.get('asset:mark-inverse');
        if (mark) {
            ctx.drawImage(mark, 462, 238, 100, 100);
        }
    }
}
