// ==============================================================================
// KarsaDev - Data Master Jurusan PPLG
// Multi-Guru & Generator Roster 43-46 Siswa per Kelas
// ==============================================================================

export const PPLG_TEACHERS = [
  {
    id: 'wanda',
    email: 'wanda@smk.sch.id',
    name: 'Wanda Kurniawan, S.Kom.',
    nip: '198503152010011012',
    subject: 'Kecerdasan Buatan & Pemodelan PPLG',
    role: 'teacher',
    homeroom: 'XII PPLG 1',
    status: 'ONLINE',
  },
  {
    id: 'didin',
    email: 'didin@smk.sch.id',
    name: 'Didin Saharudin, M.Kom.',
    nip: '198207202008011005',
    subject: 'Pemrograman Web Laravel & Basis Data',
    role: 'teacher',
    homeroom: 'XI PPLG 1',
    status: 'ONLINE',
  },
  {
    id: 'diah',
    email: 'diah@smk.sch.id',
    name: 'Diah Pungki Octaviani, S.Pd.',
    nip: '199011042015022003',
    subject: 'Analisis Sistem & Rekayasa Perangkat Lunak',
    role: 'teacher',
    homeroom: 'XII PPLG 2',
    status: 'ONLINE',
  },
  {
    id: 'admin',
    email: 'admin@smk.sch.id',
    name: 'Administrator Jurusan PPLG',
    nip: '198001012005011001',
    subject: 'Manajemen Kurikulum & Server PPLG',
    role: 'admin',
    homeroom: 'Ruang Guru PPLG',
    status: 'ONLINE',
  },
];

export const PPLG_CLASSES = [
  { name: 'X PPLG 1', count: 44, grade: '10', wali: 'Diah Pungki Octaviani, S.Pd.' },
  { name: 'X PPLG 2', count: 45, grade: '10', wali: 'Budi Santoso, S.Kom.' },
  { name: 'X PPLG 3', count: 43, grade: '10', wali: 'Rini Rahmawati, S.Pd.' },
  { name: 'XI PPLG 1', count: 46, grade: '11', wali: 'Didin Saharudin, M.Kom.' },
  { name: 'XI PPLG 2', count: 44, grade: '11', wali: 'Ahmad Fauzi, M.T.' },
  { name: 'XI PPLG 3', count: 45, grade: '11', wali: 'Nurul Hidayati, S.Kom.' },
  { name: 'XII PPLG 1', count: 45, grade: '12', wali: 'Wanda Kurniawan, S.Kom.' },
  { name: 'XII PPLG 2', count: 44, grade: '12', wali: 'Diah Pungki Octaviani, S.Pd.' },
  { name: 'XII PPLG 3', count: 46, grade: '12', wali: 'Hendra Gunawan, S.Kom.' },
];

export const CLASS_NAMES = PPLG_CLASSES.map((c) => c.name);

export const DEFAULT_SUBJECTS = ['LKPD AI 01', 'Laravel MVC', 'SRS & Use Case'];

// Generator nama siswa Indonesia khas SMK jurusan PPLG
const FIRST_NAMES = [
  'Ahmad', 'Aditya', 'Bayu', 'Bintang', 'Citra', 'Dimas', 'Dinda', 'Fajar', 
  'Farhan', 'Gita', 'Hafiz', 'Indah', 'Irfan', 'Joko', 'Kevin', 'Lina', 
  'Muhammad', 'Nabila', 'Naufal', 'Putri', 'Rafi', 'Rizky', 'Salsa', 'Taufik', 
  'Wahyu', 'Yoga', 'Zahra', 'Ilham', 'Tio', 'Rendi', 'Vina', 'Dewi', 'Arya', 
  'Siti', 'Riko', 'Fauzan', 'Aldi', 'Anisa', 'Bagas', 'Doni', 'Eka', 'Hendra', 
  'Maya', 'Nanda', 'Reza', 'Surya', 'Gilang', 'Intan', 'Panji', 'Sakti'
];

