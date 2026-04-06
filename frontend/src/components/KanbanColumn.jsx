import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_STYLES = {
  TODO: { label: 'A fazer', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  IN_PROGRESS: { label: 'Em andamento', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  DONE: { label: 'Concluído', color: 'bg-green-50 text-green-700', dot: 'bg-green-500' }
};

export default function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = COLUMN_STYLES[status];

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${style.color}`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <span className="font-medium text-sm">{style.label}</span>
        <span className="ml-auto text-xs opacity-60">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-32 rounded-xl p-2 transition-colors ${isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-100/50'}`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>

        <button
          onClick={() => onAddTask(status)}
          className="text-xs text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg py-2 px-3 transition-colors text-left mt-1"
        >
          + Adicionar tarefa
        </button>
      </div>
    </div>
  );
}
