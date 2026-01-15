'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import Head from 'next/head';
import { Eye, EyeOff, Mail, Lock, Shield, Mountain, Loader2, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';

interface AdminLoginForm {
  email: string;
  password: string;
}


export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<AdminLoginForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  // Email validation regex
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // Mock authentication API
  const authenticateAdmin = async (email: string, password: string): Promise<{ success: boolean; token?: string; message?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock admin credentials
    const validAdmins = [
      { email: 'admin@yatra.com', password: 'admin123' },
      { email: 'admin@example.com', password: 'password123' },
    ];

    const admin = validAdmins.find(
      (a) => a.email === email && a.password === password
    );

    if (admin) {
      // Generate mock token
      const token = `admin_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { success: true, token };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);

    try {
      const result = await authenticateAdmin(data.email, data.password);

      if (result.success && result.token) {
        // Store token and admin user
        localStorage.setItem('adminAccessToken', result.token);
        
        const adminUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: data.email,
          isAdmin: true,
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));

        // Success toast
        toast.success('🎉 Login successful! Redirecting to admin panel...', {
          position: 'top-center',
        });

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        // Error toast
        toast.error(result.message || 'Authentication failed', {
          position: 'top-center',
        });

        setError('password', {
          type: 'manual',
          message: result.message,
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Yatra Management System</title>
        <meta name="description" content="Secure admin login for Yatra Management System. Manage registrations, hotels, and reports." />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-md animate-fade-in">
          {/* Logo and Title */}
          {/* <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-2xl mb-4 animate-scale-in">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Mountain className="w-4 h-4" />
              Yatra Management System
            </p>
          </div> */}

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10 backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email address is required',
                    validate: (value) => {
                      const lowercase = value.toLowerCase();
                      if (!emailRegex.test(lowercase)) {
                        return 'Please enter a valid email address';
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          {...field}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="admin@yatra.com"
                          disabled={isLoading}
                          onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                          className={`
                            w-full pl-12 pr-4 py-3.5 
                            text-gray-800 placeholder-gray-400
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-primary-200
                            transition-all duration-200
                            ${errors.email 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-300 focus:border-primary-500'
                            }
                            ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                          `}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-down">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Password Input */}
              <div>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          disabled={isLoading}
                          className={`
                            w-full pl-12 pr-12 py-3.5
                            text-gray-800 placeholder-gray-400
                            border-2 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-primary-200
                            transition-all duration-200
                            ${errors.password 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-300 focus:border-primary-500'
                            }
                            ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                          `}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center animate-slide-down">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isValid}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Login to Admin Panel
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-600" />
                  Demo Credentials
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>Email:</strong> admin@yatra.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

