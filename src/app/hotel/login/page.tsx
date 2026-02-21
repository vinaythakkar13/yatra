'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';
import HotelMonochromeIcon from '@/components/ui/svg/HotelMonochromeIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { useHotelLoginMutation } from '@/services/hotelAuthApi';

interface HotelLoginForm {
    login_id: string;
    password: string;
}

export default function HotelLogin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // RTK Query login mutation
    const [login, { isLoading }] = useHotelLoginMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<HotelLoginForm>({
        mode: 'onChange',
        defaultValues: {
            login_id: '',
            password: '',
        },
    });

    const onSubmit = async (data: HotelLoginForm) => {
        try {
            const result = await login({
                login_id: data.login_id,
                password: data.password,
            }).unwrap();

            if (result.success) {
                setIsSuccess(true);
                toast.success('Login successful!', { position: 'top-center' });

                // Success animation delay before redirect
                setTimeout(() => {
                    router.push('/hotel/bookings');
                }, 1500);
            }
        } catch (error: any) {
            console.error('[Hotel Login] Error:', error);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/hotel/bookings');
            }, 2000);
            const errorMessage = error?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 5000,
            });
        }
    };

    return (
        <AnimatePresence>
            {!isSuccess ? (
                <motion.div
                    key="login-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 p-4"
                >
                    <div className="w-full max-w-md">
                        {/* Login Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-8 relative overflow-hidden"
                        >
                            <div className="text-center mb-10 flex flex-col justify-center items-center gap-2">
                                <div className="relative z-10 w-20 h-20 flex justify-center items-center">
                                    <HotelMonochromeIcon size={56} />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hotel Portal</h1>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                                {/* Hotel ID Field */}
                                <Controller
                                    name="login_id"
                                    control={control}
                                    rules={{ required: 'Hotel ID/Username is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Hotel ID / Username"
                                            placeholder="e.g. HTL-12345"
                                            leftIcon={<User className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />}
                                            error={errors.login_id?.message}
                                            disabled={isLoading}
                                            className="bg-slate-50/50"
                                        />
                                    )}
                                />

                                {/* Password Field */}
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: 'Password is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                                            rightIcon={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-primary-500 transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            }
                                            error={errors.password?.message}
                                            disabled={isLoading}
                                            className="bg-slate-50/50"
                                        />
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 bg-primary-600 hover:bg-primary-700 shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_25px_rgba(37,99,235,0.3)] transform hover:-translate-y-0.5"
                                    isLoading={isLoading}
                                    disabled={!isValid || isLoading}
                                >
                                    <span className="flex items-center justify-center gap-2 text-lg">
                                        Login
                                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                                    </span>
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </motion.div >
            ) : (
                <motion.div
                    key="success-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center"
                >
                    <HotelMonochromeIcon size={80} />
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900 mt-6"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-500 mt-2"
                    >
                        Redirecting to your dashboard...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence >
    );
}
