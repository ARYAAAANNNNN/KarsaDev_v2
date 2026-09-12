import { useEffect, useState } from 'react';
import { CheckCircle2, Search, Clock, Lock } from 'lucide-react';
import { fetchSubmissions } from '../lib/supabaseClient';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSemester, setFilterSemester] = useState('Semua Semester');
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const submissions = await fetchSubmissions();
      const mapped = submissions.map((item) => ({
        title: item.module_title || 'Tugas',
        subject: item.class_name || 'PPLG',
        date: new Date(item.submitted_at || Date.now()).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: item.status === 'Pending' ? 'Diproses' : item.status === 'Revision' ? 'Revisi' : 'Dinilai',
        score: item.score ?? null,
        semester: 'Semester Genap 2025/2026',
        link: item.submission_url || '#',
      }));

      setHistoryData(mapped.length ? mapped : [
        { title: 'Praktik & Rangkuman Laravel MVC', subject: 'Pemrograman Web & Perangkat Bergerak', date: 'Hari ini, 10:30 WIB', status: 'Dinilai', score: 92, semester: 'Semester Genap 2025/2026', link: '#' },
      ]);
    };

    load();
  }, []);

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = filterSemester === 'Semua Semester' || item.semester === filterSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-brand-text-high)] tracking-tight">Riwayat Pengumpulan</h2>
          <p className="text-sm text-[var(--color-brand-text-medium)] mt-1">Tinjau nilai dan masukan dari guru pengampu.</p>
        </div>
      </div>

      <div className="bg-[var(--color-brand-surface)] rounded-[16px] border border-[var(--color-brand-border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--color-brand-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[var(--color-brand-canvas)]/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-brand-text-muted)]" />
            <input 
              type="text" 
              placeholder="Cari riwayat tugas atau mata pelajaran..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-lg py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 transition-shadow shadow-sm" 
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <span className="text-sm font-medium text-[var(--color-brand-text-muted)]">Filter:</span>
             <select 
               value={filterSemester}
               onChange={(e) => setFilterSemester(e.target.value)}
               className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 shadow-sm w-full md:w-auto"
             >
               <option value="Semua Semester">Semua Semester</option>
               <option value="Semester Genap 2025/2026">Semester Genap 2025/2026</option>
               <option value="Semester Ganjil 2025/2026">Semester Ganjil 2025/2026</option>
             </select>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--color-brand-border)]">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <div key={index} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-brand-canvas)] transition-colors group">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl mt-1 shrink-0 ${item.status === 'Dinilai' ? 'bg-[var(--color-brand-secondary-bg)] text-[var(--color-brand-secondary)]' : 'bg-[var(--color-brand-border)] text-[var(--color-brand-text-muted)]'}`}>
                    {item.status === 'Dinilai' ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-brand-text-high)] group-hover:text-[var(--color-brand-primary)] transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-text-muted)] bg-[var(--color-brand-border)] px-2 py-0.5 rounded">
                        {item.subject}
                      </span>
                      <span className="text-xs text-[var(--color-brand-text-medium)] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Dikumpulkan pada {item.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:flex-col md:items-end md:w-32 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--color-brand-border)]">
                  {item.score !== null ? (
                    <div className="flex flex-col items-start md:items-end w-full">
                      <span className="text-[10px] font-bold text-[var(--color-brand-text-muted)] uppercase tracking-widest mb-0.5">Nilai Akhir</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[var(--color-brand-secondary)]">{item.score}</span>
                        <span className="text-sm font-semibold text-[var(--color-brand-secondary)]/50">/100</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start md:items-end w-full">
                      <span className="text-[10px] font-bold text-[var(--color-brand-text-muted)] uppercase tracking-widest mb-0.5">Status</span>
                      <span className="text-sm font-bold text-[var(--color-brand-text-muted)] flex items-center gap-1.5">
                        Terkunci
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-[var(--color-brand-text-muted)] text-sm">
              Tidak ada tugas yang sesuai dengan pencarian Anda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
