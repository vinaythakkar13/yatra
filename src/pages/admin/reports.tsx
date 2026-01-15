'use client';

import React from 'react';
import { toast } from 'react-toastify';
import {
  Download,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * Reports & Analytics Page (Admin)
 * 
 * Features:
 * - Overall statistics and KPIs
 * - Attendance tracking
 * - Accommodation reports
 * - Participation trends by city/state
 * - Export functionality
 * - Protected route with AdminLayout
 */
function Reports() {
  const { registrations, hotels, yatraEvents } = useApp();

  // Calculate statistics
  const totalRegistrations = registrations.length;
  const totalPersons = registrations.reduce(
    (sum, reg) => sum + reg.numberOfPersons,
    0
  );
  const assignedRooms = registrations.filter((r) => r.roomStatus === 'Assigned')
    .length;
  const pendingAssignments = registrations.filter((r) => r.roomStatus === 'Pending')
    .length;

  // Group by city
  const registrationsByCity = registrations.reduce((acc: any, reg) => {
    const city = reg.boardingPoint.city;
    if (!acc[city]) {
      acc[city] = { count: 0, persons: 0 };
    }
    acc[city].count += 1;
    acc[city].persons += reg.numberOfPersons;
    return acc;
  }, {});

  const cityStats = Object.entries(registrationsByCity)
    .map(([city, data]: [string, any]) => ({
      city,
      registrations: data.count,
      persons: data.persons,
    }))
    .sort((a, b) => b.registrations - a.registrations);

  // Group by date
  const registrationsByDate = registrations.reduce((acc: any, reg) => {
    const date = new Date(reg.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Hotel occupancy
  const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.rooms.length, 0);
  const occupiedRooms = hotels.reduce(
    (sum, hotel) => sum + hotel.rooms.filter((r) => r.isOccupied).length,
    0
  );
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  // Age demographics
  const ageGroups = {
    children: 0, // 0-12
    youth: 0, // 13-25
    adults: 0, // 26-60
    seniors: 0, // 60+
  };

  registrations.forEach((reg) => {
    reg.persons.forEach((person) => {
      if (person.age <= 12) ageGroups.children++;
      else if (person.age <= 25) ageGroups.youth++;
      else if (person.age <= 60) ageGroups.adults++;
      else ageGroups.seniors++;
    });
  });

  const handleExportReport = (reportType: string) => {
    // Simulate export functionality
    toast.info(`📥 Exporting ${reportType} report...`, {
      position: 'top-right',
      autoClose: 2000,
    });
    
    // Simulate successful export after delay
    setTimeout(() => {
      toast.success(`✅ ${reportType} report exported successfully!`, {
        position: 'top-right',
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights and statistics for Yatra management
            </p>
          </div>
        <Button onClick={() => handleExportReport('Complete')}>
          <Download className="w-5 h-5 mr-2" />
          Export All
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hoverable className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
              <p className="text-3xl font-bold text-gray-800">
                {totalRegistrations}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card hoverable className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Participants</p>
              <p className="text-3xl font-bold text-gray-800">{totalPersons}</p>
              <p className="text-xs text-gray-500 mt-1">All travelers</p>
            </div>
            <div className="bg-secondary-100 p-4 rounded-full">
              <Users className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card hoverable className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-800">
                {occupancyRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {occupiedRooms} of {totalRooms} rooms
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <PieChart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hoverable className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Assignments</p>
              <p className="text-3xl font-bold text-gray-800">
                {pendingAssignments}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* City-wise Distribution */}
      <Card title="Registrations by City" className="mb-8">
        <div className="space-y-4">
          {cityStats.slice(0, 10).map((stat, index) => (
            <div key={stat.city}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span className="font-semibold text-gray-800">{stat.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">
                    {stat.registrations} registrations • {stat.persons} persons
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(stat.registrations / totalRegistrations) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('City-wise')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export City Report
          </Button>
        </div>
      </Card>

      {/* Age Demographics */}
      <Card title="Age Demographics" className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Children (0-12)</p>
            <p className="text-3xl font-bold text-blue-600">{ageGroups.children}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPersons > 0
                ? ((ageGroups.children / totalPersons) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Youth (13-25)</p>
            <p className="text-3xl font-bold text-green-600">{ageGroups.youth}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPersons > 0
                ? ((ageGroups.youth / totalPersons) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Adults (26-60)</p>
            <p className="text-3xl font-bold text-purple-600">{ageGroups.adults}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPersons > 0
                ? ((ageGroups.adults / totalPersons) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Seniors (60+)</p>
            <p className="text-3xl font-bold text-orange-600">{ageGroups.seniors}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalPersons > 0
                ? ((ageGroups.seniors / totalPersons) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>
      </Card>

      {/* Room Status Overview */}
      <Card title="Accommodation Status">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Assignment Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Rooms Assigned</span>
                <span className="font-bold text-green-700">{assignedRooms}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Pending Assignments</span>
                <span className="font-bold text-yellow-700">
                  {pendingAssignments}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Room Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total Rooms</span>
                <span className="font-bold text-blue-700">{totalRooms}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Occupied Rooms</span>
                <span className="font-bold text-red-700">{occupiedRooms}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Available Rooms</span>
                <span className="font-bold text-green-700">
                  {totalRooms - occupiedRooms}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('Attendance')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Attendance Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('Accommodation')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Accommodation Report
          </Button>
        </div>
      </Card>

      {/* Upcoming Yatras */}
      {yatraEvents.length > 0 && (
        <Card title="Yatra Events" className="mt-8">
          <div className="space-y-3">
            {yatraEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.name}</h4>
                    <p className="text-sm text-gray-600" suppressHydrationWarning>
                      {new Date(event.startDate).toLocaleDateString()} -{' '}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    event.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {event.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
      </div>
    </AdminLayout>
  );
}

export default Reports;

