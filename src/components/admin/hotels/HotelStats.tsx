import React from 'react';
import { Building2, Home, BedDouble, FileTextIcon } from 'lucide-react';

interface HotelStatsProps {
    hotels: any[];
}

const HotelStats: React.FC<HotelStatsProps> = ({ hotels }) => {
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

    const summaryCards = [
        {
            label: 'Hotels onboarded',
            value: numberOfHotels,
            subtitle: 'Active partner properties',
            icon: Building2,
            gradient: 'from-[#7C8CFB] via-[#9AA5FF] to-[#C0D0FF]',
        },
        {
            label: 'Total rooms',
            value: totalRooms,
            subtitle: `${occupiedRooms} occupied • ${availableRoomsCount} free`,
            icon: Home,
            gradient: 'from-[#00B5E2] via-[#5FD3FF] to-[#AEEBFF]',
        },
        {
            label: 'Beds ready',
            value: availableBeds,
            subtitle: `${availableBeds} available of ${totalBeds} total`,
            icon: BedDouble,
            gradient: 'from-[#FFB347] via-[#FFD56F] to-[#FFEAA7]',
        },
        {
            label: 'Total expense',
            value: `₹${(totalExpenseAllHotels || 0).toLocaleString('en-IN')}`,
            subtitle: `Across ${numberOfHotels} hotel${numberOfHotels !== 1 ? 's' : ''}`,
            icon: FileTextIcon,
            gradient: 'from-[#FF725E] via-[#FF9778] to-[#FFC3A3]',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 font-inter">
            {summaryCards?.map((card) => (
                <div
                    key={card.label}
                    className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-3 md:p-5 shadow-glass group hover:shadow-glass-lg transition-all duration-300"
                >
                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <div className={`p-2 md:p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-sm`}>
                                <card.icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs md:text-sm font-medium text-heritage-text/60 uppercase tracking-wide truncate">{card.label}</p>
                            <h3 className="text-xl md:text-2xl font-bold text-heritage-textDark mt-1">{card.value}</h3>
                            <p className="text-xs text-heritage-text/50 mt-1 truncate">{card.subtitle}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HotelStats;
