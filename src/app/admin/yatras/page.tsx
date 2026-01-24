'use client';

import React, { Fragment, useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Yatra } from '@/types';
import { Plus, Mountain, Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import YatraTable from '@/components/admin/yatras/YatraTable';
import YatraModal from '@/components/admin/yatras/YatraModal';
import {
  useGetAllYatrasQuery,
  useCreateYatraMutation,
  useUpdateYatraMutation,
  useDeleteYatraMutation,
} from '@/services/yatraApi';
import { useUploadBase64Mutation } from '@/services/cloudinaryApi';

/**
 * Yatra Management Page
 * 
 * Features:
 * - List all yatras with status, dates, and deadline
 * - Create new yatra with validation
 * - Edit existing yatra
 * - Delete yatra with confirmation
 * - Toggle active/inactive status
 * - Heritage glassmorphism theme
 */

interface YatraFormData {
  title: string;
  bannerImage?: File | string | null;
  mobileBannerImage?: File | string | null;
  startDate: string;
  endDate: string;
  registerStartDate: string;
  registerEndDate: string;
}

export default function YatrasPage() {
  // RTK Query hooks
  const {
    data: yatras = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllYatrasQuery();

  const [createYatra, { isLoading: isCreating }] = useCreateYatraMutation();
  const [updateYatra, { isLoading: isUpdating }] = useUpdateYatraMutation();
  const [deleteYatra, { isLoading: isDeleting }] = useDeleteYatraMutation();
  const [uploadBase64, { isLoading: isUploading }] = useUploadBase64Mutation();

  const [showModal, setShowModal] = useState(false);
  const [editingYatra, setEditingYatra] = useState<Yatra | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open modal for creating new yatra
  const handleAddYatra = () => {
    setEditingYatra(null);
    setShowModal(true);
  };

  // Open modal for editing existing yatra
  const handleEditYatra = (yatra: Yatra) => {
    setEditingYatra(yatra);
    setShowModal(true);
  };

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form (create or update)
  const onSubmit = async (data: YatraFormData) => {
    try {
      let bannerImageUrl: string | undefined = undefined;
      let mobileBannerImageUrl: string | null | undefined = undefined;

      // If banner image is a File, convert to base64 and upload to Cloudinary
      if (data.bannerImage instanceof File) {
        try {
          // Convert file to base64
          const base64Image = await fileToBase64(data.bannerImage);

          // Generate public_id from yatra title (sanitized)
          const sanitizedTitle = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
          const publicId = `yatra_banner_${sanitizedTitle}_${Date.now()}`;

          // Upload to Cloudinary
          const uploadResult = await uploadBase64({
            base64Image,
            folder: 'yatra/banners',
            public_id: publicId,
            tags: ['yatra', 'banner', 'upload'],
          }).unwrap();

          if (uploadResult.success && uploadResult.data) {
            bannerImageUrl = uploadResult.data.secure_url;
            // show success toast
            toast.success('Banner image uploaded successfully!');
          } else {
            throw new Error(uploadResult.error || 'Failed to upload banner image');
          }
        } catch (uploadError: any) {
          console.error('Banner upload error:', uploadError);
          toast.error(uploadError?.data?.error || uploadError?.message || 'Failed to upload banner image');
          return; // Stop submission if upload fails
        }
      } else if (typeof data.bannerImage === 'string' && data.bannerImage) {
        // If it's already a URL string, use it directly
        bannerImageUrl = data.bannerImage;
      }

      // Handle mobile banner image upload
      if (data.mobileBannerImage instanceof File) {
        try {
          // Convert file to base64
          const base64Image = await fileToBase64(data.mobileBannerImage);

          // Generate public_id from yatra title (sanitized)
          const sanitizedTitle = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
          const publicId = `yatra_mobile_banner_${sanitizedTitle}_${Date.now()}`;

          // Upload to Cloudinary
          const uploadResult = await uploadBase64({
            base64Image,
            folder: 'yatra/mobile-banners',
            public_id: publicId,
            tags: ['yatra', 'mobile-banner', 'upload'],
          }).unwrap();

          if (uploadResult.success && uploadResult.data) {
            mobileBannerImageUrl = uploadResult.data.secure_url;
            toast.success('Mobile banner image uploaded successfully!');
          } else {
            throw new Error(uploadResult.error || 'Failed to upload mobile banner image');
          }
        } catch (uploadError: any) {
          console.error('Mobile banner upload error:', uploadError);
          toast.error(uploadError?.data?.error || uploadError?.message || 'Failed to upload mobile banner image');
          return; // Stop submission if upload fails
        }
      } else if (typeof data.mobileBannerImage === 'string' && data.mobileBannerImage) {
        // If it's already a URL string, use it directly
        mobileBannerImageUrl = data.mobileBannerImage;
      } else if (editingYatra && data.mobileBannerImage === null) {
        // If mobile banner was removed (null), send null to API
        mobileBannerImageUrl = null;
      }

      if (editingYatra) {
        // Update existing yatra - transform to snake_case for API
        const updateData: any = {
          name: data.title,
          start_date: data.startDate,
          end_date: data.endDate,
          registration_start_date: data.registerStartDate,
          registration_end_date: data.registerEndDate,
        };

        // Only include banner_image if it was changed
        if (bannerImageUrl !== undefined) {
          updateData.banner_image = bannerImageUrl;
        }

        // Include mobile_banner_image (can be URL, or null if removed)
        if (mobileBannerImageUrl !== undefined) {
          updateData.mobile_banner_image = mobileBannerImageUrl;
        }

        await updateYatra({
          id: editingYatra.id,
          data: updateData,
        }).unwrap();
        toast.success(`Yatra "${data.title}" updated successfully!`);
      } else {
        // Create new yatra - transform to snake_case for API
        const createData: any = {
          name: data.title,
          start_date: data.startDate,
          end_date: data.endDate,
          registration_start_date: data.registerStartDate,
          registration_end_date: data.registerEndDate,
        };

        // Include banner_image if provided
        if (bannerImageUrl) {
          createData.banner_image = bannerImageUrl;
        }

        // Include mobile_banner_image if provided
        if (mobileBannerImageUrl) {
          createData.mobile_banner_image = mobileBannerImageUrl;
        }

        await createYatra(createData).unwrap();
        toast.success(`Yatra "${data.title}" created successfully!`);
      }
      setShowModal(false);
      setEditingYatra(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  // Delete yatra with confirmation
  const handleDeleteYatra = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        const yatra = yatras.find((y) => y.id === deleteConfirmId);
        await deleteYatra(deleteConfirmId).unwrap();
        toast.success(`Yatra "${yatra?.name}" deleted successfully!`);
        setDeleteConfirmId(null);
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || 'Failed to delete yatra';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Fragment>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-glass rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-heritage-textDark flex items-center gap-2">
                <div className="bg-gradient-to-br from-heritage-primary to-heritage-secondary p-3 rounded-xl shadow-lg">
                  <Mountain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                Yatra Management
              </h1>

            </div>
            <Button
              onClick={handleAddYatra}
              variant="admin"
              size="lg"
              className="w-full sm:w-auto"
              disabled={isUploading}
            >
              <Plus className="w-5 h-5 mr-2" />
              {isUploading ? 'Uploading...' : 'Create Yatra'}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-glass rounded-2xl p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-heritage-primary animate-spin" />
              <p className="text-heritage-text/70 text-lg font-medium">Loading yatras...</p>
            </div>
          </div>
        )}


        {/* Error State */}
        {isError && (
          <div className="bg-white/80 backdrop-blur-md border border-red-200/60 shadow-glass rounded-2xl p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load yatras</h3>
                <p className="text-red-700 mb-4">
                  {error && 'data' in error
                    ? (error.data as any)?.message || 'An unexpected error occurred'
                    : 'Network error. Please check your connection.'}
                </p>
                <Button
                  variant="admin"
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Yatras Table */}
        {!isLoading && !isError && (
          <YatraTable
            yatras={yatras}
            onEdit={handleEditYatra}
            onDelete={handleDeleteYatra}
          />
        )}
      </div>

      {/* Create/Edit Yatra Modal */}
      <YatraModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingYatra(null);
        }}
        onSubmit={onSubmit}
        editingYatra={editingYatra}
        isLoading={isCreating || isUpdating || isUploading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Yatra"
        size="md"
        variant="admin"
      >
        <div className="space-y-4">
          <div className="bg-red-50/60 border border-red-200/60 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900">
                  Are you sure you want to delete this yatra?
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone. All yatra data will be permanently removed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="admin-outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Yatra
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
