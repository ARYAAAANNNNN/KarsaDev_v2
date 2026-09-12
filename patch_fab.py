import re

with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

# 1. Update imports
imports_to_add = "  Plus,\\n  X,\\n  Clock,"
content = content.replace("  Clock,", imports_to_add)

# 2. Add state
state_code = """  const [showToast, setShowToast] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);"""
content = content.replace("  const [showToast, setShowToast] = useState(false);", state_code)

# 3. Add Modal and FAB before the last </div>
modal_and_fab = """
      {/* Floating Action Button */}
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--color-brand-primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-brand-primary-hover)] hover:-translate-y-1 transition-all z-40 focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-primary)]/30"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--color-brand-surface)] rounded-2xl w-full max-w-md border border-[var(--color-brand-border)] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-brand-border)]">
              <h3 className="font-bold text-lg text-[var(--color-brand-text-high)]">Buat Tugas Baru</h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Judul Tugas</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Rangkuman API" 
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Mata Pelajaran</label>
                  <select className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all">
                    <option>Web & Mobile</option>
                    <option>AI & KIK</option>
                    <option>Analisis & Desain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Tenggat Waktu</label>
                  <input 
                    type="date" 
                    className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Deskripsi Singkat</label>
                <textarea 
                  rows="3" 
                  placeholder="Tambahkan detail atau catatan..."
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
            </div>
            
            <div className="p-5 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-end gap-3">
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[var(--color-brand-text-medium)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => { setIsTaskModalOpen(false); handleAction(); }}
                className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] rounded-lg shadow-md transition-colors"
              >
                Simpan Tugas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

content = content.replace("    </div>\\n  );\\n}", modal_and_fab)

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)
