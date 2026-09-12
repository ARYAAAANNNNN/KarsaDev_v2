import { useEffect, useMemo, useState } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  GitBranch, 
  Link2, 
  MessageSquareText, 
  X, 
  Search, 
  Filter, 
  Clock, 
  GraduationCap 
} from 'lucide-react';
import { fetchSubmissions, subscribeToSubmissions, updateSubmissionGrade } from '../../lib/supabaseClient';
import { CLASS_NAMES } from '../../lib/pplgData';
import UserAvatar from '../../components/common/UserAvatar';

const defaultSubmissions = [
  {
    id: 'sub-1',
    student_name: 'Rizky Maulana',
    class_name: 'XII PPLG 1',
    module_title: 'LKPD AI 01 - Prompt Engineering',
    submitted_at: '2026-09-12 09:40',
    link: 'https://github.com/example/login-project',
    notes: 'Saya sudah menyelesaikan prompt engineering dan menambahkan screen capture hasil eksperimen.',
    status: 'Pending',
    score: null,
  },
  {
    id: 'sub-2',
    student_name: 'Nabila Putri',
    class_name: 'XII PPLG 2',
    module_title: 'Praktik & Rangkuman Laravel MVC',
    submitted_at: '2026-09-11 15:10',
    link: 'https://docs.google.com/document',
    notes: 'Saya lampirkan bagian controller dan route Eloquent.',
    status: 'Revision',
    score: 75,
  },
  {
    id: 'sub-3',
    student_name: 'Ahmad Fauzi',
    class_name: 'XI PPLG 1',
    module_title: 'Praktik & Rangkuman Laravel MVC',
    submitted_at: '2026-09-12 11:20',
    link: 'https://github.com/example/laravel-mvc-rest',
    notes: 'Tugas migrasi database dan API CRUD sudah diuji dengan Postman.',
    status: 'Pending',
    score: null,
  },
  {
    id: 'sub-4',
    student_name: 'Citra Wulandari',
    class_name: 'X PPLG 1',
    module_title: 'Analisis Kebutuhan Sistem (SRS)',
    submitted_at: '2026-09-12 13:05',
    link: 'https://drive.google.com/file/d/sample-srs',
    notes: 'Diagram Use Case dan activity diagram sudah lengkap sesuai modul.',
    status: 'Pending',
    score: null,
  },
];

