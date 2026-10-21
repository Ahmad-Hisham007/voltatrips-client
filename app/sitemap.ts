import { MetadataRoute } from "next";

// Env-driven URLs — no hardcoded literals in production builds.
const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL;
const WP_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

interface ContentNode {
  uri: string;
  modifiedGmt?: string;
}
interface TaxNode {
  connectedTerms: {
    nodes: {
      uri: string;
    }[];
  };
}

interface TermNode {
  uri: string;
}

/**
 * Sanitize URIs returned from WPGraphQL.
 * Strips both the frontend domain and the backend (CMS) domain
 * so every entry is a clean relative path with leading + trailing slash.
 */
function cleanUri(uri: string): string {
  if (!uri) return "/";
  let clean = uri;

  if (FRONTEND_URL) {
    clean = clean.replace(FRONTEND_URL, "");
  }
  clean = clean
    .replace("https://cms.voltatrips.com", "")
    .replace("https://voltatrips.com", "");

  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }
  if (!clean.endsWith("/")) {
    clean = clean + "/";
  }
  return clean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!FRONTEND_URL || !WP_GRAPHQL_URL) {
    console.warn(
      "sitemap: NEXT_PUBLIC_SITE_URL or WORDPRESS_GRAPHQL_ENDPOINT not set — returning empty sitemap",
    );
    return [];
  }

  const query = `
    query GetAllSitemapNodes {
      contentNodes(where: {stati: PUBLISH}, first: 1000) {
        nodes {
          uri
          modifiedGmt
        }
      }
      taxonomies {
        nodes {
          connectedTerms {
            nodes {
              uri
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    const { data } = await res.json() as {
      data?: {
        contentNodes?: { nodes: ContentNode[] };
        taxonomies?: { nodes: TaxNode[] };
      };
    };

    const urlMap = new Map<string, string>(); // To prevent duplicate URLs

    // 1. Process Content Nodes (Posts, Pages, Trips)
    const contentNodes: ContentNode[] = data?.contentNodes?.nodes || [];
    contentNodes.forEach((node) => {
      if (node.uri) {
        const relativePath = cleanUri(node.uri);
        const fullUrl = `${FRONTEND_URL}${relativePath}`;
        const lastMod = node.modifiedGmt
          ? node.modifiedGmt
          : new Date().toISOString();
        urlMap.set(fullUrl, lastMod);
      }
    });

    // 2. Process Connected Taxonomy Terms (Categories, Trip Categories, etc.)
    const taxNodes = data?.taxonomies?.nodes || [];
    taxNodes.forEach((tax: TaxNode) => {
      const terms: TermNode[] = tax?.connectedTerms?.nodes || [];
      terms.forEach((term) => {
        if (term.uri) {
          const relativePath = cleanUri(term.uri);
          const fullUrl = `${FRONTEND_URL}${relativePath}`;
          if (!urlMap.has(fullUrl)) {
            urlMap.set(fullUrl, new Date().toISOString());
          }
        }
      });
    });

    // 3. Construct Final Sitemap Array
    const sitemapEntries: MetadataRoute.Sitemap = [];
    urlMap.forEach((lastMod, url) => {
      sitemapEntries.push({
        url,
        lastModified: new Date(lastMod),
        changeFrequency: url === `${FRONTEND_URL}/` ? "daily" : "weekly",
        priority: url === `${FRONTEND_URL}/` ? 1.0 : 0.8,
      });
    });

    return sitemapEntries;
  } catch (error) {
    console.error("Error generating dynamic Next.js sitemap:", error);
    return [];
  }
}
