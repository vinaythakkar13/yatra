'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  CheckCircle, User, MapPin,
  Users as UsersIcon, ChevronRight,
  Ticket, Check, MapPinned, X, Copy, CheckCircle2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Input from '@/components/ui/Input';
import SelectDropdown from '@/components/ui/SelectDropdown';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { useGetIndianStatesQuery } from '@/services/locationApi';
import { BsWhatsapp } from 'react-icons/bs';
import DatePicker from '../ui/DatePicker';
import { Yatra } from '@/types';
import { useUploadBase64Mutation } from '@/services/cloudinaryApi';
import { useCreateRegistrationMutation, CreateRegistrationRequest } from '@/services/registrationApi';
import { toast } from 'react-toastify';
import AnimatedSuccessIcon from '@/components/ui/AnimatedSuccessIcon';

interface PersonFormData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  isHandicapped: boolean;
}

interface RegistrationFormData {
  pnr: string;
  name: string;
  whatsappNumber: string;
  numberOfPersons: number;
  persons: PersonFormData[];
  boardingCity: string;
  boardingState: string;
  arrivalDate: Date | null;
  returnDate: Date | null;
  ticketImages: File[];
}

interface RegistrationFormProps {
  initialPnr?: string;
  yatraDetails?: Yatra;
}

/**
 * Registration Payload Interface
 * Structure for API submission
 */
export interface RegistrationPayload {
  pnr: string;
  name: string;
  whatsappNumber: string;
  numberOfPersons: number;
  persons: Array<{
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    isHandicapped: boolean;
  }>;
  boardingPoint: {
    city: string;
    state: string;
  };
  arrivalDate: string; // ISO 8601 format
  returnDate: string; // ISO 8601 format
  ticketImages: string[]; // Array of image URLs or base64 strings
  yatraId?: string; // Optional: Yatra ID if registering for specific yatra
}

/**
 * Example Registration Payload
 * Reference structure with sample values
 */
export const EXAMPLE_REGISTRATION_PAYLOAD: RegistrationPayload = {
  pnr: "1234567890",
  name: "John Doe",
  whatsappNumber: "9876543210",
  numberOfPersons: 2,
  persons: [
    {
      name: "John Doe",
      age: 35,
      gender: "male",
      isHandicapped: false,
    },
    {
      name: "Jane Doe",
      age: 32,
      gender: "female",
      isHandicapped: false,
    },
  ],
  boardingPoint: {
    city: "Mumbai",
    state: "Maharashtra",
  },
  arrivalDate: "2026-03-24",
  returnDate: "2026-03-26",
  ticketImages: [
    "https://res.cloudinary.com/example/image/upload/ticket1.jpg",
    "https://res.cloudinary.com/example/image/upload/ticket2.jpg",
  ],
  yatraId: "yatra-123",
};

