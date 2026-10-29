import { projectSchema, type Project, type SavedProject } from '../types/project';

const DATABASE = 'confa24-studio';
let connection: Promise<IDBDatabase> | undefined;

function database(): Promise<IDBDatabase> {
    connection ??= new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE, 1);
        request.onupgradeneeded = () => request.result.createObjectStore('projects');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
            connection = undefined;
            reject(new Error('Хранилище браузера недоступно. Сохраните проект в файл.'));
        };
    });
    return connection;
}

async function transact<T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
    const db = await database();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('projects', mode);
        const request = run(transaction.objectStore('projects'));
        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}

export async function storeDraft(project: Project): Promise<void> {
    await transact('readwrite', (store) => store.put(project, 'draft'));
}

export async function loadDraft(): Promise<Project | null> {
    const value = await transact('readonly', (store) => store.get('draft'));
    const parsed = projectSchema.safeParse(value);
    return parsed.success ? parsed.data : null;
}

export async function listSaved(): Promise<SavedProject[]> {
    const values = await transact('readonly', (store) => store.getAll());
    return values
        .filter((value): value is SavedProject => {
            return (
                value &&
                typeof value.id === 'string' &&
                value.project &&
                projectSchema.safeParse(value.project).success
            );
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveNamed(project: SavedProject): Promise<void> {
    await transact('readwrite', (store) => store.put(project, project.id));
}

export async function deleteNamed(id: string): Promise<void> {
    await transact('readwrite', (store) => store.delete(id));
}
