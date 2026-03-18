'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CheckSquare, UserX, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetUserStatusQuery } from '@/services/dashboardApi';
import { useGetAllHotelsQuery, useUnassignRoomMutation } from '@/services/hotelApi';
import { userStorage, yatraStorage } from '@/utils/storage';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

import UserStatusFilters from '@/components/admin/user-status/UserStatusFilters';
import UserStatusStats from '@/components/admin/user-status/UserStatusStats';
import UserStatusTable from '@/components/admin/user-status/UserStatusTable';
import { useDebounce } from '@/hooks/useDebounce';

function UserStatusManagement() {

  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    setCurrentUser(userStorage.getUser());
  }, []);

  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(null);

  useEffect(() => {
    const yatraId = yatraStorage.getSelectedYatraId();
    setSelectedYatraId(yatraId);

    const handleStorageChange = () => setSelectedYatraId(yatraStorage.getSelectedYatraId());
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [hotelId, setHotelId] = useState('all');
  const [status, setStatus] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYatraId, debouncedSearchTerm, hotelId, status]);

  // Fetch API Data
  const {
    data: userStatusResponse,
    isLoading: isLoadingStatus,
    isError: isStatusError,
    error: statusError,
    refetch: refetchStatus,
    isFetching,
  } = useGetUserStatusQuery(
    {
      yatraId: selectedYatraId!,
      hotelId: hotelId === 'all' ? undefined : hotelId,
      status: status === 'all' ? undefined : status,
      search: debouncedSearchTerm,
      page: currentPage,
      limit: itemsPerPage,
    },
    { skip: !selectedYatraId }
  );

  const { data: hotelsData } = useGetAllHotelsQuery(selectedYatraId!, { skip: !selectedYatraId });

  const hotelOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Hotels' }];
    if (hotelsData && Array.isArray(hotelsData)) {
      hotelsData.forEach(hotel => {
        options.push({ value: hotel.id, label: hotel.name });
      });
    }
    return options;
  }, [hotelsData]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const stats = useMemo(() => userStatusResponse?.statistics, [userStatusResponse]);
  const registrations = useMemo(() => userStatusResponse?.data || [], [userStatusResponse]);
  const paginationData = useMemo(() => {
    return userStatusResponse?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 0 };
  }, [userStatusResponse, itemsPerPage]);

  const [userToUnassign, setUserToUnassign] = useState<any>(null);
  const [showUnassignModal, setShowUnassignModal] = useState(false);

  const [unassignRoomApi, { isLoading: isUnassigning }] = useUnassignRoomMutation();

  const handleUnassignClick = (registration: any) => {
    setUserToUnassign(registration);
    setShowUnassignModal(true);
  };

  const handleConfirmUnassignment = async () => {
    if (!userToUnassign) return;
    try {
      const result = await unassignRoomApi(userToUnassign.id).unwrap();
      if (result.success) {
        toast.success(`🗑️ Room assignment removed for ${userToUnassign.name}.`);
        setShowUnassignModal(false);
        setUserToUnassign(null);
        refetchStatus();
      } else {
        toast.error('Failed to remove room assignment.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Error removing room assignment.');
    }
  };

  if (!selectedYatraId) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
            <CheckSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
            User Status Management
          </h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="bg-heritage-highlight/30 border-2 border-heritage-gold/30 rounded-xl p-6">
              <CheckSquare className="w-12 h-12 text-heritage-text/60 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-heritage-textDark mb-2">No Yatra Selected</h3>
              <p className="text-sm text-heritage-text/70">
                Please select a Yatra from the header dropdown to view status.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg">
          <CheckSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
          User Status Checking
        </h1>
      </div>

      <UserStatusStats stats={stats} isLoading={isLoadingStatus} />

      <UserStatusFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        hotelId={hotelId}
        setHotelId={setHotelId}
        status={status}
        setStatus={setStatus}
        hotelOptions={hotelOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalCount={paginationData.total}
      />

      <UserStatusTable
        data={registrations}
        onUnassignRoom={handleUnassignClick}
        isLoading={isFetching}
        userRole={currentUser?.role}
      />

      <Pagination
        currentPage={paginationData.page}
        totalPages={paginationData.totalPages}
        onPageChange={setCurrentPage}
        totalItems={paginationData.total}
        itemsPerPage={paginationData.limit}
      />

      {/* Remove Room Assignment Modal */}
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
            <Button variant="outline" onClick={() => { setShowUnassignModal(false); setUserToUnassign(null); }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUnassignment}
              disabled={isUnassigning}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isUnassigning ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Removing...</>
              ) : (
                <><UserX className="w-4 h-4 mr-2" /> Confirm Removal</>
              )}
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
              </div>
            </div>
          </div>
        )}
      </Modal>    </div>
  );
}

export default UserStatusManagement;
