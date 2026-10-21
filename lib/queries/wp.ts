/**
 * Headless WordPress data layer (shared fetchers).
 * Uses plain fetch to WPGraphQL — no Apollo, no Faust.js.
 *
 * Next.js automatically deduplicates identical fetch calls within a single
 * RSC render pass, so generateMetadata + page can both call fetchNodeByUri
 * for the same URI and incur only one network round-trip.
 */

/** Rank Math SEO block returned on Page, Post, and Trip nodes. */
export type WpSeo = {
  title?: string | null;
  robots?: { noindex?: boolean; nofollow?: boolean } | null;
  canonicalUrl?: string | null;
  canonical?: string | null; // fallback for backends using `canonical`
  description?: string | null;
  fullHead?: string | null;
  openGraph?: {
    description?: string | null;
    image?: { url?: string | null; width?: number | null; height?: number | null } | null;
    siteName?: string | null;
    title?: string | null;
    type?: string | null;
  } | null;
};

/**
 * Union-like node shape returned by nodeByUri.
 * __typename discriminates the concrete type at render time.
 */
export type WpNode = {
  __typename: string;
  uri: string;
  seo?: WpSeo | null;
  title?: string | null;
  content?: string | null;
  name?: string | null;
  description?: string | null;
  databaseId?: number | null;
  id?: string | null;
  tripFields?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Fetch a content node dynamically by relative URI.
 * @param uri  relative path with leading/trailing slashes, e.g. "/trips/speedboat-in-hurghada/"
 * @param cacheLifeSeconds  revalidation window (default 3600)
 * @returns the nodeByUri object or null if not found
 */
export async function fetchNodeByUri(
  uri: string,
  cacheLifeSeconds = 3600,
): Promise<WpNode | null> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!endpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT not set");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: GET_NODE_BY_URI, variables: { uri } }),
    next: { revalidate: cacheLifeSeconds, tags: [`wpnode:${uri}`] },
  });

  if (!res.ok) throw new Error(`WPGraphQL error: ${res.status}`);

  const json = (await res.json()) as {
    data?: { nodeByUri?: WpNode | null };
    errors?: unknown[];
  };

  if (json.errors?.length) {
    console.error("WPGraphQL errors:", json.errors);
    return null;
  }

  return json.data?.nodeByUri ?? null;
}

/**
 * GetNodeByUri — fetches any content node by relative URI.
 * Fragments: Page, Post, Category, TripCategory, Trip (with full Rank Math SEO).
 */
export const GET_NODE_BY_URI = `
query GetNodeByUri($uri: String!) {
  nodeByUri(uri: $uri) {
    __typename
    ... on Page {
      title
      content
      uri
      seo {
        title
        robots
        canonicalUrl
        description
        fullHead
        openGraph {
          description
          image { url width height }
          siteName
          title
          type
        }
      }
    }
    ... on Post {
      title
      content
      uri
      seo {
        title
        robots
        canonicalUrl
        description
        fullHead
        openGraph {
          description
          image { url width height }
          siteName
          title
          type
        }
      }
    }
    ... on Category {
      name
      description
      uri
    }
    ... on TripCategory {
      name
      description
      uri
    }
    ... on Trip {
      title
      uri
      seo {
        title
        robots
        canonicalUrl
        description
        fullHead
        openGraph {
          description
          image { url width height }
          siteName
          title
          type
        }
      }
      tripFields {
        departure
        departureTime
        dressCode
        tripAgeRequirement
        tripDuration
        tripLocation
        tripLocationSubtitle
        tripLocationDescription
        tripPrice
        tripSku
        tripDetails {
          detailsList { label value }
          tripFullDescription
          tripShortDescription
          whatsIncluded { item }
          whatsNotIncluded { item }
        }
        tripItinerary {
          day
          title
          content
          icon
        }
        tripGallery {
          nodes {
            link
            title(format: RENDERED)
          }
        }
      }
    }
  }
}
`;
