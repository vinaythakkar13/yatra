'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, YatraRegistration, Hotel, YatraEvent, Yatra, FloorConfig, RoomConfig, RoomAssignment } from '@/types';

interface AppContextType {
  // User State
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;

  // Registrations
  registrations: YatraRegistration[];
  addRegistration: (registration: YatraRegistration) => void;
  updateRegistration: (id: string, data: Partial<YatraRegistration>) => void;
  getRegistrationsByUser: (userId: string) => YatraRegistration[];
  approveDocument: (registrationId: string) => void;
  rejectDocument: (registrationId: string, reason: string) => void;

  // Hotels
  hotels: Hotel[];
  addHotel: (hotel: Hotel) => void;
  updateHotel: (id: string, data: Partial<Hotel>) => void;
  deleteHotel: (id: string) => void;
  assignRoom: (registrationId: string, roomNumber: string) => void;
  unassignRoom: (registrationId: string) => void;

  // Yatra Events
  yatraEvents: YatraEvent[];
  addYatraEvent: (event: YatraEvent) => void;
  getActiveYatra: () => YatraEvent | undefined;

  // Yatras
  yatras: Yatra[];
  addYatra: (yatra: Yatra) => void;
  updateYatra: (id: string, data: Partial<Yatra>) => void;
  deleteYatra: (id: string) => void;

