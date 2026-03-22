'use client'

// ** Next
import {useRouter, useSearchParams} from "next/navigation"

// ** Config
import {listSortByDate} from "@/configs/page"

// ** Lib
import {cn} from "@/lib/utils";

// ** Enum
import {ESortOrder} from "@/types/enum";

const SortByDate = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentSort = searchParams.get('sap-xep') ?? ESortOrder.UPDATED_AT_DESC

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (currentSort === value) {
            params.delete('sap-xep')
        } else {
            params.set('sap-xep', value)
        }

        router.push(`?${params.toString()}`)
    }

    return (
        <nav className="container flex items-baseline gap-4 pb-6">
            <p className="flex-shrink-0 text-sm dark:text-[#ffffffbd] text-[#00000057]">
                Sắp xếp
            </p>

            <ul className="flex flex-wrap text-sm">
                {listSortByDate.map((item) => {
                    const isActive = currentSort === item.value

                    return (
                        <li
                            key={item.value}
                            onClick={() => handleSort(item.value)}
                            className={cn(
                                "cursor-pointer px-[10px] py-1 transition active:text-primary",
                                isActive && "text-primary"
                            )}
                        >
                            {item.label}
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default SortByDate