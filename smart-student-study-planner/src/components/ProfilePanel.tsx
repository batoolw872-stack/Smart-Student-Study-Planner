import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Mail, GraduationCap, Award, BookOpen, Clock, Heart, Sliders, ToggleLeft } from 'lucide-react';
import { UserProfile, Subject } from '../types';

interface ProfilePanelProps {
  user: UserProfile;
  subjects: Subject[];
  onUpdateProfile: (p: UserProfile) => void;
}

export default function ProfilePanel({ user, subjects, onUpdateProfile }: ProfilePanelProps) {
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState(user.academicLevel || 'Undergraduate');
  const [major, setMajor] = useState(user.academicMajor || 'Computer Science');
  const [gpa, setGpa] = useState(user.gpaTarget.toString());
  const [picUrl, setPicUrl] = useState(user.profilePic || '');
  const [success, setSuccess] = useState(false);

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
    if (!name || !major) return;

    onUpdateProfile({
      id: user.id,
      name: name.trim(),
      email: user.email,
      academicLevel: level,
      academicMajor: major.trim(),
      gpaTarget: parseFloat(gpa) || 4.0,
      profilePic: picUrl
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans" id="profile_panel_tab">
      
      {/* Settings Row Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-850 font-sans flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Academic Profile & Settings
        </h2>
        <p className="text-xs text-slate-400">Configure personal information, level markers, target GPA thresholds, and avatars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary Col */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col justify-between">
          <div className="space-y-4">
            {/* Avatar block */}
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-3xl shadow-md">
              {picUrl ? (
                <img referrerPolicy="no-referrer" src={picUrl} alt={name} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(name)
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 leading-tight">{name}</h3>
              <p className="text-xs text-slate-400 mt-1">{level} student</p>
              <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-2">
                GPA Goal: {user.gpaTarget}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 space-y-2 mt-6">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Primary focus:</span>
              <span className="font-bold text-slate-700 truncate max-w-[120px]">{major}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Course volume:</span>
              <span className="font-bold text-slate-700">{subjects.length} Subjects</span>
            </div>
          </div>
        </div>

        {/* Action Controls Col */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-xl flex items-center gap-1.5"
              id="alert_success_profile"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Student profile settings updated successfully!</span>
            </motion.div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Student Name</label>
                <input 
                  id="input_profile_name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Coordinates (Immutable)</label>
                <input 
                  type="text" 
                  value={user.email} 
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 outline-none text-xs text-slate-400 bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Academic Grade Level</label>
                <select 
                  id="select_profile_level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white"
                >
                  <option value="High School">High Schooler</option>
                  <option value="Undergraduate">Undergraduate Student</option>
                  <option value="Post-Graduate">Post-Graduate Scholar</option>
                  <option value="Online Learner">Online self-learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Academic Major / Core Field</label>
                <input 
                  id="input_profile_major"
                  type="text" 
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Secure Avatar Picture URL</label>
              <input 
                id="input_profile_pic"
                type="url" 
                placeholder="https://images.unsplash.com/photo-example" 
                value={picUrl}
                onChange={(e) => setPicUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-50">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">GPA Achievement Threshold Target</span>
                <span className="text-blue-600 font-bold">{gpa} / 4.00</span>
              </div>
              <input 
                id="slider_profile_gpa"
                type="range"
                min="1.0"
                max="4.0"
                step="0.05"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-150 rounded"
              />
            </div>

            <button 
              id="btn_submit_profile"
              type="submit" 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <ShieldCheck className="h-4 w-4" /> Save Academic Profiles
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
