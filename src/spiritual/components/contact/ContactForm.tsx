/**
 * Contact Form Component
 * With validation and API submission
 */

'use client';

import React, { useState } from 'react';
import { z, ZodError } from 'zod';
import Button from '../common/Button';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        honeypot: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Honeypot check
        if (formData.honeypot) {
            return; // Likely a bot
        }

        // Validate
        try {
            contactSchema.parse(formData);
            setErrors({});
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    const field = issue.path[0];
                    if (field) {
                        fieldErrors[field.toString()] = issue.message;
                    }
                });
                setErrors(fieldErrors);
                return;
            }
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/spiritual/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '', honeypot: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-spiritual-navy mb-2">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200 ${
                        errors.name 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-spiritual-zen-highlight focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20'
                    } focus:outline-none`}
                    placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.name}
                </p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-spiritual-navy mb-2">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200 ${
                        errors.email 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-spiritual-zen-highlight focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20'
                    } focus:outline-none`}
                    placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                </p>}
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-semibold text-spiritual-navy mb-2">
                    Message *
                </label>
                <textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200 resize-none ${
                        errors.message 
                            ? 'border-red-500 focus:border-red-500' 
                            : 'border-spiritual-zen-highlight focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20'
                    } focus:outline-none`}
                    placeholder="Tell us how we can help you..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {errors.message}
                </p>}
            </div>

            {/* Honeypot */}
            <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
            />

            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="p-4 bg-spiritual-sage/20 border-2 border-spiritual-sage/30 text-spiritual-sage rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Thank you! Your message has been received. We'll respond soon.</span>
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Sorry, there was an error sending your message. Please try again.</span>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-spiritual-saffron hover:bg-spiritual-saffronDark text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </span>
                )}
            </Button>
        </form>
    );
}
