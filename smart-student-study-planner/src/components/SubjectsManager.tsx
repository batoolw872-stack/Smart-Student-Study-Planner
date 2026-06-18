import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, Trash2, Calendar, Target, Award, ShieldAlert, GraduationCap, Clock } from 'lucide-react';
import { Subject, StudyPlan } from '../types';

interface SubjectsManagerProps {
  subjects: Subject[];
  plans: StudyPlan[];
  onAddSubject: (subj: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddPlan: (plan: StudyPlan) => void;
  onDeletePlan: (id: string) => void;
}

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6'];

export default function SubjectsManager({
  subjects,
  plans,
  onAddSubject,
  onDeleteSubject,
  onAddPlan,
  onDeletePlan
}: SubjectsManagerProps) {
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  // Subject Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [credits, setCredits] = useState('3');
  const [professor, setProfessor] = useState('');
  const [location, setLocation] = useState('');

  // Plan Form State
  const [planSubject, setPlanSubject] = useState('');
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState('5');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const submitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    const newSubject: Subject = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      code: code.toUpperCase().trim(),
      name: name.trim(),
      color,
      credits: Number(credits) || 3,
      professor: professor.trim() || 'TBD',
      location: location.trim() || 'TBD'
    };

    onAddSubject(newSubject);
    setCode('');
    setName('');
    setColor('#3B82F6');
    setProfessor('');
    setLocation('');
    setShowSubjectForm(false);
  };

  const submitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle || !startDate || !endDate) return;

    const newPlan: StudyPlan = {
      id: `plan-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: planSubject ? planSubject : null,
      title: planTitle.trim(),
      description: planDesc.trim(),
      weeklyHoursGoal: Number(weeklyGoal) || 5,
      startDate,
      endDate
    };

    onAddPlan(newPlan);
    setPlanSubject('');
    setPlanTitle('');
    setPlanDesc('');
    setWeeklyGoal('5');
    setStartDate('');
    setEndDate('');
    setShowPlanForm(false);
  };

  const getSubjectName = (id: string | null) => {
    return subjects.find(s => s.id === id)?.name || 'General / Other';
  };

  const getSubjectColor = (id: string | null) => {
    return subjects.find(s => s.id === id)?.color || '#94a3b8';
  };

  return (
    <div className="space-y-8" id="subjects_planner_tab">
      
      {/* Subject Courses Row Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#5A6F4D]" />
            Subject Management
          </h2>
          <p className="text-xs text-[#5D6659]">Add courses, assign colors, locate classes, and designate professors.</p>
        </div>
        
        <button 
          id="btn_open_subj_form"
          onClick={() => setShowSubjectForm(!showSubjectForm)}
          className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all self-start"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      {showSubjectForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-[2rem] border border-[#D9DED1] shadow-sm max-w-2xl"
          id="subj_form"
        >
          <form onSubmit={submitSubject} className="space-y-4">
            <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider">New Course Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Subject Code</label>
                <input 
                  id="input_subj_code"
                  type="text" 
                  placeholder="e.g. CS-301, MATH-201" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Subject Name</label>
                <input 
                  id="input_subj_name"
                  type="text" 
                  placeholder="e.g. Relational Databases" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Credit Units</label>
                <input 
                  id="input_subj_credits"
                  type="number" 
                  min="1" 
                  max="10" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={credits} 
                  onChange={(e) => setCredits(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Primary Professor</label>
                <input 
                  id="input_subj_prof"
                  type="text" 
                  placeholder="Dr. Watson" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={professor} 
                  onChange={(e) => setProfessor(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Class Room Location</label>
                <input 
                  id="input_subj_loc"
                  type="text" 
                  placeholder="Science Bldg Rm 4B" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
            </div>

            {/* Color Palette Choice */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Hex Identifier Color</label>
              <div className="flex gap-2">
                {PALETTE.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                id="btn_cancel_subj"
                type="button" 
                onClick={() => setShowSubjectForm(false)} 
                className="px-4 py-2 bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="btn_save_subj"
                type="submit" 
                className="px-4 py-2 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save Subject
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="subjects_deck">
        {subjects.map(s => (
          <div 
            key={s.id} 
            className="bg-white rounded-2xl p-5 border border-[#D9DED1]/60 shadow-sm relative overflow-hidden flex flex-col justify-between h-[170px]"
          >
            <div className="absolute right-0 top-0 w-1.5 h-full" style={{ backgroundColor: s.color }} />
            
            <div className="space-y-1 truncate pr-4 text-[#2D332A]">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                {s.code}
              </span>
              <h3 className="text-sm font-bold text-[#2D332A] truncate mt-1">{s.name}</h3>
              <p className="text-[11px] text-[#5D6659]">Inst: {s.professor}</p>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div className="text-[10px] font-mono text-[#5D6659]">
                <span className="block">{s.credits} Credits</span>
                <span className="block truncate max-w-[120px]">Local: {s.location}</span>
              </div>
              <button 
                id={`btn_delete_subj_${s.id}`}
                onClick={() => onDeleteSubject(s.id)} 
                className="p-1 px-2 text-[#9DA895] hover:text-red-500 rounded border border-transparent hover:border-red-100 transition-all cursor-pointer"
                title="Delete Subject"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full bg-[#F8F9F4] border border-dashed border-[#D9DED1] rounded-2xl p-8 text-center text-[#5D6659]">
            <ShieldAlert className="h-8 w-8 mx-auto text-[#9DA895] mb-2" />
            <p className="text-xs font-semibold">No active subject course models added.</p>
          </div>
        )}
      </div>

      <hr className="border-[#D9DED1]/40" />

      {/* Study Goals / Plans Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <Target className="h-5 w-5 text-[#D4A373]" />
            Academic Study Goals
          </h2>
          <p className="text-xs text-[#5D6659]">Establish target study hours per course module and monitor consistency.</p>
        </div>
        
        <button 
          id="btn_open_plan_form"
          onClick={() => setShowPlanForm(!showPlanForm)}
          className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all self-start"
        >
          <Plus className="h-4 w-4" /> Add Study Goal
        </button>
      </div>

      {showPlanForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-[2rem] border border-[#D9DED1] shadow-sm max-w-2xl"
          id="plan_form"
        >
          <form onSubmit={submitPlan} className="space-y-4">
            <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider font-sans">Initialize Academic Goal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2D332A]">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Connect Course (Optional)</label>
                <select 
                  id="select_plan_subject"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={planSubject}
                  onChange={(e) => setPlanSubject(e.target.value)}
                >
                  <option value="">General Project / Other</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Goal Action Title</label>
                <input 
                  id="input_plan_title"
                  type="text" 
                  placeholder="e.g. Master Linear Algebra Chapter 4" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={planTitle} 
                  onChange={(e) => setPlanTitle(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D6659] mb-1">Detailed Description</label>
              <textarea 
                id="input_plan_desc"
                placeholder="List key topics, pages to read, or practice sets to accomplish..."
                className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] h-20 resize-none"
                value={planDesc} 
                onChange={(e) => setPlanDesc(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#2D332A]">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Weekly Hours Goal</label>
                <input 
                  id="input_plan_weekly_hours"
                  type="number" 
                  min="1" 
                  max="100" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={weeklyGoal} 
                  onChange={(e) => setWeeklyGoal(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Plan Start Date</label>
                <input 
                  id="input_plan_start_date"
                  type="date" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Plan Target Date</label>
                <input 
                  id="input_plan_end_date"
                  type="date" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                id="btn_cancel_plan"
                type="button" 
                onClick={() => setShowPlanForm(false)} 
                className="px-4 py-2 bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="btn_save_plan"
                type="submit" 
                className="px-4 py-2 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Launch Study Goal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Goals listing deck */}
      <div className="space-y-4" id="plans_list">
        {plans.map(p => {
          const subColor = getSubjectColor(p.subjectId);
          const subName = getSubjectName(p.subjectId);
          return (
            <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#D9DED1]/60 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center text-[#2D332A]">
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subColor }} />
                  <span className="text-[10px] font-bold font-mono uppercase text-[#9DA895]">
                    {subName}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#2D332A] font-sans">{p.title}</h3>
                <p className="text-xs text-[#5D6659] truncate max-w-xl">{p.description}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#9DA895] pt-1">
                  <span className="flex items-center gap-1 font-semibold text-[#5D6659]">
                    <Clock className="w-3 h-3 text-[#9DA895]" /> Goal: {p.weeklyHoursGoal}h weekly
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#5D6659]">
                    <Calendar className="w-3 h-3 text-[#9DA895]" /> Span: {p.startDate} to {p.endDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-stretch justify-between md:self-auto shrink-0 border-t md:border-t-0 border-[#D9DED1]/10 pt-2 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5A6F4D] bg-[#E4E8DA]/65 px-2.5 py-1 rounded-full border border-[#D9DED1]">
                    Active Study Plan
                  </span>
                </div>
                <button 
                  id={`btn_delete_plan_${p.id}`}
                  onClick={() => onDeletePlan(p.id)}
                  className="p-1 px-2 text-[#9DA895] hover:text-red-500 rounded border border-transparent hover:border-red-100 transition-all cursor-pointer"
                  title="Remove Plan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {plans.length === 0 && (
          <div className="bg-[#F8F9F4] border border-dashed border-[#D9DED1] rounded-2xl p-8 text-center text-[#5D6659]">
            <Award className="h-8 w-8 mx-auto text-[#9DA895] mb-2" />
            <p className="text-xs font-semibold">No study planner goals configured.</p>
          </div>
        )}
      </div>
    </div>
  );
}
