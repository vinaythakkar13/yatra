import React, { useEffect, useMemo, useState } from 'react';
import {
    Building2,
    Users,
    UserCheck,
    MapPin,
    User,
    AlertCircle,
    Hotel as HotelIcon,
    ChevronRight,
    Accessibility,
    Plane,
    X,
    SlidersHorizontal,
    ArrowUpDown,
    Users as Persons,
    Bed,
    BedIcon
} from 'lucide-react';
import { useGetAllHotelsQuery, useAssignRoomMutation, RoomAssignmentItem } from '@/services/hotelApi';
import { yatraStorage } from '@/utils/storage';
import { APIHotel as Hotel, APIHotelRoom as RoomEntry } from '@/types';
import { Registration, Person, DemographyCard } from './intreface';

interface AssignRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    isReassigning: boolean;
    selectedUser: Registration;
    selectedHotel: string;
    setSelectedHotel: (hotelId: string) => void;
    selectedRooms: string[];
    handleRoomToggle: (roomNumber: string) => void;
    totalPassengers: number;
    onConfirmAssignment: () => void;
}

const AssignRoomModal: React.FC<AssignRoomModalProps> = ({
    isOpen,
    onClose,
    isReassigning,
    selectedUser,
    selectedHotel,
    setSelectedHotel,
    selectedRooms,
    handleRoomToggle,
    totalPassengers,
    onConfirmAssignment,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedYatraId, setSelectedYatraId] = useState<string | undefined>(undefined);
    const [hasElevatorOnly, setHasElevatorOnly] = useState(false);
    const [radiusSort, setRadiusSort] = useState<'asc' | 'desc'>('asc');
    const [hotelType, setHotelType] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');

    const [assignRoom, { isLoading: isAssigning }] = useAssignRoomMutation();

    useEffect(() => {
        const updateYatraId = () => {
            const yatraId = yatraStorage.getSelectedYatraId();
            setSelectedYatraId(yatraId || undefined);
        };

        updateYatraId();
        window.addEventListener('storage', updateYatraId);
        const interval = setInterval(updateYatraId, 500);

        return () => {
            window.removeEventListener('storage', updateYatraId);
            clearInterval(interval);
        };
    }, []);

    const { data: hotels = [] } = useGetAllHotelsQuery(selectedYatraId);

    const filteredHotels = useMemo(() => {
        let result: Hotel[] = [...hotels];

        if (hasElevatorOnly) {
            result = result.filter((hotel: Hotel) => Boolean(hotel.has_elevator));
        }

        if (hotelType !== 'all') {
            result = result.filter((hotel: Hotel) => {
                const type = (hotel.hotel_type || '').toString().toUpperCase();
                return type === hotelType;
            });
        }

        result.sort((a: Hotel, b: Hotel) => {
            const aDistance = Number(a.distance_from_bhavan ?? 0);
            const bDistance = Number(b.distance_from_bhavan ?? 0);
            return radiusSort === 'asc' ? aDistance - bDistance : bDistance - aDistance;
        });

        return result;
    }, [hotels, hasElevatorOnly, hotelType, radiusSort]);

    const selectedHotelData: Hotel | undefined = useMemo(
        () => hotels.find((hotel: Hotel) => hotel.id === selectedHotel),
        [hotels, selectedHotel]
    );

    const allRoomsForHotel = useMemo(() => {
        if (!selectedHotelData?.rooms) return [];
        return selectedHotelData.rooms;
    }, [selectedHotelData]);

    const demographyCards: DemographyCard[] = [
        {
            title: 'Seniors (60+)',
            description: 'Priority handling for senior travelers.',
            accent: 'blue',
            Icon: Users,
            users: selectedUser?.persons?.filter((p: Person) => (p?.age >= 60 && p?.gender === 'male')).length || 0,
        },
        {
            title: 'Females (40+)',
            description: 'Standard safety protocol groups.',
            accent: 'rose',
            Icon: User,
            users: selectedUser?.persons?.filter((p: Person) => (p?.age >= 40 && p?.gender === 'female')).length || 0,
        },
        {
            title: 'Medical/Disability',
            description: 'Accessible room requirements.',
            accent: 'green',
            Icon: Accessibility,
            users: selectedUser?.persons?.filter((p: Person) => p?.isHandicapped).length || 0,
        },
        {
            title: 'Single Parents',
            description: 'Guardians with children under 5.',
            accent: 'amber',
            Icon: UserCheck,
            users: selectedUser?.persons?.filter((p: Person) => p?.age < 5).length || 0,
        },
        {
            title: 'Total Travelers',
            description: 'Overall group size for room allocation.',
            accent: 'gray',
            Icon: Persons,
            users: selectedUser ? selectedUser?.persons?.length : 0,
        }
    ];

    const roomsByFloor = allRoomsForHotel.reduce((acc: Record<string, RoomEntry[]>, room: RoomEntry) => {
        const floorKey = `${room.floor ?? 'G'}`;
        if (!acc[floorKey]) acc[floorKey] = [];
        acc[floorKey].push(room);
        return acc;
    }, {});

    const sortedFloors = Object.keys(roomsByFloor).sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        if (Number.isNaN(na) && Number.isNaN(nb)) return a.localeCompare(b);
        if (Number.isNaN(na)) return 1;
        if (Number.isNaN(nb)) return -1;
        return na - nb;
    });

    const handleNext = () => {
        if (currentStep === 1) setCurrentStep(2);
    };

    const handleBack = () => {
        if (currentStep === 2) setCurrentStep(1);
    };

    const handleClose = () => {
        setCurrentStep(1);
        onClose();
    };

    const handleConfirm = async () => {
        if (!selectedHotelData || selectedRooms.length === 0) return;

        try {
            const assignments: RoomAssignmentItem[] = selectedRooms.map(roomNum => {
                const room = allRoomsForHotel.find(r => r.room_number === roomNum);
                return {
                    hotelId: selectedHotelData.id,
                    floor: room?.floor?.toString() || '0',
                    roomNumber: roomNum
                };
            });

            const result = await assignRoom({
                registrationId: selectedUser.id,
                assignments
            }).unwrap();

            if (result.success) {
                onConfirmAssignment(); // Refresh parent data
                handleClose();
            }
        } catch (error) {
            console.error('Failed to assign rooms:', error);
            // Ideally show toast here
        }
    };

    if (!selectedUser) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center !my-0 ${isOpen ? '' : 'hidden'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-6xl h-[88vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isReassigning ? 'Reassign Room' : 'Assign Room'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center gap-4 px-6 py-5 border-b border-gray-100">
                    {/* Step 1 */}
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-all ${currentStep === 1
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                            } `}>
                            1
                        </div>
                        <span className={`text-sm font-medium ${currentStep === 1 ? 'text-orange-600' : 'text-gray-500'
                            } `}>
                            Registration Details
                        </span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-all ${currentStep === 2
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                            } `}>
                            2
                        </div>
                        <span className={`text-sm font-medium ${currentStep === 2 ? 'text-orange-600' : 'text-gray-500'
                            } `}>
                            Hotel Assignment
                        </span>
                    </div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Step 1: Registration Details */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            {/* Top Row: Entry Number, Primary Person, Total Persons */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-6">

                                    {/* Primary Person */}
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-1">
                                            <User className="w-3.5 h-3.5 text-orange-600" />
                                            Primary Person
                                        </div>
                                        <p className="text-base font-bold text-gray-900 uppercase">{selectedUser.name}</p>
                                        <p className="text-md font-regular text-gray-900">{selectedUser.pnr}</p>
                                    </div>

                                    {/* Total Persons */}
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                            Total Persons
                                        </div>
                                        <p className="text-3xl font-bold text-orange-600">{selectedUser.numberOfPersons}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Registered Persons */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-600" />
                                        <h3 className="text-sm font-semibold text-gray-900">Registered Persons</h3>
                                    </div>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700 uppercase tracking-wide">
                                        Traveller Details
                                    </button>
                                </div>

                                {/* 2-Column Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedUser.persons?.map((person: Person, index: number) => (
                                        <div
                                            key={index}
                                            className={`relative ${person.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'} rounded-lg p-3 border border-gray-200 ${person.isHandicapped ? 'border-orange-600' : ''
                                                } `}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Avatar */}
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${person.isHandicapped ? 'bg-orange-100' : person.gender === 'male' ? 'bg-blue-200' : 'bg-pink-100'
                                                    } `}>
                                                    {person.isHandicapped ? (
                                                        <Accessibility className="w-5 h-5 text-orange-600" />
                                                    ) : (
                                                        <User className={`w-5 h-5 ${person.gender === 'male' ? 'text-blue-600' : 'text-pink-600'}`} />
                                                    )}
                                                </div>

                                                {/* Person Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 uppercase truncate">
                                                        {person.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 capitalize mt-0.5">
                                                        {person.gender} • Age: {person.age}
                                                    </p>
                                                </div>

                                                {/* Special Needs Badge */}
                                                {person.isHandicapped && (
                                                    <div className="absolute top-2 right-2">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold uppercase tracking-wide rounded">
                                                            Special Needs
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Row: Boarding Point, Arrival, Return */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Boarding Point */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                                        Boarding Point
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 uppercase">
                                        {selectedUser.boardingPoint?.city}, {selectedUser.boardingPoint?.state}
                                    </p>
                                </div>

                                {/* Arrival Date */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        <Plane className="w-3.5 h-3.5 text-orange-600" />
                                        Arrival Date
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {selectedUser.arrivalDate}
                                    </p>
                                </div>

                                {/* Return Date */}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        <Plane className="w-3.5 h-3.5 text-orange-600 transform rotate-180" />
                                        Return Date
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {selectedUser.returnDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Hotel Assignment */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            {/* Demography */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {demographyCards.map(({ title, description, Icon, accent, users }) => {
                                    if (users === 0) return null;
                                    return (
                                        <div
                                            key={title}
                                            className={`rounded-xl border p-4 bg-white shadow-sm transition-all ${accent === 'blue'
                                                ? 'border-blue-200 hover:border-blue-400'
                                                : accent === 'rose'
                                                    ? 'border-rose-200 hover:border-rose-400'
                                                    : accent === 'green'
                                                        ? 'border-emerald-200 hover:border-emerald-400' :
                                                        accent === 'gray' ? 'border-gray-200 hover:border-gray-400' :
                                                            'border-amber-200 hover:border-amber-400'
                                                }`}
                                        >
                                            <div className='flex justify-start gap-4'>
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent === 'blue'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : accent === 'rose'
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : accent === 'green'
                                                            ? 'bg-emerald-50 text-emerald-600' :
                                                            accent === 'gray' ? 'bg-gray-50 text-gray-600'
                                                                : 'bg-amber-50 text-amber-600'
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className={`inline-flex items-center justify-center text-base font-semibold rounded-sm ${accent === 'blue' ? 'text-blue-800' : accent === 'rose' ? 'text-rose-800' : accent === 'green' ? ' text-emerald-800' : accent === 'gray' ? 'text-gray-700' : 'text-amber-800'}`}>
                                                    {accent === 'blue' ? 'Seniors' : accent === 'rose' ? 'Females' : accent === 'green' ? 'Medical/Disability' : accent === 'gray' ? 'Travellers' : 'Single Parents'}: {accent === 'blue' ? demographyCards[0].users : accent === 'rose' ? demographyCards[1].users : accent === 'green' ? demographyCards[2].users : accent === 'gray' ? demographyCards[4].users : demographyCards[3].users}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-gray-900">{title}</p>
                                            {/* <p className="text-xs text-gray-500 mt-1">{description}</p> */}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Hotel Listing + Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                {/* Left Panel */}
                                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                                            Filters
                                        </p>
                                        <span className="text-xs text-gray-400">{filteredHotels.length} hotels</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Elevator</span>
                                            <input type="checkbox" className="accent-orange-600" checked={hasElevatorOnly} onChange={(e) => setHasElevatorOnly(e.target.checked)} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setRadiusSort((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 hover:border-orange-300 transition-colors"
                                        >
                                            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-xs text-gray-600">Radius: {radiusSort === 'asc' ? 'Low to High' : 'High to Low'}</span>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        {([
                                            { label: 'All', value: 'all' },
                                            { label: 'Type A', value: 'A' },
                                            { label: 'Type B', value: 'B' },
                                            { label: 'Type C', value: 'C' },
                                            { label: 'Type D', value: 'D' },
                                        ] as const).map((option) => (
                                            <label
                                                key={option.value}
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-colors ${hotelType === option.value
                                                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-orange-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="hotelType"
                                                    value={option.value}
                                                    className="sr-only"
                                                    checked={hotelType === option.value}
                                                    onChange={() => setHotelType(option.value)}
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>

                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hotel Listing</p>
                                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
                                        {filteredHotels.map((hotel: Hotel) => {
                                            const isSelected = selectedHotel === hotel.id;
                                            const typeLabel = (hotel.hotel_type || '').toString().toUpperCase();
                                            const distance = hotel.distance_from_bhavan;
                                            return (
                                                <button
                                                    key={hotel.id}
                                                    onClick={() => setSelectedHotel(hotel.id)}
                                                    className={`w-full text-left border rounded-lg p-3 transition-all ${isSelected
                                                        ? 'border-orange-600 bg-orange-50'
                                                        : 'border-gray-200 bg-white hover:border-orange-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-base font-bold text-gray-900">{hotel.name}</p>
                                                            <p className="text-xs text-gray-700 mt-0.5">
                                                                {hotel.has_elevator ? 'Elevator' : 'No elevator'}
                                                                {typeLabel ? `${typeLabel}` : ''}
                                                                {distance !== undefined && distance !== null ? ` � ${distance} km` : ''}
                                                            </p>
                                                        </div>
                                                        <HotelIcon className={`w-4 h-4 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Panel */}
                                <div className="lg:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
                                    {!selectedHotel && (
                                        <div className="h-full flex items-center justify-center text-center text-sm text-slate-300">
                                            Select a hotel on the left to preview its layout.
                                        </div>
                                    )}

                                    {selectedHotel && (
                                        <>
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <p className="text-lg font-semibold">
                                                        {selectedHotelData?.name || 'Selected Hotel'}
                                                    </p>
                                                    <p className="text-xs text-slate-300 mt-0.5">{selectedHotelData?.address || 'No address available'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Rooms available</p>
                                                    <p className="text-lg font-bold">{allRoomsForHotel.filter(r => !r.is_occupied).length}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                                {selectedHotelData?.has_elevator && (
                                                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                                                        Elevator
                                                    </span>
                                                )}
                                                {(selectedHotelData?.hotel_type) && (
                                                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
                                                        Type {(selectedHotelData?.hotel_type).toString().toUpperCase()}
                                                    </span>
                                                )}
                                                {(selectedHotelData?.distance_from_bhavan) !== undefined && (
                                                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-wide rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
                                                        {(selectedHotelData?.distance_from_bhavan)} km to temple
                                                    </span>
                                                )}
                                            </div>

                                            {allRoomsForHotel.length === 0 ? (
                                                <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-orange-300 flex-shrink-0" />
                                                    <p className="text-sm text-orange-100 font-medium">No available rooms in this hotel.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sortedFloors.map((floor) => {
                                                        return (
                                                            <div key={floor} className="flex items-start gap-3">
                                                                <div className="text-xs font-semibold text-slate-300 w-12 pt-1">FLR {floor}</div>
                                                                <div className="grid grid-cols-6 gap-2 flex-1">
                                                                    {roomsByFloor[floor]
                                                                        .sort((a, b) => {
                                                                            const ra = Number(a.room_number);
                                                                            const rb = Number(b.room_number);
                                                                            if (!isNaN(ra) && !isNaN(rb)) return ra - rb;
                                                                            return a.room_number.localeCompare(b.room_number);
                                                                        })
                                                                        .map((room: RoomEntry) => {
                                                                            const isRoomSelected = selectedRooms.includes(room.room_number);
                                                                            const isOccupied = room.is_occupied;

                                                                            return (
                                                                                <button
                                                                                    key={room.room_number}
                                                                                    onClick={() => !isOccupied && handleRoomToggle(room.room_number)}
                                                                                    disabled={isOccupied}
                                                                                    className={`rounded-lg border px-2 py-2.5 flex flex-col items-center justify-center gap-1 transition-all shadow-sm ${isOccupied
                                                                                        ? 'bg-red-900/20 border-red-800/30 text-red-300/60 cursor-not-allowed'
                                                                                        : isRoomSelected
                                                                                            ? 'bg-yellow-600 border-yellow-500 text-white shadow-yellow-900/20'
                                                                                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-500 cursor-pointer'
                                                                                        }`}
                                                                                >
                                                                                    <div className="text-sm font-bold tracking-wide leading-none">{room.room_number}</div>
                                                                                    <div className={`flex items-center gap-1 text-[10px] uppercase font-semibold ${isOccupied ? 'text-red-400/50' : isRoomSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                                                                                        <BedIcon className="w-3 h-3" />
                                                                                        <span>{room?.number_of_beds || 0} Beds</span>
                                                                                    </div>
                                                                                </button>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>)
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    {currentStep === 1 && <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>}
                    {
                        currentStep === 2 && <button
                            onClick={handleBack}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Back
                        </button>
                    }
                    {currentStep === 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm shadow-orange-200 flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirm}
                            disabled={isAssigning || selectedRooms.length === 0}
                            className={`px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm shadow-orange-200 flex items-center gap-2 ${isAssigning || selectedRooms.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                            {!isAssigning && <UserCheck className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
};

export default AssignRoomModal;





























