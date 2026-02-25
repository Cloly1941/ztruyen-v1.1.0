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
import Button from "@/components/common/Button";
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
import {Trash, X} from "lucide-react";

// ** Configs
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_SLUG} from "@/configs/slug";


const ListComicHistory = () => {

    // States
    const [deleteAll, setDeleteAll] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [listHistory, setListHistory] = useState<IHistory[] | IHistoryStorage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isHistory = listHistory.length > 0

    // Load history when mount
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

    const handleSelectAll = () => {
        if (selected.length === listHistory.length) {
            setSelected([]);
        } else {
            setSelected(listHistory.map((item) => item.chapter_id));
        }
    };

    // delete
    const handleDelete = (chapter_id: string) => {
        try {
            historyService.delete(chapter_id);
            refreshHistory()
            toast.success("Meow~ Tất cả đã biến mất như phép màu ")
        } catch {
            toast.error('Hừm, có gì đó không ổn rồi...')
        }
    }

    const handleDeleteMultiple = () => {
        if (selected.length > 0) {
            historyService.deleteMany(selected)
            refreshHistory()
            toast.success("Meow~ Tất cả đã biến mất như phép màu ")
            setDeleteAll(false);
            setSelected([]);
        } else {
            toast.error('Hãy chọn ít nhất 1 truyện nhé...')
        }
    };

    if (isLoading) return <ListComicHistorySkeleton />

    return (
        <section className="min-h-[54vh] container pt-2 pb-20">
            <div className="flex flex-col lg:flex-row justify-between lg:items-baseline">
               <div className='section-header gap-2.5 sm:gap-4 flex-col md:flex-row py-5'>
                   <h1 className='heading py-0'>Lịch sử đọc truyện</h1>
                   <p className='desc'>Xem lại những bộ truyện bạn đã đọc (ง •̀_•́)ง</p>
               </div>

                {/*  Btns  */}
                {listHistory.length > 1 && (
                    <div className="flex gap-4 md:gap-2 items-center">
                        {
                            isHistory &&
                            // ** Btn Action delete all
                            (deleteAll ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            sizeCustom='xs'
                                            variant='ghost'
                                            className="text-red-600 dark:text-red-400 hover:text-red-600"
                                        >
                                            <Trash className="size-3 sm:size-4"/>
                                            Xác nhận xoá
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Meoow… Bạn chắc chắn muốn xóa hết đống truyện chưa đọc hết này hả? (=^･ω･^=)
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Xóa là biến mất vĩnh viễn khỏi thư viện của bạn luôn nha… ~ (≧ᆺ≦)
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel variant='outline'>
                                                Thôi, tớ đổi ý rồi~ (ฅ^ω^ฅ)
                                            </AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteMultiple} variant='destructive'>
                                                Đúng vậy! (=^･ｪ･^=)/
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <Button
                                    sizeCustom='xs'
                                    variant='ghost'
                                    className="text-red-600 dark:text-red-400 hover:text-red-600"
                                    onClick={() => setDeleteAll(true)}
                                >
                                    <Trash className="size-3 sm:size-4"/>
                                    Xoá nhiều truyện
                                </Button>
                            ))
                            // ** End Btn Action delete all
                        }

                        {deleteAll && isHistory && (
                            <>
                                {/* Selected/unSelected all Btn*/}
                                <Button
                                    sizeCustom='xs'
                                    variant='ghost'
                                    onClick={handleSelectAll}
                                    className={`${selected.length === listHistory.length ? 'text-black/80 dark:text-white/80 hover:opacity-80' : 'text-primary opacity-80'}`}
                                >
                                    {selected.length === listHistory.length
                                        ? 'Bỏ chọn tất cả'
                                        : 'Chọn tất cả'}
                                </Button>
                                {/* End Selected/unSelected all Btn*/}

                                {/* Cancel Btn*/}
                                <Button
                                    sizeCustom='xs'
                                    variant='ghost'
                                    onClick={() => {
                                        setDeleteAll(false);
                                        setSelected([]);
                                    }}
                                >
                                    Huỷ
                                </Button>
                                {/* End Cancel Btn*/}
                            </>
                        )}
                    </div>
                )}
            </div>


            {/*  List Comic  */}
            {isHistory ? (
                <div className='mt-4'>
                    <div
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-8">
                        {listHistory.map((item, i) => (
                            <figure
                                key={item.chapter_id}
                                title={item?.title ?? ''}
                                className="flex flex-col relative"
                            >
                                <div
                                    onClick={() => {
                                        if (deleteAll) {
                                            toggleSelect(
                                                item.chapter_id,
                                                !selected.includes(item.chapter_id)
                                            );
                                        }
                                    }}
                                    className={
                                        deleteAll ? 'cursor-pointer' : ''
                                    }
                                >
                                    <ComicImage
                                        src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.thumb}`}
                                        alt={item.title}
                                        imgSize="lg"
                                        priority={i <= 0}
                                    />
                                </div>

                                <figcaption
                                    className="mt-1.5 text-center flex flex-col flex-1"
                                    title={item.chapter_name}
                                >
                                    <Link href={`/${CONFIG_SLUG.DETAIL}/${item.slug}.html`}>
                                        <h2 title={item.title} className='line-clamp-2 text-sm'>
                                            {item.title}
                                        </h2>
                                    </Link>
                                    <Link href={`/${CONFIG_SLUG.READING}/${item.path}`} className='mt-auto'>
                                        <p className="line-clamp-1 text-xs mt-1.5 text-destructive hover:underline">
                                            Đọc tiếp chương {item.chapter_name}
                                        </p>
                                    </Link>
                                </figcaption>

                                <div className="absolute right-0 sm:right-1.5 top-0 sm:top-1.5 p-1.5 cursor-pointer">
                                    {deleteAll ? (
                                        <Checkbox
                                            checked={selected.includes(item.chapter_id)}
                                            onCheckedChange={(checked) =>
                                                toggleSelect(
                                                    item.chapter_id,
                                                    checked === true
                                                )
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
                                                        Hic… {item.title} sắp bị xóa khỏi bookmark của bạn thật hả? (=^･ω･^=)
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Xóa là không còn thấy nó trong thư viện nữa đâu… (ฅ^ω^ฅ)
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel variant='outline'>
                                                        Thôi, tớ đổi ý rồi~ (=^･^=)
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(item.chapter_id)}>
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

                    {/*<PaginationWithLinks*/}
                    {/*    page={1}*/}
                    {/*    pageSize={1}*/}
                    {/*    totalCount={10}*/}
                    {/*/>*/}
                </div>
            ) : (
                <EmptyPage/>
            )}
        </section>
    )
}

export default ListComicHistory;