import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Lock, Mail, User, ShieldCheck, RefreshCw, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface UserAuthProps {
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
}

export default function UserAuth({ onLoginSuccess, currentUser }: UserAuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  
  // Registration & login state
  const [email, setEmail] = useState('demo@student.edu');
  const [password, setPassword] = useState('student123');
  const [name, setName] = useState('Alex Mercer');
  const [major, setMajor] = useState('Computer Science & Engineering');
  const [gpa, setGpa] = useState('3.85');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please supply empty fields with authentic values.');
      return;
    }

    if (email === 'demo@student.edu' && password === 'student123') {
      const demoUser: UserProfile = {
        id: '1',
        name: 'Alex Mercer',
        email: 'demo@student.edu',
        academicLevel: 'Undergraduate',
        academicMajor: 'Computer Science & Engineering',
        gpaTarget: 3.85,
        profilePic: ''
      };
      setSuccessMsg('Successfully entered secure portal!');
      setTimeout(() => {
        onLoginSuccess(demoUser);
      }, 800);
    } else {
      // Allow custom credentials
      const cleanEmail = email.toLowerCase().trim();
      const userKey = `student_auth_${cleanEmail}`;
      const savedUser = localStorage.getItem(userKey);
      if (savedUser) {
        const decoded = JSON.parse(savedUser);
        if (decoded.password === password) {
          setSuccessMsg(`Welcome back, ${decoded.name}!`);
          setTimeout(() => {
            onLoginSuccess({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              academicLevel: decoded.academicLevel,
              academicMajor: decoded.academicMajor,
              gpaTarget: Number(decoded.gpaTarget),
              profilePic: ''
            });
          }, 800);
          return;
        }
      }
      setErrorMsg('Invalid email credentials or incorrect passcode. (Hint: use mock "demo@student.edu" / "student123")');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !password || !major) {
      setErrorMsg('Please compile all fields to continue.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: cleanEmail,
      password,
      academicLevel: 'Undergraduate',
      academicMajor: major,
      gpaTarget: parseFloat(gpa) || 4.0
    };

    localStorage.setItem(`student_auth_${cleanEmail}`, JSON.stringify(newUser));
    setSuccessMsg('Student registration completed securely! Directing you to login...');
    setTimeout(() => {
      setIsRegistering(false);
      setPassword('');
      setSuccessMsg('');
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please supply your emails to issue password recovery values.');
      return;
    }

    setSuccessMsg(`A mock password reset verification key has been issued to ${email}. Check inbox!`);
    setTimeout(() => {
      setForgotPassword(false);
      setSuccessMsg('');
    }, 2500);
  };

  if (currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F8F9F4] flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="bg-[#5A6F4D] text-white p-2 rounded-xl shadow-sm">
          <GraduationCap className="h-6 w-6" id="auth_logo_icon" />
        </div>
        <span className="font-sans font-bold text-lg tracking-tight text-[#2D332A]" id="auth_logo_text">
          Smart Study Planner
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#D9DED1] overflow-hidden"
        id="auth_card"
      >
        <div className="p-8 text-center bg-gradient-to-br from-[#5A6F4D] to-[#4F6242] text-white">
          <div className="mx-auto w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-sans">Smart Student Study Planner</h2>
          <p className="text-[#E4E8DA] text-sm mt-1">
            {isRegistering 
              ? 'Create a secure student account' 
              : forgotPassword 
                ? 'Recover academic security passkey' 
                : 'Access your student dashboard panel'}
          </p>
        </div>

        <div className="p-8">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-105" id="auth_error">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-105" id="auth_success">
              {successMsg}
            </div>
          )}

          {!isRegistering && !forgotPassword && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_login_email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="demo@student.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest">
                    Password Code
                  </label>
                  <button
                    id="btn_to_forgot"
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-xs text-[#5A6F4D] hover:underline outline-none font-bold"
                  >
                    Forgot Code?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_login_password"
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="Student Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="btn_submit_login"
                type="submit"
                className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>

              <div className="text-center mt-6 pt-4 border-t border-[#D9DED1]">
                <span className="text-xs text-[#5D6659] font-sans">New student here? </span>
                <button
                  id="btn_to_register"
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-[#5A6F4D] hover:underline outline-none"
                >
                  Register Account
                </button>
              </div>
            </form>
          )}

          {isRegistering && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                  Student Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_reg_name"
                    type="text"
                    className="w-full pl-10 pr-4 py-2.2 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                  Academic Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_reg_email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2.2 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                    Major Concentration
                  </label>
                  <input
                    id="input_reg_major"
                    type="text"
                    className="w-full px-3 py-2.2 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-xs transition-all"
                    placeholder="Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                    GPA Target
                  </label>
                  <input
                    id="input_reg_gpa"
                    type="number"
                    step="0.01"
                    min="1.0"
                    max="4.0"
                    className="w-full px-3 py-2.2 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-xs transition-all"
                    placeholder="4.00"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                  Secure Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_reg_password"
                    type="password"
                    className="w-full pl-10 pr-4 py-2.2 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="btn_submit_register"
                type="submit"
                className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" /> Complete Registration
              </button>

              <div className="text-center mt-6 pt-4 border-t border-[#D9DED1]">
                <span className="text-xs text-[#5D6659] font-sans">Already registered? </span>
                <button
                  id="btn_back_to_login"
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-[#5A6F4D] hover:underline outline-none"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {forgotPassword && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-[#5D6659]">
                Provide the registered academic email. We will route a secure credential recovery hyperlink.
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#5D6659] uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9DA895]" />
                  <input
                    id="input_forgot_email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DED1] outline-none focus:border-[#5A6F4D] focus:ring-1 focus:ring-[#E4E8DA] font-sans text-sm transition-all"
                    placeholder="demo@student.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                id="btn_submit_forgot"
                type="submit"
                className="w-full bg-[#5A6F4D] hover:bg-[#4F6242] text-white font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Send Passcode Key
              </button>

              <div className="text-center mt-6 pt-4 border-t border-[#D9DED1]">
                <button
                  id="btn_forgot_to_login"
                  type="button"
                  onClick={() => {
                    setForgotPassword(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-[#5D6659] hover:underline outline-none"
                >
                  Back to Log In
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 p-3 bg-[#E4E8DA]/60 rounded-xl border border-[#D9DED1] text-center">
            <span className="text-[11px] font-bold text-[#5A6F4D] uppercase tracking-wider block mb-1">
              DEMO CREDENTIALS:
            </span>
            <span className="text-xs text-[#2D332A] font-mono">
              Email: <strong>demo@student.edu</strong> | Pass: <strong>student123</strong>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
