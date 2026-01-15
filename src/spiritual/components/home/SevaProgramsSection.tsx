/**
 * Charity & Donation Programs Section
 * Highlights primary seva initiatives with calm cards
 */

'use client';

import React from 'react';
import { HandHeart, Eye, Activity, GraduationCap } from 'lucide-react';
import Container from '../common/Container';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../common/Button';

const programs = [
    {
        title: 'Support Seva Fund',
        description: 'Sponsor medical aid, ambulance fuel, blood bank supplies, and patient meals for underserved families.',
        icon: <HandHeart className="w-6 h-6" />,
        impact: '₹1,500 / week sustains 12 beds',
    },
    {
        title: 'Free Medical Camps',
        description: 'Monthly multi-city clinics delivering ECG, diagnostics, and pharmacy kits with zero billing.',
        icon: <Eye className="w-6 h-6" />,
        impact: '3,200+ patients treated every month',
    },
    {
        title: 'Eye Checkup & Cataract Drive',
        description: 'Comprehensive retina scan bus, laser suite access, and post-op rehabilitation at our seva hospital.',
        icon: <Activity className="w-6 h-6" />,
        impact: '400 surgeries completed each quarter',
    },
    {
        title: 'Langar & Education Support',
        description: 'Daily langar meals plus tuition, notebooks, and devices for first-gen learners.',
        icon: <GraduationCap className="w-6 h-6" />,
        impact: '1,200 students receive yearly scholarships',
    },
];

export default function SevaProgramsSection() {
    return (
        <section className="py-16 bg-spiritual-zen-mist/60">
            <Container>
                <AnimatedSection animation="fadeInUp" className="text-center max-w-3xl mx-auto mb-12">
                    <p className="uppercase tracking-[0.5em] text-spiritual-saffron text-xs mb-3">Charity & Donation</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-spiritual-navy mb-4">Fund Life-Changing Seva</h2>
                    <p className="text-spiritual-textLight">
                        Every contribution keeps our hospital beds operational, langar kitchens warm, and classrooms inclusive.
                    </p>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {programs.map((program, idx) => (
                        <AnimatedSection key={program.title} animation="fadeInUp" delay={idx * 0.05}>
                            <div className="h-full rounded-3xl bg-white shadow-xl border border-spiritual-zen-highlight p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-spiritual-zen-mist text-spiritual-zen-forest flex items-center justify-center">
                                    {program.icon}
                                </div>
                                <h3 className="text-xl font-bold text-spiritual-navy">{program.title}</h3>
                                <p className="text-sm text-spiritual-textLight flex-1">{program.description}</p>
                                <p className="text-xs font-semibold text-spiritual-saffron">{program.impact}</p>
                                <Button
                                    variant="outline"
                                    className="border-spiritual-zen-forest text-spiritual-zen-forest hover:bg-spiritual-zen-forest hover:text-white rounded-full px-4 py-2 text-xs uppercase tracking-widest"
                                >
                                    Contribute
                                </Button>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </Container>
        </section>
    );
}


