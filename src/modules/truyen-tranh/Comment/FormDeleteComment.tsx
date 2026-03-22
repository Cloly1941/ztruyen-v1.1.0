'use client'

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

// ** Icon
import {Trash2} from "lucide-react";
import Button from "@/components/common/Button";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";
import {CommentService} from "@/services/api/comment";

type TFormDeleteComment = {
    id: string;
    mutate: () => void
}

const FormDeleteComment = ({id, mutate} :TFormDeleteComment) => {

    const {trigger, isMutating} = useMutateMethod<void, string>({
        api: (id) => CommentService.delete(id),
        key: CONFIG_TAG.COMMENT.DELETE,
        showToast: false,
        onSuccess: async (data) => {
            toast.success(data.message)
            mutate()
        }
    })

    const handleDelete = async () => {
        await trigger(id)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Trash2 className='size-4 text-red-500 cursor-pointer'/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Bạn có chắc muốn xoá bình luận này đúng không?
                        <span className="icon-text">(=^･ω･^=)</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Xóa là không còn thấy nó trong mục bình luận nữa đâu…
                        <span className="icon-text">(ฅ^ω^ฅ)</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant='outline'>
                        Thôi, tớ đổi ý rồi~
                        <span className="icon-text">(=^･^=)</span>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            sizeCustom='xs'
                            className='bg-red-600 hover:bg-red-500'
                            isLoading={isMutating}
                            onClick={() => handleDelete()}
                        >
                            Đúng vậy!
                            <span className="icon-text">(=^･ｪ･^=)/</span>
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default FormDeleteComment