  // PNR Validation
  validatePNR: (pnr: string) => YatraRegistration | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demonstration
const mockRegistrations: YatraRegistration[] = [
  {
    id: '1',
    pnr: '1234567890',
    name: 'Rajesh Kumar',
    contactNumber: '9876543210',
    numberOfPersons: 2,
    persons: [
      { name: 'Rajesh Kumar', age: 45, gender: 'male' },
      { name: 'Priya Kumar', age: 42, gender: 'female' }
    ],
    boardingPoint: { city: 'Delhi', state: 'Delhi' },
    arrivalDate: '2025-11-15',
    returnDate: '2025-11-20',
    ticketImages: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '101',
    roomAssignments: [
      { roomNumber: '101', floor: 1, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' }
    ],
    checkInDateTime: '2025-11-15T12:00:00+05:30',
    checkOutDateTime: '2025-11-20T11:00:00+05:30',
    createdAt: '2025-10-01T10:00:00Z'
  },
  {
    id: '2',
    pnr: '0987654321',
    name: 'Amit Sharma',
    contactNumber: '9123456789',
    numberOfPersons: 3,
    persons: [
      { name: 'Amit Sharma', age: 38, gender: 'male' },
      { name: 'Neha Sharma', age: 35, gender: 'female' },
      { name: 'Aarav Sharma', age: 10, gender: 'male' }
    ],
    boardingPoint: { city: 'Mumbai', state: 'Maharashtra' },
    arrivalDate: '2025-11-16',
    returnDate: '2025-11-21',
    ticketImages: ['https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800'],
    documentStatus: 'pending',
    roomStatus: 'Pending',
    createdAt: '2025-10-02T14:30:00Z'
  },
  {
    id: '3',
    pnr: '1122334455',
    name: 'Vijay Patel',
    contactNumber: '9988776655',
    numberOfPersons: 7,
    persons: [
      { name: 'Vijay Patel', age: 50, gender: 'male' },
      { name: 'Sunita Patel', age: 47, gender: 'female' },
      { name: 'Ravi Patel', age: 22, gender: 'male' },
      { name: 'Kavya Patel', age: 19, gender: 'female' },
      { name: 'Arjun Patel', age: 15, gender: 'male' },
      { name: 'Diya Patel', age: 12, gender: 'female' },
      { name: 'Harsh Patel', age: 8, gender: 'male' }
    ],
    boardingPoint: { city: 'Ahmedabad', state: 'Gujarat' },
    arrivalDate: '2025-11-18',
    returnDate: '2025-11-23',
    ticketImages: ['https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800'],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '102',
    roomAssignments: [
      { roomNumber: '102', floor: 1, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' },
      { roomNumber: 'G08', floor: 0, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' },
      { roomNumber: '401', floor: 4, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' }
    ],
    checkInDateTime: '2025-11-18T14:00:00+05:30',
    checkOutDateTime: '2025-11-23T10:00:00+05:30',
    createdAt: '2025-10-03T09:15:00Z'
  },
  {
    id: '4',
    pnr: '5566778899',
    name: 'Meera Singh',
    contactNumber: '9876501234',
    numberOfPersons: 6,
    persons: [
      { name: 'Meera Singh', age: 40, gender: 'female' },
      { name: 'Rakesh Singh', age: 42, gender: 'male' },
      { name: 'Ananya Singh', age: 18, gender: 'female' },
      { name: 'Karan Singh', age: 16, gender: 'male' },
      { name: 'Nisha Singh', age: 14, gender: 'female' },
      { name: 'Rohan Singh', age: 10, gender: 'male' }
    ],
    boardingPoint: { city: 'Jaipur', state: 'Rajasthan' },
    arrivalDate: '2025-11-20',
    returnDate: '2025-11-25',
    ticketImages: ['https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800'],
    documentStatus: 'rejected',
    rejectionReason: 'Blurry image',
    roomStatus: 'Assigned',
    roomNumber: 'G03',
    roomAssignments: [
      { roomNumber: 'G03', floor: 0, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' },
      { roomNumber: '103', floor: 1, hotelName: 'Yatra Niwas', hotelAddress: 'Haridwar', hotelMapLink: '', managerName: 'Ramesh', managerContact: '9876543210' }
    ],
    checkInDateTime: '2025-11-20T13:00:00+05:30',
    checkOutDateTime: '2025-11-25T10:30:00+05:30',
    createdAt: '2025-10-04T11:20:00Z'
  },
  // New Registrations
  {
    id: '5',
    pnr: '9988776611',
    name: 'Suresh Raina',
    contactNumber: '9876512345',
    numberOfPersons: 2,
    persons: [{ name: 'Suresh', age: 35, gender: 'male' }, { name: 'Priyanka', age: 32, gender: 'female' }],
    boardingPoint: { city: 'Chennai', state: 'Tamil Nadu' },
    arrivalDate: '2025-11-15',
    returnDate: '2025-11-20',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '201',
    roomAssignments: [{ roomNumber: '201', floor: 2, hotelName: 'Ganga Kinare', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Sanjay', managerContact: '9123456780' }],
    createdAt: '2025-10-05T10:00:00Z'
  },
  {
    id: '6',
    pnr: '9988776622',
    name: 'Rahul Dravid',
    contactNumber: '9876512346',
    numberOfPersons: 4,
    persons: [{ name: 'Rahul', age: 45, gender: 'male' }, { name: 'Vijeta', age: 42, gender: 'female' }, { name: 'Samit', age: 15, gender: 'male' }, { name: 'Anvay', age: 12, gender: 'male' }],
    boardingPoint: { city: 'Bangalore', state: 'Karnataka' },
    arrivalDate: '2025-11-16',
    returnDate: '2025-11-21',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '202',
    roomAssignments: [{ roomNumber: '202', floor: 2, hotelName: 'Ganga Kinare', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Sanjay', managerContact: '9123456780' }],
    createdAt: '2025-10-06T11:00:00Z'
  },
  {
    id: '7',
    pnr: '9988776633',
    name: 'Virat Kohli',
    contactNumber: '9876512347',
    numberOfPersons: 2,
    persons: [{ name: 'Virat', age: 34, gender: 'male' }, { name: 'Anushka', age: 34, gender: 'female' }],
    boardingPoint: { city: 'Delhi', state: 'Delhi' },
    arrivalDate: '2025-11-17',
    returnDate: '2025-11-22',
    ticketImages: [],
    documentStatus: 'pending',
    roomStatus: 'Pending',
    createdAt: '2025-10-07T12:00:00Z'
  },
  {
    id: '8',
    pnr: '9988776644',
    name: 'Rohit Sharma',
    contactNumber: '9876512348',
    numberOfPersons: 3,
    persons: [{ name: 'Rohit', age: 36, gender: 'male' }, { name: 'Ritika', age: 35, gender: 'female' }, { name: 'Samaira', age: 5, gender: 'female' }],
    boardingPoint: { city: 'Mumbai', state: 'Maharashtra' },
    arrivalDate: '2025-11-18',
    returnDate: '2025-11-23',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '301',
    roomAssignments: [{ roomNumber: '301', floor: 3, hotelName: 'Ganga Kinare', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Sanjay', managerContact: '9123456780' }],
    createdAt: '2025-10-08T13:00:00Z'
  },
  {
    id: '9',
    pnr: '9988776655',
    name: 'MS Dhoni',
    contactNumber: '9876512349',
    numberOfPersons: 3,
    persons: [{ name: 'MS', age: 42, gender: 'male' }, { name: 'Sakshi', age: 34, gender: 'female' }, { name: 'Ziva', age: 8, gender: 'female' }],
    boardingPoint: { city: 'Ranchi', state: 'Jharkhand' },
    arrivalDate: '2025-11-19',
    returnDate: '2025-11-24',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '302',
    roomAssignments: [{ roomNumber: '302', floor: 3, hotelName: 'Ganga Kinare', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Sanjay', managerContact: '9123456780' }],
    createdAt: '2025-10-09T14:00:00Z'
  },
  {
    id: '10',
    pnr: '9988776666',
    name: 'Hardik Pandya',
    contactNumber: '9876512350',
    numberOfPersons: 1,
    persons: [{ name: 'Hardik', age: 30, gender: 'male' }],
    boardingPoint: { city: 'Baroda', state: 'Gujarat' },
    arrivalDate: '2025-11-20',
    returnDate: '2025-11-25',
    ticketImages: [],
    documentStatus: 'pending',
    roomStatus: 'Pending',
    createdAt: '2025-10-10T15:00:00Z'
  },
  {
    id: '11',
    pnr: '9988776677',
    name: 'Ravindra Jadeja',
    contactNumber: '9876512351',
    numberOfPersons: 2,
    persons: [{ name: 'Ravindra', age: 34, gender: 'male' }, { name: 'Rivaba', age: 32, gender: 'female' }],
    boardingPoint: { city: 'Jamnagar', state: 'Gujarat' },
    arrivalDate: '2025-11-21',
    returnDate: '2025-11-26',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '101',
    roomAssignments: [{ roomNumber: '101', floor: 1, hotelName: 'Shanti Bhavan', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Alok', managerContact: '9123456790' }],
    createdAt: '2025-10-11T16:00:00Z'
  },
  {
    id: '12',
    pnr: '9988776688',
    name: 'Jasprit Bumrah',
    contactNumber: '9876512352',
    numberOfPersons: 2,
    persons: [{ name: 'Jasprit', age: 30, gender: 'male' }, { name: 'Sanjana', age: 32, gender: 'female' }],
    boardingPoint: { city: 'Ahmedabad', state: 'Gujarat' },
    arrivalDate: '2025-11-22',
    returnDate: '2025-11-27',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '102',
    roomAssignments: [{ roomNumber: '102', floor: 1, hotelName: 'Shanti Bhavan', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Alok', managerContact: '9123456790' }],
    createdAt: '2025-10-12T17:00:00Z'
  },
  {
    id: '13',
    pnr: '9988776699',
    name: 'KL Rahul',
    contactNumber: '9876512353',
    numberOfPersons: 2,
    persons: [{ name: 'KL', age: 31, gender: 'male' }, { name: 'Athiya', age: 30, gender: 'female' }],
    boardingPoint: { city: 'Bangalore', state: 'Karnataka' },
    arrivalDate: '2025-11-23',
    returnDate: '2025-11-28',
    ticketImages: [],
    documentStatus: 'pending',
    roomStatus: 'Pending',
    createdAt: '2025-10-13T18:00:00Z'
  },
  {
    id: '14',
    pnr: '9988776600',
    name: 'Shubman Gill',
    contactNumber: '9876512354',
    numberOfPersons: 1,
    persons: [{ name: 'Shubman', age: 24, gender: 'male' }],
    boardingPoint: { city: 'Chandigarh', state: 'Punjab' },
    arrivalDate: '2025-11-24',
    returnDate: '2025-11-29',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '201',
    roomAssignments: [{ roomNumber: '201', floor: 2, hotelName: 'Shanti Bhavan', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Alok', managerContact: '9123456790' }],
    createdAt: '2025-10-14T19:00:00Z'
  },
  {
    id: '15',
    pnr: '9988776612',
    name: 'Mohammed Shami',
    contactNumber: '9876512355',
    numberOfPersons: 1,
    persons: [{ name: 'Mohammed', age: 33, gender: 'male' }],
    boardingPoint: { city: 'Amroha', state: 'UP' },
    arrivalDate: '2025-11-25',
    returnDate: '2025-11-30',
    ticketImages: [],
    documentStatus: 'approved',
    roomStatus: 'Assigned',
    roomNumber: '202',
    roomAssignments: [{ roomNumber: '202', floor: 2, hotelName: 'Shanti Bhavan', hotelAddress: 'Rishikesh', hotelMapLink: '', managerName: 'Alok', managerContact: '9123456790' }],
    createdAt: '2025-10-15T20:00:00Z'
  }
];

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Yatra Niwas',
    address: '123 Pilgrimage Road, Haridwar, Uttarakhand 249401, India',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Haridwar+Hotels',
    hotelType: 'A',
    managerName: 'Ramesh Gupta',
    managerContact: '9876543210',
    numberOfDays: 7,
    startDate: '2025-11-15',
    endDate: '2025-11-22',
    checkInTime: '12:00',
    checkOutTime: '11:00',
    hasElevator: true,
    totalFloors: 3,
    floors: [
      {
        floorNumber: '1',
        numberOfRooms: 5,
        roomNumbers: ['101', '102', '103', '105', '108'],
        rooms: [
          { roomNumber: '101', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500 },
          { roomNumber: '102', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500 },
          { roomNumber: '103', toiletType: 'indian', numberOfBeds: 3, chargePerDay: 1200 },
          { roomNumber: '105', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500 },
          { roomNumber: '108', toiletType: 'western', numberOfBeds: 4, chargePerDay: 2000 }
        ]
      },
      {
        floorNumber: 'G',
        numberOfRooms: 3,
        roomNumbers: ['G03', 'G04', 'G08'],
        rooms: [
          { roomNumber: 'G03', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1800 },
          { roomNumber: 'G04', toiletType: 'indian', numberOfBeds: 2, chargePerDay: 1400 },
          { roomNumber: 'G08', toiletType: 'western', numberOfBeds: 3, chargePerDay: 2200 }
        ]
      },
      {
        floorNumber: '4',
        numberOfRooms: 3,
        roomNumbers: ['401', '402', '403'],
        rooms: [
          { roomNumber: '401', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1600 },
          { roomNumber: '402', toiletType: 'western', numberOfBeds: 2, chargePerDay: 1600 },
          { roomNumber: '403', toiletType: 'indian', numberOfBeds: 3, chargePerDay: 1300 }
        ]
      }
    ],
    rooms: [
      { id: 'r1', roomNumber: '101', floor: 1, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500, isOccupied: true, assignedTo: '1' },
      { id: 'r2', roomNumber: '102', floor: 1, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500, isOccupied: true, assignedTo: '3' },
      { id: 'r3', roomNumber: '103', floor: 1, toiletType: 'indian', numberOfBeds: 3, chargePerDay: 1200, isOccupied: true, assignedTo: '4' },
      { id: 'r4', roomNumber: '105', floor: 1, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1500, isOccupied: false },
      { id: 'r5', roomNumber: '108', floor: 1, toiletType: 'western', numberOfBeds: 4, chargePerDay: 2000, isOccupied: false },
      { id: 'r6', roomNumber: 'G03', floor: 0, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1800, isOccupied: true, assignedTo: '4' },
      { id: 'r7', roomNumber: 'G04', floor: 0, toiletType: 'indian', numberOfBeds: 2, chargePerDay: 1400, isOccupied: false },
      { id: 'r8', roomNumber: 'G08', floor: 0, toiletType: 'western', numberOfBeds: 3, chargePerDay: 2200, isOccupied: true, assignedTo: '3' },
      { id: 'r9', roomNumber: '401', floor: 4, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1600, isOccupied: true, assignedTo: '3' },
      { id: 'r10', roomNumber: '402', floor: 4, toiletType: 'western', numberOfBeds: 2, chargePerDay: 1600, isOccupied: false },
      { id: 'r11', roomNumber: '403', floor: 4, toiletType: 'indian', numberOfBeds: 3, chargePerDay: 1300, isOccupied: false },
    ]
  },
  {
    id: '2',
    name: 'Ganga Kinare',
    address: '16 Barrage Road, Rishikesh, Uttarakhand 249201',
    mapLink: 'https://www.google.com/maps',
    hotelType: 'A',
    managerName: 'Sanjay Mishra',
    managerContact: '9123456780',
    numberOfDays: 7,
    startDate: '2025-11-15',
    endDate: '2025-11-22',
    checkInTime: '13:00',
    checkOutTime: '11:00',
    hasElevator: true,
    totalFloors: 4,
    floors: [
      {
        floorNumber: '2',
        numberOfRooms: 4,
        roomNumbers: ['201', '202', '203', '204'],
        rooms: [
          { roomNumber: '201', toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500 },
          { roomNumber: '202', toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500 },
          { roomNumber: '203', toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500 },
          { roomNumber: '204', toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500 }
        ]
      },
      {
        floorNumber: '3',
        numberOfRooms: 4,
        roomNumbers: ['301', '302', '303', '304'],
        rooms: [
          { roomNumber: '301', toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000 },
          { roomNumber: '302', toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000 },
          { roomNumber: '303', toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000 },
          { roomNumber: '304', toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000 }
        ]
      }
    ],
    rooms: [
      { id: 'gk1', roomNumber: '201', floor: 2, toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500, isOccupied: true, assignedTo: '5' },
      { id: 'gk2', roomNumber: '202', floor: 2, toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500, isOccupied: true, assignedTo: '6' },
      { id: 'gk3', roomNumber: '203', floor: 2, toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500, isOccupied: false },
      { id: 'gk4', roomNumber: '204', floor: 2, toiletType: 'western', numberOfBeds: 2, chargePerDay: 2500, isOccupied: false },
      { id: 'gk5', roomNumber: '301', floor: 3, toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000, isOccupied: true, assignedTo: '8' },
      { id: 'gk6', roomNumber: '302', floor: 3, toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000, isOccupied: true, assignedTo: '9' },
      { id: 'gk7', roomNumber: '303', floor: 3, toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000, isOccupied: false },
      { id: 'gk8', roomNumber: '304', floor: 3, toiletType: 'western', numberOfBeds: 2, chargePerDay: 3000, isOccupied: false }
    ]
  },
  {
    id: '3',
    name: 'Shanti Bhavan',
    address: 'Near Ram Jhula, Rishikesh, Uttarakhand',
    mapLink: 'https://www.google.com/maps',
    hotelType: 'B',
    managerName: 'Alok Nath',
    managerContact: '9123456790',
    numberOfDays: 7,
    startDate: '2025-11-15',
    endDate: '2025-11-22',
    checkInTime: '12:00',
    checkOutTime: '10:00',
    hasElevator: false,
    totalFloors: 2,
    floors: [
      {
        floorNumber: '1',
        numberOfRooms: 4,
        roomNumbers: ['101', '102', '103', '104'],
        rooms: [
          { roomNumber: '101', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '102', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '103', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '104', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 }
        ]
      },
      {
        floorNumber: '2',
        numberOfRooms: 4,
        roomNumbers: ['201', '202', '203', '204'],
        rooms: [
          { roomNumber: '201', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '202', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '203', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 },
          { roomNumber: '204', toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800 }
        ]
      }
    ],
    rooms: [
      { id: 'sb1', roomNumber: '101', floor: 1, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: true, assignedTo: '11' },
      { id: 'sb2', roomNumber: '102', floor: 1, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: true, assignedTo: '12' },
      { id: 'sb3', roomNumber: '103', floor: 1, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: false },
      { id: 'sb4', roomNumber: '104', floor: 1, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: false },
      { id: 'sb5', roomNumber: '201', floor: 2, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: true, assignedTo: '14' },
      { id: 'sb6', roomNumber: '202', floor: 2, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: true, assignedTo: '15' },
      { id: 'sb7', roomNumber: '203', floor: 2, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: false },
      { id: 'sb8', roomNumber: '204', floor: 2, toiletType: 'indian', numberOfBeds: 4, chargePerDay: 800, isOccupied: false }
    ]
  }
];

const mockYatraEvents: YatraEvent[] = [
  {
    id: '1',
    name: 'Char Dham Yatra 2025',
    description: 'Annual pilgrimage to the four sacred sites',
    startDate: '2025-11-15',
    endDate: '2025-11-30',
    submissionDeadline: '2025-11-10',
    isActive: true
  },
  {
    id: '2',
    name: 'Vaishno Devi Yatra 2025',
    description: 'Sacred journey to Mata Vaishno Devi temple',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    submissionDeadline: '2025-11-25',
    isActive: false
  }
];

const mockYatras: Yatra[] = [
  {
    id: '1',
    title: 'Char Dham Yatra 2025',
    startDate: '2025-11-15',
    endDate: '2025-11-30',
    registrationDeadline: '2025-11-10',
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Vaishno Devi Yatra 2025',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    registrationDeadline: '2025-11-25',
    isActive: false,
    createdAt: '2025-10-02T14:30:00Z'
  },
  {
    id: '3',
    title: 'Kedarnath Yatra 2026',
    startDate: '2026-05-15',
    endDate: '2026-05-25',
    registrationDeadline: '2026-05-01',
    isActive: false,
    createdAt: '2025-10-05T09:00:00Z'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<YatraRegistration[]>(mockRegistrations);
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [yatraEvents, setYatraEvents] = useState<YatraEvent[]>(mockYatraEvents);
  const [yatras, setYatras] = useState<Yatra[]>(mockYatras);

  // Initialize with a guest user
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const isAdmin = currentUser?.isAdmin || false;

  const addRegistration = (registration: YatraRegistration) => {
    setRegistrations(prev => [...prev, registration]);
  };

  const updateRegistration = (id: string, data: Partial<YatraRegistration>) => {
    setRegistrations(prev =>
      prev.map(reg => (reg.id === id ? { ...reg, ...data } : reg))
    );
  };

  const getRegistrationsByUser = (userId: string) => {
    return registrations.filter(reg => reg.id === userId);
  };

  const approveDocument = (registrationId: string) => {
    updateRegistration(registrationId, {
      documentStatus: 'approved',
      rejectionReason: undefined
    });
  };

  const rejectDocument = (registrationId: string, reason: string) => {
    updateRegistration(registrationId, {
      documentStatus: 'rejected',
      rejectionReason: reason
    });
  };

  const addHotel = (hotel: Hotel) => {
    setHotels(prev => [...prev, hotel]);
  };

  const updateHotel = (id: string, data: Partial<Hotel>) => {
    setHotels(prev =>
      prev.map(hotel => (hotel.id === id ? { ...hotel, ...data } : hotel))
    );
  };

  const deleteHotel = (id: string) => {
    setHotels(prev => prev.filter(hotel => hotel.id !== id));
  };

  const assignRoom = (registrationId: string, roomNumber: string) => {
    // Get current registration to check for existing room assignment
    const currentRegistration = registrations.find(reg => reg.id === registrationId);
    const oldRoomNumber = currentRegistration?.roomNumber;

    // Update registration with new room
    updateRegistration(registrationId, {
      roomNumber,
      roomStatus: 'Assigned'
    });

    // Update hotel room occupancy
    setHotels(prev =>
      prev.map(hotel => ({
        ...hotel,
        rooms: hotel.rooms.map(room => {
          // Free up old room if reassigning
          if (oldRoomNumber && room.roomNumber === oldRoomNumber) {
            return { ...room, isOccupied: false, assignedTo: undefined };
          }
          // Assign new room
          if (room.roomNumber === roomNumber) {
            return { ...room, isOccupied: true, assignedTo: registrationId };
          }
          return room;
        })
      }))
    );
  };

  const unassignRoom = (registrationId: string) => {
    // Get current registration to find room to free
    const currentRegistration = registrations.find(reg => reg.id === registrationId);
    const roomToFree = currentRegistration?.roomNumber;

    // Update registration to remove room assignment
    updateRegistration(registrationId, {
      roomNumber: undefined,
      roomStatus: 'Pending'
    });

    // Free up the room in hotels
    if (roomToFree) {
      setHotels(prev =>
        prev.map(hotel => ({
          ...hotel,
          rooms: hotel.rooms.map(room =>
            room.roomNumber === roomToFree
              ? { ...room, isOccupied: false, assignedTo: undefined }
              : room
          )
        }))
      );
    }
  };

  const addYatraEvent = (event: YatraEvent) => {
    setYatraEvents(prev => [...prev, event]);
  };

  const getActiveYatra = () => {
    return yatraEvents.find(event => event.isActive);
  };

  const addYatra = (yatra: Yatra) => {
    setYatras(prev => [...prev, yatra]);
  };

  const updateYatra = (id: string, data: Partial<Yatra>) => {
    setYatras(prev =>
      prev.map(yatra => (yatra.id === id ? { ...yatra, ...data } : yatra))
    );
  };

  const deleteYatra = (id: string) => {
    setYatras(prev => prev.filter(yatra => yatra.id !== id));
  };

  const validatePNR = (pnr: string): YatraRegistration | null => {
    return registrations.find(reg => reg.pnr === pnr) || null;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAdmin,
        registrations,
        addRegistration,
        updateRegistration,
        getRegistrationsByUser,
        approveDocument,
        rejectDocument,
        hotels,
        addHotel,
        updateHotel,
        deleteHotel,
        assignRoom,
        unassignRoom,
        yatraEvents,
        addYatraEvent,
        getActiveYatra,
        yatras,
        addYatra,
        updateYatra,
        deleteYatra,
        validatePNR,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

