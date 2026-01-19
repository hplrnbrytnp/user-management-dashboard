import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => (document.body.style.overflow = 'auto');
      }, [isOpen]);

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
  
        <div className="relative bg-white rounded shadow-lg p-6 w-full max-w-md z-10">
          {children}
        </div>
      </div>
    );
  }
  