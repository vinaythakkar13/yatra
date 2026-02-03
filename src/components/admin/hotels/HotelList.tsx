import React from 'react';
import { Hotel as HotelIcon, Plus, Search, MapPin, Calendar, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import HotelCard from './HotelCard';

interface HotelListProps {
    hotels: any[];
    onAddHotel: () => void;
    onEditHotel: (hotel: any) => void;
    onDeleteHotel: (hotel: any) => void;
    isLoading?: boolean;
    searchQuery?: string;
    hasYatraSelected?: boolean;
}

const HotelList: React.FC<HotelListProps> = ({
    hotels,
    onAddHotel,
    onEditHotel,
    onDeleteHotel,
    isLoading = false,
    searchQuery = '',
    hasYatraSelected = false
}) => {
    // Loading state
    if (isLoading) {
        return (
            <Card className="text-center py-12 px-4 bg-white/60 backdrop-blur-xl border-white/40 shadow-glass">
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-heritage-highlight/30 rounded-full animate-spin border-t-heritage-primary"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-heritage-secondary/20"></div>
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-heritage-textDark mb-2">
                    Loading Hotels...
                </h3>
                <p className="text-base text-heritage-text/60">
                    Please wait while we fetch the hotel information
                </p>
            </Card>
        );
    }

    // No yatra selected state
    if (!hasYatraSelected) {
        return (
            <Card className="text-center py-16 px-6 bg-gradient-to-br from-heritage-highlight/20 to-heritage-highlight/10 border-2 border-heritage-gold/30 shadow-xl">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-2xl">
                            <Calendar className="w-16 h-16 text-heritage-primary" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-heritage-textDark mb-3">
                        Select a Yatra First
                    </h3>
                    <p className="text-heritage-text/70 leading-relaxed mb-6">
                        Please select a yatra from the header dropdown to view and manage hotels for that specific pilgrimage journey.
                    </p>
                    <div className="p-4 bg-blue-50/80 border border-blue-200/60 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-blue-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Use the yatra selector in the top navigation</span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // No hotels found for search
    if (searchQuery && hotels.length === 0) {
        return (
            <Card className="text-center py-16 px-6 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 border-2 border-orange-200/60 shadow-xl">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
                            <Search className="w-16 h-16 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-heritage-textDark mb-3">
                        No Hotels Found
                    </h3>
                    <p className="text-heritage-text/70 leading-relaxed mb-4">
                        We couldn't find any hotels matching <span className="font-semibold text-heritage-textDark">"{searchQuery}"</span>
                    </p>
                    <div className="space-y-3 text-sm text-heritage-text/60">
                        <p>Try searching for:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 bg-white/60 rounded-full border border-heritage-gold/30">Hotel name</span>
                            <span className="px-3 py-1 bg-white/60 rounded-full border border-heritage-gold/30">Address</span>
                            <span className="px-3 py-1 bg-white/60 rounded-full border border-heritage-gold/30">Manager name</span>
                            <span className="px-3 py-1 bg-white/60 rounded-full border border-heritage-gold/30">Hotel type</span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // No hotels in yatra
    if (hotels.length === 0) {
        return (
            <Card className="text-center py-16 px-6 bg-gradient-to-br from-heritage-highlight/20 to-heritage-highlight/10 border-2 border-heritage-gold/30 shadow-xl">
                <div className="max-w-lg mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="p-4 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-2xl">
                                <HotelIcon className="w-16 h-16 text-heritage-primary" />
                            </div>
                            <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-heritage-secondary to-heritage-primary rounded-full shadow-lg">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-heritage-textDark mb-3">
                        No Hotels Added Yet
                    </h3>
                    <p className="text-heritage-text/70 leading-relaxed mb-6">
                        Start building your accommodation network by adding the first hotel for this yatra.
                        You can manage rooms, pricing, and availability once hotels are added.
                    </p>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-heritage-gold/20">
                            <div className="flex justify-center mb-2">
                                <MapPin className="w-8 h-8 text-heritage-primary/70" />
                            </div>
                            <h4 className="font-semibold text-heritage-textDark text-sm mb-1">Location Management</h4>
                            <p className="text-xs text-heritage-text/60">Track hotel locations and distances</p>
                        </div>
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-heritage-gold/20">
                            <div className="flex justify-center mb-2">
                                <Users className="w-8 h-8 text-heritage-primary/70" />
                            </div>
                            <h4 className="font-semibold text-heritage-textDark text-sm mb-1">Room Allocation</h4>
                            <p className="text-xs text-heritage-text/60">Assign rooms to pilgrims</p>
                        </div>
                        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-heritage-gold/20">
                            <div className="flex justify-center mb-2">
                                <Calendar className="w-8 h-8 text-heritage-primary/70" />
                            </div>
                            <h4 className="font-semibold text-heritage-textDark text-sm mb-1">Schedule Management</h4>
                            <p className="text-xs text-heritage-text/60">Manage check-in/out times</p>
                        </div>
                    </div>

                    <Button
                        onClick={onAddHotel}
                        className="w-full sm:w-auto bg-gradient-to-r from-heritage-primary to-heritage-secondary hover:from-heritage-secondary hover:to-heritage-primary text-white shadow-lg shadow-heritage-primary/30 px-8 py-3"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Add Your First Hotel</span>
                    </Button>

                    <div className="mt-6 p-4 bg-green-50/80 border border-green-200/60 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-green-700">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Quick setup with step-by-step guidance</span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Hotels list
    return (
        <div className="space-y-3 font-inter">
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
