import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCard {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
}

interface HotelSummaryGridProps {
  cards: SummaryCard[];
}

export default function HotelSummaryGrid({ cards }: HotelSummaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 p-5 shadow-glass group hover:shadow-glass-lg transition-all duration-300"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-medium text-heritage-text/60 uppercase tracking-wide">
                {card.label}
              </p>
              {card.subtitle && (
                <p className="text-xs text-heritage-text/50 mb-1">{card.subtitle}</p>
              )}
              <h3 className="text-2xl font-bold text-heritage-textDark mt-1">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

