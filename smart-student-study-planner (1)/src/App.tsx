import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Clock, FileText, Calendar, ListTodo, User, 
  Database, LogOut, Bell, Menu, X, CheckSquare, Trash2, ShieldAlert, BookMarked, Settings, Compass
} from 'lucide-react';

import { Subject, StudyPlan, Task, Assignment, Exam, StudySession, NotificationItem, UserProfile } from './types';
import { 
  INITIAL_USER, INITIAL_SUBJECTS, INITIAL_PLANS, INITIAL_TASKS, 
  INITIAL_ASSIGNMENTS, INITIAL_EXAMS, INITIAL_SESSIONS, INITIAL_NOTIFICATIONS 
} from './mockData';

import UserAuth from './components/UserAuth';
import Dashboard from './components/Dashboard';
import SubjectsManager from './components/SubjectsManager';
import AssignmentsTracker from './components/AssignmentsTracker';
import ExamTracker from './components/ExamTracker';
import TaskOrganizer from './components/TaskOrganizer';
import StudyTimer from './components/StudyTimer';
import ProfilePanel from './components/ProfilePanel';
import DeliverablesHub from './components/DeliverablesHub';
import Onboarding from './components/Onboarding';
import CalendarView, { CustomEvent } from './components/CalendarView';

const STORAGE_KEYS = {
  USER: 'planner_user',
  SUBJECTS: 'planner_subjects',
  PLANS: 'planner_plans',
  TASKS: 'planner_tasks',
  ASSIGNMENTS: 'planner_assignments',
  EXAMS: 'planner_exams',
  SESSIONS: 'planner_sessions',
  NOTIFS: 'planner_notifications',
  EVENTS: 'planner_events',
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Core shared application states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  // Toggle theme dynamically when user state updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [currentUser]);

  // Load from local storage or remain null to trigger onboarding/auth gate
  useEffect(() => {
    // 1. User
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const hasUser = !!storedUser;
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // 2. State tables
    const loadState = (key: string, fallback: any, setter: any) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        setter(JSON.parse(stored));
      } else {
        // Pristine blank slate for a fresh installation
        setter(hasUser ? fallback : []);
        localStorage.setItem(key, JSON.stringify(hasUser ? fallback : []));
      }
    };

    loadState(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS, setSubjects);
    loadState(STORAGE_KEYS.PLANS, INITIAL_PLANS, setPlans);
    loadState(STORAGE_KEYS.TASKS, INITIAL_TASKS, setTasks);
    loadState(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS, setAssignments);
    loadState(STORAGE_KEYS.EXAMS, INITIAL_EXAMS, setExams);
    loadState(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS, setSessions);
    loadState(STORAGE_KEYS.NOTIFS, INITIAL_NOTIFICATIONS, setNotifications);
    loadState(STORAGE_KEYS.EVENTS, [], setCustomEvents);
  }, []);

  const handleCompleteOnboarding = (profile: UserProfile, loadDemo: boolean) => {
    setCurrentUser(profile);
    syncState(STORAGE_KEYS.USER, profile);
    
    if (loadDemo) {
      // Load demo data with clear [Demo] labeling as per instructions
      const demoSubjects = INITIAL_SUBJECTS.map(s => ({ ...s, name: `${s.name} [Demo]` }));
      setSubjects(demoSubjects);
      syncState(STORAGE_KEYS.SUBJECTS, demoSubjects);
      
      const demoPlans = INITIAL_PLANS.map(p => ({ ...p, title: `${p.title} [Demo]` }));
      setPlans(demoPlans);
      syncState(STORAGE_KEYS.PLANS, demoPlans);
      
      const demoTasks = INITIAL_TASKS.map(t => ({ ...t, title: `${t.title} [Demo]` }));
      setTasks(demoTasks);
      syncState(STORAGE_KEYS.TASKS, demoTasks);
      
      const demoAssignments = INITIAL_ASSIGNMENTS.map(a => ({ ...a, title: `${a.title} [Demo]` }));
      setAssignments(demoAssignments);
      syncState(STORAGE_KEYS.ASSIGNMENTS, demoAssignments);
      
      const demoExams = INITIAL_EXAMS.map(e => ({ ...e, title: `${e.title} [Demo]` }));
      setExams(demoExams);
      syncState(STORAGE_KEYS.EXAMS, demoExams);
      
      setSessions(INITIAL_SESSIONS);
      syncState(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
      
      setNotifications(INITIAL_NOTIFICATIONS);
      syncState(STORAGE_KEYS.NOTIFS, INITIAL_NOTIFICATIONS);
      
      setCustomEvents([]);
      syncState(STORAGE_KEYS.EVENTS, []);
    } else {
      // Clear slate
      setSubjects([]);
      syncState(STORAGE_KEYS.SUBJECTS, []);
      
      setPlans([]);
      syncState(STORAGE_KEYS.PLANS, []);
      
      setTasks([]);
      syncState(STORAGE_KEYS.TASKS, []);
      
      setAssignments([]);
      syncState(STORAGE_KEYS.ASSIGNMENTS, []);
      
      setExams([]);
      syncState(STORAGE_KEYS.EXAMS, []);
      
      setSessions([]);
      syncState(STORAGE_KEYS.SESSIONS, []);
      
      setNotifications([]);
      syncState(STORAGE_KEYS.NOTIFS, []);
      
      setCustomEvents([]);
      syncState(STORAGE_KEYS.EVENTS, []);
    }

    setActiveTab('dashboard');
  };

  const handleAddCustomEvent = (ev: CustomEvent) => {
    const updated = [ev, ...customEvents];
    setCustomEvents(updated);
    syncState(STORAGE_KEYS.EVENTS, updated);
  };

  const handleDeleteCustomEvent = (id: string) => {
    const updated = customEvents.filter(e => e.id !== id);
    setCustomEvents(updated);
    syncState(STORAGE_KEYS.EVENTS, updated);
  };

  // Sync to local storage on adjustments
  const syncState = (key: string, stateVal: any) => {
    localStorage.setItem(key, JSON.stringify(stateVal));
  };

  // State adjustment Handlers
  const handleUpdateProfile = (prof: UserProfile) => {
    setCurrentUser(prof);
    syncState(STORAGE_KEYS.USER, prof);
  };

  const handleAddSubject = (subj: Subject) => {
    const updated = [subj, ...subjects];
    setSubjects(updated);
    syncState(STORAGE_KEYS.SUBJECTS, updated);

    // Dynamic notifications helper
    pushNotification(
      'New Course Created',
      `Subject ${subj.code} (${subj.name}) has been incorporated into your planner successfully!`,
      'General'
    );
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    syncState(STORAGE_KEYS.SUBJECTS, updated);
  };

  const handleAddPlan = (plan: StudyPlan) => {
    const updated = [plan, ...plans];
    setPlans(updated);
    syncState(STORAGE_KEYS.PLANS, updated);

    pushNotification(
      'Academic Goal Launched',
      `New study goal "${plan.title}" has been scheduled. Stay consistent!`,
      'Reminder'
    );
  };

  const handleDeletePlan = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    syncState(STORAGE_KEYS.PLANS, updated);
  };

  const handleAddTask = (task: Task) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    syncState(STORAGE_KEYS.TASKS, updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    syncState(STORAGE_KEYS.TASKS, updated);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updated);
    syncState(STORAGE_KEYS.TASKS, updated);

    const toggled = updated.find(t => t.id === id);
    if (toggled?.isCompleted) {
      pushNotification(
        'Task Completed Checked',
        `Nice! You cleared checkpoint "${toggled.title}" successfully.`,
        'General'
      );
    }
  };

  const handleAddAssignment = (assign: Assignment) => {
    const updated = [assign, ...assignments];
    setAssignments(updated);
    syncState(STORAGE_KEYS.ASSIGNMENTS, updated);

    pushNotification(
      'Assignment Added',
      `Coursework "${assign.title}" has been tracked. Due in ${assign.remindBeforeHours}h.`,
      'Deadline'
    );
  };

  const handleDeleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    syncState(STORAGE_KEYS.ASSIGNMENTS, updated);
  };

  const handleUpdateAssignmentStatus = (id: string, stat: 'Pending' | 'In Progress' | 'Completed') => {
    const updated = assignments.map(a => a.id === id ? { ...a, status: stat } : a);
    setAssignments(updated);
    syncState(STORAGE_KEYS.ASSIGNMENTS, updated);

    if (stat === 'Completed') {
      pushNotification(
        'Submission Met',
        `Boom! "${assignments.find(a => a.id === id)?.title}" has been logged as completed.`,
        'General'
      );
    }
  };

  const handleAddExam = (exam: Exam) => {
    const updated = [exam, ...exams];
    setExams(updated);
    syncState(STORAGE_KEYS.EXAMS, updated);

    pushNotification(
      'Exam Logged',
      `Upcoming test "${exam.title}" scheduled. Check out the active count-down timer.`,
      'Exam'
    );
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    syncState(STORAGE_KEYS.EXAMS, updated);
  };

  const handleUpdateExamProgress = (id: string, progress: number) => {
    const updated = exams.map(e => e.id === id ? { ...e, preparationProgress: progress } : e);
    setExams(updated);
    syncState(STORAGE_KEYS.EXAMS, updated);
  };

  const handleLogSession = (session: StudySession) => {
    const updated = [session, ...sessions];
    setSessions(updated);
    syncState(STORAGE_KEYS.SESSIONS, updated);

    pushNotification(
      'Study logs Registered',
      `Locked ${session.durationMinutes} minutes focus toward ${subjects.find(sub => sub.id === session.subjectId)?.name || 'Course'}.`,
      'Reminder'
    );
  };

  const pushNotification = (title: string, msg: string, type: 'Reminder' | 'Deadline' | 'Exam' | 'General') => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message: msg,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => {
      const nextNotifs = [newNotif, ...prev];
      syncState(STORAGE_KEYS.NOTIFS, nextNotifs);
      return nextNotifs;
    });
  };

  const handleMarkNotifRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    syncState(STORAGE_KEYS.NOTIFS, updated);
  };

  const handleClearNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    syncState(STORAGE_KEYS.NOTIFS, updated);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F8F9F4] text-[#2D332A] flex" id="app_root">
      
      {/* Auth Gate Screen */}
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <UserAuth 
              onLoginSuccess={handleUpdateProfile} 
              currentUser={currentUser} 
            />
          </motion.div>
        ) : !currentUser.isOnboarded ? (
          <motion.div key="onboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <Onboarding onComplete={handleCompleteOnboarding} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {currentUser && currentUser.isOnboarded && (
        <>
          {/* Siderbars Left Nav - Desktop */}
          <aside className="hidden lg:flex flex-col w-64 bg-[#F1F2EB] text-[#2D332A] border-r border-[#D9DED1] shrink-0 select-none pb-4 relative z-20" id="sidebar_desktop">
            <div className="p-5 flex items-center gap-2.5 border-b border-[#D9DED1]">
              <div className="bg-[#5A6F4D] text-white p-2 rounded-xl shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-[#2D332A] block leading-tight font-sans text-sm tracking-tight">SmartPlanner</span>
                <span className="text-[10px] text-[#5A6F4D] uppercase tracking-wider block font-bold mt-0.5">Study Advisor</span>
              </div>
            </div>

            {/* Sidebar Routes list */}
            <nav className="flex-1 px-3 py-4 space-y-1" id="sidebar_nav_list">
              <SidebarItem id="dashboard" icon={<Compass className="w-4 h-4" />} text="Overview Panel" active={activeTab === 'dashboard'} onClick={setActiveTab} />
              <SidebarItem id="calendar" icon={<Calendar className="w-4 h-4" />} text="Event Calendar" active={activeTab === 'calendar'} onClick={setActiveTab} />
              <SidebarItem id="planner" icon={<BookOpen className="w-4 h-4" />} text="Study Planner & Goals" active={activeTab === 'planner'} onClick={setActiveTab} />
              <SidebarItem id="assignments" icon={<FileText className="w-4 h-4" />} text="Assignment deadlines" active={activeTab === 'assignments'} onClick={setActiveTab} />
              <SidebarItem id="exams" icon={<BookMarked className="w-4 h-4" />} text="Exam countdowns" active={activeTab === 'exams'} onClick={setActiveTab} />
              <SidebarItem id="tasks" icon={<ListTodo className="w-4 h-4" />} text="Tasks organizer" active={activeTab === 'tasks'} onClick={setActiveTab} />
              <SidebarItem id="timer" icon={<Clock className="w-4 h-4 animate-spin-slow" />} text="Study timer logs" active={activeTab === 'timer'} onClick={setActiveTab} />
              <SidebarItem id="profile" icon={<User className="w-4 h-4" />} text="My Profile & Settings" active={activeTab === 'profile'} onClick={setActiveTab} />
              <SidebarItem id="deliverables" icon={<Database className="w-4 h-4 text-[#A3B18A]" />} text="PHP & SQL Backend" active={activeTab === 'deliverables'} onClick={setActiveTab} />
            </nav>

            {/* bottom logout buttons */}
            <div className="px-3 pt-3 border-t border-[#D9DED1]">
              <button 
                id="btn_desktop_logout"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#E4E8DA] hover:text-[#2D332A] text-[#5D6659] text-xs font-semibold tracking-wide transition-all outline-none cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" /> Log Out Portal
              </button>
            </div>
          </aside>

          {/* Siderbars Right Nav Drawer - Mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                />
                <motion.aside 
                  initial={{ x: '-100%' }} 
                  animate={{ x: 0 }} 
                  exit={{ x: '-100%' }} 
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed left-0 top-0 bottom-0 w-64 bg-[#F1F2EB] text-[#2D332A] border-r border-[#D9DED1] z-50 flex flex-col pb-4 h-full"
                  id="sidebar_mobile"
                >
                  <div className="p-5 flex items-center justify-between border-b border-[#D9DED1]">
                     <div className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-[#5A6F4D]" />
                      <span className="font-bold text-[#2D332A] font-sans text-sm">Study Planner</span>
                    </div>
                    <button 
                      id="btn_close_sidebar"
                      onClick={() => setSidebarOpen(false)} 
                      className="text-[#5D6659] hover:text-[#2D332A] outline-none cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="flex-1 px-3 py-4 space-y-1">
                    <SidebarItem id="dashboard" icon={<Compass className="w-4 h-4" />} text="Overview Panel" active={activeTab === 'dashboard'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="calendar" icon={<Calendar className="w-4 h-4" />} text="Event Calendar" active={activeTab === 'calendar'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="planner" icon={<BookOpen className="w-4 h-4" />} text="Study Planner & Goals" active={activeTab === 'planner'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="assignments" icon={<FileText className="w-4 h-4" />} text="Assignment deadlines" active={activeTab === 'assignments'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="exams" icon={<BookMarked className="w-4 h-4" />} text="Exam countdowns" active={activeTab === 'exams'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="tasks" icon={<ListTodo className="w-4 h-4" />} text="Tasks organizer" active={activeTab === 'tasks'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="timer" icon={<Clock className="w-4 h-4 animate-spin-slow" />} text="Study timer logs" active={activeTab === 'timer'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="profile" icon={<User className="w-4 h-4" />} text="My Profile & Settings" active={activeTab === 'profile'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                    <SidebarItem id="deliverables" icon={<Database className="w-4 h-4 text-[#A3B18A]" />} text="PHP & SQL Backend" active={activeTab === 'deliverables'} onClick={(id) => { setActiveTab(id); setSidebarOpen(false); }} />
                  </nav>

                  <div className="px-3 pt-3 border-t border-[#D9DED1]">
                    <button 
                      id="btn_mobile_logout"
                      onClick={() => { handleLogout(); setSidebarOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-[#5D6659] hover:text-[#2D332A] text-xs font-semibold cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main stage interface */}
          <div className="flex-1 flex flex-col min-w-0" id="main_stage">
            {/* Nav Main Header bar */}
            <header className="bg-white/70 backdrop-blur-md border-b border-[#D9DED1] h-16 px-6 flex items-center justify-between sticky top-0 z-10" id="header_navbar">
              <div className="flex items-center gap-4">
                <button 
                  id="btn_open_sidebar"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-[#2D332A] hover:bg-[#E4E8DA] border border-[#D9DED1] p-1.5 rounded-xl cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden sm:block">
                  <span className="text-[10px] text-[#9DA895] uppercase tracking-widest font-bold font-mono">Student Space</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-[#5A6F4D] rounded-full animate-ping-slow" />
                    <span className="text-xs font-bold text-[#5D6659]">Live sync active</span>
                  </div>
                </div>
              </div>

              {/* Notification Center */}
              <div className="flex items-center gap-4 relative">
                <button 
                  id="btn_toggle_notifs"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-[#E4E8DA] rounded-full text-[#5D6659] hover:text-[#2D332A] outline-none transition-colors cursor-pointer"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-[#D4A373] text-white min-w-[15px] h-[15px] px-1 text-[8px] font-black rounded-full flex items-center justify-center animate-bounce ring-2 ring-[#F8F9F4]">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-11 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl z-30 overflow-hidden"
                        id="notifications_dropdown"
                      >
                        <div className="p-4 border-b border-[#D9DED1] bg-[#F1F2EB]/50 flex justify-between items-center">
                          <span className="text-xs font-bold text-[#2D332A] uppercase tracking-wider font-sans">Notifications log ({notifications.length})</span>
                          <span className="bg-[#E4E8DA] text-[#5A6F4D] font-bold font-mono text-[9px] px-2 py-0.5 rounded-full">Alerts Center</span>
                        </div>

                        <div className="max-h-[250px] overflow-y-auto divide-y divide-[#D9DED1]/40">
                          {notifications.map(n => (
                            <div key={n.id} className={`p-4 text-xs relative ${n.isRead ? 'bg-white opacity-70' : 'bg-[#E4E8DA]/20'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-[#2D332A] pr-4">{n.title}</h4>
                                <div className="flex items-center gap-1 shrink-0">
                                  {!n.isRead && (
                                    <button 
                                      id={`btn_read_notif_${n.id}`}
                                      onClick={() => handleMarkNotifRead(n.id)}
                                      className="text-[9px] font-black font-semibold text-[#5A6F4D] hover:underline outline-none"
                                    >
                                      Read
                                    </button>
                                  )}
                                  <button 
                                    id={`btn_clear_notif_${n.id}`}
                                    onClick={() => handleClearNotif(n.id)}
                                    className="p-0.5 text-[#5D6659] hover:text-red-500 rounded outline-none"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[#5D6659] pr-1 leading-normal">{n.message}</p>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-6">No unread alert summaries.</p>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Profile mini avatar link */}
                <div onClick={() => setActiveTab('profile')} className="flex items-center gap-2 cursor-pointer group hover:opacity-85 select-none shrink-0" id="header_profile_link">
                  <div className="w-8 h-8 rounded-full bg-[#D4A373] text-white font-bold flex items-center justify-center text-xs shadow-sm border-2 border-white">
                    {currentUser.profilePic ? (
                      <img referrerPolicy="no-referrer" src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      currentUser.name[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#2D332A] hidden md:block">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </div>
              </div>
            </header>

            {/* Main Stage Content space */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto" id="stage_main_scroller">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'dashboard' && (
                    <Dashboard 
                      user={currentUser}
                      subjects={subjects}
                      plansCount={plans.length}
                      tasks={tasks}
                      assignments={assignments}
                      exams={exams}
                      sessions={sessions}
                      onTabChange={setActiveTab}
                      onToggleTask={handleToggleTask}
                    />
                  )}

                  {activeTab === 'calendar' && (
                    <CalendarView 
                      subjects={subjects}
                      assignments={assignments}
                      exams={exams}
                      sessions={sessions}
                      customEvents={customEvents}
                      onAddCustomEvent={handleAddCustomEvent}
                      onDeleteCustomEvent={handleDeleteCustomEvent}
                    />
                  )}

                  {activeTab === 'planner' && (
                    <SubjectsManager 
                      subjects={subjects}
                      plans={plans}
                      onAddSubject={handleAddSubject}
                      onDeleteSubject={handleDeleteSubject}
                      onAddPlan={handleAddPlan}
                      onDeletePlan={handleDeletePlan}
                    />
                  )}

                  {activeTab === 'assignments' && (
                    <AssignmentsTracker 
                      assignments={assignments}
                      subjects={subjects}
                      onAddAssignment={handleAddAssignment}
                      onDeleteAssignment={handleDeleteAssignment}
                      onUpdateStatus={handleUpdateAssignmentStatus}
                    />
                  )}

                  {activeTab === 'exams' && (
                    <ExamTracker 
                      exams={exams}
                      subjects={subjects}
                      onAddExam={handleAddExam}
                      onDeleteExam={handleDeleteExam}
                      onUpdateProgress={handleUpdateExamProgress}
                    />
                  )}

                  {activeTab === 'tasks' && (
                    <TaskOrganizer 
                      tasks={tasks}
                      subjects={subjects}
                      onAddTask={handleAddTask}
                      onDeleteTask={handleDeleteTask}
                      onToggleTask={handleToggleTask}
                    />
                  )}

                  {activeTab === 'timer' && (
                    <StudyTimer 
                      subjects={subjects}
                      sessions={sessions}
                      onLogSession={handleLogSession}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <ProfilePanel 
                      user={currentUser}
                      subjects={subjects}
                      onUpdateProfile={handleUpdateProfile}
                    />
                  )}

                  {activeTab === 'deliverables' && (
                    <DeliverablesHub />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </>
      )}

    </div>
  );
}

// SidebarItem compact helper interface
interface SidebarItemProps {
  id: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick: (id: string) => void;
}

function SidebarItem({ id, icon, text, active, onClick }: SidebarItemProps) {
  return (
    <button
      id={`btn_tab_${id}`}
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.8 rounded-xl text-left border border-transparent transition-all outline-none cursor-pointer text-xs font-semibold ${
        active 
          ? 'bg-[#5A6F4D] text-white border-[#5A6F4D]/20 font-bold shadow-md shadow-[#5A6F4D]/10' 
          : 'text-[#5D6659] hover:bg-[#E4E8DA] hover:text-[#2D332A]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[#9DA895] group-hover:text-[#2D332A]'}>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
