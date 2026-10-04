/**
 * Reviews tab data contracts.
 * Mirrors spec.md §5 (frozen). Server-importable — no "use client".
 */

export interface ReviewRatings {
  accommodationRating: number;
  mealsRating: number;
  overallRating: number;
  transportRating: number;
  valueForMoneyRating: number;
}

export interface ReviewCommentNode {
  id: string;
  databaseId: number;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      email: string;
      avatar?: {
        url: string;
      };
    };
  };
  reviewRatings: ReviewRatings;
}

export interface TripReviewSummaryData {
  averageRating: number;
  ratingLabel: string;
  count: number;
  breakdown: {
    accommodation: number;
    meals: number;
    overall: number;
    transport: number;
    valueForMoney: number;
  };
}

/**
 * Canonical criteria order, shared by the summary bars, the per-review
 * star grid and the submission form so the three never drift (design §7).
 * `key` indexes TripReviewSummaryData["breakdown"];
 * `ratingKey` indexes ReviewRatings.
 */
export const REVIEW_CRITERIA = [
  {
    key: "accommodation",
    ratingKey: "accommodationRating",
    label: "Accommodation",
  },
  { key: "meals", ratingKey: "mealsRating", label: "Meals" },
  { key: "overall", ratingKey: "overallRating", label: "Overall" },
  { key: "transport", ratingKey: "transportRating", label: "Transport" },
  {
    key: "valueForMoney",
    ratingKey: "valueForMoneyRating",
    label: "Value for Money",
  },
] as const;
