'use client'

// ** React
import {useState} from "react";

// ** Next
import Link from "next/link";
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
import TurnstileWidget from "@/components/auth/TurnstileWidget";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

// ** Hooks
import {useLogin} from "@/hooks/auth/useLogin";

const formSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export type TLoginForm = z.infer<typeof formSchema>;

const FormLogin = () => {

    const [cfToken, setCfToken] = useState<string | null>(null);
    const router = useRouter()

    const {trigger, isMutating} = useLogin()

    const form = useForm<TLoginForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: TLoginForm) => {

        if (!cfToken) {
            toast.error('Vui lòng xác thực bạn không phải bot');
            return;
        }

        const res = await trigger({
            payload: values,
            cfToken,
        })

        if (!res) return

        toast.success(res.message);

        router.push('/');
    }

    return (
        <form id='form-login' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>
            {/* Email */}
            <Controller
                name='email'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-login-email'>Email</FieldLabel>
                        <Input
                            {...field}
                            id='form-login-email'
                            aria-invalid={fieldState.invalid}
                            placeholder='Email bạn dùng để đăng nhập'
                            autoComplete="email"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />


            {/* Password */}
            <Controller
                name='password'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-login-password'>Mật khẩu</FieldLabel>
                        <InputPassword<TLoginForm, 'password'>
                            field={field}
                            fieldState={fieldState}
                            id="form-login-password"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Cloudflare turnstile*/}
            <div className="mt-4">
                <TurnstileWidget onVerify={setCfToken}/>
            </div>

            <div className="flex justify-end mt-1">
                <Link
                    href="/quen-mat-khau"
                    className="text-sm text-zinc-400 hover:text-primary transition"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            <Button type='submit' form='form-login' width='full' isLoading={isMutating}>Đăng nhập</Button>
        </form>
    )
}

export default FormLogin;