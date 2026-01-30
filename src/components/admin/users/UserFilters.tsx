import React from 'react';
import { Search, X, Filter, RefreshCw } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DatePicker from '@/components/ui/DatePicker';
import Button from '@/components/ui/Button';

interface UserFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterState: string;
    setFilterState: (value: string) => void;
    filterMode: 'all' | 'general' | 'cancelled';
    setFilterMode: (value: 'all' | 'general' | 'cancelled') => void;
    filterDate: Date | null;
    setFilterDate: (date: Date | null) => void;
    stateOptions: { value: string; label: string }[];
    ticketType: string;
    setTicketType: (value: string) => void;
    onRefresh: () => void;
    totalCount: number;
    filteredCount: number;
    isLoadingStates?: boolean;
    isRefreshing?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    filterState,
    setFilterState,
    filterMode,
    setFilterMode,
    filterDate,
    setFilterDate,
    stateOptions,
    ticketType,
    setTicketType,
    onRefresh,
    totalCount,
    filteredCount,
    isLoadingStates = false,
    isRefreshing = false,
}) => {
    const hasActiveFilters = searchTerm || filterState || filterMode !== 'general' || filterDate || ticketType;

    const filterModeOptions = [
        { value: 'all', label: 'All Registrations' },
        { value: 'general', label: 'Active (Non-Cancelled)' },
        { value: 'cancelled', label: 'Cancelled Only' },
    ];

    const ticketTypeOptions = [
        { value: '', label: 'All Tickets' },
        { value: 'FLIGHT', label: 'FLIGHT' },
        { value: 'BUS', label: 'BUS' },
        { value: 'WL', label: 'WL' },
        { value: 'TBS', label: 'TBS' },
        { value: 'FIRST AC', label: 'FIRST AC' },
        { value: 'Not added', label: 'Not Added' },
    ];

    return (
        <Card className="mb-6 bg-white/70 backdrop-blur-md border-white/40 shadow-glass font-inter">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                {/* Search Box */}
                <div className="flex-1 lg:min-w-[300px]">
                    <Input
                        placeholder="Search by name, PNR, or contact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-5 h-5 text-gray-400" />}
                        className="h-11 bg-white/50 border-white/40 focus:bg-white transition-all"
                    />
                </div>

                {/* Registration Type Filter */}
                <div className="flex-1 lg:max-w-[220px]">
                    <SelectDropdown
                        options={filterModeOptions}
                        value={filterMode}
                        onChange={(val: any) => setFilterMode(val)}
                        placeholder="Registration Type"
                        searchable={false}
                        clearable={false}
                        className="h-11 border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20 hover:border-heritage-gold/50"
                    />
                </div>

                {/* State Filter */}
                <div className="flex-1 lg:max-w-[180px]">
                    <SelectDropdown
                        options={stateOptions}
                        value={filterState}
                        onChange={setFilterState}
                        placeholder={isLoadingStates ? "Loading states..." : "State"}
                        searchable
                        clearable
                        disabled={isLoadingStates}
                        className="h-11"
                    />
                </div>

                {/* Ticket Type Filter */}
                <div className="flex-1 lg:max-w-[180px]">
                    <SelectDropdown
                        options={ticketTypeOptions}
                        value={ticketType}
                        onChange={setTicketType}
                        placeholder="Ticket Type"
                        searchable={false}
                        clearable={false}
                        className="h-11 border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20 hover:border-heritage-gold/50"
                    />
                </div>

                {/* Refresh Button */}
                <Button
                    variant="outline"
                    onClick={onRefresh}
                    title="Refresh Data"
                    disabled={isRefreshing}
                    className="h-11 border-heritage-gold/30 text-heritage-primary hover:bg-heritage-primary/5 min-w-[44px] px-2 shadow-sm"
                >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('');
                            setFilterState('');
                            setFilterMode('general');
                            setFilterDate(null);
                            setTicketType('');
                        }}
                        className="lg:min-w-[120px] h-11 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Results Count */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-200/50">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-heritage-primary" />
                        <span className="text-sm font-medium text-heritage-text/70">
                            Showing {filteredCount} of {totalCount} registrations
                        </span>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default UserFilters;
