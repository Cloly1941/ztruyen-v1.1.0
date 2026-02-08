'use client'

// ** React
import {useEffect} from "react";
import {createPortal} from "react-dom";

type LoadingProps = {
    text?: string;
    shortcut?: string;
}

const Loading = ({text = 'Chờ tý nhe ', shortcut = '~'}: LoadingProps) => {

    useEffect(() => {
        document.body.classList.add('loading');
        return () => {
            document.body.classList.remove('loading');
        };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center
                 bg-background/80 backdrop-blur-sm font-title"
            role="status"
            aria-live="polite"
        >
            <div className="text-loading">
                <span className="text-loading__icon">⊂(・▽・⊂)</span>

                <span>
          {text}
                    <span className="text-loading__dots">
            {Array.from({length: 3}).map((_, index) => (
                <span key={index}>{shortcut}</span>
            ))}
          </span>
        </span>

                <span className="text-loading__icon right">つ≧▽≦)つ</span>
            </div>
        </div>,
        document.body
    );
};

export default Loading;
