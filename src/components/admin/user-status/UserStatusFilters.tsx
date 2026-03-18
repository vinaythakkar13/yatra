import React from 'react';
import { Search, RefreshCw, Filter, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';

interface UserStatusFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  hotelId: string;
  setHotelId: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  hotelOptions: { value: string; label: string }[];
  onRefresh: () => void;
  isRefreshing: boolean;
  totalCount: number;
}

const UserStatusFilters: React.FC<UserStatusFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  hotelId,
  setHotelId,
  status,
  setStatus,
  hotelOptions,
  onRefresh,
  isRefreshing,
  totalCount,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'acquired', label: 'Room Acquired' },
    { value: 'not_acquired', label: 'Not Acquired Yet' },
  ];

  const hasActiveFilters = searchTerm || hotelId !== 'all' || status !== 'all';

  return (
    <Card className="mb-4 bg-white/80 backdrop-blur-md border border-heritage-text/10 shadow-sm rounded-xl font-inter !p-0">
      <div className="p-3 md:px-4 md:py-3 border-b border-heritage-text/10 bg-gradient-to-r from-heritage-highlight/20 to-transparent flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 text-heritage-primary rounded-lg shadow-sm border border-heritage-text/10 hidden sm:block">
            <Filter className="w-4 h-4 flex-shrink-0" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-heritage-textDark leading-tight">Status Filters</h2>
            <p className="text-[10px] font-medium text-heritage-text/60">Total Users: {totalCount}</p>
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
        </div>
      </div>

      <div className="p-3 md:px-4 md:py-3 bg-white/40">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-heritage-primary/80" />
            <h3 className="text-[10px] font-bold text-heritage-text/60 uppercase tracking-widest">
              Refine Results
            </h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchTerm('');
                setHotelId('all');
                setStatus('all');
              }}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          <SelectDropdown
            options={hotelOptions}
            value={hotelId}
            onChange={(val: any) => setHotelId(val)}
            placeholder="Select Hotel"
            searchable={true}
            clearable={true}
            className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
          />
          <SelectDropdown
            options={statusOptions}
            value={status}
            onChange={(val: any) => setStatus(val)}
            placeholder="Select Status"
            searchable={false}
            clearable={false}
            className="h-8 min-h-[32px] text-xs border-heritage-text/10 focus:border-heritage-primary focus:ring-1 hover:border-heritage-primary/30 rounded-lg shadow-sm bg-white"
          />
        </div>
      </div>
    </Card>
  );
};

export default UserStatusFilters;
