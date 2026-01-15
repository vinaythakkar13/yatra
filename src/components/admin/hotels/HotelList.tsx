import React from 'react';
import { Hotel as HotelIcon, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import HotelCard from './HotelCard';

interface HotelListProps {
    hotels: any[];
    onAddHotel: () => void;
    onEditHotel: (hotel: any) => void;
    onDeleteHotel: (hotel: any) => void;
}

const HotelList: React.FC<HotelListProps> = ({ hotels, onAddHotel, onEditHotel, onDeleteHotel }) => {
    if (hotels.length === 0) {
        return (
            <Card className="text-center py-8 md:py-12 px-4 bg-white/60 backdrop-blur-xl border-white/40 shadow-glass">
                <div className="flex justify-center mb-4">
                    <HotelIcon className="w-12 h-12 md:w-16 md:h-16 text-heritage-text/30" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-heritage-textDark mb-2">
                    No Hotels Added
                </h3>
                <p className="text-sm md:text-base text-heritage-text/60 mb-6 max-w-md mx-auto">
                    Add your first hotel to start managing accommodations
                </p>
                <Button
                    onClick={onAddHotel}
                    className="w-full sm:w-auto bg-heritage-primary hover:bg-heritage-secondary text-white"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    <span className="text-sm md:text-base">Add First Hotel</span>
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6 font-inter">
            {hotels.map((hotel) => (
                <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onEdit={onEditHotel}
                    onDelete={onDeleteHotel}
                />
            ))}
        </div>
    );
};

export default HotelList;
