export type TripImageNode = {
  id: string;
  slug: string;
  mediaItemUrl: string;
  mediaDetails: {
    file: string;
    filePath: string;
    width: number;
    height: number;
  };
};

export type TripItineraryItem = {
  content: string;
  day: number;
  icon: Array<string>;
  title: string;
};

export type TripDetails = {
  tripFullDescription: string;
  tripShortDescription: string;
  whatsIncluded: Array<{ item: string }>;
  whatsNotIncluded: Array<{ item: string }>;
  detailsList: Array<{ label: string; value: string }>;
};

export type TripFields = {
  departure: string;
  departureTime: string;
  dressCode: string;
  tripAgeRequirement: string;
  tripDetails: TripDetails;
  tripDuration: number;
  tripGallery: {
    nodes: Array<TripImageNode>;
  };
  tripItinerary: Array<TripItineraryItem>;
  tripLocation: string;
  tripLocationSubtitle: string;
  tripLocationDescription: string;
  tripPrice: number;
  tripSku: string;
};

export type TripQuery = {
  trip: {
    title: string;
    slug: string;
    id: string;
    databaseId: number;
    tripFields: TripFields;
    content?: string | TrustedHTML | undefined;
  };
};

export type Trip = NonNullable<TripQuery["trip"]>;

/**
 * Fetch a single trip by database ID with optional cache life.
 * Returns typed data for the trip detail page.
 */
export async function fetchTrip(
  slug: string,
  cacheLifeSeconds = 300,
): Promise<Trip | null> {
  const graphqlEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!graphqlEndpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT not set");

  const query = `
    query MyQuery($id: ID = "") {
      trip(id: $id, idType: SLUG) {
        title
        slug
        id
        databaseId
        content(format: RENDERED)
        tripFields {
          departure
          departureTime
          dressCode
          tripAgeRequirement
          tripDetails {
            tripFullDescription
            tripShortDescription
            whatsIncluded {
              item
            }
            whatsNotIncluded {
              item
            }
            detailsList {
              label
              value
            }
          }
          tripDuration
          tripGallery {
            nodes {
              mediaDetails {
                file
                filePath
                width
                height
              }
            }
          }
          tripItinerary {
            content
            day
            icon
            title
          }
          tripLocation
          tripLocationDescription
          tripLocationSubtitle
          tripPrice
          tripSku
        }
      }
    }
  `;

  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { id: String(slug) } }),
    next: { revalidate: cacheLifeSeconds, tags: [`trip:${slug}`] },
  });

  if (!res.ok) throw new Error(`WPGraphQL error: ${res.status}`);

  const json = (await res.json()) as { data?: { trip?: TripQuery["trip"] } };
  console.log(json.data?.trip);
  return json.data?.trip ?? null;
}
