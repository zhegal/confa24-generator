import type { Project } from '../types/project';

const streets = [
    'улица 228 Бакинских Помидоров',
    'Пупоградское шоссе',
    'проспект 60-летия Ахтусуки',
    'бульвар Эуро Нэуро',
    'РФсатский бульвар',
    'улица Понякова',
    'проезд Странопатова',
    'улица имени ЕЁ и ЕЁ',
    'набережная реки Яуза',
    'САВАВРЯНСКОЕ шоссе',
];
const symbols = ['БРМСКТН', 'Гнидиенко', 'БРАВО Inc.', 'ШИЩ-Финанс', 'Печень', 'САВВРЯНСКАЯ'];
const headlines = [
    'СРОЧНО: ничего срочного',
    'СРОЧНО: в конференции всё спокойно',
    'Тема выпуска: Кто звонил Оганезову?',
    'Сегодня выбираем лучшие передатчики',
    'СРОЧНО: мы следим за развитием событий',
    'Вечерний выпуск. Подробности — далее',
];
const news = [
    'Конфа 24 теперь вещает во всех кабельных сетях — Конфа-ТАСС',
    'Добрые Песни в Шахунье: новый выпуск сегодня в 18:10',
    'На Пупоградском шоссе завершён ремонт — подробности в нашем эфире',
    'В пресс-центре Конфа-ТАСС обсуждают возможность обсуждения',
    'Радиостанция «Добрые песни» запускает телеканал. Подробности — завтра',
];
function pick<T>(values: T[]): T {
    return values[Math.floor(Math.random() * values.length)]!;
}

export function randomizeTicker(project: Project): void {
    project.ticker.time =
        `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:` +
        String(Math.floor(Math.random() * 60)).padStart(2, '0');
    project.ticker.degrees = `+${Math.floor(Math.random() * 30)}°`;
    project.ticker.symbol = pick(symbols);
    project.ticker.value = (Math.random() * 999).toFixed(2).replace('.', ',');
    project.ticker.trend = Math.random() > 0.5 ? 'up' : 'down';
    project.ticker.street = pick(streets);
    project.ticker.street2 = pick(streets);
    project.ticker.trafficValue = Math.ceil(Math.random() * 9);
    project.ticker.trafficValue2 = Math.ceil(Math.random() * 9);
    project.ticker.newsText = pick(news);
    project.ticker.newsOffset = 0;
    project.ticker.metricsOffset = 0;
}

export function randomizeAll(project: Project): void {
    randomizeTicker(project);
    project.broadcast.headlineText = pick(headlines);
}
