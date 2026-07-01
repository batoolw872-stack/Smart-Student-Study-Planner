import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Trash2, X, Clock, MapPin, Check, Info, CalendarRange, Filter
} from 'lucide-react';
import { Subject, Assignment, Exam, StudySession } from '../types';

export interface CustomEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  type: 'Custom' | 'Study' | 'Assignment' | 'Exam' | 'Reminder';
  subjectId?: string;
  color?: string;
}

interface CalendarViewProps {
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  sessions: StudySession[];
  customEvents: CustomEvent[];
  onAddCustomEvent: (e: CustomEvent) => void;
  onDeleteCustomEvent: (id: string) => void;
}

export default function CalendarView({
  subjects,
  assignments,
  exams,
  sessions,
  customEvents,
  onAddCustomEvent,
  onDeleteCustomEvent
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form states for new event
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('14:00');
  const [eventType, setEventType] = useState<'Custom' | 'Reminder'>('Custom');
  const [eventSubjectId, setEventSubjectId] = useState('');
  const [eventColor, setEventColor] = useState('#D4A373');

  // Date math utilities
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate dates
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  // Convert raw objects to uniform Calendar entries
  const getEventsForDate = (dateString: string): CustomEvent[] => {
    const list: CustomEvent[] = [];

    // 1. Assignments
    assignments.forEach(as => {
      const dueDateStr = as.dueDate.split('T')[0];
      if (dueDateStr === dateString) {
        const subj = subjects.find(s => s.id === as.subjectId);
        list.push({
          id: `as-${as.id}`,
          title: `📝 Assign: ${as.title}`,
          description: as.description,
          date: dueDateStr,
          time: as.dueDate.split('T')[1] || '23:59',
          type: 'Assignment',
          subjectId: as.subjectId,
          color: subj?.color || '#3B82F6'
        });
      }
    });

    // 2. Exams
    exams.forEach(ex => {
      const examDateStr = ex.examDate.split('T')[0];
      if (examDateStr === dateString) {
        const subj = subjects.find(s => s.id === ex.subjectId);
        list.push({
          id: `ex-${ex.id}`,
          title: `🚨 Exam: ${ex.title}`,
          description: `Location: ${ex.location}. Progress: ${ex.preparationProgress}%`,
          date: examDateStr,
          time: ex.examDate.split('T')[1] || '09:00',
          type: 'Exam',
          subjectId: ex.subjectId,
          color: subj?.color || '#EF4444'
        });
      }
    });

    // 3. Study Sessions log
    sessions.forEach(sess => {
      if (sess.sessionDate === dateString) {
        const subj = subjects.find(s => s.id === sess.subjectId);
        list.push({
          id: `sess-${sess.id}`,
          title: `⏱️ Focus: ${sess.durationMinutes} mins`,
          description: sess.notes,
          date: sess.sessionDate,
          type: 'Study',
          subjectId: sess.subjectId,
          color: subj?.color || '#10B981'
        });
      }
    });

    // 4. Custom Events
    customEvents.forEach(cev => {
      if (cev.date === dateString) {
        list.push(cev);
      }
    });

    // Filter list
    if (filterType !== 'all') {
      return list.filter(item => item.type === filterType);
    }

    return list;
  };

  // Generate calendar days for monthly grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  
  // Padding days from previous month
  const prevMonthDaysCount = getDaysInMonth(currentYear, currentMonth - 1);
  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthDaysCount - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    calendarDays.push({ date: d, isCurrentMonth: true });
  }

  // Padding days from next month to complete 42 cells (6 rows)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Form Submission
  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddCustomEvent({
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: desc.trim(),
      date: eventDate,
      time: eventTime,
      type: eventType,
      subjectId: eventSubjectId || undefined,
      color: eventColor
    });

    setTitle('');
    setDesc('');
    setShowAddModal(false);
  };

  // Format Helper
  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDays = (start: Date) => {
    const currentDay = start.getDay(); // 0-6
    const startOfWeek = new Date(start.getTime() - currentDay * 24 * 60 * 60 * 1000);
    return Array.from({ length: 7 }).map((_, i) => {
      return new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000);
    });
  };

  return (
    <div className="space-y-6 font-sans" id="calendar_tab_view">
      
      {/* Banner / Header Controls */}
      <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#5A6F4D]" />
            Academic Event Calendar
          </h2>
          <p className="text-xs text-[#5D6659]">
            Review class checkpoints, upcoming test counters, logged pomodoro logs, and custom student events inside a single portal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <div className="flex rounded-xl bg-[#F1F2EB] p-1 border border-[#D9DED1]/50">
            <button
              id="btn_cal_view_month"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month' ? 'bg-white text-[#5A6F4D] shadow-sm' : 'text-[#5D6659] hover:text-[#2D332A]'
              }`}
            >
              Month View
            </button>
            <button
              id="btn_cal_view_week"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-white text-[#5A6F4D] shadow-sm' : 'text-[#5D6659] hover:text-[#2D332A]'
              }`}
            >
              Week View
            </button>
            <button
              id="btn_cal_view_day"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-[#5A6F4D] shadow-sm' : 'text-[#5D6659] hover:text-[#2D332A]'
              }`}
            >
              Day View
            </button>
          </div>

          <button
            id="btn_cal_add_event"
            onClick={() => {
              setEventDate(formatDateString(selectedDay));
              setShowAddModal(true);
            }}
            className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Filter and Date bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#F1F2EB]/50 p-4 rounded-2xl border border-[#D9DED1]/60">
        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            id="btn_cal_today"
            onClick={handleToday}
            className="bg-white hover:bg-[#F1F2EB] text-[#2D332A] border border-[#D9DED1] text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center gap-1.5 border border-[#D9DED1] bg-white rounded-xl overflow-hidden p-0.5">
            <button
              id="btn_cal_prev"
              onClick={handlePrev}
              className="p-1.5 hover:bg-[#F8F9F4] text-[#5D6659] hover:text-[#2D332A] rounded-lg cursor-pointer transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-[#2D332A] px-3 font-sans min-w-[120px] text-center">
              {viewMode === 'month' && `${months[currentMonth]} ${currentYear}`}
              {viewMode === 'week' && `Week of ${getWeekDays(currentDate)[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
              {viewMode === 'day' && currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              id="btn_cal_next"
              onClick={handleNext}
              className="p-1.5 hover:bg-[#F8F9F4] text-[#5D6659] hover:text-[#2D332A] rounded-lg cursor-pointer transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-[#5D6659]" />
          <span className="text-xs text-[#5D6659] font-medium mr-1">Filter events:</span>
          <select
            id="select_cal_filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-[#D9DED1] text-xs font-semibold px-2.5 py-1 rounded-lg text-[#2D332A] outline-none cursor-pointer"
          >
            <option value="all">All Items</option>
            <option value="Assignment">Assignments</option>
            <option value="Exam">Exams</option>
            <option value="Study">Study Logs</option>
            <option value="Custom">Custom Events</option>
          </select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="bg-white rounded-3xl border border-[#D9DED1]/60 overflow-hidden shadow-sm p-4 md:p-6" id="calendar_grid_panel">
        
        {/* Month View Grid */}
        {viewMode === 'month' && (
          <div className="space-y-1">
            {/* Weekdays Labels */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold text-[#9DA895] uppercase tracking-wider border-b border-[#D9DED1]/40">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* 6-row grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-2" id="monthly_calendar_grid">
              {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                const dateStr = formatDateString(date);
                const dayEvents = getEventsForDate(dateStr);
                const isToday = formatDateString(new Date()) === dateStr;
                const isSelected = formatDateString(selectedDay) === dateStr;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedDay(date);
                      setCurrentDate(date);
                    }}
                    className={`min-h-[90px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#5A6F4D] ring-2 ring-[#5A6F4D]/10 bg-[#E4E8DA]/10' 
                        : isToday
                          ? 'border-[#D4A373] bg-[#FDFBF7]'
                          : isCurrentMonth
                            ? 'bg-white border-[#D9DED1]/30 hover:border-[#D9DED1] hover:bg-[#F8F9F4]/40'
                            : 'bg-[#F8F9F4]/50 border-transparent opacity-40 hover:bg-[#F8F9F4]/80'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-extrabold font-mono flex items-center justify-center w-5 h-5 rounded-full ${
                        isToday ? 'bg-[#D4A373] text-white' : 'text-[#2D332A]'
                      }`}>
                        {date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5A6F4D]" />
                      )}
                    </div>

                    {/* Events list container */}
                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[60px] scrollbar-none" id={`events_list_cell_${dateStr}`}>
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          style={{ borderLeftColor: ev.color }}
                          className="text-[9px] px-1 py-0.5 border-l-2 bg-slate-50 text-[#2D332A] font-medium rounded truncate leading-tight flex items-center justify-between group"
                        >
                          <span className="truncate" title={ev.title}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[8px] text-center font-bold text-[#5A6F4D]">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View Layout */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-7 gap-3" id="weekly_calendar_view">
            {getWeekDays(currentDate).map((day, idx) => {
              const dateStr = formatDateString(day);
              const dayEvents = getEventsForDate(dateStr);
              const isToday = formatDateString(new Date()) === dateStr;

              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-3 flex flex-col min-h-[220px] ${
                    isToday ? 'border-[#D4A373] bg-[#FDFBF7]' : 'border-[#D9DED1]/40 bg-white'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-[#D9DED1]/20">
                    <span className="text-[10px] font-bold text-[#9DA895] uppercase block mb-0.5">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                    <span className={`text-xs font-bold font-mono inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday ? 'bg-[#D4A373] text-white' : 'text-[#2D332A]'
                    }`}>{day.getDate()}</span>
                  </div>

                  <div className="flex-1 py-2 space-y-1.5 overflow-y-auto max-h-[160px] scrollbar-none">
                    {dayEvents.map(ev => (
                      <div 
                        key={ev.id}
                        style={{ borderLeftColor: ev.color }}
                        className="text-[10px] p-2 border-l-2 bg-[#F8F9F4] text-[#2D332A] rounded-xl flex flex-col gap-1 shadow-sm relative group"
                      >
                        <span className="font-extrabold leading-tight">{ev.title}</span>
                        {ev.time && <span className="text-[8px] text-[#9DA895]">{ev.time}</span>}
                        {ev.type === 'Custom' && (
                          <button
                            id={`btn_del_week_event_${ev.id}`}
                            onClick={() => onDeleteCustomEvent(ev.id)}
                            className="absolute right-1.5 bottom-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity outline-none"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    {dayEvents.length === 0 && (
                      <span className="text-[10px] text-[#9DA895] italic text-center block pt-8">No checkpoints</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day View Layout */}
        {viewMode === 'day' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="daily_calendar_view">
            {/* Selected Date Summary Column */}
            <div className="md:col-span-1 bg-[#F8F9F4] p-5 rounded-2xl border border-[#D9DED1]/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#5A6F4D] tracking-wider block mb-1">Target Date</span>
                <h3 className="text-lg font-black text-[#2D332A]">{currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                <p className="text-xs text-[#5D6659] mt-2">Manage course updates, study blocks, and tasks assigned to this calendar coordinate.</p>
              </div>

              <div className="pt-6 border-t border-[#D9DED1]/40 mt-6">
                <button
                  id="btn_add_event_for_day"
                  onClick={() => {
                    setEventDate(formatDateString(currentDate));
                    setShowAddModal(true);
                  }}
                  className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Event for Day
                </button>
              </div>
            </div>

            {/* Day's Events List Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-[#5D6659] uppercase tracking-wider">Scheduled Checkpoints ({getEventsForDate(formatDateString(currentDate)).length})</h4>
              
              <div className="space-y-3" id="daily_events_list">
                {getEventsForDate(formatDateString(currentDate)).map(ev => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-white border border-[#D9DED1]/40 shadow-sm hover:shadow-md transition-all flex items-start justify-between relative group"
                  >
                    <div className="flex gap-3.5 items-start">
                      <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: ev.color }} />
                      <div>
                        <h5 className="text-xs font-extrabold text-[#2D332A] flex items-center gap-2">
                          {ev.title}
                          <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase font-mono ${
                            ev.type === 'Assignment' ? 'bg-[#E4E8DA] text-[#5A6F4D]' :
                            ev.type === 'Exam' ? 'bg-red-50 text-red-600' :
                            ev.type === 'Study' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {ev.type}
                          </span>
                        </h5>
                        {ev.description && <p className="text-[11px] text-[#5D6659] mt-1.5 leading-normal">{ev.description}</p>}
                        {ev.time && (
                          <div className="flex items-center gap-1 text-[10px] text-[#9DA895] mt-2 font-semibold">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Scheduled time: {ev.time}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {ev.type === 'Custom' && (
                      <button
                        id={`btn_del_event_${ev.id}`}
                        onClick={() => onDeleteCustomEvent(ev.id)}
                        className="text-[#9DA895] hover:text-red-500 p-1.5 hover:bg-red-50 rounded-xl transition-colors cursor-pointer outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                {getEventsForDate(formatDateString(currentDate)).length === 0 && (
                  <div className="text-center py-12 bg-[#F8F9F4]/40 rounded-2xl border border-dashed border-[#D9DED1] text-xs text-slate-400 italic">
                    No academic checkpoints or custom reminders set for today.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Custom Event Modal Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#D9DED1] shadow-2xl p-6 w-full max-w-md relative z-10"
              id="add_event_modal"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#D9DED1]/30">
                <h3 className="text-base font-bold text-[#2D332A] flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-[#5A6F4D]" />
                  Add Custom Event
                </h3>
                <button 
                  id="btn_close_event_modal"
                  onClick={() => setShowAddModal(false)} 
                  className="text-slate-400 hover:text-[#2D332A]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitEvent} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Event Title <span className="text-red-500">*</span></label>
                  <input
                    id="input_event_title"
                    type="text"
                    required
                    placeholder="e.g. Study Group Session / Project Meetup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Event Description</label>
                  <textarea
                    id="input_event_desc"
                    placeholder="Write detailed targets, meeting coordinates or preparation notes..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A] h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      id="input_event_date"
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Time</label>
                    <input
                      id="input_event_time"
                      type="time"
                      required
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Event Type</label>
                    <select
                      id="select_event_type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                    >
                      <option value="Custom">Custom Event</option>
                      <option value="Reminder">Personal Reminder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Accent Color</label>
                    <div className="flex gap-2 items-center h-10">
                      {['#D4A373', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(c => (
                        <button
                          id={`btn_choice_event_color_${c}`}
                          key={c}
                          type="button"
                          onClick={() => setEventColor(c)}
                          className={`w-5 h-5 rounded-full border transition-all shrink-0 ${
                            eventColor === c ? 'ring-2 ring-offset-2 ring-[#5A6F4D]' : ''
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  id="btn_submit_event_form"
                  type="submit"
                  className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-4"
                >
                  Save Calendar Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
