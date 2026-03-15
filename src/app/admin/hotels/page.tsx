'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Hotel as HotelIcon, Search, X, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import HotelStats from '@/components/admin/hotels/HotelStats';
import HotelList from '@/components/admin/hotels/HotelList';
import AddHotelModal, { HotelFormData } from '@/components/admin/hotels/AddHotelModal';
import ExportReportModal from '@/components/admin/hotels/ExportReportModal';
import {
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetAllHotelsQuery,
  transformHotelFormDataToApiPayload,
  CreateHotelRequest,
  UpdateHotelRequest,
} from '@/services/hotelApi';
import { useUploadBase64Mutation } from '@/services/cloudinaryApi';
import { yatraStorage } from '@/utils/storage';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Hotel Management Page (Admin)
 * 
 * Features:
 * - Add new hotels
 * - Configure floors and rooms
 * - View all rooms and their occupancy status
 * - Manage room assignments
 * - Protected route with AdminLayout
 */
function HotelManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [hotelToDelete, setHotelToDelete] = useState<any>(null);
  const [selectedYatraId, setSelectedYatraId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBedFilter, setActiveBedFilter] = useState<number | null>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get selected yatra ID from storage and sync with changes
  useEffect(() => {
    const updateYatraId = () => {
      const yatraId = yatraStorage.getSelectedYatraId();
      // Use the UUID string directly
      setSelectedYatraId(yatraId || undefined);
    };

    // Initial load
    updateYatraId();

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', updateYatraId);

    // Also check periodically for same-tab changes (when yatra is changed in header)
    const interval = setInterval(updateYatraId, 500);

    return () => {
      window.removeEventListener('storage', updateYatraId);
      clearInterval(interval);
    };
  }, []);

  // Reset bed filter when yatra changes
  useEffect(() => {
    setActiveBedFilter(null);
  }, [selectedYatraId]);

  // Fetch hotels from API filtered by selected yatra ID
  const { data: hotels = [], isLoading: isLoadingHotels, refetch: refetchHotels } = useGetAllHotelsQuery(selectedYatraId);

  // Debounce search query to improve performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter hotels based on debounced search query AND bed configuration
  const filteredHotels = React.useMemo(() => {
    let result = hotels;

    // Apply Bed Configuration Filter
    if (activeBedFilter !== null) {
      result = result.filter((hotel: any) =>
        hotel.rooms?.some((room: any) => {
          const beds = room.numberOfBeds ?? room.number_of_beds ?? 0;
          return Number(beds) === activeBedFilter;
        })
      );
    }

    // Apply Search Query Filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((hotel: any) =>
        hotel.name?.toLowerCase().includes(query) ||
        hotel.address?.toLowerCase().includes(query) ||
        hotel.managerName?.toLowerCase().includes(query) ||
        hotel.hotelType?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [hotels, debouncedSearchQuery, activeBedFilter]);

  // RTK Query mutation hooks
  const [createHotel, { isLoading: isCreatingHotel }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdatingHotel }] = useUpdateHotelMutation();
  const [deleteHotel, { isLoading: isDeletingHotel }] = useDeleteHotelMutation();
  const [uploadBase64, { isLoading: isUploadingImage }] = useUploadBase64Mutation();

  // Handle Add Hotel form submission
  const handleAddHotel = async (data: HotelFormData) => {
    // Validate required fields
    try {
      let visitingCardUrl = null;

      // Upload visiting card image if provided
      if (data.visitingCardImage && data.visitingCardImage.length > 0) {
        const file = data.visitingCardImage[0];

        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:image/...;base64, prefix
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to cloudinary
        const uploadResult = await uploadBase64({
          base64Image: base64,
          folder: 'hotels/visiting-cards',
          tags: ['hotel', 'visiting-card']
        }).unwrap();

        if (uploadResult.success && uploadResult.data) {
          visitingCardUrl = uploadResult.data.secure_url;
        } else {
          throw new Error('Failed to upload visiting card image');
        }
      }

      const selectedYatraId = localStorage.getItem('admin_selected_yatra_id') || "";
      // Transform form data to API payload format
      const apiPayload = {
        ...(transformHotelFormDataToApiPayload(data, selectedYatraId) as CreateHotelRequest),
        visitingCardImage: visitingCardUrl,
      };

      // Call API to create hotel
      const result = await createHotel(apiPayload).unwrap();

      if (result.success) {
        // Refetch hotels list to get updated data from API
        refetchHotels();

        toast.success(`🏨 ${data.name} has been added successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        });

        setShowAddModal(false);
      } else {
        throw new Error(result.message || 'Failed to create hotel');
      }
    } catch (error: any) {
      console.error('[Hotel Creation] Error:', error);
      toast.error(
        error?.data?.message || error?.message || 'Failed to create hotel. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    }
  };

  // Open edit modal
  const handleEditClick = (hotel: any) => {
    setEditingHotel(hotel);
    setShowEditModal(true);
  };

  // Handle Update Hotel form submission
  const handleUpdateHotel = async (data: HotelFormData) => {
    if (!editingHotel) return;

    try {
      let visitingCardUrl = null;

      // Upload visiting card image if provided
      if (data.visitingCardImage && data.visitingCardImage.length > 0) {
        const file = data.visitingCardImage[0];

        // Convert file to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:image/...;base64, prefix
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to cloudinary
        const uploadResult = await uploadBase64({
          base64Image: base64,
          folder: 'hotels/visiting-cards',
          tags: ['hotel', 'visiting-card']
        }).unwrap();

        if (uploadResult.success && uploadResult.data) {
          visitingCardUrl = uploadResult.data.secure_url;
        } else {
          throw new Error('Failed to upload visiting card image');
        }
      }

      const selectedYatraId = localStorage.getItem('admin_selected_yatra_id') || "";

      // Transform form data to API payload format
      const baseApiPayload = transformHotelFormDataToApiPayload(data, selectedYatraId, true) as UpdateHotelRequest; // true indicates this is an update

      // Only include visitingCardImage if a new image was uploaded
      const apiPayload = visitingCardUrl
        ? { ...baseApiPayload, visitingCardImage: visitingCardUrl }
        : baseApiPayload;

      // Call API to update hotel
      const result = await updateHotel({ id: editingHotel.id, data: apiPayload }).unwrap();

      if (result.success) {
        // Refetch hotels list to get updated data from API
        refetchHotels();

        toast.success(`✏️ ${data.name} has been updated successfully!`, {
          position: 'top-right',
          autoClose: 3000,
        });

        setShowEditModal(false);
        setEditingHotel(null);
      } else {
        throw new Error(result.message || 'Failed to update hotel');
      }
    } catch (error: any) {
      console.error('[Hotel Update] Error:', error);
      toast.error(
        error?.data?.message || error?.message || 'Failed to update hotel. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    }
  };

  const handleDeleteClick = (hotel: any) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!hotelToDelete) return;

    try {
      // Call API to delete hotel
      const result = await deleteHotel(hotelToDelete.id).unwrap();

      if (result.success) {
        // Refetch hotels list to get updated data from API
        refetchHotels();

        toast.success(`🗑️ ${hotelToDelete.name} has been deleted permanently`, {
          position: 'top-right',
          autoClose: 3000,
        });

        setShowDeleteModal(false);
        setHotelToDelete(null);
      } else {
        throw new Error(result.message || 'Failed to delete hotel');
      }
    } catch (error: any) {
      console.error('[Hotel Deletion] Error:', error);
      toast.error(
        error?.data?.message || error?.message || 'Failed to delete hotel. Please try again.',
        {
          position: 'top-right',
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-2.5 md:p-3 rounded-xl shadow-lg text-white">
                <HotelIcon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-heritage-textDark">
                Hotel Management
              </h1>
            </div>
          </div>


        </div>
      </div>


      {/* Statistics Section */}
      <HotelStats
        hotels={hotels}
        activeBedFilter={activeBedFilter}
        onBedFilterChange={setActiveBedFilter}
      />

      <div className='flex justify-end items-center gap-4 my-4'>
        <Button
          variant="admin"
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-heritage-primary hover:bg-heritage-secondary text-white shadow-lg shadow-heritage-primary/20 py-2.5 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="text-sm md:text-base font-semibold">Add Hotel</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowExportModal(true)}
          className="w-full sm:w-auto border-heritage-primary text-heritage-primary hover:bg-heritage-highlight py-2.5 px-6"
        >
          <FileText className="w-5 h-5 mr-2" />
          <span className="text-sm md:text-base font-semibold">Export Report</span>
        </Button>

        {/* Search Section */}
        {hotels.length > 0 && (
          <div className="">
            <div className="relative max-w-2xl w-full">
              <div className="absolute z-10 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-heritage-primary/60" />
              </div>
              <input
                type="text"
                placeholder="Search hotels... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('');
                    e.currentTarget.blur();
                  }
                }}
                className="block w-full pl-11 pr-10 py-3 border-2 border-heritage-gold/30 rounded-xl bg-white/80 backdrop-blur-sm text-heritage-textDark placeholder-heritage-text/50 focus:outline-none focus:ring-2 focus:ring-heritage-primary/30 focus:border-heritage-primary transition-all duration-200 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-heritage-text/40 hover:text-heritage-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 flex items-center gap-2">
                {searchQuery !== debouncedSearchQuery && (
                  <div className="w-4 h-4 border-2 border-heritage-primary/30 border-t-heritage-primary rounded-full animate-spin"></div>
                )}
                <p className="text-sm text-heritage-text/60">
                  {filteredHotels.length === 0
                    ? `No matching hotels found`
                    : `Found ${filteredHotels.length} matching hotel${filteredHotels.length === 1 ? '' : 's'}`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hotels List */}
      <HotelList
        hotels={filteredHotels}
        onAddHotel={() => setShowAddModal(true)}
        onEditHotel={handleEditClick}
        onDeleteHotel={handleDeleteClick}
        isLoading={isLoadingHotels}
        searchQuery={debouncedSearchQuery}
        hasYatraSelected={!!selectedYatraId}
      />

      {/* Add Hotel Modal */}
      <AddHotelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddHotel}
        isLoading={isCreatingHotel || isUploadingImage}
      />

      {/* Edit Hotel Modal */}
      <AddHotelModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingHotel(null);
        }}
        onSubmit={handleUpdateHotel}
        initialData={editingHotel}
        isEditMode={true}
        isLoading={isUpdatingHotel || isUploadingImage}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Hotel"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-heritage-text/80">
            Are you sure you want to delete <span className="font-bold text-heritage-textDark">{hotelToDelete?.name}</span>?
            This action cannot be undone and will remove all associated room data.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Hotel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        hotels={hotels}
      />
    </div>
  );
}

export default HotelManagement;
