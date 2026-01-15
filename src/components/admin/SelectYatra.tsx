'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactSelect from 'react-dropdown-select';
import { Calendar, MapPin, Users as UsersIcon, ChevronDown, Loader2 } from 'lucide-react';
import moment from 'moment';
import { useGetAllYatrasQuery } from '@/services/yatraApi';
import { Yatra } from '@/types';
import { yatraStorage } from '@/utils/storage';

export interface YatraOption {
    id: string; // UUID string from API
    title: string;
    startDate: string;
    endDate: string;
    location?: string;
    capacity?: number;
}

interface SelectYatraProps {
    value?: string; // UUID string
    onChange?: (yatra: YatraOption | null) => void;
    className?: string;
}

const SelectYatra: React.FC<SelectYatraProps> = ({ value, onChange, className = '' }) => {
    // Fetch yatras from API
    const { data: yatras = [], isLoading, error } = useGetAllYatrasQuery();

    // Transform API yatras to component format - memoized to prevent infinite loops
    const yatraOptions: YatraOption[] = useMemo(() => {
        return yatras.map((yatra: Yatra) => ({
            id: yatra.id, // Use the actual UUID string from API
            title: yatra.name,
            startDate: yatra.start_date,
            endDate: yatra.end_date,
            location: yatra.description,
        }));
    }, [yatras]);

    const [selectedYatra, setSelectedYatra] = useState<YatraOption | null>(null);

    // Update selected yatra when value prop or yatras data changes
    useEffect(() => {
        if (value !== undefined && yatraOptions.length > 0) {
            const yatra = value ? yatraOptions.find(y => y.id === value) || null : null;
            // Only update state if the yatra actually changed (prevents infinite loops)
            setSelectedYatra(prev => {
                if (prev?.id === yatra?.id) {
                    return prev; // Return same reference to prevent re-render
                }
                return yatra;
            });
        } else if (value === null) {
            // Clear selection if value is explicitly null
            setSelectedYatra(prev => prev !== null ? null : prev);
        } else if (value === undefined && yatraOptions.length > 0) {
            // If value is undefined, try to load from localStorage (fallback)
            const persistedId = yatraStorage.getSelectedYatraId();
            if (persistedId && !selectedYatra) {
                const persistedYatra = yatraOptions.find(y => y.id === persistedId);
                if (persistedYatra) {
                    setSelectedYatra(persistedYatra);
                }
            }
        }
    }, [value, yatraOptions]);

    const handleChange = (values: YatraOption[]) => {
        const selected = values.length > 0 ? values[0] : null;
        setSelectedYatra(selected);
        onChange?.(selected ?? null);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className={`w-full max-w-md font-inter ${className}`}>
                <div className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-heritage-gold/30 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-heritage-text/60 animate-spin" />
                    <span className="text-sm text-heritage-text/60 font-medium">Loading yatras...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className={`w-full max-w-md font-inter ${className}`}>
                <div className="w-full px-4 py-2 bg-red-50 backdrop-blur-sm rounded-xl border border-red-200 flex items-center gap-3">
                    <span className="text-sm text-red-600 font-medium">Failed to load yatras</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-md font-inter ${className}`}>
            <ReactSelect
                options={yatraOptions}
                values={selectedYatra ? [selectedYatra] : []}
                onChange={handleChange}
                placeholder="Select a Yatra"
                searchable={true}
                clearable={true}
                labelField="title"
                valueField="id"
                wrapperClassName="yatra-selector"
                dropdownPosition="auto"
                closeOnClickInput={true}
                className="relative"
                style={{
                    border: '1px solid #C8A55C',
                    borderRadius: '12px',
                    minHeight: '56px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    width: '100%',
                }}
                contentRenderer={({ state }) => (
                    <div className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl hover:border-heritage-gold/50 transition-all duration-300 cursor-pointer">
                        {state.values.length > 0 ? (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-md">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-heritage-textDark truncate">
                                        {state.values[0].title}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-heritage-text/70 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {moment(state.values[0].startDate).format('MMM DD')} - {moment(state.values[0].endDate).format('MMM DD, YYYY')}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown className="w-5 h-5 text-heritage-text/60 flex-shrink-0" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 p-2.5 rounded-lg bg-heritage-highlight/30 border border-heritage-gold/20">
                                    <Calendar className="w-5 h-5 text-heritage-text/50" />
                                </div>
                                <span className="text-sm text-heritage-text/60 font-medium">Select a Yatra</span>
                                <ChevronDown className="w-5 h-5 text-heritage-text/40 ml-auto" />
                            </div>
                        )}
                    </div>
                )}
                dropdownRenderer={({ props, state, methods }) => {
                    const regexp = new RegExp(state.search, 'i');
                    const filtered = props.options.filter((item: YatraOption) =>
                        regexp.test(item.title) || regexp.test(item.location || '')
                    );

                    return (
                        <div className="bg-white/95 backdrop-blur-xl border-2 rounded-xl shadow-glass mt-2 max-h-96 overflow-hidden animate-fade-in">
                            {/* Search Input */}
                            <div className="p-3 border-b bg-heritage-highlight/10 sticky top-0 backdrop-blur-sm">
                                <input
                                    type="text"
                                    value={state.search}
                                    onChange={methods.setSearch}
                                    placeholder="Search yatras..."
                                    className="w-full px-4 py-2.5 border-2 border-heritage-gold/30 rounded-lg focus:outline-none focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20 text-sm text-heritage-textDark placeholder:text-heritage-text/50 transition-all"
                                />
                            </div>

                            {/* Options List */}
                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-heritage-primary/40 scrollbar-track-heritage-highlight/30">
                                {filtered.length > 0 ? (
                                    <div className="p-2">
                                        {filtered.map((yatra: YatraOption) => {
                                            const isSelected = state.values.some(v => v.id === yatra.id);
                                            return (
                                                <div
                                                    key={yatra.id}
                                                    onClick={() => methods.addItem(yatra)}
                                                    className={`
                                                        group relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2
                                                        ${isSelected
                                                            ? 'bg-gradient-to-br from-kesari-light/20 to-kesari-dark/20 border-2 border-kesari-dark/50 shadow-md'
                                                            : 'bg-white/60 border-2 border-heritage-gold/20 hover:border-heritage-gold/50 hover:bg-heritage-highlight/30 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Icon */}
                                                        <div className={`
                                                            flex-shrink-0 p-2 rounded-lg transition-all duration-200
                                                            ${isSelected
                                                                ? 'bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-md'
                                                                : 'bg-heritage-highlight/40 text-heritage-primary group-hover:bg-heritage-primary/20'
                                                            }
                                                        `}>
                                                            <Calendar className="w-4 h-4" />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className={`
                                                                text-sm font-bold mb-1 truncate
                                                                ${isSelected ? 'text-heritage-textDark' : 'text-heritage-textDark group-hover:text-heritage-primary'}
                                                            `}>
                                                                {yatra.title}
                                                            </div>

                                                            {/* Date */}
                                                            <div className="flex items-center gap-1.5 text-xs text-heritage-text/70 mb-1.5">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>
                                                                    {moment(yatra.startDate).format('MMM DD, YYYY')} - {moment(yatra.endDate).format('MMM DD, YYYY')}
                                                                </span>
                                                            </div>

                                                            {/* Additional Info */}
                                                            {yatra.location && (
                                                                <div className="flex items-center gap-3 text-xs">
                                                                    <span className="flex items-center gap-1 text-heritage-text/60">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {yatra.location}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Selected Indicator */}
                                                        {isSelected && (
                                                            <div className="flex-shrink-0">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-kesari-light to-kesari-dark flex items-center justify-center shadow-md">
                                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-4 py-12 text-center">
                                        <Calendar className="w-12 h-12 text-heritage-text/30 mx-auto mb-3" />
                                        <p className="text-sm text-heritage-text/60 font-medium">No yatras found</p>
                                        <p className="text-xs text-heritage-text/40 mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default SelectYatra;
