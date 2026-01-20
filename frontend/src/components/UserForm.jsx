import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../context/ThemeContext';

const emptyForm = {
  name: '',
  username: '',
  email: ''
};

// Modern input component
const FormInput = ({ label, icon, value, onChange, error, type = 'text', placeholder }) => {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <div className={`relative rounded-xl transition-all duration-200 ${
        error 
          ? 'ring-2 ring-red-400/50' 
          : isFocused 
            ? 'ring-2 ring-teal/50' 
            : ''
      }`}>
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? 'text-teal' : isDark ? 'text-dark-500' : 'text-gray-400'
        }`}>
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full border rounded-xl pl-12 pr-4 py-3.5 focus:outline-none transition-all duration-200 ${
            isDark 
              ? `bg-dark-700 text-white placeholder-dark-500 ${error ? 'border-red-400/50' : 'border-dark-500 focus:border-teal'}`
              : `bg-periwinkle text-gray-800 placeholder-gray-400 ${error ? 'border-red-400/50' : 'border-transparent focus:border-teal'}`
          }`}
        />
        <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${
          value || isFocused
            ? `-top-2.5 text-xs px-2 rounded ${isDark ? 'bg-dark-800' : 'bg-white'}`
            : 'top-1/2 -translate-y-1/2 text-sm'
        } ${
          error 
            ? 'text-red-500' 
            : isFocused 
              ? 'text-teal' 
              : isDark ? 'text-dark-500' : 'text-gray-400'
        }`}>
          {label}
        </label>
      </div>
      
      {/* Error message with animation */}
      <div className={`overflow-hidden transition-all duration-200 ${error ? 'max-h-10 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex items-center gap-1.5 text-red-500 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    </div>
  );
};

export default function UserForm({ initialData, onSubmit, onCancel, users }) {
  const { isDark } = useTheme();
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
      newErrors.email = 'Please enter a valid email';
    }

    const emailExists = users.some(u =>
      u.email === form.email &&
      (!initialData || u.id !== initialData.id)
    );
  
    if (emailExists) {
      newErrors.email = 'This email is already in use';
    }

    Object.keys(form).forEach(key => {
      if (form[key].length > 100) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is too long`;
      }
    });    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    try {
      setSubmitting(true);
      const cleanForm = {
        name: DOMPurify.sanitize(form.name, { ALLOWED_TAGS: [] }),
        username: DOMPurify.sanitize(form.username, { ALLOWED_TAGS: [] }),
        email: DOMPurify.sanitize(form.email, { ALLOWED_TAGS: [] }),
      };      
      
      await onSubmit(cleanForm);      
      setSubmitError(null);
  
      if (!initialData) setForm(emptyForm);
      setErrors({});
    } catch {
      setSubmitError('Oops! Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }; 

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormInput
        label="Full Name"
        placeholder=" "
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <FormInput
        label="Username"
        placeholder=" "
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        error={errors.username}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />

      <FormInput
        label="Email Address"
        placeholder=" "
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      {/* Submit error */}
      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {submitError}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3.5 bg-teal hover:bg-teal-dark rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>{initialData ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              {initialData ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span>{initialData ? 'Save Changes' : 'Create User'}</span>
            </>
          )}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              isDark 
                ? 'bg-dark-600 hover:bg-teal text-dark-500 hover:text-white' 
                : 'bg-periwinkle hover:bg-teal text-gray-500 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
