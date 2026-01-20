import React, { useState, useRef, useEffect } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateSuccess: () => void;
  token: string | null;
  onValidatePin: (pin: string) => Promise<boolean>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onActivateSuccess,
  token,
  onValidatePin
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (isOpen && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (digit && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (digit && index === 3 && newPin.every(d => d)) {
      handleSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (fullPin: string) => {
    setLoading(true);
    setError('');

    const success = await onValidatePin(fullPin);

    if (success) {
      onActivateSuccess();
    } else {
      setError('PIN incorrecto');
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-stone-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="bg-stone-100 dark:bg-stone-900 px-6 py-4 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
          <h2 className="font-serif font-bold text-stone-800 dark:text-stone-100 text-xl">
            Acceso Propietario
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <p className="text-sm text-stone-500 dark:text-stone-400 text-center mb-6">
            Ingresa el PIN de 4 dígitos que te proporcionaron
          </p>

          {/* PIN Input */}
          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all
                  ${error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-stone-200 dark:border-stone-600 bg-stone-50 dark:bg-stone-700'
                  }
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  text-stone-800 dark:text-stone-100
                `}
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-bold animate-pulse mb-4">
              {error}
            </p>
          )}

          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};