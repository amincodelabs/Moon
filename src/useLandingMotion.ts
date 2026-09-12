import { useEffect, type RefObject } from "react";

/** Observers keep motion off the scroll thread and respect live preference changes. */
export function useLandingMotion(header: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const resize = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${element.getBoundingClientRect().height}px`,
      );
    });
    resize.observe(element);
    return () => {
      resize.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, [header]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const elements = document.querySelectorAll(
      ".section-heading, .destination, .product, .course-feature, .tour-feature, .editorial, .journey-path",
    );
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (media.matches) {
        elements.forEach((element) => element.classList.remove("motion-ready"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12 },
      );
      elements.forEach((element) => {
        element.classList.add("motion-ready");
        observer?.observe(element);
      });
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", setup);
    };
  }, []);
}
