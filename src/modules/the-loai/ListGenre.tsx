// ** Module components
import NavListGenre from "@/modules/the-loai/NavListGenre";

// ** Components
import ErrorText from "@/components/common/ErrorText";

// ** Services
import {getListGenre} from "@/services/api-otruyen/categories";

type TListGenreProps = {
    slug: string;
}

const ListGenre = async ({slug}: TListGenreProps) => {
    const res = await getListGenre();

    const listGenre = res.data?.items;

    if (!listGenre) return <ErrorText/>;

    return (
        <nav className="container flex gap-4 pt-6 pb-3">
            <p className="flex-shrink-0 text-sm dark:text-[#ffffffbd] text-[#00000057]">
                Thể loại
            </p>
            <NavListGenre listGenre={listGenre}  slug={slug} />
        </nav>
    )
}

export default ListGenre