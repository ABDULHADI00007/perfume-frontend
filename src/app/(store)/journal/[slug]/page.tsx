import { notFound } from "next/navigation";
import { constructMetadata } from "@/lib/seo/metadata";
import { generateArticleJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { journalService } from "@/features/journal/services/journalService";
import { ArticleDetailView } from "@/features/journal/components/ArticleDetailView";
import { BlogPostSummary } from "@/features/journal/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const res = await journalService.getPublishedPostBySlug(slug);
    if (!res.success || !res.data) {
      return constructMetadata({
        title: "Article Not Found",
        noIndex: true,
      });
    }

    const post = res.data;
    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt || post.title;
    const image = post.featuredImage?.url || siteConfig.ogImage;
    const canonical = post.seo?.canonicalUrl || `/journal/${post.slug}`;

    return constructMetadata({
      title,
      description,
      image,
      canonical,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
      authors: post.author?.name ? [post.author.name] : [siteConfig.name],
    });
  } catch {
    return constructMetadata({
      title: "Journal Article",
      canonical: `/journal/${slug}`,
    });
  }
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    const res = await journalService.getPublishedPostBySlug(slug);
    if (!res.success || !res.data || res.data.status !== "published") {
      notFound();
    }
    post = res.data;
  } catch {
    notFound();
  }

  // Fetch related articles (by same category if present, or general latest posts)
  let relatedPosts: BlogPostSummary[] = [];
  try {
    const relatedRes = await journalService.getPublishedPosts({
      category: post.category || undefined,
      limit: 4,
    });
    if (relatedRes.success && relatedRes.data) {
      relatedPosts = relatedRes.data.filter((p) => p.slug !== post.slug).slice(0, 3);
    }
  } catch {
    // If related posts fail, proceed without breaking main article
  }

  // Build Article JSON-LD Structured Data
  const jsonLd = generateArticleJsonLd({
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage?.url,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    authorName: post.author?.name,
    url: `${siteConfig.url}/journal/${post.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticleDetailView post={post} relatedPosts={relatedPosts} />
    </>
  );
}
