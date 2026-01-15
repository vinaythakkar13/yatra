'use client';

import React from 'react';
import { Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/router';


export default function History() {
  const router = useRouter();
  const { registrations, yatraEvents, currentUser } = useApp();

  const upcomingYatras = yatraEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  );

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      Assigned: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700',
        text: 'Room Assigned',
      },
      Pending: {
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-700',
        text: 'Pending Assignment',
      },
      default: {
        icon: AlertCircle,
        className: 'bg-gray-100 text-gray-700',
        text: 'Not Assigned',
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          My Yatra History
        </h1>
        <p className="text-gray-600">
          View your past and upcoming Yatra registrations
        </p>
      </div>

      {/* Upcoming Yatras */}
      {upcomingYatras.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Upcoming Yatras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingYatras.map((yatra) => (
              <Card
                key={yatra.id}
                hoverable
                className="border-l-4 border-primary-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {yatra.name}
                    </h3>
                    <p className="text-sm text-gray-600">{yatra.description}</p>
                  </div>
                  {yatra.isActive && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    <span suppressHydrationWarning>
                      <strong>Start:</strong> {new Date(yatra.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span suppressHydrationWarning>
                      <strong>End:</strong> {new Date(yatra.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span suppressHydrationWarning>
                      Deadline: {new Date(yatra.submissionDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {yatra.isActive && (
                  <div className="mt-4">
                    <Button
                      onClick={() => router.push('/register')}
                      className="w-full"
                      size="sm"
                    >
                      Register Now
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Registration History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Registrations
        </h2>

        {registrations.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Registrations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't registered for any Yatra yet. Start your spiritual journey today!
            </p>
            <Button onClick={() => router.push('/register')}>
              Register for Yatra
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration) => (
              <Card 
                key={registration.id} 
                hoverable 
                className="animate-slide-up"
                title={registration.name}
                subtitle={`Registered on: ${new Date(registration.createdAt).toLocaleDateString()} • ${registration.numberOfPersons} traveler(s)`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(registration.roomStatus)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">PNR Number</p>
                    <p className="text-xl font-bold text-primary-600">
                      {registration.pnr}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Travelers</p>
                      <p className="font-semibold text-gray-800">
                        {registration.numberOfPersons} Person(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-secondary-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Boarding Point</p>
                      <p className="font-semibold text-gray-800">
                        {registration.boardingPoint.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Arrival</p>
                      <p className="font-semibold text-gray-800" suppressHydrationWarning>
                        {new Date(registration.arrivalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Return</p>
                      <p className="font-semibold text-gray-800" suppressHydrationWarning>
                        {new Date(registration.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travelers List */}
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Traveler Details:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {registration.persons.map((person, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="font-medium text-gray-800">{person.name}</p>
                        <p className="text-sm text-gray-600">
                          {person.age} years • {person.gender}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Images */}
                {registration.ticketImages && registration.ticketImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary-600" />
                      Ticket Images ({registration.ticketImages.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {registration.ticketImages.map((imageName, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                          <span className="truncate max-w-[150px]">{imageName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room & Accommodation Details */}
                {registration.roomNumber && (
                  <div className="mt-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl p-5 shadow-md">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-3 rounded-full shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-700 mb-0.5">Accommodation Confirmed</p>
                          <h4 className="text-xl font-bold text-gray-800">Room {registration.roomNumber}</h4>
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-300 shadow-sm">
                        <p className="text-xs text-gray-600">Floor</p>
                        <p className="text-2xl font-bold text-green-700">{registration.roomNumber.charAt(0)}</p>
                      </div>
                    </div>
                    
                    {/* Hotel Information */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Hotel Location</p>
                          <p className="text-sm text-gray-800 font-medium">Yatra Guest House</p>
                          <p className="text-xs text-gray-600">456 Temple Road, Holy City 110001</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Yatra+Guest+House"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          View on Map
                        </a>
                        <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg" suppressHydrationWarning>
                          <Calendar className="w-3.5 h-3.5" />
                          Check-in: {new Date(registration.arrivalDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Your accommodation is ready and waiting for you!</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

