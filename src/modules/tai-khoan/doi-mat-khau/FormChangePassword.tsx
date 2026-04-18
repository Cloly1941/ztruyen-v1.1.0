'use client'

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
import useMutateMethod from "@/hooks/common/useMutateMethod";

// ** Service
import {UserService} from "@/services/api/user";

// ** Config
import {CONFIG_TAG} from "@/configs/tag";

const formSchema = z.object({
    oldPassword: z.string().min(1, 'Mật khẩu cũ không được để trống'),
    newPassword: z.string().min(1, 'Mật khẩu mới không được để trống'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: 'Mật khẩu mới không được trùng mật khẩu cũ',
        path: ['newPassword'],
    });

export type TChangePasswordForm = z.infer<typeof formSchema>;

export type TChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
}

const FormChangePassword = () => {

    const {trigger, isMutating} = useMutateMethod<void, TChangePasswordPayload>({
        api: (payload) => UserService.changePassword(payload),
        key: CONFIG_TAG.AUTH.RESET,
        onSuccess: data => {
            toast.success(data.message);
        }
    });

    const form = useForm<TChangePasswordForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: TChangePasswordForm) => {
        const {confirmPassword, ...payload} = values;
        await trigger(payload);
    };

    return (
        <form id='form-change-password' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>

            {/* Old Password */}
            <Controller
                name='oldPassword'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-change-password-old'>Mật khẩu cũ</FieldLabel>
                        <InputPassword<TChangePasswordForm, 'oldPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-change-password-old"
                            placeholder='Nhập mật khẩu cũ của bạn'
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* New Password */}
            <Controller
                name='newPassword'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-change-password-new'>Mật khẩu mới</FieldLabel>
                        <InputPassword<TChangePasswordForm, 'newPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-change-password-new"
                            placeholder='Nhập mật khẩu mới của bạn'
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
                            Nhập lại mật khẩu mới
                        </FieldLabel>
                        <InputPassword<TChangePasswordForm, 'confirmPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-change-password-confirm"
                            placeholder='Nhập lại mật khẩu mới của bạn'
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            <Button type='submit' form='form-change-password' width='full' isLoading={isMutating}>
                Đổi mật khẩu
            </Button>
        </form>
    );
};

export default FormChangePassword;