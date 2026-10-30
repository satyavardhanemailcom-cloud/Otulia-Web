export const dealerSlug = (name) =>
  String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const dealerUrl = (name, email) => {
  const slug = dealerSlug(name);
  return `/dealer/${encodeURIComponent(slug || email || "")}`;
};
