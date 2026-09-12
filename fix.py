with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

content = content.replace("      </DndContext>\n      </div>\n\n      {/* Bottom Connect / Instructor Section */}", "      </DndContext>\n\n      {/* Bottom Connect / Instructor Section */}")

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)
