import React, { useState } from 'react';
import { Hotel as HotelIcon, MapPin, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';

interface HotelCardProps {
  hotel: any;
  onEdit: (hotel: any) => void;
  onDelete: (hotel: any) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTotalRooms = (hotel: any) => hotel.rooms?.length || 0;
  const getOccupiedRooms = (hotel: any) =>
    hotel.rooms?.filter((r: any) => r.isOccupied).length || 0;
  const getAvailableRooms = (hotel: any) =>
    hotel.rooms?.filter((r: any) => !r.isOccupied).length || 0;

  const roomColumns = [
    {
      key: 'roomNumber',
      header: 'Room Number',
      render: (row: any) => (
        <span className="font-mono font-bold text-lg text-heritage-primary">
          {row.room_number}
        </span>
      ),
    },
    {
      key: 'floor',
      header: 'Floor',
      render: (row: any) => (
        <span className="text-heritage-text/80">Floor {row.floor}</span>
      ),
    },
    {
      key: 'numberOfBeds',
      header: 'Beds',
      render: (row: any) => (
        <div className="text-center">
          <p className="font-bold text-heritage-textDark">{row.number_of_beds || 0}</p>
          <p className="text-xs text-heritage-text/60">
            {row.isOccupied ? (
              <span className="text-heritage-maroon">Occupied</span>
            ) : (
              <span className="text-green-600">Available</span>
            )}
          </p>
        </div>
      ),
    },
    {
      key: 'toiletType',
      header: 'Toilet',
      render: (row: any) => (
        <span className="text-sm text-heritage-text/80 capitalize">
          {row.toilet_type || 'N/A'}
        </span>
      ),
    },
    {
      key: 'chargePerDay',
      header: 'Charge/Day',
      render: (row: any) => (
        <span className="font-semibold text-green-700">
          ₹{row.charge_per_day?.toLocaleString('en-IN') || 0}
        </span>
      ),
    },
    {
      key: 'isOccupied',
      header: 'Status',
      render: (row: any) => (
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${row.isOccupied
              ? 'bg-heritage-maroon/10 text-heritage-maroon'
              : 'bg-green-100 text-green-700'
              }`}
          >
            {row.isOccupied ? 'Occupied' : 'Available'}
          </span>
          {row.assignedTo && (
            <p className="text-xs text-heritage-text/60 mt-1">
              Assigned to: {row.assignedTo}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg font-inter">
      <div className="p-4 md:p-6">
        {/* Hotel Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-3 md:p-4 rounded-xl shadow-lg flex-shrink-0 text-white">
              <HotelIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-heritage-textDark mb-1 md:mb-2 truncate">
                {hotel.name}
              </h2>
              <p className="text-sm text-heritage-text/70 mb-2 md:mb-3">
                {hotel.totalFloors || hotel.floors?.length || 0} floors • {getTotalRooms(hotel)} total rooms
              </p>

              {hotel.address && (
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-heritage-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-heritage-text/80 line-clamp-2">
                    {hotel.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(hotel)}
              className="flex-1 sm:flex-none justify-center border-heritage-primary/30 text-heritage-primary hover:bg-heritage-primary/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(hotel)}
              className="flex-1 sm:flex-none justify-center border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="p-3 md:p-4 rounded-xl bg-heritage-highlight/20 border border-heritage-highlight backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-heritage-text/70 uppercase tracking-wider mb-1 font-semibold">Total Rooms</p>
            <p className="text-xl md:text-2xl font-bold text-heritage-textDark">{getTotalRooms(hotel)}</p>
          </div>
          <div className="p-3 md:p-4 rounded-xl bg-green-100/50 border border-green-200/60 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-green-700 uppercase tracking-wider mb-1 font-semibold">Available</p>
            <p className="text-xl md:text-2xl font-bold text-green-800">{getAvailableRooms(hotel)}</p>
          </div>
          <div className="p-3 md:p-4 rounded-xl bg-heritage-maroon/10 border border-heritage-maroon/20 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-heritage-maroon uppercase tracking-wider mb-1 font-semibold">Occupied</p>
            <p className="text-xl md:text-2xl font-bold text-heritage-maroon">{getOccupiedRooms(hotel)}</p>
          </div>
          <div className="p-3 md:p-4 rounded-xl bg-blue-100/50 border border-blue-200/60 backdrop-blur-sm">
            <p className="text-[10px] md:text-xs text-blue-700 uppercase tracking-wider mb-1 font-semibold">Occupancy</p>
            <p className="text-xl md:text-2xl font-bold text-blue-800">
              {getTotalRooms(hotel) ? Math.round((getOccupiedRooms(hotel) / getTotalRooms(hotel)) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Collapsible Room List */}
        <div className="border-t border-heritage-text/10 pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-heritage-text/70 hover:text-heritage-primary transition-colors"
          >
            <span>View Room Details</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 animate-fade-in">
              <Table
                data={hotel.rooms || []}
                columns={roomColumns}
                className="bg-white/50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
