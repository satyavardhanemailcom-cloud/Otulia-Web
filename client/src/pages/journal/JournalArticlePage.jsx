// pages/JournalArticlePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { journalArticles } from "../../data/journalArticles";
import SEO from "../../components/SEO";
import CmsArticle from "../../components/journal/cms/CmsArticle";
import JournalArticleFooter from "../../components/journal/JournalArticleFooter";

function JournalArticlePage() {
  const { slug } = useParams();
  const article = Object.prototype.hasOwnProperty.call(journalArticles, slug)
    ? journalArticles[slug]
    : null;

  if (!article) return <CmsArticle slug={slug} />;

  const ArticleContent = article.component;
  return (
    <>
      <SEO
        title={`${article.title} | Otulia Journal`}
        description={article.description}
        type="article"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Journal", path: "/journal" },
          { label: article.title, path: `/journal/${slug}` },
        ]}
      />
      <ArticleContent />
      <JournalArticleFooter slug={slug} />
    </>
  );
}

export default JournalArticlePage;
