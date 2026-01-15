/**
 * QR Code Join Component
 * Displays QR code for WhatsApp Broadcast channel
 */

'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import contactData from '../../data/contact.json';

export default function QRCodeJoin() {
    return (
        <div className="bg-gradient-to-br from-spiritual-zen-mist to-spiritual-creamLight rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 md:p-10 text-center relative overflow-hidden group">
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-spiritual-saffron/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-spiritual-saffron rounded-full" />
                    <h3 className="text-2xl md:text-3xl font-bold text-spiritual-navy">
                Join Our WhatsApp Broadcast
            </h3>
                    <div className="w-1 h-6 bg-spiritual-saffron rounded-full" />
                </div>
                <p className="text-spiritual-textLight mb-8 text-base md:text-lg">
                Stay updated with our latest seva activities and events
            </p>

            {/* QR Code */}
                <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-spiritual-zen-highlight mb-6">
                <QRCodeSVG
                    value={contactData.whatsappBroadcast}
                    size={200}
                    level="H"
                    includeMargin={true}
                />
            </div>

                <p className="mb-6 text-sm md:text-base text-spiritual-textLight font-medium">
                Scan this code with your phone to join
            </p>

            {/* Direct Link */}
            <a
                href={contactData.whatsappBroadcast}
                target="_blank"
                rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                Open in WhatsApp
            </a>
            </div>
        </div>
    );
}
