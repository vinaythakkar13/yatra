/**
 * Error Boundary Component
 * Catches React errors and displays a spiritual-themed fallback UI
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-spiritual-cream flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        {/* Spiritual Symbol */}
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-spiritual-saffron to-spiritual-gold flex items-center justify-center">
                                <span className="text-5xl">🙏</span>
                            </div>
                        </div>

                        {/* Message */}
                        <h1 className="text-3xl font-bold text-spiritual-navy mb-3">
                            Something Went Wrong
                        </h1>
                        <p className="text-spiritual-textLight mb-6">
                            We apologize for the inconvenience. Please try again or return to the homepage.
                        </p>

                        {/* Error details in development */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-mono text-left">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-spiritual-saffron text-white rounded-lg hover:bg-spiritual-gold transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <a
                                href="/spiritual"
                                className="px-6 py-3 bg-spiritual-navy text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                            >
                                Go Home
                            </a>
                        </div>

                        {/* Spiritual Message */}
                        <p className="mt-8 text-sm text-spiritual-textLight italic">
                            "Through patience and humility, all obstacles are overcome."
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
