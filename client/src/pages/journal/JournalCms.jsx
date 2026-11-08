import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CmsArticleView } from "../../components/journal/cms/CmsArticle";

// Simple Journal CMS: list posts, create / edit / preview / publish / delete.
// Rendered as the "Journal CMS" tab inside /admin (admin users only)

// Set to false only for quick local testing without an admin account.
const CMS_REQUIRE_LOGIN = true;

const CATEGORIES = ["Cars", "Real Estate", "Yachts", "Watches", "Guides"];

const emptySection = () => ({
  heading: "",
  body: "",
  quote: "",
  quoteAttribution: "",
  image: "",
  imageCaption: "",
});

const emptyPost = () => ({
  slug: "",
  status: "draft",
  title: "",
  tag: "",
  category: "Cars",
  excerpt: "",
  heroImage: "",
  author: "Otulia Editorial Team",
  readTime: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  sections: [emptySection()],
  faqs: [],
  specs: [],
  cta: { text: "", buttonLabel: "", url: "" },
});

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const inputCls =
  "w-full border border-gray-200 rounded-sm px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#A8823F]";
const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1";
const btnCls =
  "px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-colors disabled:opacity-50";
const smallBtnCls =
  "px-2 py-1 text-[11px] border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900";

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
      {hint && (
        <span className="block mt-1 text-[11px] text-gray-400">{hint}</span>
      )}
    </label>
  );
}

function ImageInput({ label, value, onChange, token }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/blog/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert(data.error || "Upload failed");
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder="Paste image URL or upload"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          className={`${smallBtnCls} flex items-center cursor-pointer whitespace-nowrap`}
        >
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>
      {value && (
        <img src={value} alt="" className="mt-2 h-24 w-auto object-cover" />
      )}
    </div>
  );
}

