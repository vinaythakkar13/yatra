'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLazyGetRegistrationByPnrQuery, useCancelRegistrationMutation } from '@/services/registrationApi';
import { formatDate } from '@/utils/dateUtils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Calendar, MapPin, Users, FileText, CheckCircle, XCircle, Clock, Ticket, Search, Loader2, AlertCircle, Hotel, Bed, Map, Phone, X, AlertTriangle, ExternalLink, Eye, Image as ImageIcon, Accessibility } from 'lucide-react';
import { toast } from 'react-toastify';


function getStatusBadge(status: string) {
  const statusConfig = {
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: CheckCircle,
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: XCircle,
      label: 'Rejected',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: Clock,
      label: 'Pending',
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-700 font-bold',
      icon: XCircle,
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [pnr, setPnr] = useState('');
  const [pnrError, setPnrError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationError, setCancellationError] = useState('');

  const [fetchRegistration, { data, isLoading, isError, error }] = useLazyGetRegistrationByPnrQuery();
  const [cancelRegistration, { isLoading: isCancelling }] = useCancelRegistrationMutation();

  const handlePnrChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPnr(numericValue);
    setPnrError('');
  };

  const handleSearch = async () => {
    if (!pnr || pnr.length !== 10) {
      setPnrError('Please enter a valid 10-digit PNR number');
      return;
    }

    try {
      await fetchRegistration(pnr).unwrap();
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.data?.error || err?.message || 'Failed to fetch registration details';
      toast.error(errorMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setPnr('');
    setPnrError('');
    window.location.reload();
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancellationReason('');
    setCancellationError('');
  };

  const handleCancelClose = () => {
    setShowCancelModal(false);
    setCancellationReason('');
    setCancellationError('');
  };

  const handleCancelSubmit = async () => {
    // Validate max length
    if (cancellationReason.length > 100) {
      setCancellationError('Cancellation reason cannot exceed 100 characters');
      return;
    }

    if (!data?.data?.registration?.id) {
      toast.error('Registration ID not found');
      return;
    }

    try {
      const result = await cancelRegistration({
        registrationId: data.data.registration.id,
        reason: cancellationReason.trim() || undefined,
      }).unwrap();

      if (result.success) {
        toast.success('Registration cancelled successfully');
        setShowCancelModal(false);
        setCancellationReason('');
        // Refetch registration details to update status
        if (pnr) {
          await fetchRegistration(pnr).unwrap();
        }
      } else {
        throw new Error(result.error || 'Failed to cancel registration');
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.data?.error || err?.message || 'Failed to cancel registration';
      toast.error(errorMessage);
      setCancellationError(errorMessage);
    }
  };

  const handleReasonChange = (value: string) => {
    if (value.length <= 100) {
      setCancellationReason(value);
      setCancellationError('');
    }
  };

  return (
    <div className="min-h-screen bg-spiritual-zen-surface py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-spiritual-zen-charcoal mb-1">
            Track Your Registration
          </h1>
          <p className="text-sm text-spiritual-textLight">
            Enter your PNR number to view your registration details
          </p>
        </div>

        {/* PNR Search Card */}
        <Card className="p-5 md:p-6 shadow-md border border-spiritual-zen-accent/20">
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-accent rounded-full mb-3">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-spiritual-zen-charcoal mb-1">
                Enter Your PNR Number
              </h2>
              <p className="text-xs text-spiritual-textLight">
                Your 10-digit PNR number is provided after registration
              </p>
            </div>

            <div className="space-y-3">
              <Input
                label="PNR Number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Enter 10-digit PNR"
                value={pnr}
                onChange={(e) => handlePnrChange(e.target.value)}
                onKeyPress={handleKeyPress}
                error={pnrError}
                leftIcon={<Ticket className="w-4 h-4 text-spiritual-textLight" />}
                className="text-center text-base font-mono tracking-wider"
              />

              <Button
                onClick={handleSearch}
                disabled={isLoading || !pnr || pnr.length !== 10}
                className="w-full bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent hover:from-spiritual-zen-forest/90 hover:to-spiritual-zen-accent/90 text-white py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Registration
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-10 text-center">
            <Loader2 className="w-10 h-10 text-spiritual-zen-forest animate-spin mx-auto mb-3" />
            <p className="text-sm text-spiritual-textLight">Fetching registration details...</p>
          </Card>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <Card className="p-6 text-center border-red-200 bg-red-50">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-red-900 mb-1">
              Registration Not Found
            </h3>
            <p className="text-sm text-red-700 mb-2">
              {error && 'data' in error
                ? (error.data as { message?: string })?.message || 'No registration found with this PNR number'
                : 'No registration found with this PNR number'}
            </p>
            <p className="text-xs text-red-600">
              Please check your PNR number and try again
            </p>
          </Card>
        )}

        {/* Registration Details */}
        {data?.data && !isLoading && (
          <div className="space-y-4">
            {/* Main Registration Card */}
            <Card className="p-5 md:p-6 shadow-md border border-spiritual-zen-accent/20">
              <div className="space-y-4">
                {/* Header with Status */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-spiritual-zen-accent/20">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-spiritual-zen-charcoal mb-2">
                      Registration Details
                    </h3>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-spiritual-textLight" />
                      <span className="font-mono text-base font-semibold text-spiritual-zen-charcoal">{data.data.registration.pnr}</span>
                    </div>
                  </div>
                  {getStatusBadge(data.data.registration.documentStatus || 'pending')}
                </div>

                {/* Yatra Information */}
                {data.data.yatra && (
                  <div className="p-3 bg-spiritual-zen-mist/50 rounded-lg border border-spiritual-zen-accent/20">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-spiritual-zen-forest flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-0.5">Yatra</p>
                        <p className="text-base font-bold text-spiritual-zen-charcoal truncate">{data.data.yatra.name}</p>
                        <p className="text-xs text-spiritual-textLight">
                          {formatDate(data.data.yatra.startDate)} - {formatDate(data.data.yatra.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Information - Compact Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Name</p>
                    <p className="text-sm font-medium text-spiritual-zen-charcoal">{data.data.registration.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Contact</p>
                    <p className="text-sm font-medium text-spiritual-zen-charcoal">
                      {data.data.registration.contactNumber || data.data.registration.whatsappNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Travelers</p>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-spiritual-textLight" />
                      <p className="text-sm font-medium text-spiritual-zen-charcoal">{data.data.registration.numberOfPersons}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Boarding</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-spiritual-textLight" />
                      <p className="text-sm font-medium text-spiritual-zen-charcoal capitalize">
                        {data.data.registration.boardingPoint.city}, {data.data.registration.boardingPoint.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travel Dates - Compact */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-spiritual-zen-accent/20">
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Arrival</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-spiritual-textLight" />
                      <p className="text-sm font-medium text-spiritual-zen-charcoal">
                        {formatDate(data.data.registration.arrivalDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-1">Return</p>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-spiritual-textLight" />
                      <p className="text-sm font-medium text-spiritual-zen-charcoal">
                        {formatDate(data.data.registration.returnDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travelers List - Compact */}
                {data.data.persons && data.data.persons.length > 0 && (
                  <div className="pt-3 border-t border-spiritual-zen-accent/20">
                    <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-2">Travelers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.data.persons.map((person, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl border transition-all duration-300 ${person.isHandicapped
                            ? 'bg-orange-50/50 border-orange-200 shadow-sm ring-1 ring-orange-100'
                            : 'bg-spiritual-zen-mist/30 border-spiritual-zen-accent/10'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-spiritual-zen-charcoal">{person.name}</p>
                            <span className="text-xs px-1.5 py-0.5 bg-spiritual-zen-accent/20 text-spiritual-zen-forest rounded-full capitalize">
                              {person.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-spiritual-textLight">
                            <span>Age: {person.age}</span>
                            {person.isHandicapped && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-orange-200 rounded-md shadow-sm">
                                <Accessibility className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                                <span className="text-orange-700 font-bold text-[10px] uppercase tracking-wide">
                                  Special Assistance
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Messages - Compact */}
                {data.data.registration.documentStatus === 'pending' && (
                  <div className="flex items-start gap-2.5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 mb-0.5">Under Review</p>
                      <p className="text-xs text-yellow-700">
                        Your registration is being reviewed. You will be notified once updated.
                      </p>
                    </div>
                  </div>
                )}

                {data.data.registration.documentStatus === 'approved' && (
                  <div className="flex items-start gap-2.5 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-0.5">Registration Approved!</p>
                      <p className="text-xs text-green-700">
                        You will receive further details via WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                {data.data.registration.documentStatus === 'rejected' && data.data.registration.rejectionReason && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-0.5">Registration Rejected</p>
                      <p className="text-xs text-red-700">
                        <strong>Reason:</strong> {data.data.registration.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {data.data.registration.documentStatus === 'cancelled' && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-900 mb-0.5 uppercase tracking-wide">Registration Cancelled</p>
                      <p className="text-xs text-red-700">
                        {data.data.registration.cancellationReason
                          ? `Reason: ${data.data.registration.cancellationReason}`
                          : 'This registration has been cancelled.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-spiritual-zen-accent/20">
                  {/* Cancel Button - Only show if not cancelled or rejected */}
                  {data.data.registration.documentStatus !== 'cancelled' && data.data.registration.documentStatus !== 'rejected' && (
                    <Button
                      onClick={handleCancelClick}
                      variant="outline"
                      className="flex-1 border border-red-300 text-red-700 hover:bg-red-50 py-2 text-sm"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Cancel Registration
                    </Button>
                  )}
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 border border-spiritual-zen-accent/30 text-spiritual-zen-charcoal hover:bg-spiritual-zen-mist/50 py-2 text-sm"
                  >
                    Search Another PNR
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent hover:from-spiritual-zen-forest/90 hover:to-spiritual-zen-accent/90 text-white py-2 text-sm"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </Card>

            {/* Uploaded Ticket Images Section */}
            {data.data.registration.ticketImages && data.data.registration.ticketImages.length > 0 && (
              <Card className="p-5 md:p-6 shadow-md border border-spiritual-zen-accent/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-spiritual-zen-accent/20">
                    <div className="p-1.5 bg-spiritual-zen-accent rounded-lg">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-spiritual-zen-charcoal">Uploaded Ticket Images</h3>
                      <p className="text-xs text-spiritual-textLight">Your uploaded journey tickets and documents</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.data.registration.ticketImages.map((image, index) => (
                      <div
                        key={index}
                        className="group relative rounded-xl overflow-hidden border border-spiritual-zen-accent/20 bg-spiritual-zen-mist/10 aspect-video flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:border-spiritual-zen-accent/40"
                      >
                        <img
                          src={image}
                          alt={`Ticket Image ${index + 1}`}
                          className="w-full h-full object-contain bg-white transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">

                          <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white rounded-full text-sm font-bold text-spiritual-zen-charcoal hover:bg-spiritual-zen-accent hover:text-white transition-all duration-200 shadow-lg flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Full
                          </a>
                        </div>

                        {/* Image Counter Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-sm border border-white/50 rounded-md text-[10px] font-bold text-spiritual-zen-charcoal shadow-sm">
                          Image #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Hotel & Room Information Card */}
            {data.data.hotel && data.data.room && (
              <Card className="p-5 md:p-6 shadow-md border border-spiritual-zen-accent/20 bg-spiritual-zen-mist/30">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-spiritual-zen-accent/20">
                    <div className="p-1.5 bg-spiritual-zen-forest rounded-lg">
                      <Hotel className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-spiritual-zen-charcoal">Accommodation Details</h3>
                    </div>
                  </div>

                  {/* Hotel Information */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-2">Hotel</p>
                      <div className="p-3 bg-white rounded-lg border border-spiritual-zen-accent/20">
                        <h4 className="text-base font-bold text-spiritual-zen-charcoal mb-2">{data.data.hotel.name}</h4>
                        <div className="space-y-1.5 text-xs text-spiritual-textLight">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-spiritual-textLight mt-0.5 flex-shrink-0" />
                            <span className="flex-1">{data.data.hotel.address}</span>
                          </div>
                          {data.data.hotel.distanceFromBhavan && (
                            <div className="flex items-center gap-2">
                              <Map className="w-3.5 h-3.5 text-spiritual-textLight" />
                              <span>Distance: {data.data.hotel.distanceFromBhavan}</span>
                            </div>
                          )}
                          {data.data.hotel.mapLink && (
                            <a
                              href={data.data.hotel.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-spiritual-zen-forest hover:text-spiritual-zen-forest/80 font-medium"
                            >
                              <Map className="w-3.5 h-3.5" />
                              View on Map
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Room Information */}
                    <div>
                      <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-2">Room</p>
                      <div className="p-3 bg-white rounded-lg border border-spiritual-zen-accent/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-spiritual-zen-forest" />
                            <span className="text-lg font-bold text-spiritual-zen-charcoal">Room {data.data.room.roomNumber}</span>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Assigned
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-spiritual-textLight mb-0.5">Floor</p>
                            <p className="font-medium text-spiritual-zen-charcoal">{data.data.room.floor}</p>
                          </div>
                          <div>
                            <p className="text-spiritual-textLight mb-0.5">Beds</p>
                            <p className="font-medium text-spiritual-zen-charcoal">{data.data.room.numberOfBeds}</p>
                          </div>
                          <div>
                            <p className="text-spiritual-textLight mb-0.5">Toilet</p>
                            <p className="font-medium text-spiritual-zen-charcoal capitalize">{data.data.room.toiletType}</p>
                          </div>
                          <div>
                            <p className="text-spiritual-textLight mb-0.5">Charge/Day</p>
                            <p className="font-medium text-spiritual-zen-charcoal">₹{data.data.room.chargePerDay.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Contact - Compact */}
                    <div className="p-3 bg-white rounded-lg border border-spiritual-zen-accent/20">
                      <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-2">Contact</p>
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-spiritual-zen-mist rounded-lg">
                          <Phone className="w-3.5 h-3.5 text-spiritual-zen-forest" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-spiritual-zen-charcoal">{data.data.hotel.managerName}</p>
                          <p className="text-xs text-spiritual-textLight">{data.data.hotel.managerContact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Check-in/Check-out Times - Compact */}
                    {(data.data.hotel.checkInTime || data.data.hotel.checkOutTime) && (
                      <div className="p-3 bg-white rounded-lg border border-spiritual-zen-accent/20">
                        <p className="text-xs font-semibold text-spiritual-textLight uppercase tracking-wide mb-2">Timings</p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {data.data.hotel.checkInTime && (
                            <div>
                              <p className="text-spiritual-textLight mb-0.5">Check-in</p>
                              <p className="font-medium text-spiritual-zen-charcoal">{data.data.hotel.checkInTime}</p>
                            </div>
                          )}
                          {data.data.hotel.checkOutTime && (
                            <div>
                              <p className="text-spiritual-textLight mb-0.5">Check-out</p>
                              <p className="font-medium text-spiritual-zen-charcoal">{data.data.hotel.checkOutTime}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* No Room Assigned Message */}
            {data.data.registration.documentStatus === 'approved' && !data.data.hotel && (
              <Card className="p-4 border border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-0.5">Room Assignment Pending</p>
                    <p className="text-xs text-yellow-700">
                      Hotel and room details will be assigned soon. You will be notified via WhatsApp.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!data?.data && !isLoading && !isError && (
          <Card className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-spiritual-zen-mist rounded-full mb-3">
              <FileText className="w-6 h-6 text-spiritual-textLight" />
            </div>
            <h3 className="text-base font-semibold text-spiritual-zen-charcoal mb-1">
              Ready to Track Your Registration
            </h3>
            <p className="text-sm text-spiritual-textLight">
              Enter your PNR number above to view your registration details
            </p>
          </Card>
        )}

        {/* Cancel Registration Modal */}
        {showCancelModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fade-in !m-0"
            onClick={handleCancelClose}
          >
            <div
              className="relative max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Card className="p-8 shadow-2xl border border-gray-200/50 bg-white animate-scale-in">
                {/* Close Button */}
                <button
                  onClick={handleCancelClose}
                  className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl mb-4 shadow-lg ring-4 ring-red-100/50">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-spiritual-zen-charcoal mb-2">
                      Cancel Registration
                    </h3>
                    <p className="text-sm text-spiritual-textLight leading-relaxed">
                      This action cannot be undone. Are you sure you want to proceed?
                    </p>
                  </div>

                  {/* Cancellation Reason Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-spiritual-zen-charcoal">
                      Reason for Cancellation
                      <span className="ml-1 text-xs font-normal text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={cancellationReason}
                        onChange={(e) => handleReasonChange(e.target.value)}
                        placeholder="Please share your reason for cancellation..."
                        maxLength={100}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm resize-none bg-gray-50/50 placeholder:text-gray-400 focus:bg-white ${cancellationError
                          ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-200 focus:border-spiritual-zen-forest focus:ring-4 focus:ring-spiritual-zen-forest/10'
                          }`}
                      />

                    </div>
                    <div className="relative justify-end flex items-end">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${cancellationReason.length === 0
                        ? 'text-gray-400 bg-gray-100'
                        : cancellationReason.length > 90
                          ? 'text-red-600 bg-red-50'
                          : 'text-spiritual-textLight bg-spiritual-zen-mist/50'
                        }`}>
                        {cancellationReason.length}/100
                      </span>
                    </div>
                    {cancellationError && (
                      <p className="text-xs text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {cancellationError}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleCancelClose}
                      variant="outline"
                      disabled={isCancelling}
                      className="flex-1 border-2 border-gray-200 text-spiritual-zen-charcoal hover:bg-gray-50 hover:border-gray-300 py-3 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow"
                    >
                      Keep Registration
                    </Button>
                    <Button
                      onClick={handleCancelSubmit}
                      disabled={isCancelling}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Confirm Cancellation
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
