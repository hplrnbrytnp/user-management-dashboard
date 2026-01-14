import { useState } from 'react';
import { createUser } from '../services/users.api';

export default function UserForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', username: '', email: '' });

  const submit = async (e) => {
    e.preventDefault();
    const user = await createUser(form);
    onCreated(user);
    setForm({ name: '', username: '', email: '' });
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Username" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <button>Add User</button>
    </form>
  );
}