// Generic editor for a list of small objects (FAQs, specs)
function PairList({
  title,
  items,
  keys,
  placeholders,
  onChange,
  multilineSecond,
}) {
  const update = (i, key, val) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));

  return (
    <div className="border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          className={smallBtnCls}
          onClick={() => onChange([...items, { [keys[0]]: "", [keys[1]]: "" }])}
        >
          + Add
        </button>
      </div>
      {items.length === 0 && <p className="text-xs text-gray-400">None yet.</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row">
            <input
              className={inputCls}
              placeholder={placeholders[0]}
              value={item[keys[0]] || ""}
              onChange={(e) => update(i, keys[0], e.target.value)}
            />
            {multilineSecond ? (
              <textarea
                rows={2}
                className={inputCls}
                placeholder={placeholders[1]}
                value={item[keys[1]] || ""}
                onChange={(e) => update(i, keys[1], e.target.value)}
              />
            ) : (
              <input
                className={inputCls}
                placeholder={placeholders[1]}
                value={item[keys[1]] || ""}
                onChange={(e) => update(i, keys[1], e.target.value)}
              />
            )}
            <button
              type="button"
              className={`${smallBtnCls} self-start`}
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JournalCms() {
  const { token, user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null); // post being edited
  const [slugTouched, setSlugTouched] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadPosts = () =>
    fetch("/api/blog/admin/all", { headers: authHeaders })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]));

  const isAdmin = !CMS_REQUIRE_LOGIN || user?.role === "admin";

  useEffect(() => {
    if (isAdmin) loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  if (CMS_REQUIRE_LOGIN && authLoading) return <div className="py-20" />;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-20 text-center">
        <p className="text-gray-600">
          The Journal CMS is available to admins only.
        </p>
        <Link to="/login" className={`${btnCls} border-gray-900 text-gray-900`}>
          Log in
        </Link>
      </div>
    );
  }

  const set = (key, value) => setPost((p) => ({ ...p, [key]: value }));

  const setTitle = (title) =>
    setPost((p) => ({
      ...p,
      title,
      slug: slugTouched ? p.slug : slugify(title),
    }));

  const updateSection = (i, key, value) =>
    set(
      "sections",
      post.sections.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    );

  const moveSection = (i, dir) => {
    const next = [...post.sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set("sections", next);
  };

  const openPost = async (id) => {
    setMessage("");
    setPreview(false);
    const res = await fetch(`/api/blog/admin/${id}`, { headers: authHeaders });
    if (!res.ok) return setMessage("Could not load post.");
    const data = await res.json();
    setPost({
      ...emptyPost(),
      ...data,
      publishedAt: (data.publishedAt || "").slice(0, 10),
      cta: { ...emptyPost().cta, ...(data.cta || {}) },
    });
    setSlugTouched(true);
  };

  const newPost = () => {
    setMessage("");
    setPreview(false);
    setPost(emptyPost());
    setSlugTouched(false);
  };

  const save = async (status) => {
    if (!post.title.trim() || !post.slug.trim()) {
      return setMessage("Title and slug are required.");
    }
    setSaving(true);
    setMessage("");
    const body = { ...post, status: status || post.status };
    const isNew = !post._id;
    try {
      const res = await fetch(
        isNew ? "/api/blog/admin" : `/api/blog/admin/${post._id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: authHeaders,
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(
          data.error === "SLUG_ALREADY_EXISTS"
            ? "That slug is already used by another post."
            : data.error || "Save failed.",
        );
      } else {
        setPost((p) => ({ ...p, _id: data._id, status: data.status }));
        setSlugTouched(true);
        setMessage(
          data.status === "published" ? "Published." : "Saved as draft.",
        );
        loadPosts();
      }
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (
      !post._id ||
      !window.confirm(`Delete "${post.title}"? This cannot be undone.`)
    )
      return;
    await fetch(`/api/blog/admin/${post._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    setPost(null);
    loadPosts();
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] font-sans">
      {/* Top bar */}
      <header className="sticky top-20 z-30 rounded-t-2xl flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 md:px-8">
        <h2 className="text-lg font-semibold text-gray-900">Journal CMS</h2>
        {post && (
          <div className="flex flex-wrap items-center gap-2">
            {message && (
              <span className="text-xs text-gray-500 mr-2">{message}</span>
            )}
            <button
              type="button"
              className={`${btnCls} border-gray-300 text-gray-700 hover:border-gray-900`}
              onClick={() => setPreview((v) => !v)}
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              disabled={saving}
              className={`${btnCls} border-gray-300 text-gray-700 hover:border-gray-900`}
              onClick={() => save("draft")}
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={saving}
              className={`${btnCls} border-[#1C1A17] bg-[#1C1A17] text-white hover:bg-[#7A2E2E] hover:border-[#7A2E2E]`}
              onClick={() => save("published")}
            >
              {post.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Post list */}
        <aside className="w-full border-b border-gray-200 bg-white lg:w-[300px] lg:min-h-[70vh] lg:rounded-bl-2xl lg:border-b-0 lg:border-r">
          <div className="p-4">
            <button
              type="button"
              className={`${btnCls} w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white`}
              onClick={newPost}
            >
              + New post
            </button>
          </div>
          <ul className="max-h-[40vh] overflow-y-auto lg:max-h-none">
            {posts.length === 0 && (
              <li className="px-4 pb-4 text-xs text-gray-400">
                No CMS posts yet.
              </li>
            )}
            {posts.map((p) => (
              <li key={p._id}>
                <button
                  type="button"
                  onClick={() => openPost(p._id)}
                  className={`w-full border-l-2 px-4 py-3 text-left hover:bg-gray-50 ${
                    post?._id === p._id
                      ? "border-[#A8823F] bg-gray-50"
                      : "border-transparent"
                  }`}
                >
                  <span className="block text-sm font-medium text-gray-900 line-clamp-2">
                    {p.title}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                    <span
                      className={`uppercase tracking-wider ${
                        p.status === "published"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {p.status}
                    </span>
                    · {p.category}
                    {p.status === "published" && (
                      <Link
                        to={`/journal/${p.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto underline hover:text-gray-900"
                      >
                        View
                      </Link>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor / preview */}
        <main className="flex-1 min-w-0">
          {!post && (
            <div className="flex h-64 items-center justify-center px-4 text-sm text-gray-400">
              Select a post or create a new one.
            </div>
          )}

          {post && preview && (
            <div className="bg-white">
              <CmsArticleView post={post} />
            </div>
          )}

          {post && !preview && (
            <div className="mx-auto max-w-[900px] space-y-8 px-4 py-8 md:px-8">
              {/* Basics */}
              <section className="space-y-4 border border-gray-100 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-900">Basics</h2>
                <Field label="Title">
                  <input
                    className={inputCls}
                    value={post.title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
                <Field label="Slug" hint={`URL: /journal/${post.slug || "…"}`}>
                  <input
                    className={inputCls}
                    value={post.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", slugify(e.target.value));
                    }}
                  />
                </Field>
                <Field
                  label="Excerpt / subtitle"
                  hint="Shown under the headline and used as the SEO description."
                >
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={post.excerpt}
                    onChange={(e) => set("excerpt", e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Category">
                    <select
                      className={inputCls}
                      value={post.category}
                      onChange={(e) => set("category", e.target.value)}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Tag (eyebrow)"
                    hint='e.g. "Road Test", "Celebrity Real Estate"'
                  >
                    <input
                      className={inputCls}
                      value={post.tag}
                      onChange={(e) => set("tag", e.target.value)}
                    />
                  </Field>
                  <Field label="Author">
                    <input
                      className={inputCls}
                      value={post.author}
                      onChange={(e) => set("author", e.target.value)}
                    />
                  </Field>
                  <Field label="Read time (minutes)">
                    <input
                      className={inputCls}
                      value={post.readTime}
                      onChange={(e) => set("readTime", e.target.value)}
                    />
                  </Field>
                  <Field label="Publish date">
                    <input
                      type="date"
                      className={inputCls}
                      value={post.publishedAt}
                      onChange={(e) => set("publishedAt", e.target.value)}
                    />
                  </Field>
                </div>
                <ImageInput
                  label="Hero image"
                  value={post.heroImage}
                  onChange={(v) => set("heroImage", v)}
                  token={token}
                />
              </section>

              {/* Sections */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Sections{" "}
                    <span className="font-normal text-gray-400">
                      (headings build the table of contents)
                    </span>
                  </h2>
                  <button
                    type="button"
                    className={smallBtnCls}
                    onClick={() =>
                      set("sections", [...post.sections, emptySection()])
                    }
                  >
                    + Add section
                  </button>
                </div>

                {post.sections.map((section, i) => (
                  <div
                    key={i}
                    className="space-y-3 border border-gray-100 bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8823F]">
                        Section {i + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className={smallBtnCls}
                          onClick={() => moveSection(i, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={smallBtnCls}
                          onClick={() => moveSection(i, 1)}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className={smallBtnCls}
                          onClick={() =>
                            set(
                              "sections",
                              post.sections.filter((_, idx) => idx !== i),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <Field
                      label="Heading"
                      hint="Leave empty for an intro section without a heading."
                    >
                      <input
                        className={inputCls}
                        value={section.heading}
                        onChange={(e) =>
                          updateSection(i, "heading", e.target.value)
                        }
                      />
                    </Field>
                    <Field
                      label="Body"
                      hint="Separate paragraphs with a blank line."
                    >
                      <textarea
                        rows={8}
                        className={`${inputCls} font-serif`}
                        value={section.body}
                        onChange={(e) =>
                          updateSection(i, "body", e.target.value)
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
                      <Field label="Pull quote (optional)">
                        <input
                          className={inputCls}
                          value={section.quote}
                          onChange={(e) =>
                            updateSection(i, "quote", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Quote attribution">
                        <input
                          className={inputCls}
                          value={section.quoteAttribution}
                          onChange={(e) =>
                            updateSection(i, "quoteAttribution", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                    <ImageInput
                      label="Image after this section (optional)"
                      value={section.image}
                      onChange={(v) => updateSection(i, "image", v)}
                      token={token}
                    />
                    <Field label="Image caption">
                      <input
                        className={inputCls}
                        value={section.imageCaption}
                        onChange={(e) =>
                          updateSection(i, "imageCaption", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                ))}
              </section>

              {/* Extras */}
              <PairList
                title="Specifications (optional)"
                items={post.specs}
                keys={["label", "value"]}
                placeholders={[
                  "Label, e.g. Base Price",
                  "Value, e.g. $170,350",
                ]}
                onChange={(v) => set("specs", v)}
              />
              <PairList
                title="FAQs (optional)"
                items={post.faqs}
                keys={["q", "a"]}
                placeholders={["Question", "Answer"]}
                multilineSecond
                onChange={(v) => set("faqs", v)}
              />

              <section className="space-y-3 border border-gray-100 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-900">
                  CTA banner (optional)
                </h2>
                <Field label="Text">
                  <input
                    className={inputCls}
                    value={post.cta.text}
                    onChange={(e) =>
                      set("cta", { ...post.cta, text: e.target.value })
                    }
                  />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Button label">
                    <input
                      className={inputCls}
                      value={post.cta.buttonLabel}
                      onChange={(e) =>
                        set("cta", { ...post.cta, buttonLabel: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Button URL">
                    <input
                      className={inputCls}
                      value={post.cta.url}
                      onChange={(e) =>
                        set("cta", { ...post.cta, url: e.target.value })
                      }
                    />
                  </Field>
                </div>
              </section>

              {post._id && (
                <div className="border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    className={`${btnCls} border-red-300 text-red-600 hover:bg-red-600 hover:text-white`}
                    onClick={remove}
                  >
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
