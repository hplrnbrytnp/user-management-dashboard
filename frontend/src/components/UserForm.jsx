import { useState, useEffect } from 'react';

export default function UserForm({ initialData, onSubmit, onCancel }) {
  const emptyForm = {
      name: '',
      username: '',
      email: ''
    };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        username: initialData.username,
        email: initialData.email
      }); 
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const submit = async (e) => {
    e.preventDefault();
  
    await onSubmit(form);
  
    if (!initialData) {
      setForm(emptyForm);
    }
  };  

  return (
    <form onSubmit={submit}>
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="EnterName"
      />
      <input
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        placeholder="Username"
      />
      <input
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />

      <button type="submit">
        {initialData ? 'Update User' : 'Create User'}
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>

    </form>
  );
}