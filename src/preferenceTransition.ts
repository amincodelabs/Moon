import { flushSync } from "react-dom";

let active: ViewTransition | undefined;
/** Crossfade the current viewport; never animate direction via physical layout. */
export function transitionPreference(update: () => void) {
  active?.skipTransition();
  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  const transition = document.startViewTransition(() => flushSync(update));
  active = transition;
  void transition.finished
    .catch(() => {})
    .finally(() => {
      if (active === transition) active = undefined;
    });
}
