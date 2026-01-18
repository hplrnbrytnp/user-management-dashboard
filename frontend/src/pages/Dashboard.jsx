import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.api';
import UserForm from '../components/UserForm';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
        setError(null);
      } catch {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, []);  

  const handleCreate = async (data) => {
    const user = await createUser(data);
    setUsers([...users, user]);
  };

  const handleUpdate = async (data) => {
    const updated = await updateUser(editingUser.id, data);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };  

  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <UserForm
        initialData={editingUser}
        onSubmit={editingUser ? handleUpdate : handleCreate}
        onCancel={() => setEditingUser(null)}
      />

      <input
        placeholder="Search users..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <ul>
        {filteredUsers.map(u => (
          <li key={u.id}>
            {u.name} ({u.username})
            <button onClick={() => setEditingUser(u)}>Edit</button>
            <button
              onClick={() => handleDelete(u.id)}
              disabled={deletingId === u.id}
            >
              {deletingId === u.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>

      {filteredUsers.length === 0 && <p>No users found</p>}
    </>
  );
}