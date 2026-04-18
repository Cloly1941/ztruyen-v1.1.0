'use client'

// ** Next
import Link from "next/link";

// ** React
import {useEffect, useState} from "react";

// ** Shadcn ui
import {Field, FieldContent, FieldDescription, FieldLabel} from "@/components/ui/field";
import {Switch} from "@/components/ui/switch";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

// ** Hook
import useBannerMode, {TBannerMode} from "@/hooks/common/useBannerMode";

// ** Lib
import {initFCM, requestNotificationPermission} from "@/lib/fcm/fcm";

// ** React hot toast
import toast from "react-hot-toast";

// ** Config
import {BANNER_OPTIONS} from "@/configs/page";
import RadioBannerSkeleton from "@/skeletons/tai-khoan/cai-dat-chung/RadioBannerSkeleton";

const isNotificationSupported = () =>
    typeof window !== 'undefined' && 'Notification' in window;

const isIOS = () =>
    typeof window !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

const isInStandaloneMode = () =>
    typeof window !== 'undefined' &&
    'standalone' in navigator &&
    (navigator).standalone === true;

const UserSetting = () => {
    const {bannerMode, handleBannerMode} = useBannerMode();

    const [notifEnabled, setNotifEnabled] = useState(false);
    const [notifLoading, setNotifLoading] = useState(false);
    const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null);
    const [notifSupported, setNotifSupported] = useState(false);
    const [iosHint, setIosHint] = useState(false);

    useEffect(() => {
        const supported = isNotificationSupported();
        setNotifSupported(supported);

        if (!supported) {
            if (isIOS() && !isInStandaloneMode()) {
                setIosHint(true);
            }
            return;
        }

        const permission = Notification.permission;
        setNotifPermission(permission);
        setNotifEnabled(permission === 'granted');
    }, []);

    const handleToggleNotif = async (checked: boolean) => {
        if (!notifSupported) return;

        if (!checked) {
            toast.success('Nhấn vào hướng dẫn tắt thông báo');
            return;
        }

        if (notifPermission === 'denied') {
            toast.error('Bạn đã từ chối trước đó. Hãy bật lại trong cài đặt trình duyệt.');
            return;
        }

        setNotifLoading(true);
        try {
            const granted = await requestNotificationPermission();
            if (granted) {
                await initFCM();
                setNotifEnabled(true);
                setNotifPermission('granted');
                toast.success('Đã bật thông báo');
            } else {
                toast.error('Bạn đã từ chối. Hãy bật lại trong cài đặt trình duyệt.');
            }
        } catch {
            toast.error('Có lỗi xảy ra, thử lại sau');
        } finally {
            setNotifLoading(false);
        }
    };

    const getNotifDescription = () => {
        if (iosHint) return 'Thêm trang vào màn hình chính (Thêm vào màn hình chính) để bật thông báo trên iOS.';
        if (!notifSupported) return 'Trình duyệt của bạn chưa hỗ trợ thông báo.';
        if (notifPermission === 'denied') return '⚠️ Bạn đã chặn thông báo. Vào cài đặt trình duyệt để bật lại.';
        return 'Nhận thông báo khi có người phản hồi hoặc thích bình luận của bạn.';
    };

    return (
        <div className="space-y-8 mt-1">

            {/* Section: Thông báo */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Thông báo</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Quản lý cách bạn nhận thông báo</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <Field orientation="horizontal" className="w-full gap-4">
                        <FieldContent className="flex-1 min-w-0">
                            <FieldLabel htmlFor="switch-notification" className="text-sm font-medium">
                                Bật thông báo
                            </FieldLabel>
                            <FieldDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {getNotifDescription()} {' '}
                                <Link href='/huong-dan'
                                      className='text-amber-600'
                                      target='_blank'
                                >
                                    Hướng dẫn tắt thông báo
                                </Link>
                            </FieldDescription>
                        </FieldContent>
                        <Switch
                            id="switch-notification"
                            className="shrink-0 mt-0.5"
                            checked={notifEnabled}
                            disabled={notifLoading || !notifSupported || notifPermission === 'denied'}
                            onCheckedChange={handleToggleNotif}
                        />
                    </Field>
                </div>
            </section>

            {/* Section: Banner */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Hiển thị banner</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Ẩn banner quảng cáo chèn vào ảnh truyện từ nguồn đăng tải
                    </p>
                </div>

                {bannerMode === null ? (
                    <RadioBannerSkeleton/>
                ) : (
                    <RadioGroup
                        value={bannerMode}
                        onValueChange={(v) => handleBannerMode(v as TBannerMode)}
                        className="space-y-2"
                    >
                        {BANNER_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                htmlFor={option.value}
                                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 cursor-pointer transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                            >
                                <RadioGroupItem value={option.value} id={option.value} className="mt-0.5 shrink-0"/>
                                <div className="min-w-0">
                                    <span className="text-sm font-medium text-foreground block">{option.label}</span>
                                    {option.description && (
                                        <span className="text-xs text-muted-foreground mt-0.5 block leading-relaxed">
                                            {option.description}
                                        </span>
                                    )}
                                </div>
                            </label>
                        ))}
                    </RadioGroup>
                )}
            </section>
        </div>
    )
}

export default UserSetting;