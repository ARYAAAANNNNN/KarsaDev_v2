with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

content = content.replace("Plus,\\n  X,\\n  Clock,", "Plus,\n  X,\n  Clock,")

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(content)
