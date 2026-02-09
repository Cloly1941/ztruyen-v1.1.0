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
import {Input} from "@/components/ui/input";
import InputPassword from "@/components/common/InputPassword";
import TurnstileWidget from "@/components/auth/TurnstileWidget";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";

// ** lucide icons
import {CalendarIcon} from "lucide-react";

// ** date-fns
import {format} from 'date-fns';

// ** React day picke
import {vi} from 'react-day-picker/locale';

// ** Utils
import {getAgeToBirthday, getDefaultBirthdayMonth, isBirthdayValid} from "@/utils/date";

// ** Hooks
import {useRegister} from "@/hooks/auth/useRegister";

const formSchema = z
    .object({
        name: z.string().min(1, 'Tên không được để trống'),
        email: z.string().email({message: 'Email không hợp lệ'}),
        password: z.string().min(1, 'Mật khẩu không được để trống'),
        confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
        gender: z
            .string()
            .optional()
            .refine((val) => !!val, {
                message: 'Vui lòng chọn giới tính',
            })
            .refine((val) => !val || ['male', 'female', 'lgbt'].includes(val), {
                message: 'Giới tính không hợp lệ',
            }),
        birthday: z
            .date({
                message: 'Vui lòng chọn ngày sinh',
            })
            .refine((date) => {
                const age = getAgeToBirthday(date);
                return age >= 10 && age <= 100;
            }, {
                message: 'Vui lòng chọn ngày sinh phù hợp (từ 10 đến 100 tuổi)'
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

export type TRegisterForm = z.infer<typeof formSchema>;

export type TRegisterPayload = {
    name: string;
    email: string;
    password: string;
    gender?: string;
    birthday: string;
    age: number;
}

const FormRegister = () => {

    const router = useRouter()
    const [cfToken, setCfToken] = useState<string | null>(null);

    const {trigger, isMutating} = useRegister()

    const form = useForm<TRegisterForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: undefined,
            birthday: undefined,
        },
    });

    const onSubmit = async (values: TRegisterForm) => {

        if (!cfToken) {
            toast.error('Vui lòng xác thực bạn không phải bot');
            return;
        }

        const {confirmPassword, birthday, ...rest} = values;

        const payload = {
            ...rest,
            birthday: birthday.toISOString(),
            age: getAgeToBirthday(birthday),
        }

        const res = await trigger({
            payload,
            cfToken,
        })

        toast.success(res.message);

        router.push('/dang-nhap');
    }

    return (
        <form id='form-register' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>

            {/* Name */}
            <Controller
                name='name'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-register-name'>Tên hiển thị</FieldLabel>
                        <Input
                            {...field}
                            id='form-register-name'
                            aria-invalid={fieldState.invalid}
                            placeholder='Tên hiển thị của bạn'
                            autoComplete="name"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Email */}
            <Controller
                name='email'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-register-email'>Email</FieldLabel>
                        <Input
                            {...field}
                            id='form-register-email'
                            aria-invalid={fieldState.invalid}
                            placeholder='Email bạn dùng để đăng ký'
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
                        <FieldLabel htmlFor='form-register-password'>Mật khẩu</FieldLabel>
                        <InputPassword<TRegisterForm, 'password'>
                            field={field}
                            fieldState={fieldState}
                            id="form-register-password"
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
                        <FieldLabel htmlFor="form-register-confirm-password">
                            Nhập lại mật khẩu
                        </FieldLabel>
                        <InputPassword<TRegisterForm, 'confirmPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-register-confirm-password"
                            placeholder='Nhập lại mật khẩu của bạn'
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Gender */}
            <Controller
                name="gender"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Giới tính</FieldLabel>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn giới tính"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="lgbt">LGBT</SelectItem>
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Birthday */}
            <Controller
                name='birthday'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Ngày sinh</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" sizeCustom='sm' className='text-muted-foreground font-text'>
                                    <CalendarIcon className="mr-2 size-4"/>
                                    {field.value
                                        ? format(field.value, 'dd/MM/yyyy', {locale: vi})
                                        : 'Chọn ngày sinh của bạn'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                                <Calendar
                                    className='w-full'
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    defaultMonth={getDefaultBirthdayMonth()}
                                    captionLayout="dropdown"
                                    disabled={(date) => !isBirthdayValid(date)}
                                    locale={vi}
                                    formatters={{
                                        formatMonthDropdown: (date) =>
                                            format(date, "MMMM", {locale: vi}),
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
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

            <Button type='submit' form='form-register' width='full' isLoading={isMutating}>Đăng ký</Button>
        </form>
    )
}

export default FormRegister;