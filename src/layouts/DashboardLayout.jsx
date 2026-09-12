import { useState } from 'react';
import { Outlet, Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Bell, BookOpen, History as HistoryIcon, HelpCircle, Code, Lock, Menu, X,
  AlertTriangle, CheckCircle2, User, Settings, LogOut, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, switchTeacherRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const displayName = profile?.full_name || 'Siswa PPLG';
  const displayClass = profile?.class_name || 'X PPLG 1';

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Deadline Mendesak',
      message: 'LKPD AI 01 berakhir besok. Segera submit tugas Anda!',
      time: '2 jam yang lalu',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Tugas Dinilai',
      message: 'Pak Didin telah menilai Rangkuman Laravel MVC Anda. Skor: 92/100.',
      time: 'Kemarin, 14:30',
      unread: false
    }
  ]);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.2); // C5
      playTone(659.25, now + 0.1, 0.4); // E5
    } catch (e) {
      console.log('Audio play blocked or not supported');
    }
  };

  const simulateNewNotification = () => {
    playNotificationSound();
    const newNotif = {
      id: Date.now(),
      type: 'info',
      title: 'Pengumuman Baru',
      message: 'Ujian Tengah Semester akan dimulai minggu depan.',
      time: 'Baru saja',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };


  const handleSearchChange = (e) => {
    const q = e.target.value;
    if (q) {
      searchParams.set('q', q);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleTeacherPortalAccess = async () => {
    const pin = window.prompt('Masukkan PIN akses Guru:\n\nGURU2026', 'GURU2026');
    if (!pin) return;

    const result = await switchTeacherRole(pin);
    if (!result.success) {
      window.alert(result.message || 'PIN tidak valid.');
      return;
    }

    navigate('/teacher');
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-canvas)] flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-[var(--color-brand-surface)] border-b border-[var(--color-brand-border)] p-4 flex-shrink-0">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)] rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[var(--color-brand-text-high)]">Karsa<span className="text-[var(--color-brand-primary)]">Dev</span></h1>
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-border)] rounded-full transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className="relative p-1.5 text-[var(--color-brand-text-muted)] hover:bg-[var(--color-brand-border)] rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => n.unread) && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>}
          </button>
          
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="focus:outline-none ring-2 ring-transparent focus:ring-[var(--color-brand-primary)]/30 rounded-full transition-all"
          >
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
          </button>

          {/* Mobile Popovers */}
          {isNotifOpen && (
            <div className="absolute right-0 top-[120%] mt-2 w-[300px] bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-between items-center">
                <h3 className="font-bold text-sm text-[var(--color-brand-text-high)]">Notifikasi</h3>
                <button onClick={simulateNewNotification} className="text-xs font-semibold text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 px-2 py-1 rounded hover:bg-[var(--color-brand-primary)]/20 transition-colors">
                  Simulasikan
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 border-b border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer flex gap-3 transition-colors relative">
                    {notif.unread && <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'urgent' ? 'bg-red-100 dark:bg-red-500/10' : notif.type === 'success' ? 'bg-teal-100 dark:bg-teal-500/10' : 'bg-blue-100 dark:bg-blue-500/10'}`}>
                      {notif.type === 'urgent' ? <AlertTriangle className={`w-4 h-4 text-red-600`} /> : notif.type === 'success' ? <CheckCircle2 className={`w-4 h-4 text-teal-600`} /> : <Bell className={`w-4 h-4 text-blue-600`} />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${notif.unread ? 'text-[var(--color-brand-text-high)]' : 'text-[var(--color-brand-text-medium)]'}`}>{notif.title}</p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] mt-1.5 uppercase tracking-wide">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isProfileOpen && (
            <div className="absolute right-0 top-[120%] mt-2 w-64 bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-brand-text-high)]">{displayName}</p>
                  <p className="text-[11px] text-[var(--color-brand-text-medium)] mt-0.5">{displayClass}</p>
                </div>
              </div>
              <div className="p-2 space-y-0.5">
                <button className="w-full text-left px-3 py-2 text-sm font-medium text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)] hover:text-[var(--color-brand-primary)] rounded-md flex items-center gap-2.5 transition-colors">
                  <User className="w-4 h-4" /> Edit Profil
                </button>
                <Link to="/login" className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md flex items-center gap-2.5 transition-colors mt-1">
                  <LogOut className="w-4 h-4" /> Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-[260px] bg-[var(--color-brand-surface)] border-r border-[var(--color-brand-border)] flex-col flex-shrink-0 absolute md:relative z-50 h-[calc(100vh-73px)] md:h-screen top-[73px] md:top-0 left-0`}>
         <div className="p-6 hidden md:block">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[var(--color-brand-primary)] rounded-lg flex items-center justify-center shadow-sm">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-brand-text-high)]">
              Karsa<span className="text-[var(--color-brand-primary)]">Dev</span>
            </h1>
            <span className="bg-blue-100 text-[var(--color-brand-primary)] text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">
              SMK PPLG
            </span>
          </div>
        </div>

        <div className="p-6 md:pt-0 mb-4">
          <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] uppercase tracking-wider mb-2 px-3">
            Navigasi Belajar
          </p>
          <nav className="space-y-1">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}>
              <BookOpen className="w-4 h-4" />
              Daftar Tugas & LKPD
            </Link>
            <Link to="/dashboard/history" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/history') ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}>
              <HistoryIcon className="w-4 h-4" />
              Riwayat Pengumpulan
            </Link>
            <Link to="/dashboard/help" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard/help') ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}>
              <HelpCircle className="w-4 h-4" />
              Panduan Help / FAQ
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="mb-2">
            <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] uppercase tracking-wider mb-2 px-3 flex justify-between items-center">
              Mode Guru
              <Lock className="w-3 h-3" />
            </p>
            <button
              type="button"
              onClick={handleTeacherPortalAccess}
              className="w-full px-3 py-2.5 border border-[var(--color-brand-border)] rounded-md bg-[var(--color-brand-canvas)] text-left text-xs font-semibold text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-border)] transition-colors"
            >
              <span className="block text-[10px] uppercase tracking-wide text-[var(--color-brand-text-muted)]">PIN akses</span>
              <span className="mt-1 block font-mono text-[var(--color-brand-primary)]">GURU2026</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-73px)] md:h-screen overflow-hidden relative">
        {/* Top Header (Desktop) */}
        <header className="hidden md:flex h-[72px] bg-[var(--color-brand-surface)] border-b border-[var(--color-brand-border)] items-center justify-between px-6 flex-shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[var(--color-brand-text-muted)]" />
              </div>
              <input
                type="text"
                value={searchParams.get('q') || ''}
                onChange={handleSearchChange}
                className="w-full bg-[var(--color-brand-border)]/70 border-none rounded-full py-2 pl-10 pr-4 text-sm text-[var(--color-brand-text-high)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:bg-[var(--color-brand-surface)] transition-all"
                placeholder="Cari tugas, guru, atau modul..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4 relative">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className="relative p-2 text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/30"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>}
              </button>
              
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[var(--color-brand-text-high)]">Notifikasi</h3>
                    <button onClick={simulateNewNotification} className="text-xs font-semibold text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 px-2 py-1 rounded hover:bg-[var(--color-brand-primary)]/20 transition-colors">
                      Simulasikan Suara
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer flex gap-3 transition-colors relative">
                        {notif.unread && <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></span>}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'urgent' ? 'bg-red-100 dark:bg-red-500/10' : notif.type === 'success' ? 'bg-teal-100 dark:bg-teal-500/10' : 'bg-blue-100 dark:bg-blue-500/10'}`}>
                          {notif.type === 'urgent' ? <AlertTriangle className={`w-4 h-4 text-red-600`} /> : notif.type === 'success' ? <CheckCircle2 className={`w-4 h-4 text-teal-600`} /> : <Bell className={`w-4 h-4 text-blue-600`} />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${notif.unread ? 'text-[var(--color-brand-text-high)]' : 'text-[var(--color-brand-text-medium)]'}`}>{notif.title}</p>
                          <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] mt-1.5 uppercase tracking-wide">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer transition-colors">
                    <span onClick={() => setNotifications(prev => prev.map(n => ({...n, unread: false})))} className="text-xs font-bold text-[var(--color-brand-primary)]">Tandai semua dibaca</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-[var(--color-brand-border)] pl-4 relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">{displayName}</p>
                <p className="text-xs text-[var(--color-brand-text-muted)]">{displayClass}</p>
              </div>
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                className="focus:outline-none ring-2 ring-transparent focus:ring-[var(--color-brand-primary)]/30 rounded-full transition-all"
              >
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-[120%] mt-1 w-64 bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm" />
                    <div>
                      <p className="text-sm font-bold text-[var(--color-brand-text-high)]">{displayName}</p>
                      <p className="text-[11px] text-[var(--color-brand-text-medium)] mt-0.5">{profile?.email || 'siswa@smk.sch.id'}</p>
                      <p className="text-[10px] font-mono font-bold text-[var(--color-brand-primary)] mt-1 bg-blue-50 dark:bg-blue-500/10 inline-block px-1.5 py-0.5 rounded">Kelas: {displayClass}</p>
                    </div>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <Link to="/dashboard/settings?tab=profile" onClick={() => setIsProfileOpen(false)} className="w-full text-left px-3 py-2 text-sm font-medium text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)] hover:text-[var(--color-brand-primary)] rounded-md flex items-center gap-2.5 transition-colors">
                      <User className="w-4 h-4" /> Edit Profil Lengkap
                    </Link>
                    <Link to="/dashboard/settings?tab=account" onClick={() => setIsProfileOpen(false)} className="w-full text-left px-3 py-2 text-sm font-medium text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)] hover:text-[var(--color-brand-primary)] rounded-md flex items-center gap-2.5 transition-colors">
                      <Settings className="w-4 h-4" /> Pengaturan Akun
                    </Link>
                  </div>
                  <div className="p-2 border-t border-[var(--color-brand-border)]">
                    <Link to="/login" className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md flex items-center gap-2.5 transition-colors">
                      <LogOut className="w-4 h-4" /> Keluar Aplikasi
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
