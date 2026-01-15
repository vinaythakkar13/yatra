import React, { useMemo } from 'react';
import { Control, Controller, UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { HotelFormData } from '../AddHotelModal';
import { useGetActiveYatrasQuery } from '@/services/yatraApi';

interface BasicInfoStepProps {
    control: Control<HotelFormData>;
    register: UseFormRegister<HotelFormData>;
    errors: FieldErrors<HotelFormData>;
    watch: UseFormWatch<HotelFormData>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ control, register, errors, watch }) => {
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
                <Controller
                    control={control}
                    name="yatraId"
                    rules={{ required: 'Yatra selection is required' }}
                    render={({ field }) => (
                        <SelectDropdown
                            label="Yatra"
                            options={yatraOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select a yatra"
                            loading={isLoadingYatras}
                            error={errors.yatraId?.message}
                            variant="admin"
                            className="h-12"
                            searchable={false}
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
            </div>

            {/* Has Elevator Checkbox */}
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
    );
};

export default BasicInfoStep;
