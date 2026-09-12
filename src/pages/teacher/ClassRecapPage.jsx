import { useMemo, useState } from 'react';
import { 
  Download, 
  Search, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  GraduationCap 
} from 'lucide-react';
import { 
  CLASS_NAMES, 
  DEFAULT_SUBJECTS, 
  getClassStudents, 
  getClassSummary, 
  PPLG_CLASSES 
} from '../../lib/pplgData';
import UserAvatar from '../../components/common/UserAvatar';

export default function ClassRecapPage() {
  const [selectedClass, setSelectedClass] = useState('XII PPLG 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'Tuntas' | 'Perlu Remidi' | 'Belum Lengkap'

  // Ambil data seluruh 43-46 siswa dari rombel yang dipilih
  const allStudents = useMemo(() => getClassStudents(selectedClass), [selectedClass]);
  const summary = useMemo(() => getClassSummary(selectedClass, allStudents), [selectedClass, allStudents]);

  // Cari informasi wali kelas
  const classMeta = useMemo(() => {
    return PPLG_CLASSES.find((c) => c.name === selectedClass) || { wali: 'Guru PPLG', count: allStudents.length };
  }, [selectedClass, allStudents.length]);

  // Filter siswa berdasarkan pencarian dan status ketuntasan
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchQuery = 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nisn.includes(searchQuery) ||
        String(student.no).includes(searchQuery);

      const matchStatus = 
        statusFilter === 'ALL' || student.status === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [allStudents, searchQuery, statusFilter]);

  const exportCsv = () => {
    const rows = [
      ['No. Absen', 'Nama Siswa', 'NISN', 'Kelas', ...DEFAULT_SUBJECTS, 'Rata-rata Akhir', 'Status Ketuntasan'],
      ...allStudents.map((student) => [
        student.no,
        `"${student.name}"`,
        `'${student.nisn}`,
        selectedClass,
        ...student.values.map((v) => (v === null ? '-' : v)),
        student.avg,
        student.status,
      ]),
    ];

    const csvContent = '\uFEFF' + rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rekap-nilai-${selectedClass.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header Halaman */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-600">
            <GraduationCap className="h-4 w-4" />
            <span>Manajemen Rombel PPLG</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Rekap Nilai & Buku Nilai Kelas
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Wali Kelas: <span className="font-semibold text-slate-700">{classMeta.wali}</span> • Kapasitas: <span className="font-semibold text-cyan-700">{classMeta.count} Siswa</span>
          </p>
        </div>

        {/* Filter Kelas & Export */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pilih Rombel</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="bg-transparent pr-2 font-bold text-slate-800 outline-none cursor-pointer"
            >
              {CLASS_NAMES.map((kelas) => (
                <option key={kelas} value={kelas}>{kelas}</option>
              ))}
            </select>
          </label>

          <button 
            onClick={exportCsv} 
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer"
            title="Download file CSV nilai seluruh siswa"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV ({allStudents.length} Siswa)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ringkasan Statistik Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Siswa</p>
            <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">{summary.total}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Rombel {selectedClass}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Rata-rata Kelas</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-blue-700">{summary.avgScore}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">KKM Sekolah: 78</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Nilai Tertinggi</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-emerald-600">{summary.highestScore}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Terendah: {summary.lowestScore}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tuntas KKM</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-700">{summary.passedCount}</p>
            <span className="text-xs font-semibold text-emerald-600">({summary.passRate}%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Nilai &ge; 78</p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Perlu Remidi</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-black text-rose-600">{summary.remedialCount + summary.incompleteCount}</p>
            <span className="text-xs font-semibold text-slate-400">siswa</span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-0.5">
            {summary.remedialCount} Remidi • {summary.incompleteCount} Belum Lengkap
          </p>
        </div>
      </div>

      {/* Toolbar: Search dan Filter Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Cari dari ${allStudents.length} siswa (Nama atau NISN)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <span className="text-xs text-slate-400 font-semibold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'ALL' 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({allStudents.length})
          </button>
          <button
            onClick={() => setStatusFilter('Tuntas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'Tuntas' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Tuntas ({summary.passedCount})
          </button>
          <button
            onClick={() => setStatusFilter('Perlu Remidi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'Perlu Remidi' 
                ? 'bg-rose-600 text-white' 
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Remidi ({summary.remedialCount})
          </button>
          <button
            onClick={() => setStatusFilter('Belum Lengkap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'Belum Lengkap' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Belum Kumpul ({summary.incompleteCount})
          </button>
        </div>
      </div>

      {/* Tabel Roster 43-46 Siswa */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 font-bold text-center w-14">Absen</th>
                <th className="px-4 py-3.5 font-bold">Identitas Siswa</th>
                <th className="px-4 py-3.5 font-bold">NISN</th>
                {DEFAULT_SUBJECTS.map((subject) => (
                  <th key={subject} className="px-4 py-3.5 font-bold text-center">{subject}</th>
                ))}
                <th className="px-4 py-3.5 font-bold text-center">Rata-rata</th>
                <th className="px-4 py-3.5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isRemedial = student.status === 'Perlu Remidi';
                  const isIncomplete = student.status === 'Belum Lengkap';

                  return (
                    <tr 
                      key={student.nisn} 
                      className={`transition-colors hover:bg-cyan-50/40 ${
                        isRemedial ? 'bg-rose-50/20' : isIncomplete ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Nomor Absen */}
                      <td className="px-4 py-3 text-center font-bold text-slate-500">
                        {String(student.no).padStart(2, '0')}
                      </td>

                      {/* Identitas Siswa */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={student.name} size="sm" />
                          <div>
                            <p className="font-bold text-slate-900 hover:text-cyan-600 transition-colors">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {selectedClass}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NISN */}
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">
                        {student.nisn}
                      </td>

                      {/* Nilai-nilai Modul */}
                      {student.values.map((value, idx) => (
                        <td key={`${student.nisn}-${idx}`} className="px-4 py-3 text-center">
                          {value === null ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                              Kosong
                            </span>
                          ) : (
                            <span className={`font-semibold ${value < 78 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      ))}

                      {/* Rata-rata Akhir */}
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-black px-2 py-1 rounded-md ${
                          student.avg >= 78 
                            ? 'bg-cyan-50 text-cyan-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {student.avg}
                        </span>
                      </td>

                      {/* Status Kelulusan / Ketuntasan */}
                      <td className="px-4 py-3 text-center">
                        {student.status === 'Tuntas' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Tuntas
                          </span>
                        )}
                        {student.status === 'Perlu Remidi' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Remidi
                          </span>
                        )}
                        {student.status === 'Belum Lengkap' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Belum Lengkap
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    <p className="text-base font-semibold">Tidak ditemukan siswa dengan kriteria tersebut.</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter status.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('ALL');
                      }}
                      className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info jumlah data */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p>
            Menampilkan <span className="font-bold text-slate-700">{filteredStudents.length}</span> dari <span className="font-bold text-slate-700">{allStudents.length}</span> siswa di <span className="font-bold text-cyan-700">{selectedClass}</span>
          </p>
          <p className="font-medium">
            Tahun Ajaran 2025/2026 • Kurikulum Merdeka PPLG
          </p>
        </div>
      </div>
    </div>
  );
}
