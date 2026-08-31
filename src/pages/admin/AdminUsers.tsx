import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ShieldCheck, UserPlus, Trash2, Mail, CheckCircle2, AlertCircle, Users } from 'lucide-react';

export const AdminUsers: React.FC<{ onFeedback: (msg: string) => void }> = ({ onFeedback }) => {
  const { accounts, assignRankByEmail } = useData();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Users with the Administrator rank are admin users
  const adminUsers = accounts.filter((a) => a.rank === 'Administrator');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!email.trim()) return;

    const targetEmail = email.trim().toLowerCase();

    // Prevent adding the master owner
    if (targetEmail === 'valtrox51@gmail.com') {
      setStatus({ type: 'error', message: 'This email is the master owner and already has full access.' });
      return;
    }

    // Check if the account exists
    const targetAccount = accounts.find((a) => a.email.toLowerCase() === targetEmail);
    if (!targetAccount) {
      setStatus({ type: 'error', message: `No user found with email "${email.trim()}". They must sign up first.` });
      return;
    }

    // Check if already an admin
    if (targetAccount.rank === 'Administrator') {
      setStatus({ type: 'error', message: 'This user is already an admin user.' });
      return;
    }

    const res = assignRankByEmail(email.trim(), 'Administrator');
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
      onFeedback(`Added ${email.trim()} as Admin User! They now have admin panel access.`);
      setEmail('');
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  const handleRemove = (targetEmail: string, ign: string) => {
    if (window.confirm(`Remove Admin User access from ${ign} (${targetEmail})? They will lose access to the admin panel.`)) {
      const res = assignRankByEmail(targetEmail, 'Player');
      if (res.success) {
        onFeedback(`Removed Admin User access from ${ign}!`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Admin User */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#7C3AED]/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Admin Users</h2>
            <p className="text-xs text-zinc-400">
              Grant admin panel access to users by email. Added users will be able to access the full admin dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">User Email</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user's email address..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0F0F17] border border-[#252538] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0"
              >
                <UserPlus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {status && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                status.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border border-red-500/30 text-red-300'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{status.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* Current Admin Users List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#171722] border border-[#252538] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Current Admin Users</h3>
            <p className="text-xs text-zinc-400">{adminUsers.length} user(s) with admin panel access</p>
          </div>
        </div>

        {adminUsers.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Users size={28} className="text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No admin users added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {adminUsers.map((admin) => (
              <div
                key={admin.email}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0F0F17] border border-[#252538]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <ShieldCheck size={14} className="text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{admin.ign}</div>
                    <span className="text-xs text-zinc-400 font-mono truncate block">{admin.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(admin.email, admin.ign)}
                  className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer shrink-0"
                  title="Remove admin access"
                >
                  <Trash2 size={13} className="mr-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
