'use client'

// ** Shadcn ui
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

// ** Component
import Button from "@/components/common/Button";

// ** Icon
import {Trash} from "lucide-react";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Service
import {FavoriteService} from "@/services/api/favorite";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

// ** React hot toast
import toast from "react-hot-toast";


// ** SWR
import {KeyedMutator} from "swr";

// ** Type
import {IFavorite} from "@/types/api";

// ** Lib
import {invalidateFavoriteMulti} from "@/lib/invalidate-cache/invalidateFavorite";

type TDeleteMultiBtn = {
    listFavorite: IFavorite[];
    deleteMulti: boolean;
    setDeleteMulti: (value: boolean) => void
    selected: string[]
    setSelected: (ids: string[]) => void
    mutate: KeyedMutator<IModelPaginate<IFavorite>>
}

const FormDeleteMulti = (
    {
        deleteMulti, setDeleteMulti, selected, setSelected, listFavorite
    }: TDeleteMultiBtn) => {

    const {trigger: deleteMultiTrigger, isMutating} = useMutateMethod<void, string[]>({
        api: (ids) => FavoriteService.deleteMulti(ids),
        key: CONFIG_TAG.FAVORITE.DELETE_MULTI,
        showToast: false,
        onSuccess: async (data) => {
            toast.success(data.message)
            setSelected([])
            setDeleteMulti(false)
            const slugs = listFavorite
                .filter(item => selected.includes(item._id))
                .map(item => item.comic_slug)
            await invalidateFavoriteMulti(slugs)
        }
    })

    const handleMultiDelete = async () => {
        await deleteMultiTrigger(selected)
    }

    const handleSelectAll = () => {
        if (selected.length === listFavorite.length) {
            setSelected([]);
        } else {
            setSelected(listFavorite.map((item) => item._id));
        }
    }

    if (deleteMulti) return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        sizeCustom='xs'
                        variant='ghost'
                        className="text-red-600 dark:text-red-400 hover:text-red-600"
                        disabled={selected.length === 0}
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
                        <AlertDialogAction asChild>
                            <Button
                                sizeCustom='xs'
                                className='bg-red-600 hover:bg-red-500'
                                isLoading={isMutating}
                                onClick={handleMultiDelete}
                            >
                                Đúng vậy! (=^･ｪ･^=)/
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Selected/unSelected all Btn*/}
            <Button
                sizeCustom='xs'
                variant='ghost'
                onClick={handleSelectAll}
                className={`${selected.length === listFavorite.length ? 'text-black/80 dark:text-white/80 hover:opacity-80' : 'text-primary opacity-80'}`}
            >
                {selected.length === listFavorite.length
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả'}
            </Button>
            {/* End Selected/unSelected all Btn*/}

            {/* Cancel Btn*/}
            <Button
                sizeCustom='xs'
                variant='ghost'
                onClick={() => {
                    setDeleteMulti(false);
                    setSelected([]);
                }}
            >
                Huỷ
            </Button>
            {/* End Cancel Btn*/}
        </>
    )

    return (
        <Button
            sizeCustom='xs'
            variant='ghost'
            className="text-red-600 dark:text-red-400 hover:text-red-600"
            onClick={() => setDeleteMulti(true)}
        >
            <Trash className="size-3 sm:size-4"/>
            Xoá nhiều truyện
        </Button>
    )
}

export default FormDeleteMulti