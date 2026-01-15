'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Users, UserX, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '@/contexts/AppContext';
import { useGetIndianStatesQuery } from '@/services/locationApi';
import { useGetRegistrationsQuery } from '@/services/registrationApi';
import { yatraStorage } from '@/utils/storage';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

// Import new components
import UserFilters from '@/components/admin/users/UserFilters';
import UserTable from '@/components/admin/users/UserTable';
import UserDetailsModal from '@/components/admin/users/modals/UserDetailsModal';
import AssignRoomModal from '@/components/admin/users/modals/AssignRoomModal';
import DocumentViewerModal from '@/components/admin/users/modals/DocumentViewerModal';
import RejectDocumentModal from '@/components/admin/users/modals/RejectDocumentModal';

/**
 * User Management Page (Admin)
 * 
 * Features:
 * - Table listing all registered users
 * - Single-line search and filter functionality
 * - View detailed user information
 * - Assign rooms to users
 * - Reassign rooms for already assigned users
 * - Automatic room deallocation on reassignment
 * - Date filtering with react-datepicker
 * - Dropdown filters with react-dropdown-select
 * - Protected route with AdminLayout
 */
function UserManagement() {
  const { hotels, assignRoom, unassignRoom, approveDocument, rejectDocument } = useApp();

  // Get selected yatra ID from localStorage
  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(null);

  useEffect(() => {
    // Get yatra ID from localStorage on mount
    const yatraId = yatraStorage.getSelectedYatraId();
    setSelectedYatraId(yatraId);

    // Listen for storage changes (when yatra is changed in header)
    const handleStorageChange = () => {
      const newYatraId = yatraStorage.getSelectedYatraId();
      setSelectedYatraId(newYatraId);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically for same-tab changes
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Fetch registrations from API
  const {
    data: registrationsResponse,
    isLoading: isLoadingRegistrations,
    isError: isRegistrationsError,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = useGetRegistrationsQuery(
    { yatraId: selectedYatraId! },
    { skip: !selectedYatraId } // Skip query if no yatraId
  );

  // Extract registrations from API response
  const registrations = useMemo(() => {
    if (!registrationsResponse?.success || !registrationsResponse?.data) {
      return [];
    }
    return registrationsResponse.data.registrations || [];
  }, [registrationsResponse]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterRoomStatus, setFilterRoomStatus] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Fetch Indian states from API
  const { data: statesData, isLoading: isLoadingStates } = useGetIndianStatesQuery();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection States
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [bedAssignments, setBedAssignments] = useState<Record<string, any>>({});
  const [isReassigning, setIsReassigning] = useState(false);
  const [currentBedSelection, setCurrentBedSelection] = useState<{ roomNumber: string, bedIndex: number } | null>(null);
  const [userToUnassign, setUserToUnassign] = useState<any>(null);

  // Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Document States
  const [currentDocuments, setCurrentDocuments] = useState<string[]>([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [documentOwner, setDocumentOwner] = useState<any>(null);

  // Derived Data - State Options from API
  const stateOptions = useMemo(() => {
    if (!statesData) {
      return [{ value: '', label: 'All States' }];
    }
    return [
      { value: '', label: 'All States' },
      ...statesData.map((state) => ({
        value: state.name,
        label: state.name,
      })),
    ];
  }, [statesData]);

  const roomStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'Pending', label: 'Pending' },
  ];

  const hotelOptions = [
    { value: '', label: 'Select a hotel' },
    ...hotels.map((hotel) => ({
      value: hotel.id,
      label: hotel.name + (hotel.hasElevator ? '\n(Has Elevator)' : ''),
    })),
  ];

  const selectedHotelData = hotels.find(h => h.id === selectedHotel);
  const availableRoomsForHotel = selectedHotelData
    ? selectedHotelData.rooms.filter((room) => !room.isOccupied)
    : [];

  const totalSelectedBeds = Object.keys(bedAssignments).length;
  const totalPassengers = selectedUser?.numberOfPersons || 0;

  const assignedPassengers = Object.values(bedAssignments);
  const availablePassengers = selectedUser?.persons?.filter(
    (person: any) => !assignedPassengers.some(ap => ap.name === person.name)
  ) || [];

  // Filter Logic
  const filteredRegistrations = registrations.filter((reg) => {
    const contactNumber = reg.contactNumber || reg.whatsappNumber || '';
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.pnr.includes(searchTerm) ||
      contactNumber.includes(searchTerm);

    const matchesState = !filterState || reg.boardingPoint.state === filterState;
    const matchesRoomStatus = !filterRoomStatus || reg.roomStatus === filterRoomStatus;
    const matchesDate = !filterDate || new Date(reg.arrivalDate).toDateString() === filterDate.toDateString();

    return matchesSearch && matchesState && matchesRoomStatus && matchesDate;
  });

  // Pagination Logic
  const totalItems = filteredRegistrations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterState, filterRoomStatus, filterDate]);

  // Handlers
  const handleViewDetails = (registration: any) => {
    setSelectedUser(registration);
    setShowDetailsModal(true);
  };

  const handleAssignRoom = (registration: any) => {
    setSelectedUser(registration);
    setIsReassigning(false);
    setSelectedHotel('');
    setSelectedRooms([]);
    setBedAssignments({});
    setShowAssignModal(true);
  };

  const handleReassignRoom = (registration: any) => {
    setSelectedUser(registration);
    setIsReassigning(true);
    setSelectedHotel('');
    setSelectedRooms([]);
    setBedAssignments({});
    setShowAssignModal(true);
  };

  const handleRoomToggle = (roomNumber: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomNumber)) {
        const updated = prev.filter(r => r !== roomNumber);
        setBedAssignments(current => {
          const newAssignments = { ...current };
          Object.keys(newAssignments).forEach(key => {
            if (key.startsWith(`${roomNumber}-`)) {
              delete newAssignments[key];
            }
          });
          return newAssignments;
        });
        return updated;
      } else {
        return [...prev, roomNumber];
      }
    });
  };

  const handleBedClick = (roomNumber: string, bedIndex: number) => {
    const bedKey = `${roomNumber}-${bedIndex}`;
    const existingAssignment = bedAssignments[bedKey];

    if (existingAssignment) {
      setBedAssignments(prev => {
        const updated = { ...prev };
        delete updated[bedKey];
        return updated;
      });
      toast.info(`Bed ${bedIndex + 1} unassigned`, { position: 'top-center' });
    } else {
      if (totalSelectedBeds >= totalPassengers) {
        toast.warning(`All passengers already assigned. Unassign a bed first.`, { position: 'top-center' });
        return;
      }
      setCurrentBedSelection({ roomNumber, bedIndex });
      setShowPassengerModal(true);
    }
  };

  const handlePassengerSelect = (passenger: any) => {
    if (!currentBedSelection) return;
    const bedKey = `${currentBedSelection.roomNumber}-${currentBedSelection.bedIndex}`;
    setBedAssignments(prev => ({ ...prev, [bedKey]: passenger }));
    setShowPassengerModal(false);
    setCurrentBedSelection(null);
    toast.success(`✓ ${passenger.name} assigned to Bed ${currentBedSelection.bedIndex + 1}`, { position: 'top-center' });
  };

  const handleUnassignClick = (registration: any) => {
    setUserToUnassign(registration);
    setShowUnassignModal(true);
  };

  const handleConfirmUnassignment = () => {
    if (!userToUnassign) return;
    const roomToFree = userToUnassign.roomNumber;
    unassignRoom(userToUnassign.id);
    toast.success(`🗑️ Room assignment removed for ${userToUnassign.name}. Room ${roomToFree} is now available.`, { position: 'top-right' });
    setShowUnassignModal(false);
    setUserToUnassign(null);
  };

  const handleConfirmAssignment = () => {
    if (selectedRooms.length === 0) {
      toast.error('Please select at least one room', { position: 'top-center' });
      return;
    }

    const primaryRoom = selectedRooms[0];
    if (selectedUser && primaryRoom) {
      assignRoom(selectedUser.id, primaryRoom);
      setShowAssignModal(false);
      setSelectedHotel('');
      setSelectedRooms([]);
      setBedAssignments({});
      setIsReassigning(false);

      if (isReassigning) {
        toast.success(`🔄 Room reassigned! ${selectedUser.name} moved to Room ${primaryRoom}`, { position: 'top-right' });
      } else {
        toast.success(`✅ Room ${primaryRoom} assigned to ${selectedUser.name}!`, { position: 'top-right' });
      }
    }
  };

  const handleViewDocuments = (user: any) => {
    if (user.ticketImages && user.ticketImages.length > 0) {
      setCurrentDocuments(user.ticketImages);
      setCurrentDocumentIndex(0);
      setDocumentOwner(user);
      setShowDocumentViewer(true);
    } else {
      toast.info('No documents uploaded for this registration');
    }
  };

  const handleApproveDocument = () => {
    if (documentOwner) {
      approveDocument(documentOwner.id);
      toast.success(`✅ Documents approved for ${documentOwner.name}`);
      setShowDocumentViewer(false);
      setDocumentOwner(null);
    }
  };

  const handleRejectDocument = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    if (documentOwner) {
      rejectDocument(documentOwner.id, rejectionReason);
      toast.success(`❌ Documents rejected for ${documentOwner.name}`);
      setShowRejectModal(false);
      setShowDocumentViewer(false);
      setDocumentOwner(null);
      setRejectionReason('');
    }
  };

  // Loading State
  if (isLoadingRegistrations) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
              User Management
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-heritage-primary animate-spin mx-auto mb-4" />
            <p className="text-heritage-textDark font-medium">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isRegistrationsError) {
    const errorMessage = registrationsError && 'data' in registrationsError
      ? (registrationsError.data as { message?: string; error?: string })?.message ||
      (registrationsError.data as { message?: string; error?: string })?.error ||
      'Failed to load registrations'
      : 'Failed to load registrations';

    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
              User Management
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Registrations</h3>
              <p className="text-sm text-red-700 mb-4">{errorMessage}</p>
              <Button
                onClick={() => refetchRegistrations()}
                variant="admin"
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            </div>
            {!selectedYatraId && (
              <p className="text-sm text-heritage-text/70 mt-4">
                Please select a Yatra from the header dropdown to view registrations.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No Yatra Selected State
  if (!selectedYatraId) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
              User Management
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="bg-heritage-highlight/30 border-2 border-heritage-gold/30 rounded-xl p-6">
              <Users className="w-12 h-12 text-heritage-text/60 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-heritage-textDark mb-2">No Yatra Selected</h3>
              <p className="text-sm text-heritage-text/70">
                Please select a Yatra from the header dropdown to view registrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
              User Management
            </h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterState={filterState}
        setFilterState={setFilterState}
        filterRoomStatus={filterRoomStatus}
        setFilterRoomStatus={setFilterRoomStatus}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        stateOptions={stateOptions}
        roomStatusOptions={roomStatusOptions}
        totalCount={registrations.length}
        filteredCount={filteredRegistrations.length}
        isLoadingStates={isLoadingStates}
      />

      {/* Users Table */}
      <UserTable
        data={paginatedRegistrations}
        onViewDetails={handleViewDetails}
        onAssignRoom={handleAssignRoom}
        onReassignRoom={handleReassignRoom}
        onUnassignRoom={handleUnassignClick}
        onViewDocuments={handleViewDocuments}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      {/* Modals */}
      <UserDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        user={selectedUser}
      />

      <AssignRoomModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setIsReassigning(false);
          setSelectedHotel('');
          setSelectedRooms([]);
          setBedAssignments({});
        }}
        isReassigning={isReassigning}
        selectedUser={selectedUser}
        selectedHotel={selectedHotel}
        setSelectedHotel={setSelectedHotel}
        hotelOptions={hotelOptions}
        availableRoomsForHotel={availableRoomsForHotel}
        selectedRooms={selectedRooms}
        handleRoomToggle={handleRoomToggle}
        totalPassengers={totalPassengers}
        onConfirmAssignment={handleConfirmAssignment}
      />

      <DocumentViewerModal
        isOpen={showDocumentViewer}
        onClose={() => {
          setShowDocumentViewer(false);
          setDocumentOwner(null);
          setCurrentDocuments([]);
          setCurrentDocumentIndex(0);
        }}
        documentOwner={documentOwner}
        currentDocuments={currentDocuments}
        currentDocumentIndex={currentDocumentIndex}
        setCurrentDocumentIndex={setCurrentDocumentIndex}
        onApprove={handleApproveDocument}
        onReject={() => {
          setRejectionReason('');
          setShowRejectModal(true);
        }}
      />

      <RejectDocumentModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}
        onConfirm={handleRejectDocument}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
      />

      <Modal
        isOpen={showUnassignModal}
        onClose={() => {
          setShowUnassignModal(false);
          setUserToUnassign(null);
        }}
        title="Remove Room Assignment"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowUnassignModal(false);
                setUserToUnassign(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnassignment}
              className="bg-red-600 hover:bg-red-700"
            >
              <UserX className="w-4 h-4 mr-2" />
              Confirm Removal
            </Button>
          </>
        }
      >
        {userToUnassign && (
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-800 mb-1">
                    Are you sure you want to remove this room assignment?
                  </h4>
                  <p className="text-sm text-red-700">
                    This action will unassign the room from this registration. The room will become available for other users.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Registration Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-semibold text-gray-900">{userToUnassign.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">PNR:</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">{userToUnassign.pnr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Passengers:</span>
                  <span className="text-sm font-semibold text-gray-900">{userToUnassign.numberOfPersons} person(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Room:</span>
                  <span className="text-sm font-bold text-heritage-primary">Room {userToUnassign.roomNumber}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserManagement;
