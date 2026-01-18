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
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      {errors.name && <p>{errors.name}</p>}

      <input
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username}</p>}

      <input
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email}</p>}

      <button type="submit" disabled={submitting}>
        {submitting
          ? initialData ? 'Updating...' : 'Creating...'
          : initialData ? 'Update User' : 'Create User'}
      </button>

      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {initialData && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}