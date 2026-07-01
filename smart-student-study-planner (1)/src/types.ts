export interface Subject {
  id: string; // React uses UUID/string, we can map to int in SQL
  code: string;
  name: string;
  color: string;
  credits: number;
  professor: string;
  location: string;
}

export interface StudyPlan {
  id: string;
  subjectId: string | null;
  title: string;
  description: string;
  weeklyHoursGoal: number;
  startDate: string;
  endDate: string;
}

export interface Task {
  id: string;
  subjectId: string | null;
  title: string;
  category: string; // Homework, Study, Project, Administrative, Revision
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  isCompleted: boolean;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string; // ISO datetime
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  gradeWeight: number; // weight percentage
  remindBeforeHours: number;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  examDate: string; // ISO datetime
  location: string;
  preparationProgress: number; // 0 to 100 percentage
  notes: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  durationMinutes: number;
  sessionDate: string; // date string
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Reminder' | 'Deadline' | 'Exam' | 'General';
  isRead: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  academicLevel: string; // e.g. Undergraduate, High School, Post-Graduate
  academicMajor: string; // e.g. Computer Science
  gpaTarget: number;
  profilePic: string; // base64 or placeholder initials
  
  // Onboarding parameters
  school?: string; // School/College/University
  semester?: string; // Semester or Grade
  timezone?: string; // User timezone preference
  preferredStudyHours?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  dailyAvailability?: number; // Hours available to study per day
  notificationTimes?: string[]; // e.g. ["Morning", "Evening"]
  studyDays?: string[]; // Days of the week user plans to study
  
  // Customization & Settings
  theme: 'light' | 'dark';
  accentColor: string; // Hex code or tailwind color name
  language: string; // "en" | "es" | "fr" etc.
  timeFormat: '12' | '24'; // 12-hour or 24-hour clock
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  notificationsEnabled: boolean;
  isOnboarded: boolean; // Flag to trace if they completed the wizard
}
