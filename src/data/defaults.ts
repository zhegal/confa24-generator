import type { ImageSettings, Project, TemplateId } from '../types/project';
import { templates } from './templates';

export function emptyImage(src = ''): ImageSettings {
    return { src, fit: 'cover', zoom: 1, x: 0, y: 0 };
}

export function createProject(template: TemplateId = 'program'): Project {
    const definition = templates.find((item) => item.id === template)!;
    const project: Project = {
        version: 1,
        name: 'Мой эфир',
        template,
        reference: definition.reference,
        style: 'classic',
        content: {
            title: 'Вечерняя конфа',
            subtitle: 'Сегодня обсуждаем самое важное',
            body:
                'Приглашены эксперты и простые зрители нашего канала.\n' +
                'Поговорим о главном и разберёмся в подробностях.',
            category: 'Вечерняя конфа',
            author: 'Григорий',
            role: 'Специальный корреспондент',
            venue: 'Галерея «Конфа», улица Понякова, 8',
            day: '29',
            month: 'декабря',
            eventLabel: 'продлится до',
            score: 'КНФ  2 : 0  ТВК',
            street: 'улица 228 Бакинских Помидоров',
            inward: '1',
            outward: '2',
            lyrics:
                'И снова в эфире знакомые лица,\n' +
                'И снова нам есть о чём говорить.\n' +
                'Пусть эта мелодия долго звучит,\n' +
                'А вечер сегодня ещё впереди.',
        },
        appearance: {
            broadcastSafe: false,
            originalBackground: true,
            accent: '#2b8585',
            background: '#2f2f2f',
            texture: true,
            shade: 0,
            circle: true,
            arc: true,
            serifFont: '',
            sansFont: '',
        },
        images: [emptyImage('asset:evening'), emptyImage(), emptyImage(), emptyImage()],
        broadcast: {
            mark: true,
            markVariant: 'auto',
            channel: true,
            channelName: 'Конфа 24',
            category: false,
            categoryTone: 'dark',
            status: 'live',
            statusText: 'Скоро в эфире',
            headline: false,
            headlineText: 'Тема выпуска: Кто звонил Оганезову?',
            headlineTone: 'dark',
            speaker: false,
            description: false,
            descriptionText: 'Подробности — в нашем специальном выпуске.',
        },
        ticker: {
            enabled: true,
            mode: 'standard',
            metrics: true,
            clock: true,
            temperature: false,
            mood: false,
            stocks: true,
            traffic: true,
            news: true,
            time: '22:47',
            degrees: '+18°',
            moodText: 'НОРМ',
            moodTone: 'yellow',
            symbol: 'Гнидиенко',
            value: '37,47',
            trend: 'up',
            street: 'РФсатский бульвар',
            trafficValue: 5,
            street2: 'Пупоградское шоссе',
            trafficValue2: 5,
            direction: '',
            newsText: 'AhtysukaNews — Г. Оганезов создает движение «Против Васильича»',
            newsTone: 'dark',
            newsOffset: 0,
            metricsOffset: 0,
            social: 'twitter.com/confa24tv',
            smsNumber: '1932',
            smsText: 'SMS-портал К24: всё самое сочное отправляйте на номер',
        },
        text: { overflow: 'shrink', scale: 1, shadow: true },
    };

    applyTemplateDefaults(project);
    return project;
}

function applyTemplateDefaults(project: Project): void {
    const { template, content, broadcast, appearance, images } = project;
    if (template === 'program') {
        return;
    }
    broadcast.category = true;
    broadcast.headline = true;
    content.category = templates.find((item) => item.id === template)!.name;
    appearance.background = '#a6a6a6';
    broadcast.headlineText = 'Сегодня в эфире — самое интересное';
    if (['photo', 'music', 'sport', 'traffic', 'night'].includes(template)) {
        const assets: Record<string, string> = {
            photo: 'photo',
            music: 'music',
            sport: 'sport',
            traffic: 'road',
            night: 'night-road',
        };
        images[0]!.src = `asset:${assets[template]}`;
    }
    if (template === 'material' || template === 'article') {
        images[0]!.src = template === 'material' ? 'asset:portrait' : '';
    }
    if (template === 'chat') {
        images[0]!.src = '';
        content.body =
            'Димас: Всем привет, мы снова в эфире!\n' +
            'Игорь: Сегодня будет большой выпуск\n' +
            'Руслан: А новости операторов будут?\n' +
            'Димас: Конечно. Следите за нашими новостями\n' +
            'Игорь: СРОЧНО: в конфе всё спокойно';
        broadcast.headlineTone = 'urgent';
        broadcast.headlineText = 'СРОЧНО: СРАЧ В КОНФЕ';
    }
    if (template === 'event' || template === 'collage') {
        images[0]!.src = 'asset:product';
        images[1]!.src = 'asset:portrait';
        content.title = '«Рождённое в конфе»';
        content.body = 'Мемы, логотипы и истории нашего эфира.\nВход свободный.';
        broadcast.headline = template === 'collage';
    }
    if (template === 'product') {
        images[0]!.src = 'asset:product';
        content.category = '«Экономика»';
        content.title = 'Стоимость по передатчиков:';
        content.body = 'САВАВРЁСТОК: 2200,80 р.\nКолногоузёрочка: 18421,00 р.';
        broadcast.headline = false;
    }
    if (template === 'bars' || template === 'ident') {
        appearance.background = '#000000';
        images[0]!.src = '';
        broadcast.category = false;
        broadcast.headlineTone = 'urgent';
        broadcast.headlineText = 'СРОЧНО: ничего срочного';
    }
    if (template === 'ident') {
        project.text.overflow = 'wrap';
    }
    if (template === 'quote') {
        images[0]!.src = '';
        content.category = 'Программа «ШОК». Цитата';
        content.author = 'Павел Розов';
        content.body =
            'Порой бывают моменты, когда либо номер временно не раздаю,\n' +
            'либо когда что-нибудь такое началось.\n\n' +
            'А свои самые важные новости мы обязательно покажем в эфире.';
    }
    if (template === 'table') {
        images[0]!.src = 'asset:evening';
        content.category = 'Рубрика «Чтобы помнили»';
        content.body =
            '1. «Бобра» — Я ебу кабак (NEW ENTRY)\n' +
            '2. «Бваор» — Я иду в собак (NEW ENTRY)\n' +
            '3. Lil John feat. LMFAO — Шац (▼ 2)\n' +
            '4. История битарда и яги — Опенинг (NEW ENTRY)\n' +
            '5. Профессор Ильяшевский — Подписчики (▲ 30)';
        broadcast.headlineText = 'Хит-парад «Добрых песен» за 23 ноября!';
    }
    if (template === 'night') {
        content.title = 'Ночное щищание';
        broadcast.category = false;
        broadcast.headline = false;
    }
    if (template === 'music') {
        content.category = 'Добрые песни';
        broadcast.headline = false;
    }
    if (template === 'traffic') {
        content.category = 'Утренний Стоянов. Пробки';
        broadcast.headline = false;
    }
    if (template === 'promo') {
        images[0]!.src = '';
        images[1]!.src = '';
        content.title = 'ТРАЛЬНОЕ\nТЕЛЕВИДЕНИЕ';
        content.category = 'В выходные в 21:30';
        broadcast.status = 'age';
        broadcast.headline = false;
        project.style = 'modern';
    }
}
