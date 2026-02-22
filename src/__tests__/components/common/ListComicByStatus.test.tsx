// ** Testing Library
import { render, screen } from '@testing-library/react';

// =====================
// Mock Services
// =====================
jest.mock('@/services/api-otruyen/categories', () => ({
    getListByGender: jest.fn(),
}));

jest.mock('@/services/api-otruyen/list', () => ({
    getListByStatus: jest.fn(),
}));

// =====================
// Mock Components
// =====================
import React from 'react';

jest.mock('@/components/common/ErrorText', () => {
    const ErrorText = () => <div data-testid="error-text">Error</div>;
    ErrorText.displayName = 'ErrorTextMock';
    return ErrorText;
});

jest.mock('@/components/common/Pagination', () => {
    type Props = {
        page: number;
        pageSize: number;
        totalCount: number;
    };

    const Pagination = ({ page, pageSize, totalCount }: Props) => (
        <div data-testid="pagination">
            page:{page}-size:{pageSize}-total:{totalCount}
        </div>
    );

    Pagination.displayName = 'PaginationMock';

    return {
        Pagination,
    };
});

jest.mock('@/components/common/ComicImage', () => {
    type Props = {
        alt: string;
    };

    const ComicImage = ({ alt }: Props) => (
        <img data-testid="comic-image" alt={alt} />
    );

    ComicImage.displayName = 'ComicImageMock';

    return ComicImage;
});

jest.mock('@/components/common/Tag', () => {
    type Props = {
        children: React.ReactNode;
    };

    const Tag = ({ children }: Props) => (
        <a data-testid="tag">{children}</a>
    );

    Tag.displayName = 'TagMock';

    return Tag;
});

// =====================
// Mock Utils
// =====================
jest.mock('@/utils/covertSortQuery', () => ({
    convertSortQuery: jest.fn(() => ({
        sortField: 'updatedAt',
        sortType: 'desc',
    })),
}));

jest.mock('@/utils/getIdFromUrl', () => jest.fn(() => '123'));

// =====================
// Imports after mocks
// =====================
import { ESlug, ESortOrder } from '@/types/enum';
import { getListByStatus } from '@/services/api-otruyen/list';
import { getListByGender } from '@/services/api-otruyen/categories';
import ListComicByStatus from '@/components/common/ListComicByStatus';

// =====================
// Mock Data
// =====================
const mockResponse = {
    data: {
        params: {
            pagination: {
                totalItems: 48,
            },
        },
        items: [
            {
                name: 'One Piece',
                slug: 'one-piece',
                thumb_url: 'onepiece.jpg',
                chaptersLatest: [
                    {
                        chapter_name: '1100',
                        chapter_api_data: '/api/chapter/1100',
                    },
                ],
            },
        ],
    },
};

describe('ListComicByStatus - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call getListByStatus with ESlug.NEW when slug is "tat-ca"', async () => {
        (getListByStatus as jest.Mock).mockResolvedValueOnce(mockResponse);

        const ui = await ListComicByStatus({
            slug: 'tat-ca',
            pageQuery: 1,
            sortQuery: ESortOrder.UPDATED_AT_DESC,
        });

        render(ui);

        expect(getListByStatus).toHaveBeenCalledWith(
            ESlug.NEW,
            1,
            'updatedAt',
            'desc'
        );

        expect(screen.getByText('One Piece')).toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
        expect(screen.getByTestId('tag')).toBeInTheDocument();
    });

    it('should call getListByStatus when slug is a valid status (ESlug.NEW)', async () => {
        (getListByStatus as jest.Mock).mockResolvedValueOnce(mockResponse);

        const ui = await ListComicByStatus({
            slug: ESlug.NEW,
            pageQuery: 2,
            sortQuery: ESortOrder.UPDATED_AT_ASC,
        });

        render(ui);

        expect(getListByStatus).toHaveBeenCalled();
        expect(screen.getByText('One Piece')).toBeInTheDocument();
    });

    it('should call getListByGender when slug is not a status', async () => {
        (getListByGender as jest.Mock).mockResolvedValueOnce(mockResponse);

        const ui = await ListComicByStatus({
            slug: 'romance',
            pageQuery: 1,
            sortQuery: ESortOrder.UPDATED_AT_DESC,
        });

        render(ui);

        expect(getListByGender).toHaveBeenCalledWith(
            'romance',
            1,
            'updatedAt',
            'desc'
        );

        expect(screen.getByText('One Piece')).toBeInTheDocument();
    });

    it('should render ErrorText when API returns no items', async () => {
        (getListByStatus as jest.Mock).mockResolvedValueOnce({
            data: {
                params: {
                    pagination: {
                        totalItems: 0,
                    },
                },
                items: undefined,
            },
        });

        const ui = await ListComicByStatus({
            slug: ESlug.NEW,
            pageQuery: 1,
            sortQuery: ESortOrder.UPDATED_AT_DESC,
        });

        render(ui);

        expect(screen.getByTestId('error-text')).toBeInTheDocument();
    });
});