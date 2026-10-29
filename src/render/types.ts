import type { Project } from '../types/project';

export interface RenderContext {
    ctx: CanvasRenderingContext2D;
    project: Project;
    images: Map<string, HTMLImageElement>;
}

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
