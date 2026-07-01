import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle, TrendingUp, Award, ListTodo, Star, Hourglass } from 'lucide-react';
import { Subject, Task, Assignment, Exam, StudySession, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  subjects: Subject[];
  plansCount: number;
  tasks: Task[];
  assignments: Assignment[];
  exams: Exam[];
  sessions: StudySession[];
  onTabChange: (tab: string) => void;
  onToggleTask: (id: string) => void;
}

export default function Dashboard({
  user,
  subjects,
  plansCount,
  tasks,
  assignments,
  exams,
  sessions,
  onTabChange,
  onToggleTask
}: DashboardProps) {
  // Stat calculations
  const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);
  const pendingTasks = tasks.filter(t => !t.isCompleted).length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Today's pending tasks
  const todayTasks = tasks.filter(t => !t.isCompleted).slice(0, 3);
  
  // Pending Assignments
  const pendingAssignments = assignments.filter(a => a.status !== 'Completed').slice(0, 3);

  // Find next exam & build countdown
  const nextExam = exams
    .filter(e => new Date(e.examDate).getTime() > Date.now())
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0];

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getSubjectInfo = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId) || { code: 'GEN', name: 'General/Other', color: '#94a3b8' };
  };

  // Prepare custom analytical metrics
  // Hours studied per subject
  const subjectStudyMap: { [key: string]: number } = {};
  subjects.forEach(s => { subjectStudyMap[s.id] = 0; });
  sessions.forEach(sess => {
    if (subjectStudyMap[sess.subjectId] !== undefined) {
      subjectStudyMap[sess.subjectId] += sess.durationMinutes;
    } else {
      subjectStudyMap[sess.subjectId] = sess.durationMinutes;
    }
  });

  const chartData = subjects.map(s => ({
    name: s.name,
    code: s.code,
    color: s.color,
    hours: (subjectStudyMap[s.id] / 60).toFixed(1)
  }));

  // Weekly study hours distribution (Mon-Sun approximation)
  const weekdayStudyHours = [
    { day: 'Mon', h: 2.0 },
    { day: 'Tue', h: 1.5 },
    { day: 'Wed', h: 1.0 },
    { day: 'Thu', h: 3.25 },
    { day: 'Fri', h: 0.8 },
    { day: 'Sat', h: 4.5 },
    { day: 'Sun', h: 3.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-white to-[#FDFEFA] rounded-[2rem] p-6 md:p-8 shadow-sm border border-[#D9DED1] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative" id="welcome_banner">
        <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
          <BookOpen className="w-24 h-24 text-[#5A6F4D] rotate-12" />
        </div>
        <div className="space-y-3 relative z-10">
          <span className="bg-[#E4E8DA] text-[#5A6F4D] text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider block w-fit">
            Academic Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#2D332A] mt-1">
            Hello, {user.name}! 👋
          </h1>
          <p className="text-[#5D6659] text-sm md:text-base max-w-xl">
            You've completed <span className="text-[#5A6F4D] font-bold">{completionRate}%</span> of your study goals this week. Target GPA is <strong className="text-[#D4A373]">{user.gpaTarget}</strong> in <span className="underline italic text-[#5A6F4D] font-medium">{user.academicMajor}</span>.
          </p>

          <button 
            id="btn_quick_timer" 
            onClick={() => onTabChange('timer')}
            className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer text-xs"
          >
            <Clock className="h-4 w-4 animate-spin-slow" /> Start Study Timer
          </button>
        </div>

        {/* Dynamic score summary block matching template */}
        <div className="flex gap-4 shrink-0 relative z-10">
          <div className="text-center bg-[#F1F2EB] px-5 py-3 rounded-2xl border border-[#D9DED1]/50 shadow-sm">
            <p className="text-2xl font-black text-[#5A6F4D]">{totalStudyHours}</p>
            <p className="text-[10px] uppercase font-bold text-[#9DA895] tracking-widest mt-0.5">Study Hrs</p>
          </div>
          <div className="text-center bg-[#F1F2EB] px-5 py-3 rounded-2xl border border-[#D9DED1]/50 shadow-sm">
            <p className="text-2xl font-black text-[#D4A373]">{user.gpaTarget}</p>
            <p className="text-[10px] uppercase font-bold text-[#9DA895] tracking-widest mt-0.5">Curr GPA</p>
          </div>
        </div>
      </div>

      {/* Metrics Widgets Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metrics_grid">
        {/* Widget 1 */}
        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#D9DED1] flex items-center gap-4 text-[#2D332A]">
          <div className="p-3 bg-[#E4E8DA] text-[#5A6F4D] rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9DA895] block uppercase tracking-wider">Subjects</span>
            <span className="text-xl font-bold text-[#2D332A] block leading-none mt-1">{subjects.length}</span>
            <span className="text-[10px] text-[#5D6659] mt-1 block font-semibold">{totalCredits} Credits</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#D9DED1] flex items-center gap-4 text-[#2D332A]">
          <div className="p-3 bg-[#E4E8DA] text-[#5A6F4D] rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9DA895] block uppercase tracking-wider">Study Hours</span>
            <span className="text-xl font-bold text-[#2D332A] block leading-none mt-1">{totalStudyHours}h</span>
            <span className="text-[10px] text-[#5A6F4D] font-bold mt-1 block">Active Log</span>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#D9DED1] flex items-center gap-4 text-[#2D332A]">
          <div className="p-3 bg-[#FDE7D1] text-[#D4A373] rounded-xl">
            <ListTodo className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9DA895] block uppercase tracking-wider">Tasks Left</span>
            <span className="text-xl font-bold text-[#2D332A] block leading-none mt-1">{pendingTasks}</span>
            <span className="text-[10px] text-[#5D6659] mt-1 block font-semibold">{completionRate}% Done</span>
          </div>
        </div>

        {/* Widget 4 */}
        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#D9DED1] flex items-center gap-4 text-[#2D332A]">
          <div className="p-3 bg-[#E4E8DA] text-[#5A6F4D] rounded-xl">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9DA895] block uppercase tracking-wider">Study Goals</span>
            <span className="text-xl font-bold text-[#2D332A] block leading-none mt-1">{plansCount}</span>
            <span className="text-[10px] text-[#5A6F4D] font-bold mt-1 block">Goal: {user.gpaTarget}</span>
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Exam Countdown Widget */}
          {nextExam ? (
            <div className="bg-[#5A6F4D] p-6 rounded-[2rem] text-white shadow-sm relative overflow-hidden" id="dash_exam_countdown">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                <div>
                  <span className="bg-white/20 text-[#E4E8DA] text-[9px] uppercase font-bold px-2 py-0.5 rounded-md tracking-wider">
                    Next Exam Alert
                  </span>
                  <h3 className="text-2xl font-black text-white font-sans mt-2">
                    {nextExam.title}
                  </h3>
                  <p className="text-xs text-[#A3B18A] font-sans mt-0.5">
                    Course: <strong className="text-white">{getSubjectInfo(nextExam.subjectId).name}</strong>
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <div className="pulse-countdown inline-flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <div className="text-center pr-2 border-r border-white/25">
                      <p className="text-xl font-black leading-none">{String(getDaysRemaining(nextExam.examDate)).padStart(2, '0')}</p>
                      <p className="text-[8px] uppercase tracking-widest opacity-60 mt-0.5">Days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black leading-none text-[#D4A373]">Active</p>
                      <p className="text-[8px] uppercase tracking-widest opacity-60 mt-0.5">Timer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mb-4 relative z-10">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-white/80">Preparation Readiness</span>
                  <span className="font-bold text-[#D4A373]">{nextExam.preparationProgress}%</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#A3B18A] h-full rounded-full transition-all duration-500"
                    style={{ width: `${nextExam.preparationProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-between pt-3 border-t border-white/10 relative z-10">
                <span className="text-xs text-[#E4E8DA] truncate max-w-sm">
                  📚 Notes: {nextExam.notes || 'No notes added yet.'}
                </span>
                <button 
                  id="btn_goto_exams" 
                  onClick={() => onTabChange('exams')}
                  className="text-xs font-semibold text-white hover:underline hover:text-[#E4E8DA] outline-none"
                >
                  Manage Exams &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#D9DED1] text-center py-8" id="dash_no_exams">
              <Calendar className="h-8 w-8 mx-auto text-[#9DA895] mb-2" />
              <p className="text-sm font-semibold text-[#5D6659]">No upcoming exams found.</p>
              <button 
                id="btn_add_exam_dash"
                onClick={() => onTabChange('exams')} 
                className="text-xs text-[#5A6F4D] hover:underline font-semibold mt-1 outline-none"
              >
                Schedule an exam now +
              </button>
            </div>
          )}

          {/* Productivity Analytics Sections (Custom High Fidelity SVG Graphics) */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#D9DED1] text-[#2D332A]" id="dash_charts">
            <h3 className="text-base font-bold text-[#2D332A] font-sans mb-4">
              Study Performance Analytics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart 1: Subject Hours breakdown */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-[#9DA895] uppercase tracking-wider block mb-2">
                  Total Studied Hours By Subject
                </h4>
                
                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          <span className="font-bold text-[#2D332A]">{data.code}</span>
                          <span className="text-[#5D6659] font-normal truncate max-w-[120px]">{data.name}</span>
                        </div>
                        <span className="font-bold text-[#2D332A]">{data.hours} hours</span>
                      </div>
                      
                      {/* Bar row */}
                      <div className="w-full bg-[#F1F2EB] h-2.5 rounded-full overflow-hidden border border-[#D9DED1]/30">
                        <div 
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            backgroundColor: data.color, 
                            width: `${Math.min(100, (Number(data.hours) / 10) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {chartData.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No courses added. Please create courses in Study Planner panel.</p>
                  )}
                </div>
              </div>

              {/* Chart 2: Week-by-Week Distribution SVG line diagram */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-[#9DA895] uppercase tracking-wider block mb-2">
                  Weekly Studies Rhythm (Hours)
                </h4>
                
                <div className="bg-[#F8F9F4] p-4 rounded-2xl border border-[#D9DED1] flex flex-col justify-between h-[180px]">
                  {/* SVG Bar layout */}
                  <div className="flex items-end justify-between h-[120px] px-2 mb-2">
                    {weekdayStudyHours.map((w, idx) => {
                      const heightPercent = Math.min(100, (w.h / 5) * 100);
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1 group w-full">
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 bg-[#2D332A] text-[#F8F9F4] text-[10px] px-1.5 py-0.5 rounded absolute -translate-y-8 duration-200 pointer-events-none z-10 font-sans">
                            {w.h} hrs
                          </div>
                          <div 
                            className="bg-[#A3B18A] hover:bg-[#5A6F4D] rounded-t w-5 transition-all duration-500"
                            style={{ height: `${heightPercent || 5}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Labels Mon-Sun */}
                  <div className="flex justify-between px-2 text-[10px] text-[#9DA895] font-mono">
                    {weekdayStudyHours.map((w, idx) => (
                      <span key={idx} className="w-5 text-center">{w.day}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5A6F4D] bg-[#E4E8DA]/85 px-3 py-2 rounded-lg border border-[#D9DED1]/50">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Your study consistency increased by 14% this week!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column Side Cards */}
        <div className="space-y-6">
          
          {/* Today's Tasks Component */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#D9DED1] text-[#2D332A]" id="dash_tasks_widget">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#2D332A] font-sans">
                Today's Tasks
              </h3>
              <button 
                id="btn_view_tasks" 
                onClick={() => onTabChange('tasks')}
                className="text-xs font-semibold text-[#5A6F4D] hover:underline outline-none"
              >
                All &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {todayTasks.map((t, idx) => (
                <div 
                  key={t.id} 
                  className="flex items-center gap-3 p-3 bg-[#F8F9F4] hover:bg-[#E4E8DA]/40 cursor-pointer rounded-xl border border-[#D9DED1]/50 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => onToggleTask(t.id)}
                    className="w-4 h-4 text-[#5A6F4D] accent-[#5A6F4D] rounded border-[#D9DED1] focus:ring-[#A3B18A] cursor-pointer"
                  />
                  <div className="truncate flex-1">
                    <span className="text-xs font-medium text-[#2D332A] block truncate leading-tight">
                      {t.title}
                    </span>
                    <span 
                      className="text-[10px] font-semibold mt-0.5 inline-block"
                      style={{ color: getSubjectInfo(t.subjectId || '').color }}
                    >
                      {getSubjectInfo(t.subjectId || '').code}
                    </span>
                  </div>
                </div>
              ))}

              {todayTasks.length === 0 && (
                <div className="text-center py-6 text-[#9DA895]">
                  <ListTodo className="h-6 w-6 text-[#9DA895] mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-[#5D6659]">No tasks set for today.</p>
                  <button 
                    id="btn_add_task_dash"
                    onClick={() => onTabChange('tasks')}
                    className="text-[10px] font-semibold text-[#5A6F4D] hover:underline mt-1 block w-full outline-none"
                  >
                    Create task now +
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Assignments Deadline Panel */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-[#D9DED1] text-[#2D332A]" id="dash_assignments_widget">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#2D332A] font-sans">
                Upcoming Assignments
              </h3>
              <button 
                id="btn_view_assignments" 
                onClick={() => onTabChange('assignments')}
                className="text-xs font-semibold text-[#5A6F4D] hover:underline outline-none"
              >
                Tracker &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {pendingAssignments.map(a => {
                const sub = getSubjectInfo(a.subjectId);
                const isHigh = a.priority === 'High';
                return (
                  <div key={a.id} className="p-3.5 bg-white border border-[#D9DED1]/50 rounded-xl hover:border-[#A3B18A] transition-all shadow-sm">
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="truncate">
                        <span 
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                        >
                          {sub.code}
                        </span>
                        <h4 className="text-xs font-bold text-[#2D332A] truncate mt-1">
                          {a.title}
                        </h4>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        isHigh ? 'bg-[#FDE7D1] text-[#D4A373]' : 'bg-[#E4E8DA] text-[#5D6659]'
                      }`}>
                        {a.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-[#D9DED1]/30 text-[10px] text-[#9DA895]">
                      <span className="truncate">
                        Due: {new Date(a.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-semibold text-[#5D6659]">
                        {a.gradeWeight}% Weight
                      </span>
                    </div>
                  </div>
                );
              })}

              {pendingAssignments.length === 0 && (
                <div className="text-center py-6 text-slate-400">
                  <p className="text-xs font-medium">All assignments submitted!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Summary Tip Card */}
          <div className="bg-[#E4E8DA] p-5 rounded-[1.5rem] border border-[#D9DED1] text-[#2D332A] flex items-start gap-3 relative overflow-hidden">
            <div className="p-2 bg-[#5A6F4D]/10 text-[#5A6F4D] rounded-lg shrink-0">
              <Star className="h-4 w-4 fill-[#5A6F4D]/10" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#5A6F4D]">Study Pro Tip</h4>
              <p className="text-[11px] text-[#5D6659] leading-relaxed mt-1">
                Studies show studying in blocks of 25-45 minutes with small 5-minute pauses drastically improves schema memory and test retention scores. Use our built-in Pomodoro Study Session timer inside!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
