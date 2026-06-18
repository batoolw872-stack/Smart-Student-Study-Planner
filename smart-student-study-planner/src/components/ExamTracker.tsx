import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2, ShieldCheck, HelpCircle, MapPin, Gauge } from 'lucide-react';
import { Exam, Subject } from '../types';

interface ExamTrackerProps {
  exams: Exam[];
  subjects: Subject[];
  onAddExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onUpdateProgress: (id: string, prog: number) => void;
}

export default function ExamTracker({
  exams,
  subjects,
  onAddExam,
  onDeleteExam,
  onUpdateProgress
}: ExamTrackerProps) {
  const [showForm, setShowForm] = useState(false);

  // Form parameters
  const [subjId, setSubjId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [prepPercent, setPrepPercent] = useState('20');

  // Active exam countdown ticker
  const [nearestExam, setNearestExam] = useState<Exam | null>(null);
  const [countdownText, setCountdownText] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const unpassedExams = exams.filter(e => new Date(e.examDate).getTime() > Date.now());
    if (unpassedExams.length > 0) {
      const nearest = unpassedExams.sort(
        (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
      )[0];
      setNearestExam(nearest);
    } else {
      setNearestExam(null);
    }
  }, [exams]);

  useEffect(() => {
    if (!nearestExam) return;

    const interval = setInterval(() => {
      const targetTime = new Date(nearestExam.examDate).getTime();
      const diff = targetTime - Date.now();

      if (diff <= 0) {
        setCountdownText({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText({ d, h, m, s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nearestExam]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjId || !title || !date) return;

    const newExam: Exam = {
      id: `exam-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: subjId,
      title: title.trim(),
      examDate: date,
      location: location.trim() || 'Online / TBD',
      notes: notes.trim(),
      preparationProgress: Number(prepPercent) || 0
    };

    onAddExam(newExam);
    setTitle('');
    setDate('');
    setLocation('');
    setNotes('');
    setPrepPercent('20');
    setShowForm(false);
  };

  const getSub = (subId: string) => {
    return subjects.find(s => s.id === subId) || { code: 'CS', name: 'Academic Course', color: '#94a3b8' };
  };

  return (
    <div className="space-y-6" id="exam_tracker_tab">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#D4A373]" />
            Exam Preparation & Countdowns
          </h2>
          <p className="text-xs text-[#5D6659]">Log upcoming test periods, monitor syllabus coverage, and display countdown timers.</p>
        </div>

        <button 
          id="btn_open_exam_form"
          onClick={() => setShowForm(!showForm)}
          className="bg-[#D4A373] hover:bg-[#C29364] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all self-start"
        >
          <Plus className="h-4 w-4" /> Add Exam Date
        </button>
      </div>

      {/* Real-time Ticker for Nearest Exam */}
      {nearestExam && (
        <div className="bg-gradient-to-r from-[#2D332A] to-[#4F5949] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-center gap-6 border border-[#D9DED1]/10">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="bg-[#E4E8DA]/20 text-[#E4E8DA] border border-[#D9DED1]/20 text-[10px] uppercase font-bold px-3 py-1 rounded-full inline-block">
              Immediate Assessment
            </span>
            <h3 className="text-xl font-extrabold tracking-tight font-sans text-[#E4E8DA]">
              {nearestExam.title}
            </h3>
            <p className="text-sm text-[#F1F2EB]">
              Course: <strong className="text-[#D4A373]">{getSub(nearestExam.subjectId).name}</strong> | Room: <span className="italic">{nearestExam.location}</span>
            </p>
          </div>

          {/* Countdown timer numbers */}
          <div className="flex gap-3 md:gap-4 font-mono text-center shrink-0">
            <div className="bg-[#2D332A]/40 p-3 rounded-2xl border border-[#D9DED1]/15 min-w-[65px]">
              <span className="text-2xl font-black block text-[#E4E8DA]">{countdownText.d}</span>
              <span className="text-[9px] uppercase font-bold text-[#9DA895]">Days</span>
            </div>
            <div className="bg-[#2D332A]/40 p-3 rounded-2xl border border-[#D9DED1]/15 min-w-[65px]">
              <span className="text-2xl font-black block text-[#D4A373]">{countdownText.h}</span>
              <span className="text-[9px] uppercase font-bold text-[#9DA895]">Hrs</span>
            </div>
            <div className="bg-[#2D332A]/40 p-3 rounded-2xl border border-[#D9DED1]/15 min-w-[65px]">
              <span className="text-2xl font-black block text-[#A3B18A]">{countdownText.m}</span>
              <span className="text-[9px] uppercase font-bold text-[#9DA895]">Mins</span>
            </div>
            <div className="bg-[#2D332A]/40 p-3 rounded-2xl border border-[#D9DED1]/15 min-w-[65px] pulse-countdown">
              <span className="text-2xl font-black block text-[#D4A373]/85">{countdownText.s}</span>
              <span className="text-[9px] uppercase font-bold text-[#9DA895]">Secs</span>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-[2rem] border border-[#D9DED1] shadow-sm max-w-2xl"
          id="exam_form"
        >
          <form onSubmit={submitForm} className="space-y-4">
            <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider font-sans">Schedule New Examination</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Select Course / Subject</label>
                <select 
                  id="select_exam_subject"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white bg-[image:none]"
                  value={subjId}
                  onChange={(e) => setSubjId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Subject Course --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Exam Title/Scope</label>
                <input 
                  id="input_exam_title"
                  type="text" 
                  placeholder="e.g. Midterm Exam - Modules 1 to 5" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Date & Time</label>
                <input 
                  id="input_exam_date"
                  type="datetime-local" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Exam Location</label>
                <input 
                  id="input_exam_location"
                  type="text" 
                  placeholder="e.g. Science Hal, Room 2B" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Current Readiness (0-100%)</label>
                <input 
                  id="input_exam_readiness"
                  type="number" 
                  min="0" 
                  max="100" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={prepPercent} 
                  onChange={(e) => setPrepPercent(e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D6659] mb-1">Preparation Details / Notes</label>
              <textarea 
                id="input_exam_notes"
                placeholder="Mention textbook chapters, study guide sections, or formula sheets to bring..."
                className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] h-20 resize-none"
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                id="btn_cancel_exam"
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="btn_save_exam"
                type="submit" 
                className="px-4 py-2 bg-[#D4A373] hover:bg-[#C29364] text-white rounded-xl text-xs font-semibold cursor-pointer animate-none"
              >
                Log Exam
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid listing existing exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="exams_list_grid">
        {exams.map(e => {
          const sub = getSub(e.subjectId);
          const examLocalTime = new Date(e.examDate).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={e.id} className="bg-white p-5 rounded-2xl border border-[#D9DED1]/60 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
                    {sub.code}
                  </span>
                  <button 
                    id={`btn_delete_exam_${e.id}`}
                    onClick={() => onDeleteExam(e.id)}
                    className="text-[#9DA895] hover:text-red-500 transition-all p-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#2D332A] font-sans">{e.title}</h4>
                  <p className="text-xs text-[#5D6659] font-medium mt-1">{examLocalTime}</p>
                </div>

                <div className="flex flex-col gap-1.5 text-[11px] text-[#9DA895] pt-2 border-t border-[#D9DED1]/15">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Room: {e.location || 'Online / TBD'}
                  </span>
                  {e.notes && (
                    <span className="bg-[#F8F9F4] p-2 rounded-lg text-[#5D6659] block leading-relaxed max-h-[80px] overflow-y-auto mt-1">
                      {e.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress and slider controls */}
              <div className="pt-2 border-t border-[#D9DED1]/15 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#5D6659] flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5 text-[#5A6F4D]" /> Syllabus Readiness
                  </span>
                  <span className="text-[#5A6F4D]">{e.preparationProgress}%</span>
                </div>
                
                <input
                  id={`slider_exam_${e.id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={e.preparationProgress}
                  onChange={(evt) => onUpdateProgress(e.id, Number(evt.target.value))}
                  className="w-full accent-[#5A6F4D] cursor-pointer h-1.5 bg-[#F1F2EB] rounded"
                />
              </div>
            </div>
          );
        })}

        {exams.length === 0 && (
          <div className="col-span-full bg-[#F8F9F4] border border-dashed border-[#D9DED1] rounded-2xl p-8 text-center text-[#9DA895]">
            <p className="text-xs font-semibold">No scheduled exams logged at this time.</p>
          </div>
        )}
      </div>

    </div>
  );
}
