import { drawImage, rect } from './primitives';
import { drawBackplate } from './backplates';
import type { RenderContext } from './types';

export function drawBackground(render: RenderContext): void {
    const { ctx, project } = render;
    const { template, appearance, images } = project;
    rect(ctx, appearance.background, 0, 0, 1024, 576);
    if (template === 'bars') {
        const colors = [
            '#ffffff',
            '#dee017',
            '#0bc6c9',
            '#09cd06',
            '#c90bca',
            '#ce1011',
            '#0900be',
            '#000000',
        ];
        colors.forEach((color, index) => rect(ctx, color, index * 128, 0, 128, 576));
        return;
    }
    if (template === 'program') {
        drawBackplate(render, 'program');
    } else if (['photo', 'music', 'sport', 'traffic', 'night'].includes(template)) {
        drawImage(render, images[0]!, { x: 0, y: 0, width: 1024, height: 576 });
    } else if (template === 'promo') {
        if (images[1]!.src) {
            drawImage(render, images[1]!, { x: 0, y: 0, width: 1024, height: 576 });
        } else {
            drawBackplate(render, 'gold');
        }
    } else if (appearance.texture && !['ident', 'chat'].includes(template)) {
        drawBackplate(render, 'silver');
    }
    if (appearance.shade > 0) {
        rect(ctx, `rgba(0,0,0,${appearance.shade})`, 0, 0, 1024, 576);
    }
}
