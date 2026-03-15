import React from 'react';
import { Search, X, Filter, RefreshCw, UserPlus } from 'lucide-react';
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
    onNewRegistration?: () => void;
    totalCount: number;
    filteredCount: number;
    isLoadingStates?: boolean;
    isRefreshing?: boolean;
    documentApprovalStatus: string;
    setDocumentApprovalStatus: (value: string) => void;
    roomAssignmentStatus: string;
    setRoomAssignmentStatus: (value: string) => void;
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
    onNewRegistration,
    totalCount,
    filteredCount,
    isLoadingStates = false,
    isRefreshing = false,
    documentApprovalStatus,
    setDocumentApprovalStatus,
    roomAssignmentStatus,
    setRoomAssignmentStatus,
}) => {
    const hasActiveFilters = searchTerm || filterState || filterMode !== 'general' || filterDate || ticketType || documentApprovalStatus || roomAssignmentStatus;

    const filterModeOptions = [
        { value: 'all', label: 'All Registrations' },
        { value: 'general', label: 'Active (Non-Cancelled)' },
        { value: 'cancelled', label: 'Cancelled Only' },
    ];

    const ticketTypeOptions = [
        { value: '', label: 'All Tickets' },
        { value: 'FLIGHT', label: 'FLIGHT' },
        { value: 'FIRST_AC', label: 'FIRST AC' },
        { value: 'SECOND_AC', label: 'SECOND AC' },
        { value: 'THIRD_AC', label: 'THIRD AC' },
        { value: 'SLEEPER', label: 'SLEEPER' },
        { value: 'WL', label: 'WL' },
        { value: 'GENERAL', label: 'GENERAL' },
        { value: 'BUS', label: 'BUS' },
        { value: 'TBS', label: 'TBS' },
        { value: 'Not added', label: 'Not Added' },
    ];

    const documentApprovalStatusOptions = [
        { value: '', label: 'All' },
        { value: 'approved', label: 'Approved' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const roomAssignmentOptions = [
        { value: '', label: 'All Room Status' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'non_assigned', label: 'Not Assigned' },
    ];

    return (
        <Card className="mb-4 bg-white/80 backdrop-blur-md border border-heritage-text/10 shadow-sm rounded-xl font-inter !p-0">
            {/* Top Toolbar */}
            <div className="p-3 md:px-4 md:py-3 border-b border-heritage-text/10 bg-gradient-to-r from-heritage-highlight/20 to-transparent flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 text-heritage-primary rounded-lg shadow-sm border border-heritage-text/10 hidden sm:block">
                        <UserPlus className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-heritage-textDark leading-tight">Yatra Registrations</h2>
                        <p className="text-[10px] font-medium text-heritage-text/60">Total: {totalCount} users</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
                    <div className="w-full sm:w-[250px] md:w-[300px] relative">
                        <Input
                            placeholder="Search name, PNR, contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search className="w-4 h-4 text-heritage-text/40" />}
                            className="h-9 text-sm bg-white border-heritage-text/10 focus:border-heritage-primary rounded-lg w-full shadow-sm"
                        />
                    </div>
                    <button
                        onClick={onRefresh}
                        title="Refresh Data"
                        disabled={isRefreshing}
                        className="h-9 w-9 border border-heritage-text/10 text-heritage-primary hover:bg-heritage-primary/5 rounded-lg flex-shrink-0 flex items-center justify-center bg-white shadow-sm transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    {onNewRegistration && (
                        <Button
                            onClick={onNewRegistration}
                            className="bg-heritage-primary hover:bg-heritage-secondary text-white h-9 px-3 rounded-lg shadow-sm text-sm font-semibold flex-shrink-0"
                        >
                            <UserPlus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">New Registration</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters Area */}
            <div className="p-3 md:px-4 md:py-3 bg-white/40">
                <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-heritage-primary/80" />
                        <h3 className="text-[10px] font-bold text-heritage-text/60 uppercase tracking-widest">
                            Refine Results {hasActiveFilters && <span className="text-heritage-primary ml-1">({filteredCount} matches)</span>}
                        </h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilterState('');
                                setFilterMode('general');
                                setFilterDate(null);
                                setTicketType('');
                                setDocumentApprovalStatus('');
                                setRoomAssignmentStatus('');
                            }}
                            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded"
                        >
                            <X className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    <SelectDropdown
                        options={filterModeOptions}
                        value={filterMode}
                        onChange={(val: any) => setFilterMode(val)}
                        placeholder="Registration Type"
                        searchable={false}
                        clearable={false}
                        className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
                    />
                    <SelectDropdown
                        options={stateOptions}
                        value={filterState}
                        onChange={setFilterState}
                        placeholder={isLoadingStates ? "Loading states..." : "All States"}
                        searchable
                        clearable
                        disabled={isLoadingStates}
                        className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
                    />
                    <SelectDropdown
                        options={ticketTypeOptions}
                        value={ticketType}
                        onChange={setTicketType}
                        placeholder="All Tickets"
                        searchable={false}
                        clearable={false}
                        className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
                    />
                    <SelectDropdown
                        options={documentApprovalStatusOptions}
                        value={documentApprovalStatus}
                        onChange={setDocumentApprovalStatus}
                        placeholder="Document Status"
                        searchable={false}
                        clearable={false}
                        className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
                    />
                    <SelectDropdown
                        options={roomAssignmentOptions}
                        value={roomAssignmentStatus}
                        onChange={setRoomAssignmentStatus}
                        placeholder="Room Assignment"
                        searchable={false}
                        clearable={false}
                        className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
                    />
                </div>
            </div>
        </Card>
    );
};

export default UserFilters;
