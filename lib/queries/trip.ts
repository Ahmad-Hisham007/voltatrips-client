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
  };
};

export type Trip = NonNullable<TripQuery["trip"]>;

/**
 * Fetch a single trip by database ID with optional cache life.
 * Returns typed data for the trip detail page.
 */
export async function fetchTrip(
  id: number,
  cacheLifeSeconds = 300,
): Promise<Trip | null> {
  const graphqlEndpoint = process.env.WORDPRESS_GRAPHQL_ENDPOINT;
  if (!graphqlEndpoint) throw new Error("WORDPRESS_GRAPHQL_ENDPOINT not set");

  const query = `
    query MyQuery($id: ID = "") {
      trip(id: $id, idType: DATABASE_ID) {
        title
        slug
        id
        databaseId
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
    body: JSON.stringify({ query, variables: { id: String(id) } }),
    next: { revalidate: cacheLifeSeconds, tags: [`trip:${id}`] },
  });

  if (!res.ok) throw new Error(`WPGraphQL error: ${res.status}`);

  const json = (await res.json()) as { data?: { trip?: TripQuery["trip"] } };
  return json.data?.trip ?? null;
}
