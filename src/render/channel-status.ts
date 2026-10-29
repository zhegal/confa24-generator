import { bodyFont, displayFont } from './text';
import { rect } from './primitives';
import type { RenderContext } from './types';

export function drawChannelStatus(render: RenderContext): void {
    const { ctx, project } = render;
    const { broadcast } = project;
    if (broadcast.status === 'none') {
        return;
    }
    const labels = {
        live: project.style === 'classic' ? 'ПРЯМОЙ ЭФИР' : 'прямой эфир',
        announcements: 'АНОНСЫ',
        age: '16+',
        custom: broadcast.statusText,
    };
    const label = labels[broadcast.status];
    const center = 877.5;
    const width = 154;
    const height = 25;
    const top = 67;
    const color = broadcast.status === 'announcements' ? '#727272' : '#9e2431';
    rect(ctx, color, center - width / 2, top, width, height);
    ctx.save();
    let size = project.style === 'modern' ? 22 : 19;
    const setFont = () => {
        ctx.font =
            project.style === 'modern' ? displayFont(project, size) : bodyFont(project, size);
    };
    setFont();
    while (
        size > 8 &&
        (ctx.measureText(label).width > width - 18 || size * project.text.scale > 23)
    ) {
        size -= 0.5;
        setFont();
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const metrics = ctx.measureText(label);
    const ascent = metrics.actualBoundingBoxAscent;
    const descent = metrics.actualBoundingBoxDescent;
    ctx.fillText(label, center, top + (height + ascent - descent) / 2);
    ctx.restore();
}
