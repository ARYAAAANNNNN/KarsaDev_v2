import re

with open('src/pages/DashboardHome.jsx', 'r') as f:
    content = f.read()

# Add imports
if "@dnd-kit" not in content:
    imports = """import { useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';"""
    content = content.replace("import { useSearchParams } from 'react-router-dom';", imports)

# Add SortableCard Component just before export default function DashboardHome
if "SortableCard" not in content:
    sortable_comp = """
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

export default function DashboardHome"""
    content = content.replace("export default function DashboardHome", sortable_comp)

# Add state and dnd logic inside DashboardHome
if "const [taskOrder" not in content:
    state_logic_old = """  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';"""

    state_logic_new = """  const [searchParams] = useSearchParams();
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
  };"""
    content = content.replace(state_logic_old, state_logic_new)

# Now, extract the 3 cards.
# First card starts after: {/* Card 1 */}
# First card ends before: {/* Card 2 */}
c1_start = content.find("{/* Card 1 */}")
c2_start = content.find("{/* Card 2 */}")
c3_start = content.find("{/* Card 3 */}")
end_grid = content.find("      </div>\n\n      {/* Bottom Connect / Instructor Section */}")

c1 = content[c1_start:c2_start].strip()
c2 = content[c2_start:c3_start].strip()
c3 = content[c3_start:end_grid].strip()

# Find the start of the grid. It's the parent of {/* Card 1 */}
grid_start_idx = content.rfind('<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">', 0, c1_start)

# Replace the grid completely.
grid_content = f"""<DndContext sensors={{sensors}} collisionDetection={{closestCenter}} onDragEnd={{handleDragEnd}}>
        <SortableContext items={{taskOrder}} strategy={{rectSortingStrategy}}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {{taskOrder.map(id => {{
              if (id === 'card1') return (
                <SortableCard key={{id}} id={{id}}>
                  {c1}
                </SortableCard>
              );
              if (id === 'card2') return (
                <SortableCard key={{id}} id={{id}}>
                  {c2}
                </SortableCard>
              );
              if (id === 'card3') return (
                <SortableCard key={{id}} id={{id}}>
                  {c3}
                </SortableCard>
              );
              return null;
            }})}}
          </div>
        </SortableContext>
      </DndContext>"""

before_grid = content[:grid_start_idx]
after_grid = content[end_grid:]

new_content = before_grid + grid_content + "\n" + after_grid

with open('src/pages/DashboardHome.jsx', 'w') as f:
    f.write(new_content)

