'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2, CheckCircle, User, Phone, MapPin, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import DatePicker from '@/components/ui/DatePicker';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

interface PersonFormData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

interface RegistrationFormData {
  pnr: string;
  name: string;
  contactNumber: string;
  numberOfPersons: number;
  persons: PersonFormData[];
  boardingCity: string;
  boardingState: string;
  arrivalDate: Date | null;
  returnDate: Date | null;
  ticketImages: File[];
}

/**
 * Registration Form Page
 * 
 * Features:
 * - React Hook Form for form management
 * - Dynamic person fields based on number of persons
 * - Form validation
 * - Beautiful UI with proper spacing and feedback
 */
export default function Register() {
  const router = useRouter();
  const { addRegistration } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketImages, setTicketImages] = useState<File[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      pnr: (router.query.pnr as string) || '',
      numberOfPersons: 1,
      persons: [{ name: '', age: 0, gender: 'male' }],
      arrivalDate: null,
      returnDate: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'persons',
  });

  const numberOfPersons = watch('numberOfPersons');

  // Adjust person fields when numberOfPersons changes
  React.useEffect(() => {
    const currentLength = fields.length;
    const targetLength = numberOfPersons;

    if (currentLength < targetLength) {
      for (let i = currentLength; i < targetLength; i++) {
        append({ name: '', age: 0, gender: 'male' });
      }
    } else if (currentLength > targetLength) {
      for (let i = currentLength; i > targetLength; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfPersons, fields.length, append, remove]);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newRegistration = {
        id: Date.now().toString(),
        pnr: data.pnr,
        name: data.name,
        contactNumber: data.contactNumber,
        numberOfPersons: data.numberOfPersons,
        persons: data.persons,
        boardingPoint: {
          city: data.boardingCity,
          state: data.boardingState,
        },
        arrivalDate: data.arrivalDate ? data.arrivalDate.toISOString() : '',
        returnDate: data.returnDate ? data.returnDate.toISOString() : '',
        ticketImages: ticketImages.map((file) => file.name), // Store image names for demo
        roomStatus: 'Pending',
        createdAt: new Date().toISOString(),
      };

      addRegistration(newRegistration);
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        router.push('/history');
      }, 2000);
    }, 1500);
  };

  const indianStates = [
    { value: '', label: 'Select State' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Punjab', label: 'Punjab' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <Card className="max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your Yatra registration has been submitted successfully. Redirecting to your history...
          </p>
          <div className="animate-pulse text-primary-600">Processing...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Yatra Registration
        </h1>
        <p className="text-gray-600">
          Fill in your details to register for the upcoming Yatra
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details */}
        <Card title="Personal Details" subtitle="Enter your contact information" className={"!z-[10]"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
            <Input
              label="PNR Number"
              placeholder="10-digit PNR"
              leftIcon={<User className="w-5 h-5 text-gray-400" />}
              {...register('pnr', {
                required: 'PNR is required',
                minLength: { value: 10, message: 'PNR must be 10 digits' },
                maxLength: { value: 10, message: 'PNR must be 10 digits' },
              })}
              error={errors.pnr?.message}
            />

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              leftIcon={<User className="w-5 h-5 text-gray-400" />}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label="Contact Number"
              type="tel"
              placeholder="10-digit mobile number"
              leftIcon={<Phone className="w-5 h-5 text-gray-400" />}
              {...register('contactNumber', {
                required: 'Contact number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit number',
                },
              })}
              error={errors.contactNumber?.message}
            />

            <Input
              label="Number of Persons"
              type="number"
              min="1"
              max="10"
              {...register('numberOfPersons', {
                required: 'Number of persons is required',
                min: { value: 1, message: 'At least 1 person required' },
                max: { value: 10, message: 'Maximum 10 persons allowed' },
              })}
              error={errors.numberOfPersons?.message}
            />
          </div>
        </Card>

        {/* Traveler Details */}
        <Card
          title="Traveler Details"
          className={"!z-[9]"}
          subtitle={`Add details for ${numberOfPersons} person(s)`}
        >
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-700">
                    Person {index + 1}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    placeholder="Full name"
                    {...register(`persons.${index}.name`, {
                      required: 'Name is required',
                    })}
                    error={errors.persons?.[index]?.name?.message}
                  />

                  <Input
                    label="Age"
                    type="number"
                    placeholder="Age"
                    {...register(`persons.${index}.age`, {
                      required: 'Age is required',
                      min: { value: 1, message: 'Invalid age' },
                      max: { value: 120, message: 'Invalid age' },
                    })}
                    error={errors.persons?.[index]?.age?.message}
                  />

                  <Controller
                    name={`persons.${index}.gender`}
                    control={control}
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => (
                      <SelectDropdown
                        label="Gender"
                        options={genderOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select gender"
                        required
                        searchable={false}
                        clearable={false}
                        error={errors.persons?.[index]?.gender?.message}
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Travel Details */}
        <Card title="Travel Details" 
        subtitle="Boarding and travel dates"
        className={"!z-[8]"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Boarding City"
              placeholder="City name"
              leftIcon={<MapPin className="w-5 h-5 text-gray-400" />}
              {...register('boardingCity', { required: 'City is required' })}
              error={errors.boardingCity?.message}
            />

            <Controller
              name="boardingState"
              control={control}
              rules={{ required: 'State is required' }}
              render={({ field }) => (
                <SelectDropdown
                  label="Boarding State"
                  options={indianStates}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select your state"
                  required
                  error={errors.boardingState?.message}
                />
              )}
            />

            <Controller
              name="arrivalDate"
              control={control}
              rules={{ 
                required: 'Arrival date is required',
                validate: (value) => {
                  if (!value) return 'Arrival date is required';
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (value < today) {
                    return 'Arrival date cannot be in the past';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <DatePicker
                  label="Arrival Date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select arrival date"
                  disablePastDates
                  required
                  error={errors.arrivalDate?.message}
                  helperText="Select your journey start date"
                />
              )}
            />

            <Controller
              name="returnDate"
              control={control}
              rules={{ 
                required: 'Return date is required',
                validate: (value) => {
                  if (!value) return 'Return date is required';
                  const arrivalDate = watch('arrivalDate');
                  if (arrivalDate && value < arrivalDate) {
                    return 'Return date must be after arrival date';
                  }
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (value < today) {
                    return 'Return date cannot be in the past';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <DatePicker
                  label="Return Date"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select return date"
                  minDate={watch('arrivalDate') || new Date()}
                  disablePastDates
                  required
                  error={errors.returnDate?.message}
                  helperText="Must be after arrival date"
                />
              )}
            />
          </div>
        </Card>

        {/* Ticket Images Upload */}
        <Card 
          className={"!z-[7]"}
          title="Ticket Images" 
          subtitle="Upload photos of your railway ticket(s)"
        >
          <ImageUpload
            label="Railway Ticket Photos"
            helperText="You can capture photos using your camera or upload from files. Maximum 5 images."
            maxFiles={5}
            value={ticketImages}
            onChange={setTicketImages}
          />
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Make sure your ticket details (PNR, names, dates) are clearly visible in the photos.
            </p>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="lg">
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </div>
      </form>
    </div>
  );
}

