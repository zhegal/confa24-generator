import type { TemplateId } from '../types/project';
import { createProject } from './defaults';

const families: Partial<Record<TemplateId, number[]>> = {
    program: [16, 17, 23, 28, 34, 37, 40, 41, 44, 47, 57, 58, 59, 62, 63, 66, 95, 96, 115],
    photo: [5, 19, 38, 39, 43, 54, 80, 85, 97, 99, 119, 120, 124, 129, 136],
    chat: [1, 2, 3, 4, 25, 31, 32, 48, 49, 51, 55, 56, 81, 82, 100, 109],
    article: [
        20, 26, 65, 71, 72, 89, 104, 111, 112, 113, 114, 117, 118, 122, 123, 131, 132, 135, 139,
    ],
    event: [36, 45, 60, 75, 79, 84, 101],
    product: [21, 22, 24, 29, 74, 76, 77, 87, 126],
    bars: [7, 10, 11, 12, 15, 50, 78],
    ident: [8, 13, 14, 18, 33, 46, 52],
    quote: [53, 70, 73, 110, 133],
    table: [68, 127, 138],
    music: [6, 91, 92, 98, 105, 108],
    sport: [69, 121],
    traffic: [64, 107, 134],
    night: [67, 83, 93, 94],
    promo: [9, 102, 130, 137],
    collage: [27, 30, 35, 42, 61, 86, 88, 90, 103, 106, 116, 125, 128],
};

export function referenceTemplate(id: number): TemplateId {
    for (const [template, numbers] of Object.entries(families)) {
        if (numbers.includes(id)) {
            return template as TemplateId;
        }
    }
    return 'material';
}

const programs: Record<number, [string, string, string]> = {
    16: ['Конфа-\nИнформбюро', 'avatar', '#959595'],
    17: ['Конфа-\nИнформбюро', 'avatar', '#959595'],
    23: ['Конфа-\nИнформбюро', 'avatar', '#959595'],
    28: ['Городовой', 'gorodovoy', '#86723a'],
    34: ['Вечерняя конфа', 'evening', '#2b8585'],
    37: ['Вечерняя конфа', 'evening', '#2b8585'],
    40: ['Минутки политики.\nОкончание', 'politics', '#92b6c9'],
    41: ['Конфа-Информбюро', 'avatar', '#cba49b'],
    44: ['Конфа-Информбюро', 'avatar', '#cba49b'],
    47: ['Минутки политики', 'politics', '#92b6c9'],
    57: ['Конфа-Информбюро', 'avatar', '#cba49b'],
    58: ['Вечерняя Конфа', 'evening', '#cba49b'],
    59: ['Время аниме', 'anime', '#626786'],
    62: ['Всякая японская\nхунЯ', 'anime', '#626786'],
    63: ['Ночная конфа', 'night', '#171c53'],
    66: ['Конфа-Информбюро', 'avatar', '#cba49b'],
    95: ['Новости БОР-ТВ', 'bor', '#729abe'],
    96: ['Программа\n«ГОВНО»', 'show', '#ef0909'],
    115: ['Фаполимпиада\n2012', 'olympic', '#eeab09'],
};

export function createFromReference(id: number) {
    const project = createProject(referenceTemplate(id));
    project.reference = id;
    project.name = `Эфир · референс ${id}`;
    const program = programs[id];
    if (program) {
        project.content.title = program[0];
        project.images[0]!.src = `asset:${program[1]}`;
        project.appearance.accent = program[2];
    }
    if (id >= 119) {
        project.style = 'modern';
        project.ticker.mood = true;
        project.ticker.temperature = true;
    }
    if ([16, 28, 44, 101, 138].includes(id)) {
        project.broadcast.status = 'none';
    }
    if ([13, 14, 33, 46, 47, 48, 57, 58, 62, 63, 94].includes(id)) {
        project.broadcast.headline = true;
        project.broadcast.headlineTone = 'urgent';
        project.broadcast.headlineText = 'СРОЧНО: мы следим за развитием событий';
    }
    if ([113, 129, 134].includes(id)) {
        project.ticker.mode = 'social';
    }
    if ([101, 138].includes(id)) {
        project.ticker.mode = 'sms';
    }
    return project;
}
