import React, { useState } from 'react';
import { X, Check, Copy, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '@/components/ui/Button';
import { BsWhatsapp } from 'react-icons/bs';

interface Credentials {
    hotel_id: string;
    hotel_name: string;
    login_id: string;
    password: string;
}

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    credentials: Credentials | null;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose, credentials }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<'login_id' | 'password' | null>(null);

    if (!isOpen || !credentials) return null;

    const copyToClipboard = async (text: string, field: 'login_id' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            // toast.success(`${field === 'login_id' ? 'Login ID' : 'Password'} copied!`);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            toast.error('Failed to copy to clipboard.');
        }
    };

    const handleSendWhatsApp = () => {
        // This functionality depends on having the manager's contact number, 
        // which might need to be passed down or handled by a parent callback if not in credentials.
        // Assuming for now we copy the logic from HotelCard or this just formats the message
        // and lets the user pick the contact if not available directly.
        // Since we don't have the contact here, we might need to strictly use the prop if passed,
        // or just open with text.
        // *Correction*: The original HotelCard had `hotel.manager_contact`. 
        // We should probably just format the text here and let `HotelCard` handle the actual sending 
        // OR pass the contact number to this modal. 
        // For now, let's implement the message formatting and `window.open` here IF we have the number,
        // but `credentials` object generally doesn't have it.
        // Let's assume we can't send WA without the number. 
        // *Better approach*: formatting the message is fine, but we need the number. 
        // I will add `managerContact` to props to keep it clean.

        // Check below for `handleSendWhatsApp` prop in the component definition.
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-inter">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in scale-100 transition-all">
                {/* Header - Dark Teal */}
                <div className="bg-[#0F5A5A] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-tight">Hotel Credentials</h3>
                            <p className="text-white/60 text-xs mt-0.5 font-medium">{credentials.hotel_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Warning Banner - Beige */}
                <div className="bg-[#FFF8F0] border-b border-[#F5E6D8] px-6 py-3 flex items-start gap-3">
                    <div className="text-[#D97706] mt-0.5">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-[#92400E] text-xs font-medium leading-relaxed">
                        Save the password now — it will <strong className="font-bold">not be shown again</strong> after closing this dialog.
                    </p>
                </div>

                {/* Credentials Form */}
                <div className="px-6 py-6 space-y-5">
                    {/* Login ID */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block pl-1">
                            Login ID
                        </label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-[#0F5A5A] focus-within:ring-1 focus-within:ring-[#0F5A5A]/20 transition-all">
                            <span className="font-mono font-bold text-[#0F5A5A] text-lg flex-1 tracking-wider selected-none">
                                {credentials.login_id}
                            </span>
                            <button
                                onClick={() => copyToClipboard(credentials.login_id, 'login_id')}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-[#0F5A5A]"
                                title="Copy Login ID"
                            >
                                {copiedField === 'login_id' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block pl-1">
                            Password
                        </label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 group focus-within:border-[#0F5A5A] focus-within:ring-1 focus-within:ring-[#0F5A5A]/20 transition-all">
                            <span className="font-mono font-bold text-slate-700 text-lg flex-1 tracking-wider">
                                {showPassword ? credentials.password : '•'.repeat(Math.min(credentials.password.length, 12))}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(credentials.password, 'password')}
                                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-[#0F5A5A]"
                                    title="Copy Password"
                                >
                                    {copiedField === 'password' ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-4">
                    {/* We need a prop for onSendWhatsApp or handling it here. 
               Since the user request image shows "Send via WhatsApp" as a primary action, 
               I'll emit an event or handle it if passed. 
               Let's update props interface to accept `onSendWhatsApp`.
           */}
                    <div className="flex-1">
                        {/* Placeholder for the external action if needed, or pass it in. 
                     For now, I'll update the component to accept `onSendWhatsApp`.
                 */}
                    </div>
                </div>
            </div>
        </div>
    );
};
// I realized I need to restructure to match the provided image exactly: 
// The image has a large green "Send via WhatsApp" button and a small "Close" text button. 

export interface CredentialsModalPropsFinal {
    isOpen: boolean;
    onClose: () => void;
    credentials: Credentials | null;
    onSendWhatsApp: () => void;
}

const CredentialsModalFinal: React.FC<CredentialsModalPropsFinal> = ({ isOpen, onClose, credentials, onSendWhatsApp }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<'login_id' | 'password' | null>(null);

    if (!isOpen || !credentials) return null;

    const copyToClipboard = async (text: string, field: 'login_id' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            toast.error('Failed to copy to clipboard.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-inter">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-fade-in scale-100 transition-all">

                {/* Header */}
                <div className="bg-[#115E59] px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">Hotel Credentials</h3>
                            <p className="text-teal-100 text-xs mt-0.5 font-medium opacity-80">{credentials.hotel_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Warning */}
                <div className="bg-[#FFF7ED] px-6 py-4 flex gap-3 items-start border-b border-[#FFEDD5]">
                    <svg className="w-5 h-5 text-[#D97706] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#9A3412] text-xs font-medium leading-relaxed">
                        Save the password now — it will not be shown again after closing this dialog.
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Login ID</label>
                        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl flex items-center p-1.5 pl-4">
                            <span className="flex-1 font-mono font-bold text-[#115E59] text-lg">{credentials.login_id}</span>
                            <button
                                onClick={() => copyToClipboard(credentials.login_id, 'login_id')}
                                className="p-2 text-gray-400 hover:text-[#115E59] hover:bg-white rounded-lg transition-all"
                            >
                                {copiedField === 'login_id' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Password</label>
                        <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl flex items-center p-1.5 pl-4">
                            <span className="flex-1 font-mono font-bold text-gray-700 text-lg">
                                {showPassword ? credentials.password : '•'.repeat(Math.min(credentials.password.length, 12))}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(credentials.password, 'password')}
                                    className="p-2 text-gray-400 hover:text-[#115E59] hover:bg-white rounded-lg transition-all"
                                >
                                    {copiedField === 'password' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center gap-4">
                    <button
                        onClick={onSendWhatsApp}
                        className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20 active:scale-[0.98]"
                    >
                        <BsWhatsapp className="w-5 h-5" />
                        <span>Send via WhatsApp</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-3 text-gray-500 font-semibold hover:text-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CredentialsModalFinal;
