import React, { useEffect, useState } from "react";
import SEO from "../../SEO";
import NotFound from "../../../pages/NotFound";

// Renders a CMS post using the same editorial design as the hand-written
// stories in components/journal/Stories (cream/ink/oxblood/brass).

const toId = (text, i) =>
  `${String(text || "section")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-${i}`;

const paragraphs = (body) =>
  String(body || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Same look as the ShareIcon in the hand-written stories, but as real share links.
function ShareIcon({ label, path, href }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD6C7] text-[#1C1A17] transition-colors hover:border-[#7A2E2E] hover:bg-[#7A2E2E] hover:text-[#F7F4EC]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}

function ShareIcons({ post }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = encodeURIComponent(`${origin}/journal/${post.slug || ""}`);
  const title = encodeURIComponent(post.title || "");

  return (
    <div className="flex items-center gap-2">
      <ShareIcon
        label="Share via email"
        href={`mailto:?subject=${title}&body=${url}`}
        path="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 6 8-6"
      />
      <ShareIcon
        label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        path="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7v3h2.6v8H13z"
      />
      <ShareIcon
        label="Share on X"
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        path="M4 4l7.5 8.6L4.4 20H6l6.3-6.9L17 20h3l-7.9-9L19 4h-1.6l-5.7 6.3L8 4H4z"
      />
      <ShareIcon
        label="Share on LinkedIn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        path="M4.98 3.5A2.5 2.5 0 100 6a2.5 2.5 0 004.98-.5zM.5 8.75h4.9V21H.5V8.75zM8.5 8.75h4.7v1.68h.07c.66-1.2 2.27-2.47 4.68-2.47 5 0 5.93 3.3 5.93 7.59V21h-4.9v-5.9c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V21H8.5V8.75z"
      />
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="font-display text-[26px] leading-tight text-[#1C1A17] md:text-[30px]">
      {children}
    </h2>
  );
}

function PullQuote({ children, attribution }) {
  return (
    <blockquote className="my-8 border-l-2 border-[#A8823F] pl-6">
      <p className="font-display text-[19px] italic leading-snug text-[#1C1A17] md:text-[21px]">
        {children}
      </p>
      {attribution && (
        <cite className="mt-3 block font-sans text-[11px] not-italic uppercase tracking-[0.12em] text-[#7A2E2E]">
          {attribution}
        </cite>
      )}
    </blockquote>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#DDD6C7]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-[17px] text-[#1C1A17] md:text-[18px]">
          {item.q}
        </span>
        <span
          className={`shrink-0 text-xl text-[#7A2E2E] transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] pb-5 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-serif-body text-[15px] leading-relaxed text-[#4A463F] md:text-[16px]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

// Pure presentational view — also used for the live preview in the CMS.
export function CmsArticleView({ post }) {
  const [openFaq, setOpenFaq] = useState(0);

  const sections = (post.sections || []).map((s, i) => ({
    ...s,
    id: toId(s.heading, i),
  }));
  const faqs = (post.faqs || []).filter((f) => f.q && f.a);
  const specs = (post.specs || []).filter((s) => s.label && s.value);
  const toc = [
    ...sections.filter((s) => s.heading).map((s) => ({ id: s.id, label: s.heading })),
    ...(specs.length ? [{ id: "specs", label: "Specifications" }] : []),
    ...(faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];

  return (
    <div className="min-h-screen w-full text-[#1C1A17]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-serif-body { font-family: 'Source Serif 4', Georgia, serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-14 md:px-8 md:pt-20">
        {post.tag && (
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A2E2E]">
            {post.tag}
          </p>
        )}

        <h1 className="mt-4 font-display text-[34px] leading-[1.12] text-[#1C1A17] md:text-[46px]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 max-w-[680px] font-serif-body text-[17px] leading-relaxed text-[#4A463F] md:text-[18px]">
            {post.excerpt}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#DDD6C7] pb-6">
          <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#4A463F]">
            {post.publishedAt && formatDate(post.publishedAt)}
            {post.author && <> &nbsp;|&nbsp; By {post.author}</>}
          </p>
          <ShareIcons post={post} />
        </div>

        {post.heroImage && (
          <img
            src={post.heroImage}
            alt={post.title}
            className="mt-10 w-full object-cover"
          />
        )}

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Sidebar */}
          <aside className="shrink-0 md:w-[220px]">
            <div className="sticky top-10">
              {post.readTime && (
                <p className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-[#1C1A17]">
                  {post.readTime} Minute Read
                </p>
              )}
              {toc.length > 0 && (
                <nav className="mt-5 flex flex-col gap-3 border-l border-[#DDD6C7] pl-4">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="font-sans text-[13px] leading-snug text-[#4A463F] transition-colors hover:text-[#7A2E2E]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </aside>

          {/* Article body */}
          <article className="min-w-0 flex-1">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-28">
                {section.heading && <SectionHeading>{section.heading}</SectionHeading>}
                {paragraphs(section.body).map((p, i) => (
                  <p
                    key={i}
                    className="mt-5 whitespace-pre-line font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]"
                  >
                    {p}
                  </p>
                ))}
                {section.quote && (
                  <PullQuote attribution={section.quoteAttribution}>
                    {section.quote}
                  </PullQuote>
                )}
                {section.image && (
                  <figure className="pt-5">
                    <img src={section.image} alt={section.imageCaption || section.heading || ""} />
                    {section.imageCaption && (
                      <figcaption className="mt-2 font-sans text-[12px] text-[#4A463F]">
                        {section.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}

            {specs.length > 0 && (
              <section id="specs" className="mb-12 scroll-mt-28">
                <SectionHeading>Specifications</SectionHeading>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse font-sans text-[13px]">
                    <tbody>
                      {specs.map((spec, i) => (
                        <tr
                          key={i}
                          className={i !== specs.length - 1 ? "border-b border-[#DDD6C7]" : ""}
                        >
                          <td className="py-4 pr-4 font-medium text-[#1C1A17]">
                            {spec.label}
                          </td>
                          <td className="py-4 text-[#4A463F]">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {faqs.length > 0 && (
              <section id="faqs" className="mb-12 scroll-mt-28">
                <SectionHeading>FAQs</SectionHeading>
                <div className="mt-4">
                  {faqs.map((item, i) => (
                    <FaqItem
                      key={i}
                      item={item}
                      isOpen={openFaq === i}
                      onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>

        {/* CTA banner */}
        {post.cta?.text && (
          <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-[#1C1A17] bg-[#1C1A17] p-8 text-[#F7F4EC] md:flex-row md:items-center md:p-10">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#A8823F]">
                Otulia
              </p>
              <p className="mt-3 max-w-md font-display text-[22px] leading-snug md:text-[24px]">
                {post.cta.text}
              </p>
            </div>
            {post.cta.buttonLabel && (
              <a
                href={post.cta.url || "#"}
                className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
              >
                {post.cta.buttonLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Fetches a published post by slug; used by JournalArticlePage as a fallback
// when the slug is not one of the hardcoded articles.
export default function CmsArticle({ slug }) {
  const [state, setState] = useState({ loading: true, post: null });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, post: null });
    fetch(`/api/blog/post/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((post) => !cancelled && setState({ loading: false, post }))
      .catch(() => !cancelled && setState({ loading: false, post: null }));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading) return <div className="min-h-screen w-full bg-white" />;
  if (!state.post) return <NotFound />;

  const { post } = state;
  return (
    <>
      <SEO
        title={`${post.title} | Otulia Journal`}
        description={post.excerpt}
        image={post.heroImage}
        type="article"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Journal", path: "/journal" },
          { label: post.title, path: `/journal/${post.slug}` },
        ]}
      />
      <CmsArticleView post={post} />
    </>
  );
}
