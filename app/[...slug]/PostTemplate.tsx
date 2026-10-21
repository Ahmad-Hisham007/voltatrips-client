import PageTemplate from "./PageTemplate";

/**
 * Renders a WordPress Post via the catch-all route.
 * The Post fragment in GetNodeByUri is identical to Page (no author/date
 * yet), so we delegate to PageTemplate. Extend here if the WP schema
 * adds post-specific fields later.
 */
export default PageTemplate;