export default function GradingDeskPage() {
  const [submissions, setSubmissions] = useState(defaultSubmissions);
  const [selected, setSelected] = useState(defaultSubmissions[0]);
  const [score, setScore] = useState('');
  const [status, setStatus] = useState('Dinilai');
  const [feedback, setFeedback] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Filter & Search
  const [classFilter, setClassFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await fetchSubmissions();
      const filtered = data.filter((item) => item.status === 'Pending' || item.status === 'Perlu Revisi');

      if (filtered.length > 0) {
        setSubmissions(
          filtered.map((item) => ({
            id: item.id,
            student_name: item.student_name || 'Siswa',
            class_name: item.student_class || item.class_name || 'XII PPLG 1',
            module_title: item.module_title || 'Modul',
            submitted_at: item.submitted_at ? String(item.submitted_at).replace('T', ' ').slice(0, 16) : new Date().toISOString().slice(0, 16),
            link: item.submission_url || '#',
            notes: item.notes || '-',
            status: item.status || 'Pending',
            score: item.score ?? null,
          }))
        );
      }
    };

    const unsubscribe = subscribeToSubmissions(() => {
      load();
    });

    load();

    return () => unsubscribe();
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchClass = classFilter === 'ALL' || item.class_name === classFilter;
      const matchSearch = 
        item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module_title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [submissions, classFilter, searchQuery]);

  const openGradeModal = (submission) => {
    setSelected(submission);
    setScore(submission.score ?? '');
    setStatus(submission.status === 'Revision' ? 'Revision' : 'Dinilai');
    setFeedback('');
    setModalOpen(true);
  };

  const handleSaveGrade = async () => {
    const nextScore = Number(score) || 0;
    const updated = submissions.map((item) => 
      item.id === selected.id ? { ...item, status, score: nextScore } : item
    );
    setSubmissions(updated);

    if (selected?.id) {
      const result = await updateSubmissionGrade(selected.id, nextScore, status, feedback);
      if (!result.success) {
        console.warn('Save grade failed:', result.message);
      }
    }

    setModalOpen(false);
  };

  const pendingCount = submissions.filter((s) => s.status === 'Pending').length;
  const revisionCount = submissions.filter((s) => s.status === 'Revision' || s.status === 'Perlu Revisi').length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header Halaman */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
            <GraduationCap className="h-4 w-4" />
            <span>Verifikasi & Koreksi Tugas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Meja Penilaian Guru
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Review pengumpulan proyek siswa dari seluruh rombel kejuruan PPLG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} Antrean Baru
          </span>
          {revisionCount > 0 && (
            <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-800">
              {revisionCount} Revisi
            </span>
          )}
        </div>
      </div>

      {/* Toolbar Filter Kelas & Search Siswa */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa atau judul modul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Rombel:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kelas ({submissions.length})</option>
              {CLASS_NAMES.map((kelas) => {
                const count = submissions.filter((s) => s.class_name === kelas).length;
                return (
                  <option key={kelas} value={kelas}>
                    {kelas} {count > 0 ? `(${count})` : ''}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Kolom Daftar Submission */}
        <div className="space-y-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <div 
                key={submission.id} 
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={submission.student_name} size="md" />
                    <div>
                      <p className="text-base font-bold text-slate-900">{submission.student_name}</p>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md mt-0.5">
                        {submission.class_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span 
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        submission.status === 'Revision' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {submission.status}
                    </span>
                    <button 
                      onClick={() => openGradeModal(submission)} 
                      className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
                    >
                      Beri Nilai & Umpan Balik
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 pt-3 border-t border-slate-100">
                  <InfoBox label="Modul Tugas" value={submission.module_title} />
                  <InfoBox label="Waktu Submit" value={submission.submitted_at} />
                  <InfoBox 
                    label="Nilai Saat Ini" 
                    value={submission.score !== null ? `${submission.score} / 100` : 'Belum dinilai'} 
                  />
                </div>

                {submission.notes && (
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Catatan Siswa:</span> "{submission.notes}"
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">Tidak Ada Antrean Tugas</h3>
              <p className="text-sm text-slate-400 mt-1">
                Semua pengumpulan tugas di filter ini telah selesai dinilai atau belum ada siswa yang mengumpulkan.
              </p>
            </div>
          )}
        </div>

        {/* Kolom Informasi & Ringkasan Kinerja Guru */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-600" />
              Panduan Rubrik Penilaian
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Standar Ketuntasan Minimal (KKM) mata pelajaran kejuruan PPLG adalah <span className="font-bold text-slate-800">78</span>.
            </p>
            
            <div className="mt-4 space-y-2.5 text-xs text-slate-700">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-emerald-800">Skor 90 - 100: Sangat Kompeten</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">Kode rapi, fitur lengkap, dokumentasi terstruktur dan tepat waktu.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-100">
                <span className="font-bold text-cyan-800">Skor 78 - 89: Kompeten (Tuntas)</span>
                <p className="text-cyan-700 text-[11px] mt-0.5">Memenuhi indikator capaian pembelajaran dengan sedikit catatan teknis.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <span className="font-bold text-rose-800">Skor &lt; 78: Perlu Remidi</span>
                <p className="text-rose-700 text-[11px] mt-0.5">Wajib menyertakan catatan revisi agar siswa memperbaiki kodingannya.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Ringkasan Beban Penilaian</h3>
            <div className="mt-4 space-y-3">
              <SummaryRow icon={<FileText className="h-4 w-4" />} label="Total Antrean Aktif" value={submissions.length} />
              <SummaryRow icon={<GitBranch className="h-4 w-4" />} label="Rombel Terbina" value="9 Kelas" />
              <SummaryRow icon={<MessageSquareText className="h-4 w-4" />} label="Siswa per Kelas" value="43 - 46 Siswa" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form Penilaian */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <UserAvatar name={selected?.student_name} size="md" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selected?.student_name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selected?.class_name} • {selected?.module_title}</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lampiran Proyek Siswa</p>
                <a
                  href={selected?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  Buka Tautan Tugas / Repositori Siswa
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Skor Nilai (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Contoh: 85"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <span className="text-[11px] text-slate-400">Minimal nilai tuntas KKM: 78</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Status Kelulusan</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                  >
                    <option value="Dinilai">Dinilai (Tuntas)</option>
                    <option value="Revision">Perlu Revisi (Remidi)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Umpan Balik / Catatan Guru</label>
                <textarea
                  rows={4}
                  placeholder="Berikan umpan balik konstruktif untuk pengembangan kemampuan koding siswa..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer"
                >
                  Simpan & Kirim Nilai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{value}</p>
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 text-slate-600">
        <span className="text-cyan-600">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
