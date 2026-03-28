// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email?: string;
  isAdmin: boolean;
}

export interface Person {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface RoomAssignment {
  roomNumber: string;
  floor: number;
  hotelName: string;
  hotelAddress?: string;
  hotelMapLink?: string;
  managerName?: string;
  managerContact?: string;
}

export interface YatraRegistration {
  id: string;
  pnr: string;
  name: string;
  contactNumber: string;
  numberOfPersons: number;
  persons: Person[];
  boardingPoint: {
    city: string;
    state: string;
  };
  arrivalDate: string;
  returnDate: string;
  ticketImage?: string; // Deprecated: kept for backward compatibility
  ticketImages?: string[]; // Array of ticket image names/URLs
  documentStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  roomStatus?: string;
  roomNumber?: string; // Deprecated: kept for backward compatibility
  roomAssignments?: RoomAssignment[]; // Multiple room assignments
  checkInDateTime?: string; // ISO datetime string
  checkOutDateTime?: string; // ISO datetime string
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  address?: string;
  mapLink?: string;
  hotelType: 'A' | 'B' | 'C' | 'D' | "TBS";
  managerName: string;
  managerContact: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  checkInTime: string;
  checkOutTime: string;
  hasElevator: boolean;
  strict_rule: boolean;
  totalFloors: number;
  floors: FloorConfig[];
  rooms: Room[];
}

export interface FloorConfig {
  floorNumber: string;
  numberOfRooms: number;
  roomNumbers: string[];
  rooms?: RoomConfig[];
}

export interface RoomConfig {
  roomNumber: string;
  toiletType: 'indian' | 'western';
  numberOfBeds: number;
  chargePerDay: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  toiletType?: 'indian' | 'western';
  numberOfBeds?: number;
  chargePerDay?: number;
  isOccupied: boolean;
  assignedTo?: string; // Registration ID
}

export interface YatraEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  isActive: boolean;
}

export interface Yatra {
  id: string;
  name: string;
  banner_image: string;
  mobile_banner_image?: string; // Optional mobile banner
  start_date: string;
  end_date: string;
  description?: string;
  registration_end_date: string;
  registration_start_date: string;
  createdAt: string;
}


// API Response Types (snake_case)

export interface APIFloorRoom {
  chargePerDay: number;
  numberOfBeds: number;
  roomNumber: string;
  toiletType: "western" | "indian";
}

export interface APIFloor {
  floorNumber: string;
  numberOfRooms: number;
  roomNumbers: string[];
  rooms: APIFloorRoom[];
}

export interface APIHotelRoom {
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

export interface APIHotel {
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
  floors: APIFloor[];
  rooms: APIHotelRoom[];
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  is_active: boolean;
  advance_paid_amount: string;
  full_payment_paid: boolean;
  adjustment_amount: string;
  adjustment_type: 'discount' | 'premium' | null;
  payment_comment: string | null;
  created_at: string;
  updated_at: string;
  yatra: Yatra; // Reusing Yatra interface if compatible, or define APIYatra
}
