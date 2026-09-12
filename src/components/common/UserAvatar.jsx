import { useState } from 'react';

const GRADIENTS = [
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-sky-500 to-indigo-600',
];

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs font-semibold',
  md: 'w-9 h-9 text-xs font-bold',
  lg: 'w-12 h-12 text-sm font-bold',
  xl: 'w-20 h-20 text-2xl font-bold',
};

export default function UserAvatar({
  name = 'User',
  avatarUrl = null,
  size = 'md',
  className = '',
}) {
  const [imageError, setImageError] = useState(false);

  // Extract initials (up to 2 characters)
  const getInitials = (str) => {
    if (!str || typeof str !== 'string') return 'U';
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic gradient selection based on name string
  const getGradient = (str) => {
    if (!str) return GRADIENTS[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[index];
  };

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const initials = getInitials(name);
  const gradient = getGradient(name);

  if (avatarUrl && !imageError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-slate-200 shadow-sm ${sizeClass} ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br ${gradient} text-white shadow-sm select-none uppercase tracking-wider ${sizeClass} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initials}</span>
    </div>
  );
}
