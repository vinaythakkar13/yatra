import React, { useState, useMemo } from 'react';
import { FileText, ChevronLeft, ChevronRight, CheckSquare, Square, X, Download } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { APIHotel } from '@/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import HotelReportPDF from './HotelReportPDF';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotels: APIHotel[];
}

type ModalStep = 'selection' | 'review';

const ITEMS_PER_PAGE = 10;

const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose, hotels }) => {
    const [currentStep, setCurrentStep] = useState<ModalStep>('selection');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHotelIds, setSelectedHotelIds] = useState<Set<string>>(new Set());
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

    // Filter logic
    const filteredHotels = useMemo(() => {
        if (paymentFilter === 'all') return hotels;
        return hotels.filter(h => paymentFilter === 'paid' ? h.full_payment_paid : !h.full_payment_paid);
    }, [hotels, paymentFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
    const currentHotels = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredHotels.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredHotels, currentPage]);

    const selectedHotelsList = useMemo(() => {
        return hotels.filter(h => selectedHotelIds.has(h.id));
    }, [hotels, selectedHotelIds]);

    // Selection logic
    const toggleHotel = (id: string) => {
        const newSelection = new Set(selectedHotelIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedHotelIds(newSelection);
    };

    const isAllOnPageSelected = currentHotels.length > 0 && currentHotels.every(h => selectedHotelIds.has(h.id));

    const toggleSelectAllOnPage = () => {
        const newSelection = new Set(selectedHotelIds);
        if (isAllOnPageSelected) {
            currentHotels.forEach(h => newSelection.delete(h.id));
        } else {
            currentHotels.forEach(h => newSelection.add(h.id));
        }
        setSelectedHotelIds(newSelection);
    };

    const calculateTotalAmount = (hotel: APIHotel) => {
        return hotel.rooms.reduce((sum, room) => sum + (parseFloat(room.charge_per_day) || 0), 0) * (hotel.number_of_days || 1);
    };

    const getRoomStats = (rooms: any[]) => {
        const stats: Record<string, { count: number; beds: number; price: number }> = {};

        rooms.forEach(room => {
            const beds = room.number_of_beds || room.numberOfBeds || 0;
            const price = parseFloat(room.charge_per_day || room.chargePerDay) || 0;
            const key = `${beds}-${price}`;

            if (stats[key]) {
                stats[key].count++;
            } else {
                stats[key] = { count: 1, beds, price };
            }
        });

        return Object.values(stats);
    };

    const resetAndClose = () => {
        setCurrentStep('selection');
        setCurrentPage(1);
        setSelectedHotelIds(new Set());
        onClose();
    };

    const handleNextStep = () => {
        if (selectedHotelIds.size > 0) {
            setCurrentStep('review');
        }
    };

    const handlePrevStep = () => {
        setCurrentStep('selection');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={resetAndClose}
            title={
                <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-heritage-primary" />
                    <span>Export Hotel Booking Report</span>
                </div>
            }
            size="xl"
            variant="admin"
            footer={
                <div className="flex justify-between w-full">
                    <Button variant="outline" onClick={resetAndClose}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        {currentStep === 'review' && (
                            <Button variant="outline" onClick={handlePrevStep}>
                                Back to Selection
                            </Button>
                        )}
                        {currentStep === 'selection' ? (
                            <Button
                                variant="admin"
                                onClick={handleNextStep}
                                disabled={selectedHotelIds.size === 0}
                                className="bg-heritage-primary hover:bg-heritage-secondary text-white"
                            >
                                Create PDF ({selectedHotelIds.size})
                            </Button>
                        ) : (
                            <PDFDownloadLink
                                document={<HotelReportPDF selectedHotels={selectedHotelsList} />}
                                fileName={`Hotel_Report_${new Date().toISOString().split('T')[0]}.pdf`}
                                onClick={() => {
                                    // Small delay to ensure download starts before closing
                                    setTimeout(() => {
                                        resetAndClose();
                                    }, 1000);
                                }}
                            >
                                {({ loading }) => (
                                    <Button
                                        variant="admin"
                                        disabled={loading}
                                        className="bg-heritage-primary hover:bg-heritage-secondary text-white"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        {loading ? 'Preparing PDF...' : 'Confirm and Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
            }
        >
            {currentStep === 'selection' ? (
                <div className="space-y-4">
                    <div className="bg-heritage-highlight/20 p-4 rounded-xl border border-heritage-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-heritage-textDark">Select hotels to include in the report</p>
                            <div className="flex items-center gap-3">
                                <p className="text-xs text-heritage-text/60">Selected: {selectedHotelIds.size} hotels</p>
                                <span className="text-heritage-gold/30">•</span>
                                <div className="flex items-center bg-white/50 border border-heritage-gold/20 rounded-lg p-1">
                                    <button
                                        onClick={() => { setPaymentFilter('all'); setCurrentPage(1); }}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${paymentFilter === 'all' ? 'bg-heritage-primary text-white shadow-sm' : 'text-heritage-text/60 hover:text-heritage-primary'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => { setPaymentFilter('paid'); setCurrentPage(1); }}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${paymentFilter === 'paid' ? 'bg-green-600 text-white shadow-sm' : 'text-heritage-text/60 hover:text-green-600'}`}
                                    >
                                        Paid
                                    </button>
                                    <button
                                        onClick={() => { setPaymentFilter('unpaid'); setCurrentPage(1); }}
                                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${paymentFilter === 'unpaid' ? 'bg-red-500 text-white shadow-sm' : 'text-heritage-text/60 hover:text-red-500'}`}
                                    >
                                        Not Paid
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={toggleSelectAllOnPage}
                            className="flex items-center gap-2 text-sm font-semibold text-heritage-primary hover:text-heritage-secondary transition-colors"
                        >
                            {isAllOnPageSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                            {isAllOnPageSelected ? 'Deselect All on Page' : 'Select All on Page'}
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-heritage-gold/20">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-heritage-highlight/30 text-heritage-textDark font-bold">
                                <tr>
                                    <th className="p-4 w-12"></th>
                                    <th className="p-4">Hotel Name</th>
                                    <th className="p-4">Address</th>
                                    <th className="p-4 text-center">Rooms</th>
                                    <th className="p-4 text-center">Payment</th>
                                    <th className="p-4 text-right">Advance Paid</th>
                                    <th className="p-4 text-right">Total Amount</th>
                                    <th className="p-4 text-right">Remaining</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-heritage-gold/10">
                                {currentHotels.map((hotel) => {
                                    const hotelTotal = calculateTotalAmount(hotel);
                                    const hotelAdvance = parseFloat(hotel.advance_paid_amount) || 0;
                                    const hotelRemaining = hotelTotal - hotelAdvance;
                                    const isSelected = selectedHotelIds.has(hotel.id);

                                    return (
                                        <tr
                                            key={hotel.id}
                                            className={`hover:bg-heritage-highlight/10 transition-colors cursor-pointer ${isSelected ? 'bg-heritage-highlight/5' : ''}`}
                                            onClick={() => toggleHotel(hotel.id)}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center justify-center">
                                                    {isSelected ? (
                                                        <CheckSquare className="w-5 h-5 text-heritage-primary" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-heritage-text/30" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold text-heritage-textDark">{hotel.name}</td>
                                            <td className="p-4 text-heritage-text/70 truncate max-w-[200px]">{hotel.address}</td>
                                            <td className="p-4 text-center">{hotel.total_rooms}</td>
                                            <td className="p-4 text-center">
                                                {hotel.full_payment_paid ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Paid</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">Unpaid</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">₹{hotelAdvance.toLocaleString()}</td>
                                            <td className="p-4 text-right">₹{hotelTotal.toLocaleString()}</td>
                                            <td className={`p-4 text-right font-medium ${hotelRemaining > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                ₹{hotelRemaining.toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-heritage-text/60">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredHotels.length)} of {filteredHotels.length} hotels
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="p-2 rounded-lg border border-heritage-gold/20 disabled:opacity-30 hover:bg-heritage-highlight/30 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-2 rounded-lg border border-heritage-gold/20 disabled:opacity-30 hover:bg-heritage-highlight/30 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-heritage-primary/5 border border-heritage-primary/20 rounded-xl p-4">
                        <h3 className="font-bold text-heritage-textDark mb-1">Review Selection</h3>
                        <p className="text-sm text-heritage-text/70">Please review the details below before generating the PDF report.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedHotelsList.map(hotel => {
                            const hotelTotal = calculateTotalAmount(hotel);
                            const hotelAdvance = parseFloat(hotel.advance_paid_amount) || 0;
                            const hotelRemaining = hotelTotal - hotelAdvance;

                            return (
                                <div key={hotel.id} className="border border-heritage-gold/20 rounded-xl p-4 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => toggleHotel(hotel.id)} className="text-red-500 hover:text-red-700">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-heritage-primary truncate pr-6">{hotel.name}</h4>
                                    <p className="text-xs text-heritage-text/60 mb-3">{hotel.address.slice(0, 50)}...</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-2 text-xs">
                                        <div>
                                            <p className="text-heritage-text/40">Rooms</p>
                                            <p className="font-semibold">{hotel.total_rooms}</p>
                                        </div>
                                        <div>
                                            <p className="text-heritage-text/40">Days</p>
                                            <p className="font-semibold">{hotel.number_of_days}</p>
                                        </div>
                                        <div>
                                            <p className="text-heritage-text/40">Advance</p>
                                            <p className="font-semibold text-green-600">₹{hotelAdvance.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-heritage-text/40">Total</p>
                                            <p className="font-semibold">₹{hotelTotal.toLocaleString()}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-heritage-text/40">Remaining</p>
                                            <p className={`font-semibold ${hotelRemaining > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                ₹{hotelRemaining.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Room Stats Review */}
                                    <div className="mt-3 bg-heritage-highlight/20 rounded-lg p-2 border border-heritage-gold/10">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-heritage-text/40 mb-1">Room Statistics</p>
                                        <div className="space-y-1">
                                            {getRoomStats(hotel.rooms).map((stat, idx) => (
                                                <p key={idx} className="text-[11px] text-heritage-textDark flex justify-between">
                                                    <span>• {stat.count} Rooms ({stat.beds} Beds)</span>
                                                    <span className="font-semibold">@ ₹{(stat.price).toLocaleString()}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-heritage-gold/10 flex items-center justify-between text-xs">
                                        <span className="text-heritage-text/60 font-medium">Manager: {hotel.manager_name}</span>
                                        <span className="text-heritage-text/40">{hotel.manager_contact}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedHotelsList.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-heritage-text/60">No hotels selected. Please go back and select at least one hotel.</p>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ExportReportModal;
