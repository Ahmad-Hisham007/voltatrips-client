import type { ReviewCommentNode, TripReviewSummaryData } from "@/types/review";

/**
 * Reviews data layer — plain fetch to WPGraphQL (no Apollo / no React Query).
 * Caching via Next.js `revalidate` + cache tags, mirroring lib/queries/trip.ts.
 */

type GetTripWithReviewsResponse = {
  data?: {
    trip?: {
      id: string;
      databaseId: number;
      title: string;
      comments: {
        nodes: Array<ReviewCommentNode>;
      };
    };
  };
};

const GET_TRIP_WITH_REVIEWS = `
  query GetTripWithReviews($id: ID = "31") {
    trip(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      title
      comments(where: { orderby: COMMENT_DATE, order: DESC }) {
        nodes {
          id
          databaseId
          content(format: RAW)
          date
          author {
            node {
              name
              email
              avatar {
                url
              }
            }
          }
          reviewRatings {
            accommodationRating
            mealsRating
            overallRating
            transportRating
            valueForMoneyRating
          }
        }
      }
    }
  }
`;

/**
 * Fetch a trip's review comments (newest first).
 * WPGraphQL exposes only approved comments to public queries, so the
 * returned nodes are already the approved set.
 */
export async function fetchTripReviews(
  id: number,
  cacheLifeSeconds = 300,
): Promise<ReviewCommentNode[]> {
  const graphqlEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!graphqlEndpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT not set");

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: GET_TRIP_WITH_REVIEWS, variables: { id: String(id) } }),
    next: { revalidate: cacheLifeSeconds, tags: [`trip:${id}:reviews`] },
  });

  if (!res.ok) throw new Error(`WPGraphQL error: ${res.status}`);

  const json = (await res.json()) as GetTripWithReviewsResponse;
  return json.data?.trip?.comments?.nodes ?? [];
}

/** Map a 1–10 score to its label — spec.md §6 formula 4. */
function ratingLabelFor(score: number): string {
  if (score < 5) return "Average";
  if (score < 7) return "Good";
  if (score < 8.5) return "Very Good";
  return "Superb";
}

/**
 * Derive the aggregate summary from approved comments.
 * Pure, server-side — the client never recomputes averages (design §7).
 * Formulas: spec.md §6 (category average = mean × 2 → 1–10; overall = mean
 * of the five category averages).
 */
export function buildReviewSummary(
  comments: ReviewCommentNode[],
): TripReviewSummaryData {
  if (comments.length === 0) {
    return {
      averageRating: 0,
      ratingLabel: "No reviews yet",
      count: 0,
      breakdown: {
        accommodation: 0,
        meals: 0,
        overall: 0,
        transport: 0,
        valueForMoney: 0,
      },
    };
  }

  const n = comments.length;
  const sum = {
    accommodation: 0,
    meals: 0,
    overall: 0,
    transport: 0,
    valueForMoney: 0,
  };

  for (const comment of comments) {
    const r = comment.reviewRatings;
    sum.accommodation += r.accommodationRating;
    sum.meals += r.mealsRating;
    sum.overall += r.overallRating;
    sum.transport += r.transportRating;
    sum.valueForMoney += r.valueForMoneyRating;
  }

  const breakdown = {
    accommodation: (sum.accommodation / n) * 2,
    meals: (sum.meals / n) * 2,
    overall: (sum.overall / n) * 2,
    transport: (sum.transport / n) * 2,
    valueForMoney: (sum.valueForMoney / n) * 2,
  };

  const averageRating =
    (breakdown.accommodation +
      breakdown.meals +
      breakdown.overall +
      breakdown.transport +
      breakdown.valueForMoney) /
    5;

  return {
    averageRating,
    ratingLabel: ratingLabelFor(averageRating),
    count: n,
    breakdown,
  };
}