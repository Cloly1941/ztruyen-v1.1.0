export {};

declare global {
    interface TLink {
        title: string;
        href: string;
    }

    interface TLinkWithIcon extends TLink {
        icon: LucideIcon;
    }
}