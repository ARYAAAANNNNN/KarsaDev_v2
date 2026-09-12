import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_ACCOUNTS } from '../../lib/authApi';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const redirectPath = location.state?.from?.pathname || '/teacher';

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result?.success) {
        setError(result?.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        setLoading(false);
        return;
      }

      const role = result.profile?.role;
      const isAdmin = result.profile?.is_admin;

      if (role !== 'teacher' && !isAdmin) {
        setError('Akses ditolak: Akun ini terdaftar sebagai Siswa. Halaman ini khusus untuk Guru & Admin.');
        setLoading(false);
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch {
      setError('Terjadi kesalahan saat memproses login. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const handleQuickSelect = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Portal Siswa
        </Link>
        <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
          RESTRICTED AREA
        </span>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-3.5">
              <ShieldCheck className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-1">
              KarsaDev Instructor Hub
            </p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Portal Guru & Admin</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Masuk untuk mengelola modul, mereview submission, dan penilaian tugas siswa PPLG.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Guru / Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guru@smk.sch.id"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Akses Khusus
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi guru"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Panel Guru</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Account Selector for testing/grading convenience */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pilih Akun Guru Cepat (Demo & Penilaian):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ADMIN_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickSelect(acc)}
                  className={`text-left p-2 rounded-lg border text-xs transition ${
                    email === acc.email
                      ? 'border-cyan-400/60 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <p className="font-semibold truncate">{acc.full_name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> SMK Negeri 1 Jakarta
          </span>
          <span>•</span>
          <span>Konsentrasi Keahlian PPLG</span>
        </div>
      </div>
    </div>
  );
}
