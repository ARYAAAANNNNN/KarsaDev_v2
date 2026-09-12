import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';

const classOptions = ['X PPLG 1', 'X PPLG 2', 'X PPLG 3', 'XI PPLG 1', 'XI PPLG 2', 'XI PPLG 3', 'XII PPLG 1', 'XII PPLG 2', 'XII PPLG 3'];

const classStudents = {
  'X PPLG 1': [
    { name: 'Lina Zahra', nisn: '0051001', values: [86, 88, 84], avg: 86 },
    { name: 'Rafa Kurnia', nisn: '0051002', values: [80, 82, 85], avg: 82 },
  ],
  'X PPLG 2': [
    { name: 'Zaki Pratama', nisn: '0051011', values: [90, 92, 89], avg: 90 },
    { name: 'Nanda Putri', nisn: '0051012', values: [83, 88, 87], avg: 86 },
  ],
  'X PPLG 3': [
    { name: 'Arif Rahman', nisn: '0051021', values: [78, 84, 81], avg: 81 },
    { name: 'Siti Ayu', nisn: '0051022', values: [88, 90, 92], avg: 90 },
  ],
  'XI PPLG 1': [
    { name: 'Aldi Putra', nisn: '0052001', values: [88, 90, 86], avg: 88 },
    { name: 'Nabila Putri', nisn: '0052002', values: [92, 94, 89], avg: 92 },
  ],
  'XI PPLG 2': [
    { name: 'Farhan Hidayat', nisn: '0052101', values: [76, 81, 83], avg: 80 },
    { name: 'Salsa Maulida', nisn: '0052102', values: [89, 92, 90], avg: 90 },
  ],
  'XI PPLG 3': [
    { name: 'Bagas Saputra', nisn: '0052201', values: [84, 88, 86], avg: 86 },
    { name: 'Putri Lestari', nisn: '0052202', values: [91, 93, 94], avg: 93 },
  ],
  'XII PPLG 1': [
    { name: 'Rizky Maulana', nisn: '0053001', values: [80, 85, 84], avg: 83 },
    { name: 'Fajar Ramadhan', nisn: '0053002', values: [87, 89, 91], avg: 89 },
  ],
  'XII PPLG 2': [
    { name: 'Dewi Lestari', nisn: '0053101', values: [90, 92, 91], avg: 91 },
    { name: 'Nabila Putri', nisn: '0053102', values: [88, 90, 87], avg: 88 },
  ],
  'XII PPLG 3': [
    { name: 'Dimas Pratama', nisn: '0053201', values: [82, 86, 88], avg: 85 },
    { name: 'Citra Wulandari', nisn: '0053202', values: [94, 93, 95], avg: 94 },
  ],
};

const subjects = ['AI 01', 'Laravel MVC', 'SRS & Use Case'];

export default function ClassRecapPage() {
  const [selectedClass, setSelectedClass] = useState('XII PPLG 1');
  const students = useMemo(() => classStudents[selectedClass] || [], [selectedClass]);

  const exportCsv = () => {
    const rows = [
      ['Nama Siswa', 'NISN', ...subjects, 'Rata-rata Akhir'],
      ...students.map((student) => [student.name, student.nisn, ...student.values, student.avg]),
    ];

    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rekap-nilai-${selectedClass.replace(/\s+/g, '-').toLowerCase()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Rekap Kelas</p>
          <h2 className="text-3xl font-bold text-slate-900">Nilai & Laporan Kelas</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Kelas</span>
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

          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-600">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                <th className="px-4 py-3 font-semibold">NISN</th>
                {subjects.map((subject) => (
                  <th key={subject} className="px-4 py-3 font-semibold">{subject}</th>
                ))}
                <th className="px-4 py-3 font-semibold">Rata-rata Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {students.length > 0 ? students.map((student) => (
                <tr key={student.nisn} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{student.name}</td>
                  <td className="px-4 py-3 text-slate-600">{student.nisn}</td>
                  {student.values.map((value, index) => (
                    <td key={`${student.nisn}-${index}`} className="px-4 py-3 text-slate-700">{value}</td>
                  ))}
                  <td className="px-4 py-3 font-bold text-cyan-700">{student.avg}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-slate-500">
                    Belum ada data siswa untuk kelas {selectedClass}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
