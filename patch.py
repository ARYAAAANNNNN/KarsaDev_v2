import re

with open('src/layouts/DashboardLayout.jsx', 'r') as f:
    content = f.read()

# Add states
state_injection = """  const [searchParams, setSearchParams] = useSearchParams();

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
"""

content = content.replace("  const [searchParams, setSearchParams] = useSearchParams();", state_injection)

# Replace Mobile Notification Menu
mobile_notif_old = """          {isNotifOpen && (
            <div className="absolute right-0 top-[120%] mt-2 w-[300px] bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-between items-center">
                <h3 className="font-bold text-sm text-[var(--color-brand-text-high)]">Notifikasi</h3>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                <div className="p-4 border-b border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer flex gap-3 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-brand-text-high)]">Deadline Mendesak</p>
                    <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5 leading-relaxed">LKPD AI 01 berakhir besok. Segera submit!</p>
                  </div>
                </div>
              </div>
            </div>
          )}"""

mobile_notif_new = """          {isNotifOpen && (
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
          )}"""

content = content.replace(mobile_notif_old, mobile_notif_new)


# Replace Desktop Notification Menu
desktop_notif_old = """              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--color-brand-surface)] rounded-xl shadow-[0_8px_30px_rgb(12,30,48,0.12)] border border-[var(--color-brand-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-between items-center">
                    <h3 className="font-bold text-sm text-[var(--color-brand-text-high)]">Notifikasi</h3>
                    <span className="text-xs font-semibold text-[var(--color-brand-primary)] cursor-pointer hover:underline">Tandai dibaca</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    <div className="p-4 border-b border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer flex gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-brand-text-high)]">Deadline Mendesak</p>
                        <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5 leading-relaxed">LKPD AI 01 berakhir besok. Segera submit tugas Anda!</p>
                        <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] mt-1.5 uppercase tracking-wide">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-[var(--color-brand-canvas)] cursor-pointer flex gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--color-brand-text-high)]">Tugas Dinilai</p>
                        <p className="text-xs text-[var(--color-brand-text-medium)] mt-0.5 leading-relaxed">Pak Didin telah menilai Rangkuman Laravel MVC Anda. Skor: 92/100.</p>
                        <p className="text-[10px] font-bold text-[var(--color-brand-text-muted)] mt-1.5 uppercase tracking-wide">Kemarin, 14:30</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center border-t border-[var(--color-brand-border)] hover:bg-[var(--color-brand-canvas)] cursor-pointer transition-colors">
                    <span className="text-xs font-bold text-[var(--color-brand-primary)]">Lihat semua notifikasi</span>
                  </div>
                </div>
              )}"""

desktop_notif_new = """              {isNotifOpen && (
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
              )}"""

content = content.replace(desktop_notif_old, desktop_notif_new)


# Also update the red dot logic
red_dot_old_mobile = """            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>"""

red_dot_new_mobile = """            <Bell className="w-5 h-5" />
            {notifications.some(n => n.unread) && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>}"""

red_dot_old_desktop = """                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>"""

red_dot_new_desktop = """                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-brand-surface)]"></span>}"""


content = content.replace(red_dot_old_mobile, red_dot_new_mobile)
content = content.replace(red_dot_old_desktop, red_dot_new_desktop)

with open('src/layouts/DashboardLayout.jsx', 'w') as f:
    f.write(content)

