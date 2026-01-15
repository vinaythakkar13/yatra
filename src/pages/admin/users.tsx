'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, Home, X, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DatePicker from '@/components/ui/DatePicker';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';

/**
 * User Management Page (Admin)
 * 
 * Features:
 * - Table listing all registered users
 * - Search and filter functionality with enhanced components
 * - View detailed user information
 * - Assign rooms to users
 * - Date filtering with react-datepicker
 * - Dropdown filters with react-dropdown-select
 * - Protected route with AdminLayout
 */
function UserManagement() {
  const { registrations, hotels, assignRoom } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterRoomStatus, setFilterRoomStatus] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');

  // Get unique cities for filter
  const cities = Array.from(new Set(registrations.map((r) => r.boardingPoint.city)));
  const cityOptions = [
    { value: '', label: 'All Cities' },
    ...cities.map((city) => ({ value: city, label: city })),
  ];

  const roomStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'Pending', label: 'Pending' },
  ];

  // Get available rooms
  const availableRooms = hotels.flatMap((hotel) =>
    hotel.rooms.filter((room) => !room.isOccupied)
  );

  const roomOptions = [
    { value: '', label: 'Choose a room' },
    ...availableRooms.map((room) => ({
      value: room.roomNumber,
      label: `Room ${room.roomNumber} (Floor ${room.floor})`,
    })),
  ];

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.pnr.includes(searchTerm) ||
      reg.contactNumber.includes(searchTerm);

    const matchesCity = !filterCity || reg.boardingPoint.city === filterCity;

    const matchesRoomStatus =
      !filterRoomStatus || reg.roomStatus === filterRoomStatus;

    const matchesDate = !filterDate || 
      new Date(reg.arrivalDate).toDateString() === filterDate.toDateString();

    return matchesSearch && matchesCity && matchesRoomStatus && matchesDate;
  });

  const handleViewDetails = (registration: any) => {
    setSelectedUser(registration);
    setShowDetailsModal(true);
  };

  const handleAssignRoom = (registration: any) => {
    setSelectedUser(registration);
    setShowAssignModal(true);
  };

  const handleConfirmAssignment = () => {
    if (selectedUser && selectedRoom) {
      assignRoom(selectedUser.id, selectedRoom);
      setShowAssignModal(false);
      setSelectedRoom('');
      toast.success(`✅ Room ${selectedRoom} assigned to ${selectedUser.name} successfully!`, {
        position: 'top-right',
      });
    }
  };

  const columns = [
    {
      key: 'pnr',
      header: 'PNR',
      render: (value: string) => (
        <span className="font-mono font-semibold text-primary-600">{value}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (value: string) => (
        <span className="font-semibold text-gray-800">{value}</span>
      ),
    },
    {
      key: 'contactNumber',
      header: 'Contact',
    },
    {
      key: 'numberOfPersons',
      header: 'Persons',
      render: (value: number) => (
        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
          {value}
        </span>
      ),
    },
    {
      key: 'boardingPoint',
      header: 'Boarding Point',
      render: (value: any) => `${value.city}, ${value.state}`,
    },
    {
      key: 'arrivalDate',
      header: 'Arrival',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'roomStatus',
      header: 'Room Status',
      render: (value: string, row: any) => (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              value === 'Assigned'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {value}
          </span>
          {row.roomNumber && (
            <span className="text-xs text-gray-600">Room: {row.roomNumber}</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.roomStatus !== 'Assigned' && (
            <button
              onClick={() => handleAssignRoom(row)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Assign Room"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const hasActiveFilters = searchTerm || filterCity || filterRoomStatus || filterDate;

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage registered users and assign accommodations
          </p>
        </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, PNR, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>

          <SelectDropdown
            options={cityOptions}
            value={filterCity}
            onChange={setFilterCity}
            placeholder="Filter by city"
            searchable
            clearable
          />

          <SelectDropdown
            options={roomStatusOptions}
            value={filterRoomStatus}
            onChange={setFilterRoomStatus}
            placeholder="Filter by status"
            searchable={false}
            clearable
          />
        </div>

        {/* Date Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <DatePicker
            label="Filter by Arrival Date"
            value={filterDate}
            onChange={setFilterDate}
            placeholder="Select date to filter"
            helperText="Show registrations arriving on this date"
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">
              Showing {filteredRegistrations.length} of {registrations.length} registrations
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterCity('');
                setFilterRoomStatus('');
                setFilterDate(null);
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Table
        columns={columns}
        data={filteredRegistrations}
        emptyMessage="No registrations found"
      />

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Registration Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PNR Number</p>
                  <p className="font-semibold text-gray-800">{selectedUser.pnr}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-800">{selectedUser.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number of Persons</p>
                  <p className="font-semibold text-gray-800">{selectedUser.numberOfPersons}</p>
                </div>
              </div>
            </div>

            {/* Travel Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Travel Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Boarding Point</p>
                  <p className="font-semibold text-gray-800">
                    {selectedUser.boardingPoint.city}, {selectedUser.boardingPoint.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room Status</p>
                  <p className="font-semibold text-gray-800">
                    {selectedUser.roomStatus}
                    {selectedUser.roomNumber && ` - Room ${selectedUser.roomNumber}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedUser.arrivalDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Return Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedUser.returnDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Traveler Details
              </h3>
              <div className="space-y-2">
                {selectedUser.persons.map((person: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{person.name}</p>
                      <p className="text-sm text-gray-600">
                        {person.age} years • {person.gender}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Room Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Room"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssignment} disabled={!selectedRoom}>
              Confirm Assignment
            </Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-6">

            {/* Room Selection */}
            <div className="bg-white">
              <SelectDropdown
                label="Select Available Room"
                options={roomOptions}
                value={selectedRoom}
                onChange={setSelectedRoom}
                placeholder="Choose a room"
                searchable
                required
                helperText={`${availableRooms.length} room(s) available`}
              />
            </div>

            {/* User Information Card */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-5 border border-primary-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                User Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">PNR Number</p>
                  <p className="font-mono font-semibold text-gray-900">{selectedUser.pnr}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{selectedUser.contactNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Persons</p>
                  <p className="font-semibold text-gray-900">{selectedUser.numberOfPersons} person(s)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Boarding Point</p>
                  <p className="font-semibold text-gray-900">
                    {selectedUser.boardingPoint.city}, {selectedUser.boardingPoint.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Travel Dates</p>
                  <p className="text-sm text-gray-900" suppressHydrationWarning>
                    {new Date(selectedUser.arrivalDate).toLocaleDateString()} - {new Date(selectedUser.returnDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {availableRooms.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ No available rooms. Please add more rooms in Hotel Management.
                </p>
              </div>
            )}

            {selectedRoom && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm font-medium">
                  ✓ Room {selectedRoom} will be assigned to {selectedUser.name}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
      </div>
    </AdminLayout>
  );
}

export default UserManagement;

