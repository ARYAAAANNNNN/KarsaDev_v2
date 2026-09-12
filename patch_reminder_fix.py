import re

with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

# 1. Add BellRing to imports
if "BellRing" not in content:
    content = content.replace("  Plus,\n  X,\n  Clock,", "  Plus,\n  X,\n  Clock,\n  BellRing,")

# 2. Add States and function
state_injection = """  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [reminderModal, setReminderModal] = useState({ isOpen: false, taskTitle: '' });
  const [reminderTime, setReminderTime] = useState('5');
  const [reminderToast, setReminderToast] = useState({ show: false, message: '' });

  const scheduleReminder = () => {
    const timeInMs = parseInt(reminderTime) * 1000;
    
    // Simulasikan notifikasi
    setTimeout(() => {
      setReminderToast({ show: true, message: `Waktunya mengerjakan tugas: ${reminderModal.taskTitle}` });
      
      // Bunyikan suara peringatan lokal
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.value = 880; // Nada A5
          
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.6);
        }
      } catch(e) {
        console.log('Audio error:', e);
      }
      
      // Hilangkan toast setelah 5 detik
      setTimeout(() => setReminderToast({ show: false, message: '' }), 5000);
    }, timeInMs);
    
    setReminderModal({ isOpen: false, taskTitle: '' });
    
    // Tampilkan konfirmasi
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };"""

if "scheduleReminder" not in content:
    content = content.replace("  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);", state_injection)

# 3. Add Reminder Toast UI
toast_ui = """      {/* Toast Notification */}
      {reminderToast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-5">
          <BellRing className="w-5 h-5 animate-bounce" />
          <span className="text-sm font-bold">{reminderToast.message}</span>
        </div>
      )}"""
if "reminderToast.show" not in content:
    content = content.replace("      {/* Toast Notification */}", toast_ui)

# 4. Add Reminder Modal UI
reminder_modal = """
      {/* Reminder Modal */}
      {reminderModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--color-brand-surface)] rounded-2xl w-full max-w-sm border border-[var(--color-brand-border)] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-brand-border)]">
              <h3 className="font-bold text-lg text-[var(--color-brand-text-high)] flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-500" /> Set Pengingat
              </h3>
              <button 
                onClick={() => setReminderModal({ isOpen: false, taskTitle: '' })}
                className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-[var(--color-brand-text-medium)] mb-4">Ingatkan saya untuk tugas:<br/><strong className="text-[var(--color-brand-text-high)]">{reminderModal.taskTitle}</strong></p>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-2">Pilih durasi waktu:</label>
                <select 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-3 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  <option value="5">Dalam 5 Detik (Mode Demo)</option>
                  <option value="10">Dalam 10 Detik (Mode Demo)</option>
                  <option value="1800">Dalam 30 Menit</option>
                  <option value="3600">Dalam 1 Jam</option>
                  <option value="86400">Besok Hari</option>
                </select>
              </div>
            </div>
            
            <div className="p-5 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-end gap-3">
              <button 
                onClick={() => setReminderModal({ isOpen: false, taskTitle: '' })}
                className="px-4 py-2 text-sm font-semibold text-[var(--color-brand-text-medium)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={scheduleReminder}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                Simpan Alarm
              </button>
            </div>
          </div>
        </div>
      )}
"""
if "Reminder Modal" not in content:
    content = content.replace("    </div>\n  );\n}", reminder_modal + "    </div>\n  );\n}")

# 5. Inject Bell Button to Cards
def inject_button(target_text, title):
    btn = f"""<div className="flex gap-1.5 items-center">
                <button 
                  onPointerDown={{(e) => e.stopPropagation()}} 
                  onClick={{(e) => {{ e.preventDefault(); e.stopPropagation(); setReminderModal({{ isOpen: true, taskTitle: '{title}' }}); }}}} 
                  className="flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                  title="Pasang Alarm Pengingat"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
                {target_text}
              </div>"""
    return btn

# Replace for Card 1
target1 = '<span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-primary)] bg-[var(--color-brand-canvas)] px-2 py-1 rounded">\n                <Clock className="w-3.5 h-3.5" /> Besok, 23:59 WIB\n              </span>'
if target1 in content:
    content = content.replace(target1, inject_button(target1.strip(), 'Praktik & Rangkuman Laravel MVC'))

# Replace for Card 3
target3 = '<span className="flex items-center gap-1 text-xs font-medium text-[var(--color-brand-text-medium)] bg-[var(--color-brand-border)] px-2 py-1 rounded">\n                <Clock className="w-3.5 h-3.5" /> Jumat, 15:00 WIB\n              </span>'
if target3 in content:
    content = content.replace(target3, inject_button(target3.strip(), 'Rangkuman SRS & Sketsa Use Case'))


with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)

