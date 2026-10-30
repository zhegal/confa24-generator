import { bodyFont, sourceFont, drawText } from './text';
import { rect } from './primitives';
import { drawPsdAsset, drawPsdText } from './psd';
import type { RenderContext } from './types';

export function drawTicker(render: RenderContext): void {
    const { ctx, project } = render;
    const { ticker } = project;
    if (!ticker.enabled || ticker.mode === 'none') return;
    drawPsdAsset(render, 'ticker-base');
    if (ticker.mode === 'social' || ticker.mode === 'sms') {
        const social = ticker.mode === 'social';
        drawPsdAsset(render, ticker.mode);
        drawText(
            ctx,
            social ? ticker.social : `${ticker.smsText} ${ticker.smsNumber}`,
            { x: 77, y: 501, width: 870, height: 45 },
            {
                font: (size) => sourceFont(project, size, 'sans', social ? 700 : 500, social),
                size: social ? 40 : 28,
                baseline: 533,
                overflow: project.text.overflow,
            },
        );
        return;
    }
    if (ticker.metrics) drawMetrics(render);
    if (ticker.news) {
        const urgent = ticker.newsTone === 'urgent';
        drawPsdAsset(render, urgent ? 'urgent-news' : 'news');
        ctx.save();
        ctx.beginPath();
        ctx.rect(70, 522, 881, 29);
        ctx.clip();
        drawPsdText(
            render,
            'news',
            ticker.newsText,
            { x: 70 - ticker.newsOffset, y: 523, width: 10000, height: 28 },
            { color: urgent ? '#000000' : '#ffffff', overflow: 'clip' },
        );
        ctx.restore();
    }
}

function trafficColor(value: number): string {
    return value <= 3 ? '#12cd12' : value <= 6 ? '#dee017' : '#ce1717';
}

function drawMetrics(render: RenderContext): void {
    const { ctx, project } = render;
    const { ticker } = project;
    const source = render.images.get('asset:psd/metrics')!;
    // Stretch a clean section of the original plate. Its borders and separators
    // are then placed around editable cells rather than baked into the text.
    ctx.drawImage(source, 10, 0, 40, 30, 62, 491, 900, 30);
    let start = 62;
    if (ticker.clock) {
        drawPsdText(
            render,
            'clock',
            ticker.time,
            { x: 70, y: 493, width: 55, height: 27 },
            { overflow: 'shrink' },
        );
        ctx.drawImage(source, 67, 0, 3, 30, 129, 491, 3, 30);
        start = 132;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(start, 491, 962 - start, 30);
    ctx.clip();
    let x = start - ticker.metricsOffset;
    const segment = (value: string, color = '#ffffff', background?: string, medium = false) => {
        ctx.font = medium ? sourceFont(project, 19, 'sans', 500) : bodyFont(project, 20);
        ctx.letterSpacing = '0px';
        const width = ctx.measureText(value).width + 20;
        if (background) rect(ctx, background, x, 494, width - 3, 26);
        ctx.drawImage(source, 67, 0, 3, 30, x + width - 3, 491, 3, 30);
        ctx.fillStyle = color;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(value, x + 8, 513.5);
        x += width;
    };
    if (ticker.temperature) segment(ticker.degrees);
    if (ticker.mood) {
        segment('В конфе');
        const colors = { green: '#12cd12', yellow: '#dee017', red: '#ce1717' };
        segment(ticker.moodText, '#000000', colors[ticker.moodTone], true);
    }
    if (ticker.stocks) {
        segment(ticker.symbol);
        const sign = ticker.trend === 'up' ? '▲' : ticker.trend === 'down' ? '▼' : '—';
        const color =
            ticker.trend === 'up' ? '#12cd12' : ticker.trend === 'down' ? '#ce1717' : '#ffffff';
        segment(`${sign} ${ticker.value}`, color, undefined, true);
    }
    if (ticker.traffic) {
        for (const item of [
            { street: ticker.street, value: ticker.trafficValue },
            { street: ticker.street2, value: ticker.trafficValue2 },
        ]) {
            if (!item.street) continue;
            segment(item.street);
            const label =
                project.style === 'classic'
                    ? String(item.value)
                    : `${item.value} ${ticker.direction || 'баллов'}`;
            segment(label, trafficColor(item.value), undefined, true);
        }
    }
    ctx.restore();
}
