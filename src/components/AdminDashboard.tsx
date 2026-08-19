import React, { useState, useEffect } from 'react';
import { User, AdminStats, SystemLog, Language } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import { 
  Users, 
  ShieldCheck, 
  Download, 
  Activity, 
  Lock, 
  Crown, 
  Ban, 
  Search, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Trash2,
  Bell
} from 'lucide-react';

interface Props {
  lang: Language;
}

export const AdminDashboard: React.FC<Props> = ({ lang }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [search, setSearch] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  const t = translations[lang];

  useEffect(() => {
    const savedToken = sessionStorage.getItem('pipo_admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchAdminData(savedToken);
    }
  }, []);

  const fetchAdminData = async (authToken: string) => {
    setLoading(true);
    try {
      const [usersData, statsData, announcementData] = await Promise.all([
        api.admin.getUsers(authToken),
        api.admin.getStats(authToken),
        api.getAnnouncement()
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      if (statsData?.stats) {
        setStats(statsData.stats);
        setLogs(statsData.logs || []);
      }
      if (announcementData) {
        setAnnouncementMsg(announcementData.message || '');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await api.admin.verifyPin(pin.trim());
    setLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      sessionStorage.setItem('pipo_admin_token', res.token);
      setIsAuthenticated(true);
      fetchAdminData(res.token);
    } else {
      setError(res.error || 'رمز المرور غير صحيح');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0a0f1d] border border-cyan-500/40 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">{t.admin.title}</h2>
          <p className="text-xs text-slate-400 mt-2">{t.admin.pinPrompt}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest font-mono focus:outline-none"
            required
            autoFocus
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : t.admin.loginBtn}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t.admin.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{t.admin.subtitle}</p>
        </div>
        <button
          onClick={() => fetchAdminData(token)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث</span>
        </button>
      </div>

      {/* بطاقات الإحصائيات الكاملة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-cyan-500/20">
          <Users className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-2xl font-black text-white font-mono">{users.length || 1}</p>
          <p className="text-[11px] text-slate-400">{t.admin.totalUsers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-2xl font-black text-emerald-400 font-mono">{users.filter(u => !u.isBanned).length || 1}</p>
          <p className="text-[11px] text-slate-400">{t.admin.activeUsers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-rose-500/20">
          <Ban className="w-5 h-5 text-rose-400 mb-2" />
          <p className="text-2xl font-black text-rose-400 font-mono">{users.filter(u => u.isBanned).length || 0}</p>
          <p className="text-[11px] text-slate-400">{t.admin.bannedUsers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/20">
          <Crown className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-black text-amber-400 font-mono">{users.filter(u => u.isVIP).length || 0}</p>
          <p className="text-[11px] text-slate-400">{t.admin.vipUsers}</p>
        </div>
      </div>
    </div>
  );
};
