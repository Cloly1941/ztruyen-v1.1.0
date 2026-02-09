'use client'

// ** Next
import {useRouter} from "next/navigation";

// ** zod
import {z} from "zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** React hot toast
import toast from "react-hot-toast";

// ** Components
import Button from "@/components/common/Button";
import InputPassword from "@/components/common/InputPassword";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";

// ** Hooks
import {useChangePassword} from "@/hooks/auth/useChangePassword";

const formSchema = z.object({
    newPassword: z.string().min(1, 'Mật khẩu không được để trống'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

export type TChangePasswordForm = z.infer<typeof formSchema>;

type Props = {
    token?: string
}

export type TChangePasswordPayload = {
    newPassword: string;
}

const FormChangePassword = ({token}: Props) => {

    const router = useRouter()
    const {trigger, isMutating} = useChangePassword()

    const form = useForm<TChangePasswordForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: TChangePasswordForm) => {

        if (!token) {
            toast.error('Đổi mật khẩu thất bại, vui lòng thử lại sau!');
            return;
        }

        const {confirmPassword, ...rest} = values;

        const payload = {
            ...rest
        }

        const res = await trigger({
            payload,
            token,
        })

        if (res?.message) {
            toast.success(res.message)
            router.push('/dang-nhap')
        }
    }

    return (
        <form id='form-change-password' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>
            {/* Password */}
            <Controller
                name='newPassword'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-change-password-pass'>Mật khẩu</FieldLabel>
                        <InputPassword<TChangePasswordForm, 'newPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-change-password-pass"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Confirm Password */}
            <Controller
                name="confirmPassword"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-change-password-confirm">
                            Nhập lại mật khẩu
                        </FieldLabel>
                        <InputPassword<TChangePasswordForm, 'confirmPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-change-password-confirm"
                            placeholder='Nhập lại mật khẩu của bạn'
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            <Button type='submit' form='form-change-password' width='full' isLoading={isMutating}>Đổi mật khẩu</Button>
        </form>
    )
}

export default FormChangePassword;