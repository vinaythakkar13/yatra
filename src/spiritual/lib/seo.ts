/**
 * SEO utility functions for metadata generation
 */

import type { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: 'website' | 'article';
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://santseva.org';
const SITE_NAME = 'Sant Seva Charitable Trust';

export function generateSEO({
    title,
    description,
    path,
    image = '/images/spiritual/og-default.jpg',
    type = 'website',
}: SEOProps): Metadata {
    const url = `${SITE_URL}${path}`;
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: `${SITE_URL}${image}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [`${SITE_URL}${image}`],
        },
        alternates: {
            canonical: url,
        },
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/spiritual/logo.png`,
        description:
            'A Sikh charitable organization dedicated to serving humanity through free healthcare, education, and community kitchen services.',
        foundingDate: '1985',
        sameAs: [
            'https://facebook.com/santseva',
            'https://instagram.com/santseva',
            'https://youtube.com/@santseva',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-183-2500123',
            contactType: 'Customer Service',
            email: 'contact@santseva.org',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Village Nangal',
            addressLocality: 'Amritsar',
            addressRegion: 'Punjab',
            postalCode: '143001',
            addressCountry: 'IN',
        },
    };
}

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalClinic',
        name: 'Sewa Hospital - Sant Seva Charitable Trust',
        url: `${SITE_URL}/spiritual/charity/hospital`,
        image: `${SITE_URL}/images/spiritual/charity/hospital.jpg`,
        description:
            'Free medical clinic providing healthcare services to underprivileged communities.',
        telephone: '+91-183-2500123',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Village Nangal',
            addressLocality: 'Amritsar',
            addressRegion: 'Punjab',
            postalCode: '143001',
            addressCountry: 'IN',
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '07:00',
            closes: '19:00',
        },
        priceRange: 'Free',
    };
}
