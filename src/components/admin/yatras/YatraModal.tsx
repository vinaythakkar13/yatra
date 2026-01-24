import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import LoadingEmoji from '@/components/ui/LoadingEmoji';
import { Yatra } from '@/types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '@/utils/common';

interface YatraFormData {
    title: string;
    bannerImage?: File | string | null;
    mobileBannerImage?: File | string | null;
    startDate: string;
    endDate: string;
    registerStartDate: string;
    registerEndDate: string;
}

interface YatraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: YatraFormData) => void;
    editingYatra: Yatra | null;
    isLoading?: boolean;
}

const YatraModal: React.FC<YatraModalProps> = ({ isOpen, onClose, onSubmit, editingYatra, isLoading = false }) => {
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [mobileBannerPreview, setMobileBannerPreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const mobileFileInputRef = React.useRef<HTMLInputElement>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<YatraFormData>({
        defaultValues: editingYatra ? {
            title: editingYatra.name,
            bannerImage: editingYatra.banner_image || null,
            mobileBannerImage: editingYatra.mobile_banner_image || null,
            startDate: formatDate(editingYatra.start_date),
            endDate: formatDate(editingYatra.end_date),
            registerStartDate: formatDate(editingYatra.registration_start_date),
            registerEndDate: formatDate(editingYatra.registration_end_date),
        } : {
            title: '',
            bannerImage: null,
            mobileBannerImage: null,
            startDate: '',
            endDate: '',
            registerStartDate: '',
            registerEndDate: '',
        }
    });

    const startDateValue = watch('startDate');
    const registerStartDateValue = watch('registerStartDate');
    const bannerImageValue = watch('bannerImage');
    const mobileBannerImageValue = watch('mobileBannerImage');

    // Handle banner image preview
    useEffect(() => {
        if (bannerImageValue instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(bannerImageValue);
        } else if (typeof bannerImageValue === 'string' && bannerImageValue) {
            setBannerPreview(bannerImageValue);
        } else {
            setBannerPreview(null);
        }
    }, [bannerImageValue]);

    // Handle mobile banner image preview
    useEffect(() => {
        if (mobileBannerImageValue instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMobileBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(mobileBannerImageValue);
        } else if (typeof mobileBannerImageValue === 'string' && mobileBannerImageValue) {
            setMobileBannerPreview(mobileBannerImageValue);
        } else {
            setMobileBannerPreview(null);
        }
    }, [mobileBannerImageValue]);

    // Helper function to safely format dates
    const safeFormatDate = (date: string | null | undefined): string => {
        if (!date) return '';
        try {
            return formatDate(date);
        } catch (error) {
            console.error('Error formatting date:', date, error);
            return '';
        }
    };

    // Helper function to safely parse date string to Date object
    const safeParseDate = (dateStr: string | null | undefined): Date | null => {
        if (!dateStr) return null;
        try {
            const date = new Date(dateStr + 'T00:00:00');
            if (isNaN(date.getTime())) {
                // If invalid, try parsing as-is
                const date2 = new Date(dateStr);
                if (isNaN(date2.getTime())) {
                    return null;
                }
                return date2;
            }
            return date;
        } catch (error) {
            console.error('Error parsing date:', dateStr, error);
            return null;
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            if (editingYatra) {
                const bannerUrl = editingYatra.banner_image || null;
                const mobileBannerUrl = editingYatra.mobile_banner_image || null;
                reset({
                    title: editingYatra.name,
                    bannerImage: bannerUrl,
                    mobileBannerImage: mobileBannerUrl,
                    startDate: safeFormatDate(editingYatra.start_date),
                    endDate: safeFormatDate(editingYatra.end_date),
                    registerStartDate: safeFormatDate(editingYatra.registration_start_date),
                    registerEndDate: safeFormatDate(editingYatra.registration_end_date),
                });
                setBannerPreview(bannerUrl);
                setMobileBannerPreview(mobileBannerUrl);
            } else {
                reset({
                    title: '',
                    bannerImage: null,
                    mobileBannerImage: null,
                    startDate: '',
                    endDate: '',
                    registerStartDate: '',
                    registerEndDate: '',
                });
                setBannerPreview(null);
                setMobileBannerPreview(null);
            }
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (mobileFileInputRef.current) {
                mobileFileInputRef.current.value = '';
            }
        }
    }, [isOpen, editingYatra, reset]);

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setValue('bannerImage', null);
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setValue('bannerImage', null);
                return;
            }
            setValue('bannerImage', file, { shouldValidate: true });
        }
    };

    const handleMobileBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setValue('mobileBannerImage', null);
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setValue('mobileBannerImage', null);
                return;
            }
            setValue('mobileBannerImage', file, { shouldValidate: true });
        }
    };

    const handleBannerRemove = () => {
        setValue('bannerImage', null, { shouldValidate: true });
        setBannerPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleMobileBannerRemove = () => {
        setValue('mobileBannerImage', null, { shouldValidate: true });
        setMobileBannerPreview(null);
        if (mobileFileInputRef.current) {
            mobileFileInputRef.current.value = '';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingYatra ? 'Edit Yatra' : 'Create New Yatra'}
            size="lg"
            variant="admin"
            closeOnBackdropClick={false}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 relative font-inter">
                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    rules={{
                        required: 'Yatra name is required',
                        minLength: { value: 3, message: 'Title must be at least 3 characters' },
                        validate: (value) => {
                            if (!value.trim()) return 'Title cannot be empty or just spaces';
                            return true;
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Yatra Name"
                            placeholder="e.g., Char Dham Yatra 2025"
                            error={errors.title?.message}
                            required
                            variant="admin"
                            onChange={(e) => {
                                field.onChange(e);
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Start Date */}
                    <Controller
                        name="startDate"
                        control={control}
                        rules={{
                            required: 'Start date is required',
                            validate: (value) => {
                                if (!value) return 'Start date is required';
                                const selectedDate = safeParseDate(value);
                                if (!selectedDate) return 'Invalid start date';
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (selectedDate < today) {
                                    return 'Start date cannot be in the past';
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <DatePicker
                                label="Start Date"
                                value={safeParseDate(field.value)}
                                onChange={(date) => {
                                    if (date) {
                                        // Format date as YYYY-MM-DD in local timezone (no timezone conversion)
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const dateStr = `${year}-${month}-${day}`;
                                        field.onChange(dateStr);
                                        setValue('startDate', dateStr, { shouldValidate: true });
                                    } else {
                                        field.onChange('');
                                        setValue('startDate', '', { shouldValidate: true });
                                    }
                                }}
                                minDate={new Date()}
                                required
                                error={errors.startDate?.message}
                                variant="admin"
                            />
                        )}
                    />

                    {/* End Date */}
                    <Controller
                        name="endDate"
                        control={control}
                        rules={{
                            required: 'End date is required',
                            validate: (value) => {
                                if (!value) return 'End date is required';
                                const selectedDate = safeParseDate(value);
                                if (!selectedDate) return 'Invalid end date';
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (selectedDate < today) {
                                    return 'End date cannot be in the past';
                                }
                                if (startDateValue) {
                                    const startDate = safeParseDate(startDateValue);

                                    // allow same day
                                    if (startDate && selectedDate < startDate) {
                                        return 'End date must be after start date';
                                    }
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <DatePicker
                                label="End Date"
                                value={safeParseDate(field.value)}
                                onChange={(date) => {
                                    if (date) {
                                        // Format date as YYYY-MM-DD in local timezone (no timezone conversion)
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const dateStr = `${year}-${month}-${day}`;
                                        field.onChange(dateStr);
                                        setValue('endDate', dateStr, { shouldValidate: true });
                                    } else {
                                        field.onChange('');
                                        setValue('endDate', '', { shouldValidate: true });
                                    }
                                }}
                                minDate={startDateValue ? safeParseDate(startDateValue) || new Date() : new Date()}
                                required
                                error={errors.endDate?.message}
                                variant="admin"
                            />
                        )}
                    />
                </div>

                {/* Registration Period */}
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Register Start Date */}
                        <Controller
                            name="registerStartDate"
                            control={control}
                            rules={{
                                required: 'Registration start date is required',
                                validate: (value) => {
                                    if (!value) return 'Registration start date is required';
                                    const selectedDate = safeParseDate(value);
                                    if (!selectedDate) return 'Invalid registration start date';
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate < today) {
                                        return 'Registration start date cannot be in the past';
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Registration Start Date"
                                    value={safeParseDate(field.value)}
                                    onChange={(date) => {
                                        if (date) {
                                            // Format date as YYYY-MM-DD in local timezone (no timezone conversion)
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const dateStr = `${year}-${month}-${day}`;
                                            field.onChange(dateStr);
                                            setValue('registerStartDate', dateStr, { shouldValidate: true });
                                        } else {
                                            field.onChange('');
                                            setValue('registerStartDate', '', { shouldValidate: true });
                                        }
                                    }}
                                    minDate={new Date()}
                                    maxDate={startDateValue ? (() => {
                                        const maxDate = safeParseDate(startDateValue);
                                        if (!maxDate) return undefined;
                                        maxDate.setDate(maxDate.getDate() - 1);
                                        return maxDate;
                                    })() : undefined}
                                    required
                                    error={errors.registerStartDate?.message}
                                    variant="admin"
                                />
                            )}
                        />

                        {/* Register End Date */}
                        <Controller
                            name="registerEndDate"
                            control={control}
                            rules={{
                                required: 'Registration end date is required',
                                validate: (value) => {
                                    if (!value) return 'Registration end date is required';
                                    const selectedDate = safeParseDate(value);
                                    if (!selectedDate) return 'Invalid registration end date';
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate < today) {
                                        return 'Registration end date cannot be in the past';
                                    }
                                    // Validate that register end date is after register start date
                                    if (registerStartDateValue) {
                                        const regStartDate = safeParseDate(registerStartDateValue);
                                        if (regStartDate && selectedDate < regStartDate) {
                                            return 'Registration end date must be after start date';
                                        }
                                    }
                                    // Validate that register end date is before yatra start date
                                    if (startDateValue) {
                                        const yatraStartDate = safeParseDate(startDateValue);
                                        if (yatraStartDate && selectedDate >= yatraStartDate) {
                                            return 'Registration end date must be before yatra start date';
                                        }
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Registration End Date"
                                    value={safeParseDate(field.value)}
                                    onChange={(date) => {
                                        if (date) {
                                            // Format date as YYYY-MM-DD in local timezone (no timezone conversion)
                                            const year = date.getFullYear();
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const dateStr = `${year}-${month}-${day}`;
                                            field.onChange(dateStr);
                                            setValue('registerEndDate', dateStr, { shouldValidate: true });
                                        } else {
                                            field.onChange('');
                                            setValue('registerEndDate', '', { shouldValidate: true });
                                        }
                                    }}
                                    minDate={registerStartDateValue ? safeParseDate(registerStartDateValue) || new Date() : new Date()}
                                    maxDate={startDateValue ? (() => {
                                        const maxDate = safeParseDate(startDateValue);
                                        if (!maxDate) return undefined;
                                        maxDate.setDate(maxDate.getDate() - 1);
                                        return maxDate;
                                    })() : undefined}
                                    required
                                    error={errors.registerEndDate?.message}
                                    variant="admin"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Banner Image Upload */}
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-2 text-heritage-textDark">
                        Banner Image
                    </label>
                    <Controller
                        name="bannerImage"
                        control={control}
                        render={({ field }) => (
                            <div className="w-full">
                                {bannerPreview ? (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-heritage-gold/40 group">
                                        <img
                                            src={bannerPreview}
                                            alt="Banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleBannerRemove}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-lg text-heritage-textDark font-medium hover:bg-white transition-colors">
                                                <Upload className="w-4 h-4 inline-block mr-2" />
                                                Change Image
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleBannerUpload(e);
                                                        field.onChange(e.target.files?.[0] || null);
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer border-2 border-dashed border-heritage-gold/40 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-heritage-highlight/10 hover:bg-heritage-highlight/20 transition-all duration-200 group">
                                        <div className="bg-heritage-primary/10 p-4 rounded-full mb-3 group-hover:bg-heritage-primary/20 transition-colors">
                                            <ImageIcon className="w-8 h-8 text-heritage-primary" />
                                        </div>
                                        <p className="text-sm font-medium text-heritage-textDark mb-1">
                                            Upload Banner Image
                                        </p>
                                        <p className="text-xs text-heritage-text/60">
                                            PNG, JPG up to 5MB • Recommended: 1920x600px
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleBannerUpload(e);
                                                field.onChange(e.target.files?.[0] || null);
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.bannerImage && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center animate-slide-down">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.bannerImage.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Mobile Banner Image Upload */}
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-2 text-heritage-textDark">
                        Mobile Banner Image <span className="text-heritage-text/60 font-normal">(Optional)</span>
                    </label>
                    <Controller
                        name="mobileBannerImage"
                        control={control}
                        render={({ field }) => (
                            <div className="w-full">
                                {mobileBannerPreview ? (
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-heritage-gold/40 group">
                                        <img
                                            src={mobileBannerPreview}
                                            alt="Mobile banner preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleMobileBannerRemove}
                                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                            <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-lg text-heritage-textDark font-medium hover:bg-white transition-colors">
                                                <Upload className="w-4 h-4 inline-block mr-2" />
                                                Change Image
                                                <input
                                                    ref={mobileFileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleMobileBannerUpload(e);
                                                        field.onChange(e.target.files?.[0] || null);
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer border-2 border-dashed border-heritage-gold/40 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-heritage-highlight/10 hover:bg-heritage-highlight/20 transition-all duration-200 group">
                                        <div className="bg-heritage-primary/10 p-4 rounded-full mb-3 group-hover:bg-heritage-primary/20 transition-colors">
                                            <ImageIcon className="w-8 h-8 text-heritage-primary" />
                                        </div>
                                        <p className="text-sm font-medium text-heritage-textDark mb-1">
                                            Upload Mobile Banner Image
                                        </p>
                                        <p className="text-xs text-heritage-text/60">
                                            PNG, JPG up to 5MB • Recommended: 600x800px
                                        </p>
                                        <input
                                            ref={mobileFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleMobileBannerUpload(e);
                                                field.onChange(e.target.files?.[0] || null);
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                {errors.mobileBannerImage && (
                                    <p className="mt-1.5 text-sm text-red-600 flex items-center animate-slide-down">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.mobileBannerImage.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-50">
                        <LoadingEmoji size="lg" showText text={editingYatra ? 'Updating yatra...' : 'Creating yatra...'} />
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 relative">
                    <Button
                        type="button"
                        variant="admin-outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="admin"
                        disabled={isLoading}
                        isLoading={isLoading}
                    >
                        {editingYatra ? 'Update Yatra' : 'Create Yatra'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default YatraModal;
