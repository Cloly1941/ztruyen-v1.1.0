// ** Type
import {IHistory} from "@/types/api";

const KEY = "ZTC-history-v1.1";
const MAX_COMIC_IN_HISTORY = 30;

type IHistoryStorage = Omit<IHistory, "_id">

const getAll = (): IHistoryStorage[] => {
    try {
        const saved = localStorage.getItem(KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveAll = (arr: IHistoryStorage[]) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(arr));
    } catch {}
};

export const historyService = {
    getAll,
    getById(chapter_id: string) {
        return getAll().find(item => item.chapter_id === chapter_id);
    },
    getBySlug(slug: string) {
        return getAll().find(item => item.slug === slug);
    },
    save(history: IHistoryStorage) {
        const arr = getAll();
        const idx = arr.findIndex(item => item.slug === history.slug);

        if (idx !== -1) {
            arr[idx] = history;
        } else {
            if (arr.length < MAX_COMIC_IN_HISTORY) {
                arr.push(history);
            }
        }

        saveAll(arr);
    },
    delete(chapter_id: string) {
        saveAll(getAll().filter(item => item.chapter_id !== chapter_id));
    },
    deleteMany(chapter_ids: string[]) {
        const set = new Set(chapter_ids);
        saveAll(getAll().filter(item => !set.has(item.chapter_id)));
    },
    clear() {
        localStorage.removeItem(KEY);
    },
};