const LAST_NAMES = [
  'Pratama', 'Saputra', 'Ramadhan', 'Hidayat', 'Kurniawan', 'Putra', 'Maulana', 
  'Wulandari', 'Lestari', 'Santoso', 'Utami', 'Siregar', 'Kusuma', 'Nugraha', 
  'Setiawan', 'Wijaya', 'Permana', 'Firmansyah', 'Syahputra', 'Anggraini', 
  'Purnama', 'Wahyudi', 'Safitri', 'Gunawan', 'Hakim', 'Nasution', 'Kencana'
];

// Helper deterministik generator siswa per rombel
export function generateClassStudents(className) {
  const classMeta = PPLG_CLASSES.find((c) => c.name === className) || { count: 45, grade: '12' };
  const count = classMeta.count;
  const grade = classMeta.grade;
  const classCode = className.replace(/[^0-9]/g, '') || '1';
  const charSum = className.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const students = [];

  for (let i = 1; i <= count; i++) {
    const fIndex = (i + charSum) % FIRST_NAMES.length;
    const lIndex = (i * 3 + charSum) % LAST_NAMES.length;
    const fullName = `${FIRST_NAMES[fIndex]} ${LAST_NAMES[lIndex]}`;
    
    // NISN format: 00 + (tahun lulus estimasi) + classCode + 2 digit urut
    const nisn = `008${grade}${classCode}${String(i).padStart(2, '0')}`;

    // Nilai 3 modul utama
    let v1, v2, v3;
    if (i % 7 === 0) {
      // Siswa belum mengumpulkan modul tertentu
      v1 = 70 + ((i * 5) % 15);
      v2 = null; // Belum kumpul
      v3 = 75 + (i % 12);
    } else if (i % 9 === 0) {
      // Siswa remidi (< 78)
      v1 = 68 + (i % 8);
      v2 = 72 + (i % 6);
      v3 = 70 + (i % 7);
    } else {
      // Siswa tuntas (>= 78)
      v1 = 80 + ((i + charSum) % 18);
      v2 = 82 + ((i * 2 + charSum) % 17);
      v3 = 84 + ((i * 4 + charSum) % 16);
    }

    const validValues = [v1, v2, v3].filter((val) => typeof val === 'number');
    const avg = validValues.length > 0 
      ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length) 
      : 0;

    let status = 'Tuntas';
    if (v1 === null || v2 === null || v3 === null) {
      status = 'Belum Lengkap';
    } else if (avg < 78) {
      status = 'Perlu Remidi';
    }

    students.push({
      no: i,
      name: fullName,
      nisn,
      values: [v1, v2, v3],
      avg,
      status,
    });
  }

  return students;
}

// Cache local agar konsisten selama sesi berjalan
const classStudentsCache = {};

export function getClassStudents(className) {
  if (!classStudentsCache[className]) {
    classStudentsCache[className] = generateClassStudents(className);
  }
  return classStudentsCache[className];
}

export function getClassSummary(className, studentsList) {
  const students = studentsList || getClassStudents(className);
  const total = students.length;
  
  if (total === 0) {
    return {
      total: 0,
      avgScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passedCount: 0,
      remedialCount: 0,
      incompleteCount: 0,
      passRate: 0,
    };
  }

  const completeStudents = students.filter((s) => s.status !== 'Belum Lengkap');
  const scores = completeStudents.map((s) => s.avg);

  const avgScore = scores.length > 0 
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 
    : 0;
  
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  const passedCount = students.filter((s) => s.status === 'Tuntas').length;
  const remedialCount = students.filter((s) => s.status === 'Perlu Remidi').length;
  const incompleteCount = students.filter((s) => s.status === 'Belum Lengkap').length;
  const passRate = Math.round((passedCount / total) * 100);

  return {
    total,
    avgScore,
    highestScore,
    lowestScore,
    passedCount,
    remedialCount,
    incompleteCount,
    passRate,
  };
}
