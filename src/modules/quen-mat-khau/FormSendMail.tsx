'use client'

// ** React
import {useState} from "react";

// ** zod
import {z} from "zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Components
import Button from "@/components/common/Button";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

// ** Hooks
import {useForgotPassword} from "@/hooks/auth/useForgotPassword";

const formSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
});

export type TForgotPassForm = z.infer<typeof formSchema>;

const FormSendMail = () => {

    const [cfToken, setCfToken] = useState<string | null>(null);

    const { trigger, isMutating } = useForgotPassword(cfToken)

    const form = useForm<TForgotPassForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (values: TForgotPassForm) => {
        trigger(values)
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

            <Button type='submit' form='form-forgot-password' width='full' isLoading={isMutating}>Gửi email</Button>
        </form>
    )
}

export default FormSendMail;