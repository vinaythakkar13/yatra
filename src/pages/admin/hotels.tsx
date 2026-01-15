'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Hotel as HotelIcon, Trash2, Edit, MapPin, CheckCircle, Users, Info } from 'lucide-react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import NumberInput from '@/components/ui/NumberInput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Table from '@/components/ui/Table';

interface FloorData {
  floorNumber: string;
  numberOfRooms: number;
  roomNumbers: string[];
}

interface HotelFormData {
  name: string;
  address: string;
  mapLink?: string;
  totalFloors: number;
  floors: FloorData[];
}

/**
 * Hotel Management Page (Admin)
 * 
 * Features:
 * - Add new hotels
 * - Configure floors and rooms
 * - View all rooms and their occupancy status
 * - Manage room assignments
 * - Protected route with AdminLayout
 */
function HotelManagement() {
  const { hotels, addHotel, updateHotel, deleteHotel } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [hotelToDelete, setHotelToDelete] = useState<any>(null);

  // React Hook Form for Add Hotel
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      address: '',
      mapLink: '',
      totalFloors: 1,
      floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
    },
    mode: 'onChange'
  });

  const { fields: floorFields, replace: replaceFloors } = useFieldArray({
    control,
    name: 'floors'
  });

  // React Hook Form for Edit Hotel
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    watch: watchEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<HotelFormData>({
    defaultValues: {
      name: '',
      address: '',
      mapLink: '',
      totalFloors: 1,
      floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
    },
    mode: 'onChange'
  });

  const { fields: floorFieldsEdit, replace: replaceFloorsEdit } = useFieldArray({
    control: controlEdit,
    name: 'floors'
  });

  // Watch totalFloors to dynamically update floors array
  const totalFloors = watch('totalFloors');
  const totalFloorsEdit = watchEdit('totalFloors');
  const allFloorsData = watch('floors');
  const allFloorsDataEdit = watchEdit('floors');

  // Sync totalFloors with floors array length for Add Modal
  useEffect(() => {
    if (showAddModal && totalFloors) {
      const newFloors: FloorData[] = [];
      for (let i = 0; i < totalFloors; i++) {
        // Keep existing floor data if available
        const existingFloor = allFloorsData?.[i];
        newFloors.push(existingFloor || {
          floorNumber: (i + 1).toString(),
          numberOfRooms: 1,
          roomNumbers: ['']
        });
      }
      replaceFloors(newFloors);
    }
  }, [totalFloors, showAddModal]);

  // Sync totalFloors with floors array length for Edit Modal
  useEffect(() => {
    if (showEditModal && totalFloorsEdit) {
      const newFloors: FloorData[] = [];
      for (let i = 0; i < totalFloorsEdit; i++) {
        const existingFloor = allFloorsDataEdit?.[i];
        newFloors.push(existingFloor || {
          floorNumber: (i + 1).toString(),
          numberOfRooms: 1,
          roomNumbers: ['']
        });
      }
      replaceFloorsEdit(newFloors);
    }
  }, [totalFloorsEdit, showEditModal]);

  // Helper to check duplicate room numbers within a floor
  const checkDuplicateRoom = (floors: FloorData[], floorIndex: number, roomIndex: number, roomNumber: string): boolean => {
    if (!roomNumber.trim()) return false;
    
    const floor = floors[floorIndex];
    if (!floor) return false;
    
    const duplicates = floor.roomNumbers.filter((num, idx) => 
      idx !== roomIndex && num.trim().toLowerCase() === roomNumber.trim().toLowerCase()
    );
    
    return duplicates.length > 0;
  };

  // Helper to update room numbers when numberOfRooms changes
  const handleNumberOfRoomsChange = (floorIndex: number, newCount: number, isEdit: boolean = false) => {
    const currentFloors = isEdit ? watchEdit('floors') : watch('floors');
    const currentFloor = currentFloors[floorIndex];
    
    if (!currentFloor) return;
    
    const currentRoomNumbers = currentFloor.roomNumbers || [];
    let updatedRoomNumbers = [...currentRoomNumbers];
    
    if (newCount > currentRoomNumbers.length) {
      // Add empty room numbers
      for (let i = currentRoomNumbers.length; i < newCount; i++) {
        updatedRoomNumbers.push('');
      }
    } else {
      // Remove excess room numbers
      updatedRoomNumbers = updatedRoomNumbers.slice(0, newCount);
    }
    
    const fieldName = `floors.${floorIndex}.roomNumbers` as const;
    if (isEdit) {
      setValueEdit(fieldName, updatedRoomNumbers);
    } else {
      setValue(fieldName, updatedRoomNumbers);
    }
  };

  // Custom validation for duplicate floor numbers
  const validateUniqueFloorNumber = (value: string, formValues: HotelFormData, index: number) => {
    const floorNumbers = formValues.floors.map(f => f.floorNumber.trim().toLowerCase());
    const currentFloorNumber = value.trim().toLowerCase();
    const firstIndex = floorNumbers.indexOf(currentFloorNumber);
    
    if (firstIndex !== -1 && firstIndex !== index) {
      return 'Floor number must be unique';
    }
    return true;
  };

  // Custom validation for individual room number
  const validateRoomNumber = (value: string, floorIndex: number, roomIndex: number, isEdit: boolean = false) => {
    const trimmedValue = value?.trim() || '';
    
    // Check if empty
    if (!trimmedValue) {
      return 'Room number is required';
    }
    
    // Check minimum length
    if (trimmedValue.length < 1) {
      return 'Room number must have at least 1 character';
    }
    
    // Check for duplicates within the same floor
    const allFloors = isEdit ? watchEdit('floors') : watch('floors');
    const currentFloor = allFloors?.[floorIndex];
    
    if (!currentFloor) return true;
    
    const isDuplicate = currentFloor.roomNumbers.some((num: string, idx: number) => 
      idx !== roomIndex && num?.trim().toLowerCase() === trimmedValue.toLowerCase()
    );
    
    if (isDuplicate) {
      return 'Duplicate room number in this floor';
    }
    
    return true;
  };

  // Handle Add Hotel form submission
  const onSubmit = handleSubmit(
    (data: HotelFormData) => {
      const rooms: any[] = [];
      let roomId = Date.now();

      // Create rooms from floor configurations
      data.floors.forEach((floor) => {
        floor.roomNumbers.forEach((roomNumber) => {
          if (roomNumber.trim()) {
            rooms.push({
              id: `room-${roomId++}`,
              roomNumber: roomNumber.trim(),
              floor: floor.floorNumber,
              isOccupied: false,
            });
          }
        });
      });

      const newHotel: any = {
        id: Date.now().toString(),
        name: data.name,
        address: data.address,
        mapLink: data.mapLink || '',
        totalFloors: data.totalFloors,
        floors: data.floors.map(f => ({
          floorNumber: f.floorNumber,
          numberOfRooms: f.numberOfRooms,
          roomNumbers: f.roomNumbers.filter(r => r.trim() !== '')
        })),
        rooms,
      };

      addHotel(newHotel);
      
      // Show success toast
      toast.success(`🏨 ${data.name} has been added successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Reset form and close modal
      setShowAddModal(false);
      reset({
        name: '',
        address: '',
        mapLink: '',
        totalFloors: 1,
        floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
      });
    },
    (errors) => {
      // Handle validation errors
      console.log('Validation errors:', errors);
      toast.error('Please fix all validation errors before submitting', {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  );

  // Open edit modal and populate form
  const handleEditHotel = (hotel: any) => {
    setEditingHotel(hotel);
    
    // Load existing hotel data into edit form
    resetEdit({
      name: hotel.name || '',
      address: hotel.address || '',
      mapLink: hotel.mapLink || '',
      totalFloors: hotel.totalFloors || hotel.floors?.length || 1,
      floors: hotel.floors && Array.isArray(hotel.floors) 
        ? hotel.floors.map((f: any) => ({
            floorNumber: f.floorNumber.toString(),
            numberOfRooms: f.numberOfRooms,
            roomNumbers: [...f.roomNumbers]
          }))
        : [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
    });
    
    setShowEditModal(true);
  };

  // Handle Update Hotel form submission
  const handleUpdateHotel = handleSubmitEdit(
    (data: HotelFormData) => {
      if (!editingHotel) return;

      const rooms: any[] = [];
      let roomId = Date.now();

      // Create rooms from floor configurations
      data.floors.forEach((floor) => {
        floor.roomNumbers.forEach((roomNumber) => {
          if (roomNumber.trim()) {
            // Keep existing room if it exists, otherwise create new
            const existingRoom = editingHotel.rooms.find((r: any) => r.roomNumber === roomNumber.trim());
            rooms.push(existingRoom || {
              id: `room-${roomId++}`,
              roomNumber: roomNumber.trim(),
              floor: floor.floorNumber,
              isOccupied: false,
            });
          }
        });
      });

      const updatedHotel = {
        name: data.name,
        address: data.address,
        mapLink: data.mapLink || '',
        totalFloors: data.totalFloors,
        floors: data.floors.map(f => ({
          floorNumber: f.floorNumber,
          numberOfRooms: f.numberOfRooms,
          roomNumbers: f.roomNumbers.filter(r => r.trim() !== '')
        })),
        rooms,
      };

      updateHotel(editingHotel.id, updatedHotel);
      
      toast.success(`✏️ ${data.name} has been updated successfully!`, {
        position: 'top-right',
      });
      
      // Reset and close
      setShowEditModal(false);
      setEditingHotel(null);
      resetEdit({
        name: '',
        address: '',
        mapLink: '',
        totalFloors: 1,
        floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
      });
    },
    (errors) => {
      // Handle validation errors
      console.log('Validation errors:', errors);
      toast.error('Please fix all validation errors before updating', {
        position: 'top-center',
        autoClose: 4000,
      });
    }
  );

  const handleDeleteClick = (hotel: any) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!hotelToDelete) return;

    deleteHotel(hotelToDelete.id);
    
    toast.success(`🗑️ ${hotelToDelete.name} has been deleted permanently`, {
      position: 'top-right',
    });
    
    setShowDeleteModal(false);
    setHotelToDelete(null);
  };

  const getTotalRooms = (hotel: any) => hotel.rooms.length;
  const getOccupiedRooms = (hotel: any) =>
    hotel.rooms.filter((r: any) => r.isOccupied).length;
  const getAvailableRooms = (hotel: any) =>
    hotel.rooms.filter((r: any) => !r.isOccupied).length;

  const roomColumns = [
    {
      key: 'roomNumber',
      header: 'Room Number',
      render: (value: string) => (
        <span className="font-mono font-bold text-lg text-primary-600">
          {value}
        </span>
      ),
    },
    {
      key: 'floor',
      header: 'Floor',
      render: (value: number) => (
        <span className="text-gray-700">Floor {value}</span>
      ),
    },
    {
      key: 'isOccupied',
      header: 'Status',
      render: (value: boolean, row: any) => (
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              value
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {value ? 'Occupied' : 'Available'}
          </span>
          {row.assignedTo && (
            <p className="text-xs text-gray-600 mt-1">
              Assigned to registration ID: {row.assignedTo}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Hotel Management
            </h1>
            <p className="text-gray-600">
              Manage hotels, rooms, and accommodations
            </p>
          </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Hotels List */}
      {hotels.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            <HotelIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Hotels Added
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first hotel to start managing accommodations
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add First Hotel
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel, index) => (
            <Card 
              key={hotel.id} 
              className="animate-slide-up"
              hoverable
            >
              {/* Hotel Header with Icon */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-xl shadow-lg flex-shrink-0">
                    <HotelIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                      {hotel.name}
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">
                      {hotel.totalFloors || hotel.floors?.length || 0} floors • {getTotalRooms(hotel)} total rooms
                    </p>
                    
                    {/* Hotel Location */}
                    {hotel.address && (
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {hotel.address}
                        </span>
                      </div>
                    )}
                    
                    {/* Map Link */}
                    {hotel.mapLink && (
                      <a
                        href={hotel.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-all hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditHotel(hotel)}
                    className="whitespace-nowrap"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteClick(hotel)}
                    className="whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              
              {/* Hotel Configuration */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Floors</p>
                    <p className="text-2xl font-bold text-primary-600">{hotel.totalFloors || hotel.floors?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Floor Numbers</p>
                    <p className="text-sm font-bold text-secondary-600">
                      {hotel.floors && Array.isArray(hotel.floors) 
                        ? hotel.floors.map((f: any) => f.floorNumber.toString()).join(', ') 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Rooms</p>
                    <p className="text-2xl font-bold text-green-600">{getTotalRooms(hotel)}</p>
                  </div>
                </div>
              </div>

              {/* Room Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-primary-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Rooms</p>
                    <div className="bg-primary-600 p-1.5 rounded-lg">
                      <HotelIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary-700">
                    {getTotalRooms(hotel)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Across {hotel.totalFloors || hotel.floors?.length || 0} floors</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Available</p>
                    <div className="bg-green-600 p-1.5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    {getAvailableRooms(hotel)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Ready for guests</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Occupied</p>
                    <div className="bg-red-600 p-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-red-700">
                    {getOccupiedRooms(hotel)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Currently in use</p>
                </div>
              </div>
              
              {/* View Rooms Button */}
              <div className="mb-6">
                <Button
                  size="sm"
                  variant={selectedHotel === hotel.id ? "primary" : "outline"}
                  onClick={() => setSelectedHotel(hotel.id === selectedHotel ? null : hotel.id)}
                  className="w-full sm:w-auto"
                >
                  {selectedHotel === hotel.id ? 'Hide Room Details' : 'View All Rooms'}
                </Button>
              </div>

              {/* Rooms Table */}
              {selectedHotel === hotel.id && (
                <div className="animate-slide-down">
                  <h3 className="font-bold text-gray-800 mb-4">Room Details</h3>
                  <Table
                    columns={roomColumns}
                    data={hotel.rooms}
                    emptyMessage="No rooms available"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Hotel Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          reset({
            name: '',
            address: '',
            mapLink: '',
            totalFloors: 1,
            floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
          });
        }}
        title="Add New Hotel"
        size="xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                reset({
                  name: '',
                  address: '',
                  mapLink: '',
                  totalFloors: 1,
                  floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting}>
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Hotel'}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Basic Information - Compact Grid */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HotelIcon className="w-4 h-4 text-primary-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hotel Name"
                placeholder="e.g., Yatra Niwas"
                required
                error={errors.name?.message}
                {...register('name', {
                  required: 'Hotel name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
              />

              <Input
                label="Hotel Address"
                placeholder="Full address with pincode"
                required
                leftIcon={<MapPin className="w-4 h-4 text-gray-400" />}
                error={errors.address?.message}
                {...register('address', {
                  required: 'Hotel address is required',
                  minLength: { value: 10, message: 'Address must be at least 10 characters' }
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Google Maps Link"
                placeholder="https://maps.google.com/?q=..."
                helperText="Optional - for easy navigation"
                error={errors.mapLink?.message}
                {...register('mapLink', {
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)/i,
                    message: 'Please enter a valid Google Maps link'
                  }
                })}
              />

              <Controller
                name="totalFloors"
                control={control}
                rules={{
                  required: 'Total floors is required',
                  min: { value: 1, message: 'Must have at least 1 floor' },
                  max: { value: 100, message: 'Cannot exceed 100 floors' }
                }}
                render={({ field }) => (
                  <NumberInput
                    label="Total Floors"
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    max={100}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Floor Configuration - Compact Layout */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HotelIcon className="w-4 h-4 text-primary-600" />
              Floor & Room Configuration
            </h3>

            <div className="space-y-3">
              {floorFields.map((floor, floorIndex) => {
                const floorData = watch(`floors.${floorIndex}`);
                const floorError = errors.floors?.[floorIndex];
                
                return (
                  <div
                    key={floor.id}
                    className="bg-white rounded-lg p-3 border-l-4 border-primary-500 shadow-sm"
                  >
                    {/* Compact Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-primary-700">
                        Floor {floorIndex + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {floorData?.roomNumbers?.filter((r: string) => r.trim()).length || 0} room(s)
                      </span>
                    </div>

                    {/* Floor Config - Horizontal Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <Input
                        label="Floor #"
                        type="text"
                        placeholder="1, 3, G"
                        required
                        className="text-sm"
                        error={floorError?.floorNumber?.message}
                        {...register(`floors.${floorIndex}.floorNumber`, {
                          required: 'Floor number is required',
                          validate: (value) => validateUniqueFloorNumber(value, watch(), floorIndex)
                        })}
                      />

                      <Controller
                        name={`floors.${floorIndex}.numberOfRooms`}
                        control={control}
                        rules={{
                          required: 'Number of rooms is required',
                          min: { value: 1, message: 'At least 1 room required' }
                        }}
                        render={({ field }) => (
                          <NumberInput
                            label="Rooms"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              handleNumberOfRoomsChange(floorIndex, value, false);
                            }}
                            min={1}
                            required
                          />
                        )}
                      />

                      {/* Room Numbers - Inline Grid */}
                      <div className="col-span-2 md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Room Numbers <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-row flex-wrap gap-2">
                          {floorData?.roomNumbers?.map((roomNum: string, roomIndex: number) => {
                            const isDuplicate = checkDuplicateRoom(allFloorsData, floorIndex, roomIndex, roomNum);
                            const roomError = errors.floors?.[floorIndex]?.roomNumbers?.[roomIndex];
                            
                            return (
                              <div key={roomIndex} className="relative">
                                <Input
                                  placeholder={`${floorData.floorNumber || 'X'}0${roomIndex + 1}`}
                                  className={`w-20 text-center font-mono font-bold text-sm ${isDuplicate || roomError ? 'border-red-500' : ''}`}
                                  {...register(`floors.${floorIndex}.roomNumbers.${roomIndex}`, {
                                    required: 'Room number is required',
                                    validate: (value) => validateRoomNumber(value, floorIndex, roomIndex, false)
                                  })}
                                />
                                {isDuplicate && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                                    DUP
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Show error for any room number in this floor */}
                        {floorError?.roomNumbers && Object.keys(floorError.roomNumbers).length > 0 && (
                          <p className="mt-2 text-xs text-red-600 flex items-center animate-slide-down">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Please fill all room numbers with unique values
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Help */}
            <div className="mt-3 flex items-start gap-2 text-xs text-gray-600 bg-blue-50 rounded-lg p-2">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary-600" />
              <span>
                <strong>Tip:</strong> Floor # can be 1, 3, G, M • Room #s must be unique per floor • Non-sequential OK (101, 105, 108)
              </span>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Hotel Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingHotel(null);
          resetEdit({
            name: '',
            address: '',
            mapLink: '',
            totalFloors: 1,
            floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
          });
        }}
        title="Edit Hotel"
        size="xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingHotel(null);
                resetEdit({
                  name: '',
                  address: '',
                  mapLink: '',
                  totalFloors: 1,
                  floors: [{ floorNumber: '1', numberOfRooms: 1, roomNumbers: [''] }]
                });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateHotel} disabled={isSubmittingEdit}>
              <Edit className="w-4 h-4 mr-2" />
              {isSubmittingEdit ? 'Updating...' : 'Update Hotel'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpdateHotel} className="space-y-5">
          {/* Basic Information - Compact Grid */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HotelIcon className="w-4 h-4 text-primary-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hotel Name"
                placeholder="e.g., Yatra Niwas"
                required
                error={errorsEdit.name?.message}
                {...registerEdit('name', {
                  required: 'Hotel name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
              />

              <Input
                label="Hotel Address"
                placeholder="Full address with pincode"
                required
                leftIcon={<MapPin className="w-4 h-4 text-gray-400" />}
                error={errorsEdit.address?.message}
                {...registerEdit('address', {
                  required: 'Hotel address is required',
                  minLength: { value: 10, message: 'Address must be at least 10 characters' }
                })}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Google Maps Link"
                placeholder="https://maps.google.com/?q=..."
                helperText="Optional - for easy navigation"
                error={errorsEdit.mapLink?.message}
                {...registerEdit('mapLink', {
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)/i,
                    message: 'Please enter a valid Google Maps link'
                  }
                })}
              />

              <Controller
                name="totalFloors"
                control={controlEdit}
                rules={{
                  required: 'Total floors is required',
                  min: { value: 1, message: 'Must have at least 1 floor' },
                  max: { value: 100, message: 'Cannot exceed 100 floors' }
                }}
                render={({ field }) => (
                  <NumberInput
                    label="Total Floors"
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    max={100}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Floor Configuration - Same as Add Modal */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <HotelIcon className="w-4 h-4 text-primary-600" />
              Floor & Room Configuration
            </h3>

            <div className="space-y-3">
              {floorFieldsEdit.map((floor, floorIndex) => {
                const floorData = watchEdit(`floors.${floorIndex}`);
                const floorError = errorsEdit.floors?.[floorIndex];
                
                return (
                  <div
                    key={floor.id}
                    className="bg-white rounded-lg p-3 border-l-4 border-primary-500 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-primary-700">
                        Floor {floorIndex + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {floorData?.roomNumbers?.filter((r: string) => r.trim()).length || 0} room(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <Input
                        label="Floor #"
                        type="text"
                        placeholder="1, 3, G"
                        required
                        className="text-sm"
                        error={floorError?.floorNumber?.message}
                        {...registerEdit(`floors.${floorIndex}.floorNumber`, {
                          required: 'Floor number is required',
                          validate: (value) => validateUniqueFloorNumber(value, watchEdit(), floorIndex)
                        })}
                      />

                      <Controller
                        name={`floors.${floorIndex}.numberOfRooms`}
                        control={controlEdit}
                        rules={{
                          required: 'Number of rooms is required',
                          min: { value: 1, message: 'At least 1 room required' }
                        }}
                        render={({ field }) => (
                          <NumberInput
                            label="Rooms"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              handleNumberOfRoomsChange(floorIndex, value, true);
                            }}
                            min={1}
                            required
                          />
                        )}
                      />

                      <div className="col-span-2 md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Room Numbers <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-row flex-wrap gap-2">
                          {floorData?.roomNumbers?.map((roomNum: string, roomIndex: number) => {
                            const isDuplicate = checkDuplicateRoom(allFloorsDataEdit, floorIndex, roomIndex, roomNum);
                            const roomError = errorsEdit.floors?.[floorIndex]?.roomNumbers?.[roomIndex];
                            
                            return (
                              <div key={roomIndex} className="relative">
                                <Input
                                  placeholder={`${floorData.floorNumber || 'X'}0${roomIndex + 1}`}
                                  className={`w-20 text-center font-mono font-bold text-sm ${isDuplicate || roomError ? 'border-red-500' : ''}`}
                                  {...registerEdit(`floors.${floorIndex}.roomNumbers.${roomIndex}`, {
                                    required: 'Room number is required',
                                    validate: (value) => validateRoomNumber(value, floorIndex, roomIndex, true)
                                  })}
                                />
                                {isDuplicate && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                                    DUP
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Show error for any room number in this floor */}
                        {floorError?.roomNumbers && Object.keys(floorError.roomNumbers).length > 0 && (
                          <p className="mt-2 text-xs text-red-600 flex items-center animate-slide-down">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Please fill all room numbers with unique values
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-gray-600 bg-blue-50 rounded-lg p-2">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary-600" />
              <span>
                <strong>Tip:</strong> Floor # can be 1, 3, G, M • Room #s must be unique per floor • Non-sequential OK (101, 105, 108)
              </span>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setHotelToDelete(null);
        }}
        title={
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-red-700">Delete Hotel Permanently?</span>
          </div>
        }
        size="md"
      >
        {hotelToDelete && (
          <div className="space-y-4">
            {/* Warning Banner */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-500 p-2 rounded-full flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-1">This action cannot be undone</h4>
                  <p className="text-sm text-red-800">
                    Once deleted, this hotel and all its room data will be permanently removed from the system.
                  </p>
                </div>
              </div>
            </div>

            {/* Hotel Details */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">You are about to delete:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HotelIcon className="w-4 h-4 text-gray-600" />
                  <span className="font-bold text-gray-900">{hotelToDelete.name}</span>
                </div>
                {hotelToDelete.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{hotelToDelete.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                  <span>📊 {getTotalRooms(hotelToDelete)} rooms</span>
                  <span>•</span>
                  <span>🏢 {hotelToDelete.totalFloors || hotelToDelete.floors?.length || 0} floors</span>
                  {getOccupiedRooms(hotelToDelete) > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-red-600 font-semibold">⚠️ {getOccupiedRooms(hotelToDelete)} occupied</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Occupied Rooms Warning */}
            {getOccupiedRooms(hotelToDelete) > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This hotel has {getOccupiedRooms(hotelToDelete)} occupied room(s). Deleting will affect existing room assignments.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                To confirm deletion, please understand:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>All room data will be permanently erased</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Room assignments will be removed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>This action cannot be reversed or undone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>No backup or recovery option available</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setHotelToDelete(null);
                }}
                className="flex-1"
              >
                Cancel - Keep Hotel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Delete Permanently
              </Button>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </AdminLayout>
  );
}

export default HotelManagement;

