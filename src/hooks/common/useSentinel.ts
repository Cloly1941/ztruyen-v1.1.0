// ** React
import { useEffect, useRef } from "react";

type TUseSentinel = {
    onIntersect: () => void;
    threshold?: number;
    rootMargin?: string;
};

const useSentinel = ({ onIntersect, threshold = 0.1, rootMargin = "200px" }: TUseSentinel) => {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onIntersect();
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [onIntersect, threshold, rootMargin]);

    return { sentinelRef };
};

export default useSentinel;