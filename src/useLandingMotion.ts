import { useEffect, type RefObject } from "react";
import { useScrollScenes } from "./useScrollScenes";

/** Observers gate motion work and respect live preference changes. */
export function useLandingMotion(header: RefObject<HTMLDivElement | null>) {
  useScrollScenes();
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
    const visibility = new IntersectionObserver((entries) => {
      const hero = document.querySelector(".hero");
      if (hero)
        hero.classList.toggle("motion-paused", !entries[0].isIntersecting);
    });
    const hero = document.querySelector(".hero");
    if (hero) visibility.observe(hero);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, [header]);

  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    const progress = document.querySelector<HTMLElement>(".reading-progress");
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (progress)
        progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(request);
    resize.observe(document.body);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

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
