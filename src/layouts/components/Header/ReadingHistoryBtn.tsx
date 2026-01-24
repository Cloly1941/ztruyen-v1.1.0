'use client';

// ** Next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ** Components
import Button from '@/components/common/Button';

// Lucide Icon
import { History } from 'lucide-react';

const ReadingHistoryBtn = () => {
    const pathCurrent = usePathname();
    const pathName = '/lich-su.html'
    const isReadingHistoryPage = pathCurrent === pathName

    return (
        <Link href={pathName} title="Lịch sử đọc truyện">
            <Button variant="ghost">
                <History  className={`${isReadingHistoryPage ? 'text-primary' : ''} size-4`}/>
            </Button>
        </Link>
    );
};

export default ReadingHistoryBtn;