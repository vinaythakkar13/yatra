import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Hotel,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Building,
  Layers,
  Bed,
  ArrowRight,
  Info,
  Navigation,
  CalendarDays,
  Users,
  Home,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import BasicInfoStep from "./steps/BasicInfoStep";
import ManagementStep from "./steps/ManagementStep";
import ConfigurationStep from "./steps/ConfigurationStep";
import { useGetActiveYatrasQuery } from "@/services/yatraApi";

export interface RoomData {
  roomNumber: string;
  toiletType: "indian" | "western";
  numberOfBeds: number;
  chargePerDay: number;
}

export interface FloorData {
  floorNumber: string;
  numberOfRooms: number;
  roomNumbers: string[];
  rooms: RoomData[];
}

export interface HotelFormData {
  name: string;
  address: string;
  mapLink?: string;
  distanceFromBhavan?: number;
  hotelType: "A" | "B" | "C" | "D";
  yatraId?: string;
  managerName: string;
  managerContact: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  checkInTime: string;
  checkOutTime: string;
  hasElevator: boolean;
  totalFloors: number;
  floors: FloorData[];
}

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HotelFormData) => void;
  initialData?: any;
  isEditMode?: boolean;
}

const steps = [
  { id: 0, title: "Basic Info", description: "Hotel details & location" },
  { id: 1, title: "Management", description: "Manager & contract info" },
  { id: 2, title: "Configuration", description: "Floors & rooms setup" },
];

