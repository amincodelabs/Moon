const base = import.meta.env.BASE_URL;
const basePrefix = base.replace(/\/$/, "");

/** Prefix links and public assets for both local hosting and GitHub Pages. */
export function sitePath(path = "/") {
  return `${base}${path.replace(/^\/+/, "")}`;
}

export function siteAsset(path: string) {
  return sitePath(path);
}

/** Return the app route without the repository prefix used by project Pages. */
export function appPath() {
  const pathname = location.pathname;
  if (
    basePrefix &&
    (pathname === basePrefix || pathname.startsWith(`${basePrefix}/`))
  ) {
    return pathname.slice(basePrefix.length) || "/";
  }
  return pathname;
}
