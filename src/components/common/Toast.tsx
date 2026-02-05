// ** React hot toast
import { Toaster } from 'react-hot-toast';

const Toast = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className:
                    '!bg-primary !text-white px-4 py-2 font-ui',
                duration: 3000,

                success: {
                    className: '!text-xs !bg-primary !text-white font-ui',
                    icon: '(=^･ｪ･^=)/',
                },

                error: {
                    className: '!text-xs !bg-red-400 !text-white font-ui',
                    icon: '(=ＴェＴ=)',
                },
            }}
        />
    )
}

export default Toast;