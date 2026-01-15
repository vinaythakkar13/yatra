import React from 'react';
import { Control, Controller, UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import Input from '@/components/ui/Input';
import NumberInput from '@/components/ui/NumberInput';
import SelectDropdown from '@/components/ui/SelectDropdown';
import { HotelFormData } from '../AddHotelModal';

interface ConfigurationStepProps {
    control: Control<HotelFormData>;
    register: UseFormRegister<HotelFormData>;
    errors: FieldErrors<HotelFormData>;
    watch: UseFormWatch<HotelFormData>;
    setValue: UseFormSetValue<HotelFormData>;
    floorFields: any[];
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
    control,
    register,
    errors,
    watch,
    setValue,
    floorFields
}) => {

    const handleNumberOfRoomsChange = (floorIndex: number, newCount: number) => {
        const currentFloors = watch('floors');
        const currentFloor = currentFloors[floorIndex];

        if (!currentFloor) return;

        const currentRoomNumbers = currentFloor.roomNumbers || [];
        const currentRooms = currentFloor.rooms || [];
        let updatedRoomNumbers = [...currentRoomNumbers];
        let updatedRooms = [...currentRooms];

        if (newCount > currentRoomNumbers.length) {
            for (let i = currentRoomNumbers.length; i < newCount; i++) {
                updatedRoomNumbers.push('');
                updatedRooms.push({
                    roomNumber: '',
                    toiletType: 'western',
                    numberOfBeds: 1,
                    chargePerDay: 0
                });
            }
        } else {
            updatedRoomNumbers = updatedRoomNumbers.slice(0, newCount);
            updatedRooms = updatedRooms.slice(0, newCount);
        }

        setValue(`floors.${floorIndex}.roomNumbers`, updatedRoomNumbers);
        setValue(`floors.${floorIndex}.rooms`, updatedRooms);
    };

    const validateRoomNumber = (value: string, floorIndex: number, roomIndex: number) => {
        const trimmedValue = value?.trim() || '';
        if (!trimmedValue) return 'Required';
        if (trimmedValue.length < 1) return 'Min 1 char';

        const currentFloor = watch('floors')?.[floorIndex];
        if (!currentFloor) return true;

        const isDuplicate = currentFloor.roomNumbers.some((num: string, idx: number) =>
            idx !== roomIndex && num?.trim().toLowerCase() === trimmedValue.toLowerCase()
        );

        if (isDuplicate) return 'Duplicate';

        return true;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6 p-4 bg-heritage-highlight/30 rounded-xl border border-heritage-gold/20">
                <div>
                    <h3 className="text-lg font-bold text-heritage-textDark mb-1">Floor Configuration</h3>
                    <p className="text-xs text-heritage-text/70">Configure floors and room details</p>
                </div>
                <div className="w-auto">
                    <Controller
                        control={control}
                        name="totalFloors"
                        rules={{ min: 1, max: 20 }}
                        render={({ field }) => (
                            <NumberInput
                                label="Total Floors"
                                value={field.value}
                                onChange={field.onChange}
                                min={1}
                                max={20}
                                variant="admin"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-heritage-primary/40 scrollbar-track-heritage-highlight/30 hover:scrollbar-thumb-heritage-primary/60">
                {floorFields.map((field, floorIndex) => (
                    <div key={field.id} className="relative z-[1] bg-white/60 backdrop-blur-sm p-5 rounded-glass border border-heritage-gold/20 shadow-glass-soft">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-24">
                                <Input
                                    label="Floor No."
                                    {...register(`floors.${floorIndex}.floorNumber` as const, { required: true })}
                                    placeholder="1, 2, G"
                                    variant="admin"
                                />
                            </div>
                            <div className="w-auto">
                                <Controller
                                    control={control}
                                    name={`floors.${floorIndex}.numberOfRooms` as const}
                                    render={({ field }) => (
                                        <NumberInput
                                            label="Rooms"
                                            value={field.value}
                                            onChange={(val) => {
                                                field.onChange(val);
                                                handleNumberOfRoomsChange(floorIndex, val);
                                            }}
                                            min={1}
                                            max={20}
                                            variant="admin"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Room Details Grid */}
                        <div className="grid grid-cols-1 gap-3 mt-4">
                            {watch(`floors.${floorIndex}.rooms` as const)?.map((_, roomIndex) => (
                                <div key={roomIndex} className="grid grid-cols-12 gap-3 items-start bg-heritage-highlight/20 p-4 rounded-xl border border-heritage-highlight/40 hover:bg-heritage-highlight/30 transition-colors">
                                    <div className="col-span-3">
                                        <Input
                                            label={roomIndex === 0 ? "Room No." : ""}
                                            {...register(`floors.${floorIndex}.roomNumbers.${roomIndex}` as const, {
                                                validate: (val) => validateRoomNumber(val, floorIndex, roomIndex)
                                            })}
                                            error={errors.floors?.[floorIndex]?.roomNumbers?.[roomIndex]?.message}
                                            placeholder="101"
                                            variant="admin"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Controller
                                            control={control}
                                            name={`floors.${floorIndex}.rooms.${roomIndex}.toiletType` as const}
                                            render={({ field }) => (
                                                <SelectDropdown
                                                    dropdownPosition='auto'
                                                    searchable={false}
                                                    label={roomIndex === 0 ? "Toilet" : ""}
                                                    options={[
                                                        { value: 'western', label: 'Western' },
                                                        { value: 'indian', label: 'Indian' },
                                                    ]}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    variant="admin"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Controller
                                            control={control}
                                            name={`floors.${floorIndex}.rooms.${roomIndex}.numberOfBeds` as const}
                                            rules={{ min: 1 }}
                                            render={({ field }) => (
                                                <NumberInput
                                                    label={roomIndex === 0 ? "Beds" : ""}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    min={1}
                                                    variant="admin"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Controller
                                            control={control}
                                            name={`floors.${floorIndex}.rooms.${roomIndex}.chargePerDay` as const}
                                            rules={{ min: 0 }}
                                            render={({ field }) => (
                                                <NumberInput
                                                    label={roomIndex === 0 ? "Charge/Day" : ""}
                                                    value={field.value}
                                                    showButtons={false}
                                                    onChange={field.onChange}
                                                    min={0}
                                                    prefix="₹"
                                                    max={100000}
                                                    inputClassName="text-right"
                                                    variant="admin"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConfigurationStep;
