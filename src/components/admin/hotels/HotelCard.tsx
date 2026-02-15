import React, { useState } from 'react';
import { Hotel as HotelIcon, MapPin, Edit, Trash2, ChevronDown, ChevronUp, Home, Users, BedDouble, IndianRupee } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { Hotel, HotelRoom } from './steps/interface';


interface HotelCardProps {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onEdit, onDelete }) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const getTotalRooms = (hotel: Hotel) => hotel.rooms?.length || 0;
  const getOccupiedRooms = (hotel: Hotel) =>
    hotel.rooms?.filter((r: HotelRoom) => r.is_occupied).length || 0;
  const getAvailableRooms = (hotel: Hotel) =>
    hotel.rooms?.filter((r: HotelRoom) => !r.is_occupied).length || 0;

  const getTotalPayments = (hotel: Hotel) => {
    const total = hotel.rooms?.reduce((total, room) => total + (Number(room.charge_per_day) || 0), 0) || 0;
    return total * hotel.number_of_days;
  }


  const roomColumns = [
    {
      key: 'roomNumber',
      header: 'Room Number',
      render: (row: HotelRoom) => (
        <span className="font-mono font-bold text-lg text-heritage-primary">
          {row.room_number}
        </span>
      ),
    },
    {
      key: 'floor',
      header: 'Floor',
      render: (row: HotelRoom) => (
        <span className="text-heritage-text/80">Floor {row.floor}</span>
      ),
    },
    {
      key: 'numberOfBeds',
      header: 'Beds',
      render: (row: HotelRoom) => (
        <div className="text-center">
          <p className="font-bold text-heritage-textDark">{row.number_of_beds || 0}</p>
          <p className="text-xs text-heritage-text/60">
            {row.is_occupied ? (
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
      render: (row: HotelRoom) => (
        <span className="text-sm text-heritage-text/80 capitalize">
          {row.toilet_type || 'N/A'}
        </span>
      ),
    },
    {
      key: 'chargePerDay',
      header: 'Charge/Day',
      render: (row: HotelRoom) => (
        <span className="font-semibold text-green-700">
          ₹{Number(row.charge_per_day || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'is_occupied',
      header: 'Status',
      render: (row: HotelRoom) => (
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${row.is_occupied
              ? 'bg-heritage-maroon/10 text-heritage-maroon'
              : 'bg-green-100 text-green-700'
              }`}
          >
            {row.is_occupied ? 'Occupied' : 'Available'}
          </span>
          {row.assigned_to_user_id && (
            <p className="text-xs text-heritage-text/60 mt-1">
              Assigned to: {row.assigned_to_user_id}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-lg font-inter">
      <div className="p-4 md:p-5">
        {/* Elegant Header & Stats Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/40 p-3 rounded-xl border border-white/50 mb-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 rounded-xl shadow-lg text-white flex-shrink-0">
              <HotelIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-heritage-textDark truncate leading-tight">
                {hotel.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stats Row with Pills */}
            <div className="flex flex-wrap items-center gap-2 border-r border-heritage-text/10 pr-3 last:border-0 last:pr-0">

              {/* total Payment */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-heritage-highlight/20 border border-heritage-highlight/30">
                <span className="text-heritage-text/50"><IndianRupee className="w-3.5 h-3.5" /></span>
                <span className="text-xs font-bold text-heritage-textDark">{getTotalPayments(hotel)} <span className="text-[10px] font-medium text-heritage-text/50 uppercase ml-0.5">Total Payment</span></span>
              </div>

              {/* advance paid */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-heritage-highlight/20 border border-heritage-highlight/30">
                <span className="text-heritage-text/50"><IndianRupee className="w-3.5 h-3.5" /></span>
                <span className="text-xs font-bold text-heritage-textDark">{hotel.advance_paid_amount} <span className="text-[10px] font-medium text-heritage-text/50 uppercase ml-0.5">Advance Paid</span></span>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-heritage-highlight/20 border border-heritage-highlight/30">
                <span className="text-heritage-text/50"><Home className="w-3.5 h-3.5" /></span>
                <span className="text-xs font-bold text-heritage-textDark">{getTotalRooms(hotel)} <span className="text-[10px] font-medium text-heritage-text/50 uppercase ml-0.5">Rooms</span></span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-100">
                <span className="text-green-500"><Users className="w-3.5 h-3.5" /></span>
                <span className="text-xs font-bold text-green-700">{getAvailableRooms(hotel)} <span className="text-[10px] font-medium text-green-600/60 uppercase ml-0.5">Free</span></span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-heritage-maroon/5 border border-heritage-maroon/10">
                <span className="text-heritage-maroon/60"><BedDouble className="w-3.5 h-3.5" /></span>
                <span className="text-xs font-bold text-heritage-maroon">{getOccupiedRooms(hotel)} <span className="text-[10px] font-medium text-heritage-maroon/60 uppercase ml-0.5">Busy</span></span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                <span className="text-xs font-bold text-blue-700">
                  {getTotalRooms(hotel) ? Math.round((getOccupiedRooms(hotel) / getTotalRooms(hotel)) * 100) : 0}% <span className="text-[10px] font-medium text-blue-600/60 uppercase ml-0.5">Usage</span>
                </span>
              </div>
            </div>

            {/* Actions with Labels */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(hotel)}
                className="h-9 px-3 border-heritage-primary/20 text-heritage-primary hover:bg-heritage-primary/5 transition-all text-xs font-semibold"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(hotel)}
                className="h-9 px-3 border-red-100 text-red-600 hover:bg-red-50 transition-all text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Secondary Info Row with Better Contrast */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 px-1">
          <div className="flex items-center gap-2 text-sm text-heritage-text/70">
            <span className="bg-heritage-gold/20 text-heritage-textDark px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Floors</span>
            <span className="font-semibold">{hotel.total_floors || 0}</span>
          </div>
          {hotel.address && (
            <div className="flex items-center gap-2 text-sm text-heritage-text/60 min-w-0">
              <MapPin className="w-4 h-4 text-heritage-primary flex-shrink-0" />
              <span className="truncate">{hotel.address}</span>
            </div>
          )}
        </div>

        {/* Collapsible Section Control */}
        <div className="border-t border-heritage-text/10 pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full py-1 text-xs font-bold text-heritage-text/50 hover:text-heritage-primary transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="uppercase tracking-widest">{isExpanded ? 'Hide' : 'View'} Detailed Room List</span>
              <div className="h-0.5 w-12 bg-heritage-text/10 group-hover:bg-heritage-primary/30 transition-all" />
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isExpanded && (
            <div className="mt-4 animate-fade-in animate-duration-300">
              <div className="rounded-xl border border-heritage-text/10 overflow-hidden bg-white/50">
                <Table
                  data={hotel.rooms || []}
                  columns={roomColumns}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
