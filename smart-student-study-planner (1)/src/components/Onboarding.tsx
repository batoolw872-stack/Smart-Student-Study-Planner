import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, User, Mail, BookOpen, Clock, Settings, Sparkles, 
  ArrowRight, ArrowLeft, Calendar, Palette, Moon, Sun, Bell, 
  Check, Info, CheckSquare, Square, Download, FolderOpen, Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (user: UserProfile, loadDemo: boolean) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Basics
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2: Academics
  const [academicLevel, setAcademicLevel] = useState('University');
  const [school, setSchool] = useState('');
  const [semester, setSemester] = useState('');
  const [academicMajor, setAcademicMajor] = useState('');
  const [gpaTarget, setGpaTarget] = useState(3.8);

  // Step 3: Study Habits
  const [dailyAvailability, setDailyAvailability] = useState(4);
  const [preferredStudyHours, setPreferredStudyHours] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Evening');
  const [studyDays, setStudyDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  // Step 4: System Preferences & Preset Selection
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [notificationTimes, setNotificationTimes] = useState<string[]>(['Evening']);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accentColor, setAccentColor] = useState('#5A6F4D'); // Sage green
  const [language, setLanguage] = useState('English');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');
  const [dateFormat, setDateFormat] = useState<'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'>('MM/DD/YYYY');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loadDemo, setLoadDemo] = useState(false);

  // Error handling
  const [errorMsg, setErrorMsg] = useState('');

  const toggleStudyDay = (day: string) => {
    if (studyDays.includes(day)) {
      setStudyDays(studyDays.filter(d => d !== day));
    } else {
      setStudyDays([...studyDays, day]);
    }
  };

  const toggleNotificationTime = (time: string) => {
    if (notificationTimes.includes(time)) {
      setNotificationTimes(notificationTimes.filter(t => t !== time));
    } else {
      setNotificationTimes([...notificationTimes, time]);
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    
    if (step === 1) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
    } else if (step === 2) {
      if (!school.trim()) {
        setErrorMsg('Please enter your school/college/university.');
        return;
      }
      if (!semester.trim()) {
        setErrorMsg('Please specify your current semester or grade.');
        return;
      }
      if (!academicMajor.trim()) {
        setErrorMsg('Please enter your major, concentration, or core field.');
        return;
      }
    } else if (step === 3) {
      if (studyDays.length === 0) {
        setErrorMsg('Please choose at least one day per week to study.');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Create user profile
      const userProfile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim() || 'student@academic.edu',
        academicLevel,
        academicMajor: academicMajor.trim(),
        school: school.trim(),
        semester: semester.trim(),
        gpaTarget: Number(gpaTarget),
        profilePic: '', // Initialized to empty for initials avatar
        timezone,
        preferredStudyHours,
        dailyAvailability,
        notificationTimes,
        studyDays,
        theme,
        accentColor,
        language,
        timeFormat,
        dateFormat,
        notificationsEnabled,
        isOnboarded: true
      };

      onComplete(userProfile, loadDemo);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const timezones = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 
    'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo', 
    'Asia/Singapore', 'Australia/Sydney'
  ];

  const accents = [
    { name: 'Sage Green', color: '#5A6F4D' },
    { name: 'Classic Blue', color: '#3B82F6' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Amethyst Purple', color: '#8B5CF6' },
    { name: 'Amber Sunset', color: '#F59E0B' },
    { name: 'Crimson Rose', color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9F4] text-[#2D332A] flex flex-col justify-center items-center p-4 relative overflow-hidden" id="onboarding_wizard_container">
      
      {/* Decorative ambient background assets */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E4E8DA] rounded-full blur-3xl opacity-60 -z-10 translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F1F2EB] rounded-full blur-3xl opacity-60 -z-10 -translate-x-12 translate-y-12" />

      {/* Main Form container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#D9DED1]/80 shadow-md p-6 md:p-8 relative z-10" id="onboarding_card">
        
        {/* Header & step progress indicator bar */}
        <div className="flex justify-between items-center mb-8 border-b border-[#D9DED1]/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#5A6F4D] text-white p-2 rounded-xl shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#2D332A]">Setup Academic Planner</h1>
              <span className="text-[10px] text-[#5D6659] block uppercase tracking-widest font-black">Step {step} of {totalSteps}</span>
            </div>
          </div>
          
          {/* Progress dots */}
          <div className="flex gap-1.5" id="onboarding_progress_dots">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === step ? 'w-6 bg-[#5A6F4D]' : 'w-1.5 bg-[#D9DED1]'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-start gap-2.5"
            id="onboarding_error_alert"
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
            id={`onboarding_step_${step}`}
          >
            
            {/* Step 1: User Essentials */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-extrabold text-[#2D332A] flex items-center gap-2 tracking-tight">
                    <Sparkles className="h-5 w-5 text-[#5A6F4D] animate-pulse" />
                    Let's establish your student workspace
                  </h2>
                  <p className="text-xs text-[#5D6659] mt-1 leading-relaxed">
                    Begin with a personalized profile. All configurations are securely saved in your browser storage.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Full Student Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                      <input 
                        id="onboard_name"
                        type="text"
                        placeholder="e.g., Alex Mercer"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] outline-none text-xs transition-all text-[#2D332A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Academic Email Address <span className="text-[#9DA895] text-[10px] lowercase italic">(optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                      <input 
                        id="onboard_email"
                        type="email"
                        placeholder="e.g., alex.mercer@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] outline-none text-xs transition-all text-[#2D332A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Local Secure Passcode <span className="text-[#9DA895] text-[10px] lowercase italic">(optional, for local login sessions)</span>
                    </label>
                    <input 
                      id="onboard_password"
                      type="password"
                      placeholder="Enter a passcode or leave blank"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] outline-none text-xs transition-all text-[#2D332A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-extrabold text-[#2D332A] flex items-center gap-2 tracking-tight">
                    <BookOpen className="h-5 w-5 text-[#5A6F4D]" />
                    Tell us about your educational milestones
                  </h2>
                  <p className="text-xs text-[#5D6659] mt-1">
                    Your current school details will refine your targets, countdowns, and academic schedule.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Educational Level
                    </label>
                    <select
                      id="onboard_level"
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white transition-all focus:border-[#5A6F4D]"
                    >
                      <option value="High School">High School</option>
                      <option value="College">College / AP Program</option>
                      <option value="University">Undergraduate University</option>
                      <option value="Post-Graduate">Post-Graduate (Master's / Ph.D.)</option>
                      <option value="Online Learner">Self-Taught / Professional Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      School / College / University <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="onboard_school"
                      type="text"
                      placeholder="e.g., Stanford University"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Current Semester or Grade <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="onboard_semester"
                      type="text"
                      placeholder="e.g., Fall 2026 / Grade 11"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Major / Study Focus <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="onboard_major"
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={academicMajor}
                      onChange={(e) => setAcademicMajor(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-[#5D6659] uppercase tracking-wider">
                      Target GPA Objective
                    </label>
                    <span className="text-xs font-extrabold text-[#5A6F4D]">{gpaTarget.toFixed(2)} / 4.00</span>
                  </div>
                  <input 
                    id="onboard_gpa"
                    type="range"
                    min="2.0"
                    max="4.0"
                    step="0.05"
                    value={gpaTarget}
                    onChange={(e) => setGpaTarget(parseFloat(e.target.value))}
                    className="w-full accent-[#5A6F4D] cursor-pointer h-1.5 bg-[#E4E8DA] rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Study Habits & Days */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-extrabold text-[#2D332A] flex items-center gap-2 tracking-tight">
                    <Clock className="h-5 w-5 text-[#5A6F4D]" />
                    Set your preferred study hours
                  </h2>
                  <p className="text-xs text-[#5D6659] mt-1">
                    Establish daily availability thresholds to calculate study pacing goals and schedule items correctly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-[#5D6659] uppercase tracking-wider">
                          Daily Study Availability
                        </label>
                        <span className="text-xs font-extrabold text-[#5A6F4D]">{dailyAvailability} hours / day</span>
                      </div>
                      <input 
                        id="onboard_availability"
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={dailyAvailability}
                        onChange={(e) => setDailyAvailability(parseInt(e.target.value))}
                        className="w-full accent-[#5A6F4D] cursor-pointer h-1.5 bg-[#E4E8DA] rounded-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                        Preferred Hours of Day
                      </label>
                      <div className="grid grid-cols-2 gap-2" id="onboard_study_hours_grid">
                        {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map(time => (
                          <button
                            id={`btn_onboard_pref_hours_${time}`}
                            key={time}
                            type="button"
                            onClick={() => setPreferredStudyHours(time)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                              preferredStudyHours === time 
                                ? 'bg-[#5A6F4D] text-white border-[#5A6F4D]' 
                                : 'bg-white text-[#5D6659] border-[#D9DED1] hover:bg-[#F8F9F4]'
                            }`}
                          >
                            {time === 'Morning' && '🌅 '}
                            {time === 'Afternoon' && '☀️ '}
                            {time === 'Evening' && '🌇 '}
                            {time === 'Night' && '🌌 '}
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">
                      Weekly Studying Plan (Days)
                    </label>
                    <p className="text-[11px] text-[#5D6659] mb-3">Choose the days you intend to log study sessions.</p>
                    <div className="grid grid-cols-7 gap-1.5" id="onboard_study_days_grid">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                        const isSelected = studyDays.includes(day);
                        return (
                          <button
                            id={`btn_onboard_study_day_${day}`}
                            key={day}
                            type="button"
                            onClick={() => toggleStudyDay(day)}
                            className={`aspect-square py-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col justify-center items-center cursor-pointer ${
                              isSelected 
                                ? 'bg-[#E4E8DA] text-[#5A6F4D] border-[#5A6F4D] font-extrabold' 
                                : 'bg-white text-[#9DA895] border-[#D9DED1] hover:bg-[#F8F9F4]'
                            }`}
                          >
                            <span>{day[0]}</span>
                            <span className="text-[8px] opacity-75">{day.slice(1)}</span>
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 p-3 bg-[#F8F9F4] rounded-xl border border-[#D9DED1]/50 text-[10px] text-[#5D6659] leading-relaxed flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#5A6F4D] shrink-0" />
                      <span>You have selected {studyDays.length} active study days per week ({studyDays.length * dailyAvailability} hours total).</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: System Preferences & Presets */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-extrabold text-[#2D332A] flex items-center gap-2 tracking-tight">
                    <Palette className="h-5 w-5 text-[#5A6F4D]" />
                    Theme & Academic Database Preset
                  </h2>
                  <p className="text-xs text-[#5D6659] mt-1">
                    Select your custom accent colors, timezone, and choose between a clean start or pre-populated academic dummy data.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Timezone */}
                    <div>
                      <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Time Zone</label>
                      <select
                        id="onboard_timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] text-xs text-[#2D332A] bg-white focus:border-[#5A6F4D]"
                      >
                        {timezones.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>

                    {/* Accent colors */}
                    <div>
                      <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">Workspace Accent Theme</label>
                      <div className="grid grid-cols-3 gap-2" id="onboard_accent_colors_grid">
                        {accents.map(acc => (
                          <button
                            id={`btn_onboard_accent_${acc.name.replace(/\s+/g, '_')}`}
                            key={acc.name}
                            type="button"
                            onClick={() => setAccentColor(acc.color)}
                            className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              accentColor === acc.color 
                                ? 'bg-[#F1F2EB] border-2 border-[#5A6F4D] text-[#2D332A]' 
                                : 'bg-white border-[#D9DED1] text-[#5D6659] hover:bg-[#F8F9F4]'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: acc.color }} />
                            <span className="truncate">{acc.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Theme selector */}
                    <div>
                      <label className="block text-xs font-bold text-[#5D6659] uppercase tracking-wider mb-2">Visual Palette Mode</label>
                      <div className="grid grid-cols-2 gap-3" id="onboard_theme_selector">
                        <button
                          id="btn_onboard_theme_light"
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                            theme === 'light' 
                              ? 'bg-[#E4E8DA] border-[#5A6F4D] text-[#2D332A] font-bold' 
                              : 'bg-white border-[#D9DED1] text-[#9DA895]'
                          }`}
                        >
                          <Sun className="h-4 w-4 text-amber-500" /> Light Mode
                        </button>
                        <button
                          id="btn_onboard_theme_dark"
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-[#2D332A] border-[#2D332A] text-white font-bold' 
                              : 'bg-white border-[#D9DED1] text-[#9DA895]'
                          }`}
                        >
                          <Moon className="h-4 w-4 text-indigo-400" /> Dark Mode
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8F9F4] p-4 rounded-2xl border border-[#D9DED1]/60 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#2D332A] flex items-center gap-1.5 uppercase tracking-wider">
                        <Bell className="h-4 w-4 text-[#5A6F4D]" />
                        Notification Center Setup
                      </h4>
                      <p className="text-[11px] text-[#5D6659] mt-1.5 leading-normal">
                        Choose your reminder frequency. Keep trackers active for pending deadlocks.
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        {['Morning', 'Afternoon', 'Evening'].map(time => (
                          <label key={time} className="flex items-center gap-2 text-xs text-[#2D332A] cursor-pointer" id={`label_onboard_notif_${time}`}>
                            <input 
                              id={`checkbox_onboard_notif_${time}`}
                              type="checkbox" 
                              checked={notificationTimes.includes(time)}
                              onChange={() => toggleNotificationTime(time)}
                              className="accent-[#5A6F4D] h-4 w-4 rounded"
                            />
                            <span>{time} Reminder alerts ({time === 'Morning' ? '8:00 AM' : time === 'Afternoon' ? '1:00 PM' : '7:00 PM'})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Data presets selector */}
                    <div className="pt-4 border-t border-[#D9DED1]/60 mt-4">
                      <span className="text-[10px] font-bold text-[#5D6659] uppercase tracking-widest block mb-2">Initial Account Content</span>
                      <div className="grid grid-cols-1 gap-2" id="onboard_data_preset">
                        <label 
                          id="label_preset_clean"
                          className={`p-3 rounded-xl border cursor-pointer text-left transition-all block ${
                            !loadDemo 
                              ? 'bg-white border-[#5A6F4D] ring-1 ring-[#5A6F4D]/20 shadow-sm' 
                              : 'bg-white/50 border-[#D9DED1]/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input 
                              id="radio_preset_clean"
                              type="radio" 
                              name="demo_preset" 
                              checked={!loadDemo}
                              onChange={() => setLoadDemo(false)}
                              className="accent-[#5A6F4D] mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-extrabold text-[#2D332A] block">Blank Slate (Highly Recommended)</span>
                              <span className="text-[10px] text-[#5D6659] block mt-0.5 leading-tight">Start with 0 subjects, 0 schedules, and 0 assignments. Configure everything according to your own routine.</span>
                            </div>
                          </div>
                        </label>

                        <label 
                          id="label_preset_demo"
                          className={`p-3 rounded-xl border cursor-pointer text-left transition-all block ${
                            loadDemo 
                              ? 'bg-[#E4E8DA]/40 border-[#5A6F4D] ring-1 ring-[#5A6F4D]/20 shadow-sm' 
                              : 'bg-white/50 border-[#D9DED1]/70 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input 
                              id="radio_preset_demo"
                              type="radio" 
                              name="demo_preset" 
                              checked={loadDemo}
                              onChange={() => setLoadDemo(true)}
                              className="accent-[#5A6F4D] mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-extrabold text-[#2D332A] block flex items-center gap-1">
                                Populate Demo Content
                                <span className="bg-[#5A6F4D] text-white text-[8px] px-1 py-0.2 rounded font-mono uppercase font-black">PRESET</span>
                              </span>
                              <span className="text-[10px] text-[#5D6659] block mt-0.5 leading-tight">Fill the database with labeled mockup courses, assignments, and test counters for quick sandbox exploration.</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions Footer buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-[#D9DED1]/40 mt-6" id="onboarding_footer_buttons">
              <button
                id="btn_onboard_back"
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all outline-none ${
                  step === 1 
                    ? 'opacity-0 pointer-events-none' 
                    : 'bg-white text-[#5D6659] border-[#D9DED1] hover:bg-[#F8F9F4] cursor-pointer'
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous Step
              </button>

              <button
                id="btn_onboard_next"
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all outline-none cursor-pointer shadow-sm hover:shadow-md"
              >
                {step === totalSteps ? 'Complete Workspace Setup' : 'Continue Step'}
                {step === totalSteps ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 text-[10px] text-[#9DA895] flex items-center gap-1 font-mono">
        <span>Smart Study Planner v2.0 • Secured Offline Engine</span>
      </div>
    </div>
  );
}
