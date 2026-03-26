import React, { useState } from 'react';
import { Hotel as HotelIcon, MapPin, Edit, Trash2, ChevronDown, ChevronUp, Home, Users, BedDouble, IndianRupee, KeyRound, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { Hotel, HotelRoom } from './steps/interface';
import { useGenerateHotelCredentialsMutation, useSetPaymentDoneMutation } from '@/services/hotelApi';
import { toast } from 'react-toastify';
import CredentialsModal from './CredentialsModal';
import PaymentConfirmationModal from './PaymentConfirmationModal';
import { Banknote } from 'lucide-react';
import VerifiedBadgeIcon from '@/components/ui/svg/VerifiedIcon';


interface HotelCardProps {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

interface Credentials {
  hotel_id: string;
  hotel_name: string;
  login_id: string;
  password: string;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCredModal, setShowCredModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [credentials, setCredentials] = useState<Credentials | null>(null);



  const [generateCredentials, { isLoading: isGenerating }] = useGenerateHotelCredentialsMutation();
  const [setPaymentDone, { isLoading: isUpdatingPayment }] = useSetPaymentDoneMutation();

  const getTotalRooms = (hotel: Hotel) => hotel.rooms?.length || 0;
  const getOccupiedRooms = (hotel: Hotel) =>
    hotel.rooms?.filter((r: HotelRoom) => r.is_occupied).length || 0;
  const getAvailableRooms = (hotel: Hotel) =>
    hotel.rooms?.filter((r: HotelRoom) => !r.is_occupied).length || 0;

  const getTotalPayments = (hotel: Hotel) => {
    const total = hotel.rooms?.reduce((total, room) => total + (Number(room.charge_per_day) || 0), 0) || 0;
    return total * hotel.number_of_days;
  };

  const handleGenerateCredentials = async () => {
    try {
      const result = await generateCredentials(hotel.id).unwrap();
      if (result.success && result.data) {
        setCredentials(result.data);
        setShowCredModal(true);
      } else {
        toast.error('Failed to generate credentials.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error generating hotel credentials.');
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const result = await setPaymentDone({ hotelId: hotel.id }).unwrap();
      if (result.success) {
        toast.success('Payment marked as completed successfully!');
        setShowPaymentModal(false);
      } else {
        toast.error('Failed to update payment status.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error updating payment status.');
    }
  };

  const handleSendWhatsApp = () => {
    if (!credentials) return;
    const managerContact = (hotel as any).manager_contact?.replace(/\D/g, '');
    if (!managerContact) {
      toast.error('No manager contact number found for this hotel.');
      return;
    }
    const message = encodeURIComponent(
      `Hotel Portal Login Credentials\n\n` +
      `Hotel: ${credentials.hotel_name}\n` +
      `Login ID: ${credentials.login_id}\n` +
      `Password: ${credentials.password}\n\n` +
      `Please log in at the Yatra portal\n` +
      `Do not share these credentials with anyone.`
    );
    window.open(`https://wa.me/${managerContact}?text=${message}`, '_blank');
  };

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
        <div className='flex flex-col gap-2 items-start'>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${row.is_occupied
              ? 'bg-heritage-maroon/10 text-heritage-maroon'
              : 'bg-green-100 text-green-700'
              }`}
          >
            {row?.is_occupied ? 'Occupied' : 'Available'}
          </span>
          {row.assigned_to_user_id && row.assigned_user_name && row.pnr_no && (
            <p className="text-md text-heritage-text mt-1">
              Assigned to: {row.assigned_user_name} ({row.pnr_no})
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl border border-heritage-text/10 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6 relative overflow-hidden font-inter group">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="bg-heritage-primary/10 text-heritage-primary p-3 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
              <HotelIcon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-heritage-textDark mb-1.5 flex items-center gap-2 truncate">
                {hotel.name}
                {hotel.full_payment_paid && (
                  <VerifiedBadgeIcon size={20} className="text-green-500 fill-green-500 flex-shrink-0" />
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-heritage-text/70">
                {hotel.address && (
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{hotel.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-1 h-1 bg-heritage-text/30 rounded-full" />
                  <span>{hotel.total_floors || 0} Floors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCredentials}
              disabled={isGenerating}
              className="h-9 border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <KeyRound className="w-3.5 h-3.5 mr-1.5" />
              )}
              Credentials
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              disabled={hotel.full_payment_paid}
              className={`h-9 border-green-200 text-green-700 hover:bg-green-50 text-xs font-semibold ${hotel.full_payment_paid ? 'bg-green-50 opacity-100 border-green-100 cursor-default' : ''}`}
            >
              <Banknote className="w-3.5 h-3.5 mr-1.5" />
              {hotel.full_payment_paid ? 'Paid' : 'Payment Paid'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(hotel)}
              className="h-9 border-heritage-primary/20 text-heritage-primary hover:bg-heritage-primary/5 text-xs font-semibold"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(hotel)}
              className="h-9 border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Financial */}
          <div className="bg-heritage-highlight/10 rounded-xl p-4 border border-heritage-highlight/20 transition-colors hover:bg-heritage-highlight/20">
            <div className="text-heritage-text/60 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" /> Total Payment
            </div>
            <div className="text-xl font-bold text-heritage-textDark">
              ₹{getTotalPayments(hotel).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-heritage-highlight/10 rounded-xl p-4 border border-heritage-highlight/20 transition-colors hover:bg-heritage-highlight/20 relative overflow-hidden">
            <div className="text-heritage-text/60 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" /> Advance Paid
            </div>
            <div className="text-xl font-bold text-heritage-textDark">
              ₹{Number(hotel.advance_paid_amount || 0).toLocaleString('en-IN')}
            </div>
            {/* {hotel.full_payment_paid && (
              <div className="absolute -right-6 -top-2 bg-green-500 text-white text-[8px] font-black uppercase py-4 px-8 rotate-[25deg] shadow-sm">
                Paid
              </div>
            )} */}
          </div>

          {/* Rooms Overview */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 lg:col-span-2">
            <div className="text-blue-600/80 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Room Occupancy
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{getTotalRooms(hotel)}</div>
                <div className="text-[10px] uppercase font-bold text-blue-600/60 mt-0.5">Total</div>
              </div>
              <div className="w-px h-8 bg-blue-200/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{getAvailableRooms(hotel)}</div>
                <div className="text-[10px] uppercase font-bold text-green-600/60 mt-0.5">Available</div>
              </div>
              <div className="w-px h-8 bg-blue-200/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-heritage-maroon">{getOccupiedRooms(hotel)}</div>
                <div className="text-[10px] uppercase font-bold text-heritage-maroon/60 mt-0.5">Occupied</div>
              </div>
              <div className="w-px h-8 bg-blue-200/50"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {getTotalRooms(hotel) ? Math.round((getOccupiedRooms(hotel) / getTotalRooms(hotel)) * 100) : 0}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Usage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Configuration */}
        <div className="mb-2">
          <h3 className="text-xs font-bold text-heritage-text/40 uppercase tracking-widest mb-3 flex items-center gap-2">
            Room Configuration
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(
              (hotel.rooms || []).reduce((acc: Record<number, number>, room) => {
                const beds = room.number_of_beds || 0;
                acc[beds] = (acc[beds] || 0) + 1;
                return acc;
              }, {})
            )
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([beds, count]) => (
                <div key={beds} className="flex items-center gap-3 bg-white border border-heritage-text/10 rounded-xl px-3 py-2 shadow-sm hover:border-heritage-gold/40 transition-colors">
                  <div className="flex items-center justify-center bg-heritage-highlight/30 text-heritage-primary rounded-lg font-bold px-2 py-1 text-xs">
                    {beds} Bed{Number(beds) > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm font-bold text-heritage-textDark">
                    {count} Room{Number(count) > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Collapsible Section Control */}
        <div className="mt-6 border-t border-heritage-text/10 pt-4">
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

      <CredentialsModal
        isOpen={showCredModal}
        onClose={() => setShowCredModal(false)}
        credentials={credentials}
        onSendWhatsApp={handleSendWhatsApp}
      />

      <PaymentConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        isLoading={isUpdatingPayment}
        hotelName={hotel.name}
        totalAmount={getTotalPayments(hotel)}
        advancePaid={Number(hotel.advance_paid_amount || 0)}
        pendingAmount={getTotalPayments(hotel) - Number(hotel.advance_paid_amount || 0)}
      />
    </>

  );
};

export default HotelCard;
