import { useState } from 'react';
import { Mail, Key, Eye, EyeOff, ArrowRight, Moon, Code, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn(email, password);
    if (!result?.success) {
      setError(result?.message || 'Login gagal. Silakan coba lagi.');
      return;
    }

    const role = result.profile?.role;
    navigate(role === 'teacher' ? '/teacher' : '/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-canvas)] p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col items-center w-full max-w-[440px] z-10">
        <div className="bg-[var(--color-brand-surface)] w-full rounded-[16px] shadow-[0_8px_30px_rgb(12,30,48,0.08)] border border-[var(--color-brand-border)] p-8 relative">
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--color-brand-canvas)] text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-border-hover)] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            <Moon className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-2 mb-8">
            <div className="w-14 h-14 bg-[var(--color-brand-primary)] rounded-[12px] flex items-center justify-center mb-4 shadow-sm">
              <Code className="w-8 h-8 text-white stroke-[2.5]" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--color-brand-text-high)] flex items-center">
                Karsa<span className="text-[var(--color-brand-primary)]">Dev</span>
              </h1>
              <span className="bg-[var(--color-brand-secondary-bg)] text-[var(--color-brand-secondary)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                SMK PPLG Assignment Hub
              </span>
            </div>

            <p className="text-[var(--color-brand-text-medium)] text-sm">
              Portal Tugas Siswa PPLG
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="nama@gmail.com atau @smk.sch.id"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                  Kata Sandi
                </label>
                <a href="#" className="text-xs font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)]">
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2.5 pl-10 pr-10 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="Minimal 8 karakter terdaftar"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-medium)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2.5 focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'bg-[var(--color-brand-surface)] border-[var(--color-brand-border)]'}`}>
                  {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <span className="text-sm font-medium text-[var(--color-brand-text-medium)] select-none">
                  Ingat sesi masuk di perangkat ini
                </span>
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-primary)]"
              >
                Masuk ke Akun
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-[var(--color-brand-text-medium)]">
                Belum punya akun? <Link to="/register" className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)]">Daftar sekarang</Link>
              </span>
            </div>
          </form>

          <div className="mt-8 flex justify-between items-center text-[10px] text-[var(--color-brand-text-muted)] font-[var(--font-mono)] border-t border-[var(--color-brand-border)] pt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-secondary)]"></span>
              v2.4.0-release
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              git: 94a1f8c
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] font-medium text-[var(--color-brand-text-muted)] flex items-center justify-center gap-2">
          <span>SMK Negeri 1 Jakarta</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)]"></span>
          <a href="#" className="hover:text-[var(--color-brand-text-medium)]">Bantuan</a>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)]"></span>
          <a href="#" className="hover:text-[var(--color-brand-text-medium)]">Status Server</a>
        </div>
      </div>
    </div>
  );
}
