import re

with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

old_summary_card = """        {/* Visual Summary Card */}
        <div className="bg-[var(--color-brand-surface)] rounded-[16px] p-5 border border-[var(--color-brand-border)] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-[var(--color-brand-text-medium)] uppercase tracking-wide">Ringkasan Tugas</p>
              <p className="text-2xl font-bold text-[var(--color-brand-text-high)] mt-1">21 <span className="text-sm font-medium text-[var(--color-brand-text-muted)]">Total</span></p>
            </div>
            <div className="p-1.5 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-md">
              <PieChartIcon className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-between gap-6">
            <div className="w-28 h-28 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-brand-border)', backgroundColor: 'var(--color-brand-surface)', color: 'var(--color-brand-text-high)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-brand-text-high)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs font-semibold text-[var(--color-brand-text-high)]">85%</span>
              </div>
            </div>"""

new_summary_card = """        {/* Visual Summary Card */}
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
            </div>"""

content = content.replace(old_summary_card, new_summary_card)

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)

