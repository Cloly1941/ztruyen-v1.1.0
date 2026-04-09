'use client'

// ** Service
import {CommentService} from "@/services/api/comment";

// ** React
import {useState} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** React hook form
import {Controller, useForm} from "react-hook-form";

// ** Zod
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

// ** Icon
import {TriangleAlert} from "lucide-react";

// ** Shadcn ui
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";

// ** Component
import Button from "@/components/common/Button";

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

export const reportCommentSchema = z.object({
    reason: z.string()
        .min(4, "Lý do phải có ít nhất 4 ký tự")
        .max(500, "Lý do không được quá 500 ký tự"),
})

export type TReportCommentForm = z.infer<typeof reportCommentSchema>

export type TFormReportCommentPayload = {
    commentId: string;
    reason: string;
}

type TFormReportCommentProps = {
    commentId: string;
}

const FormReportComment = ({ commentId }: TFormReportCommentProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<TReportCommentForm>({
        resolver: zodResolver(reportCommentSchema),
        defaultValues: {
            reason: "",
        },
    })

    const { trigger, isMutating } = useMutateMethod<void, TFormReportCommentPayload>({
        api: (payload) => CommentService.report(payload),
        key: CONFIG_TAG.COMMENT.REPORT,
        onSuccess: async (data) => {
            toast.success(data.message)
            setOpen(false)
            form.reset()
        },
    })

    const onSubmit = async (data: TReportCommentForm) => {
        await trigger({
            commentId,
            reason: data.reason,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <TriangleAlert className='size-3.5 sm:size-4 text-red-500 cursor-pointer'/>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Báo cáo bình luận này</DialogTitle>
                </DialogHeader>

                <form
                    id="form-report-comment"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        name="reason"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="report-comment-reason">
                                    Lý do báo cáo
                                </FieldLabel>

                                <Textarea
                                    {...field}
                                    id="report-comment-reason"
                                    placeholder='Nhập lý do để báo cáo bình luận này (ít nhất 4 ký tự)'
                                    rows={4}
                                    disabled={isMutating}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isMutating}
                            >
                                Huỷ
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isMutating}
                            isLoading={isMutating}
                        >
                            Báo cáo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FormReportComment