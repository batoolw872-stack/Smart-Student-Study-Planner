import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ListTodo, Plus, Trash2, CheckCircle, Circle, Search, Filter, ShieldAlert } from 'lucide-react';
import { Task, Subject } from '../types';

interface TaskOrganizerProps {
  tasks: Task[];
  subjects: Subject[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export default function TaskOrganizer({
  tasks,
  subjects,
  onAddTask,
  onDeleteTask,
  onToggleTask
}: TaskOrganizerProps) {
  const [showForm, setShowForm] = useState(false);

  // Form parameters
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [category, setCategory] = useState('Homework');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState('');

  // Filtering / Searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCompletion, setFilterCompletion] = useState('Active'); // All, Active, Completed

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: Task = {
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      subjectId: subjectId ? subjectId : null,
      title: title.trim(),
      category,
      priority,
      dueDate,
      isCompleted: false
    };

    onAddTask(newTask);
    setTitle('');
    setSubjectId('');
    setCategory('Homework');
    setPriority('Medium');
    setDueDate('');
    setShowForm(false);
  };

  const getSubDetails = (subId: string | null) => {
    if (!subId) return null;
    return subjects.find(s => s.id === subId) || null;
  };

  // Perform client-side filter and search
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    
    let matchesCompletion = true;
    if (filterCompletion === 'Active') matchesCompletion = !t.isCompleted;
    else if (filterCompletion === 'Completed') matchesCompletion = t.isCompleted;

    return matchesSearch && matchesCategory && matchesPriority && matchesCompletion;
  });

  const categories = ['Homework', 'Study', 'Project', 'Administrative', 'Revision'];

  return (
    <div className="space-y-6" id="tasks_tab">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-[#5A6F4D]" />
            Task Management & Checklist
          </h2>
          <p className="text-xs text-[#5D6659]">Set micro-tasks, sort by academic category, search active list, and clear complete tasks.</p>
        </div>

        <button 
          id="btn_open_task_form"
          onClick={() => setShowForm(!showForm)}
          className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all self-start"
        >
          <Plus className="h-4 w-4" /> Add Task Checkpoint
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-[2rem] border border-[#D9DED1] shadow-sm max-w-2xl"
          id="task_form"
        >
          <form onSubmit={submitForm} className="space-y-4">
            <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider font-sans">Create Micro-Task</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Task Title</label>
                <input 
                  id="input_task_title"
                  type="text" 
                  placeholder="e.g. Read Database Normalization Slide 22" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Course Association (Optional)</label>
                <select 
                  id="select_task_subject"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">General Work / Independent Study</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Add Category</label>
                <select 
                  id="select_task_category"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Set Priority</label>
                <select 
                  id="select_task_priority"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Target Completion Date</label>
                <input 
                  id="input_task_due"
                  type="date" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                id="btn_cancel_task"
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="btn_save_task"
                type="submit" 
                className="px-4 py-2 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Insert Task
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter Options bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9DED1]/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between" id="filter_options_bar">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
          <input 
            id="input_search_tasks"
            type="text" 
            placeholder="Search checklists..." 
            className="w-full pl-9 pr-4 py-1.8 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status selector */}
          <select 
            id="select_filter_completion"
            className="px-3 py-1.8 rounded-xl border border-[#D9DED1] text-xs bg-white text-[#2D332A] outline-none cursor-pointer"
            value={filterCompletion}
            onChange={(e) => setFilterCompletion(e.target.value)}
          >
            <option value="Active">Active Tasks</option>
            <option value="Completed">Completed Tasks</option>
            <option value="All">All Checkpoints</option>
          </select>

          {/* Category Selector */}
          <select 
            id="select_filter_category"
            className="px-3 py-1.8 rounded-xl border border-[#D9DED1] text-xs bg-white text-[#2D332A] outline-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Priority selector */}
          <select 
            id="select_filter_priority"
            className="px-3 py-1.8 rounded-xl border border-[#D9DED1] text-xs bg-white text-[#2D332A] outline-none cursor-pointer"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Checklist display */}
      <div className="bg-white rounded-2xl border border-[#D9DED1]/60 shadow-sm overflow-hidden" id="tasks_checklist">
        <div className="divide-y divide-[#D9DED1]/20">
          {filteredTasks.map(t => {
            const sub = getSubDetails(t.subjectId);
            const isHigh = t.priority === 'High';
            const isMed = t.priority === 'Medium';
            return (
              <div 
                key={t.id} 
                className="flex items-center justify-between p-4 bg-white hover:bg-[#F8F9F4] transition-colors"
                id={`task_row_${t.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <button 
                    id={`btn_toggle_task_${t.id}`}
                    onClick={() => onToggleTask(t.id)}
                    className="text-[#9DA895] hover:text-[#5A6F4D] transition-colors shrink-0 cursor-pointer outline-none"
                  >
                    {t.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-[#5A6F4D] fill-[#E4E8DA]/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#9DA895]" />
                    )}
                  </button>

                  <div className="truncate text-[#2D332A]">
                    <span className={`text-xs font-semibold block leading-tight text-[#2D332A] ${t.isCompleted ? 'line-through text-[#9DA895] font-normal' : ''}`}>
                      {t.title}
                    </span>
                    <div className="flex flex-wrap gap-2 items-center mt-1 text-[10px]">
                      {sub && (
                        <span className="font-bold uppercase" style={{ color: sub.color }}>
                          {sub.code}
                        </span>
                      )}
                      
                      <span className="bg-[#E4E8DA] text-[#5A6F4D] text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase">
                        {t.category}
                      </span>
                      
                      {t.dueDate && (
                        <span className="text-[#9DA895] font-mono">
                          Due: {t.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isHigh ? 'bg-[#FDE7D1] text-[#D4A373] border border-[#D4A373]/20' : isMed ? 'bg-[#F1F2EB] text-[#5D6659] border border-[#D9DED1]/50' : 'bg-[#F8F9F4] text-[#9DA895] border border-[#D9DED1]/10'
                  }`}>
                    {t.priority}
                  </span>
                  
                  <button 
                    id={`btn_delete_task_${t.id}`}
                    onClick={() => onDeleteTask(t.id)}
                    className="p-1 text-[#9DA895] hover:text-red-500 hover:bg-red-50/10 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-[#5D6659]">
              <ShieldAlert className="h-8 w-8 mx-auto text-[#9DA895] mb-2" />
              <p className="text-xs font-semibold">No active tasks match current filter options.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
