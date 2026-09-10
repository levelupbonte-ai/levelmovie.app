import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface StudioPreparationScreenProps {
  onComplete: () => void;
  onCancel?: () => void;
  lang?: 'fr' | 'en';
}

export function StudioPreparationScreen({
  onComplete,
  onCancel,
  lang = 'fr'
}: StudioPreparationScreenProps) {
  useEffect(() => {
    // 4.0 seconds duration as requested
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md text-white flex flex-col items-center justify-center p-6 selection:bg-[#7c3aed] transition-all animate-fadeIn">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 rounded-none bg-black/30 border border-gray-700/50 hover:border-gray-600"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Annuler' : 'Cancel'}</span>
        </button>
      )}

      {/* Transition content without the black bubble container */}
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Minimalist professional spinning circle */}
        <div className="relative w-12 h-12 mb-5">
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#7c3aed] border-r-[#a78bfa] animate-spin"></div>
        </div>

        {/* Text underneath the spinner */}
        <h3 className="text-base font-semibold text-white tracking-wide mb-1 drop-shadow-sm">
          {lang === 'fr' ? 'Préparation du studio...' : 'Preparing the studio...'}
        </h3>
        <p className="text-xs text-gray-300 drop-shadow-sm">
          {lang === 'fr'
            ? 'Veuillez patienter quelques instants'
            : 'Please wait a moment'}
        </p>
      </div>
    </div>
  );
}
