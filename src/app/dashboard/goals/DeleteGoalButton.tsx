"use client";

import { useState } from "react";
import { deleteGoal } from "./actions";

export function DeleteGoalButton({ slug }: { slug: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteGoal(slug);
    } catch (e) {
      alert("Failed to delete goal.");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors ml-auto"
      >
        Delete goal
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-zinc-50 mb-2">Delete Goal</h3>
            <p className="text-sm text-neutral-500 dark:text-zinc-400 mb-6">
              Are you sure you want to delete this goal? This action cannot be undone and you will lose all progress and updates.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Yes, delete it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
