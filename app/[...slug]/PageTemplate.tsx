import type { WpNode } from "@/lib/queries/wp";

/**
 * Renders a WordPress Page via the catch-all route.
 * Gutenberg HTML is served from WPGraphQL `content` and rendered as-is.
 */
export default function PageTemplate({ node }: { node: WpNode }) {
  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-heading text-4xl font-display mb-6">
        {node.title || "Page"}
      </h1>

      {node.content ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: node.content }}
        />
      ) : node.description ? (
        <p className="text-body">{node.description}</p>
      ) : (
        <p className="text-muted">No content available.</p>
      )}
    </article>
  );
}
