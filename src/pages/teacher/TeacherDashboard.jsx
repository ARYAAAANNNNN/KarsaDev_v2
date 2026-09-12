import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BellDot, BriefcaseBusiness, CheckCheck, ClipboardList, TrendingUp } from 'lucide-react';
import { fetchModules, fetchSubmissions, subscribeToModules, subscribeToSubmissions } from '../../lib/supabaseClient';

const classOptions = ['X PPLG 1', 'X PPLG 2', 'X PPLG 3', 'XI PPLG 1', 'XI PPLG 2', 'XI PPLG 3', 'XII PPLG 1', 'XII PPLG 2', 'XII PPLG 3'];

const defaultStats = {
  modules: 12,
  pending: 8,
  submissionRate: 86,
  classAverage: 87.4,
};

const allRecent = [
  { id: 1, student: 'Rizky Maulana', className: 'XII PPLG 1', task: 'LKPD AI 01', status: 'Pending', score: null },
  { id: 2, student: 'Nabila Putri', className: 'XII PPLG 2', task: 'Laravel MVC', status: 'Revision', score: 80 },
  { id: 3, student: 'Fajar Ramadhan', className: 'XII PPLG 1', task: 'SRS & Use Case', status: 'Pending', score: null },
  { id: 4, student: 'Dewi Lestari', className: 'XII PPLG 2', task: 'Prompt Engineering', status: 'Graded', score: 92 },
  { id: 5, student: 'Adit Pratama', className: 'XII PPLG 1', task: 'UAS Mini Project', status: 'Pending', score: null },
  { id: 6, student: 'Farhan Hidayat', className: 'XI PPLG 2', task: 'API CRUD', status: 'Pending', score: null },
  { id: 7, student: 'Salsa Maulida', className: 'XI PPLG 3', task: 'Wireframe UI', status: 'Graded', score: 88 },
  { id: 8, student: 'Arif Rahman', className: 'X PPLG 3', task: 'Pengenalan HTML', status: 'Revision', score: 75 },
  { id: 9, student: 'Lina Zahra', className: 'X PPLG 1', task: 'CSS Layout', status: 'Pending', score: null },
  { id: 10, student: 'Dimas Pratama', className: 'XII PPLG 3', task: 'Mini Project', status: 'Pending', score: null },
];

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState('XII PPLG 1');
  const [stats, setStats] = useState(defaultStats);
  const [recent, setRecent] = useState(() => allRecent.filter((item) => item.className === selectedClass));

  const filteredRecent = useMemo(
    () => allRecent.filter((item) => item.className === selectedClass),
    [selectedClass]
  );

  useEffect(() => {
    setRecent(filteredRecent);
  }, [filteredRecent]);

  useEffect(() => {
    const load = async () => {
      try {
        const [modules, submissions] = await Promise.all([fetchModules(), fetchSubmissions()]);

        const classSubmissions = submissions.filter((item) => item.class_name === selectedClass);
        const totalPending = classSubmissions.filter((item) => item.status === 'Pending' || item.status === 'Perlu Revisi').length;
        const gradedScores = classSubmissions
          .filter((item) => item.score !== null && item.score !== undefined)
          .map((item) => Number(item.score));
        const average = gradedScores.length
          ? (gradedScores.reduce((sum, score) => sum + score, 0) / gradedScores.length).toFixed(1)
          : defaultStats.classAverage;

        setStats({
          modules: modules.length || defaultStats.modules,
          pending: totalPending || Math.max(filteredRecent.length, defaultStats.pending),
          submissionRate: classSubmissions.length ? Math.min(100, Math.round((classSubmissions.filter((item) => item.status !== 'Pending' && item.status !== 'Perlu Revisi').length / classSubmissions.length) * 100)) : 86,
          classAverage: Number(average),
        });
      } catch (error) {
        console.warn('Teacher dashboard data load failed:', error);
      }
    };

    const unsubscribeModules = subscribeToModules(() => {
      load();
    });

    const unsubscribeSubmissions = subscribeToSubmissions(() => {
      load();
    });

    load();

    return () => {
      unsubscribeModules();
      unsubscribeSubmissions();
    };
  }, [selectedClass, filteredRecent.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">Portal Guru</p>
          <h2 className="text-3xl font-bold text-slate-900">Dasbor Ringkasan</h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kelas</span>
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="bg-transparent pr-2 font-semibold text-slate-800 outline-none"
            >
              {classOptions.map((kelas) => (
                <option key={kelas} value={kelas}>{kelas}</option>
              ))}
            </select>
          </label>
          <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600">
            <BellDot className="h-4 w-4" />
            Rilis Tugas Baru
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Modul Aktif" value={stats.modules} icon={<ClipboardList className="h-5 w-5" />} accent="cyan" />
        <MetricCard title="Tugas Pending" value={stats.pending} icon={<BriefcaseBusiness className="h-5 w-5" />} accent="amber" />
        <MetricCard title="Submission Rate" value={`${stats.submissionRate}%`} icon={<CheckCheck className="h-5 w-5" />} accent="emerald" />
        <MetricCard title="Rata-rata Nilai Kelas" value={`${stats.classAverage}`} icon={<TrendingUp className="h-5 w-5" />} accent="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Urgent Review List</h3>
              <p className="text-xs text-slate-500">Siswa pada kelas {selectedClass}</p>
            </div>
            <button className="text-sm font-semibold text-cyan-600">Lihat Semua</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Siswa</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Tugas</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recent.length > 0 ? recent.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.student}</td>
                    <td className="px-4 py-3 text-slate-600">{row.className}</td>
                    <td className="px-4 py-3 text-slate-600">{row.task}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          row.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : row.status === 'Revision'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-lg bg-cyan-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-cyan-600">
                        Buka Form Nilai
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500">
                      Belum ada data siswa untuk kelas {selectedClass}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Kinerja Kelas</h3>
          <div className="mt-4 space-y-4">
            <ProgressRow label="XII PPLG 1" value={89} color="bg-cyan-500" />
            <ProgressRow label="XII PPLG 2" value={84} color="bg-emerald-500" />
            <ProgressRow label="Kehadiran Guru" value={96} color="bg-violet-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, accent }) {
  const accentStyles = {
    cyan: 'bg-cyan-100 text-cyan-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    violet: 'bg-violet-100 text-violet-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${accentStyles[accent]}`}>{icon}</div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
