import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  X,
  Clock,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  FileBox,
  GitBranch,
  MonitorPlay,
  Upload,
  Code,
  FileText,
  Eye,
  MessageSquareText,
  Lock,
  PieChart as PieChartIcon,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitStudentTask } from '../lib/supabaseClient';

export default function DashboardHome() {
  const [activeFilter, setActiveFilter] = useState('Belum Dikerjakan');
  const [activeSubject, setActiveSubject] = useState('Semua Mapel');
  const [activeCategory, setActiveCategory] = useState('Semua Kategori');
  const [showToast, setShowToast] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [submissionModal, setSubmissionModal] = useState({ isOpen: false, taskTitle: '', submissionType: 'Google Drive' });
  const [submissionLink, setSubmissionLink] = useState('');
  const [reminderModal, setReminderModal] = useState({ isOpen: false, taskTitle: '' });
  const [reminderTime, setReminderTime] = useState('5');
  const [reminderToast, setReminderToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const { profile, switchTeacherRole } = useAuth();

  const SortableCard = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : 1,
      position: 'relative'
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}>
        {children}
      </div>
    );
  };

  const scheduleReminder = () => {
    const timeInMs = parseInt(reminderTime) * 1000;
    
    // Simulasikan notifikasi
    setTimeout(() => {
      setReminderToast({ show: true, message: `Waktunya mengerjakan tugas: ${reminderModal.taskTitle}` });
      
      // Bunyikan suara peringatan lokal
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.value = 880; // Nada A5
          
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.6);
        }
      } catch(e) {
        console.log('Audio error:', e);
      }
      
      // Hilangkan toast setelah 5 detik
      setTimeout(() => setReminderToast({ show: false, message: '' }), 5000);
    }, timeInMs);
    
    setReminderModal({ isOpen: false, taskTitle: '' });
    
    // Tampilkan konfirmasi
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  const [taskOrder, setTaskOrder] = useState(['card1', 'card2', 'card3']);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setTaskOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const isMatch = (title, description) => {
    if (!searchQuery) return true;
    return title.toLowerCase().includes(searchQuery) || description.toLowerCase().includes(searchQuery);
  };

  const handleAction = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openSubmissionModal = (taskTitle, defaultType = 'Google Drive') => {
    setSubmissionLink('');
    setSubmissionModal({ isOpen: true, taskTitle, submissionType: defaultType });
  };

  const submitTaskLink = async () => {
    if (!submissionLink.trim()) {
      window.alert('Masukkan link tugas yang valid, misalnya Google Drive, Docs, atau Excel/Sheets.');
      return;
    }

    const result = await submitStudentTask({
      student_name: profile?.full_name || 'Ahmad Fauzi',
      class_name: profile?.class_name || 'XII PPLG 1',
      module_title: submissionModal.taskTitle || 'Tugas',
      submission_url: submissionLink,
      notes: `${submissionModal.submissionType} - ${submissionLink}`,
      status: 'Pending',
    });

    if (!result?.success) {
      window.alert(result?.message || 'Gagal mengirim tugas.');
      return;
    }

    setSubmissionModal({ isOpen: false, taskTitle: '', submissionType: 'Google Drive' });
    setSubmissionLink('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTeacherPortalAccess = async () => {
    const pin = window.prompt('Masukkan PIN akses Guru:\n\nGURU2026', 'GURU2026');
    if (!pin) return;

    const result = await switchTeacherRole(pin);
    if (!result.success) {
      window.alert(result.message || 'PIN tidak valid.');
      return;
    }

    navigate('/teacher');
  };

  const teacherList = [
    {
      name: 'Pak Didin S., M.Kom',
      role: 'Web & Mobile',
      initials: 'DS',
      phone: '6281234567890',
      message: 'Halo Pak Didin, saya ingin bertanya mengenai tugas PPLG.'
    },
    {
      name: 'Pak Wanda K.',
      role: 'AI & Otomasi',
      initials: 'WK',
      phone: '6281234567891',
      message: 'Halo Pak Wanda, saya ingin bertanya mengenai tugas AI / KIK.'
    },
    {
      name: 'Bu Diah Pungki, S.Pd',
      role: 'Sistem Analisis & SRS',
      initials: 'DP',
      phone: '6281234567892',
      message: 'Halo Bu Diah, saya ingin bertanya mengenai tugas analisis dan desain.'
    }
  ];

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-8 relative">
      {/* Toast Notification */}
      {reminderToast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-top-5">
          <BellRing className="w-5 h-5 animate-bounce" />
          <span className="text-sm font-bold">{reminderToast.message}</span>
        </div>
      )}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Aksi berhasil disimulasikan!</span>
        </div>
      )}

      {/* Hero & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="col-span-1 lg:col-span-2 bg-[var(--color-brand-surface)] rounded-[16px] p-6 border border-[var(--color-brand-border)] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="w-24 h-24 bg-[var(--color-brand-primary)]/5 rounded-full blur-2xl"></div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[var(--color-brand-secondary-bg)] text-[var(--color-brand-secondary)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--color-brand-secondary)] rounded-full"></span>
              Active Sprint 04
            </span>
            <span className="text-xs font-mono text-[var(--color-brand-text-muted)]">SMK PPLG • KELAS XII</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-brand-text-high)] mb-2">
            Selamat Datang,<br />Ahmad Fauzi <span className="text-2xl">👋</span>
          </h2>
          <p className="text-[var(--color-brand-text-medium)] text-sm mb-6 max-w-md leading-relaxed">
            Semester Genap 2025/2026 • Konsentrasi Keahlian Rekayasa Perangkat Lunak & GIM
          </p>
          <div className="inline-flex items-center gap-2 bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-md py-2 px-3">
            <FileBox className="w-4 h-4 text-[var(--color-brand-primary)]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-[var(--color-brand-text-muted)]">Current Focus Repo</span>
              <span className="text-xs font-mono font-medium text-[var(--color-brand-text-high)]">kar-dev/pplg-laravel-starter#main</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-brand-text-muted)] ml-2" />
          </div>
        </div>

        {/* Visual Summary Card */}
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-5 border border-[var(--color-brand-border)] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-brand-text-medium)] uppercase tracking-wide">Ringkasan Tugas</p>
              <p className="text-xs text-[var(--color-brand-text-muted)] mt-0.5">Semester Genap</p>
            </div>
            <div className="p-1.5 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-md">
              <PieChartIcon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-between gap-6">
            <div className="w-28 h-28 shrink-0 relative">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="44" stroke="currentColor" className="text-[var(--color-brand-border)]" strokeWidth="12" fill="transparent" />
                <circle cx="56" cy="56" r="44" stroke="currentColor" className="text-[var(--color-brand-secondary)]" strokeWidth="12" fill="transparent" strokeDasharray="276.46" strokeDashoffset={276.46 - (85 / 100) * 276.46} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-bold text-[var(--color-brand-text-high)] mt-1">21</span>
                <span className="text-xs font-medium text-[var(--color-brand-text-muted)] -mt-1">Total</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--color-brand-text-high)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand-secondary)]"></span>
                    Selesai
                  </span>
                  <span className="font-bold text-[var(--color-brand-text-high)]">18</span>
                </div>
                <div className="w-full bg-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--color-brand-secondary)] h-full w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--color-brand-text-high)]">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Pending
                  </span>
                  <span className="font-bold text-[var(--color-brand-text-high)]">3</span>
                </div>
                <div className="w-full bg-[var(--color-brand-border)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2 bg-[var(--color-brand-surface)] rounded-lg shadow-sm border border-red-100">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">⚠️ LKPD AI 01 (Pak Wanda Kurniawan)</h3>
            <p className="text-sm text-red-600 dark:text-red-400">berakhir dalam <span className="font-mono bg-red-700 text-white px-1.5 py-0.5 rounded text-xs mx-1">1 Hari 4 Jam !</span> Segera submit jawaban dan tautan repositori.</p>
          </div>
        </div>
        <button onClick={handleAction} className="whitespace-nowrap bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          Buka Lembar Kerja <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium bg-[var(--color-brand-surface)] px-2 py-1.5 rounded-xl border border-[var(--color-brand-border)] shadow-sm">
          <button 
            onClick={() => setActiveFilter('Belum Dikerjakan')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'Belum Dikerjakan' ? 'text-[var(--color-brand-primary)] bg-[var(--color-brand-canvas)]' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)]"></span> Belum Dikerjakan <span className={`${activeFilter === 'Belum Dikerjakan' ? 'bg-[var(--color-brand-surface)]' : 'bg-[var(--color-brand-border)]'} px-1.5 py-0.5 rounded text-xs`}>3</span>
          </button>
          <button 
            onClick={() => setActiveFilter('Menunggu Review Guru')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'Menunggu Review Guru' ? 'text-[var(--color-brand-secondary)] bg-[var(--color-brand-secondary-bg)]' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-secondary)]"></span> Menunggu Review Guru <span className={`${activeFilter === 'Menunggu Review Guru' ? 'bg-teal-100' : 'bg-[var(--color-brand-border)]'} px-1.5 py-0.5 rounded text-xs`}>2</span>
          </button>
          <button 
            onClick={() => setActiveFilter('Sudah Dinilai')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${activeFilter === 'Sudah Dinilai' ? 'text-[var(--color-brand-text-high)] bg-[var(--color-brand-border)]' : 'text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-text-muted)]"></span> Sudah Dinilai <span className={`${activeFilter === 'Sudah Dinilai' ? 'bg-[var(--color-brand-border-hover)]' : 'bg-[var(--color-brand-border)]'} px-1.5 py-0.5 rounded text-xs`}>13</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-brand-text-medium)]">
            Urutkan:
            <button className="flex items-center gap-1 bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] px-3 py-1.5 rounded-lg shadow-sm hover:bg-[var(--color-brand-canvas)]">
              <Clock className="w-4 h-4" /> Tenggat Waktu Terdekat <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 bg-[var(--color-brand-primary)] text-white border border-[var(--color-brand-primary)] rounded-lg shadow-sm">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subject Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button 
          onClick={() => setActiveSubject('Semua Mapel')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm transition-colors ${activeSubject === 'Semua Mapel' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          Semua Mapel (6)
        </button>
        <button 
          onClick={() => setActiveSubject('Web & Mobile')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-2 ${activeSubject === 'Web & Mobile' ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <span className="w-2 h-2 bg-blue-50 dark:bg-blue-500/100 rounded-full"></span> Pemrograman Web & Perangkat Bergerak
        </button>
        <button 
          onClick={() => setActiveSubject('AI & KIK')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-2 ${activeSubject === 'AI & KIK' ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <span className="w-2 h-2 bg-red-50 dark:bg-red-500/100 rounded-full"></span> Kecerdasan Buatan & KIK
        </button>
        <button 
          onClick={() => setActiveSubject('Analisis & Desain')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-2 ${activeSubject === 'Analisis & Desain' ? 'bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <span className="w-2 h-2 bg-[var(--color-brand-secondary)] rounded-full"></span> Analisis & Desain Sistem
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button 
          onClick={() => setActiveCategory('Semua Kategori')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm transition-colors ${activeCategory === 'Semua Kategori' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          Semua Kategori
        </button>
        <button 
          onClick={() => setActiveCategory('Work')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-1.5 ${activeCategory === 'Work' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <Tag className="w-3.5 h-3.5" /> Work
        </button>
        <button 
          onClick={() => setActiveCategory('Personal')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-1.5 ${activeCategory === 'Personal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <Tag className="w-3.5 h-3.5" /> Personal
        </button>
        <button 
          onClick={() => setActiveCategory('Urgent')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-colors flex items-center gap-1.5 ${activeCategory === 'Urgent' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' : 'bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-text-medium)] hover:bg-[var(--color-brand-canvas)]'}`}
        >
          <Tag className="w-3.5 h-3.5" /> Urgent
        </button>
      </div>

      {/* Assignment Cards Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={taskOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {taskOrder.map(id => {
              if (id === 'card1') return (
                <SortableCard key={id} id={id}>
                  {/* Card 1 */}
        {((activeSubject === 'Semua Mapel' || activeSubject === 'Web & Mobile') && (activeFilter === 'Belum Dikerjakan' || activeFilter === 'Menunggu Review Guru') && (activeCategory === 'Semua Kategori' || activeCategory === 'Work') && isMatch('Praktik & Rangkuman Laravel MVC', 'Implementasi routing, controller resource, Eloquent ORM, dan Blade templating engine.')) && (
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col relative">
          <div className="h-1 w-full bg-[var(--color-brand-primary)]"></div>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1.5 items-start">
                <span className="bg-blue-50 dark:bg-blue-500/10 text-[var(--color-brand-primary)] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Backend Development
                </span>
                <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Work
                </span>
              </div>
              <div className="flex gap-1.5 items-center">
                <button 
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReminderModal({ isOpen: true, taskTitle: 'Praktik & Rangkuman Laravel MVC' }); }} 
                  className="flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                  title="Pasang Alarm Pengingat"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
                <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-primary)] bg-[var(--color-brand-canvas)] px-2 py-1 rounded">
                <Clock className="w-3.5 h-3.5" /> Besok, 23:59 WIB
              </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] leading-tight mb-2">Praktik & Rangkuman Laravel MVC</h3>
            
            <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-brand-text-medium)]">
              <div className="w-5 h-5 rounded-full bg-[var(--color-brand-border)] flex items-center justify-center font-bold text-[10px] text-[var(--color-brand-text-medium)]">DS</div>
              Pak Didin Saharudin, M.Kom.
            </div>

            <p className="text-sm text-[var(--color-brand-text-medium)] line-clamp-2 mb-4">
              Implementasi routing, controller resource, Eloquent ORM, dan Blade templating engine.
            </p>

            <div className="bg-[var(--color-brand-canvas)] rounded-lg p-3 mb-5 mt-auto">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><GitBranch className="w-3.5 h-3.5" /> Target Branch</span>
                <span className="font-semibold text-[var(--color-brand-text-high)] bg-[var(--color-brand-surface)] px-1.5 py-0.5 rounded border border-slate-200">feature/laravel-mvc</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><CheckCircle2 className="w-3.5 h-3.5" /> Checklist</span>
                <span className="font-semibold text-[var(--color-brand-text-high)]">4 dari 5 Komponen Siap</span>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={handleAction} className="w-full py-2 bg-[var(--color-brand-secondary-bg)] hover:bg-teal-200 text-[var(--color-brand-secondary)] rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <MonitorPlay className="w-4 h-4" /> Buka Tutorial YouTube
              </button>
              <button onClick={() => openSubmissionModal('Praktik & Rangkuman Laravel MVC', 'Google Drive')} className="w-full py-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4" /> Kumpulkan Tugas
              </button>
            </div>
          </div>
        </div>
        )}
                </SortableCard>
              );
              if (id === 'card2') return (
                <SortableCard key={id} id={id}>
                  {/* Card 2 */}
        {((activeSubject === 'Semua Mapel' || activeSubject === 'AI & KIK') && activeFilter === 'Belum Dikerjakan' && (activeCategory === 'Semua Kategori' || activeCategory === 'Urgent') && isMatch('LKPD AI 01 - Prompt Engineering', 'Lembar Kerja Peserta Didik eksperimen prompt chaining dan system instructions.')) && (
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] border border-red-200 dark:border-red-500/20 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col relative ring-1 ring-red-500/10">
          <div className="h-1 w-full bg-red-50 dark:bg-red-500/100"></div>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1.5 items-start">
                <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  AI & Prompt Engineering
                </span>
                <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Urgent
                </span>
              </div>
              <div className="flex gap-1.5 items-center">
                <button 
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReminderModal({ isOpen: true, taskTitle: 'LKPD AI 01 - Prompt Engineering' }); }} 
                  className="flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                  title="Pasang Alarm Pengingat"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
                <span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-red-50 dark:bg-red-500/100 rounded-full animate-pulse"></span> Sisa 1 Hari
              </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] leading-tight mb-2">LKPD AI 01 - Prompt Engineering</h3>
            
            <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-brand-text-medium)]">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center font-bold text-[10px] text-red-700 dark:text-red-400">WK</div>
              Pak Wanda Kurniawan
            </div>

            <p className="text-sm text-[var(--color-brand-text-medium)] line-clamp-2 mb-4">
              Lembar Kerja Peserta Didik eksperimen prompt chaining dan system instructions.
            </p>

            <div className="bg-[var(--color-brand-canvas)] rounded-lg p-3 mb-5 mt-auto">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><Code className="w-3.5 h-3.5" /> Template Modul</span>
                <span className="font-semibold text-[var(--color-brand-text-high)] bg-[var(--color-brand-surface)] px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[120px]">pplg/lkpd-ai-01</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><Clock className="w-3.5 h-3.5" /> Batas Akhir</span>
                <span className="font-semibold text-red-600 dark:text-red-400">Kamis, 15:00 WIB</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => openSubmissionModal('LKPD AI 01 - Prompt Engineering', 'Google Docs')} className="py-2 bg-[var(--color-brand-canvas)] hover:bg-[var(--color-brand-border)] text-[var(--color-brand-primary)] rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[var(--color-brand-border)]">
                <FileText className="w-4 h-4" /> Google Docs
              </button>
              <button onClick={() => openSubmissionModal('LKPD AI 01 - Prompt Engineering', 'Google Sheets')} className="py-2 bg-[var(--color-brand-canvas)] hover:bg-[var(--color-brand-border)] text-[var(--color-brand-primary)] rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[var(--color-brand-border)]">
                <Code className="w-4 h-4" /> Google Sheets
              </button>
            </div>
            <button onClick={() => openSubmissionModal('LKPD AI 01 - Prompt Engineering', 'Google Drive')} className="w-full py-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              <Upload className="w-4 h-4" /> Kumpulkan Tugas
            </button>
          </div>
        </div>
        )}
                </SortableCard>
              );
              if (id === 'card3') return (
                <SortableCard key={id} id={id}>
                  {/* Card 3 */}
        {((activeSubject === 'Semua Mapel' || activeSubject === 'Analisis & Desain') && activeFilter === 'Belum Dikerjakan' && (activeCategory === 'Semua Kategori' || activeCategory === 'Personal') && isMatch('Rangkuman SRS & Sketsa Use Case', 'Dokumentasi kebutuhan perangkat lunak (Software Requirement Specification) manual.')) && (
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col relative opacity-80 hover:opacity-100">
          <div className="h-1 w-full bg-[var(--color-brand-secondary)]"></div>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1.5 items-start">
                <span className="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                  ✍️ Buku Catatan Tulis
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Personal
                </span>
              </div>
              <div className="flex gap-1.5 items-center">
                <button 
                  onPointerDown={(e) => e.stopPropagation()} 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReminderModal({ isOpen: true, taskTitle: 'Rangkuman SRS & Sketsa Use Case' }); }} 
                  className="flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                  title="Pasang Alarm Pengingat"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
                <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-brand-text-medium)] bg-[var(--color-brand-border)] px-2 py-1 rounded">
                <Clock className="w-3.5 h-3.5" /> Jumat, 15:00 WIB
              </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-[var(--color-brand-text-high)] leading-tight mb-2">Rangkuman SRS & Sketsa Use Case</h3>
            
            <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-brand-text-medium)]">
              <div className="w-5 h-5 rounded-full bg-[var(--color-brand-border)] flex items-center justify-center font-bold text-[10px] text-[var(--color-brand-text-medium)]">DP</div>
              Bu Diah Pungki Octaviani, S.Pd.
            </div>

            <p className="text-sm text-[var(--color-brand-text-medium)] line-clamp-2 mb-4">
              Dokumentasi kebutuhan perangkat lunak (Software Requirement Specification) manual.
            </p>

            <div className="bg-[var(--color-brand-canvas)] rounded-lg p-3 mb-5 mt-auto">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><FileBox className="w-3.5 h-3.5" /> Format Tugas</span>
                <span className="font-semibold text-[var(--color-brand-text-high)]">Foto Fisik (.JPG)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-text-muted)]"><CheckCircle2 className="w-3.5 h-3.5" /> Halaman</span>
                <span className="font-semibold text-[var(--color-brand-text-high)]">Minimal 2 Halaman</span>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={handleAction} className="w-full py-2 bg-[var(--color-brand-canvas)] hover:bg-[var(--color-brand-border)] text-[var(--color-brand-primary)] border border-[var(--color-brand-border)] rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Eye className="w-4 h-4" /> Preview Template SRS
              </button>
              <button onClick={() => openSubmissionModal('Rangkuman SRS & Sketsa Use Case', 'Google Drive')} className="w-full py-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4" /> Upload Foto Catatan
              </button>
            </div>
          </div>
        </div>
        )}
                </SortableCard>
              );
              return null;
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Bottom Connect / Instructor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        <div className="col-span-1 lg:col-span-2 bg-[var(--color-brand-surface)] rounded-[16px] p-6 border border-[var(--color-brand-border)] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-brand-canvas)] text-[var(--color-brand-primary)] rounded-lg">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-brand-text-high)]">Guru Pengampu PPLG Terhubung</h3>
                <p className="text-xs text-[var(--color-brand-text-medium)]">Konsultasi kendala teknis coding & bimbingan portofolio</p>
              </div>
            </div>
            <span className="bg-[var(--color-brand-secondary-bg)] text-[var(--color-brand-secondary)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              3 Guru Online
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teacherList.map((teacher, i) => (
              <div key={i} className="border border-[var(--color-brand-border)] rounded-xl p-3 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-border)] flex items-center justify-center font-bold text-[var(--color-brand-text-medium)] relative">
                    {teacher.initials}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--color-brand-secondary)] border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-brand-text-high)]">{teacher.name}</p>
                    <p className="text-[10px] text-[var(--color-brand-text-muted)] uppercase tracking-wide">{teacher.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => openWhatsApp(teacher.phone, teacher.message)}
                  className="mt-auto w-full py-1.5 bg-[var(--color-brand-canvas)] hover:bg-[var(--color-brand-border)] text-[var(--color-brand-primary)] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquareText className="w-3.5 h-3.5" /> Tanya Tugas
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 bg-[var(--color-brand-text-high)] rounded-[16px] p-6 border border-slate-800 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock className="w-24 h-24" />
          </div>
          <div>
            <span className="bg-[var(--color-brand-primary)] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-4 inline-block">
              Instructor Portal
            </span>
            <h3 className="text-xl font-bold mb-2 text-white">Beralih ke Mode Guru</h3>
            <p className="text-sm text-[var(--color-brand-text-muted)] mb-6 relative z-10">
              Akses cepat untuk guru pengampu memeriksa progress LKPD, input nilai, dan rilis tugas sprint terbaru.
            </p>
            
            <div className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center mb-6 relative z-10 border border-slate-700">
              <span className="text-xs text-[var(--color-brand-text-muted)]">Kode Akses<br/>Instruktur</span>
              <span className="font-mono text-[var(--color-brand-primary)] font-bold tracking-wider bg-slate-900 px-2 py-1 rounded">PIN GURU2026</span>
            </div>
          </div>
          
          <button onClick={handleTeacherPortalAccess} className="w-full py-2.5 bg-[var(--color-brand-secondary-bg)] hover:bg-teal-300 text-[var(--color-brand-secondary)] rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors relative z-10">
             Buka Panel Guru <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {submissionModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--color-brand-surface)] rounded-2xl w-full max-w-lg border border-[var(--color-brand-border)] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-brand-border)]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-text-muted)]">Pengumpulan Tugas</p>
                <h3 className="font-bold text-lg text-[var(--color-brand-text-high)]">{submissionModal.taskTitle}</h3>
              </div>
              <button
                onClick={() => setSubmissionModal({ isOpen: false, taskTitle: '', submissionType: 'Google Drive' })}
                className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Jenis Link</label>
                <select
                  value={submissionModal.submissionType}
                  onChange={(event) => setSubmissionModal((prev) => ({ ...prev, submissionType: event.target.value }))}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all"
                >
                  <option>Google Drive</option>
                  <option>Google Docs</option>
                  <option>Google Sheets</option>
                  <option>Excel</option>
                  <option>Link Lain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-1.5">Link Tugas</label>
                <input
                  type="url"
                  value={submissionLink}
                  onChange={(event) => setSubmissionLink(event.target.value)}
                  placeholder="https://drive.google.com/.... atau https://docs.google.com/..."
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/50 focus:border-transparent transition-all"
                />
              </div>

              <div className="rounded-lg bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] p-3 text-xs text-[var(--color-brand-text-medium)]">
                Tugas bisa dikumpulkan lewat link Google Drive, Docs, Sheets, Excel, atau file publik lain yang bisa dibuka guru.
              </div>

              <button
                type="button"
                onClick={submitTaskLink}
                className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-hover)] text-white font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Kirim Link Tugas
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Reminder Modal */}
      {reminderModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--color-brand-surface)] rounded-2xl w-full max-w-sm border border-[var(--color-brand-border)] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-brand-border)]">
              <h3 className="font-bold text-lg text-[var(--color-brand-text-high)] flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-500" /> Set Pengingat
              </h3>
              <button 
                onClick={() => setReminderModal({ isOpen: false, taskTitle: '' })}
                className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-[var(--color-brand-text-medium)] mb-4">Ingatkan saya untuk tugas:<br/><strong className="text-[var(--color-brand-text-high)]">{reminderModal.taskTitle}</strong></p>
                <label className="block text-sm font-semibold text-[var(--color-brand-text-high)] mb-2">Pilih durasi waktu:</label>
                <select 
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] rounded-lg px-3 py-3 text-sm text-[var(--color-brand-text-high)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                >
                  <option value="5">Dalam 5 Detik (Mode Demo)</option>
                  <option value="10">Dalam 10 Detik (Mode Demo)</option>
                  <option value="1800">Dalam 30 Menit</option>
                  <option value="3600">Dalam 1 Jam</option>
                  <option value="86400">Besok Hari</option>
                </select>
              </div>
            </div>
            
            <div className="p-5 border-t border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] flex justify-end gap-3">
              <button 
                onClick={() => setReminderModal({ isOpen: false, taskTitle: '' })}
                className="px-4 py-2 text-sm font-semibold text-[var(--color-brand-text-medium)] hover:text-[var(--color-brand-text-high)] hover:bg-[var(--color-brand-border)] rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={scheduleReminder}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                Simpan Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
