export interface ToastMessage {
  id: number;
  message: string;
  tone: 'success' | 'error';
}

export function ToastRegion({toasts}: {toasts: ToastMessage[]}) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`}>{toast.message}</div>
      ))}
    </div>
  );
}
