import { useState } from 'react';
import { User, Settings as SettingsIcon, Bell, Key, Camera, Save, Shield, Eye, EyeOff, Activity, Clock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const activeTab = (tabFromUrl === 'profile' || tabFromUrl === 'account' || tabFromUrl === 'activity') ? tabFromUrl : 'profile';
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-8 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <Save className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Perubahan berhasil disimpan!</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-text-high)] tracking-tight">Pengaturan & Profil</h2>
        <p className="text-sm text-[var(--color-brand-text-medium)] mt-1">Kelola informasi pribadi dan preferensi akun Anda.</p>
      </div>

      <div className="bg-[var(--color-brand-surface)] rounded-[16px] border border-[var(--color-brand-border)] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-[var(--color-brand-canvas)]/50 border-b md:border-b-0 md:border-r border-[var(--color-brand-border)] p-4 md:p-6 shrink-0">
          <nav className="space-y-1 flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => handleTabChange('profile')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-border)]'}`}
            >
              <User className="w-4 h-4" />
              Profil Lengkap
            </button>
            <button 
              onClick={() => handleTabChange('account')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'account' ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-border)]'}`}
            >
              <SettingsIcon className="w-4 h-4" />
              Pengaturan Akun
            </button>
            <button 
              onClick={() => handleTabChange('activity')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'activity' ? 'bg-[var(--color-brand-primary)] text-white shadow-sm' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-border)]'}`}
            >
              <Activity className="w-4 h-4" />
              Log Aktivitas
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8">
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] mb-6">Informasi Pribadi</h3>
              
              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-[var(--color-brand-border)]">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
                    <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-full text-[var(--color-brand-primary)] shadow-sm hover:bg-[var(--color-brand-canvas)] transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-brand-text-high)] text-sm mb-1">Foto Profil</h4>
                    <p className="text-xs text-[var(--color-brand-text-medium)] mb-3">Format JPG, GIF atau PNG. Maksimal ukuran 2MB.</p>
                    <div className="flex gap-2">
                      <button type="button" className="px-3 py-1.5 bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-md text-xs font-semibold text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-canvas)] transition-colors">
                        Ubah Foto
                      </button>
                      <button type="button" className="px-3 py-1.5 text-red-600 rounded-md text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Nama Lengkap</label>
                    <input type="text" defaultValue={profile?.full_name || 'Siswa PPLG'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Nomor Induk Siswa (NIS/NISN)</label>
                    <input type="text" defaultValue={profile?.id || 'Belum diisi'} disabled className="w-full bg-[var(--color-brand-border)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm text-[var(--color-brand-text-muted)] cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Email Sekolah</label>
                    <input type="email" defaultValue={profile?.email || 'siswa@smk.sch.id'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Kelas / Konsentrasi</label>
                    <select defaultValue={profile?.class_name || 'X PPLG 1'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20">
                      <option>X PPLG 1</option>
                      <option>X PPLG 2</option>
                      <option>X PPLG 3</option>
                      <option>XI PPLG 1</option>
                      <option>XI PPLG 2</option>
                      <option>XI PPLG 3</option>
                      <option>XII PPLG 1</option>
                      <option>XII PPLG 2</option>
                      <option>XII PPLG 3</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Bio / Moto Belajar</label>
                    <textarea rows={3} defaultValue="Fokus mendalami ekosistem JavaScript dan Framework Modern." className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 resize-none"></textarea>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white font-semibold rounded-lg py-2 px-5 text-sm transition-colors flex items-center gap-2 shadow-sm">
                    <Save className="w-4 h-4" /> Simpan Profil
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] mb-6">Pengaturan Keamanan & Akun</h3>
              
              <div className="space-y-8 max-w-2xl">
                {/* Change Password */}
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    <h4 className="font-semibold text-[var(--color-brand-text-high)] text-sm">Ubah Kata Sandi</h4>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Kata Sandi Saat Ini</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-brand-text-muted)]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Kata Sandi Baru</label>
                      <div className="relative">
                        <input type={showNewPassword ? 'text' : 'password'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-brand-text-muted)]">
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[var(--color-brand-text-high)]">Konfirmasi Sandi Baru</label>
                      <input type={showNewPassword ? 'text' : 'password'} className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="bg-[var(--color-brand-canvas)] hover:bg-[var(--color-brand-border)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-high)] font-semibold rounded-lg py-2 px-4 text-sm transition-colors">
                      Perbarui Kata Sandi
                    </button>
                  </div>
                </form>

                <hr className="border-[var(--color-brand-border)]" />

                {/* Notifications */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-[var(--color-brand-primary)]" />
                    <h4 className="font-semibold text-[var(--color-brand-text-high)] text-sm">Preferensi Notifikasi</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-[var(--color-brand-border)] rounded-lg cursor-pointer hover:bg-[var(--color-brand-canvas)] transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Pengingat Tugas</p>
                        <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Beritahu saya saat deadline H-1</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-brand-primary)] rounded cursor-pointer" />
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border border-[var(--color-brand-border)] rounded-lg cursor-pointer hover:bg-[var(--color-brand-canvas)] transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Notifikasi Nilai Baru</p>
                        <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Kirim email saat guru memberikan nilai/feedback</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-brand-primary)] rounded cursor-pointer" />
                    </label>
                  </div>
                </div>

                <hr className="border-[var(--color-brand-border)]" />

                {/* Privacy & Sessions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-[var(--color-brand-text-muted)]" />
                    <h4 className="font-semibold text-[var(--color-brand-text-high)] text-sm">Sesi Perangkat</h4>
                  </div>
                  <div className="bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-[var(--color-brand-text-high)] flex items-center gap-2">
                        Mac OS • Chrome <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Aktif Sekarang</span>
                      </p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Jakarta, ID • IP: 114.122.x.x</p>
                    </div>
                  </div>
                  <button className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700">Keluar dari semua perangkat lain</button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] mb-6">Log Aktivitas</h3>
              
              <div className="space-y-6 max-w-2xl">
                <div className="relative border-l border-[var(--color-brand-border)] ml-3 space-y-8 pb-4">
                  <div className="relative pl-6">
                    <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] flex items-center justify-center">
                      <Save className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Memperbarui Profil</p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Anda mengubah foto profil dan bio.</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-brand-text-muted)]" />
                        <span className="text-xs font-medium text-[var(--color-brand-text-muted)]">Hari ini, 10:45 WIB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] flex items-center justify-center">
                      <SettingsIcon className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Ubah Preferensi Notifikasi</p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Anda mengaktifkan notifikasi "Pengingat Tugas".</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-brand-text-muted)]" />
                        <span className="text-xs font-medium text-[var(--color-brand-text-muted)]">Kemarin, 14:20 WIB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] flex items-center justify-center">
                      <Key className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Pembaruan Keamanan</p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Anda berhasil mengubah kata sandi akun.</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-brand-text-muted)]" />
                        <span className="text-xs font-medium text-[var(--color-brand-text-muted)]">12 Agu 2025, 09:10 WIB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-[-17px] top-1 w-8 h-8 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-brand-text-high)]">Login Perangkat Baru</p>
                      <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5">Akses dari perangkat Mac OS di Jakarta, ID.</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-brand-text-muted)]" />
                        <span className="text-xs font-medium text-[var(--color-brand-text-muted)]">11 Agu 2025, 18:30 WIB</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-center border-t border-[var(--color-brand-border)]">
                  <button className="text-xs font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)]">
                    Muat Lebih Banyak Aktivitas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
