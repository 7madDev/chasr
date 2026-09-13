"use client";

import { useState } from "react";
import { deleteGoal } from "./actions";

export function DeleteGoalButton({ slug }: { slug: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await deleteGoal(slug);
    } catch (e) {
      alert("Failed to delete goal.");
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors ml-auto"
    >
      {isDeleting ? "Deleting..." : "Delete goal"}
    </button>
  );
}
