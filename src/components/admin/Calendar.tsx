'use client';

import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, MapPin, Users, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  type?: 'yatra' | 'booking' | 'event' | 'task';
  location?: string;
  attendees?: number;
  description?: string;
}

interface HeritageCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onSlotSelect?: (slotInfo: { start: Date; end: Date }) => void;
  className?: string;
}

const HeritageCalendar: React.FC<HeritageCalendarProps> = ({
  events = [],
  onEventClick,
  onSlotSelect,
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Event style getter for heritage theme
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#EBA83A'; // heritage-primary
    let borderColor = '#D97A32'; // heritage-secondary

    switch (event.type) {
      case 'yatra':
        backgroundColor = '#D97A32'; // heritage-secondary
        borderColor = '#762A25'; // heritage-maroon
        break;
      case 'booking':
        backgroundColor = '#C8A55C'; // heritage-gold
        borderColor = '#EBA83A'; // heritage-primary
        break;
      case 'event':
        backgroundColor = '#FF6A00'; // kesari
        borderColor = '#CC5500'; // kesari-dark
        break;
      case 'task':
        backgroundColor = '#762A25'; // heritage-maroon
        borderColor = '#44201A'; // heritage-textDark
        break;
      default:
        backgroundColor = '#EBA83A';
        borderColor = '#D97A32';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        color: '#fff',
        borderRadius: '8px',
        padding: '4px 8px',
        fontSize: '0.875rem',
        fontWeight: '600',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
    };
  };

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(currentDate);
    if (action === 'PREV') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (action === 'NEXT') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      setCurrentDate(new Date());
      return;
    }
    setCurrentDate(newDate);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    // onEventClick?.(event);
  };

  const handleSelectSlot = (slotInfo: any) => {
    onSlotSelect?.(slotInfo);
  };

  const CustomToolbar = () => {
    const dateLabel = moment(currentDate).format('MMMM YYYY');

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-heritage-text/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-md">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-heritage-textDark">{dateLabel}</h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => handleNavigate('TODAY')}
            className="px-4 py-2 text-sm font-semibold bg-white/60 border-2 border-kesari-light text-kesari-dark hover:bg-kesari-light hover:text-white hover:border-kesari-dark transition-all duration-300"
          >
            Today
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              onClick={() => handleNavigate('PREV')}
              className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate('NEXT')}
              className="h-9 w-9 !p-0 flex items-center justify-center rounded-lg border-2 border-kesari-dark text-kesari-dark bg-white/50 hover:bg-kesari-light hover:text-white hover:border-kesari-light hover:shadow-lg transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 bg-white/60 border-2 border-kesari-light/40 rounded-lg p-1">
            {(['month', 'week', 'day', 'agenda'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 capitalize ${view === v
                  ? 'bg-gradient-to-br from-kesari-light to-kesari-dark text-white shadow-md'
                  : 'text-kesari-darker hover:bg-kesari-light/20 hover:text-kesari-dark'
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`heritage-calendar-wrapper font-inter ${className}`}>
      <style jsx global>{`
        .heritage-calendar-wrapper .rbc-calendar {
          font-family: inherit;
        }

        /* Month view styling */
        .heritage-calendar-wrapper .rbc-header {
          padding: 12px 8px;
          font-weight: 700;
          font-size: 0.875rem;
          color: #762A25;
          background: linear-gradient(135deg, rgba(235,168,58,0.15) 0%, rgba(200,165,92,0.1) 100%);
          border-bottom: 2px solid #EBA83A;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .heritage-calendar-wrapper .rbc-month-view {
          border: 2px solid rgba(235,168,58,0.2);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
        }

        .heritage-calendar-wrapper .rbc-month-row {
          border-color: rgba(235,168,58,0.15);
        }

        .heritage-calendar-wrapper .rbc-day-bg {
          border-color: rgba(235,168,58,0.15);
          transition: background-color 0.2s ease;
        }

        .heritage-calendar-wrapper .rbc-day-bg:hover {
          background-color: rgba(235,168,58,0.05);
        }

        .heritage-calendar-wrapper .rbc-off-range-bg {
          background-color: rgba(107,90,69,0.03);
        }

        .heritage-calendar-wrapper .rbc-today {
          background-color: rgba(255,106,0,0.08);
        }

        .heritage-calendar-wrapper .rbc-date-cell {
          padding: 8px;
          text-align: right;
        }

        .heritage-calendar-wrapper .rbc-date-cell > a {
          color: #44201A;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .heritage-calendar-wrapper .rbc-now > a {
          color: #FF6A00;
          font-weight: 700;
        }

        .heritage-calendar-wrapper .rbc-off-range > a {
          color: rgba(107,90,69,0.35);
        }

        /* Event styling */
        .heritage-calendar-wrapper .rbc-event {
          border-radius: 8px;
          padding: 4px 8px;
          margin: 2px 0;
        }

        .heritage-calendar-wrapper .rbc-event:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(235,168,58,0.3);
        }

        .heritage-calendar-wrapper .rbc-event-label {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .heritage-calendar-wrapper .rbc-event-content {
          font-size: 0.875rem;
        }

        /* Week and Day view */
        .heritage-calendar-wrapper .rbc-time-view {
          border: 2px solid rgba(235,168,58,0.2);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
        }

        .heritage-calendar-wrapper .rbc-time-header {
          border-bottom: 2px solid #EBA83A;
        }

        .heritage-calendar-wrapper .rbc-time-content {
          border-top: 2px solid rgba(235,168,58,0.15);
        }

        .heritage-calendar-wrapper .rbc-time-slot {
          border-top: 1px solid rgba(235,168,58,0.1);
        }

        .heritage-calendar-wrapper .rbc-current-time-indicator {
          background-color: #FF6A00;
          height: 2px;
        }

        .heritage-calendar-wrapper .rbc-timeslot-group {
          border-left: 1px solid rgba(235,168,58,0.15);
        }

        .heritage-calendar-wrapper .rbc-day-slot .rbc-time-slot {
          border-color: rgba(235,168,58,0.08);
        }

        /* Agenda view */
        .heritage-calendar-wrapper .rbc-agenda-view {
          border: 2px solid rgba(235,168,58,0.2);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(12px);
        }

        .heritage-calendar-wrapper .rbc-agenda-view table.rbc-agenda-table {
          border-color: rgba(235,168,58,0.15);
        }

        .heritage-calendar-wrapper .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 16px;
          border-color: rgba(235,168,58,0.1);
        }

        .heritage-calendar-wrapper .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover {
          background-color: rgba(235,168,58,0.05);
        }

        .heritage-calendar-wrapper .rbc-agenda-date-cell,
        .heritage-calendar-wrapper .rbc-agenda-time-cell {
          font-weight: 600;
          color: #762A25;
        }

        .heritage-calendar-wrapper .rbc-agenda-event-cell {
          color: #44201A;
        }

        /* Selection */
        .heritage-calendar-wrapper .rbc-slot-selection {
          background-color: rgba(255,106,0,0.15);
          border: 2px solid #FF6A00;
        }

        /* Overlay */
        .heritage-calendar-wrapper .rbc-overlay {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(235,168,58,0.3);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(118,42,37,0.15);
          padding: 8px;
        }

        .heritage-calendar-wrapper .rbc-overlay-header {
          border-bottom: 1px solid rgba(235,168,58,0.2);
          padding: 8px 12px;
          margin: 0 -8px 8px -8px;
          font-weight: 700;
          color: #762A25;
        }
      `}</style>

      <CustomToolbar />

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        toolbar={false}
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-heritage-highlight rounded-2xl shadow-glass max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedEvent.type === 'yatra' ? 'from-heritage-secondary to-heritage-maroon' :
                  selectedEvent.type === 'booking' ? 'from-heritage-gold to-heritage-primary' :
                    selectedEvent.type === 'event' ? 'from-kesari-light to-kesari-dark' :
                      'from-heritage-maroon to-heritage-textDark'
                  } text-white shadow-md`}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-heritage-textDark">{selectedEvent.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-md bg-heritage-highlight text-heritage-text font-medium capitalize">
                    {selectedEvent.type || 'event'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-heritage-text hover:text-heritage-textDark transition-colors"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-heritage-text">
                <Clock className="w-4 h-4 text-heritage-primary" />
                <span>
                  {moment(selectedEvent.start).format('MMM DD, YYYY • h:mm A')} -
                  {moment(selectedEvent.end).format('h:mm A')}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm text-heritage-text">
                  <MapPin className="w-4 h-4 text-heritage-secondary" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.attendees && (
                <div className="flex items-center gap-3 text-sm text-heritage-text">
                  <Users className="w-4 h-4 text-heritage-gold" />
                  <span>{selectedEvent.attendees} attendees</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="mt-4 p-4 rounded-xl bg-heritage-highlight/40 border border-heritage-highlight/60">
                  <p className="text-sm text-heritage-textDark">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="admin"
                className="flex-1 bg-gradient-to-br from-kesari-light to-kesari-dark text-white hover:shadow-lg transition-all duration-300"
              >
                Edit Event
              </Button>
              <Button
                variant="admin-outline"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 border-2 border-kesari-light text-kesari-dark hover:bg-kesari-light/10 transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageCalendar;
