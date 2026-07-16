import React, { useEffect } from 'react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onDismiss,
  autoDismissMs = 5000 
}) => {
  useEffect(() => {
    if (autoDismissMs && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center justify-between">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-green-600 hover:text-green-800 font-medium"
        >
          ✕
        </button>
      )}
    </div>
  );
};
