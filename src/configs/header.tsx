import {CheckCircle2, Clock, Facebook, Layers, PlayCircle, Sparkles} from "lucide-react";

export const navHeader: TLinkWithIcon[] = [
    {
        title: 'Thể loại',
        href: '/the-loai/tat-ca.html',
        icon: Layers,
    },
    {
        title: 'Đang phát hành',
        href: '/danh-sach/dang-phat-hanh.html',
        icon: PlayCircle,
    },
    {
        title: 'Hoàn thành',
        href: '/danh-sach/hoan-thanh.html',
        icon: CheckCircle2,
    },
    {
        title: 'Sắp ra mắt',
        href: '/danh-sach/sap-ra-mat.html',
        icon: Clock,
    },
    {
        title: 'Truyện mới',
        href: '/danh-sach/truyen-moi.html',
        icon: Sparkles,
    },
    {
        title: 'Fanpage',
        href: 'https://www.facebook.com/profile.php?id=61582484157563',
        icon: Facebook,
    },
];