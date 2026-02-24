// ** Link
import Link from "next/link";

// ** Type
import type {IOtruyenDetailComic} from '@/types/api.otruyen'

// ** Icon
import {CalendarRange, CircleUser, Heart, Home, Tag, User, Wifi} from "lucide-react";

// ** Config
import {CONFIG_SLUG} from "@/configs/slug";

// ** Util
import {convertStatusToVi} from "@/utils/convertStatusComicToVi";

// ** Enum
import {ESortOrder} from "@/types/enum";

export const navAccount: TLinkWithIcon[] = [
    {
        title: 'Trang chủ tài khoản',
        href: '/tai-khoan/trang-chu',
        icon: Home,
    },
    {
        title: 'Thông tin của tôi',
        href: '/tai-khoan/thong-tin-ca-nhan',
        icon: User,
    },
    {
        title: 'Ảnh đại diện',
        href: '/tai-khoan/anh-dai-dien',
        icon: CircleUser,
    },
    {
        title: 'Truyện yêu thích',
        href: '/tai-khoan/truyen-yeu-thich',
        icon: Heart,
    }
]

// ** Detail
export const buildMetaList = (detailComic: IOtruyenDetailComic) => [
    {
        key: 'author',
        icon: User,
        label: 'Tác giả',
        align: 'start' as const,
        render: () => (
            <ul className="flex gap-2 flex-wrap text-sm">
                {detailComic.author.map((author, index) => (
                    <li key={index}>
                        {author.length === 0 ? 'Đang cập nhật' : author}
                        {index < detailComic.author.length - 1 && ','}
                    </li>
                ))}
            </ul>
        ),
    },
    {
        key: 'status',
        icon: Wifi,
        label: 'Trạng thái',
        render: () => (
            <ul className="flex gap-2 flex-wrap text-sm">
                <li>{convertStatusToVi(detailComic.status)}</li>
            </ul>
        ),
    },
    {
        key: 'totalChapter',
        icon: CalendarRange,
        label: 'Tổng số chương',
        render: () => {
            if (detailComic.chapters.length === 0) return 0;
            const lastChapter =
                detailComic.chapters[0].server_data?.[
                detailComic.chapters[0].server_data.length - 1
                    ]?.chapter_name

            return (
                <span className="text-sm">{lastChapter}</span>
            )
        },
    },
    {
        key: 'category',
        icon: Tag,
        label: 'Thể loại',
        align: 'start' as const,
        render: () => (
            <ul className="flex gap-2 flex-wrap text-sm mt-0.5">
                {detailComic.category.map((category, index) => (
                    <li
                        key={index}
                        className="text-link"
                    >
                        <Link href={`/${CONFIG_SLUG.GENRE}/${category.slug}.html`}>
                            {category.name}
                            {index < detailComic.category.length - 1 && ','}
                        </Link>
                    </li>
                ))}
            </ul>
        ),
    },
]


// ** Genre
export const listSortByDate = [
    {
        label: 'Mới nhất',
        value: ESortOrder.UPDATED_AT_DESC
    },
    {
        label: 'Cũ nhất',
        value: ESortOrder.UPDATED_AT_ASC
    }
]

