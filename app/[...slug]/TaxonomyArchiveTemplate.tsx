import type { WpNode } from "@/lib/queries/wp";

/**
 * Renders a taxonomy archive page (Category or TripCategory).
 * Shows the term name + description. A future phase can list
 * child terms or posts belonging to this term.
 */
export default function TaxonomyArchiveTemplate({ node }: { node: WpNode }) {
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-heading text-4xl font-display mb-6">
        {node.name || "Archive"}
      </h1>

      {node.description ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: node.description }}
        />
      ) : (
        <p className="text-muted">No description available.</p>
      )}
    </article>
  );
}
