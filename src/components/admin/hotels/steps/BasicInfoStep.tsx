import React, { useMemo } from 'react';
import { Control, Controller, UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ImageIcon, Info } from 'lucide-react';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import ImageUpload from '@/components/ui/ImageUpload';
import NumberInput from '@/components/ui/NumberInput';
import { HotelFormData } from '../AddHotelModal';
import { useGetActiveYatrasQuery } from '@/services/yatraApi';

interface BasicInfoStepProps {
    control: Control<HotelFormData>;
    register: UseFormRegister<HotelFormData>;
    errors: FieldErrors<HotelFormData>;
    watch: UseFormWatch<HotelFormData>;
    isEditMode?: boolean;
    existingVisitingCardUrl?: string;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ control, register, errors, watch, isEditMode = false, existingVisitingCardUrl }) => {
    const { data: yatras = [], isLoading: isLoadingYatras } = useGetActiveYatrasQuery();
    const hasElevator = watch('hasElevator');

    // Transform yatras to dropdown options with dates
    const yatraOptions = useMemo(() => {
        return yatras.map((yatra) => {
            // Format dates for display
            const formatDate = (dateString: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            };

            const startDate = formatDate(yatra.start_date);
            const endDate = formatDate(yatra.end_date);
            const dateRange = startDate && endDate ? `(${startDate} - ${endDate})` : '';

            return {
                value: yatra.id,
                label: `${yatra.name} ${dateRange}`,
            };
        });
    }, [yatras]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Hotel Name"
                    {...register('name', { required: 'Hotel name is required' })}
                    error={errors.name?.message}
                    placeholder="e.g. Grand Heritage"
                    variant="admin"
                />
                <Controller
                    control={control}
                    name="hotelType"
                    render={({ field }) => (
                        <SelectDropdown
                            label="Hotel Type"
                            options={[
                                { value: 'A', label: 'Type A (Premium)' },
                                { value: 'B', label: 'Type B (Standard)' },
                                { value: 'C', label: 'Type C (Budget)' },
                                { value: 'D', label: 'Type D (Dormitory)' },
                            ]}
                            value={field.value}
                            onChange={field.onChange}
                            variant="admin"
                        />
                    )}
                />

                <Input
                    label="Address"
                    {...register('address', { required: 'Address is required' })}
                    error={errors.address?.message}
                    placeholder="Full address"
                    className="md:col-span-2"
                    variant="admin"
                />
                <Input
                    label="Google Maps Link"
                    {...register('mapLink')}
                    placeholder="https://maps.google.com/..."
                    className="md:col-span-2"
                    variant="admin"
                />
                <Input
                    label="Distance from Bhavan"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('distanceFromBhavan', {
                        valueAsNumber: true,
                        validate: (value) => {
                            if (value !== undefined && value !== null) {
                                if (value < 0) return 'Distance cannot be negative';
                                if (isNaN(value)) return 'Please enter a valid number';
                            }
                            return true;
                        }
                    })}
                    error={errors.distanceFromBhavan?.message}
                    placeholder="e.g. 2.5"
                    helperText="Distance in kilometers (KM)"
                    variant="admin"
                />

                <div className="flex-1">
                    <Controller
                        control={control}
                        name="advance_paid_amount"
                        rules={{
                            validate: (value) => {
                                if (value !== undefined && value !== null) {
                                    if (value < 0) return 'Advance payment cannot be negative';
                                    if (isNaN(value)) return 'Please enter a valid amount';
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <NumberInput
                                label="Advance Payment"
                                value={field.value || 0}
                                onChange={(value) => {
                                    // Handle paste validation - only allow numbers
                                    const numericValue = Number(value);
                                    if (!isNaN(numericValue) && numericValue >= 0) {
                                        field.onChange(numericValue);
                                    }
                                }}
                                min={0}
                                max={999999999}
                                step={1}
                                prefix="₹"
                                variant="admin"
                                showButtons={false}
                                helperText="Enter advance payment amount in Indian Rupees"
                                error={errors.advance_paid_amount?.message}
                                inputClassName="text-left pl-8"
                            />
                        )}
                    />
                </div>
            </div>

            {/* Has Elevator Checkbox */}
            <div className="flex-1">
                <div className="mt-2 p-4 rounded-xl bg-heritage-highlight/20 border border-heritage-gold/20">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                {...register('hasElevator')}
                                className="peer sr-only"
                            />
                            <div className="w-6 h-6 rounded-md border-2 border-heritage-primary/40 bg-white transition-all duration-200 peer-checked:bg-gradient-to-br peer-checked:from-heritage-primary peer-checked:to-heritage-secondary peer-checked:border-heritage-primary group-hover:border-heritage-primary/60 peer-focus:ring-2 peer-focus:ring-heritage-primary/30 peer-focus:ring-offset-2">
                                <svg
                                    className={`w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-all duration-200  ${hasElevator ? 'opacity-100 scale-100' : 'scale-0 opacity-0'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-heritage-textDark group-hover:text-heritage-primary transition-colors">
                                Has Elevator
                            </span>
                            <p className="text-xs text-heritage-text/60">Check if the hotel has elevator facilities</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Visiting Card Image Upload */}
            <div className="w-full">
                {/* Show existing visiting card if in edit mode */}
                {isEditMode && existingVisitingCardUrl && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-heritage-highlight/20 to-heritage-highlight/10 border-2 border-heritage-gold/30 rounded-xl shadow-lg shadow-heritage-gold/10 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-heritage-primary" />
                            </div>
                            <h4 className="text-base font-bold text-heritage-textDark">Current Visiting Card</h4>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Image Preview */}
                            <div className="relative group cursor-pointer" onClick={() => window.open(existingVisitingCardUrl, '_blank')}>
                                <div className="relative overflow-hidden rounded-lg border-2 border-heritage-gold/40 shadow-md hover:shadow-lg transition-all duration-300">
                                    <img
                                        src={existingVisitingCardUrl}
                                        alt="Current visiting card"
                                        className="w-32 h-20 sm:w-40 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            const fallback = img.parentElement?.querySelector('.fallback-content') as HTMLElement;
                                            img.style.display = 'none';
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback for broken images */}
                                    <div className="fallback-content absolute inset-0 hidden items-center justify-center bg-heritage-highlight/30 text-heritage-text/60" style={{ display: 'none' }}>
                                        <div className="text-center">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                            <p className="text-xs">Image not available</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <p className="text-xs font-medium text-heritage-textDark">Click to view</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <Controller
                    control={control}
                    name="visitingCardImage"
                    render={({ field }) => (
                        <ImageUpload
                            onlyUploadContainer
                            label={isEditMode ? "Upload New Visiting Card (Optional)" : "Visiting Card"}
                            value={field.value || []}
                            onChange={field.onChange}
                            maxFiles={1}
                            helperText={isEditMode
                                ? "Upload a new visiting card to replace the existing one"
                                : "Upload hotel visiting card or business card"
                            }
                        />
                    )}
                />
            </div>

        </div>
    );
};

export default BasicInfoStep;
