import type { Project } from '../types/project';
import { prepareFonts, projectImages } from '../services/assets';
import { drawBackground } from './background';
import { drawIdentity, drawHeadline } from './broadcast';
import { drawProgram, drawIdent, drawPromo } from './program';
import { drawCollage, drawEvent, drawMaterial, drawProduct } from './materials';
import { drawArticle, drawChat, drawQuote, drawTable } from './text-content';
import { drawSpecial } from './special';
import { drawTicker } from './ticker';
import { drawSafeGuides, lowerPanelOffset } from './safe-area';
import type { RenderContext } from './types';

export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 720;

export async function renderFrame(
    canvas: HTMLCanvasElement,
    project: Project,
    guides = false,
): Promise<void> {
    const [images] = await Promise.all([projectImages(project), prepareFonts(project)]);
    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Браузер не поддерживает Canvas.');
    }
    ctx.scale(1.25, 1.25);
    const render: RenderContext = { ctx, project, images };
    drawBackground(render);
    const drawers: Partial<Record<Project['template'], (value: RenderContext) => void>> = {
        program: drawProgram,
        ident: drawIdent,
        promo: drawPromo,
        material: drawMaterial,
        event: drawEvent,
        product: drawProduct,
        chat: drawChat,
        article: drawArticle,
        quote: drawQuote,
        table: drawTable,
        collage: drawCollage,
    };
    drawers[project.template]?.(render);
    drawSpecial(render);
    ctx.save();
    ctx.translate(0, project.appearance.broadcastSafe ? 4 : 0);
    drawIdentity(render);
    ctx.restore();
    ctx.save();
    ctx.translate(0, lowerPanelOffset(project));
    drawHeadline(render);
    drawTicker(render);
    ctx.restore();
    if (guides) {
        drawSafeGuides(ctx);
    }
}
