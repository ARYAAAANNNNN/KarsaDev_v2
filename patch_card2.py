with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

def inject_button(target_text, title):
    btn = f"""<div className="flex gap-1.5 items-center">
                <button 
                  onPointerDown={{(e) => e.stopPropagation()}} 
                  onClick={{(e) => {{ e.preventDefault(); e.stopPropagation(); setReminderModal({{ isOpen: true, taskTitle: '{title}' }}); }}}} 
                  className="flex items-center justify-center p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                  title="Pasang Alarm Pengingat"
                >
                  <BellRing className="w-3.5 h-3.5" />
                </button>
                {target_text}
              </div>"""
    return btn

target2 = '<span className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">\n                <span className="w-1.5 h-1.5 bg-red-50 dark:bg-red-500/100 rounded-full animate-pulse"></span> Sisa 1 Hari\n              </span>'

if target2 in content:
    content = content.replace(target2, inject_button(target2.strip(), 'LKPD AI 01 - Prompt Engineering'))

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)
