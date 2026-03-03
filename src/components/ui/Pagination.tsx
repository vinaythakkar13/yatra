import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    className = '',
}) => {
    const [jumpPage, setJumpPage] = React.useState<string>(currentPage.toString());

    // Update jumpPage when currentPage changes from outside
    React.useEffect(() => {
        setJumpPage(currentPage.toString());
    }, [currentPage]);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    const handleJump = () => {
        const pageNum = parseInt(jumpPage);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
        } else {
            setJumpPage(currentPage.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJump();
        }
    };

    // Page builder: always show 1, last, current-1, current, current+1 with "..."
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        // Always add first page
        pages.push(1);

        // Add left dots if needed
        if (currentPage > 3) pages.push('...');

        // Middle pages (current - 1, current, current + 1)
        for (let page = currentPage - 1; page <= currentPage + 1; page++) {
            if (page > 1 && page < totalPages) pages.push(page);
        }

        // Add right dots if needed
        if (currentPage < totalPages - 2) pages.push('...');

        // Always add last page
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
            <div className="text-sm text-heritage-text/70">
                Showing <span className="font-semibold text-heritage-textDark">{startItem}</span> to{' '}
                <span className="font-semibold text-heritage-textDark">{endItem}</span> of{' '}
                <span className="font-semibold text-heritage-textDark">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-2">


                {/* Jump to Page Input */}
                <div className="flex items-center gap-2 mr-2 pr-3 border-r border-kesari-dark/20">
                    <span className="text-xs font-semibold text-kesari-dark/80 whitespace-nowrap hidden md:inline">Jump to:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleJump}
                        className="w-12 h-9 px-1.5 text-center text-sm font-bold bg-white/60 border-2 border-kesari-light/40 rounded-lg text-kesari-dark outline-none focus:border-kesari-dark focus:ring-1 focus:ring-kesari-dark shadow-sm transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Previous Button */}
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page Buttons */}
                <div className="flex items-center gap-1.5">
                    {pages.map((page, index) =>
                        page === '...' ? (
                            <span key={`dots-${index}`} className="px-2 text-kesari-dark/60">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${currentPage === page
                                    ? 'bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-lg shadow-kesari-dark/30 scale-105'
                                    : 'bg-white/60 text-kesari-darker border-2 border-kesari-light/40 hover:bg-kesari-light/20 hover:border-kesari-dark hover:text-kesari-dark hover:shadow-md'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Next Button */}
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>

            </div>
        </div>
    );
};

export default Pagination;
