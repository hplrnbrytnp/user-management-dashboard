import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  username: '',
  email: ''
};

export default function UserForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);


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
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.username.trim()) newErrors.username = 'Username is required';

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    try {
      setSubmitting(true);
      await onSubmit(form);
      setSubmitError(null);
  
      if (!initialData) setForm(emptyForm);
      setErrors({});
    } catch {
      setSubmitError('Ohh no! Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };  

  return (
    <form onSubmit={submit}>
      <input
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}

      <input
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        placeholder="Username"
      />
      {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}

      <input
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}

      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {submitting
          ? initialData ? 'Updating...' : 'Creating...'
          : initialData ? 'Update User' : 'Create User'}
      </button>

      {submitError && <p className="text-sm text-red-600 mt-1">{submitError}</p>}
      {initialData && (
        <button type="button" onClick={onCancel} className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      )}
    </form>
  );
}