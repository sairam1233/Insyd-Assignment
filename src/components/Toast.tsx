import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  dismissAfterMs?: number;
  onDismiss: () => void;
}

export default function Toast({ message, type = 'info', dismissAfterMs = 2500, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, dismissAfterMs);
    return () => clearTimeout(id);
  }, [dismissAfterMs, onDismiss]);

  return (
    <div role="status" aria-live="polite" className={`toast ${type}`}>
      {message}
    </div>
  );
}
