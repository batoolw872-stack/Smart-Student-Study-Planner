import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, AlertTriangle, BookOpen, Coffee, HelpCircle, Save, CheckCircle, BookMarked, History } from 'lucide-react';
import { Subject, StudySession } from '../types';

interface StudyTimerProps {
  subjects: Subject[];
  onLogSession: (sess: StudySession) => void;
  sessions: StudySession[];
}

export default function StudyTimer({
  subjects,
  onLogSession,
  sessions
}: StudyTimerProps) {
  const [mode, setMode] = useState<'Pomodoro' | 'Stopwatch'>('Pomodoro');
  
  // Pomodoro timer states
  const [isActive, setIsActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [pomodoroState, setPomodoroState] = useState<'Study' | 'Break'>('Study');

  // Stopwatch states
  const [watchActive, setWatchActive] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Form states for Logging studied session
  const [logSubjectId, setLogSubjectId] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logMinutes, setLogMinutes] = useState('25');
  const [successLogged, setSuccessLogged] = useState(false);

  // Pomodoro live clock countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && mode === 'Pomodoro') {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Timer expired, switch state
            setIsActive(false);
            if (pomodoroState === 'Study') {
              setPomodoroState('Break');
              setSecondsRemaining(5 * 60); // 5 minute break
              alert('Phenomenal study block completed! Step away and take a well-deserved 5-minute break.');
            } else {
              setPomodoroState('Study');
              setSecondsRemaining(25 * 60);
              alert('Break is over! Time to focus on your next academic task.');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, pomodoroState, mode]);

  // Stopwatch tracker effect
  useEffect(() => {
    let watchInterval: NodeJS.Timeout | null = null;
    if (watchActive && mode === 'Stopwatch') {
      watchInterval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (watchInterval) clearInterval(watchInterval);
    }
    return () => {
      if (watchInterval) clearInterval(watchInterval);
    };
  }, [watchActive, mode]);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(25 * 60);
    setPomodoroState('Study');
  };

  const resetStopwatch = () => {
    setWatchActive(false);
    setStopwatchSeconds(0);
  };

  const formatTimerValue = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatchValue = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubSessionLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSubjectId) return;

    const loggedMin = Number(logMinutes) || 25;

    const newSession: StudySession = {
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: logSubjectId,
      durationMinutes: loggedMin,
      sessionDate: new Date().toISOString().split('T')[0],
      notes: logNotes.trim() || 'Focus Session'
    };

    onLogSession(newSession);
    setLogMinutes('25');
    setLogNotes('');
    setSuccessLogged(true);

    setTimeout(() => {
      setSuccessLogged(false);
    }, 2500);
  };

  // Set default hours based on mode session values
  const loadActiveTimerToLog = () => {
    if (mode === 'Pomodoro' && pomodoroState === 'Study') {
      const studiedS = (25 * 60) - secondsRemaining;
      const studiedMin = Math.round(studiedS / 60) || 1;
      setLogMinutes(studiedMin.toString());
    } else if (mode === 'Stopwatch') {
      const studiedMin = Math.round(stopwatchSeconds / 60) || 1;
      setLogMinutes(studiedMin.toString());
    }
  };

  const activeSubjectName = (subId: string) => {
    return subjects.find(s => s.id === subId)?.name || 'Subject Course';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans" id="study_progress_tracker_tab">
      
      {/* Timer clock Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm text-center flex flex-col justify-between min-h-[400px]">
          <div>
            {/* Mode selection buttons */}
            <div className="flex border border-[#D9DED1] p-1 rounded-xl bg-[#F8F9F4] max-w-sm mx-auto">
              <button 
                id="btn_mode_pomodoro"
                onClick={() => { setMode('Pomodoro'); resetStopwatch(); }}
                className={`flex-1 py-1 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${mode === 'Pomodoro' ? 'bg-white text-[#5A6F4D] shadow-sm' : 'text-[#9DA895]'}`}
              >
                Pomodoro Focus
              </button>
              <button 
                id="btn_mode_stopwatch"
                onClick={() => { setMode('Stopwatch'); resetTimer(); }}
                className={`flex-1 py-1 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${mode === 'Stopwatch' ? 'bg-white text-[#5A6F4D] shadow-sm' : 'text-[#9DA895]'}`}
              >
                Stopwatch / Log hrs
              </button>
            </div>

            {/* Interval indicator */}
            {mode === 'Pomodoro' && (
              <div className="mt-4">
                <span className={`text-[10px] uppercase font-bold py-1 px-3 rounded-full border ${
                  pomodoroState === 'Study' 
                    ? 'bg-[#E4E8DA] text-[#5A6F4D] border-[#D9DED1]' 
                    : 'bg-[#F1F2EB] text-[#5A6F4D] border-[#D9DED1]'
                }`}>
                  {pomodoroState === 'Study' ? '✍️ Studying Time block' : '☕ Break Time block'}
                </span>
              </div>
            )}
          </div>

          {/* Clock Ticker Numbers */}
          <div className="my-8">
            <span className="text-6xl md:text-7xl font-sans font-black tracking-tight text-[#2D332A] font-mono block">
              {mode === 'Pomodoro' 
                ? formatTimerValue(secondsRemaining) 
                : formatStopwatchValue(stopwatchSeconds)}
            </span>
            <span className="text-xs text-[#5D6659] block mt-1 tracking-wider uppercase font-semibold">
              {mode === 'Pomodoro' ? 'Seconds block remaining' : 'Cumulative elapsed times'}
            </span>
          </div>

          {/* Clock Controllers */}
          <div className="flex items-center justify-center gap-4">
            {mode === 'Pomodoro' ? (
              <>
                <button 
                  id="btn_reset_pomodoro"
                  onClick={resetTimer}
                  className="p-3 bg-[#F1F2EB] hover:bg-[#E4E8DA] border border-[#D9DED1] text-[#2D332A] rounded-xl cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button 
                  id="btn_play_pause_pomodoro"
                  onClick={() => setIsActive(!isActive)}
                  className={`p-4 rounded-full text-white cursor-pointer transition-all shadow-md ${
                    isActive ? 'bg-[#D4A373] hover:bg-[#C29364] shadow-sm' : 'bg-[#5A6F4D] hover:bg-[#4F6242] shadow-sm'
                  }`}
                >
                  {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </button>
              </>
            ) : (
              <>
                <button 
                  id="btn_reset_stopwatch"
                  onClick={resetStopwatch}
                  className="p-3 bg-[#F1F2EB] hover:bg-[#E4E8DA] border border-[#D9DED1] text-[#2D332A] rounded-xl cursor-pointer"
                  title="Reset Stopwatch"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button 
                  id="btn_play_pause_stopwatch"
                  onClick={() => setWatchActive(!watchActive)}
                  className={`p-4 rounded-full text-white cursor-pointer transition-all shadow-md ${
                    watchActive ? 'bg-[#D4A373] hover:bg-[#C29364] shadow-sm' : 'bg-[#5A6F4D] hover:bg-[#4F6242] shadow-sm'
                  }`}
                >
                  {watchActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </button>
              </>
            )}

            <button 
              id="btn_load_to_log"
              onClick={loadActiveTimerToLog}
              className="px-4 py-2 bg-[#E4E8DA] hover:bg-[#D9DED1] border border-[#D9DED1] text-[#2D332A] text-xs font-semibold rounded-xl cursor-pointer"
              title="Populate Form with Studied Hours"
            >
              Export to log
            </button>
          </div>

          {/* Quick instructions indicator */}
          <div className="pt-4 border-t border-[#D9DED1]/30 text-[11px] text-[#5D6659]">
            {mode === 'Pomodoro' 
              ? 'Study blocks clock targets 25 minutes. Logging study sessions populates student analytics widgets.' 
              : 'The stopwatch tracks open schedules. Stop tracking, load hour value into dashboard, and save.'}
          </div>
        </div>
      </div>

      {/* Log sessions Form Column */}
      <div className="space-y-6">
        
        {/* Log Study Session Form */}
        <div className="bg-white p-5 rounded-3xl border border-[#D9DED1]/60 shadow-sm" id="log_study_session_form_container">
          <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider mb-4 flex items-center gap-1.5 font-sans">
            <BookMarked className="h-4 w-4 text-[#5A6F4D]" /> Log Focus Session
          </h3>

          {successLogged && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="mb-4 p-3 bg-[#E4E8DA] text-[#5A6F4D] border border-[#D9DED1] text-xs rounded-xl flex items-center gap-1.5"
              id="alert_success_log"
            >
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Study session successfully locked to logs!</span>
            </motion.div>
          )}

          <form onSubmit={handleSubSessionLog} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5D6659] mb-1">Select Course / Subject</label>
              <select 
                id="select_log_subject"
                className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white bg-[image:none]"
                value={logSubjectId}
                onChange={(e) => setLogSubjectId(e.target.value)}
                required
              >
                <option value="">-- Choose Subject Course --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Duration (Minutes)</label>
                <input 
                  id="input_log_duration"
                  type="number" 
                  min="1" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(e.target.value)}
                  required
                />
              </div>

              <div className="self-end pb-1 text-[11px] text-[#5D6659] font-medium">
                ≒ {(Number(logMinutes) / 60 || 0).toFixed(1)} Study Hours
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D6659] mb-1">Focus Notes / Syllabus Covered</label>
              <textarea 
                id="input_log_notes"
                placeholder="Mention chapters reviewed, test papers completed, vocabulary memorized..."
                className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] h-16 resize-none"
                value={logNotes} 
                onChange={(e) => setLogNotes(e.target.value)} 
              />
            </div>

            <button 
              id="btn_submit_log"
              type="submit" 
              className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="h-4 w-4" /> Log Session Metrics
            </button>
          </form>
        </div>

        {/* History log lists mini widget */}
        <div className="bg-white p-5 rounded-3xl border border-[#D9DED1]/60 shadow-sm" id="study_logs_history_container">
          <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-sans">
            <History className="h-4 w-4 text-[#5D6659]" /> Study Logs History
          </h3>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {sessions.map(s => (
              <div key={s.id} className="p-2.5 bg-[#F8F9F4] hover:bg-[#F1F2EB] rounded-xl border border-[#D9DED1]/60 text-[11px] leading-relaxed text-[#2D332A]">
                <div className="flex justify-between items-center text-[#9DA895] mb-1">
                  <span className="font-bold text-[#2D332A] uppercase">
                    {activeSubjectName(s.subjectId)}
                  </span>
                  <span>{s.sessionDate}</span>
                </div>
                <p className="font-semibold text-[#5D6659]">{s.durationMinutes} minutes dedicated</p>
                <span className="text-[10px] text-[#9DA895] block italic mt-0.5">{s.notes}</span>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-xs text-[#9DA895] italic text-center py-4 bg-[#F8F9F4] border border-dashed border-[#D9DED1] rounded-lg">No focus hours logged yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
