import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } } };
      setError(
        errorResponse?.response?.data?.message ||
          'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#0C1215] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-80">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] shadow-xs"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-emerald-500/10 dark:bg-sage-300/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-7 relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-sage-300/15 border border-emerald-200 dark:border-sage-300/40 text-emerald-800 dark:text-sage-300 mb-3 shadow-xs">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">FieldPulse</h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
            SLA-Aware Dispatch &amp; Operations Command Deck
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white dark:bg-[#131D21] border border-slate-200 dark:border-[#22353A] border-t-2 border-t-emerald-600 dark:border-t-sage-300/40 rounded-2xl p-7 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#22353A] pb-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
              Operator Sign In
            </h3>
            <span className="text-[10px] font-mono text-emerald-800 dark:text-sage-300 bg-emerald-50 dark:bg-sage-300/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-sage-300/20 font-bold">
              JWT Guard
            </span>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-lg p-3 flex items-start space-x-2.5 text-rose-800 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Operator Email"
              type="email"
              autoComplete="email"
              placeholder="name@fieldpulse.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate Session
            </Button>
          </form>

          {/* Quick Fill Demo Roles */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#22353A]">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center mb-2.5">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('dispatcher.sarah@fieldpulse.io')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#0C1215] dark:hover:bg-[#18252a] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all duration-80 text-center shadow-2xs"
              >
                Dispatcher
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@fieldpulse.io')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#0C1215] dark:hover:bg-[#18252a] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all duration-80 text-center shadow-2xs"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('tech.marcus@fieldpulse.io')}
                className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#0C1215] dark:hover:bg-[#18252a] border border-slate-200 dark:border-[#22353A] hover:border-slate-300 dark:hover:border-sage-300/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all duration-80 text-center shadow-2xs"
              >
                Technician
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono text-center mt-2.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-sage-300" />
              Pre-seeded demo accounts (Password: Password123!)
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-mono">
          FieldPulse &copy; 2026. SLA Breach Prevention &amp; Autonomous Dispatch.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
