import { flushSync } from "react-dom";
import { appPath } from "./site";

let active: ViewTransition | undefined;
/** Crossfade the current viewport; never animate direction via physical layout. */
export function transitionPreference(update: () => void) {
  active?.skipTransition();
  if (
    !document.startViewTransition ||
    appPath().startsWith("/store") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }
  const transition = document.startViewTransition(() => flushSync(update));
  active = transition;
  // A rapid second preference change skips the snapshot and rejects `ready`.
  // The preference update still completes; consume that expected rejection.
  void transition.ready.catch(() => {});
  void transition.finished
    .catch(() => {})
    .finally(() => {
      if (active === transition) active = undefined;
    });
}
