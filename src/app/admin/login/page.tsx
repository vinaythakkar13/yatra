'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Shield, Mountain, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { tokenStorage, userStorage, yatraStorage } from '@/utils/storage';
import { useLoginMutation } from '@/services/authApi';
import { useLazyGetAllYatrasQuery } from '@/services/yatraApi';

interface AdminLoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // RTK Query admin login mutation hook
  const [login, { isLoading }] = useLoginMutation();

  // Fetch yatras query (triggered after login)
  const [fetchYatras] = useLazyGetAllYatrasQuery();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<AdminLoginForm>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Check if already logged in (only runs once on mount)
  useEffect(() => {
    // Ensure we're in the browser and router is ready
    if (typeof window === 'undefined') return;

    const token = tokenStorage.getAccessToken();
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSubmit = async (data: AdminLoginForm) => {
    try {
      clearErrors();

      // Validate email format
      if (!emailRegex.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Please enter a valid email address',
        });
        return;
      }

      // Call login mutation
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Handle successful login
      if (result.success && result.data) {
        const { token, user } = result.data;

        // Store token and user data
        await tokenStorage.setAccessToken(token);
        await userStorage.setUser(user);

        // Fetch yatras and select the nearest one
        try {
          const yatrasResult = await fetchYatras().unwrap();

          if (yatrasResult && yatrasResult?.length > 0) {
            const now = new Date();

            // Find the nearest yatra (prioritize: active > upcoming > most recent past)
            const nearestYatra = yatrasResult?.reduce((nearest, current) => {
              const nearestStartDate = new Date(nearest.start_date);
              const nearestEndDate = new Date(nearest.end_date);
              const currentStartDate = new Date(current.start_date);
              const currentEndDate = new Date(current.end_date);

              // Check if yatras are active (started but not ended)
              const nearestIsActive = nearestStartDate <= now && nearestEndDate >= now;
              const currentIsActive = currentStartDate <= now && currentEndDate >= now;

              // Prefer active yatras
              if (currentIsActive && !nearestIsActive) return current;
              if (!currentIsActive && nearestIsActive) return nearest;

              // If both active, prefer the one ending later
              if (currentIsActive && nearestIsActive) {
                return currentEndDate > nearestEndDate ? current : nearest;
              }

              // Check if yatras are upcoming
              const nearestIsUpcoming = nearestStartDate > now;
              const currentIsUpcoming = currentStartDate > now;

              // Prefer upcoming yatras over past ones
              if (currentIsUpcoming && !nearestIsUpcoming) return current;
              if (!currentIsUpcoming && nearestIsUpcoming) return nearest;

              // If both upcoming, prefer the one starting sooner
              if (currentIsUpcoming && nearestIsUpcoming) {
                return currentStartDate < nearestStartDate ? current : nearest;
              }

              // If both are past, prefer the most recent one
              return currentStartDate > nearestStartDate ? current : nearest;
            });

            // Store the selected yatra ID (UUID string)
            if (nearestYatra?.id) {
              yatraStorage.setSelectedYatraId(nearestYatra.id);
            }
          }
        } catch (yatraError) {
          console.error('[Yatra Selection] Error:', yatraError);
          // Don't block login if yatra selection fails
        }

        toast.success('Login successful! Redirecting...', {
          position: 'top-center',
        });
        router.push('/admin');
        return;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('[Login] Error:', error);

      // Handle different error types
      if (error?.data?.message) {
        setError('root', {
          type: 'manual',
          message: error.data.message,
        });
        toast.error(error.data.message, {
          position: 'top-center',
        });
      } else if (error?.message) {
        setError('root', {
          type: 'manual',
          message: error.message,
        });
        toast.error(error.message, {
          position: 'top-center',
        });
      } else {
        const errorMessage = 'Login failed. Please check your credentials and try again.';
        setError('root', {
          type: 'manual',
          message: errorMessage,
        });
        toast.error(errorMessage, {
          position: 'top-center',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-heritage-bgMain via-heritage-card to-heritage-highlight p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-heritage-maroon p-4 rounded-full shadow-lg">
              <Mountain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-heritage-maroon mb-2">Admin Login</h1>
          <p className="text-heritage-text">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-heritage-gold/30 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: emailRegex,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Email Address"
                  type="email"
                  placeholder="admin@yatra.com"
                  leftIcon={<Mail className="w-5 h-5 text-heritage-text/60" />}
                  error={errors.email?.message}
                  variant="admin"
                  disabled={isLoading}
                />
              )}
            />

            {/* Password Field */}
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
                <Input
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="w-5 h-5 text-heritage-text/60" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-heritage-text/60 hover:text-heritage-maroon transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  variant="admin"
                  disabled={isLoading}
                />
              )}
            />

            {/* Root Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full bg-heritage-maroon hover:bg-heritage-maroon/90 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              isLoading={isLoading}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-heritage-gold/30">
            <div className="flex items-start gap-3 text-sm text-heritage-text/70">
              <Shield className="w-4 h-4 text-heritage-maroon flex-shrink-0 mt-0.5" />
              <p>
                This is a secure admin area. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

