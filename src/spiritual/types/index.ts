/**
 * TypeScript Type Definitions for Spiritual Module
 */

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    visiting: boolean;
    photo: string;
    nextVisits: Visit[];
}

export interface Visit {
    date: string; // ISO date string
    time: string;
}

export interface Department {
    id: string;
    name: string;
    description: string;
    icon: string;
    services: string[];
}

export interface CharityProject {
    id: string;
    title: string;
    description: string;
    image: string;
    category: 'health' | 'education' | 'food' | 'shelter' | 'other';
    link?: string;
}

export interface OrganizationMember {
    id: string;
    name: string;
    role: string;
    period: string;
    photo: string;
    bio?: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    whatsappBroadcast: string;
}

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    cta?: {
        text: string;
        link: string;
    };
}

export interface ContactFormData {
    name: string;
    email: string;
    message: string;
    honeypot?: string;
}
