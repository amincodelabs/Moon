import { useEffect } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
/** One scheduled frame per scroll event burst, only nearby scenes, all reads before writes. */
export function useScrollScenes() {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".hero-track, .editorial-section, .tour-feature",
      ),
    );
    const nearby = new Set<HTMLElement>();
    let frame = 0;
    let headerHeight = 124;
    const header = document.querySelector(".masthead");
    const measureHeader = () => {
      headerHeight = header?.getBoundingClientRect().height ?? 124;
      request();
    };
    const update = () => {
      frame = 0;
      if (media.matches) return;
      const values = Array.from(nearby, (element) => {
        const rect = element.getBoundingClientRect();
        if (element.classList.contains("hero-track")) {
          const heroHeight =
            element.firstElementChild?.getBoundingClientRect().height ??
            rect.height;
          const runway = rect.height - heroHeight;
          return {
            element,
            variable: "--scene-progress",
            value: clamp(
              (headerHeight - rect.top) / (runway > 20 ? runway : heroHeight),
            ),
          };
        }
        return {
          element,
          variable: "--scene-progress",
          value: clamp(
            (innerHeight - rect.top) /
              (innerHeight + rect.height - headerHeight),
          ),
        };
      });
      values.forEach(({ element, variable, value }) =>
        element.style.setProperty(variable, value.toFixed(4)),
      );
    };
    function request() {
      if (!frame && !media.matches) frame = requestAnimationFrame(update);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) nearby.add(target as HTMLElement);
          else nearby.delete(target as HTMLElement);
        });
        request();
      },
      { rootMargin: "200px" },
    );
    scenes.forEach((element) => observer.observe(element));
    const resize = new ResizeObserver(measureHeader);
    if (header) resize.observe(header);
    scenes.forEach((element) => resize.observe(element));
    const preferenceChanged = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (media.matches)
        scenes.forEach((element) =>
          element.style.removeProperty("--scene-progress"),
        );
      else request();
    };
    media.addEventListener("change", preferenceChanged);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", measureHeader);
    measureHeader();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      removeEventListener("scroll", request);
      removeEventListener("resize", measureHeader);
      media.removeEventListener("change", preferenceChanged);
      scenes.forEach((element) =>
        element.style.removeProperty("--scene-progress"),
      );
    };
  }, []);
}
