
import React, { useMemo } from 'react';
import { Control, Controller, UseFormRegister, FieldErrors, useForm, UseFormWatch } from 'react-hook-form';
import Input from '@/components/ui/Input';
import NumberInput from '@/components/ui/NumberInput';
import DatePicker from '@/components/ui/DatePicker';
import { HotelFormData } from '../AddHotelModal';
import { useGetActiveYatrasQuery } from '@/services/yatraApi';

interface ManagementStepProps {
    control: Control<HotelFormData>;
    register: UseFormRegister<HotelFormData>;
    errors: FieldErrors<HotelFormData>;
    watch: UseFormWatch<HotelFormData>
}

const ManagementStep: React.FC<ManagementStepProps> = ({ control, register, errors, watch }) => {
    const startDate = watch('startDate') || "";
    const yatraId = watch('yatraId');
    const { data: yatras = [] } = useGetActiveYatrasQuery();

    // Get selected yatra and its date range
    const selectedYatra = useMemo(() => {
        if (!yatraId) return null;
        return yatras.find(y => y.id === yatraId) || null;
    }, [yatraId, yatras]);

    // Calculate max days based on selected yatra's date range
    const maxDays = useMemo(() => {
        if (!selectedYatra || !selectedYatra.start_date || !selectedYatra.end_date) {
            return undefined;
        }

        const start = new Date(selectedYatra.start_date);
        const end = new Date(selectedYatra.end_date);
        
        // Calculate difference in days (inclusive of both start and end dates)
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both dates
        
        return diffDays > 0 ? diffDays : undefined;
    }, [selectedYatra]);

    // Get yatra date constraints
    const yatraStartDate = useMemo(() => {
        if (!selectedYatra?.start_date) return undefined;
        return new Date(selectedYatra.start_date);
    }, [selectedYatra]);

    const yatraEndDate = useMemo(() => {
        if (!selectedYatra?.end_date) return undefined;
        return new Date(selectedYatra.end_date);
    }, [selectedYatra]);

    // Start Date constraints: min = yatra start date (or today if later), max = yatra end date
    const startDateMin = useMemo(() => {
        if (!yatraStartDate) return new Date();
        const today = new Date();
        return yatraStartDate > today ? yatraStartDate : today;
    }, [yatraStartDate]);

    const startDateMax = yatraEndDate;

    // End Date constraints: min = selected start date (or yatra start date), max = yatra end date
    const endDateMin = useMemo(() => {
        if (startDate) {
            const selectedStart = new Date(startDate);
            if (yatraStartDate && selectedStart < yatraStartDate) {
                return yatraStartDate;
            }
            return selectedStart;
        }
        return yatraStartDate;
    }, [startDate, yatraStartDate]);

    const endDateMax = yatraEndDate;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Manager Name"
                    {...register('managerName', { required: 'Manager name is required' })}
                    error={errors.managerName?.message}
                    variant="admin"
                />
                <Controller
                    control={control}
                    name="managerContact"
                    rules={{ required: 'Contact number is required' }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Manager Contact"
                            prefix="+91"
                            error={errors.managerContact?.message}
                            variant="admin"
                            placeholder="Enter 10-digit mobile number"
                            type="tel"
                            maxLength={10}
                            onChange={(e) => {
                                // Only allow digits and limit to 10 digits
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                field.onChange(value);
                            }}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Controller
                    control={control}
                    name="numberOfDays"
                    rules={{ 
                        min: 1,
                        max: maxDays ? {
                            value: maxDays,
                            message: `Duration cannot exceed ${maxDays} days (Yatra duration)`
                        } : undefined
                    }}
                    render={({ field }) => (
                        <NumberInput
                            label="Duration (Days)"
                            value={field.value}
                            onChange={field.onChange}
                            min={1}
                            max={maxDays}
                            className="border-kesari-darker"
                            variant="admin"
                            helperText={maxDays ? `Maximum ${maxDays} days based on selected Yatra` : undefined}
                        />
                    )}
                />
                <Input
                    label="Check-in Time"
                    type="time"
                    {...register('checkInTime')}
                    variant="admin"
                />
                <Input
                    label="Check-out Time"
                    type="time"
                    {...register('checkOutTime')}
                    variant="admin"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Controller
                    control={control}
                    name="startDate"
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                        <DatePicker
                            label="Start Date"
                            minDate={startDateMin}
                            maxDate={startDateMax}
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.startDate?.message}
                            variant="admin"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="endDate"
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => (
                        <DatePicker
                            label="End Date"
                            minDate={endDateMin}
                            maxDate={endDateMax}
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                            error={errors.endDate?.message}
                            variant="admin"
                        />
                    )}
                />
            </div>
        </div>
    );
};

export default ManagementStep;
