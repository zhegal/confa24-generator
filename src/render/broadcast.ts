import { bodyFont, displayFont, drawText } from './text';
import { drawMark, rect, toneColors } from './primitives';
import { drawChannelStatus } from './channel-status';
import type { RenderContext } from './types';

export function drawIdentity(render: RenderContext): void {
    const { ctx, project } = render;
    const { broadcast } = project;
    if (broadcast.mark) {
        drawMark(render, 61, 25, 76);
    }
    if (broadcast.category) {
        const tone = toneColors[broadcast.categoryTone];
        rect(ctx, tone.background, 159, 29, 340, 38);
        drawText(
            ctx,
            project.content.category,
            { x: 170, y: 34, width: 320, height: 32 },
            {
                font: (size) => displayFont(project, size),
                size: 32,
                color: tone.text,
                overflow: project.text.overflow,
            },
        );
    }
    if (broadcast.channel) {
        drawText(
            ctx,
            broadcast.channelName,
            { x: 790, y: 26, width: 175, height: 47 },
            {
                font: (size) => displayFont(project, size),
                size: 40,
                align: 'center',
                overflow: 'shrink',
                shadow: project.text.shadow,
            },
        );
        drawChannelStatus(render);
    }
}

export function drawHeadline(render: RenderContext): void {
    const { ctx, project } = render;
    const { broadcast } = project;
    if (broadcast.speaker) {
        rect(ctx, '#142128', 62, 431, 900, 60);
        drawText(
            ctx,
            project.content.author,
            { x: 72, y: 437, width: 880, height: 33 },
            {
                font: (size) => displayFont(project, size),
                size: 30,
                color: '#b5d45b',
                overflow: project.text.overflow,
            },
        );
        drawText(
            ctx,
            project.content.role,
            { x: 72, y: 472, width: 880, height: 18 },
            {
                font: (size) => bodyFont(project, size),
                size: 16,
                overflow: project.text.overflow,
            },
        );
        return;
    }
    if (!broadcast.headline) {
        return;
    }
    const tone = toneColors[broadcast.headlineTone];
    const description = broadcast.description;
    const top = description ? 385 : 445;
    rect(ctx, tone.background, 62, top, 900, description ? 36 : 46);
    drawText(
        ctx,
        broadcast.headlineText,
        {
            x: 72,
            y: top + 6,
            width: 880,
            height: description ? 30 : 40,
        },
        {
            font: (size) => displayFont(project, size),
            size: 32,
            color: tone.text,
            overflow: project.text.overflow,
        },
    );
    if (description) {
        rect(ctx, '#353b3e', 62, 424, 900, 67);
        drawText(
            ctx,
            broadcast.descriptionText,
            { x: 72, y: 432, width: 880, height: 56 },
            {
                font: (size) => bodyFont(project, size),
                size: 23,
                overflow: project.text.overflow,
            },
        );
    }
}
