import { drawPsdAsset, drawPsdText } from './psd';
import type { RenderContext } from './types';

export function drawChannelStatus(render: RenderContext): void {
    const { broadcast } = render.project;
    if (broadcast.status === 'none') return;
    const labels = {
        live: 'прямой эфир',
        announcements: 'анонсы',
        age: '16+',
        custom: broadcast.statusText,
    };
    drawPsdAsset(
        render,
        'live',
        undefined,
        broadcast.status === 'announcements' ? '#727272' : undefined,
    );
    drawPsdText(
        render,
        'live',
        labels[broadcast.status],
        { x: 806, y: 72, width: 138, height: 28 },
        { align: 'center', overflow: 'shrink' },
    );
}
