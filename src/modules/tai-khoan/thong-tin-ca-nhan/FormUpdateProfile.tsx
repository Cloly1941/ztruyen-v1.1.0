'use client'

// ** zod
import {z} from "zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Components
import Button from "@/components/common/Button";
import {Input} from "@/components/ui/input";

// ** Shadcn ui
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";

// ** lucide icons
import {CalendarIcon} from "lucide-react";

// ** date-fns
import {format} from 'date-fns';

// ** React day picke
import {vi} from 'react-day-picker/locale';

// ** Utils
import {getAgeToBirthday, getDefaultBirthdayMonth, isBirthdayValid} from "@/utils/date";

// ** Types
import {IUserProfile} from "@/types/api";

// ** Hooks
import {useUpdateProfile} from "@/hooks/user/useUpdateProfile";

const formSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    gender: z
        .string()
        .optional()
        .refine((val) => !!val, {
            message: 'Vui lòng chọn giới tính',
        })
        .refine((val) => !val || ['male', 'female', 'lgbt'].includes(val), {
            message: 'Giới tính không hợp lệ',
        }),
    bio: z.string().max(160, 'Tiểu sử không được vượt quá 160 ký tự').optional(),
    birthday: z
        .date({
            message: 'Vui lòng chọn ngày sinh',
        })
        .refine((date) => {
            const age = getAgeToBirthday(date)
            return age >= 10 && age <= 100
        }, {
            message: 'Ngày sinh không hợp lệ (10–100 tuổi)',
        }),
})

export type TUpdateProfileForm = z.infer<typeof formSchema>

export type TUpdateProfilePayload = {
    name: string
    gender?: string
    birthday: string
    age: number
    bio?: string
}

type TFormUpdateProfileProps = {
    user: IUserProfile;
}

const FormUpdateProfile = ({user}: TFormUpdateProfileProps) => {

    const {trigger, isMutating} = useUpdateProfile()

    const form = useForm<TUpdateProfileForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            gender: user.gender,
            birthday: user.birthday ? new Date(user.birthday) : undefined,
            bio: user.bio || undefined,
        },
    })

    const birthday = form.watch('birthday')

    const onSubmit = async (values: TUpdateProfileForm) => {
        const { birthday, ...rest } = values

        const payload = {
            ...rest,
            birthday: birthday.toISOString(),
            age: getAgeToBirthday(birthday),
        }

        await trigger(payload)
    }

    return (
        <form id='form-update-profile' onSubmit={form.handleSubmit(onSubmit)} className='form mt-4'>

            {/* Name */}
            <Controller
                name='name'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-profile-name'>Tên hiển thị</FieldLabel>
                        <Input
                            {...field}
                            id='form-update-profile-name'
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

            {/* Bio */}
            <Controller
                name='bio'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-profile-bio'>Tiểu sử</FieldLabel>
                        <Textarea
                            {...field}
                            id='form-update-profile-bio'
                            aria-invalid={fieldState.invalid}
                            placeholder='Tiểu sử của bạn (tối đa 160 ký tự)'
                            autoComplete="off"
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
                        <FieldLabel>Sinh nhật</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" sizeCustom='sm' className='text-muted-foreground font-text'>
                                    <CalendarIcon className="mr-2 size-4"/>
                                    {field.value
                                        ? format(field.value, 'dd/MM/yyyy', {locale: vi})
                                        : 'Chọn ngày tháng năm sinh của bạn'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="center" className='sm:!w-100'>
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

            <Field>
                <FieldLabel>Tuổi</FieldLabel>
                <Input
                    disabled
                    value={
                        birthday
                            ? getAgeToBirthday(birthday)
                            : 'Chưa cập nhật'
                    }
                />
            </Field>

            <div className='text-center mt-4'>
                <Button className='w-min text-xs lg:text-sm' type='submit' form='form-update-profile'
                        isLoading={isMutating}>Cập nhật</Button>
            </div>
        </form>
    )
}

export default FormUpdateProfile