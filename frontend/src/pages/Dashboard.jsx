import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.api';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 5;

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };  

  const filteredUsers = users.filter(user => {
    const q = search.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(q) ||
      user?.username?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  if (loading) return <p className="text-center text-gray-600">Loading users...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 space-y-2">   
          <div className="flex justify-between items-center gap-4">
            <input
              className="w-3/4 border rounded px-3 py-2 mb-4"
              placeholder="Search users..."
              value={search}
              onChange={handleSearch}
            />
            <button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="w-1/4 mb-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <span className="inline-block">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              Add User
            </button>
          </div>

          <hr className="my-4 border-gray-200" />

          <ul>
            {paginatedUsers.map(u => (
              <li key={u.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-600">
                    {u.username} · {u.email}
                  </p>
                </div>
                <div className="space-x-2">
                <button 
                  className="text-blue-600 hover:underline" 
                  onClick={() => {
                    setEditingUser(u);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}>
                  {deletingId === u.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              </li>
            ))}
          </ul>

          {filteredUsers.length === 0 && <p>No users found</p>}
          <div className="flex justify-center mt-4 space-x-2 items-center">
            <button
              className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingUser ? 'Edit User' : 'Create User'}
        </h2>
      
        <UserForm
          initialData={editingUser}
          users={users}
          onSubmit={async (data) => {
            await editingUser ? handleUpdate(data) : handleCreate(data);
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </>
  );
}