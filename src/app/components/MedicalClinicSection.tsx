'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Users, Clock, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Medical1 from '../../assets/images/activites/medical.jpeg';
import Medical2 from '../../assets/images/activites/medical_2.jpeg'
import Medical3 from '../../assets/images/activites/medical_3.jpeg'
import Clinic1 from '../../assets/images/activites/clinic.jpeg'
import Clinic2 from '../../assets/images/activites/clinic_2.jpeg'
import Clinic3 from '../../assets/images/activites/clinic_3.jpeg'
import Clinic4 from '../../assets/images/activites/clinic_4.jpeg'
interface MedicalStat {
    icon: React.ReactNode;
    value: string;
    label: string;
}

const medicalStats: MedicalStat[] = [
    {
        icon: <Stethoscope className="w-6 h-6" />,
        value: '50+',
        label: 'Doctors & Specialists',
    },
    {
        icon: <Users className="w-6 h-6" />,
        value: '100K+',
        label: 'Patients Treated Yearly',
    },
    {
        icon: <Clock className="w-6 h-6" />,
        value: '24/7',
        label: 'Emergency Services',
    },
];

const medicalImages = [
    Medical1,
    Medical2,
    Medical3,
    Clinic1,
    Clinic2,
    Clinic3,
    Clinic4,
];

export default function MedicalClinicSection() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-spiritual-saffron/5 to-spiritual-zen-forest/5 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-80 h-80 md:w-96 md:h-96 bg-spiritual-saffron/8 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 md:w-80 md:h-80 bg-spiritual-zen-forest/8 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
                        <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-spiritual-saffron to-spiritual-zen-accent rounded-full" />
                        <span className="text-spiritual-saffron font-bold uppercase tracking-widest text-xs md:text-sm">
                            💊 Medical & Healthcare
                        </span>
                        <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-spiritual-zen-accent to-spiritual-saffron rounded-full" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-spiritual-navy mb-3 md:mb-4">
                        Compassionate Healthcare for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-spiritual-saffron to-spiritual-zen-accent">Every Soul</span>
                    </h2>
                    <p className="text-sm md:text-lg lg:text-xl text-spiritual-textLight max-w-3xl mx-auto leading-relaxed">
                        Our world-class medical facilities combine modern medicine with traditional wisdom to provide holistic healing.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center">
                    {/* Left Side - Image Carousel */}
                    <div className="relative group w-full overflow-hidden">
                        {/* Swiper Container */}
                        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border-4 border-spiritual-saffron/20 group-hover:border-spiritual-saffron/60 transition-all duration-500 shadow-lg hover:shadow-2xl">
                            <Swiper
                                modules={[Autoplay, EffectFade, Navigation]}
                                effect="fade"
                                observer={true}
                                observeParents={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                fadeEffect={{
                                    crossFade: true,
                                }}
                                navigation={{
                                    prevEl: '.medical-prev',
                                    nextEl: '.medical-next',
                                }}
                                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                            >
                                {medicalImages.map((image, idx) => (
                                    <SwiperSlide key={idx}>
                                        <Image
                                            src={image}
                                            alt={`Medical & Clinic ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={idx === 0}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            className="medical-prev absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/85 backdrop-blur-md hover:bg-white border border-white/60 flex items-center justify-center text-spiritual-saffron transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl cursor-pointer hover:-translate-x-1"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        <button
                            className="medical-next absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/85 backdrop-blur-md hover:bg-white border border-white/60 flex items-center justify-center text-spiritual-saffron transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl cursor-pointer hover:translate-x-1"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                    </div>

                    {/* Right Side - Stats & Description */}
                    <div className="space-y-6 md:space-y-8 w-full">
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-spiritual-navy">
                                Advanced Medical Care
                            </h3>
                            <p className="text-spiritual-textLight leading-relaxed text-sm md:text-base lg:text-lg">
                                Hospital is a beacon of hope with cutting-edge medical facilities, experienced specialists, and a commitment to serve every soul. From emergency care to specialized surgeries, no one is left behind.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {medicalStats?.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white to-spiritual-zen-surface rounded-xl md:rounded-2xl p-3 md:p-5 lg:p-6 text-center border border-spiritual-zen-highlight/40 hover:border-spiritual-saffron/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
                                >
                                    <div className="flex justify-center mb-2 md:mb-3 text-spiritual-saffron group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </div>
                                    <p className="text-base md:text-xl lg:text-2xl font-bold text-spiritual-navy">{stat.value}</p>
                                    <p className="text-xs md:text-sm text-spiritual-textLight mt-1 md:mt-2 leading-snug">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button with Animation */}
                        <button
                            onClick={() => router.push('/spiritual/about')}
                            className="group relative w-full md:w-auto mt-6 lg:mt-8 inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-spiritual-saffron to-spiritual-zen-accent hover:from-spiritual-zen-accent hover:to-spiritual-saffron text-white rounded-full px-6 md:px-8 lg:px-10 py-3 md:py-4 font-semibold uppercase tracking-widest text-xs md:text-sm shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Learn More
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
