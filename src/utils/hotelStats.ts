export const getTotalRooms = (hotel: any) => hotel.rooms?.length ?? 0;

export const getOccupiedRooms = (hotel: any) =>
  hotel.rooms?.filter((room: any) => room.isOccupied).length ?? 0;

export const getAvailableRooms = (hotel: any) =>
  hotel.rooms?.filter((room: any) => !room.isOccupied).length ?? 0;

export const getTotalBeds = (hotel: any) =>
  hotel.rooms?.reduce((sum: number, room: any) => sum + (room.numberOfBeds || 0), 0) ?? 0;

export const getOccupiedBeds = (hotel: any) =>
  hotel.rooms
    ?.filter((room: any) => room.isOccupied)
    .reduce((sum: number, room: any) => sum + (room.numberOfBeds || 0), 0) ?? 0;

export const getAvailableBeds = (hotel: any) =>
  hotel.rooms
    ?.filter((room: any) => !room.isOccupied)
    .reduce((sum: number, room: any) => sum + (room.numberOfBeds || 0), 0) ?? 0;

export const getTotalRevenue = (hotel: any) => {
  const dailyRevenue =
    hotel.rooms?.reduce((sum: number, room: any) => sum + (room.chargePerDay || 0), 0) ?? 0;
  const numberOfDays = hotel.numberOfDays || 1;
  return dailyRevenue * numberOfDays;
};

