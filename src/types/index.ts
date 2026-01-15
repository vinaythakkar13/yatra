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
  hotelType: 'A' | 'B' | 'C' | 'D';
  managerName: string;
  managerContact: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  checkInTime: string;
  checkOutTime: string;
  hasElevator: boolean;
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
  start_date: string;
  end_date: string;
  description?: string;
  registration_end_date: string;
  registration_start_date: string;
  createdAt: string;
}

