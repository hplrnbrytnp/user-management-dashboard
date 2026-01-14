import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/users.api';
import UserForm from '../components/UserForm';

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const remove = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <>
    <h1>User Management Dashboard</h1>

      <UserForm onCreated={u => setUsers([...users, u])} />
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} ({u.username})
            <button onClick={() => remove(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}