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



export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<YatraRegistration[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [yatraEvents, setYatraEvents] = useState<YatraEvent[]>([]);
  const [yatras, setYatras] = useState<Yatra[]>([]);

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

