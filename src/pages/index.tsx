'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Mountain, Search, Upload, Calendar, Users, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

/**
 * Welcome/Landing Page
 * 
 * Features:
 * - PNR validation for Indian Railway tickets
 * - Auto-fetch user details if PNR exists
 * - Option to upload ticket image if PNR not found
 * - Display upcoming Yatra information
 */
export default function Home() {
  const router = useRouter();
  const { validatePNR, getActiveYatra } = useApp();
  const [pnr, setPnr] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [ticketImage, setTicketImage] = useState<File | null>(null);

  const activeYatra = getActiveYatra();

  const handlePNRValidation = async () => {
    if (!pnr || pnr.length !== 10) {
      toast.error('Please enter a valid 10-digit PNR number', {
        position: 'top-center',
      });
      return;
    }

    setIsValidating(true);

    // Simulate API call
    setTimeout(() => {
      const existingRegistration = validatePNR(pnr);

      if (existingRegistration) {
        // PNR exists, show details and redirect
        toast.success(`✅ Welcome back, ${existingRegistration.name}! Redirecting to your history...`, {
          position: 'top-center',
        });
        setTimeout(() => router.push('/history'), 1000);
      } else {
        // PNR not found, ask for ticket upload
        setShowUploadModal(true);
      }

      setIsValidating(false);
    }, 1000);
  };

  const handleTicketUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketImage(e.target.files[0]);
    }
  };

  const handleContinueToRegistration = () => {
    setShowUploadModal(false);
    router.push(`/register?pnr=${pnr}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 rounded-full shadow-2xl">
            <Mountain className="w-16 h-16 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Welcome to Yatra Management
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Embark on your spiritual journey with us. Register for upcoming Yatras and manage your pilgrimage experience seamlessly.
        </p>
      </div>

      {/* Active Yatra Info */}
      {activeYatra && (
        <Card className="mb-8 border-l-4 border-primary-600 animate-slide-up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activeYatra.name}
              </h2>
              <p className="text-gray-600 mb-4">{activeYatra.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <span>
                    <strong>Start:</strong> {new Date(activeYatra.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>
                    <strong>End:</strong> {new Date(activeYatra.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-yellow-700 font-semibold">
                  <span>⏰ Deadline: {new Date(activeYatra.submissionDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push('/register')} size="lg">
              Register Now
            </Button>
          </div>
        </Card>
      )}

      {/* PNR Validation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card title="Check Your Registration" className="animate-slide-up">
          <p className="text-gray-600 mb-6">
            Enter your Indian Railway PNR number to check if you're already registered for the Yatra.
          </p>
          <div className="space-y-4">
            <Input
              label="PNR Number"
              placeholder="Enter 10-digit PNR"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              maxLength={10}
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
            <Button
              onClick={handlePNRValidation}
              isLoading={isValidating}
              className="w-full"
            >
              <Search className="w-5 h-5 mr-2" />
              Validate PNR
            </Button>
          </div>
        </Card>

        <Card title="New Registration" className="animate-slide-up">
          <p className="text-gray-600 mb-6">
            First time registering? Click below to start your Yatra registration process.
          </p>
          <Button
            onClick={() => router.push('/register')}
            variant="secondary"
            className="w-full"
          >
            Start New Registration
          </Button>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverable className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Registration</h3>
          <p className="text-gray-600">
            Simple and quick registration process for you and your family members.
          </p>
        </Card>

        <Card hoverable className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary-100 p-4 rounded-full">
              <Calendar className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Track Your Journey</h3>
          <p className="text-gray-600">
            View your Yatra history and upcoming journeys in one place.
          </p>
        </Card>

        <Card hoverable className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Room Assignment</h3>
          <p className="text-gray-600">
            Get accommodation assigned automatically for a hassle-free experience.
          </p>
        </Card>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="PNR Not Found"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleContinueToRegistration}>
              Continue to Registration
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            We couldn't find a registration with PNR <strong>{pnr}</strong>.
            You can proceed with the registration by uploading your ticket image (optional).
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleTicketUpload}
                className="hidden"
              />
              <span className="text-primary-600 font-semibold hover:text-primary-700">
                Click to upload ticket image
              </span>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG up to 5MB (Optional)
              </p>
            </label>
            {ticketImage && (
              <p className="mt-4 text-sm text-green-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                {ticketImage.name}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

