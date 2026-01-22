import { useEffect, useState, useMemo, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users.api';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';

// For debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Floating particles component
const Particles = () => (
  <div className="particles">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${20 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Theme toggle component
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-knob">
        {isDark ? (
          <svg className="w-3 h-3 text-teal" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
};

// Stats card component
const StatCard = ({ icon, label, value, subtext }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-2xl p-5 hover-lift cursor-default transition-all ${
      isDark 
        ? 'bg-dark-700 border border-dark-500' 
        : 'bg-white border border-transparent shadow-card'
    }`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal/10">
          {icon}
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>{label}</p>
          {subtext ? (
            <p className={`text-sm font-medium ${isDark ? 'text-dark-500' : 'text-gray-400'}`}>{subtext}</p>
          ) : (
            <p className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-teal'}`}>{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// User row component with animations
const UserRow = ({ user, index, onEdit, onDelete, isDeleting }) => {
  const { isDark } = useTheme();
  
  return (
    <div
      className={`group rounded-xl p-4 hover-lift animate-fade-in transition-all ${
        isDark 
          ? 'bg-dark-700 border border-dark-500 hover:border-teal/50' 
          : 'bg-white border border-transparent shadow-card hover:shadow-card-hover'
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white font-bold text-lg">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 ${isDark ? 'border-dark-700' : 'border-white'}`} />
          </div>
          
          {/* User info */}
          <div>
            <p className={`font-display font-semibold group-hover:text-teal transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {user.name}
            </p>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-dark-500' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user.username}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(user)}
            className="p-2.5 rounded-xl bg-teal/10 text-teal hover:bg-teal hover:text-white transition-all"
            title="Edit user"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete user"
          >
            {isDeleting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MIN_SEARCH_LENGTH = 3;
const SEARCH_DELAY = 400; // milliseconds

export default function Dashboard() {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 5;

  // Debounce the search input
  const debouncedSearch = useDebounce(search, SEARCH_DELAY);

  // Check if search is active (has minimum characters)
  const isSearchActive = debouncedSearch.trim().length >= MIN_SEARCH_LENGTH;

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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  // Filter users based on debounced search (only if >= MIN_SEARCH_LENGTH chars)
  const filteredUsers = useMemo(() => {
    if (!isSearchActive) {
      return users;
    }
    const q = debouncedSearch.toLowerCase().trim();
    return users.filter(user => 
      user?.name?.toLowerCase().includes(q) ||
      user?.username?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q)
    );
  }, [users, debouncedSearch, isSearchActive]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  // Get search status message
  const getSearchStatus = () => {
    const trimmedSearch = search.trim();
    if (trimmedSearch.length === 0) {
      return { subtext: 'No search input' };
    }
    if (trimmedSearch.length < MIN_SEARCH_LENGTH) {
      return { subtext: `Type ${MIN_SEARCH_LENGTH - trimmedSearch.length} more...` };
    }
    return { value: filteredUsers.length };
  };

  const searchStatus = getSearchStatus();

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-900' : 'bg-periwinkle'}`}>
        <Particles />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-teal/20 border-t-teal rounded-full animate-spin mx-auto mb-4" />
          <p className={`font-medium ${isDark ? 'text-dark-500' : 'text-gray-500'}`}>Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-900' : 'bg-periwinkle'}`}>
        <Particles />
        <div className={`rounded-2xl p-8 text-center max-w-md relative z-10 ${isDark ? 'bg-dark-700' : 'bg-white shadow-card'}`}>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className={`text-xl font-display font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Oops! Something went wrong</h2>
          <p className={isDark ? 'text-dark-500' : 'text-gray-500'}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${isDark ? 'bg-dark-900' : 'bg-periwinkle'}`}>
      <Particles />
      
      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-4xl lg:text-5xl font-display font-bold mb-2 ${isDark ? 'text-white' : 'text-teal'}`}>
                  User Management
                </h1>
                <p className={`text-lg ${isDark ? 'text-dark-500' : 'text-gray-500'}`}>
                  Manage your team members and their permissions
                </p>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              label="Total Users"
              value={users.length}
            />
            <StatCard
              icon={
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Active"
              value={users.length}
            />
            <StatCard
              icon={
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              label="Search Results"
              value={searchStatus.value}
              subtext={searchStatus.subtext}
            />
          </div>

          {/* Main content card */}
          <div className={`rounded-3xl p-6 lg:p-8 animate-slide-up transition-all ${
            isDark 
              ? 'bg-dark-800 border border-dark-600' 
              : 'bg-white shadow-card'
          }`}>
            {/* Search and Add button */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-dark-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className={`w-full rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/50 transition-all ${
                    isDark 
                      ? 'bg-dark-700 border border-dark-500 text-white placeholder-dark-500 focus:border-teal' 
                      : 'bg-periwinkle border border-transparent text-gray-800 placeholder-gray-400 focus:border-teal'
                  }`}
                  placeholder="Search (min. 3 characters)..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsModalOpen(true);
                }}
                className="px-6 py-3.5 bg-teal hover:bg-teal-dark rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-glow-teal flex items-center justify-center gap-2 shimmer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>

            {/* Users list */}
            <div className="space-y-3">
              {paginatedUsers.map((user, index) => (
                <UserRow
                  key={user.id}
                  user={user}
                  index={index}
                  onEdit={(u) => {
                    setEditingUser(u);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  isDeleting={deletingId === user.id}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-dark-700' : 'bg-periwinkle'}`}>
                  <svg className={`w-10 h-10 ${isDark ? 'text-dark-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-display font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No users found</h3>
                <p className={isDark ? 'text-dark-500' : 'text-gray-500'}>Try adjusting your search or add a new user</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-2 mt-8 pt-6 border-t ${isDark ? 'border-dark-600' : 'border-gray-100'}`}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'bg-dark-700 text-dark-500 hover:text-white hover:bg-teal' 
                      : 'bg-periwinkle text-gray-500 hover:text-white hover:bg-teal'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === i + 1
                          ? 'bg-teal text-white'
                          : isDark 
                            ? 'bg-dark-700 text-dark-500 hover:text-white hover:bg-teal'
                            : 'bg-periwinkle text-gray-500 hover:text-white hover:bg-teal'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'bg-dark-700 text-dark-500 hover:text-white hover:bg-teal' 
                      : 'bg-periwinkle text-gray-500 hover:text-white hover:bg-teal'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal/10 text-teal">
            {editingUser ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-teal">
              {editingUser ? 'Edit User' : 'Create New User'}
            </h2>
            <p className="text-sm text-gray-500">
              {editingUser ? 'Update user information' : 'Add a new team member'}
            </p>
          </div>
        </div>
      
        <UserForm
          initialData={editingUser}
          users={users}
          onSubmit={async (data) => {
            await (editingUser ? handleUpdate(data) : handleCreate(data));
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </div>
  );
}
