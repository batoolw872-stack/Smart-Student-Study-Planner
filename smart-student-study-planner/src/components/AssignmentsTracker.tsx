import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Plus, Trash2, Calendar, AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { Assignment, Subject } from '../types';

interface AssignmentsTrackerProps {
  assignments: Assignment[];
  subjects: Subject[];
  onAddAssignment: (assign: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onUpdateStatus: (id: string, stat: 'Pending' | 'In Progress' | 'Completed') => void;
}

export default function AssignmentsTracker({
  assignments,
  subjects,
  onAddAssignment,
  onDeleteAssignment,
  onUpdateStatus
}: AssignmentsTrackerProps) {
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [gradeWeight, setGradeWeight] = useState('10');
  const [remindHours, setRemindHours] = useState('24');

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !title || !dueDate) return;

    const newAssign: Assignment = {
      id: `assign-${Math.random().toString(36).substr(2, 9)}`,
      subjectId,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status: 'Pending',
      gradeWeight: Number(gradeWeight) || 10,
      remindBeforeHours: Number(remindHours) || 24
    };

    onAddAssignment(newAssign);
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setGradeWeight('10');
    setRemindHours('24');
    setShowForm(false);
  };

  const getSubDetails = (subId: string) => {
    return subjects.find(s => s.id === subId) || { code: 'GEN', name: 'General', color: '#94a3b8' };
  };

  return (
    <div className="space-y-6" id="assignments_tab">
      
      {/* Header panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D332A] font-sans flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#5A6F4D]" />
            Assignment Deadline Tracker
          </h2>
          <p className="text-xs text-[#5D6659]">Track key coursework, project deliverables, grading weight, and submission statuses.</p>
        </div>

        <button 
          id="btn_open_assign_form"
          onClick={() => setShowForm(!showForm)}
          className="bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all self-start"
        >
          <Plus className="h-4 w-4" /> Add Assignment
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-6 rounded-[2rem] border border-[#D9DED1] shadow-sm max-w-2xl"
          id="assign_form"
        >
          <form onSubmit={submitForm} className="space-y-4">
            <h3 className="text-sm font-bold text-[#2D332A] uppercase tracking-wider">Register Upcoming Homework</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Select Course / Subject</label>
                <select 
                  id="select_assign_subject"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Subject Course --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Assignment Title</label>
                <input 
                  id="input_assign_title"
                  type="text" 
                  placeholder="e.g. Normalization Practice Exam Sheet" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D6659] mb-1">Detailed Description or Instructions</label>
              <textarea 
                id="input_assign_desc"
                placeholder="List assignment parameters, submission portals, grading files..."
                className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] h-20 resize-none"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Due Date & Time</label>
                <input 
                  id="input_assign_due"
                  type="datetime-local" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Priority Importance</label>
                <select 
                  id="select_assign_priority"
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A] bg-white"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Importance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Grade Weight (%)</label>
                <input 
                  id="input_assign_weight"
                  type="number" 
                  min="1" 
                  max="100" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={gradeWeight} 
                  onChange={(e) => setGradeWeight(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] mb-1">Remind Before (Hrs)</label>
                <input 
                  id="input_assign_remind"
                  type="number" 
                  min="1" 
                  className="w-full px-3 py-2 rounded-xl border border-[#D9DED1] outline-none text-xs text-[#2D332A]"
                  value={remindHours} 
                  onChange={(e) => setRemindHours(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button 
                id="btn_cancel_assign"
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 bg-[#F1F2EB] hover:bg-[#E4E8DA] text-[#2D332A] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                id="btn_save_assign"
                type="submit" 
                className="px-4 py-2 bg-[#5A6F4D] hover:bg-[#4F6242] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Track Assignment
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Course Assignments lists sorted by due date */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="assignments_dashboard_grid">
        
        {/* Category 1: Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4A373]/30 pb-2">
            <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4A373]" /> Pending (Start)
            </span>
            <span className="bg-[#FDE7D1] text-[#D4A373] font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
              {assignments.filter(a => a.status === 'Pending').length}
            </span>
          </div>

          <div className="space-y-3">
            {assignments.filter(a => a.status === 'Pending').map(a => (
              <AssignmentCard 
                key={a.id} 
                assign={a} 
                sub={getSubDetails(a.subjectId)} 
                onDelete={onDeleteAssignment}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            {assignments.filter(a => a.status === 'Pending').length === 0 && (
              <p className="text-xs text-[#5D6659] italic text-center py-4 bg-[#F8F9F4] rounded-xl border border-dashed border-[#D9DED1]/60">No pending assignments!</p>
            )}
          </div>
        </div>

        {/* Category 2: In Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#A3B18A]/30 pb-2">
            <span className="text-xs font-bold text-[#5D6659] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A3B18A]" /> In Progress (Working)
            </span>
            <span className="bg-[#F1F2EB] text-[#5A6F4D] font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
              {assignments.filter(a => a.status === 'In Progress').length}
            </span>
          </div>

          <div className="space-y-3">
            {assignments.filter(a => a.status === 'In Progress').map(a => (
              <AssignmentCard 
                key={a.id} 
                assign={a} 
                sub={getSubDetails(a.subjectId)} 
                onDelete={onDeleteAssignment}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            {assignments.filter(a => a.status === 'In Progress').length === 0 && (
              <p className="text-xs text-[#5D6659] italic text-center py-4 bg-[#F8F9F4] rounded-xl border border-dashed border-[#D9DED1]/60">No active assignment in progress.</p>
            )}
          </div>
        </div>

        {/* Category 3: Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#5A6F4D]/30 pb-2">
            <span className="text-xs font-bold text-[#5A6F4D] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5A6F4D]" /> Completed (Submitted)
            </span>
            <span className="bg-[#E4E8DA] text-[#5A6F4D] font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">
              {assignments.filter(a => a.status === 'Completed').length}
            </span>
          </div>

          <div className="space-y-3">
            {assignments.filter(a => a.status === 'Completed').map(a => (
              <AssignmentCard 
                key={a.id} 
                assign={a} 
                sub={getSubDetails(a.subjectId)} 
                onDelete={onDeleteAssignment}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
            {assignments.filter(a => a.status === 'Completed').length === 0 && (
              <p className="text-xs text-[#5D6659] italic text-center py-4 bg-[#F8F9F4] rounded-xl border border-dashed border-[#D9DED1]/60">No submissions finalized yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline Sub-Component AssignmentCard for structural modesty
interface CardProps {
  key?: string;
  assign: Assignment;
  sub: any;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, stat: 'Pending' | 'In Progress' | 'Completed') => void;
}

function AssignmentCard({ assign, sub, onDelete, onUpdateStatus }: CardProps) {
  const isHigh = assign.priority === 'High';
  const isMed = assign.priority === 'Medium';
  const formattedDate = new Date(assign.dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-[#D9DED1]/60 shadow-sm leading-relaxed relative flex flex-col justify-between text-[#2D332A]">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${sub.color}15`, color: sub.color }}>
            {sub.code}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            isHigh ? 'bg-[#FDE7D1] text-[#D4A373]' : isMed ? 'bg-[#F1F2EB] text-[#5D6659]' : 'bg-[#F8F9F4] text-[#9DA895]'
          }`}>
            {assign.priority}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-[#2D332A] line-clamp-1">{assign.title}</h4>
          <p className="text-[11px] text-[#5D6659] line-clamp-2 mt-0.5">{assign.description || 'No instruction notes.'}</p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#9DA895] font-mono mt-1 pt-1.5 border-t border-[#D9DED1]/30">
          <Calendar className="w-3 h-3 text-[#9DA895]" />
          <span>Due: {formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-2 border-t border-[#D9DED1]/30">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold font-mono text-[#5D6659]">Weight: {assign.gradeWeight}%</span>
        </div>

        <div className="flex items-center gap-1">
          <select 
            id={`select_status_${assign.id}`}
            value={assign.status}
            onChange={(e) => onUpdateStatus(assign.id, e.target.value as any)}
            className="text-[10px] font-semibold border border-[#D9DED1] rounded-lg p-1 bg-white outline-none cursor-pointer text-[#2D332A]"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button 
            id={`btn_delete_assign_${assign.id}`}
            onClick={() => onDelete(assign.id)}
            className="p-1 text-[#9DA895] hover:text-red-500 rounded transition-colors cursor-pointer"
            title="Delete Assignment"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
