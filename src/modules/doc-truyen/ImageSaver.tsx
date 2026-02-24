'use client'

// ** React
import {RefObject, useCallback, useEffect} from "react";

// ** Type localstorage
import {IHistory} from "@/types/api";

// ** LocalStorage
import {historyService} from "@/localStorage/historyServices";

type TImageSaver = Omit<IHistory, '_id'> & {
    setCurrentImageIndex: (number: number) => void;
    imgRefs: RefObject<(HTMLImageElement | null)[]>;
}

const ImageSaver = ({
                        title, path, image_name,
                        chapter_name, chapter_id, imgRefs,
                        thumb, slug, setCurrentImageIndex
                    }: TImageSaver) => {

    // Scroll
    useEffect(() => {
        try {
            const historyChapter = historyService.getById(chapter_id);
            if (!historyChapter?.image_name) return;

            const index = historyChapter.image_name - 1;
            setCurrentImageIndex(index);

            let tries = 0;

            const restoreScroll = () => {
                const imgEl = imgRefs.current?.[index];

                if (imgEl && imgEl.getBoundingClientRect().top + window.scrollY > window.scrollY) {
                    const HEADER_OFFSET = 56;
                    const top = imgEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
                    window.scrollTo({ top, behavior: 'instant' });
                    return;
                }

                if (tries > 60) return;
                tries++;
                requestAnimationFrame(restoreScroll);
            };

            requestAnimationFrame(restoreScroll);
        } catch {}
    }, [chapter_id, setCurrentImageIndex, imgRefs]);


    // Save history
    const saveHistory = useCallback(() => {

        const historyItem = {
            title, path, image_name: image_name + 1,
            chapter_name, chapter_id,
            thumb, slug
        };

        historyService.save(historyItem);
    }, [ title, path, image_name, chapter_name, chapter_id, thumb, slug]);

    useEffect(() => {
        return () => {
            saveHistory();
        };
    }, [saveHistory]);

    return null
}

export default ImageSaver