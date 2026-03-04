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

export interface FloorRoom {
    chargePerDay: number;
    numberOfBeds: number;
    roomNumber: string;
    toiletType: "western" | "indian";
}

export interface Floor {
    floorNumber: string;
    numberOfRooms: number;
    roomNumbers: string[];
    rooms: FloorRoom[];
}

export interface HotelRoom {
    id: string;
    room_number: string;
    floor: string;
    hotel_id: string;
    toilet_type: "western" | "indian";
    number_of_beds: number;
    charge_per_day: string;
    is_occupied: boolean;
    assigned_to_user_id: string | null;
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
    strict_rule: boolean;
    total_floors: number;

    floors: Floor[];

    total_rooms: number;
    occupied_rooms: number;
    available_rooms: number;
    is_active: boolean;
    advance_paid_amount: string;
    full_payment_paid: boolean;
    created_at: string;
    updated_at: string;

    rooms: HotelRoom[];

    yatra: Yatra;
}
