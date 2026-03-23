'use client';

import React from 'react';
import RegisterClient from '@/app/register/components/RegisterClient';

/**
 * Admin Registration Page
 * 
 * Renders the same registration flow as the public site but in admin mode.
 * Admin mode features:
 * - Gets Yatra ID from localStorage instead of URL params
 * - Uses 'split registration' API which doesn't require pre-existing user
 * - Shows 'Tatkaal' checkbox instead of 'Flight'
 */
export default function AdminRegisterPage() {
  return (
    <div className="animate-fade-in -m-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <RegisterClient isAdminMode={true} />
      </div>
    </div>
  );
}
