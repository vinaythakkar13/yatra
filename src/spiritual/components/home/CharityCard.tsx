/**
 * Charity Card Component
 * Displays charity project information with image and links
 */

import React from 'react';
import Link from 'next/link';
import SkeletonImage from '../ui/SkeletonImage';
import type { CharityProject } from '../../types';

interface CharityCardProps {
    project: CharityProject;
}

export default function CharityCard({ project }: CharityCardProps) {
    const categoryColors = {
        health: 'bg-green-100 text-green-800',
        education: 'bg-blue-100 text-blue-800',
        food: 'bg-orange-100 text-orange-800',
        shelter: 'bg-purple-100 text-purple-800',
        other: 'bg-gray-100 text-gray-800',
    };

    const content = (
        <div className="group h-full bg-spiritual-zen-mist rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <SkeletonImage
                    src={project.image}
                    alt={project.title}
                    fill={true}
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300 h-full w-full object-cover"
                />

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[project.category]}`}>
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-spiritual-navy mb-2 group-hover:text-spiritual-saffron transition-colors">
                    {project.title}
                </h3>
                <p className="text-spiritual-textLight leading-relaxed line-clamp-3">
                    {project.description}
                </p>

                {project.link && (
                    <div className="mt-4 flex items-center gap-2 text-spiritual-saffron font-medium">
                        <span>Learn More</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    if (project.link) {
        return <Link href={project.link}>{content}</Link>;
    }

    return content;
}
