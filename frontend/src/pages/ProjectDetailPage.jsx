import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { projectService } from '../services/project.service';
import { taskService } from '../services/task.service';
import useAuthStore from '../store/authStore';

import Navbar from '../components/layout/Navbar';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MembersModal from '../components/MembersModal';
import Button from '../components/ui/Button';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [taskModal, setTaskModal] = useState({ open: false, task: null, defaultStatus: 'TODO' });
  const [membersModal, setMembersModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [proj, taskList, memberList] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        projectService.getMembers(id)
      ]);
      setProject(proj);
      setTasks(taskList);
      setMembers(memberList);
    } catch {
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }

  function getTasksByStatus(status) {
    return tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);
  }

  function findTaskContainer(taskId) {
    return tasks.find(t => t.id === taskId)?.status;
  }

  function handleDragStart(event) {
    setActiveTask(tasks.find(t => t.id === event.active.id));
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeStatus = findTaskContainer(activeId);
    const overStatus = STATUSES.includes(overId) ? overId : findTaskContainer(overId);

    if (!activeStatus || !overStatus) return;

    if (activeStatus === overStatus) {
      // Reorder within same column
      const colTasks = getTasksByStatus(activeStatus);
      const oldIdx = colTasks.findIndex(t => t.id === activeId);
      const newIdx = colTasks.findIndex(t => t.id === overId);
      if (oldIdx === newIdx) return;

      const reordered = arrayMove(colTasks, oldIdx, newIdx);
      setTasks(prev => {
        const others = prev.filter(t => t.status !== activeStatus);
        return [...others, ...reordered.map((t, i) => ({ ...t, order: i }))];
      });

      await taskService.updateStatus(activeId, activeStatus, newIdx);
    } else {
      // Move to different column
      const colTasks = getTasksByStatus(overStatus);
      const newOrder = colTasks.length;

      setTasks(prev => prev.map(t =>
        t.id === activeId ? { ...t, status: overStatus, order: newOrder } : t
      ));

      await taskService.updateStatus(activeId, overStatus, newOrder);
    }
  }

  async function handleSaveTask(formData) {
    try {
      if (taskModal.task) {
        const updated = await taskService.update(taskModal.task.id, formData);
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      } else {
        const created = await taskService.create(id, { ...formData, status: taskModal.defaultStatus });
        setTasks(prev => [...prev, created]);
      }
    } catch (err) {
      throw err;
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Excluir esta tarefa?')) return;
    await taskService.remove(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  async function handleAddMember(email) {
    const member = await projectService.addMember(id, email);
    setMembers(prev => [...prev, member]);
  }

  async function handleRemoveMember(userId) {
    await projectService.removeMember(id, userId);
    setMembers(prev => prev.filter(m => m.user.id !== userId));
  }

  const isOwner = project?.ownerId === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <button onClick={() => navigate('/projects')} className="hover:text-blue-500">Projetos</button>
            <span>/</span>
            <span className="text-gray-700">{project?.name}</span>
          </div>
          {project?.description && <p className="text-sm text-gray-500">{project.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setMembersModal(true)}>
            👥 Membros ({members.length})
          </Button>
          <Button onClick={() => setTaskModal({ open: true, task: null, defaultStatus: 'TODO' })}>
            + Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-w-max">
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onAddTask={(s) => setTaskModal({ open: true, task: null, defaultStatus: s })}
                onEditTask={(task) => setTaskModal({ open: true, task, defaultStatus: task.status })}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal(s => ({ ...s, open: false }))}
        onSave={handleSaveTask}
        task={taskModal.task}
        members={members}
        defaultStatus={taskModal.defaultStatus}
      />

      <MembersModal
        open={membersModal}
        onClose={() => setMembersModal(false)}
        members={members}
        onAdd={handleAddMember}
        onRemove={handleRemoveMember}
        isOwner={isOwner}
        currentUserId={user?.id}
      />
    </div>
  );
}
