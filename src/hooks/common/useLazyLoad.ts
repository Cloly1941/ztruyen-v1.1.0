// ** React
import { useEffect, useRef, useState } from "react";

type TUseLazyLoad = {
    threshold?: number;
    rootMargin?: string;
};

const useLazyLoad = ({ threshold = 0.1, rootMargin = "200px" }: TUseLazyLoad = {}) => {
    const [enabled, setEnabled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setEnabled(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, enabled };
};

export default useLazyLoad;