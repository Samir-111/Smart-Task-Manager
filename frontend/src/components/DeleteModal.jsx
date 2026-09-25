import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export function DeleteModal({
  isOpen,
  title,
  itemName,
  isDeleting = false,
  onConfirm,
  onCancel,
  warningNote,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-200 animate-slide-up transform transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Please confirm your action</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{itemName}"</span>? This action cannot be undone.
        </div>

        {warningNote && (
          <div className="mb-5 p-3 bg-amber-50/90 rounded-xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-semibold shrink-0">⚠️ Notice:</span>
            <span>{warningNote}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all duration-150 active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-150 shadow-xs active:scale-98 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
