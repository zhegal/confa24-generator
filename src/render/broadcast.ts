import { drawMark, toneColors } from './primitives';
import { drawChannelStatus } from './channel-status';
import { drawPsdAsset, drawPsdText, applyPsdShadow } from './psd';
import type { RenderContext } from './types';

export function drawIdentity(render: RenderContext): void {
    const { project } = render;
    const { broadcast } = project;
    if (broadcast.mark) drawMark(render, 70, 32, 75);
    if (broadcast.category) {
        const tone = toneColors[broadcast.categoryTone];
        drawPsdAsset(
            render,
            'category',
            undefined,
            broadcast.categoryTone === 'dark' ? undefined : tone.background,
        );
        drawPsdText(
            render,
            'category',
            project.content.category,
            { x: 183, y: 34, width: 320, height: 34 },
            { color: tone.text },
        );
    }
    if (broadcast.channel) {
        if (
            broadcast.channelName === 'Конфа 24' &&
            !project.appearance.serifFont &&
            project.text.scale === 1
        ) {
            render.ctx.save();
            applyPsdShadow(render, 'channel');
            drawPsdAsset(render, 'channel-wordmark');
            render.ctx.restore();
        } else {
            drawPsdText(
                render,
                'channel',
                broadcast.channelName,
                { x: 793.63, y: 27, width: 170, height: 43 },
                { overflow: 'shrink', shadow: project.text.shadow },
            );
        }
        drawChannelStatus(render);
    }
}

export function drawHeadline(render: RenderContext): void {
    const { project } = render;
    const { broadcast } = project;
    if (broadcast.speaker) {
        drawPsdAsset(render, 'speaker');
        drawPsdText(render, 'speaker', project.content.author, {
            x: 70,
            y: 429,
            width: 880,
            height: 37,
        });
        drawPsdText(
            render,
            'speaker',
            project.content.role,
            { x: 70, y: 467, width: 880, height: 23 },
            { run: 1, baseline: 483 },
        );
        return;
    }
    if (!broadcast.headline) return;
    const tone = toneColors[broadcast.headlineTone];
    if (broadcast.description) {
        drawPsdAsset(render, 'description');
        if (broadcast.headlineTone !== 'dark') {
            render.ctx.save();
            render.ctx.beginPath();
            render.ctx.rect(62, 385, 900, 36);
            render.ctx.clip();
            drawPsdAsset(render, 'description', undefined, tone.background);
            render.ctx.restore();
        }
        drawPsdText(
            render,
            'description',
            broadcast.headlineText,
            { x: 70, y: 387, width: 880, height: 36 },
            { color: broadcast.headlineTone === 'dark' ? '#000000' : tone.text },
        );
        drawPsdText(
            render,
            'description',
            broadcast.descriptionText,
            { x: 70, y: 426, width: 880, height: 63 },
            { run: 1, baseline: 454, lineHeight: 40 / 29 },
        );
    } else {
        drawPsdAsset(
            render,
            'headline',
            undefined,
            broadcast.headlineTone === 'dark' ? undefined : tone.background,
        );
        drawPsdText(
            render,
            'headline',
            broadcast.headlineText,
            { x: 70.48, y: 448, width: 880, height: 42 },
            { color: tone.text },
        );
    }
}
