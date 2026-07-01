import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, ShieldCheck, Mail, GraduationCap, Award, BookOpen, 
  Clock, Heart, Sliders, ToggleLeft, Palette, Globe, 
  Bell, FileJson, Upload, Download, Eye, EyeOff
} from 'lucide-react';
import { UserProfile, Subject } from '../types';

interface ProfilePanelProps {
  user: UserProfile;
  subjects: Subject[];
  onUpdateProfile: (p: UserProfile) => void;
}

export default function ProfilePanel({ user, subjects, onUpdateProfile }: ProfilePanelProps) {
  // Profile states
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState(user.academicLevel || 'Undergraduate');
  const [major, setMajor] = useState(user.academicMajor || 'Computer Science');
  const [gpa, setGpa] = useState(user.gpaTarget.toString());
  const [picUrl, setPicUrl] = useState(user.profilePic || '');
  const [school, setSchool] = useState(user.school || '');
  const [semester, setSemester] = useState(user.semester || '');
  
  // Customization & Settings states
  const [timezone, setTimezone] = useState(user.timezone || 'UTC');
  const [preferredStudyHours, setPreferredStudyHours] = useState(user.preferredStudyHours || 'Evening');
  const [dailyAvailability, setDailyAvailability] = useState(user.dailyAvailability || 4);
  const [theme, setTheme] = useState(user.theme || 'light');
  const [accentColor, setAccentColor] = useState(user.accentColor || '#5A6F4D');
  const [language, setLanguage] = useState(user.language || 'English');
  const [timeFormat, setTimeFormat] = useState(user.timeFormat || '12');
  const [dateFormat, setDateFormat] = useState(user.dateFormat || 'MM/DD/YYYY');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled !== false);

  const [success, setSuccess] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState('');

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !major || !school || !semester) return;

    onUpdateProfile({
      ...user,
      name: name.trim(),
      academicLevel: level,
      academicMajor: major.trim(),
      school: school.trim(),
      semester: semester.trim(),
      gpaTarget: parseFloat(gpa) || 4.0,
      profilePic: picUrl,
      timezone,
      preferredStudyHours,
      dailyAvailability,
      theme,
      accentColor,
      language,
      timeFormat,
      dateFormat,
      notificationsEnabled
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  // Backup and Restore implementation
  const handleExportBackup = () => {
    const keysToBackup = [
      'planner_user',
      'planner_subjects',
      'planner_plans',
      'planner_tasks',
      'planner_assignments',
      'planner_exams',
      'planner_sessions',
      'planner_notifications',
      'planner_events'
    ];

    const backupData: Record<string, string | null> = {};
    keysToBackup.forEach(k => {
      backupData[k] = localStorage.getItem(k);
    });

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartStudyPlanner_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError('');
    setRestoreSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Invalid backup file layout.');
        }

        // Restore keys
        Object.entries(parsed).forEach(([key, val]) => {
          if (key.startsWith('planner_') && val) {
            localStorage.setItem(key, val as string);
          }
        });

        setRestoreSuccess('Backup data uploaded successfully! Reloading workspace...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setRestoreError('Failed to parse file. Make sure it is a valid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const accents = [
    { name: 'Sage Green', color: '#5A6F4D' },
    { name: 'Classic Blue', color: '#3B82F6' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Amethyst Purple', color: '#8B5CF6' },
    { name: 'Amber Sunset', color: '#F59E0B' },
    { name: 'Crimson Rose', color: '#EF4444' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans" id="profile_panel_tab">
      
      {/* Settings Row Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
          <User className="h-5 w-5 text-[#5A6F4D]" />
          My Profile & Settings
        </h2>
        <p className="text-xs text-[#5D6659]">Configure your student details, academic targets, timezone metrics, visual theme, and backups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card Summary Col */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm text-center flex flex-col justify-between h-auto">
            <div className="space-y-4">
              {/* Avatar block */}
              <div 
                className="relative mx-auto w-24 h-24 rounded-full text-white font-extrabold flex items-center justify-center text-3xl shadow-sm border"
                style={{ backgroundColor: accentColor }}
              >
                {picUrl ? (
                  <img referrerPolicy="no-referrer" src={picUrl} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  getInitials(name)
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-[#2D332A] leading-tight">{name}</h3>
                <p className="text-xs text-[#5D6659] mt-1">{level} student</p>
                <p className="text-[10px] text-[#9DA895] font-mono mt-0.5">{school}</p>
                <span className="bg-[#E4E8DA]/60 text-[#5A6F4D] text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-2.5">
                  GPA Goal: {gpa}
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-[#D9DED1]/40 space-y-2 mt-6">
              <div className="flex justify-between text-xs text-[#5D6659]">
                <span>Major / Focus:</span>
                <span className="font-bold text-[#2D332A] truncate max-w-[120px]">{major}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5D6659]">
                <span>Grade/Semester:</span>
                <span className="font-bold text-[#2D332A]">{semester}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5D6659]">
                <span>Subjects:</span>
                <span className="font-bold text-[#2D332A]">{subjects.length} Coursework</span>
              </div>
            </div>
          </div>

          {/* Backup & Restore card */}
          <div className="bg-white p-5 rounded-3xl border border-[#D9DED1]/60 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#2D332A] uppercase tracking-wider flex items-center gap-1.5">
              <FileJson className="h-4 w-4 text-[#5A6F4D]" />
              Data Backup & Restore
            </h4>
            <p className="text-[11px] text-[#5D6659] leading-relaxed">
              Export your registered assignments, study hours, subjects, and exams as a downloadable JSON file, or restore them anytime.
            </p>

            {restoreError && (
              <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">{restoreError}</div>
            )}
            {restoreSuccess && (
              <div className="text-[11px] text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">{restoreSuccess}</div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                id="btn_backup_export"
                type="button"
                onClick={handleExportBackup}
                className="w-full bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" /> Export Backup File
              </button>

              <label 
                id="label_backup_import"
                className="w-full bg-white hover:bg-[#F8F9F4] text-[#2D332A] border border-[#D9DED1] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
              >
                <Upload className="h-4 w-4" /> Import Backup File
                <input 
                  id="input_backup_file"
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Action Controls Col */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#D9DED1]/60 shadow-sm">
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-2xl flex items-center gap-1.5"
              id="alert_success_profile"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Student profile settings updated successfully! Theme preference applied.</span>
            </motion.div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#5A6F4D] uppercase tracking-wider pb-1 border-b border-[#D9DED1]/40">Personal Student Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Full Student Name</label>
                  <input 
                    id="input_profile_name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Email Address (Immutable)</label>
                  <input 
                    type="text" 
                    value={user.email || 'N/A'} 
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1]/40 outline-none text-xs text-[#9DA895] bg-[#F8F9F4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Educational Level</label>
                  <select 
                    id="select_profile_level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                    <option value="University">University</option>
                    <option value="Post-Graduate">Post-Graduate</option>
                    <option value="Online Learner">Online Learner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">School / College / University</label>
                  <input 
                    id="input_profile_school"
                    type="text" 
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Current Semester or Grade</label>
                  <input 
                    id="input_profile_semester"
                    type="text" 
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Academic Major Concentration</label>
                  <input 
                    id="input_profile_major"
                    type="text" 
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Avatar Picture URL</label>
                  <input 
                    id="input_profile_pic"
                    type="url" 
                    placeholder="https://images.unsplash.com/photo-example" 
                    value={picUrl}
                    onChange={(e) => setPicUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] focus:border-[#5A6F4D] outline-none text-xs text-[#2D332A]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#5D6659] uppercase tracking-wider">Target GPA ({gpa})</label>
                  </div>
                  <input 
                    id="slider_profile_gpa"
                    type="range"
                    min="2.0"
                    max="4.0"
                    step="0.05"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    className="w-full accent-[#5A6F4D] cursor-pointer h-1.5 bg-[#E4E8DA] rounded-full mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Study Habits & Preferences */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#5A6F4D] uppercase tracking-wider pb-1 border-b border-[#D9DED1]/40">Study Habits & Schedule</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Time Zone</label>
                  <select 
                    id="select_profile_timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white font-mono"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST (New York)</option>
                    <option value="America/Chicago">CST (Chicago)</option>
                    <option value="America/Los_Angeles">PST (Los Angeles)</option>
                    <option value="Europe/London">GMT (London)</option>
                    <option value="Asia/Kolkata">IST (Kolkata)</option>
                    <option value="Asia/Singapore">SGT (Singapore)</option>
                    <option value="Asia/Tokyo">JST (Tokyo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Preferred Hours</label>
                  <select 
                    id="select_profile_study_hours"
                    value={preferredStudyHours}
                    onChange={(e) => setPreferredStudyHours(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    <option value="Morning">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="Afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening">Evening (4:00 PM - 8:00 PM)</option>
                    <option value="Night">Night (8:00 PM - 12:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Daily Study Goal</label>
                  <select 
                    id="select_profile_availability"
                    value={dailyAvailability}
                    onChange={(e) => setDailyAvailability(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hours => (
                      <option key={hours} value={hours}>{hours} Hours / Day</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: App Styling & Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#5A6F4D] uppercase tracking-wider pb-1 border-b border-[#D9DED1]/40">System Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Accent Colors</label>
                  <div className="flex gap-2 items-center h-10" id="profile_accent_selector">
                    {accents.map(acc => (
                      <button
                        id={`btn_profile_accent_${acc.name.replace(/\s+/g, '_')}`}
                        key={acc.name}
                        type="button"
                        onClick={() => setAccentColor(acc.color)}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          accentColor === acc.color ? 'ring-2 ring-offset-2 ring-[#5A6F4D]' : ''
                        }`}
                        style={{ backgroundColor: acc.color }}
                        title={acc.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Palette Theme Mode</label>
                  <div className="flex gap-4 items-center h-10" id="profile_theme_toggle">
                    <label className="flex items-center gap-2 text-xs text-[#2D332A] cursor-pointer">
                      <input 
                        id="radio_profile_theme_light"
                        type="radio" 
                        name="profile_theme" 
                        checked={theme === 'light'} 
                        onChange={() => setTheme('light')}
                        className="accent-[#5A6F4D]"
                      />
                      <span>Light Canvas</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#2D332A] cursor-pointer">
                      <input 
                        id="radio_profile_theme_dark"
                        type="radio" 
                        name="profile_theme" 
                        checked={theme === 'dark'} 
                        onChange={() => setTheme('dark')}
                        className="accent-[#5A6F4D]"
                      />
                      <span>Dark Palette</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">System Language</label>
                  <select 
                    id="select_profile_lang"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Time Format</label>
                  <select 
                    id="select_profile_time_format"
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    <option value="12">12-Hour Clock (e.g. 7:00 PM)</option>
                    <option value="24">24-Hour Clock (e.g. 19:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D6659] uppercase tracking-wider mb-1.5">Date Format</label>
                  <select 
                    id="select_profile_date_format"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs text-[#2D332A] cursor-pointer" id="label_profile_notif_enable">
                  <input 
                    id="checkbox_profile_notif_enable"
                    type="checkbox" 
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="accent-[#5A6F4D] h-4 w-4 rounded"
                  />
                  <span>Enable daily desktop alert sounds and deadline reminders</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D9DED1]/40 flex justify-end">
              <button 
                id="btn_submit_profile"
                type="submit" 
                className="px-6 py-3 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" /> Save App Settings & Profile
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
