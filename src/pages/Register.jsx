import { useState } from 'react';
import { Mail, Key, Eye, EyeOff, ArrowRight, Moon, User, RotateCcw, Code, GraduationCap, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CLASS_OPTIONS = [
  'X PPLG 1',
  'X PPLG 2',
  'X PPLG 3',
  'XI PPLG 1',
  'XI PPLG 2',
  'XI PPLG 3',
  'XII PPLG 1',
  'XII PPLG 2',
  'XII PPLG 3',
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('X PPLG 1');
  const [nisn, setNisn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    const result = await signUp({
      email,
      password,
      full_name: fullName.trim(),
      class_name: className,
      nisn: nisn.trim(),
    });
    setLoading(false);

    if (!result?.success) {
      setError(result?.message || 'Registrasi gagal. Silakan coba lagi.');
      return;
    }

    // Auto login ke dashboard setelah registrasi berhasil
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-canvas)] p-4 relative overflow-hidden">
      
      {/* Blurred background orbs for aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col items-center w-full max-w-[440px] z-10">
        <div className="bg-[var(--color-brand-surface)] w-full rounded-[16px] shadow-[0_8px_30px_rgb(12,30,48,0.08)] border border-[var(--color-brand-border)] p-8 relative">
          
          {/* Dark Mode Toggle */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--color-brand-canvas)] text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-border-hover)] transition-colors"
            aria-label="Toggle Dark Mode"
          >
            <Moon className="w-5 h-5" />
          </button>

          {/* Header Section */}
          <div className="flex flex-col items-center text-center mt-2 mb-8">
            <div className="w-12 h-12 bg-[var(--color-brand-primary)] rounded-[12px] flex items-center justify-center mb-4 shadow-sm">
              <Code className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-brand-text-high)] mb-1">
              Daftar Akun Baru
            </h1>
            <p className="text-[var(--color-brand-text-medium)] text-sm">
              Mulai perjalanan belajar di KarsaDev
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-4" onSubmit={handleRegister}>
            
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="Nama lengkap kamu"
                  required
                />
              </div>
            </div>

            {/* Kelas & NISN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="class" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                  Kelas PPLG
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GraduationCap className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                  </div>
                  <select
                    id="class"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-3 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all cursor-pointer font-medium"
                  >
                    {CLASS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="nisn" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                  NIS / NISN <span className="text-xs font-normal text-[var(--color-brand-text-muted)]">(opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                  </div>
                  <input
                    type="text"
                    id="nisn"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                    placeholder="Contoh: 20241029"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                Email / Gmail
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
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="nama@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-10 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="Minimal 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-medium)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-[var(--color-brand-text-high)]">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <RotateCcw className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 pl-10 pr-10 text-sm text-[var(--color-brand-text-high)] placeholder-[var(--color-brand-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all"
                  placeholder="Ulangi kata sandi"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-medium)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-primary)] disabled:opacity-60"
              >
                {loading ? 'Mendaftar...' : 'Daftar Akun'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center pt-2">
              <span className="text-xs text-[var(--color-brand-text-medium)]">
                Sudah punya akun? <Link to="/login" className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)]">Masuk di sini</Link>
              </span>
            </div>
          </form>
        </div>

        {/* Page Footer */}
        <div className="mt-8 text-center text-[11px] font-medium text-[var(--color-brand-text-muted)] flex flex-wrap justify-center items-center gap-2">
          <span>&copy; 2024 KarsaDev Platform</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)] hidden sm:block"></span>
          <span>SMKN 1 Ciomas PPLG. Hak cipta dilindungi.</span>
          <div className="flex-grow w-full sm:hidden"></div>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)] hidden sm:block"></span>
          <a href="#" className="hover:text-[var(--color-brand-text-medium)]">Panduan Siswa</a>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)]"></span>
          <a href="#" className="hover:text-[var(--color-brand-text-medium)]">Bantuan IT Lab</a>
          <span className="w-1 h-1 rounded-full bg-[var(--color-brand-border-hover)]"></span>
          <span className="text-[var(--color-brand-secondary)] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-secondary)]"></span>
            v2.4.0
          </span>
        </div>
      </div>
    </div>
  );
}
