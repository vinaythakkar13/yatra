import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import ReactDatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, Clock, Upload, X, MapPin, Users as UsersIcon, FileText, Image as ImageIcon } from 'lucide-react';

interface EventFormData {
    title: string;
    type: 'yatra' | 'booking' | 'event' | 'task';
    isFullDay: boolean;
    startDate: Date | null;
    endDate: Date | null;
    startTime: Date | null;
    endTime: Date | null;
    location?: string;
    attendees?: number;
    description?: string;
    image?: string;
}

interface CalendarEvent {
    id: string | number;
    title: string;
    start: Date;
    end: Date;
    type?: 'yatra' | 'booking' | 'event' | 'task';
    location?: string;
    attendees?: number;
    description?: string;
    image?: string;
}

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EventFormData) => void;
    editingEvent: CalendarEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, editingEvent }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<EventFormData>({
        defaultValues: {
            title: '',
            type: 'event',
            isFullDay: false,
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            location: '',
            attendees: undefined,
            description: '',
            image: ''
        }
    });

    const isFullDay = watch('isFullDay');
    const startDate = watch('startDate');
    const endDate = watch('endDate');
    const startTime = watch('startTime');
    const selectedType = watch('type');

    // Reset form when modal opens/closes or editing event changes
    useEffect(() => {
        if (isOpen) {
            if (editingEvent) {
                reset({
                    title: editingEvent.title,
                    type: editingEvent.type || 'event',
                    isFullDay: true, // Simplified for now
                    startDate: editingEvent.start,
                    endDate: editingEvent.end,
                    startTime: editingEvent.start,
                    endTime: editingEvent.end,
                    location: editingEvent.location || '',
                    attendees: editingEvent.attendees,
                    description: editingEvent.description || '',
                    image: editingEvent.image || ''
                });
                setImagePreview(editingEvent.image || null);
            } else {
                reset({
                    title: '',
                    type: 'event',
                    isFullDay: false,
                    startDate: null,
                    endDate: null,
                    startTime: null,
                    endTime: null,
                    location: '',
                    attendees: undefined,
                    description: '',
                    image: ''
                });
                setImagePreview(null);
            }
        }
    }, [isOpen, editingEvent, reset]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setValue('image', result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setImagePreview(null);
        setValue('image', '');
    };

    const eventTypeOptions = [
        {
            value: 'yatra',
            label: 'Yatra',
            gradient: 'from-heritage-secondary to-heritage-maroon',
            tag: 'bg-heritage-secondary border-heritage-maroon'
        },
        {
            value: 'booking',
            label: 'Booking',
            gradient: 'from-heritage-gold to-heritage-primary',
            tag: 'bg-heritage-gold border-heritage-primary'
        },
        {
            value: 'event',
            label: 'Event',
            gradient: 'from-kesari-light to-kesari-dark',
            tag: 'bg-kesari border-kesari-dark'
        },
        {
            value: 'task',
            label: 'Task',
            gradient: 'from-heritage-maroon to-heritage-textDark',
            tag: 'bg-heritage-maroon border-heritage-textDark'
        },
    ];

    const selectedTypeData = eventTypeOptions.find(opt => opt.value === selectedType);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingEvent ? 'Edit Event' : 'Create New Event'}
            size="lg"
            variant="admin"
            closeOnBackdropClick={false}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Title */}
                <Controller
                    name="title"
                    control={control}
                    rules={{
                        required: 'Event title is required',
                        minLength: { value: 3, message: 'Title must be at least 3 characters' },
                        validate: (value) => {
                            if (!value.trim()) return 'Title cannot be empty or just spaces';
                            return true;
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Event Title"
                            placeholder="e.g., Golden Temple Yatra"
                            error={errors.title?.message}
                            required
                            variant="admin"
                        />
                    )}
                />

                {/* Event Type Selector */}
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-2 text-heritage-textDark">
                        Event Type <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: 'Event type is required' }}
                        render={({ field }) => (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {eventTypeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => field.onChange(option.value)}
                                        className={`
                                            relative p-4 rounded-xl border-2 transition-all duration-300
                                            ${field.value === option.value
                                                ? `bg-gradient-to-br ${option.gradient} text-white border-transparent shadow-lg scale-105`
                                                : 'bg-white/60 border-heritage-gold/30 text-heritage-textDark hover:border-heritage-gold/60 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className="text-sm font-semibold">{option.label}</div>
                                        {field.value === option.value && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    />
                    {errors.type && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.type.message}
                        </p>
                    )}
                </div>

                {/* Full Day Toggle */}
                <div className="p-4 rounded-xl bg-heritage-highlight/20 border border-heritage-gold/20">
                    <Controller
                        name="isFullDay"
                        control={control}
                        render={({ field }) => (
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-6 h-6 rounded-md border-2 border-heritage-primary/40 bg-white transition-all duration-200 peer-checked:bg-gradient-to-br peer-checked:from-heritage-primary peer-checked:to-heritage-secondary peer-checked:border-heritage-primary group-hover:border-heritage-primary/60">
                                        <svg
                                            className={`w-full h-full text-white transition-all duration-200 ${field.value ? 'opacity-100' : 'scale-0 opacity-0'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-sm font-semibold text-heritage-textDark group-hover:text-heritage-primary transition-colors">
                                        Full Day Event
                                    </span>
                                    <p className="text-xs text-heritage-text/60">Event spans the entire day without specific times</p>
                                </div>
                            </label>
                        )}
                    />
                </div>

                {/* Date and Time Pickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Start Date */}
                    <div>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{
                                required: 'Start date is required',
                                validate: (value) => {
                                    if (!value) return 'Start date is required';
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <DatePicker
                                    label="Start Date"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    minDate={new Date()}
                                    required
                                    error={errors.startDate?.message}
                                    variant="admin"
                                />
                            )}
                        />

                        {/* Start Time (conditional) */}
                        {!isFullDay && (
                            <div className="mt-3">
                                <Controller
                                    name="startTime"
                                    control={control}
                                    rules={{
                                        required: !isFullDay ? 'Start time is required' : false
                                    }}
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <label className="block text-sm font-semibold mb-2 text-heritage-textDark">
                                                Start Time {!isFullDay && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            <div className="relative w-full">
                                                <ReactDatePicker
                                                    selected={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Select time"
                                                    className={`
                                                        w-full px-4 py-3 pl-11 rounded-lg border-2 transition-all duration-200 bg-white
                                                        ${errors.startTime
                                                            ? 'border-red-500 focus:border-red-600'
                                                            : 'border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20'
                                                        }
                                                        placeholder:text-heritage-text/50 text-heritage-textDark
                                                    `}
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Clock className="w-5 h-5 text-heritage-text/60" />
                                                </div>
                                            </div>
                                            {errors.startTime && (
                                                <p className="mt-1.5 text-sm text-red-600">{errors.startTime.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <Controller
                            name="endDate"
                            control={control}
                            rules={{
                                required: 'End date is required',
                                validate: (value) => {
                                    if (!value) return 'End date is required';
                                    if (startDate && value < startDate) {
                                        return 'End date must be after start date';
                                    }
                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <DatePicker
                                    label="End Date"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    minDate={startDate || new Date()}
                                    required
                                    error={errors.endDate?.message}
                                    variant="admin"
                                />
                            )}
                        />

                        {/* End Time (conditional) */}
                        {!isFullDay && (
                            <div className="mt-3">
                                <Controller
                                    name="endTime"
                                    control={control}
                                    rules={{
                                        required: !isFullDay ? 'End time is required' : false,
                                        validate: (value) => {
                                            if (!isFullDay && startTime && value) {
                                                // If same day, check time
                                                if (startDate && endDate &&
                                                    startDate.toDateString() === endDate.toDateString() &&
                                                    value <= startTime) {
                                                    return 'End time must be after start time';
                                                }
                                            }
                                            return true;
                                        }
                                    }}
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <label className="block text-sm font-semibold mb-2 text-heritage-textDark">
                                                End Time {!isFullDay && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            <div className="relative">
                                                <ReactDatePicker
                                                    selected={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Select time"
                                                    className={`
                                                        w-full px-4 py-3 pl-11 rounded-lg border-2 transition-all duration-200 bg-white
                                                        ${errors.endTime
                                                            ? 'border-red-500 focus:border-red-600'
                                                            : 'border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20'
                                                        }
                                                        placeholder:text-heritage-text/50 text-heritage-textDark
                                                    `}
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Clock className="w-5 h-5 text-heritage-text/60" />
                                                </div>
                                            </div>
                                            {errors.endTime && (
                                                <p className="mt-1.5 text-sm text-red-600">{errors.endTime.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Location and Attendees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                label="Location"
                                placeholder="e.g., Golden Temple, Amritsar"
                                variant="admin"
                                leftIcon={<MapPin className="w-5 h-5 text-heritage-text/60" />}
                            />
                        )}
                    />

                    <Controller
                        name="attendees"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                label="Attendees"
                                placeholder="e.g., 150"
                                variant="admin"
                                leftIcon={<UsersIcon className="w-5 h-5 text-heritage-text/60" />}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                        )}
                    />
                </div>

                {/* Description */}
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-2 text-heritage-textDark">Description</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                rows={4}
                                placeholder="Add event details, agenda, or special notes..."
                                className="w-full px-4 py-3 rounded-lg border-2 border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20 hover:border-heritage-gold/50 transition-all duration-200 bg-white placeholder:text-heritage-text/50 text-heritage-textDark resize-none"
                            />
                        )}
                    />
                </div>

                {/* Image Upload */}
                <div className="w-full">
                    <label className="block text-sm font-semibold mb-2 text-heritage-textDark">Event Image</label>
                    {!imagePreview ? (
                        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-heritage-gold/40 rounded-xl cursor-pointer bg-heritage-highlight/10 hover:bg-heritage-highlight/20 hover:border-heritage-gold/60 transition-all duration-300 group">
                            <div className="flex flex-col items-center justify-center py-6">
                                <Upload className="w-10 h-10 text-heritage-text/60 group-hover:text-heritage-primary transition-colors mb-2" />
                                <p className="text-sm font-medium text-heritage-textDark group-hover:text-heritage-primary transition-colors">
                                    Click to upload image
                                </p>
                                <p className="text-xs text-heritage-text/60 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </label>
                    ) : (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-heritage-gold/40 group">
                            <img
                                src={imagePreview}
                                alt="Event preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleImageRemove}
                                className="absolute top-2 z-10 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-lg text-heritage-textDark font-medium hover:bg-white transition-colors">
                                    Change Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sticky bottom-0">
                    <Button
                        type="button"
                        variant="admin-outline"
                        onClick={onClose}
                        className="w-full sm:w-auto bg-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="admin"
                        className="w-full sm:w-auto"
                    >
                        {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EventModal;
