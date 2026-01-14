const API = 'http://localhost:3001/api/users';

export const getUsers = () => fetch(API).then(r => r.json());

export const createUser = (data) =>
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const updateUser = (id, data) =>
  fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteUser = (id) =>
  fetch(`${API}/${id}`, { method: 'DELETE' });
