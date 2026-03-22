'use client'

// ** Next
import {useRouter} from "next/navigation";

// ** React
import { useState } from "react"

// ** React hot toast
import toast from "react-hot-toast";

// ** Swr
import {mutate} from "swr";

// ** Zod
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// ** React hook form
import { Controller, useForm } from "react-hook-form"

// ** Shadcn ui
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// ** Component
import Button from "@/components/common/Button"

// ** Icon
import { UserRoundX } from "lucide-react"

// ** Hook
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Service
import {UserService} from "@/services/api/user";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

export const confirmDeleteSchema = (userName: string) =>
    z.object({
        confirm: z.string().min(1, "Vui lòng nhập tên xác nhận"),
    })
        .refine((data) => data.confirm === userName, {
            message: "Tên xác nhận không đúng",
            path: ["confirm"],
        })

export type TDeleteAccountForm = z.infer<
    ReturnType<typeof confirmDeleteSchema>
>

type TDialogDeleteAccount = {
    userName: string
}

const DialogDeleteAccount = ({ userName }: TDialogDeleteAccount) => {

    const router = useRouter()
    const [open, setOpen] = useState(false)

    const { trigger, isMutating } = useMutateMethod<void, void>({
        api: () => UserService.deleteProfile(),
        key: CONFIG_TAG.USER.DELETE_PROFILE,
        showToast: false,
        onSuccess: async (data) => {
            toast.success(data.message)
            await mutate(CONFIG_TAG.USER.PROFILE, null, false)
            router.refresh()
        },
    })

    const form = useForm<TDeleteAccountForm>({
        resolver: zodResolver(confirmDeleteSchema(userName)),
        defaultValues: {
            confirm: "",
        },
    })

    const onSubmit = async () => {
        await trigger()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon-sm" variant="destructive">
                    <UserRoundX />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xoá tài khoản cá nhân</DialogTitle>
                    <DialogDescription>
                        Hành động này không thể hoàn tác. Tài khoản của bạn sẽ bị xoá vĩnh viễn.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="form-delete-account"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <p className="text-sm text-muted-foreground">
                        Vui lòng nhập{" "}
                        <span className="font-bold text-destructive">{userName}</span>{" "}
                        để xác nhận xoá tài khoản.
                    </p>

                    <Controller
                        name="confirm"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="delete-account-confirm">
                                    Xác nhận tên
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id="delete-account-confirm"
                                    placeholder={`Nhập "${userName}" để xác nhận`}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Huỷ
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            variant="destructive"
                            isLoading={isMutating}
                        >
                            Xoá tài khoản
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogDeleteAccount