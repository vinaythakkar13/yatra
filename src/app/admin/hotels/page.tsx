'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Hotel as HotelIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import HotelStats from '@/components/admin/hotels/HotelStats';
import HotelList from '@/components/admin/hotels/HotelList';
import AddHotelModal, { HotelFormData } from '@/components/admin/hotels/AddHotelModal';
import {
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetAllHotelsQuery,
  transformHotelFormDataToApiPayload,
} from '@/services/hotelApi';
import { yatraStorage } from '@/utils/storage';

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
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [hotelToDelete, setHotelToDelete] = useState<any>(null);
  const [selectedYatraId, setSelectedYatraId] = useState<string | undefined>(undefined);

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

  // Fetch hotels from API filtered by selected yatra ID
  const { data: hotels = [], isLoading: isLoadingHotels, refetch: refetchHotels } = useGetAllHotelsQuery(selectedYatraId);

  // RTK Query mutation hooks
  const [createHotel, { isLoading: isCreatingHotel }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdatingHotel }] = useUpdateHotelMutation();
  const [deleteHotel, { isLoading: isDeletingHotel }] = useDeleteHotelMutation();

  // Handle Add Hotel form submission
  const handleAddHotel = async (data: HotelFormData) => {
    // Validate required fields
    if (!data.yatraId) {
      toast.error('Please select a Yatra', {
        position: 'top-right',
      });
      return;
    }

    try {
      // Transform form data to API payload format
      const apiPayload = transformHotelFormDataToApiPayload(data, data.yatraId);

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

    // Validate required fields
    if (!data.yatraId) {
      toast.error('Please select a Yatra', {
        position: 'top-right',
      });
      return;
    }

    try {
      // Transform form data to API payload format
      const apiPayload = transformHotelFormDataToApiPayload(data, data.yatraId);

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
            <p className="text-sm md:text-base text-heritage-text/70 ml-0 sm:ml-12">
              Manage hotels, rooms, and accommodations
            </p>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant="admin"
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto bg-heritage-primary hover:bg-heritage-secondary text-white shadow-lg shadow-heritage-primary/20"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">Add Hotel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <HotelStats hotels={hotels} />

      {/* Hotels List */}
      <HotelList
        hotels={hotels}
        onAddHotel={() => setShowAddModal(true)}
        onEditHotel={handleEditClick}
        onDeleteHotel={handleDeleteClick}
      />

      {/* Add Hotel Modal */}
      <AddHotelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddHotel}
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
    </div>
  );
}

export default HotelManagement;
