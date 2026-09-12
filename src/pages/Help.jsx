import { useState } from 'react';
import { HelpCircle, Book, MessageSquare, ExternalLink, ChevronDown } from 'lucide-react';

export default function Help() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-text-high)] tracking-tight">Pusat Bantuan & FAQ</h2>
        <p className="text-sm text-[var(--color-brand-text-medium)] mt-1">Panduan penggunaan platform, literatur teknis, dan bantuan lab.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-6 border border-[var(--color-brand-border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-50 text-[var(--color-brand-primary)] rounded-xl flex items-center justify-center mb-5 ring-4 ring-blue-50/50">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[var(--color-brand-text-high)] mb-2">Panduan Git & GitHub</h3>
          <p className="text-sm text-[var(--color-brand-text-medium)] mb-6 leading-relaxed">Pelajari cara melakukan commit, push, pull request, dan memecahkan konflik merge untuk tugas PPLG.</p>
          <button className="text-sm font-semibold text-[var(--color-brand-primary)] flex items-center gap-1 hover:text-[var(--color-brand-primary-hover)] transition-colors">
            Baca Dokumentasi <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-6 border border-[var(--color-brand-border)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-12 h-12 bg-teal-50 text-[var(--color-brand-secondary)] rounded-xl flex items-center justify-center mb-5 ring-4 ring-teal-50/50">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[var(--color-brand-text-high)] mb-2">Forum Diskusi PPLG</h3>
          <p className="text-sm text-[var(--color-brand-text-medium)] mb-6 leading-relaxed">Tanya jawab seputar error code, berbagi snippet solusi, dan diskusi kelompok secara terpusat.</p>
          <button className="text-sm font-semibold text-[var(--color-brand-secondary)] flex items-center gap-1 hover:text-teal-700 transition-colors">
            Buka Forum Discord <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-6 border border-red-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-gradient-to-b from-white to-red-50/30">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-5 ring-4 ring-red-50">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[var(--color-brand-text-high)] mb-2">Lapor Kendala Lab</h3>
          <p className="text-sm text-[var(--color-brand-text-medium)] mb-6 leading-relaxed">Komputer lab bermasalah, internet putus, atau IDE crash saat ujian? Laporkan langsung ke teknisi.</p>
          <button className="text-sm font-semibold text-red-600 flex items-center gap-1 hover:text-red-700 transition-colors">
            Buat Tiket IT <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-6 md:p-8 border border-[var(--color-brand-border)] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
           <HelpCircle className="w-48 h-48" />
        </div>
        
        <h3 className="font-bold text-xl text-[var(--color-brand-text-high)] mb-6">Pertanyaan yang Sering Diajukan (FAQ)</h3>
        <div className="space-y-4 max-w-3xl">
          {[
            {
              q: "Bagaimana jika saya telat mengumpulkan tugas proyek?", 
              a: "Sistem akan secara otomatis menandai status pengumpulan Anda sebagai 'Terlambat' (Late) berwarna merah. Repositori GitHub masih dapat di-push, namun penilaian akan disesuaikan berdasarkan kebijakan penalti keterlambatan masing-masing guru pengampu mata pelajaran."
            },
            {
              q: "Apakah saya bisa mengubah source code (commit baru) setelah submit tugas?", 
              a: "Bisa, selama batas waktu pengumpulan (deadline sprint) belum berakhir, sistem KarsaDev akan selalu membaca commit terakhir pada branch target (misalnya: main atau feature-branch). Setelah melewati batas waktu, sinkronisasi repositori KarsaDev akan dikunci."
            },
            {
              q: "Dimana saya bisa melihat detail masukan code review dari guru?", 
              a: "Feedback, inline comments, dan catatan dari guru dapat dilihat pada halaman Riwayat Pengumpulan. Klik pada tugas yang berstatus 'Dinilai', KarsaDev akan menampilkan log review beserta skor akhir untuk setiap rubrik penilaian."
            },
            {
              q: "Bagaimana guru pengampu mengakses portal penilaian?",
              a: "Portal Guru dan Penilaian LKPD diakses secara terpisah melalui portal login khusus (/admin atau /admin/login) yang terproteksi dan hanya dapat dibuka oleh akun pendidik terdaftar."
            }
          ].map((faq, i) => (
            <div key={i} className="group border border-[var(--color-brand-border)] rounded-xl overflow-hidden hover:border-[var(--color-brand-primary)]/50 transition-colors bg-[var(--color-brand-surface)]">
              <button onClick={() => toggleFaq(i)} className="w-full p-4 flex items-center justify-between text-left focus:outline-none bg-[var(--color-brand-canvas)]/50 group-hover:bg-blue-50/30 transition-colors">
                <h4 className="font-bold text-[var(--color-brand-text-high)] text-sm">{faq.q}</h4>
                <ChevronDown className={`w-5 h-5 text-[var(--color-brand-text-muted)] shrink-0 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === i && (
                <div className="p-4 pt-2 border-t border-slate-100 bg-[var(--color-brand-surface)] animate-in slide-in-from-top-2 fade-in-50 duration-200">
                  <p className="text-sm text-[var(--color-brand-text-medium)] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
