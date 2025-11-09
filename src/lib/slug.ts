export const toSlug = (s: string) =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const sameSlug = (a?: string, b?: string) =>
  toSlug(a ?? "") === toSlug(b ?? "");
