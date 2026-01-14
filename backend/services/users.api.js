const API = 'http://localhost:3001/api/users';

export const fetchUsers = () => fetch(API).then(r => r.json());
export const createUser = (data) =>
  fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });