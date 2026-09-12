import { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, FileText, GitBranch, Link2, MessageSquareText, X } from 'lucide-react';
import { fetchSubmissions, subscribeToSubmissions, updateSubmissionGrade } from '../../lib/supabaseClient';

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
    notes: 'Saya lampirkan bagian controller dan route.',
    status: 'Revision',
    score: 80,
  },
];

export default function GradingDeskPage() {
  const [submissions, setSubmissions] = useState(defaultSubmissions);
  const [selected, setSelected] = useState(defaultSubmissions[0]);
  const [score, setScore] = useState('');
  const [status, setStatus] = useState('Dinilai');
  const [feedback, setFeedback] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSubmissions();
      const filtered = data.filter((item) => item.status === 'Pending' || item.status === 'Perlu Revisi');

      setSubmissions(
        filtered.map((item) => ({
          id: item.id,
          student_name: item.student_name || 'Siswa',
          class_name: item.class_name || 'XII PPLG 1',
          module_title: item.module_title || 'Modul',
          submitted_at: item.submitted_at || new Date().toISOString(),
          link: item.submission_url || '#',
          notes: item.notes || '-',
          status: item.status || 'Pending',
          score: item.score ?? null,
        }))
      );

      if (filtered[0]) {
        setSelected(filtered[0]);
      }
    };

    const unsubscribe = subscribeToSubmissions(() => {
      load();
    });

    load();

    return () => unsubscribe();
  }, []);

  const openGradeModal = (submission) => {
    setSelected(submission);
    setScore(submission.score ?? '');
    setStatus(submission.status === 'Revision' ? 'Revision' : 'Dinilai');
    setFeedback('');
    setModalOpen(true);
  };

  const handleSaveGrade = async () => {
    const nextScore = Number(score) || 0;
    const updated = submissions.map((item) => item.id === selected.id ? { ...item, status, score: nextScore } : item);
    setSubmissions(updated);

    if (selected?.id) {
      const result = await updateSubmissionGrade(selected.id, nextScore, status, feedback);
      if (!result.success) {
        console.warn('Save grade failed:', result.message);
      }
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Review Tugas</p>
          <h2 className="text-3xl font-bold text-slate-900">Meja Penilaian</h2>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">{submissions.length} antrean pending</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{submission.student_name}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{submission.class_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${submission.status === 'Revision' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                    {submission.status}
                  </span>
                  <button onClick={() => openGradeModal(submission)} className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-600">
                    Buka Form Nilai
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <InfoBox label="Modul" value={submission.module_title} />
                <InfoBox label="Tanggal Submit" value={submission.submitted_at} />
                <InfoBox label="Skor" value={submission.score ?? 'Belum dinilai'} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Quick Summary</h3>
          <div className="mt-4 space-y-3">
            <SummaryRow icon={<FileText className="h-4 w-4" />} label="Modul Review" value="12" />
            <SummaryRow icon={<GitBranch className="h-4 w-4" />} label="Repo Ready" value="9" />
            <SummaryRow icon={<MessageSquareText className="h-4 w-4" />} label="Feedback Tersisa" value="5" />
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">Review Siswa</p>
                <h3 className="text-2xl font-bold text-slate-900">{selected?.student_name}</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Detail Pengumpulan</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li><strong>Kelas:</strong> {selected?.class_name}</li>
                  <li><strong>Modul:</strong> {selected?.module_title}</li>
                  <li><strong>Waktu Submit:</strong> {selected?.submitted_at}</li>
                  <li><strong>Catatan Siswa:</strong> {selected?.notes}</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lampiran Tugas</p>
                <div className="mt-3 space-y-2">
                  <a href={selected?.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600">
                    <Link2 className="h-4 w-4" />
                    Buka Tautan Tugas
                  </a>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    <ArrowUpRight className="h-4 w-4" />
                    Buka File Pendukung
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nilai Angka (0-100)</label>
                <input type="number" min="0" max="100" value={score} onChange={(e) => setScore(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500">
                  <option value="Dinilai">Dinilai (Graded)</option>
                  <option value="Revision">Perlu Revisi (Revision)</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Feedback & Catatan Guru</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus:border-cyan-500" placeholder="Tuliskan evaluasi, koreksi, atau feedback yang jelas..." />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
                Batal
              </button>
              <button onClick={handleSaveGrade} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Simpan Nilai</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="rounded-lg bg-cyan-100 p-2 text-cyan-700">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}
