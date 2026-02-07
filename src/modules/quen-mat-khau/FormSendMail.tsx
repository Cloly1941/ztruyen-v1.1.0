'use client'

// ** React
import {useState} from "react";

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
import TurnstileWidget from "@/components/auth/TurnstileWidget";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

// ** Services
import {AuthService} from "@/services/auth";

const formSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
});

export type TForgotPassForm = z.infer<typeof formSchema>;

const FormSendMail = () => {

    const [cfToken, setCfToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    const form = useForm<TForgotPassForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (values: TForgotPassForm) => {

        if (!cfToken) {
            toast.error('Vui lòng xác thực bạn không phải bot');
            return;
        }

        setLoading(true);

        try {
            const res = await AuthService.forgotPassword(values, cfToken);

            toast.success(res.message);

            router.push('/');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Đã có lỗi xảy ra khi gửi email, vui lòng thử lại sau!');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id='form-forgot-password' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>
            {/* Email */}
            <Controller
                name='email'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-forgot-password-email'>Email</FieldLabel>
                        <Input
                            {...field}
                            id='form-forgot-password-email'
                            aria-invalid={fieldState.invalid}
                            placeholder='Nhập email của bạn'
                            autoComplete="email"
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

            <Button type='submit' form='form-forgot-password' width='full' isLoading={loading}>Gửi email</Button>
        </form>
    )
}

export default FormSendMail;