/**
 * Format date to YYYY-MM-DD without timezone conversion
 * Prevents timezone shifts when sending dates to API
 * 
 * @param date - Date object to format
 * @returns Date string in YYYY-MM-DD format (local timezone)
 */
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Build Registration Payload
 * Converts form data and ticket images into API-ready payload
 * 
 * @param formData - Form data from react-hook-form
 * @param ticketImages - Array of File objects for ticket images
 * @param yatraId - Optional Yatra ID
 * @returns RegistrationPayload object ready for API submission
 * 
 * @example
 * // Example Registration Payload Structure:
 * const examplePayload: RegistrationPayload = {
 *   pnr: "1234567890",                    // string: 10-digit PNR number
 *   name: "John Doe",                     // string: Full name of primary traveler
 *   whatsappNumber: "9876543210",         // string: 10-digit Indian mobile number (without +91)
 *   numberOfPersons: 2,                   // number: Total number of travelers (1-20)
 *   persons: [                            // array: Details of all travelers
 *     {
 *       name: "John Doe",                  // string: Full name
 *       age: 35,                           // number: Age (1-120)
 *       gender: "male",                    // "male" | "female" | "other"
 *       isHandicapped: false               // boolean: Handicapped status
 *     },
 *     {
 *       name: "Jane Doe",
 *       age: 32,
 *       gender: "female",
 *       isHandicapped: false
 *     }
 *   ],
 *   boardingPoint: {                      // object: Boarding location
 *     city: "Mumbai",                      // string: City name
 *     state: "Maharashtra"                 // string: Indian state name
 *   },
 *   arrivalDate: "2026-03-24",            // string: YYYY-MM-DD format (local date)
 *   returnDate: "2026-03-26",             // string: YYYY-MM-DD format (local date)
 *   ticketImages: [                       // array: Ticket image URLs or base64
 *     "https://cloudinary.com/image1.jpg",
 *     "https://cloudinary.com/image2.jpg"
 *   ],
 *   yatraId: "yatra-123"                  // string (optional): Yatra ID if registering for specific yatra
 * };
 * 
 * // API Endpoint Usage:
 * // POST /api/register
 * // Content-Type: application/json
 * // Body: JSON.stringify(examplePayload)
 */
