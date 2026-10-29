import { bodyFont, displayFont, drawText } from './text';
import { rect } from './primitives';
import type { RenderContext } from './types';

export function drawTicker(render: RenderContext): void {
    const { ctx, project } = render;
    const { ticker } = project;
    if (!ticker.enabled || ticker.mode === 'none') {
        return;
    }
    rect(ctx, '#a6a6a650', 62, 491, 900, 85);
    if (ticker.mode === 'social' || ticker.mode === 'sms') {
        const social = ticker.mode === 'social';
        rect(ctx, social ? '#21aeca' : '#aaaaaa', 62, 493, 900, 58);
        drawText(
            ctx,
            social ? ticker.social : `${ticker.smsText} ${ticker.smsNumber}`,
            {
                x: 80,
                y: 503,
                width: 865,
                height: 47,
            },
            {
                font: (size) =>
                    social ? displayFont(project, size) : bodyFont(project, size, true),
                size: social ? 48 : 30,
                overflow: project.text.overflow,
                shadow: project.text.shadow,
            },
        );
        return;
    }
    if (ticker.metrics) {
        drawMetrics(render);
    }
    if (ticker.news) {
        const urgent = ticker.newsTone === 'urgent';
        rect(ctx, urgent ? '#dee017' : '#142128', 62, 522, 900, 29);
        ctx.save();
        ctx.beginPath();
        ctx.rect(70, 522, 880, 29);
        ctx.clip();
        ctx.font = bodyFont(project, 21);
        ctx.textBaseline = 'top';
        ctx.fillStyle = urgent ? '#000000' : '#ffffff';
        ctx.fillText(ticker.newsText, 70 - ticker.newsOffset, 528);
        ctx.restore();
    }
}

function trafficColor(value: number): string {
    return value <= 3 ? '#00d600' : value <= 6 ? '#dedf00' : '#db1515';
}

function drawMetrics(render: RenderContext): void {
    const { ctx, project } = render;
    const { ticker } = project;
    rect(ctx, '#1c211f', 62, 494, 900, 26);
    let start = 62;
    ctx.font = bodyFont(project, 22);
    if (ticker.clock) {
        const urgent = project.broadcast.headline && project.broadcast.headlineTone === 'urgent';
        rect(
            ctx,
            project.style === 'modern' ? '#1c211f' : urgent ? '#b9e52b' : '#55419c',
            62,
            494,
            62,
            26,
        );
        drawText(
            ctx,
            ticker.time,
            { x: 66, y: 498, width: 55, height: 22 },
            {
                font: (size) => bodyFont(project, size, true),
                size: 20,
                color: urgent && project.style === 'classic' ? '#000000' : '#ffffff',
                overflow: 'shrink',
            },
        );
        start = 126;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(start, 494, 962 - start, 26);
    ctx.clip();
    let x = start - ticker.metricsOffset;
    const segment = (value: string, color = '#ffffff', background?: string) => {
        ctx.font = bodyFont(project, 22);
        const width = ctx.measureText(value).width + 16;
        rect(ctx, background ?? '#1c211f', x, 494, width - 3, 26);
        rect(ctx, '#838786', x + width - 3, 494, 3, 26);
        ctx.fillStyle = color;
        ctx.textBaseline = 'top';
        ctx.fillText(value, x + 5, 497);
        x += width;
    };
    if (ticker.temperature) {
        segment(ticker.degrees);
    }
    if (ticker.mood) {
        segment('В конфе');
        const colors = { green: '#00d600', yellow: '#dedf00', red: '#db1515' };
        segment(ticker.moodText, '#000000', colors[ticker.moodTone]);
    }
    if (ticker.stocks) {
        segment(ticker.symbol);
        const sign = ticker.trend === 'up' ? '▲' : ticker.trend === 'down' ? '▼' : '—';
        const color =
            ticker.trend === 'up' ? '#00d600' : ticker.trend === 'down' ? '#db1515' : '#ffffff';
        segment(`${sign} ${ticker.value}`, color);
    }
    if (ticker.traffic) {
        const items = [
            { street: ticker.street, value: ticker.trafficValue },
            { street: ticker.street2, value: ticker.trafficValue2 },
        ];
        items.forEach((item) => {
            if (!item.street) {
                return;
            }
            segment(item.street);
            const label =
                project.style === 'classic'
                    ? String(item.value)
                    : `${item.value} ${ticker.direction || 'баллов'}`;
            segment(label, '#000000', trafficColor(item.value));
        });
    }
    ctx.restore();
}
