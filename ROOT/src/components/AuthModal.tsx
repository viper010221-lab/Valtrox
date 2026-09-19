import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, Lock, Mail, User, Shield, ArrowRight, CheckCircle2, AlertCircle, Sparkles, UserPlus, LogIn, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, setAuthModalOpen, login, signup, navigateTo } = useData();

  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ign, setIgn] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; msg: string } | null>(null);

  React.useEffect(() => {
    setMode(authModalMode);
    setFeedback(null);
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const isMasterAdmin = email.trim().toLowerCase() === 'valtrox51@gmail.com';

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setFeedback({ type: 'error', msg: res.message });
      } else {
        setFeedback({ type: 'success', msg: res.message });
        if (isMasterAdmin) {
          setTimeout(() => navigateTo('admin'), 400);
        }
      }
    } else {
      const res = signup(email, password, ign, discordTag);
      if (!res.success) {
        setFeedback({ type: 'error', msg: res.message });
      } else {
        setFeedback({ type: 'success', msg: res.message });
        if (isMasterAdmin) {
          setTimeout(() => navigateTo('admin'), 400);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#171722] border-2 border-[#7C3AED]/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#7C3AED]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Close / Skip to Guest Button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#0F0F17] hover:bg-[#252538] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close or browse as guest"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="space-y-1 mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-xs font-bold text-purple-300 font-mono">
              <Shield size={13} className="text-amber-400" />
              <span>Bedrock Union Competitive Network</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === 'signup'
                ? 'Sign up to record your matches, calibrate your tier & manage ranking.'
                : 'Sign in to access your profile & admin dashboard tools.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0F0F17] border border-[#252538] rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setFeedback(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              <span>Sign Up</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setFeedback(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-[#7C3AED] text-white shadow-glow-purple-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {feedback && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-red-950/60 border-red-500/50 text-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <AlertCircle size={16} className="shrink-0" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">In-Game Name (Bedrock IGN)</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. BedrockPro"
                      value={ign}
                      onChange={(e) => setIgn(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300">Discord Username</label>
                  <input
                    type="text"
                    placeholder="e.g. bedrock_pro#0000"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. player@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] focus:border-[#7C3AED] rounded-xl text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs font-bold shadow-glow-purple transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'signup' ? 'Complete Sign Up & Enter' : 'Sign In & Enter'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Guest Option */}
          <div className="mt-4 pt-3 border-t border-[#252538] flex items-center justify-between text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip and browse as guest &rarr;
            </button>

            <span className="text-[11px] text-zinc-500">Bedrock Union ID v2.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
