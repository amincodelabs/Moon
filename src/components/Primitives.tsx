import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpLeft, X } from "lucide-react";
import type { Copy } from "../locales";
import { routes, type RouteKey } from "../data";
import { siteAsset, sitePath } from "../site";
export type Navigate = (route: RouteKey) => void;
export function DestinationLink({
  route,
  go,
  children,
  className = "",
}: {
  route: RouteKey;
  go: Navigate;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={sitePath(routes[route])}
      onClick={(e) => {
        e.preventDefault();
        go(route);
      }}
    >
      {children}
    </a>
  );
}
export function Arrow() {
  return (
    <ArrowUpLeft className="direction-arrow" size={18} aria-hidden="true" />
  );
}
export function Photo({
  name,
  alt,
  className = "",
  hero = false,
}: {
  name: string;
  alt: string;
  className?: string;
  hero?: boolean;
}) {
  return (
    <img
      key={name}
      className={className}
      src={siteAsset(`/images/${name}-${hero ? 1600 : 800}.webp`)}
      srcSet={
        hero
          ? `${siteAsset(`/images/${name}-800.webp`)} 800w, ${siteAsset(`/images/${name}-1600.webp`)} 1600w`
          : `${siteAsset(`/images/${name}-400.webp`)} 400w, ${siteAsset(`/images/${name}-800.webp`)} 800w`
      }
      sizes={
        hero
          ? "100vw"
          : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw"
      }
      alt={alt}
      width={hero ? 1600 : 800}
      height={hero ? 1067 : 600}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
      decoding="async"
    />
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Modal({
  title,
  t,
  close,
  children,
}: {
  title: string;
  t: Copy;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const active = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="dialog-title"
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const controls = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]',
          ),
        );
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            close();
        }
      }}
    >
      <div className="modal-heading">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" aria-label={t.close} onClick={close}>
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
