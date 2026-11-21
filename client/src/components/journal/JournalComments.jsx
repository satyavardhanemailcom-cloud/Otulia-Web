import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import {
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
  FiMoreHorizontal,
  FiThumbsUp,
} from "react-icons/fi";

// Journal discussion. Same behaviour as the ranking NomineeComments
// (sorting, likes, 2-level threads, edit / delete / report) but styled
// for the Journal's editorial palette (cream / ink / oxblood / brass).

const MAX_DEPTH = 2;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "liked", label: "Most Liked" },
];

const primaryBtn =
  "inline-flex items-center gap-2 bg-[#1C1A17] px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7F4EC] transition-colors hover:bg-[#7A2E2E] disabled:cursor-not-allowed disabled:bg-[#DDD6C7] disabled:text-[#8A8577]";
const ghostBtn =
  "px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4A463F] transition-colors hover:text-[#1C1A17]";
const textareaCls =
  "w-full resize-none overflow-hidden border border-[#DDD6C7] bg-white px-4 py-3 font-serif-body text-[15px] leading-relaxed text-[#1C1A17] placeholder:text-[#8A8577] transition-colors focus:border-[#A8823F] focus:outline-none";

function getInitials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const minutes = Math.floor((now - date) / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  if (date >= startOfYesterday) return "Yesterday";

  const days = Math.floor((startOfToday - date) / 86400000);
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function compareComments(a, b, sort) {
  if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
  if (sort === "liked") {
    return (
      b.likes.length - a.likes.length ||
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function countAllReplies(node) {
  return (node.replies || []).reduce(
    (sum, child) => sum + 1 + countAllReplies(child),
    0,
  );
}

// Comment tree, max 2 levels. Deeper replies flatten into the last level.
function buildTree(comments, sort) {
  const byParent = {};
  comments.forEach((c) => {
    const key = c.parentCommentId || "root";
    (byParent[key] = byParent[key] || []).push(c);
  });

  const collectDescendants = (commentId, list) => {
    (byParent[commentId] || []).forEach((child) => {
      list.push({ ...child, depth: MAX_DEPTH, replies: [], totalReplies: 0 });
      collectDescendants(child._id, list);
    });
  };

  const build = (parentId, depth) => {
    const nodes = [];
    (byParent[parentId] || []).forEach((c) => {
      const node = { ...c, depth, replies: [], totalReplies: 0 };
      if (depth < MAX_DEPTH) node.replies = build(c._id, depth + 1);
      else collectDescendants(c._id, nodes);
      node.totalReplies = countAllReplies(node);
      nodes.push(node);
    });
    // Replies read top-down in conversation order; top-level follows the chosen sort
    return nodes.sort((a, b) =>
      depth === 0 ? compareComments(a, b, sort) : compareComments(a, b, "oldest"),
    );
  };

  return build("root", 0);
}

function Avatar({ name, picture, size = "md" }) {
  const [failed, setFailed] = useState(false);
  const cls =
    size === "sm" ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-[12px]";

  if (picture && !failed) {
    return (
      <img
        src={picture}
        alt={name || "User"}
        onError={() => setFailed(true)}
        className={`${cls} shrink-0 rounded-full object-cover ring-1 ring-[#DDD6C7]`}
      />
    );
  }

  return (
    <div
      className={`${cls} flex shrink-0 select-none items-center justify-center rounded-full bg-[#1C1A17] font-sans font-semibold tracking-wider text-[#E9DFC9]`}
    >
      {getInitials(name)}
    </div>
  );
}

export default function JournalComments({ slug }) {
  const { user, token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const location = useLocation();

  const [comments, setComments] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [postingKey, setPostingKey] = useState(null); // "main" | commentId | "edit-<id>"
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});

  const mainTextareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  const isLoggedIn = !!(token && user);
  const isAdmin = user?.role === "admin";
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchComments = async () => {
    const res = await fetch(`/api/blog/comments/${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  };

  const reloadComments = async () => {
    try {
      const data = await fetchComments();
      setEnabled(data.enabled !== false);
      setComments(data.comments || []);
    } catch {
      // keep whatever we have
    }
  };

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;
    setLoading(true);
    setComments([]);
    setReplyTo(null);
    setEditingId(null);
    setExpandedReplies({});

    fetchComments()
      .then((data) => {
        if (cancelled) return;
        setEnabled(data.enabled !== false);
        setComments(data.comments || []);
      })
      .catch(() => !cancelled && setEnabled(false))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const closeMenus = () => {
      setOpenMenuId(null);
      setSortOpen(false);
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const autoGrow = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const getDepth = (commentId) => {
    let depth = 0;
    let current = comments.find((c) => c._id === commentId);
    while (current && current.parentCommentId) {
      depth += 1;
      current = comments.find((c) => c._id === current.parentCommentId);
      if (depth > 10) break;
    }
    return depth;
  };

  const requireAuth = (action) => {
    if (isLoggedIn) return true;
    showSnackbar(`Sign in to ${action}`);
    return false;
  };

  const submitComment = async (key, parentCommentId, value) => {
    const trimmed = value.trim();
    if (!trimmed || postingKey) return false;

    setPostingKey(key);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ slug, parentCommentId, text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => [...prev, data.comment]);
      return true;
    } catch (err) {
      showSnackbar(
        err.message === "COMMENTS_DISABLED"
          ? "Comments are closed for this story"
          : "Failed to post comment",
      );
      return false;
    } finally {
      setPostingKey(null);
    }
  };

  const handlePostMain = async () => {
    if (!requireAuth("comment")) return;
    const posted = await submitComment("main", null, text);
    if (posted) {
      setText("");
      if (mainTextareaRef.current) mainTextareaRef.current.style.height = "auto";
    }
  };

  const openReply = (c) => {
    if (!requireAuth("reply")) return;
    setReplyTo({ id: c._id, name: c.user?.name || "user" });
    setReplyText("");
    setOpenMenuId(null);
    setTimeout(() => {
      autoGrow(replyTextareaRef.current);
      replyTextareaRef.current?.focus();
    }, 0);
  };

  const handlePostReply = async () => {
    if (!replyTo) return;

    const target = comments.find((c) => c._id === replyTo.id);
    let parentId = replyTo.id;
    if (target && getDepth(target._id) >= MAX_DEPTH && target.parentCommentId) {
      parentId = target.parentCommentId;
    }

    const posted = await submitComment(replyTo.id, parentId, replyText);
    if (posted) {
      let curr = comments.find((c) => c._id === parentId);
      let rootId = parentId;
      while (curr && curr.parentCommentId) {
        rootId = curr.parentCommentId;
        curr = comments.find((c) => c._id === curr.parentCommentId);
      }
      setExpandedReplies((prev) => ({ ...prev, [rootId]: true }));
      setReplyTo(null);
      setReplyText("");
    }
  };

  const handleLike = async (c) => {
    if (!requireAuth("like")) return;

    setLikingId(c._id);
    try {
      const res = await fetch(`/api/blog/comments/${c._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const uid = user?._id ? String(user._id) : null;
      setComments((prev) =>
        prev.map((x) => {
          if (x._id !== c._id) return x;
          let likes = x.likes.filter((id) => id !== uid);
          if (data.liked && uid) likes = [...likes, uid];
          return { ...x, likes };
        }),
      );
    } catch {
      showSnackbar("Failed to update like");
    } finally {
      setLikingId(null);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditText(c.text);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (c) => {
    const trimmed = editText.trim();
    if (!trimmed || postingKey) return;

    setPostingKey(`edit-${c._id}`);
    try {
      const res = await fetch(`/api/blog/comments/${c._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) =>
        prev.map((x) =>
          x._id === c._id ? { ...x, text: data.comment.text, edited: true } : x,
        ),
      );
      setEditingId(null);
      setEditText("");
    } catch {
      showSnackbar("Failed to edit comment");
    } finally {
      setPostingKey(null);
    }
  };

  const handleDelete = async (c) => {
    setOpenMenuId(null);
    if (!window.confirm("Delete this comment and its replies?")) return;

    try {
      const res = await fetch(`/api/blog/comments/${c._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      if (replyTo?.id === c._id) setReplyTo(null);
      if (editingId === c._id) setEditingId(null);
      await reloadComments();
    } catch {
      showSnackbar("Failed to delete comment");
    }
  };

  const handleReport = async (c) => {
    setOpenMenuId(null);
    if (!requireAuth("report")) return;

    try {
      const res = await fetch(`/api/blog/comments/${c._id}/report`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showSnackbar("Report submitted. Thank you!");
    } catch {
      showSnackbar("Failed to submit report");
    }
  };

  const renderComment = (c) => {
    const isOwner =
      user && c.user?._id && String(c.user._id) === String(user._id);
    const canDelete = isOwner || isAdmin;
    const liked = user && c.likes.includes(String(user._id));
    const isEditing = editingId === c._id;
    const isReply = c.depth > 0;
    const showRepliesToggle = !isReply && c.totalReplies > 0;
    const isExpanded = !!expandedReplies[c._id];

    const wrapperCls = isReply
      ? "ml-5 border-l border-[#DDD6C7] pl-5 md:ml-[22px] md:pl-7"
      : "border-t border-[#E8E2D5]";

    return (
      <div key={c._id} className={wrapperCls}>
        <div
          className={`flex gap-4 ${isReply ? "pt-5" : "py-7"}`}
        >
          <Avatar
            name={c.user?.name}
            picture={c.user?.profilePicture}
            size={isReply ? "sm" : "md"}
          />

          <div className="min-w-0 flex-1">
            {/* Name, time, menu */}
            <div className="flex items-start gap-3">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="truncate font-sans text-[14px] font-semibold text-[#1C1A17]">
                  {c.user?.name || "Unknown User"}
                </span>
                <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#8A8577]">
                  {formatTime(c.createdAt)}
                  {c.edited ? " · Edited" : ""}
                </span>
              </div>

              {isLoggedIn && (
                <div className="relative ml-auto shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === c._id ? null : c._id);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[#8A8577] transition-colors hover:bg-[#F3EFE6] hover:text-[#1C1A17]"
                    aria-label="Comment options"
                  >
                    <FiMoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenuId === c._id && (
                    <div
                      className="absolute right-0 top-8 z-30 w-36 border border-[#DDD6C7] bg-white py-1 shadow-[0_12px_30px_-12px_rgba(28,26,23,0.25)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="w-full px-4 py-2 text-left font-sans text-[13px] text-[#1C1A17] hover:bg-[#F7F4EC]"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          className="w-full px-4 py-2 text-left font-sans text-[13px] text-[#7A2E2E] hover:bg-[#F7F4EC]"
                        >
                          Delete
                        </button>
                      )}
                      {!isOwner && (
                        <button
                          type="button"
                          onClick={() => handleReport(c)}
                          className="w-full px-4 py-2 text-left font-sans text-[13px] text-[#1C1A17] hover:bg-[#F7F4EC]"
                        >
                          Report
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Body / inline edit */}
            {isEditing ? (
              <div className="mt-3">
                <textarea
                  value={editText}
                  onChange={(e) => {
                    setEditText(e.target.value);
                    autoGrow(e.target);
                  }}
                  rows={3}
                  autoFocus
                  className={textareaCls}
                />
                <div className="mt-3 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className={ghostBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!editText.trim() || !!postingKey}
                    onClick={() => handleSaveEdit(c)}
                    className={primaryBtn}
                  >
                    {postingKey === `edit-${c._id}` ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap break-words font-serif-body text-[15px] leading-[1.7] text-[#332F29] md:text-[16px]">
                {c.text}
              </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center gap-5">
              <button
                type="button"
                onClick={() => handleLike(c)}
                disabled={likingId === c._id}
                className={`flex items-center gap-1.5 font-sans text-[12px] font-medium transition-colors disabled:opacity-50 ${
                  liked ? "text-[#A8823F]" : "text-[#8A8577] hover:text-[#1C1A17]"
                }`}
                title={liked ? "Unlike" : "Like"}
              >
                <FiThumbsUp className={`h-[15px] w-[15px] ${liked ? "fill-[#A8823F]/20" : ""}`} />
                <span>{c.likes.length > 0 ? c.likes.length : "Like"}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  replyTo?.id === c._id ? setReplyTo(null) : openReply(c)
                }
                className="flex items-center gap-1.5 font-sans text-[12px] font-medium text-[#8A8577] transition-colors hover:text-[#1C1A17]"
              >
                <FiMessageSquare className="h-[15px] w-[15px]" />
                Reply
              </button>
            </div>

            {/* Reply composer */}
            {replyTo?.id === c._id && (
              <div className="mt-4 flex items-start gap-3">
                <Avatar name={user?.name} picture={user?.profilePicture} size="sm" />
                <div className="min-w-0 flex-1">
                  <textarea
                    ref={replyTextareaRef}
                    rows={2}
                    value={replyText}
                    placeholder={`Reply to ${replyTo.name}…`}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      autoGrow(e.target);
                    }}
                    className={textareaCls}
                  />
                  <div className="mt-3 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText("");
                      }}
                      className={ghostBtn}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!replyText.trim() || !!postingKey}
                      onClick={handlePostReply}
                      className={primaryBtn}
                    >
                      {postingKey === replyTo.id ? "Posting…" : "Reply"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies toggle */}
            {showRepliesToggle && (
              <button
                type="button"
                onClick={() =>
                  setExpandedReplies((prev) => ({ ...prev, [c._id]: !prev[c._id] }))
                }
                className="mt-4 flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7A2E2E] transition-colors hover:text-[#1C1A17]"
              >
                {isExpanded ? "Hide" : "View"} {c.totalReplies}{" "}
                {c.totalReplies === 1 ? "reply" : "replies"}
                {isExpanded ? (
                  <FiChevronUp className="h-4 w-4" />
                ) : (
                  <FiChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {(isReply || isExpanded) && c.replies.length > 0 && (
          <div className={isReply ? "" : "pb-6"}>{c.replies.map(renderComment)}</div>
        )}
      </div>
    );
  };

  if (!slug || (!loading && !enabled)) return null;

  const tree = buildTree(comments, sort);
  const currentSort = SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <section id="comments" className="scroll-mt-28 text-[#1C1A17]">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1C1A17] pb-4">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A2E2E]">
            Join the conversation
          </p>
          <h2 className="mt-2 font-display text-[28px] leading-tight md:text-[32px]">
            Comments
            {comments.length > 0 && (
              <span className="ml-3 align-middle font-sans text-[14px] font-medium text-[#8A8577]">
                ({comments.length})
              </span>
            )}
          </h2>
        </div>

        {comments.length > 1 && (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 font-sans text-[12px] uppercase tracking-[0.1em] text-[#4A463F] transition-colors hover:text-[#1C1A17]"
            >
              Sort: <span className="font-semibold text-[#1C1A17]">{currentSort?.label}</span>
              <FiChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-40 border border-[#DDD6C7] bg-white py-1 shadow-[0_12px_30px_-12px_rgba(28,26,23,0.25)]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value);
                      setSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left font-sans text-[13px] transition-colors hover:bg-[#F7F4EC] ${
                      sort === option.value
                        ? "font-semibold text-[#A8823F]"
                        : "text-[#1C1A17]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="mt-8">
        {isLoggedIn ? (
          <div className="flex items-start gap-4">
            <Avatar name={user.name} picture={user.profilePicture} />
            <div className="min-w-0 flex-1">
              <textarea
                ref={mainTextareaRef}
                rows={3}
                value={text}
                placeholder="Share your thoughts on this story…"
                onChange={(e) => {
                  setText(e.target.value);
                  autoGrow(e.target);
                }}
                className={textareaCls}
              />
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-sans text-[11px] text-[#8A8577]">
                  Posting as <span className="font-semibold text-[#4A463F]">{user.name}</span>
                </span>
                <button
                  type="button"
                  disabled={!text.trim() || !!postingKey}
                  onClick={handlePostMain}
                  className={primaryBtn}
                >
                  {postingKey === "main" && (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#F7F4EC]/40 border-t-[#F7F4EC]" />
                  )}
                  {postingKey === "main" ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 border border-[#DDD6C7] bg-[#F7F4EC] px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-[18px] text-[#1C1A17]">
                Have something to add?
              </p>
              <p className="mt-1 font-sans text-[13px] text-[#4A463F]">
                Sign in to join the discussion with other Otulia readers.
              </p>
            </div>
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className={primaryBtn}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* List */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#DDD6C7] border-t-[#A8823F]" />
          </div>
        ) : tree.length === 0 ? (
          <div className="border-t border-[#E8E2D5] py-12 text-center">
            <p className="font-display text-[19px] text-[#1C1A17]">No comments yet</p>
            <p className="mt-2 font-sans text-[13px] text-[#8A8577]">
              Be the first to share your perspective on this story.
            </p>
          </div>
        ) : (
          <div>{tree.map(renderComment)}</div>
        )}
      </div>
    </section>
  );
}
