"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#06B6D4",
];

interface ConfettiPieceData {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPieceData[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const generated: ConfettiPieceData[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      size: 6 + Math.random() * 6,
    }));
    setPieces(generated);

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
