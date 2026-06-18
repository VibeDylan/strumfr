"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DraggableWindow({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const width = Math.min(window.innerWidth - 32, 880);
    setPosition({
      x: Math.max(16, (window.innerWidth - width) / 2),
      y: Math.max(24, window.innerHeight * 0.06),
    });
  }, []);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setPosition({
        x: dragState.current.origX + dx,
        y: dragState.current.origY + dy,
      });
    }
    function handlePointerUp() {
      dragState.current = null;
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position?.x ?? 0,
      origY: position?.y ?? 0,
    };
  }

  if (!mounted || !position) return null;

  return createPortal(
    <div
      className="fixed z-50 flex max-h-[85vh] w-[min(880px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      style={{ left: position.x, top: position.y }}
    >
      <div
        onPointerDown={handlePointerDown}
        className="flex cursor-move items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 select-none"
      >
        <span className="truncate text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>,
    document.body
  );
}
