import { useEffect, useState } from 'react';
import { fetchUsers } from '../services/users.api';
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const filtered = users.filter(u =>
    [u.name, u.username, u.email].some(v =>
      v.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <>
      <SearchBar onChange={setQuery} />
      <UserList users={filtered} />
    </>
  );
}
