'use client'

// ** Next
import Link from "next/link";


// ** React
import {useEffect, useState} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Checkbox} from "@/components/ui/checkbox";

// ** Components
import ComicImage from "@/components/common/ComicImage";

// ** Module component
import EmptyPage from "@/modules/lich-su/EmptyPage";

// ** Types
import {IHistory} from "@/types/api";

// ** Local Storage
import {historyService, IHistoryStorage} from "@/localStorage/historyServices";

// ** Skeleton
import ListComicHistorySkeleton from "@/skeletons/lich-su/ListComicHistorySkeleton";

// ** icons
import {X} from "lucide-react";

// ** Configs
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_SLUG} from "@/configs/slug";
import FormDeleteMultiHistory from "@/modules/lich-su/FormDeleteMultiHistory";
import {useRouter} from "next-nprogress-bar";


const ListComicHistory = () => {

    // ** States
    const [deleteMulti, setDeleteMulti] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [listHistory, setListHistory] = useState<IHistory[] | IHistoryStorage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const isHistory = listHistory.length > 0

    useEffect(() => {
        setListHistory(historyService.getAll());
        setIsLoading(false);
    }, []);

    const refreshHistory = () => {
        setListHistory(historyService.getAll());
    };

    const toggleSelect = (chapter_id: string, checked: boolean) => {
        setSelected((prev) =>
            checked ? [...prev, chapter_id] : prev.filter((item) => item !== chapter_id)
        );
    };

    const handleDelete = (chapter_id: string) => {
        try {
            historyService.delete(chapter_id);
            refreshHistory()
            toast.success("Meow~ Tất cả đã biến mất như phép màu ")
        } catch {
            toast.error('Hừm, có gì đó không ổn rồi...')
        }
    }

    return (
        <>
            {isLoading ? (
                <ListComicHistorySkeleton/>
            ) : (
                <section className="min-h-[54vh] container pt-2 pb-20">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-baseline">
                        <div className='section-header gap-2.5 sm:gap-4 flex-col md:flex-row py-5'>
                            <h1 className='heading py-0'>Lịch sử đọc truyện</h1>
                            <p className='desc'>Xem lại những bộ truyện bạn đã đọc (ง •̀_•́)ง</p>
                        </div>

                        {listHistory.length > 1 && (
                            <div className="flex gap-4 md:gap-2 items-center">
                                <FormDeleteMultiHistory
                                    listHistory={listHistory}
                                    deleteMulti={deleteMulti}
                                    setDeleteMulti={setDeleteMulti}
                                    selected={selected}
                                    setSelected={setSelected}
                                    onRefresh={refreshHistory}
                                />
                            </div>
                        )}
                    </div>

                    {isHistory ? (
                        <div className='mt-4'>
                            <div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-8">
                                {listHistory.map((item, i) => (
                                    <figure
                                        key={item.chapter_id}
                                        title={item?.title ?? ''}
                                        className="flex flex-col relative"
                                    >
                                        <div
                                            onClick={() => {
                                                if (deleteMulti) {
                                                    toggleSelect(item.chapter_id, !selected.includes(item.chapter_id));
                                                }
                                            }}
                                            className='cursor-pointer relative'
                                        >
                                            <ComicImage
                                                src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb}`}
                                                alt={item.title}
                                                size='full'
                                                priority={i <= 0}
                                                onClick={() => router.push(`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`)}
                                            />
                                            {deleteMulti && <div className='bg-black/60 absolute inset-0'/>}
                                        </div>

                                        <figcaption
                                            className="mt-1.5 text-center flex flex-col flex-1"
                                            title={item.chapter_name}
                                        >
                                            <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}
                                                  className='w-center-fit'>
                                                <h2 title={item.title} className='line-clamp-2 text-sm'>
                                                    {item.title}
                                                </h2>
                                            </Link>

                                            <div className="mt-auto flex flex-col gap-0.5">
                                                <Link href={`/${CONFIG_SLUG.READING}/${item.path}`}
                                                      className='w-center-fit'>
                                                    <p className="line-clamp-1 text-xs mt-1.5 text-destructive hover:underline">
                                                        Đọc tiếp chương {item.chapter_name}
                                                    </p>
                                                </Link>

                                                {item.maxReadPath && (
                                                    <Link href={`/${CONFIG_SLUG.READING}/${item.maxReadPath}`}
                                                          className='w-center-fit'>
                                                        <p className="line-clamp-1 text-xs text-muted-foreground hover:underline">
                                                            Đã đọc đến chương {item.maxReadChapterName}
                                                        </p>
                                                    </Link>
                                                )}
                                            </div>
                                        </figcaption>

                                        <div
                                            className="absolute right-0 sm:right-1.5 top-0 sm:top-1.5 p-1.5 cursor-pointer">
                                            {deleteMulti ? (
                                                <Checkbox
                                                    checked={selected.includes(item.chapter_id)}
                                                    onCheckedChange={(checked) =>
                                                        toggleSelect(item.chapter_id, checked === true)
                                                    }
                                                />
                                            ) : (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <div
                                                            className="bg-red-500/60 rounded-full hover:bg-red-400 p-1 sm:p-1.5">
                                                            <X className="size-2.5 sm:size-3 text-white"/>
                                                        </div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Hic… <span
                                                                className='text-primary dark:text-amber-500'>{item.title}</span> sắp
                                                                bị xóa khỏi lịch sử của bạn thật hả? (=^･ω･^=)
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Xóa là không còn thấy nó trong thư viện nữa đâu… (ฅ^ω^ฅ)
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel variant='outline'>
                                                                Thôi, tớ đổi ý rồi~ (=^･^=)
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(item.chapter_id)}
                                                                variant='destructive'>
                                                                Đúng vậy! (=^･ｪ･^=)/
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyPage/>
                    )}
                </section>
            )}
        </>
    )
}

export default ListComicHistory;