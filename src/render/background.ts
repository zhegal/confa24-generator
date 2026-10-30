import { drawImage, rect } from './primitives';
import { drawBackplate } from './backplates';
import { drawPsdAsset } from './psd';
import type { RenderContext } from './types';

export function drawBackground(render: RenderContext): void {
    const { ctx, project } = render;
    const { template, appearance, images } = project;
    rect(ctx, appearance.background, 0, 0, 1024, 576);
    if (template === 'bars') {
        drawPsdAsset(render, 'bars');
    } else if (['photo', 'music', 'sport', 'traffic', 'night'].includes(template)) {
        drawImage(render, images[0]!, { x: 0, y: 0, width: 1024, height: 576 });
    } else if (template === 'promo') {
        if (images[1]!.src) drawImage(render, images[1]!, { x: 0, y: 0, width: 1024, height: 576 });
        else drawBackplate(render, 'gold');
    } else if (template !== 'chat') {
        if (appearance.originalBackground) {
            if (project.style === 'modern') {
                drawPsdAsset(render, 'background-mint');
                if (appearance.texture) drawPsdAsset(render, 'background-triangles');
            } else if (appearance.texture) {
                drawPsdAsset(render, 'background-gray');
            }
        } else if (appearance.texture) {
            drawBackplate(render, 'silver');
        }
        if (template === 'program') {
            if (!appearance.originalBackground) drawBackplate(render, 'program');
            else if (appearance.arc) drawPsdAsset(render, 'program-mask');
            else rect(ctx, '#2f2f2f', 0, 0, 1024, 576);
        } else if (template === 'ident' && !images[0]!.src) {
            drawPsdAsset(render, project.style === 'classic' ? 'ident-classic' : 'ident-modern');
        }
    }
    if (appearance.shade > 0) rect(ctx, `rgba(0,0,0,${appearance.shade})`, 0, 0, 1024, 576);
}
