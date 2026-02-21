import React from 'react';
import { Building2, Home, BedDouble, FileTextIcon } from 'lucide-react';

interface HotelStatsProps {
    hotels: any[];
    activeBedFilter?: number | null;
    onBedFilterChange?: (beds: number | null) => void;
}

const HotelStats: React.FC<HotelStatsProps> = ({ hotels, activeBedFilter, onBedFilterChange }) => {
    // Helper function to get room field value (handles both camelCase and snake_case)
    const getRoomField = (room: any, camelCase: string, snakeCase: string) => {
        return room[camelCase] ?? room[snakeCase] ?? 0;
    };

    const numberOfHotels = hotels?.length ?? 0;
    const totalRooms = hotels?.reduce((sum, hotel) => sum + (hotel.rooms?.length ?? 0), 0) ?? 0;
    const occupiedRooms = hotels?.reduce(
        (sum, hotel) => sum + (hotel.rooms?.filter((room: any) => room.isOccupied || room.is_occupied).length ?? 0),
        0
    ) ?? 0;
    const availableRoomsCount = Math.max(totalRooms - occupiedRooms, 0);

    // Calculate total beds (handles both camelCase and snake_case)
    const totalBeds = hotels.reduce(
        (sum, hotel) =>
            sum + (hotel.rooms?.reduce((roomSum: number, room: any) => {
                const beds = getRoomField(room, 'numberOfBeds', 'number_of_beds');
                return roomSum + (beds || 0);
            }, 0) ?? 0),
        0
    );

    // Calculate available beds (only from non-occupied rooms)
    const availableBeds = hotels?.reduce(
        (sum, hotel) =>
            sum +
            (hotel.rooms?.reduce(
                (roomSum: number, room: any) => {
                    const isOccupied = room.isOccupied || room.is_occupied || false;
                    if (!isOccupied) {
                        const beds = getRoomField(room, 'numberOfBeds', 'number_of_beds');
                        return roomSum + (beds || 0);
                    }
                    return roomSum;
                },
                0
            ) ?? 0),
        0
    );
    const bedsAvailabilityPercent = totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;

    // Calculate total expense: Sum of charge_per_day from all rooms × number of days
    const getTotalExpense = (hotel: any) => {
        if (!hotel || !hotel.rooms || !Array.isArray(hotel.rooms) || hotel.rooms.length === 0) {
            return 0;
        }

        // Sum all charge_per_day values from rooms array
        const totalChargePerDay = hotel?.rooms?.reduce((sum: number, room: any) => {
            if (!room) return sum;
            // Handle both camelCase and snake_case
            const chargePerDay = room?.charge_per_day ?? room.chargePerDay ?? 0;
            // Convert to number and validate
            const chargeValue = Number(chargePerDay);
            return sum + (isNaN(chargeValue) ? 0 : chargeValue);
        }, 0);

        // Get number of days (handle both camelCase and snake_case)
        const numberOfDays = hotel.number_of_days ?? hotel.numberOfDays ?? 1;
        const daysValue = Number(numberOfDays);
        const validDays = isNaN(daysValue) || daysValue <= 0 ? 1 : daysValue;

        // Calculate total expense: sum of charge_per_day × number of days
        const total = totalChargePerDay * validDays;
        return isNaN(total) ? 0 : total;
    };

    const totalExpenseAllHotels = hotels?.reduce(
        (sum, hotel) => {
            const expense = getTotalExpense(hotel);
            return sum + (typeof expense === 'number' && !isNaN(expense) ? expense : 0);
        },
        0
    );

    const totalAdvancePaid = hotels?.reduce(
        (sum, hotel) => {
            // Handle both camelCase and snake_case
            const advancePaid = parseInt(hotel.advance_paid_amount) ?? 0;
            return sum + (typeof advancePaid === 'number' && !isNaN(advancePaid) ? advancePaid : 0);
        },
        0
    );


    // Calculate bed distribution
    const bedDistribution = hotels?.reduce((acc: Record<string, number>, hotel) => {
        hotel.rooms?.forEach((room: any) => {
            const beds = getRoomField(room, 'numberOfBeds', 'number_of_beds');
            if (beds > 0) {
                acc[beds] = (acc[beds] || 0) + 1;
            }
        });
        return acc;
    }, {});

    // Sort bed keys numerically
    const sortedBedKeys = Object.keys(bedDistribution).sort((a, b) => Number(a) - Number(b));

    const summaryCards = [
        {
            label: 'Hotels onboarded',
            value: numberOfHotels,
            subtitle: 'Active partner properties',
            icon: Building2,
            gradient: 'from-[#7C8CFB] via-[#9AA5FF] to-[#C0D0FF]',
        },
        {
            label: 'Total expense',
            value: `₹${(totalExpenseAllHotels || 0).toLocaleString('en-IN')}`,
            subtitle: `Across ${numberOfHotels} hotel${numberOfHotels !== 1 ? 's' : ''}`,
            icon: FileTextIcon,
            gradient: 'from-[#FF725E] via-[#FF9778] to-[#FFC3A3]',
        },
        {
            label: 'Total Advance Paid',
            value: `₹${(totalAdvancePaid || 0).toLocaleString('en-IN')}`,
            subtitle: `Paid to ${numberOfHotels} property partners`,
            icon: FileTextIcon,
            gradient: 'from-[#00B5E2] via-[#5FD3FF] to-[#AEEBFF]',
        },
    ];

    return (
        <div className="space-y-4 mb-6 md:mb-8 font-inter">
            {/* Main Summary Cards */}
            {/* Main Summary Cards - Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {summaryCards?.map((card) => (
                    <div
                        key={card.label}
                        className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-5 shadow-glass group hover:shadow-glass-lg transition-all duration-300"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                        <div className="relative z-10 flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-sm shrink-0`}>
                                <card.icon className="w-6 h-6" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <p className="text-xs font-semibold text-heritage-text/40 uppercase tracking-wider">{card.label}</p>
                                <h3 className="text-2xl font-black text-heritage-textDark mt-1 tracking-tight">{card.value}</h3>
                                <p className="text-xs text-heritage-text/50 mt-1 truncate">{card.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Stats Section - Row 2 (Full Width) */}
            <div className="w-full">
                {/* Bed Configuration Panel */}
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-6 shadow-glass">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-sm">
                                <BedDouble className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-heritage-textDark">Bed Configuration Distribution</h3>
                                <p className="text-xs text-heritage-text/50">Capacity breakdown across all properties</p>
                            </div>
                        </div>

                        <div className='inline-flex gap-4'>
                            {/* Total Rooms */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-300">
                                <span className="text-md font-semibold text-orange-600 uppercase tracking-wider">
                                    <b className="font-black">{totalRooms}</b> TOTAL ROOMS</span>
                            </div>

                            {/* Total Beds */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-300">
                                <span className="text-md font-semibold text-orange-600 uppercase tracking-wider">
                                    <b className="font-black">{totalBeds}</b> TOTAL BEDS</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {sortedBedKeys.length > 0 ? (
                            sortedBedKeys.map(beds => {
                                const bedNum = Number(beds);
                                const isActive = activeBedFilter === bedNum;

                                return (
                                    <div
                                        key={beds}
                                        onClick={() => onBedFilterChange?.(isActive ? null : bedNum)}
                                        className={`flex group flex-col p-4 cursor-pointer rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md border ${isActive
                                            ? 'bg-orange-600 border-orange-700 text-white'
                                            : 'bg-white/50 border-orange-300/60 hover:border-orange-600 hover:bg-orange-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-fit p-2 rounded-xl flex items-center justify-center gap-2 font-black text-lg transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                                                }`}>
                                                <BedDouble className="w-6 h-6" />
                                                <p className='inline'>{beds}</p>
                                            </div>
                                            <div className="text-right flex flex-col gap-2">
                                                <p className={`text-[10px] font-medium uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-slate-400'}`}>Rooms</p>
                                                <p className={`text-2xl font-black leading-none ${isActive ? 'text-white' : 'text-heritage-textDark group-hover:text-orange-600'}`}>
                                                    {bedDistribution[beds]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <p className="text-sm text-heritage-text/50 font-medium">No bed configuration data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelStats;
