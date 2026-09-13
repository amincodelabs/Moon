import { useRef, type PointerEvent } from "react";
import type { Language } from "./locales";

/** Native vertical panning/pinch zoom take priority; a deliberate horizontal swipe changes the image. */
export function useImageSwipe(
  language: Language,
  change: (direction: number) => void,
) {
  const start = useRef<{
    x: number;
    y: number;
    time: number;
    id: number;
  } | null>(null);
  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (
        event.pointerType !== "touch" ||
        !event.isPrimary ||
        (event.target as HTMLElement).closest("button")
      )
        return;
      start.current = {
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        id: event.pointerId,
      };
    },
    onPointerUp(event: PointerEvent<HTMLDivElement>) {
      const origin = start.current;
      start.current = null;
      if (!origin || event.pointerId !== origin.id) return;
      const dx = event.clientX - origin.x,
        dy = event.clientY - origin.y;
      if (
        Math.abs(dx) < 45 ||
        Math.abs(dx) < Math.abs(dy) * 1.5 ||
        event.timeStamp - origin.time > 800
      )
        return;
      change((dx < 0 ? 1 : -1) * (language === "fa" ? -1 : 1));
    },
    onPointerCancel() {
      start.current = null;
    },
  };
}
