import { useEffect, useState } from 'react';
import { PencilLine, Plus, Trash2, X } from 'lucide-react';
import { deleteModule, fetchModules, subscribeToModules, upsertModule } from '../../lib/supabaseClient';

const defaultModules = [
  {
    id: 'module-1',
    title: 'LKPD AI 01 - Prompt Engineering',
    teacher: 'Wanda Kurniawan',
    subject: 'AI & KIK',
    taskType: 'docs',
    deadline: '2026-09-18',
    materialLink: 'https://docs.google.com',
    xp: 150,
  },
  {
    id: 'module-2',
    title: 'Praktik & Rangkuman Laravel MVC',
    teacher: 'Didin Saharudin, M.Kom.',
    subject: 'Web & Mobile',
    taskType: 'video',
    deadline: '2026-09-20',
    materialLink: 'https://youtube.com',
    xp: 180,
  },
];

const initialForm = {
  title: '',
  teacher: 'Wanda Kurniawan',
  subject: 'AI & KIK',
  taskType: 'docs',
  deadline: '',
  materialLink: '',
  xp: 100,
};

export default function ManageTasksPage() {
  const [modules, setModules] = useState(defaultModules);
  const [form, setForm] = useState(initialForm);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchModules();
      if (data.length) {
        setModules(data.map((item) => ({
          id: item.id,
          title: item.title,
          teacher: item.teacher_name || 'Wanda Kurniawan',
          subject: item.subject || 'AI & KIK',
          taskType: item.task_type || 'docs',
          deadline: item.deadline ? String(item.deadline).slice(0, 10) : '',
          materialLink: item.resource_url || '',
          xp: item.xp_reward || 100,
        })));
      }
    };

    const unsubscribe = subscribeToModules(() => {
      load();
    });

    load();

    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsOpen(true);
  };

  const openEditModal = (module) => {
    setEditingId(module.id);
    setForm({
      title: module.title,
      teacher: module.teacher,
      subject: module.subject,
      taskType: module.taskType,
      deadline: module.deadline,
      materialLink: module.materialLink,
      xp: module.xp,
    });
    setIsOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      teacher_name: form.teacher,
      subject: form.subject,
      task_type: form.taskType,
      deadline: new Date(`${form.deadline}T00:00:00`).toISOString(),
      resource_url: form.materialLink,
      xp_reward: Number(form.xp),
      class_target: 'Semua PPLG',
      description: `Modul tugas ${form.title}`,
    };

    const result = await upsertModule(payload, editingId);

    if (!result.success) {
      console.warn('Task save failed:', result.message);
      return;
    }

    const next = editingId
      ? modules.map((item) => (item.id === editingId ? {
          ...item,
          title: form.title,
          teacher: form.teacher,
          subject: form.subject,
          taskType: form.taskType,
          deadline: form.deadline,
          materialLink: form.materialLink,
          xp: Number(form.xp),
        } : item))
      : [
          {
            id: `module-${Date.now()}`,
            title: form.title,
            teacher: form.teacher,
            subject: form.subject,
            taskType: form.taskType,
            deadline: form.deadline,
            materialLink: form.materialLink,
            xp: Number(form.xp),
          },
          ...modules,
        ];

    setModules(next);
    setIsOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    const result = await deleteModule(id);

    if (!result.success) {
      console.warn('Task delete failed:', result.message);
      return;
    }

    setModules((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Kelola Modul</p>
          <h2 className="text-3xl font-bold text-slate-900">Modul & Tugas</h2>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Tambah Tugas Baru
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Judul</th>
                <th className="px-4 py-3 text-left font-semibold">Guru</th>
                <th className="px-4 py-3 text-left font-semibold">Mata Pelajaran</th>
                <th className="px-4 py-3 text-left font-semibold">Tipe</th>
                <th className="px-4 py-3 text-left font-semibold">Deadline</th>
                <th className="px-4 py-3 text-left font-semibold">XP</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {modules.map((module) => (
                <tr key={module.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-800">{module.title}</td>
                  <td className="px-4 py-3 text-slate-600">{module.teacher}</td>
                  <td className="px-4 py-3 text-slate-600">{module.subject}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-bold uppercase text-cyan-700">
                      {module.taskType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{module.deadline}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">+{module.xp}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(module)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100">
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(module.id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Modul / Tugas' : 'Tambah Tugas Baru'}</h3>
              <button onClick={() => setIsOpen(false)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Judul Tugas</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 focus:border-cyan-500" required />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Guru Pengampu</label>
                  <select name="teacher" value={form.teacher} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500">
                    <option>Wanda Kurniawan</option>
                    <option>Didin Saharudin, M.Kom.</option>
                    <option>Diah Pungki Octaviani, S.Pd.</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Mata Pelajaran</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500">
                    <option>AI & KIK</option>
                    <option>Web & Mobile</option>
                    <option>Analisis & Desain</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Tipe Tugas</label>
                  <select name="taskType" value={form.taskType} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500">
                    <option value="docs">docs</option>
                    <option value="video">video</option>
                    <option value="tulis">tulis</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Tenggat Waktu</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500" required />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Link Materi</label>
                  <input name="materialLink" value={form.materialLink} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500" placeholder="https://docs.google.com/..." />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Bobot XP</label>
                  <input name="xp" type="number" min="100" max="200" step="10" value={form.xp} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus:border-cyan-500" required />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
                  Batal
                </button>
                <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600">
                  {editingId ? 'Simpan Perubahan' : 'Buat Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
