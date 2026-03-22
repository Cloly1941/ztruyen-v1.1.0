'use client'

// ** Next
import Link from "next/link";

// ** React hot toast
import toast from "react-hot-toast";
import {Dispatch, SetStateAction} from "react";

// ** Component
import ComicImage from "@/components/common/ComicImage";
import Button from "@/components/common/Button";

// ** Config
import {CONFIG_API_OTRUYEN} from "@/configs/api-otruyen";
import {CONFIG_SLUG} from "@/configs/slug";
import {CONFIG_TAG} from "@/configs/tag";

// ** Type
import {IFavorite} from "@/types/api";

// ** Shadcn ui
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Checkbox} from "@/components/ui/checkbox";

// ** Icon
import {X} from "lucide-react";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Service
import {FavoriteService} from "@/services/api/favorite";

// ** Lib
import {invalidateFavorite} from "@/lib/invalidate-cache/invalidateFavorite";

type TFormDeleteFavorite = {
    listFavorite: IFavorite[]
    deleteMulti: boolean
    selected: string[]
    setSelected: Dispatch<SetStateAction<string[]>>
}
const FormDeleteFavorite = ({listFavorite, deleteMulti, setSelected, selected}: TFormDeleteFavorite) => {

    const {trigger: deleteOne, isMutating} = useMutateMethod<void, string>({
        api: (id) => FavoriteService.delete(id),
        key: CONFIG_TAG.FAVORITE.DELETE,
        showToast: false,
        onSuccess: async (data) => {
            toast.success(data.message)
        }
    })

    const handleDelete = async (id: string, slug: string) => {
        await deleteOne(id)
        await invalidateFavorite(slug)
    }

    const toggleSelect = (id: string, checked: boolean) => {
        setSelected((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    return (
        <div
            className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-2 md:gap-2.5 lg:gap-3 mb-4'>
            {
                listFavorite.map((item: IFavorite, i) => (
                    <figure
                        key={item._id}
                        title={item.comic_name}
                        className="flex flex-col relative"
                    >

                        {
                            deleteMulti ? (
                                <div
                                    onClick={() =>
                                        toggleSelect(
                                            item._id,
                                            !selected.includes(item._id)
                                        )
                                    }
                                    className='cursor-pointer relative  '
                                >
                                    <ComicImage
                                        src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.comic_cover}`}
                                        imgSize="lg"
                                        alt={item.comic_name}
                                        priority={i <= 0}
                                    />
                                    <div className='bg-black/60 absolute inset-0'/>
                                </div>
                            ) : (
                                <Link href={`/${CONFIG_SLUG.DETAIL}/${item.comic_slug}`}>
                                    <ComicImage
                                        src={`${CONFIG_API_OTRUYEN.IMAGE_COMIC}/${item.comic_cover}`}
                                        imgSize="lg"
                                        alt={item.comic_name}
                                        priority={i <= 0}
                                    />
                                </Link>
                            )
                        }

                        <figcaption
                            className="mt-1.5 text-center"
                            title={item.comic_name}
                        >
                            <h2 className='text-sm line-clamp-2'>
                                <Link href={`/${CONFIG_SLUG.DETAIL}/${item.comic_slug}`}>
                                    {item.comic_name}
                                </Link>
                            </h2>
                        </figcaption>
                        {/*  Btn Delete  */}
                        <div className="absolute right-0 sm:right-1.5 top-0 sm:top-1.5 p-1.5 cursor-pointer">
                            {deleteMulti ? (
                                // Delete Multi
                                <Checkbox
                                    checked={selected.includes(item._id)}
                                    onCheckedChange={(checked) =>
                                        toggleSelect(
                                            item._id,
                                            checked === true
                                        )
                                    }
                                />
                            ) : (
                                // Delete one
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
                                                Hic… <span className='text-primary mx-'>{item.comic_name}</span> sắp bị xóa khỏi danh sách yêu thích của bạn
                                                thật hả? (=^･ω･^=)
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Xóa là không còn thấy nó trong danh sách yêu thích nữa đâu… (ฅ^ω^ฅ)
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel variant='outline'>
                                                Thôi, tớ đổi ý rồi~ (=^･^=)
                                            </AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button
                                                    sizeCustom='xs'
                                                    className='bg-red-600 hover:bg-red-500'
                                                    isLoading={isMutating}
                                                    onClick={() => handleDelete(item._id, item.comic_slug)}
                                                >
                                                    Đúng vậy! (=^･ｪ･^=)/
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </figure>
                ))
            }
        </div>
    )
}

export default FormDeleteFavorite