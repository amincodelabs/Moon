import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShop } from "./context";

export function CollectionRail({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { tr, language } = useShop();
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    overflow: false,
    start: true,
    end: true,
  });
  useEffect(() => {
    const el = rail.current!;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const offset = Math.abs(el.scrollLeft);
      setPosition({
        overflow: max > 2,
        start: offset < 2,
        end: offset >= max - 2,
      });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      resize.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [language, children]);
  const move = (step: number) => {
    const el = rail.current!;
    el.scrollBy({
      left: step * (language === "fa" ? -1 : 1) * el.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  return (
    <>
      {position.overflow && (
        <div className="shop-collection-nav">
          <button
            type="button"
            disabled={position.start}
            aria-label={`${tr("Previous", "قبلی")}: ${title}`}
            onClick={() => move(-1)}
          >
            {language === "fa" ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
          <button
            type="button"
            disabled={position.end}
            aria-label={`${tr("Next", "بعدی")}: ${title}`}
            onClick={() => move(1)}
          >
            {language === "fa" ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
      )}
      <div className="shop-product-grid shop-collection-rail" ref={rail}>
        {children}
      </div>
    </>
  );
}
