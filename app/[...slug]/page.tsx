import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchNodeByUri } from "@/lib/queries/wp";
import { RouteRenderer } from "./RouteRenderer";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Dynamic catch-all route for the headless WordPress frontend.
 * Resolves any URI via nodeByUri and dispatches to the appropriate template
 * (Trip, Page, Post, Category, TripCategory) based on __typename.
 *
 * Replaces the old /trips/[slug]/page.tsx (Phase 1 hardcoded ID 31).
 * Now all dynamic routes — /trips/<slug>, /<page-slug>, /category/<term>, etc.
 * — flow through this single entry point.
 *
 * Next.js automatic fetch dedup guarantees generateMetadata and the page
 * render share a single network call to WPGraphQL for the same URI.
 */

/**
 * Builds SEO metadata from the WP node's Rank Math fields.
 * Rewrites backend URLs (cms.voltatrips.com) to the frontend domain.
 * Falls back to the route URL if no Rank Math canonical is present.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug ? slug.join("/") : "";
  const uri = `/${slugPath}/`;

  const node = await fetchNodeByUri(uri);
  if (!node) return {};

  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!frontendUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL not set — returning minimal metadata");
    return { title: node.seo?.title || node.title || node.name || "Voltatrips" };
  }

  // Canonical: prefer seo.canonicalUrl, fallback to seo.canonical
  let canonical = `${frontendUrl}${uri}`;
  const seoCanonical = node.seo?.canonicalUrl || node.seo?.canonical;
  if (seoCanonical) {
    canonical = seoCanonical.replace(
      "https://cms.voltatrips.com",
      frontendUrl,
    );
  }

  // OpenGraph image URL rewrite
  const ogImage = node.seo?.openGraph?.image?.url
    ? {
        url: node.seo.openGraph.image.url.replace(
          "https://cms.voltatrips.com",
          frontendUrl,
        ),
        width: node.seo?.openGraph?.image?.width ?? undefined,
        height: node.seo?.openGraph?.image?.height ?? undefined,
      }
    : undefined;

  return {
    title: node.seo?.title || node.title || node.name || "Voltatrips",
    description: node.seo?.description || "",
    robots: node.seo?.robots
      ? {
          // Next.js 16 uses `index`/`follow` (noindex/nofollow are deprecated → `never`)
          ...(node.seo.robots.noindex !== undefined
            ? { index: !node.seo.robots.noindex }
            : {}),
          ...(node.seo.robots.nofollow !== undefined
            ? { follow: !node.seo.robots.nofollow }
            : {}),
        }
      : undefined,
    alternates: { canonical },
    openGraph: {
      title: node.seo?.openGraph?.title || node.seo?.title || undefined,
      description:
        node.seo?.openGraph?.description || node.seo?.description || undefined,
      siteName: node.seo?.openGraph?.siteName || undefined,
      type: node.seo?.openGraph?.type as
        | "website"
        | "article"
        | "book"
        | "profile"
        | "music.song"
        | "music.album"
        | "music.playlist"
        | "music.radio_station"
        | "video.movie"
        | "video.episode"
        | "video.tv_show"
        | "video.other"
        | undefined,
      images: ogImage
        ? [{ url: ogImage.url, width: ogImage.width, height: ogImage.height }]
        : undefined,
    },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const slugPath = slug ? slug.join("/") : "";
  const uri = `/${slugPath}/`;

  const node = await fetchNodeByUri(uri);
  if (!node) notFound();

  return <RouteRenderer node={node} />;
}
