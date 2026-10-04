"use server";

import { revalidateTag } from "next/cache";

import {
  CreateReviewSchema,
  type CreateReviewInput,
} from "@/lib/validations/review";

/**
 * Guest review submission — spec.md §4.B (frozen mutation).
 * Goes through WPGraphQL createComment; the WordPress side hook persists
 * reviewRatings into comment_meta.
 */
const CREATE_GUEST_REVIEW = `
  mutation CreateGuestReview(
    $commentOn: Int!
    $content: String!
    $author: String!
    $authorEmail: String!
    $reviewRatings: ReviewRatingsInput
  ) {
    createComment(
      input: {
        commentOn: $commentOn
        content: $content
        author: $author
        authorEmail: $authorEmail
        reviewRatings: $reviewRatings
      }
    ) {
      success
      comment {
        id
        databaseId
        date
        content(format: RAW)
        author {
          node {
            name
            email
          }
        }
        reviewRatings {
          accommodationRating
          mealsRating
          overallRating
          transportRating
          valueForMoneyRating
        }
        status
      }
    }
  }
`;

type CreateCommentResponse = {
  data?: {
    createComment?: {
      success?: boolean;
      comment?: { status?: string } | null;
    };
  };
  errors?: Array<{ message: string }>;
};

export type SubmitReviewResult =
  | { ok: true; status: string }
  | { ok: false; message: string };

/**
 * Validate, persist, revalidate. `saveInfo` is stripped here — it is a
 * client-only concern (localStorage) and never reaches WordPress.
 * No optimistic prepend: only an APPROVE status surfaces immediately;
 * HOLD shows the pending-approval banner (design §5.6).
 */
export async function submitReview(
  payload: unknown,
): Promise<SubmitReviewResult> {
  const parsed = CreateReviewSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid submission.",
    };
  }

  const { commentOn, content, author, authorEmail, reviewRatings } =
    parsed.data satisfies CreateReviewInput;

  const graphqlEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!graphqlEndpoint) {
    return { ok: false, message: "Reviews are temporarily unavailable." };
  }

  try {
    const res = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: CREATE_GUEST_REVIEW,
        variables: { commentOn, content, author, authorEmail, reviewRatings },
      }),
    });

    const json = (await res.json()) as CreateCommentResponse;

    // WPGraphQL returns HTTP 200 even for field errors — inspect errors[].
    if (json.errors?.length) {
      return { ok: false, message: json.errors[0].message };
    }

    const result = json.data?.createComment;
    if (!result?.success) {
      return {
        ok: false,
        message: "The review could not be saved. Please try again.",
      };
    }

    // Next 16: revalidateTag requires a second cacheLife profile argument.
    revalidateTag(`trip:${commentOn}:reviews`, "minutes");

    return { ok: true, status: result.comment?.status ?? "HOLD" };
  } catch {
    return {
      ok: false,
      message: "Network error submitting the review. Please try again.",
    };
  }
}