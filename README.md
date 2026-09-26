# Voltatrips Client

A fast, headless Next.js front-end for the Voltatrips tourism & booking platform. The store is managed in WordPress (WPGraphQL + WooCommerce); this repository is responsible for the customer-facing web application.

## Features

- Dynamic homepage with hero search (destination, dates, guest count, category filter), featured trips & deals, category showcase, testimonials, and a media banner.
- Trip catalog with live filtering, sorting, and real-time availability badges.
- Detailed trip pages with an itinerary timeline, media gallery, sticky booking widget (dynamic pricing, add-ons), included/excluded breakdown, map, and reviews.
- Headless checkout wired to WooCommerce, with a customer dashboard for bookings and account settings.

## Tech stack

| Layer | Tool |
| ----- | ---- |
| Framework | Next.js 16.3.6 (App Router, Turbopack, RSC-first) |
| Runtime | Node.js 20.9+ |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Backend | WordPress + WPGraphQL + WooCommerce GraphQL |
| Auth | Custom `jose` httpOnly cookie session (no NextAuth) |
| Routing guard | `proxy.ts` (Next 16 replacement for `middleware.ts`) |
| Package manager | npm |

> **Note on routing guard:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`. The `proxy` runtime is fixed to `nodejs`; if an `edge` runtime is ever needed, keep a `middleware.ts`.

## Getting started

```bash
# install dependencies
npm ci          # or `npm install`

# create .env.local (see Configuration below)
cp .env.example .env.local

# run the dev server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

| Variable | Public | Description |
| -------- | ------ | ----------- |
| `NEXT_PUBLIC_WORDPRESS_URL` | ✅ | Base URL of the WordPress site. |
| `WORDPRESS_GRAPHQL_ENDPOINT` | ❌ | Full WPGraphQL endpoint URL. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical site URL. |
| `WORDPRESS_APP_USERNAME` | ❌ | WordPress application username (for mutations). |
| `WORDPRESS_APP_PASSWORD_HASH` | ❌ | WordPress application password hash. |
| `NEXTAUTH_SECRET` | ❌ | Secret used by `jose` to encrypt the session cookie. |
| `JWT_SECRET` | ❌ | Additional signing secret for session tokens. |

> All `.env*` files are ignored by git. Prefix browser-exposed values with `NEXT_PUBLIC_`.

## Build & deploy

```bash
npm run build     # production build (Turbopack)
npm run start     # start the production server
```

## Scripts

| Script | Command |
| ------ | ------- |
| dev | `next dev -p 3001` |
| build | `next build` |
| start | `next start` |
| lint | `eslint` (flat config; `next lint` was removed in Next.js 16) |

## Project structure

```
voltatrips-client/
├── app/                  # App Router (layout, pages, routes)
├── public/               # Static assets
├── .opencode/spec/       # Docs: implementation plan & product spec
├── AGENTS.md             # Guidance for AI agent sessions
├── next.config.ts        # Next.js configuration
├── tsconfig.json
├── package.json
└── .env.example
```

## Documentation for agents

AI-coding agents should read **`AGENTS.md`** before working in this repo — it contains the commands, path aliases, the Next.js 16 breaking changes, and the auth/RBAC approach. The implementation plan and product spec live in [`.opencode/spec/`](./.opencode/spec).

## Backend requirements (for deployers)

WordPress plugins required on the backend:

- [WPGraphQL](https://www.wpgraphql.com/)
- [WooCommerce GraphQL](https://github.com/wp-graph-ql/wp-graphql-woocommerce)
- [Rank Math GraphQL](https://github.com/RankMath/Rank-Math-Headless-CMS)
- [`axepress/wp-graphql-headless-login`](https://github.com/axepress/wp-graphql-headless-login)

## License

Private — all rights reserved.
