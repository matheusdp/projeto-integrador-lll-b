import { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function MembersModal({ open, onClose, members, onAdd, onRemove, isOwner, currentUserId }) {
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    setError('');
    try {
      await onAdd(email.trim());
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao adicionar membro');
    } finally {
      setAdding(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Membros do projeto">
      <div className="flex flex-col gap-4">
        {isOwner && (
          <form onSubmit={handleAdd} className="flex gap-2">
            <Input
              placeholder="email@exemplo.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" loading={adding}>Adicionar</Button>
          </form>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}

        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{m.user.name}</p>
                <p className="text-xs text-gray-400">{m.user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === 'OWNER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {m.role === 'OWNER' ? 'Dono' : 'Membro'}
                </span>
                {isOwner && m.user.id !== currentUserId && (
                  <button
                    onClick={() => onRemove(m.user.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >✕</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
