"use client";

// ** React
import {useEffect, useState} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Lucide icons
import {Download, Share2, Loader2} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
}

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    const [platform, setPlatform] = useState<
        "android" | "ios" | "desktop" | "unknown"
    >("unknown");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();

        if (/android/.test(ua)) setPlatform("android");
        else if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
        else setPlatform("desktop");

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (platform === "ios") {
            toast.success("Safari → Nhấn Share → Thêm vào màn hình chính");
            return;
        }

        if (deferredPrompt) {
            setLoading(true);
            try {
                await deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                console.log("User choice:", choice.outcome);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Thiết bị chưa hỗ trợ cài app");
        }
    };

    const isStandalone =
        typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone);

    if (isStandalone) return null;

    const Icon = loading ? Loader2 : platform === "ios" ? Share2 : Download;

    return (
        <>
            <span className="sm:text-white/20">|</span>
            <button
                onClick={handleInstall}
                disabled={loading}
                className="flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Icon
                    size={14}
                    strokeWidth={1.6}
                    className={loading ? "animate-spin" : undefined}
                />
                Tải app
            </button>
        </>
    );
}