const AddHotelModal: React.FC<AddHotelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] =
    useState<HotelFormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      address: "",
      mapLink: "",
      distanceFromBhavan: undefined,
      hotelType: "A",
      yatraId: "",
      managerName: "",
      managerContact: "",
      numberOfDays: 1,
      startDate: "",
      endDate: "",
      checkInTime: "12:00",
      checkOutTime: "11:00",
      hasElevator: false,
      totalFloors: 1,
      floors: [
        {
          floorNumber: "1",
          numberOfRooms: 1,
          roomNumbers: [""],
          rooms: [
            {
              roomNumber: "",
              toiletType: "western",
              numberOfBeds: 1,
              chargePerDay: 0,
            },
          ],
        },
      ],
    },
    mode: "onChange",
  });

  const { fields: floorFields, replace: replaceFloors } = useFieldArray({
    control,
    name: "floors",
  });

  const totalFloors = watch("totalFloors");
  const allFloorsData = watch("floors");

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      if (isEditMode && initialData) {
        reset({
          name: initialData.name || "",
          address: initialData.address || "",
          mapLink: initialData.mapLink || "",
          distanceFromBhavan: initialData.distanceFromBhavan || undefined,
          hotelType: initialData.hotelType || "A",
          yatraId: initialData.yatraId || "",
          managerName: initialData.managerName || "",
          managerContact: initialData.managerContact || "",
          numberOfDays: initialData.numberOfDays || 1,
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          checkInTime: initialData.checkInTime || "12:00",
          checkOutTime: initialData.checkOutTime || "11:00",
          hasElevator: initialData.hasElevator || false,
          totalFloors:
            initialData.totalFloors || initialData.floors?.length || 1,
          floors:
            initialData.floors && Array.isArray(initialData.floors)
              ? initialData.floors.map((f: any) => ({
                floorNumber: f.floorNumber.toString(),
                numberOfRooms: f.numberOfRooms,
                roomNumbers: [...f.roomNumbers],
                rooms:
                  f.rooms && Array.isArray(f.rooms)
                    ? f.rooms.map((r: any) => ({
                      roomNumber: r.roomNumber || "",
                      toiletType: r.toiletType || "western",
                      numberOfBeds: r.numberOfBeds || 1,
                      chargePerDay: r.chargePerDay || 0,
                    }))
                    : f.roomNumbers.map(() => ({
                      roomNumber: "",
                      toiletType: "western" as const,
                      numberOfBeds: 1,
                      chargePerDay: 0,
                    })),
              }))
              : [
                {
                  floorNumber: "1",
                  numberOfRooms: 1,
                  roomNumbers: [""],
                  rooms: [
                    {
                      roomNumber: "",
                      toiletType: "western",
                      numberOfBeds: 1,
                      chargePerDay: 0,
                    },
                  ],
                },
              ],
        });
      } else {
        reset({
          name: "",
          address: "",
          mapLink: "",
          distanceFromBhavan: undefined,
          hotelType: "A",
          yatraId: "",
          managerName: "",
          managerContact: "",
          numberOfDays: 1,
          startDate: "",
          endDate: "",
          checkInTime: "12:00",
          checkOutTime: "11:00",
          hasElevator: false,
          totalFloors: 1,
          floors: [
            {
              floorNumber: "1",
              numberOfRooms: 1,
              roomNumbers: [""],
              rooms: [
                {
                  roomNumber: "",
                  toiletType: "western",
                  numberOfBeds: 1,
                  chargePerDay: 0,
                },
              ],
            },
          ],
        });
      }
    }
  }, [isOpen, isEditMode, initialData, reset]);

  useEffect(() => {
    if (isOpen && totalFloors) {
      if (allFloorsData && allFloorsData.length === totalFloors) return;

      const newFloors: FloorData[] = [];
      for (let i = 0; i < totalFloors; i++) {
        const existingFloor = allFloorsData?.[i];
        newFloors.push(
          existingFloor || {
            floorNumber: (i + 1).toString(),
            numberOfRooms: 1,
            roomNumbers: [""],
            rooms: [
              {
                roomNumber: "",
                toiletType: "western",
                numberOfBeds: 1,
                chargePerDay: 0,
              },
            ],
          }
        );
      }
      if (!allFloorsData || newFloors.length !== allFloorsData.length) {
        replaceFloors(newFloors);
      }
    }
  }, [totalFloors, isOpen, replaceFloors]);

  const validateStep = async (step: number) => {
    let fieldsToValidate: any[] = [];
    switch (step) {
      case 0:
        fieldsToValidate = [
          "name",
          "address",
          "hotelType",
          "yatraId",
          "mapLink",
          "distanceFromBhavan",
        ];
        break;
      case 1:
        fieldsToValidate = [
          "managerName",
          "managerContact",
          "numberOfDays",
          "startDate",
          "endDate",
          "checkInTime",
          "checkOutTime",
          "hasElevator",
        ];
        break;
      case 2:
        fieldsToValidate = ["totalFloors", "floors"];
        break;
    }
    return await trigger(fieldsToValidate);
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = async (stepId: number) => {
    if (stepId < currentStep) {
      setDirection(-1);
      setCurrentStep(stepId);
      return;
    }

    if (stepId > currentStep) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setDirection(1);
        setCurrentStep(stepId);
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <Modal
      isOpen={isOpen}
      closeOnBackdropClick={false}
      onClose={onClose}
      title={isEditMode ? "Edit Hotel" : "Add New Hotel"}
      size="xl"
      variant="admin"
    >
      <div className="flex flex-col h-full">
        {/* Stepper Header */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-heritage-highlight/50 rounded-full -z-10" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-heritage-primary to-heritage-secondary transition-all duration-500 rounded-full -z-10 shadow-lg shadow-heritage-primary/20"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm p-2 cursor-pointer group"
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${currentStep >= step.id
                      ? "bg-gradient-to-br from-heritage-primary to-heritage-secondary text-white shadow-lg shadow-heritage-primary/40 scale-110 ring-2 ring-heritage-gold/30"
                      : "bg-heritage-highlight/60 text-heritage-text/60 group-hover:bg-heritage-highlight/80 group-hover:text-heritage-text"
                    }
                  `}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id + 1
                  )}
                </div>
                <div className="hidden sm:block text-center">
                  <p
                    className={`text-xs font-semibold transition-colors ${currentStep >= step.id
                        ? "text-heritage-textDark"
                        : "text-heritage-text/60"
                      }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 transition-colors ${currentStep >= step.id
                        ? "text-heritage-text/70"
                        : "text-heritage-text/50"
                      }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit((data) => {
            // Show confirmation modal instead of submitting directly
            setPendingSubmitData(data);
            setShowConfirmation(true);
          })}
          noValidate
          className="flex-1 flex flex-col"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="h-full"
              >
                {currentStep === 0 && (
                  <BasicInfoStep
                    watch={watch}
                    control={control}
                    register={register}
                    errors={errors}
                  />
                )}
                {currentStep === 1 && (
                  <ManagementStep
                    watch={watch}
                    control={control}
                    register={register}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <ConfigurationStep
                    control={control}
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    floorFields={floorFields}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-heritage-gold/20">
            <Button
              type="button"
              variant="admin-outline"
              onClick={currentStep === 0 ? onClose : handleBack}
            >
              {currentStep === 0 ? "Cancel" : "Back"}
            </Button>

            <div className="flex gap-3">
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  variant="admin"
                  onClick={handleNext}
                  className="w-32 group bg-gradient-to-r from-heritage-primary to-heritage-secondary hover:from-heritage-secondary hover:to-heritage-primary text-white shadow-lg shadow-heritage-primary/30"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button type="submit" variant="admin" isLoading={isSubmitting}>
                  {isEditMode ? "Update" : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingSubmitData(null);
        }}
        onConfirm={() => {
          if (pendingSubmitData) {
            onSubmit(pendingSubmitData);
            setShowConfirmation(false);
            setPendingSubmitData(null);
          }
        }}
        hotelData={pendingSubmitData}
      />
    </Modal>
  );
};

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hotelData: HotelFormData | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hotelData,
}) => {
  const { data: yatras = [] } = useGetActiveYatrasQuery();

  if (!hotelData) return null;

  // Get selected yatra name
  const selectedYatra = yatras.find((y) => y.id === hotelData.yatraId);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalRooms = hotelData.floors.reduce(
    (sum, floor) => sum + floor.numberOfRooms,
    0
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-heritage-primary" />
          <span>Review Hotel Information</span>
        </div>
      }
      size="lg"
      variant="admin"
      closeOnBackdropClick={false}
    >
      <div className="space-y-4 sm:space-y-5">
        {/* Info Message - Enhanced */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-4 flex items-start gap-3 shadow-sm">
          <div className="p-1.5 bg-blue-500 rounded-lg flex-shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm text-blue-900 font-medium leading-relaxed">
            Please review all the details carefully. Once confirmed, this hotel
            will be added to the system.
          </p>
        </div>

        <div className="space-y-4">
          {/* Hotel & Location - Enhanced Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-heritage-gold/40 shadow-lg shadow-heritage-gold/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-heritage-gold/30">
              <div className="p-2.5 bg-gradient-to-br from-heritage-primary to-heritage-secondary rounded-xl shadow-md">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-heritage-textDark">
                Hotel & Location
              </h3>
            </div>
            <div className="space-y-4">
              {/* Hotel Name & Type - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <Hotel className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Hotel Name
                    </p>
                    <p className="text-base font-bold text-heritage-textDark truncate">
                      {hotelData.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <Building className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Category
                    </p>
                    <p className="text-base font-bold text-heritage-textDark">
                      Type {hotelData.hotelType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Yatra - Enhanced */}
              {selectedYatra && (
                <div className="p-3 bg-gradient-to-r from-heritage-highlight/30 to-heritage-highlight/10 rounded-lg border border-heritage-gold/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-heritage-primary/30 to-heritage-secondary/30 rounded-lg">
                      <Navigation className="w-4 h-4 text-heritage-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-heritage-text/60 mb-1">
                        Yatra
                      </p>
                      <p className="text-sm font-bold text-heritage-textDark truncate">
                        {selectedYatra.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address & Distance - Enhanced */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg flex-shrink-0">
                    <MapPin className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-heritage-textDark break-words leading-relaxed">
                      {hotelData.address}
                    </p>
                    {hotelData.distanceFromBhavan && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-heritage-gold/20">
                        <Navigation className="w-3.5 h-3.5 text-heritage-primary/70" />
                        <span className="text-xs font-medium text-heritage-text/70">
                          {hotelData.distanceFromBhavan} km from Bhavan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Dates - Enhanced Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-heritage-gold/40 shadow-lg shadow-heritage-gold/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-heritage-gold/30">
              <div className="p-2.5 bg-gradient-to-br from-heritage-primary to-heritage-secondary rounded-xl shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-heritage-textDark">
                Contact & Schedule
              </h3>
            </div>
            <div className="space-y-4">
              {/* Manager Contact - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-heritage-gold/20">
                <div className="flex items-start gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <User className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Manager
                    </p>
                    <p className="text-base font-bold text-heritage-textDark truncate">
                      {hotelData?.managerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <Phone className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Contact
                    </p>
                    <p className="text-base font-bold text-heritage-textDark">
                      +91 {hotelData.managerContact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates - Enhanced with visual flow */}
              <div className="p-3 bg-gradient-to-r from-heritage-highlight/20 to-heritage-highlight/10 rounded-lg border border-heritage-gold/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                      <CalendarDays className="w-4 h-4 text-heritage-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-heritage-text/60 mb-1">
                        Start Date
                      </p>
                      <p className="text-sm font-bold text-heritage-textDark">
                        {formatDate(hotelData.startDate)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-heritage-primary/60 hidden sm:block flex-shrink-0 mx-2" />
                  <div className="flex items-center gap-3 flex-1 sm:ml-0 ml-11">
                    <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                      <CalendarDays className="w-4 h-4 text-heritage-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-heritage-text/60 mb-1">
                        End Date
                      </p>
                      <p className="text-sm font-bold text-heritage-textDark">
                        {formatDate(hotelData.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Times & Duration - Enhanced */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <Clock className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Check-in
                    </p>
                    <p className="text-sm font-bold text-heritage-textDark">
                      {hotelData.checkInTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                    <Clock className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Check-out
                    </p>
                    <p className="text-sm font-bold text-heritage-textDark">
                      {hotelData.checkOutTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-heritage-primary/10 to-heritage-secondary/10 rounded-lg border-2 border-heritage-primary/30">
                  <div className="p-2 bg-gradient-to-br from-heritage-primary/30 to-heritage-secondary/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-heritage-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-heritage-text/60 mb-1">
                      Duration
                    </p>
                    <p className="text-sm font-bold text-heritage-textDark">
                      {hotelData.numberOfDays}{" "}
                      {hotelData.numberOfDays === 1 ? "Day" : "Days"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Building Info - Enhanced Card */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-heritage-gold/40 shadow-lg shadow-heritage-gold/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-heritage-gold/30">
              <div className="p-2.5 bg-gradient-to-br from-heritage-primary to-heritage-secondary rounded-xl shadow-md">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-heritage-textDark">
                Building Details
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                  <Layers className="w-4 h-4 text-heritage-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-heritage-text/60 mb-1">
                    Floors
                  </p>
                  <p className="text-base font-bold text-heritage-textDark">
                    {hotelData.totalFloors}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                  <Bed className="w-4 h-4 text-heritage-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-heritage-text/60 mb-1">
                    Rooms
                  </p>
                  <p className="text-base font-bold text-heritage-textDark">
                    {totalRooms}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-heritage-highlight/20 rounded-lg border border-heritage-gold/20">
                <div className="p-2 bg-gradient-to-br from-heritage-primary/20 to-heritage-secondary/20 rounded-lg">
                  <Layers className="w-4 h-4 text-heritage-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-heritage-text/60 mb-1">
                    Elevator
                  </p>
                  <p className="text-base font-bold text-heritage-textDark">
                    {hotelData.hasElevator ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-heritage-gold/20">
          <Button
            type="button"
            variant="admin-outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Button
            type="button"
            variant="admin"
            onClick={onConfirm}
            className="w-full sm:w-auto bg-gradient-to-r from-heritage-primary to-heritage-secondary hover:from-heritage-secondary hover:to-heritage-primary text-white shadow-lg shadow-heritage-primary/30 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Confirm & Add Hotel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddHotelModal;
