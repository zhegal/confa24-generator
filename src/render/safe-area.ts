import type { Project } from '../types/project';
import type { Rectangle } from './types';

export function safeRectangle(width: number, height: number, inset: number): Rectangle {
    return {
        x: width * inset,
        y: height * inset,
        width: width * (1 - inset * 2),
        height: height * (1 - inset * 2),
    };
}

export function lowerPanelOffset(project: Project): number {
    return project.appearance.broadcastSafe ? -6 : 0;
}

export function drawSafeGuides(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.lineWidth = 0.8;
    ctx.setLineDash([5, 4]);
    const zones = [
        { inset: 0.035, color: '#79bceb', label: 'ACTION SAFE · 3.5%' },
        { inset: 0.05, color: '#edcd7b', label: 'GRAPHICS SAFE · 5%' },
    ];
    zones.forEach(({ inset, color, label }) => {
        const box = safeRectangle(1024, 576, inset);
        ctx.strokeStyle = color;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = '#101820d0';
        ctx.fillRect(box.x + 6, box.y + 5, 155, 15);
        ctx.fillStyle = color;
        ctx.font = '10px Arial, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(label, box.x + 10, box.y + 8);
    });
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = '#ffffff50';
    ctx.beginPath();
    ctx.moveTo(512, 278);
    ctx.lineTo(512, 298);
    ctx.moveTo(502, 288);
    ctx.lineTo(522, 288);
    ctx.stroke();
    ctx.restore();
}
