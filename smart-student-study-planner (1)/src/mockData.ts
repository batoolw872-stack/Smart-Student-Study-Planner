import { Subject, StudyPlan, Task, Assignment, Exam, StudySession, NotificationItem, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  id: '1',
  name: 'Alex Mercer',
  email: 'demo@student.edu',
  academicLevel: 'Undergraduate',
  academicMajor: 'Computer Science & Engineering',
  gpaTarget: 3.85,
  profilePic: '',
  theme: 'light',
  accentColor: '#5A6F4D',
  language: 'English',
  timeFormat: '12',
  dateFormat: 'MM/DD/YYYY',
  notificationsEnabled: true,
  isOnboarded: true
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    code: 'CS-301',
    name: 'Database Systems',
    color: '#3B82F6', // Vibrant Blue
    credits: 4,
    professor: 'Dr. Emily Watson',
    location: 'Engineering Hall 401'
  },
  {
    id: 'sub-2',
    code: 'CS-302',
    name: 'Software Design Patterns',
    color: '#10B981', // Emerald
    credits: 3,
    professor: 'Prof. Robert Lin',
    location: 'Science Center B10'
  },
  {
    id: 'sub-3',
    code: 'MATH-250',
    name: 'Linear Algebra',
    color: '#F59E0B', // Amber
    credits: 3,
    professor: 'Dr. Sarah Jenkins',
    location: 'Mathematics Dept 102'
  },
  {
    id: 'sub-4',
    code: 'HSS-105',
    name: 'Technical Writing',
    color: '#EC4899', // Pink
    credits: 2,
    professor: 'Prof. Anna Geller',
    location: 'Humanities Bldg 305'
  }
];

export const INITIAL_PLANS: StudyPlan[] = [
  {
    id: 'plan-1',
    subjectId: 'sub-1',
    title: 'Master SQL & Schema Design',
    description: 'Complete all lecture exercises, focus on joining tables and optimization strategies.',
    weeklyHoursGoal: 6,
    startDate: '2026-06-01',
    endDate: '2026-07-15'
  },
  {
    id: 'plan-2',
    subjectId: 'sub-2',
    title: 'Design Pattern Homeworks',
    description: 'Build a small sample application implementing MVC, Observer, and Singleton patterns.',
    weeklyHoursGoal: 4,
    startDate: '2026-06-01',
    endDate: '2026-06-30'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    subjectId: 'sub-1',
    title: 'Draft ER diagram for final project',
    category: 'Project',
    priority: 'High',
    dueDate: '2026-06-15',
    isCompleted: false
  },
  {
    id: 'task-2',
    subjectId: 'sub-3',
    title: 'Complete Linear Algebra Chapter 4 Homework',
    category: 'Homework',
    priority: 'Medium',
    dueDate: '2026-06-18',
    isCompleted: false
  },
  {
    id: 'task-3',
    subjectId: 'sub-4',
    title: 'Submit resume draft and business letter',
    category: 'Revision',
    priority: 'Low',
    dueDate: '2026-06-10',
    isCompleted: true
  },
  {
    id: 'task-4',
    subjectId: 'sub-2',
    title: 'Read Chapter 5: Factory Patterns',
    category: 'Study',
    priority: 'Medium',
    dueDate: '2026-06-16',
    isCompleted: false
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    subjectId: 'sub-1',
    title: 'Normalization Practice Assignment',
    description: 'Normalize a set of raw database schemas into 1NF, 2NF, and 3NF with step-by-step explanations.',
    dueDate: '2026-06-17T23:59',
    priority: 'High',
    status: 'Pending',
    gradeWeight: 10,
    remindBeforeHours: 24
  },
  {
    id: 'assign-2',
    subjectId: 'sub-2',
    title: 'Design Pattern Mini-Project',
    description: 'Write a Java console chat application leveraging Observer and Command patterns.',
    dueDate: '2026-06-22T18:00',
    priority: 'High',
    status: 'In Progress',
    gradeWeight: 15,
    remindBeforeHours: 48
  },
  {
    id: 'assign-3',
    subjectId: 'sub-3',
    title: 'Matrix Transformation Worksheet',
    description: 'Verify properties of linear maps, kernels, and vector spans.',
    dueDate: '2026-06-19T12:00',
    priority: 'Medium',
    status: 'Pending',
    gradeWeight: 5,
    remindBeforeHours: 12
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    subjectId: 'sub-1',
    title: 'Database Systems Midterm Exam',
    examDate: '2026-06-25T10:00',
    location: 'Main Gym, Hall B',
    preparationProgress: 45,
    notes: 'Covers Lectures 1 to 10 (ER modeling, relational algebra, SQL optimization, and normalization proof)'
  },
  {
    id: 'exam-2',
    subjectId: 'sub-3',
    title: 'Linear Algebra Final Exam',
    examDate: '2026-06-30T08:30',
    location: 'Math Wing, Class 2-A',
    preparationProgress: 20,
    notes: 'Eigenvalues, eigenvectors, diagonalizable matrices, and inner product vector space proofs.'
  }
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'sub-1',
    durationMinutes: 120,
    sessionDate: '2026-06-08',
    notes: 'Reviewed SQL joins and index structures.'
  },
  {
    id: 'sess-2',
    subjectId: 'sub-2',
    durationMinutes: 90,
    sessionDate: '2026-06-09',
    notes: 'Observer and Singleton design patterns.'
  },
  {
    id: 'sess-3',
    subjectId: 'sub-3',
    durationMinutes: 60,
    sessionDate: '2026-06-10',
    notes: 'Eigenvector calculations.'
  },
  {
    id: 'sess-4',
    subjectId: 'sub-1',
    durationMinutes: 150,
    sessionDate: '2026-06-11',
    notes: 'Normalization practice problems.'
  },
  {
    id: 'sess-5',
    subjectId: 'sub-4',
    durationMinutes: 45,
    sessionDate: '2026-06-11',
    notes: 'Drafted Technical Editing homework.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Assignment Deadline',
    message: 'Your Database Normalization Assignment is due in 5 days!',
    type: 'Deadline',
    isRead: false,
    createdAt: '2026-06-12T08:00'
  },
  {
    id: 'notif-2',
    title: 'Exam Alert',
    message: 'Database Systems Midterm Exam is approaching in 13 days!',
    type: 'Exam',
    isRead: false,
    createdAt: '2026-06-12T08:05'
  },
  {
    id: 'notif-3',
    title: 'Study Streak',
    message: 'Awesome! You studied 195 minutes yesterday. Keep up the momentum!',
    type: 'Reminder',
    isRead: true,
    createdAt: '2026-06-11T19:30'
  }
];
