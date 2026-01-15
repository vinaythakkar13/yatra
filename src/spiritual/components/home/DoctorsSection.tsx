/**
 * Doctors / Hospital Service Section
 * Displays featured doctors with availability info
 */

'use client';

import React from 'react';
import { UserCircle2, CalendarClock, PhoneCall } from 'lucide-react';
import Container from '../common/Container';
import AnimatedSection from '../ui/AnimatedSection';

const doctors = [
    {
        name: 'Dr. Ajay Kumar',
        qualification: 'MBBS, MD – Cardiology',
        availability: 'Mon – Fri · 10:00 AM – 3:00 PM',
        room: 'Cardiac OPD – Block A',
    },
    {
        name: 'Dr. Neha Singh',
        qualification: 'BAMS – Ayurveda & Panchakarma',
        availability: 'Tue – Sat · 11:00 AM – 4:00 PM',
        room: 'Ayurveda Wing – Block C',
    },
    {
        name: 'Dr. Harleen Kaur',
        qualification: 'MS – Orthopaedics & Rehab',
        availability: 'Mon – Thu · 9:00 AM – 1:00 PM',
        room: 'Rehab Studio – Block B',
    },
];

export default function DoctorsSection() {
    return (
        <section className="py-16 bg-spiritual-zen-surface">
            <Container>
                <AnimatedSection animation="fadeInUp" className="text-center mb-12">
                    <p className="uppercase tracking-[0.5em] text-spiritual-saffron text-xs mb-3">Doctors & Clinics</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-spiritual-navy mb-4">Specialists Serving with Seva</h2>
                    <p className="text-spiritual-textLight max-w-3xl mx-auto">
                        Book appointments with our multidisciplinary team blending critical care, Ayurveda counselling, and community orthopaedic support.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-3 gap-6">
                    {doctors.map((doctor, idx) => (
                        <AnimatedSection key={doctor.name} animation="fadeInUp" delay={idx * 0.05}>
                            <div className="rounded-3xl border border-spiritual-zen-highlight shadow-xl bg-white/90 backdrop-blur p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-spiritual-zen-mist text-spiritual-zen-forest flex items-center justify-center">
                                        <UserCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-spiritual-navy">{doctor.name}</h3>
                                        <p className="text-sm text-spiritual-textLight">{doctor.qualification}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-spiritual-textLight">
                                    <CalendarClock className="w-4 h-4 text-spiritual-saffron" />
                                    <span>{doctor.availability}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-spiritual-textLight">
                                    <PhoneCall className="w-4 h-4 text-spiritual-saffron" />
                                    <span>{doctor.room}</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-3 py-1 rounded-full bg-spiritual-zen-mist text-xs text-spiritual-navy font-semibold uppercase tracking-wide">
                                        Walk-in tokens 30 mins prior
                                    </span>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </Container>
        </section>
    );
}


