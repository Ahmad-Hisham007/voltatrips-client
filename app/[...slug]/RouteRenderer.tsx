import { notFound } from "next/navigation";
import TripLayout from "./TripLayout";
import PageTemplate from "./PageTemplate";
import PostTemplate from "./PostTemplate";
import TaxonomyArchiveTemplate from "./TaxonomyArchiveTemplate";
import type { WpNode } from "@/lib/queries/wp";

/**
 * Dispatches to the correct template/layout based on node.__typename.
 * Handles Page, Post, Category, TripCategory, and Trip content types.
 * Any unknown typename falls through to Next.js notFound().
 */
export function RouteRenderer({ node }: { node: WpNode }) {
  switch (node.__typename) {
    case "Trip":
      return <TripLayout node={node} />;
    case "Category":
    case "TripCategory":
      return <TaxonomyArchiveTemplate node={node} />;
    case "Page":
      return <PageTemplate node={node} />;
    case "Post":
      return <PostTemplate node={node} />;
    default:
      notFound();
  }
}