export function buildRegistrationPayload(
  formData: RegistrationFormData,
  ticketImages: File[],
  yatraId?: string
): RegistrationPayload {
  // Convert ticket images to base64 or URLs
  // Note: In production, upload images first and use URLs
  const ticketImageUrls: string[] = ticketImages.map((file) => {
    // Option 1: Return file name (temporary, should be replaced with uploaded URL)
    // return file.name;

    // Option 2: Convert to base64 (for small images)
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // return reader.result as string;

    // For now, return placeholder - should be replaced with actual uploaded URL
    return `ticket_${file.name}`;
  });

  return {
    pnr: formData.pnr,
    name: formData.name,
    whatsappNumber: formData.whatsappNumber,
    numberOfPersons: formData.numberOfPersons,
    persons: formData.persons.map((person) => ({
      name: person.name,
      age: person.age,
      gender: person.gender,
      isHandicapped: person.isHandicapped,
    })),
    boardingPoint: {
      city: formData.boardingCity,
      state: formData.boardingState,
    },
    arrivalDate: formData.arrivalDate ? formatDateForAPI(formData.arrivalDate) : '',
    returnDate: formData.returnDate ? formatDateForAPI(formData.returnDate) : '',
    ticketImages: ticketImageUrls,
    ...(yatraId && { yatraId }),
  };
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function RegistrationForm({ initialPnr = '', yatraDetails }: RegistrationFormProps) {
  const router = useRouter();
  const { addRegistration } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPnr, setSuccessPnr] = useState<string>('');
  const [ticketImages, setTicketImages] = useState<File[]>([]);
  const [ticketImagesError, setTicketImagesError] = useState<string>('');

  // API hooks
  const [uploadBase64] = useUploadBase64Mutation();
  const [createRegistration, { isLoading: isCreatingRegistration }] = useCreateRegistrationMutation();


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    setFocus,
  } = useForm<RegistrationFormData>({
    defaultValues: {
      pnr: initialPnr,
      whatsappNumber: '',
      numberOfPersons: 1,
      persons: [{ name: '', age: 0, gender: 'male', isHandicapped: false }],
      arrivalDate: null,
      returnDate: null,
    },
  });

  // Fetch Indian states from API
  const { data: statesData, isLoading: isLoadingStates } = useGetIndianStatesQuery();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'persons',
  });

  const numberOfPersons = watch('numberOfPersons');
  const arrivalDate = watch('arrivalDate');

  // Ref to track if user is currently typing in numberOfPersons field
  const isTypingRef = React.useRef(false);
  const numberOfPersonsInputRef = React.useRef<HTMLInputElement | null>(null);

  // Debounced effect to update fields only when user stops typing
  React.useEffect(() => {
    // Skip if user is currently typing
    if (isTypingRef.current) {
      return;
    }

    const targetLength = Number(numberOfPersons);
    const currentLength = fields.length;

    // Skip if not a valid integer or if lengths already match
    if (!Number.isInteger(targetLength) || targetLength < 1 || targetLength > 20 || currentLength === targetLength) {
      return;
    }

    // Store the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    const wasFocusOnNumberOfPersons = activeElement === numberOfPersonsInputRef.current;

    if (currentLength < targetLength) {
      for (let i = currentLength; i < targetLength; i++) {
        append({ name: '', age: 0, gender: 'male', isHandicapped: false }, { shouldFocus: false });
      }
    } else if (currentLength > targetLength) {
      for (let i = currentLength; i > targetLength; i--) {
        remove(i - 1);
      }
    }

    // Restore focus to numberOfPersons input if it was focused before
    if (wasFocusOnNumberOfPersons && numberOfPersonsInputRef.current) {
      setTimeout(() => {
        if (numberOfPersonsInputRef.current && document.contains(numberOfPersonsInputRef.current)) {
          numberOfPersonsInputRef.current.focus();
          // Restore cursor position
          const input = numberOfPersonsInputRef.current;
          const cursorPosition = input.value.length;
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    }
  }, [numberOfPersons, fields.length, append, remove]);

  const handleTicketImagesChange = (images: File[]) => {
    setTicketImages(images);
    if (images.length > 0 && ticketImagesError) {
      setTicketImagesError('');
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setTicketImagesError('');
    setSubmissionError('');

    if (ticketImages.length < 2) {
      setTicketImagesError('Minimum 2 ticket images are required (Both Arrival & Return)');
      setTimeout(() => {
        const ticketImagesCard = document.getElementById('ticket-images-card');
        if (ticketImagesCard) {
          ticketImagesCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    if (!yatraDetails?.id) {
      setSubmissionError('Yatra details are missing. Please refresh the page and try again.');
      toast.error('Yatra details are missing');
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload all ticket images to Cloudinary
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < ticketImages.length; i++) {
        try {
          const file = ticketImages[i];

          // Convert file to base64
          const fullBase64 = await fileToBase64(file);

          // Strip the prefix (data:image/jpeg;base64,) if necessary
          // Some backends only want the raw base64 data
          const base64Image = fullBase64.includes('base64,')
            ? fullBase64.split('base64,')[1]
            : fullBase64;


          // Generate public_id for ticket image
          const sanitizedPnr = data.pnr.replace(/[^a-z0-9]/gi, '_');
          const publicId = `yatra/tickets/${sanitizedPnr}_${Date.now()}_${i + 1}`;


          // Upload to Cloudinary - matches new CURL format: /cloudinary/upload-ticket
          const uploadResult = await uploadBase64({
            base64Image: fullBase64,
            folder: 'yatras/tickets',
          }).unwrap();


          if (uploadResult.success && uploadResult.data) {
            uploadedImageUrls.push(uploadResult.data.secure_url);
          } else {
            console.error(`[RegistrationForm] Upload failed for image ${i + 1}:`, uploadResult.error);
            throw new Error(uploadResult.error || 'Failed to upload ticket image');
          }

          // Small delay between uploads to allow backend to breathe
          if (i < ticketImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (uploadError: any) {
          console.error(`[RegistrationForm] Critical error uploading image ${i + 1}:`, uploadError);
          const errorMessage = uploadError?.data?.error || uploadError?.message || `Failed to upload ticket image ${i + 1}`;
          toast.error(errorMessage);
          setIsSubmitting(false);
          setSubmissionError(`Failed to upload ticket image ${i + 1}. Please try again.`);
          return;
        }
      }

      // Step 2: Build registration payload with uploaded image URLs and yatraId
      const registrationPayload = buildRegistrationPayload(data, ticketImages, yatraDetails.id);
      registrationPayload.ticketImages = uploadedImageUrls; // Replace with uploaded URLs

      // Step 3: Prepare API payload (ensure yatraId is always a string and isHandicapped is included)
      const apiPayload: CreateRegistrationRequest = {
        ...registrationPayload,
        yatraId: yatraDetails.id, // Ensure yatraId is always present
        persons: registrationPayload.persons.map(person => ({
          name: person.name,
          age: person.age,
          gender: person.gender,
          isHandicapped: person.isHandicapped ?? false, // Explicitly ensure isHandicapped is included
        })),
      };

      // Step 4: Call registration API
      const result = await createRegistration(apiPayload).unwrap();

      if (result.success) {
        // Store in local context for backward compatibility
        const newRegistration = {
          id: result.data?.id || Date.now().toString(),
          pnr: registrationPayload.pnr,
          name: registrationPayload.name,
          contactNumber: registrationPayload.whatsappNumber,
          numberOfPersons: registrationPayload.numberOfPersons,
          persons: registrationPayload.persons,
          boardingPoint: registrationPayload.boardingPoint,
          arrivalDate: registrationPayload.arrivalDate,
          returnDate: registrationPayload.returnDate,
          ticketImages: uploadedImageUrls,
          roomStatus: 'Pending',
          createdAt: result.data?.createdAt || new Date().toISOString(),
        };
        addRegistration(newRegistration);

        // Show success modal
        setSuccessPnr(registrationPayload.pnr);
        setShowSuccess(true);
        toast.success('Registration submitted successfully!');
      } else {
        throw new Error(result.error || 'Failed to submit registration');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.data?.message || error?.data?.error || error?.message || 'An error occurred while submitting your registration. Please try again.';
      setSubmissionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = React.useMemo(() => {
    if (!statesData) {
      return [{ value: '', label: 'Select State' }];
    }

    return [
      { value: '', label: 'Select State' },
      ...statesData.map(state => ({
        value: state.name,
        label: state.name,
      }))
    ];
  }, [statesData]);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  // Copy PNR to clipboard
  const handleCopyPnr = () => {
    navigator.clipboard.writeText(successPnr);
    toast.success('PNR copied to clipboard!');
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
        <div className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-5 sm:p-7">
              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <AnimatedSuccessIcon size={160} loop={true} />
              </div>

              {/* Success Message */}
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Registration Successful!
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Your registration for Yatra has been submitted successfully. You can track your registration using your PNR number.
                </p>
              </div>

              {/* PNR Display Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
                <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest text-center">
                  Your PNR Number
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Ticket className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 font-mono tracking-tighter">
                    {successPnr}
                  </p>
                </div>
                <button
                  onClick={handleCopyPnr}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 group shadow-sm active:scale-[0.98]"
                >
                  <Copy className="w-3.5 h-3.5 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700">Copy PNR</span>
                </button>
              </div>

              {/* Information Box */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                      What's Next?
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>Keep your PNR number safe for tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>You'll receive a confirmation message shortly</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button
                  type="button"
                  onClick={() => router.push('/history')}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 py-2.5 text-sm font-bold rounded-lg"
                >
                  <span className="flex items-center justify-center gap-2 text-white">
                    View My Bookings
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 py-2.5 text-sm font-medium rounded-lg"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      {/* Personal Details */}
      <div className="bg-spiritual-zen-mist/30 rounded-xl border border-spiritual-zen-accent/20 p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-accent rounded-lg flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-spiritual-zen-charcoal">Personal Details</h2>
            <p className="text-xs text-spiritual-textLight hidden sm:block">Your contact information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Controller
            name="pnr"
            control={control}
            rules={{
              required: 'PNR is required',
              minLength: { value: 10, message: 'PNR must be 10 digits' },
              maxLength: { value: 10, message: 'PNR must be 10 digits' },
              pattern: {
                value: /^\d{10}$/,
                message: 'PNR must contain exactly 10 digits',
              },
            }}
            render={({ field }) => (
              <Input
                label="PNR Number"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="10-digit PNR"
                leftIcon={<Ticket className="w-4 h-4 text-spiritual-textLight" />}
                {...field}
                error={errors.pnr?.message}
                className="border-spiritual-zen-accent/30 focus:border-spiritual-zen-forest"
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: 'Name can only contain letters and spaces',
              },
            }}
            render={({ field }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                leftIcon={<User className="w-4 h-4 text-spiritual-textLight" />}
                {...field}
                error={errors.name?.message}
                className="border-spiritual-zen-accent/30 focus:border-spiritual-zen-forest"
              />
            )}
          />

          <Controller
            name="whatsappNumber"
            control={control}
            rules={{
              required: 'Whatsapp number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Please enter a valid 10-digit Indian mobile number',
              },
              minLength: { value: 10, message: 'Mobile number must be 10 digits' },
              maxLength: { value: 10, message: 'Mobile number must be 10 digits' },
            }}
            render={({ field }) => (
              <div className="w-full">
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-700">
                  Whatsapp Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  {/* WhatsApp Icon */}
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none z-10">
                    <BsWhatsapp className="w-4 h-4 text-spiritual-textLight" />
                  </div>
                  {/* +91 Prefix */}
                  <div className="absolute inset-y-0 left-9 sm:left-10 flex items-center pointer-events-none z-10">
                    <span className="text-sm sm:text-base font-medium text-spiritual-zen-charcoal border-r border-spiritual-zen-accent/30 pr-2 sm:pr-2.5">
                      +91
                    </span>
                  </div>
                  <input
                    {...field}
                    type="tel"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className={`
                      w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all duration-200 bg-white text-sm sm:text-base
                      pl-20 sm:pl-24
                      ${errors.whatsappNumber
                        ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                        : 'border-spiritual-zen-accent/30 focus:border-spiritual-zen-forest focus:ring-2 focus:ring-spiritual-zen-forest/20 hover:border-spiritual-zen-accent/50'
                      }
                      placeholder:text-gray-400
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center animate-slide-down">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.whatsappNumber.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="numberOfPersons"
            control={control}
            rules={{
              required: 'Number of persons is required',
              min: { value: 1, message: 'At least 1 person required' },
              max: { value: 20, message: 'Maximum 20 persons allowed' },
              validate: (value) => {
                if (!Number.isInteger(Number(value))) {
                  return 'Number of persons must be a whole number';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                ref={(el) => {
                  numberOfPersonsInputRef.current = el;
                  if (typeof field.ref === 'function') {
                    field.ref(el);
                  } else if (field.ref) {
                    (field.ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
                  }
                }}
                label="Number of Travelers"
                type="number"
                min={1}
                max={20}
                leftIcon={<UsersIcon className="w-4 h-4 text-spiritual-textLight" />}
                value={field.value || ''}
                onChange={(e) => {
                  isTypingRef.current = true;
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  field.onChange(value);
                  // Clear typing flag after a short delay
                  setTimeout(() => {
                    isTypingRef.current = false;
                  }, 300);
                }}
                onBlur={(e) => {
                  isTypingRef.current = false;
                  field.onBlur();
                  // Ensure fields are synced when user finishes editing
                  const value = Number(e.target.value);
                  if (Number.isInteger(value) && value >= 1 && value <= 20) {
                    const currentLength = fields.length;
                    if (currentLength !== value) {
                      if (currentLength < value) {
                        for (let i = currentLength; i < value; i++) {
                          append({ name: '', age: 0, gender: 'male', isHandicapped: false }, { shouldFocus: false });
                        }
                        // Focus the first traveler's name field after adding fields
                        setTimeout(() => {
                          setFocus('persons.0.name');
                        }, 100);
                      } else if (currentLength > value) {
                        for (let i = currentLength; i > value; i--) {
                          remove(i - 1);
                        }
                      }
                    }
                  }
                }}
                error={errors.numberOfPersons?.message}
                className="border-spiritual-zen-accent/30 focus:border-spiritual-zen-forest"
              />
            )}
          />
        </div>
      </div>

      {/* Traveler Details */}
      <div className="bg-spiritual-zen-mist/30 rounded-xl border border-spiritual-zen-accent/20 p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-spiritual-zen-accent to-spiritual-zen-forest rounded-lg flex-shrink-0">
            <UsersIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-spiritual-zen-charcoal">Traveler Details</h2>
            <p className="text-xs text-spiritual-textLight">{numberOfPersons} traveler(s)</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-3 sm:p-4 bg-white border border-spiritual-zen-accent/20 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <h4 className="text-sm font-semibold text-spiritual-zen-charcoal">
                  Traveler {index + 1}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Controller
                  name={`persons.${index}.name`}
                  control={control}
                  rules={{
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: 'Name can only contain letters and spaces',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Name"
                      placeholder="Full name"
                      {...field}
                      error={errors.persons?.[index]?.name?.message}
                      className="bg-white"
                    />
                  )}
                />

                <Controller
                  name={`persons.${index}.age`}
                  control={control}
                  rules={{
                    required: 'Age is required',
                    min: { value: 1, message: 'Age must be at least 1' },
                    max: { value: 120, message: 'Age cannot exceed 120' },
                    validate: (value) => {
                      if (!Number.isInteger(Number(value))) {
                        return 'Age must be a whole number';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Age"
                      type="number"
                      placeholder="Age"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      min={1}
                      max={120}
                      error={errors.persons?.[index]?.age?.message}
                      className="bg-white"
                    />
                  )}
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
                      placeholder="Select"
                      required
                      searchable={false}
                      clearable={false}
                      error={errors.persons?.[index]?.gender?.message}
                    />
                  )}
                />
              </div>

              <div className="mt-3">
                <Controller
                  name={`persons.${index}.isHandicapped`}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${field.value
                          ? 'bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-accent border-spiritual-zen-forest'
                          : 'border-spiritual-zen-accent/30 bg-white group-hover:border-spiritual-zen-forest/50'
                          }`}>
                          {field.value && (
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-spiritual-zen-charcoal select-none">
                        Handicapped?
                      </span>
                    </label>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Details */}
      <div className="bg-spiritual-zen-mist/30 rounded-xl border border-spiritual-zen-accent/20 p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-spiritual-zen-accent to-spiritual-zen-forest rounded-lg flex-shrink-0">
            <MapPinned className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-spiritual-zen-charcoal">Travel Details</h2>
            <p className="text-xs text-spiritual-textLight hidden sm:block">Boarding location and dates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Controller
            name="boardingCity"
            control={control}
            rules={{
              required: 'City is required',
              minLength: { value: 2, message: 'City name must be at least 2 characters' },
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: 'City name can only contain letters and spaces',
              },
            }}
            render={({ field }) => (
              <Input
                label="Boarding City"
                placeholder="City name"
                leftIcon={<MapPin className="w-4 h-4 text-spiritual-textLight" />}
                {...field}
                error={errors.boardingCity?.message}
              />
            )}
          />

          <Controller
            name="boardingState"
            control={control}
            rules={{ required: 'State is required' }}
            render={({ field }) => (
              <SelectDropdown
                label="Boarding State"
                options={indianStates}
                loading={isLoadingStates}
                value={field.value}
                onChange={field.onChange}
                placeholder={isLoadingStates ? 'Loading states...' : 'Select state'}
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
                if (!value) return 'Please select your arrival date';
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (value < today) return 'Arrival date cannot be in the past';
                const maxFutureDate = new Date();
                maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
                if (value > maxFutureDate) return 'Arrival date cannot be more than 1 year in the future';
                return true;
              }
            }}
            render={({ field }) => (
              <DatePicker
                label="Arrival Date"
                value={field.value}
                onChange={(date) => {
                  field.onChange(date);
                  const returnDate = watch('returnDate');
                  if (returnDate && date && returnDate < date) {
                    setValue('returnDate', null);
                  }
                }}
                placeholder="Select date"
                // disablePastDates
                required
                minDate={new Date(yatraDetails?.start_date || '')}
                maxDate={new Date(yatraDetails?.end_date || '')}
                error={errors.arrivalDate?.message}
              />
            )}
          />

          <Controller
            name="returnDate"
            control={control}
            rules={{
              required: 'Return date is required',
              validate: (value) => {
                if (!value) return 'Please select your return date';
                if (!arrivalDate) return 'Please select arrival date first';
                if (value < arrivalDate) return 'Return date must be on or after arrival date';
                const maxReturnDate = new Date(arrivalDate);
                maxReturnDate.setMonth(maxReturnDate.getMonth() + 6);
                if (value > maxReturnDate) return 'Return date cannot be more than 6 months after arrival date';
                return true;
              }
            }}
            render={({ field }) => (
              <DatePicker
                label="Return Date"
                value={field.value}
                onChange={field.onChange}
                placeholder="Select date"
                minDate={arrivalDate ? new Date(arrivalDate) : new Date(yatraDetails?.end_date || '')}
                maxDate={new Date(yatraDetails?.end_date || '')}
                // disablePastDates
                required
                error={errors.returnDate?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Ticket Images */}
      <div id="ticket-images-card" className="relative bg-gradient-to-br from-white via-spiritual-zen-mist/20 to-white rounded-xl border-2 border-spiritual-zen-accent/30 shadow-lg overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-spiritual-zen-forest/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-spiritual-zen-accent/5 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10 p-4 sm:p-5 md:p-6">
          {/* Header Section */}
          <div className="flex items-start gap-3 mb-5">
            <div className="p-2 bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-accent rounded-xl shadow-md flex-shrink-0 transform transition-transform hover:scale-105">
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-spiritual-zen-charcoal mb-1">
                Upload Railway Tickets
              </h2>
              <p className="text-xs sm:text-sm text-spiritual-textLight leading-relaxed">
                Please upload clear photos of both arrival and return railway tickets for booking verification.
              </p>
            </div>
          </div>



          {/* Image Upload Component */}
          <div className="mb-4">
            <ImageUpload
              label=""
              helperText=""
              maxFiles={10}
              value={ticketImages}
              onChange={handleTicketImagesChange}
              error={ticketImagesError}
            />
          </div>

          {/* Progress Indicator */}
          {ticketImages.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-spiritual-zen-accent/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-spiritual-zen-charcoal">
                  {ticketImages.length} ticket{ticketImages.length > 1 ? 's' : ''} uploaded
                </span>
              </div>
              <span className="text-xs text-spiritual-textLight">
                {ticketImages.length}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {submissionError && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-slide-down">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-red-100 rounded-full flex-shrink-0">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">Registration Failed</p>
              <p className="text-sm text-red-700">{submissionError}</p>
            </div>
            <button
              onClick={() => setSubmissionError('')}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Submit Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3 border-t border-spiritual-zen-accent/20">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
          disabled={isSubmitting || isCreatingRegistration}
          className="w-full sm:w-auto border border-spiritual-zen-accent/30 text-spiritual-zen-charcoal hover:bg-spiritual-zen-mist/50 text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting || isCreatingRegistration}
          disabled={isSubmitting || isCreatingRegistration}
          className="w-full sm:w-auto bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent text-white hover:shadow-lg transition-all duration-300 text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isCreatingRegistration ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {isSubmitting && !isCreatingRegistration ? 'Uploading images...' : 'Submitting registration...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Submit Registration
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

