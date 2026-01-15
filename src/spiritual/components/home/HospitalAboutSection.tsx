/**
 * Hospital & About Section
 * Highlights clinical services, departments, and availability
 */

'use client';

import React from 'react';
import { HeartPulse, Stethoscope, Activity, Hospital, Clock3 } from 'lucide-react';
import Container from '../common/Container';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../common/Button';

const serviceHighlights = [
    {
        icon: <HeartPulse className="w-5 h-5" />,
        title: 'Integrated Care',
        description: '24/7 emergency, OT, dialysis, NICU & mobile medical vans.',
    },
    {
        icon: <Stethoscope className="w-5 h-5" />,
        title: 'Ayurveda + Modern Medicine',
        description: 'Dedicated Ayurveda wing complements cardiology, ortho & paediatrics.',
    },
    {
        icon: <Activity className="w-5 h-5" />,
        title: 'Preventive Clinics',
        description: 'Weekly eye camps, blood donation drives, and women wellness clinics.',
    },
];

const departments = ['Cardiology', 'Ayurveda', 'Orthopaedics', 'Diabetology', 'Physiotherapy', 'Radiology'];

const schedule = [
    { day: 'Mon – Fri', focus: 'Outpatient, Diagnostics & OT', time: '7:00 AM – 9:00 PM' },
    { day: 'Sat', focus: 'Ayurveda Consultations, Langar Nutrition', time: '8:00 AM – 4:00 PM' },
    { day: 'Sun', focus: 'Community Screening Camps', time: '8:00 AM – 1:00 PM' },
];

const specialistRoster = [
    { name: 'Dr. Ajay Kumar', degree: 'MBBS, MD – Cardiology', note: 'Mon–Fri • 10 AM – 3 PM' },
    { name: 'Dr. Neha Singh', degree: 'BAMS – Ayurveda', note: 'Tue–Sat • 11 AM – 4 PM' },
    { name: 'Dr. Harleen Kaur', degree: 'MS – Orthopaedics', note: 'Mon–Thu • 9 AM – 1 PM' },
];

export default function HospitalAboutSection() {
    return (
        <section className="py-16 md:py-20 bg-spiritual-zen-surface">
            <Container>
                <AnimatedSection animation="fadeInUp" className="text-center max-w-3xl mx-auto mb-12">
                    <p className="uppercase tracking-[0.5em] text-spiritual-saffron text-xs mb-3">About Our Seva Hospital</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-spiritual-navy mb-4">Spiritual Care. Clinical Excellence.</h2>
                    <p className="text-spiritual-textLight">
                        Sant Seva Charitable Hospital serves as a healing sanctuary—combining medical precision, Ayurveda wisdom, and seva-driven hospitality.
                    </p>
                </AnimatedSection>

                {/* Highlights */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {serviceHighlights.map((item) => (
                        <AnimatedSection key={item.title} animation="fadeInUp">
                            <div className="rounded-3xl border border-spiritual-zen-highlight shadow-lg bg-white/80 backdrop-blur p-6 flex flex-col gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-spiritual-zen-mist text-spiritual-zen-forest flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-spiritual-navy">{item.title}</h3>
                                <p className="text-spiritual-textLight text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <AnimatedSection animation="fadeInUp">
                        <div className="rounded-3xl border border-spiritual-zen-highlight shadow-xl bg-white/90 backdrop-blur p-10 flex flex-col gap-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-spiritual-saffron mb-2">Departments</p>
                                <h3 className="text-2xl font-bold text-spiritual-navy mb-3">Specialised care wings</h3>
                                <p className="text-spiritual-textLight">
                                    Our campus integrates surgical theatres, digital labs, palliative wards, and meditation spaces to nurture body & soul.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {departments.map((dept) => (
                                    <span key={dept} className="px-4 py-2 rounded-full bg-spiritual-zen-mist text-spiritual-navy text-sm font-medium">
                                        {dept}
                                    </span>
                                ))}
                            </div>
                            <div className="rounded-2xl border border-dashed border-spiritual-zen-highlight p-5 bg-spiritual-zen-surface">
                                <p className="text-xs uppercase tracking-[0.5em] text-spiritual-saffron mb-2">Clinical Leadership</p>
                                <ul className="space-y-3">
                                    {specialistRoster.map((doctor) => (
                                        <li key={doctor.name} className="flex flex-col">
                                            <span className="text-sm font-semibold text-spiritual-navy">{doctor.name}</span>
                                            <span className="text-xs text-spiritual-textLight">{doctor.degree}</span>
                                            <span className="text-xs text-spiritual-textLight/80">{doctor.note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeInUp" delay={0.1}>
                        <div className="rounded-3xl border border-spiritual-zen-highlight shadow-xl bg-white/90 backdrop-blur p-10 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <Hospital className="w-8 h-8 text-spiritual-saffron" />
                                <div>
                                    <h3 className="text-2xl font-bold text-spiritual-navy">Visiting Hours & Camps</h3>
                                    <p className="text-sm text-spiritual-textLight">Walk-in OPD tokens open 30 minutes before clinic hours.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {schedule.map((slot) => (
                                    <div key={slot.day} className="flex items-start gap-4 border-b border-spiritual-zen-highlight/60 pb-4 last:border-0 last:pb-0">
                                        <Clock3 className="w-5 h-5 text-spiritual-saffron mt-1" />
                                        <div>
                                            <p className="text-sm font-semibold text-spiritual-navy">{slot.day}</p>
                                            <p className="text-sm text-spiritual-textLight">{slot.focus}</p>
                                            <p className="text-xs text-spiritual-textLight/80">{slot.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="primary"
                                className="self-start bg-spiritual-zen-forest text-white hover:bg-spiritual-saffronDark rounded-full px-8 py-4 uppercase tracking-wider text-sm font-semibold"
                            >
                                Book a hospital visit
                            </Button>
                        </div>
                    </AnimatedSection>
                </div>
            </Container>
        </section>
    );
}


