'use client';
import React from 'react';
import Link from 'next/link';
import { Users, Hotel, BarChart3, ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/ui/Card';
import AdminLayout from '@/components/layout/AdminLayout';

function AdminDashboard() {
  const { registrations, hotels } = useApp();

  const totalRegistrations = registrations.length;
  const assignedRooms = registrations.filter((r) => r.roomStatus === 'Assigned').length;
  const pendingRooms = registrations.filter((r) => r.roomStatus === 'Pending').length;
  const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.rooms.length, 0);
  const occupiedRooms = hotels.reduce(
    (sum, hotel) => sum + hotel.rooms.filter((r) => r.isOccupied).length,
    0
  );

  const stats = [
    {
      title: 'Total Registrations',
      value: totalRegistrations,
      icon: Users,
      color: 'bg-primary-100 text-primary-600',
      bgGradient: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Assigned Rooms',
      value: assignedRooms,
      icon: Hotel,
      color: 'bg-green-100 text-green-600',
      bgGradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Pending Assignments',
      value: pendingRooms,
      icon: Users,
      color: 'bg-yellow-100 text-yellow-600',
      bgGradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Available Rooms',
      value: totalRooms - occupiedRooms,
      icon: Hotel,
      color: 'bg-secondary-100 text-secondary-600',
      bgGradient: 'from-secondary-500 to-secondary-600',
    },
  ];

  const modules = [
    {
      title: 'User Management',
      description: 'View and manage registered users, assign rooms, and update details',
      icon: Users,
      href: '/admin/users',
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Hotel Management',
      description: 'Add hotels, manage rooms, and view accommodation details',
      icon: Hotel,
      href: '/admin/hotels',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate reports, view attendance, and analyze Yatra trends',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'from-accent-500 to-accent-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage Yatra registrations, accommodations, and view reports
          </p>
        </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hoverable className="animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <Link key={index} href={module.href}>
              <Card hoverable className="h-full group cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className={`bg-gradient-to-r ${module.color} p-4 rounded-lg mb-4 inline-flex items-center justify-center w-fit`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1">
                    {module.description}
                  </p>
                  <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                    <span>View Details</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card title="Recent Registrations">
          {registrations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No registrations yet
            </p>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 5).map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {registration.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {registration.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        PNR: {registration.pnr} • {registration.numberOfPersons} person(s)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        registration.roomStatus === 'Assigned'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {registration.roomStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;

