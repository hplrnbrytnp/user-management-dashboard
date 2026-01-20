import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Modal({ isOpen, onClose, children }) {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 ${
          isDark ? 'bg-dark-900/80' : 'bg-gray-900/30'
        } ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-200 ease-out ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Teal accent line at top */}
        <div className="absolute -top-[2px] left-8 right-8 h-[3px] bg-teal rounded-full" />
        
        {/* Modal content */}
        <div className={`relative rounded-2xl p-6 shadow-xl transition-colors ${
          isDark 
            ? 'bg-dark-800 border border-dark-600' 
            : 'bg-white'
        }`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              isDark 
                ? 'text-dark-500 hover:text-white hover:bg-teal' 
                : 'text-gray-400 hover:text-white hover:bg-teal'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}
