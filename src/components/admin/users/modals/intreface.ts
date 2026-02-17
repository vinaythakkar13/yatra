export interface FloorRoom {
    chargePerDay: number;
    numberOfBeds: number;
    roomNumber: string;
    toiletType: 'western' | 'indian';
}


export interface HotelFloor {
    floorNumber: string;
    numberOfRooms: number;
    roomNumbers: string[];
    rooms: FloorRoom[];
}

export interface RoomEntry {
    id: string;
    room_number: string;
    floor: string;
    hotel_id: string;
    toilet_type: 'western' | 'indian';
    number_of_beds: number;
    charge_per_day: string;
    is_occupied: boolean;
    assigned_to_user_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Yatra {
    id: string;
    name: string;
    banner_image: string;
    mobile_banner_image: string;
    start_date: string;
    end_date: string;
    registration_start_date: string;
    registration_end_date: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}



export interface Hotel {
    id: string;
    name: string;
    address: string;
    map_link: string;
    distance_from_bhavan: string;
    yatra_id: string;
    hotel_type: string;
    manager_name: string;
    manager_contact: string;
    visiting_card_image: string;
    number_of_days: number;
    start_date: string;
    end_date: string;
    check_in_time: string;
    check_out_time: string;
    has_elevator: boolean;
    total_floors: number;

    floors: HotelFloor[];

    total_rooms: number;
    occupied_rooms: number;
    available_rooms: number;
    is_active: boolean;
    advance_paid_amount: string;
    full_payment_paid: boolean;
    created_at: string;
    updated_at: string;

    rooms: RoomEntry[];
    yatra: Yatra;
}

export interface Person {
    name: string;
    gender: 'male' | 'female';
    age: number;
    isHandicapped: boolean;
}

export interface BoardingPoint {
    city: string;
    state: string;
}

export interface Registration {
    id: string;
    name: string;
    pnr: string;
    numberOfPersons: number;
    persons: Person[];
    boardingPoint: BoardingPoint;
    arrivalDate: string;
    returnDate: string;
    hotel?: {
        id: string;
        name: string;
        address: string;
        managerName: string;
        managerContact: string;
        mapLink: string;
    };
    assignedRooms?: {
        id: string;
        room_number: string;
        floor: string;
    }[];
    registrationStatus?: string;
    isRoomAssigned?: boolean;
    roomAssignmentStatus?: string;
}

export type AccentColor =
    | 'blue'
    | 'rose'
    | 'green'
    | 'gray'
    | 'amber'
    | 'sky'
    | 'pink'
    | 'indigo'
    | 'fuchsia';

export interface DemographyCard {
    title: string;
    description: string;
    Icon: React.ElementType; // Changed from React.FC<React.SVGProps<SVGSVGElement>> to be more generic for Lucide icons
    accent: AccentColor;
    users: number;
}
