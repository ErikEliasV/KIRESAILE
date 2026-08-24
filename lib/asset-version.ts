import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-only. Never import this from a "use client" file — it touches the
 * filesystem, which breaks the browser bundle.
 *
 * Local media in public/media/ gets swapped in place during development
 * (same filename, new bytes). Both the browser's disk cache and Next's image
 * optimizer key their cache on the request URL alone, so a same-name swap
 * keeps serving the old bytes indefinitely until a hard restart. Stamping
 * the source file's mtime onto the URL makes that structurally impossible:
 * the URL itself changes the moment the file does.
 */
function fileVersion(publicPath: string): string {
  try {
    const abs = join(process.cwd(), "public", publicPath);
    return Math.round(statSync(abs).mtimeMs).toString(36);
  } catch {
    return "0";
  }
}

/**
 * On GitHub Pages the site is served under /KIRESAILE — next/image and plain
 * <video>/<img> tags don't get basePath applied automatically the way
 * next/link does, so every local media reference is prefixed here, in the
 * one place they all already pass through.
 */
export function versioned(publicPath: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${publicPath}?v=${fileVersion(publicPath)}`;
}
