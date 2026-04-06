import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function TaskModal({ open, onClose, onSave, task, members, defaultStatus }) {
  const [form, setForm] = useState({
    title: '', description: '', assigneeId: '', dueDate: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
      });
    } else {
      setForm({ title: '', description: '', assigneeId: '', dueDate: '' });
    }
  }, [task, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        assigneeId: form.assigneeId || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        status: task?.status || defaultStatus || 'TODO'
      };
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Editar tarefa' : 'Nova tarefa'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          placeholder="O que precisa ser feito?"
          value={form.title}
          onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
          <textarea
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            rows={3}
            placeholder="Detalhes da tarefa..."
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        {members?.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Responsável</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={form.assigneeId}
              onChange={(e) => setForm(f => ({ ...f, assigneeId: e.target.value }))}
            >
              <option value="">Nenhum</option>
              {members.map(m => (
                <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Data de entrega (opcional)"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))}
        />

        <div className="flex justify-end gap-2 mt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving}>{task ? 'Salvar' : 'Criar tarefa'}</Button>
        </div>
      </form>
    </Modal>
  );
}
