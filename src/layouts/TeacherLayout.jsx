import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileCheck2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserRound,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dasbor Ringkasan', path: '/teacher', icon: LayoutDashboard },
  { label: 'Kelola Modul & Tugas', path: '/teacher/tasks', icon: ClipboardList },
  { label: 'Meja Penilaian', path: '/teacher/grading', icon: FileCheck2 },
  { label: 'Rekap Nilai & Kelas', path: '/teacher/recap', icon: BarChart3 },
  { label: 'Pengaturan & Keluar', path: '/teacher/settings', icon: Settings },
];

const teacherProfiles = [
  { id: 'wanda', name: 'Wanda Kurniawan', subject: 'Kecerdasan Buatan & KIK', role: 'teacher' },
  { id: 'didin', name: 'Didin Saharudin, M.Kom.', subject: 'Pemrograman Web Laravel, QA, Docs', role: 'teacher' },
  { id: 'diah', name: 'Diah Pungki Octaviani, S.Pd.', subject: 'Analisis Sistem & Wali Kelas XII PPLG 2', role: 'teacher' },
];

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, setProfile, signOut, switchStudentRole } = useAuth();
  const navigate = useNavigate();

  const activeTeacher = teacherProfiles.find((item) => item.name === profile?.full_name) || teacherProfiles[0];

  const handleSwitchTeacher = (teacher) => {
    setProfile((prev) => ({
      ...prev,
      full_name: teacher.name,
      role: teacher.role,
      class_name: teacher.subject,
    }));
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 flex-col bg-slate-950 text-slate-100">
          <div className="border-b border-slate-800 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">KarsaDev</p>
                <h1 className="text-lg font-bold text-white">Guru Portal</h1>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-b border-slate-800">
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-bold text-slate-950">
                    {activeTeacher.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{profile?.full_name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">{profile?.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-300">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Navigasi Akses</p>
            <nav className="space-y-2">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/teacher'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                <GraduationCap className="h-3.5 w-3.5" />
                Pilihan Guru Aktif
              </div>
              <div className="space-y-2">
                {teacherProfiles.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => handleSwitchTeacher(teacher)}
                    className={`w-full rounded-xl border p-2 text-left transition ${
                      activeTeacher.id === teacher.id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{teacher.name}</p>
                    <p className="text-[10px] text-slate-300">{teacher.subject}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 p-4 space-y-2">
            <button
              onClick={async () => {
                await switchStudentRole();
                navigate('/dashboard');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
            >
              <UserRound className="h-4 w-4" />
              Kembali ke Mode Siswa
            </button>
            <button
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Keluar Guru
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg border border-slate-200 p-2">
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600">KarsaDev</p>
                  <p className="text-sm font-bold text-slate-800">Guru Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-bold text-cyan-700">
                <UserRound className="h-3 w-3" />
                {profile?.role}
              </div>
            </div>
          </header>

          {mobileOpen && (
            <div className="border-b border-slate-200 bg-white md:hidden">
              <nav className="space-y-2 p-4">
                {navItems.map(({ label, path, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/teacher'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-cyan-100 text-cyan-700' : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
