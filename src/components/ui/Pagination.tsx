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
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
            <div className="text-sm text-heritage-text/70">
                Showing <span className="font-semibold text-heritage-textDark">{startItem}</span> to{' '}
                <span className="font-semibold text-heritage-textDark">{endItem}</span> of{' '}
                <span className="font-semibold text-heritage-textDark">{totalItems}</span> entries
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/50 disabled:hover:text-kesari-dark transition-all duration-300 ease-in-out"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Logic to show a window of pages around current page
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                            if (currentPage > 3) {
                                pageNum = currentPage - 3 + i;
                            }
                            if (pageNum > totalPages) {
                                pageNum = totalPages - (4 - i);
                            }
                        }

                        // Ensure pageNum is valid
                        if (pageNum < 1) pageNum = i + 1;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${currentPage === pageNum
                                    ? 'bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-lg shadow-kesari-dark/30 scale-105'
                                    : 'bg-white/60 text-kesari-darker border-2 border-kesari-light/40 hover:bg-kesari-light/20 hover:border-kesari-dark hover:text-kesari-dark hover:shadow-md'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/50 disabled:hover:text-kesari-dark transition-all duration-300 ease-in-out"
                    title="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
