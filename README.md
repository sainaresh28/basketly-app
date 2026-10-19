# Basketly — Full-Stack E-Commerce Platform

Basketly is a production-style e-commerce storefront built as a Software Engineering
internship project. It goes beyond a static UI: it has a real backend, a designed
database schema on AWS DynamoDB, authenticated sessions, and business logic for
cart/wishlist management, all wired into a modern Next.js frontend.

> **Live demo:** [https://basketly-app.vercel.app]
> **Repository:** [https://github.com/sainaresh28/basketly-app]

---

## 1. Project Overview

Basketly lets shoppers discover products across categories, search and filter the
catalog, view rich product detail pages, manage a persistent shopping cart and
wishlist, and create an account. Every read/write of application data goes through
a proper API layer backed by AWS DynamoDB — nothing important is hardcoded or kept
only in the browser.

## 2. Features

**Storefront**
- Responsive homepage with hero, trending products, new arrivals, promotions
- Category browsing, full product listing with search/filter/sort
- Product detail pages with gallery, specs, and related products
- 404 / not-found handling, loading and empty states throughout

**Accounts**
- Email/password registration and login (passwords hashed with bcrypt)
- Signed, httpOnly-cookie sessions (JWT) — no tokens exposed to client JS
- `/account` shows the signed-in user's profile and activity summary

**Cart & Wishlist**
- Add to cart, update quantity, remove items, clear cart
- Duplicate-prevention (adding an item twice increases quantity instead of
  creating a second line item)
- Stock-aware quantity capping (you can never add more than what's in stock)
- Live subtotal / shipping / total, computed server-side from current product
  data (never stale, even if a price changed after the item was added)
- Guest shopping works instantly via local storage; on login, the guest cart
  and wishlist are automatically merged into the user's account

**Checkout & Payments**
- Real payment processing via Razorpay (test mode — no real money moves)
- Server-verified payment signatures; stock and order creation happen in a
  single atomic DynamoDB transaction, so a sold-out item can never leave you
  with a half-charged order
- Order history and order confirmation pages

**Admin Dashboard** (`/admin`, role-protected)
- Overview: revenue, order count, low/out-of-stock alerts, a 7-day revenue chart
- Product management: create, edit, delete, and adjust stock — no code required
- Order management: view every order, filter by status, update status

**Engineering**
- Clean separation of UI, business logic, API layer and data access
- Centralized error handling with typed application errors
- Zod validation on every write endpoint
- Environment-based configuration, no hardcoded secrets

## 3. Tech Stack

| Layer          | Choice                                                        |
|----------------|-----------------------------------------------------------------|
| Frontend       | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS   |
| Client state   | Zustand (optimistic cart/wishlist UI + local guest persistence) |
| Backend        | Next.js Route Handlers (`/api/*`)                              |
| Database       | AWS DynamoDB                                                    |
| Payments       | Razorpay (test mode)                                            |
| Auth           | bcryptjs (password hashing) + `jose` (JWT session cookies)     |
| Validation     | Zod                                                             |
| Tooling        | ESLint, Prettier, ts-node (seed/setup scripts)                 |

## 4. Project Structure

```
basketly-three/
├── scripts/
│   ├── create-tables.ts       # Provisions DynamoDB tables + indexes
│   ├── seed.ts                 # Seeds Products/Categories from mock catalog
│   └── make-admin.ts            # One-time CLI to promote a user to admin
├── src/
│   ├── app/
│   │   ├── api/                        # ---- Server / API layer ----
│   │   │   ├── auth/{register,login,logout,me}/route.ts
│   │   │   ├── products/route.ts       # GET list (search/filter/sort)
│   │   │   ├── products/[idOrSlug]/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── cart/route.ts           # GET/POST/DELETE
│   │   │   ├── cart/[productId]/route.ts  # PATCH quantity / DELETE item
│   │   │   ├── cart/merge/route.ts     # merge guest cart on login
│   │   │   ├── wishlist/route.ts
│   │   │   ├── wishlist/[productId]/route.ts
│   │   │   ├── wishlist/merge/route.ts
│   │   │   ├── checkout/create-order/route.ts · checkout/verify/route.ts
│   │   │   ├── orders/route.ts · orders/[id]/route.ts
│   │   │   └── admin/{products,orders,stats}/**
│   │   ├── admin/                          # role-protected dashboard
│   │   │   ├── layout.tsx, page.tsx (overview)
│   │   │   ├── products/ (list, new, [id]/edit)
│   │   │   └── orders/
│   │   ├── checkout/ · orders/[id]/                # checkout + order pages
│   │   ├── account/ · login/ · register/ · cart/ · wishlist/
│   │   ├── products/ · product-detail/     # pages (Server Components)
│   │   ├── layout.tsx, page.tsx, sitemap.ts, robots.ts, not-found.tsx
│   │   └── components/                     # homepage sections
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, CartDrawer, MobileBottomNav...
│   │   └── ui/              # AppImage, AppIcon, AppLogo
│   ├── lib/
│   │   ├── db/              # DynamoDB client + table/index name config
│   │   ├── repositories/    # ---- Data access layer (raw DynamoDB) ----
│   │   │   ├── user.repository.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── category.repository.ts
│   │   │   ├── cart.repository.ts
│   │   │   ├── wishlist.repository.ts
│   │   │   └── order.repository.ts
│   │   ├── services/        # ---- Business logic layer ----
│   │   │   ├── auth.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── cart.service.ts
│   │   │   ├── wishlist.service.ts
│   │   │   └── order.service.ts
│   │   ├── payments/         # Razorpay order creation + signature verification
│   │   ├── auth/            # password hashing, JWT session, route guards
│   │   ├── errors/          # AppError hierarchy + API error handler
│   │   ├── validation/      # Zod schemas for every write endpoint
│   │   ├── cart-store.ts, wishlist-store.ts   # Zustand (client UI state)
│   │   ├── auth-context.tsx                    # React auth/session context
│   │   ├── config.ts                            # shared business constants
│   │   └── mock-data.ts                         # seed source data only
│   ├── types/index.ts        # Shared TypeScript interfaces
│   └── utils/format.ts
├── .env.example
└── package.json
```

## 5. Architecture

```
 Browser (React Client Components)
      │  fetch()
      ▼
 Next.js Route Handlers  (src/app/api/**)          ── validates input (Zod)
      │                                              ── enforces auth (session cookie)
      ▼
 Service layer (src/lib/services/**)                ── business rules:
      │                                                 stock limits, duplicate
      │                                                 prevention, price/shipping
      │                                                 calculation, password hashing
      ▼
 Repository layer (src/lib/repositories/**)         ── DynamoDB Get/Put/Query/
      │                                                 Update/Delete/BatchGet
      ▼
 AWS DynamoDB
```

Server Components (homepage, `/products`, `/product-detail`) call the **service
layer directly** (no HTTP round-trip) since they render on the server — this is
the idiomatic Next.js App Router pattern and keeps product/category reads fast.

Client Components (cart, wishlist, auth forms, live search) talk to the **API
layer over `fetch`**, since they run in the browser and must go through an
authenticated, validated boundary before touching the database.

Every route handler is wrapped in `withErrorHandling()` (`src/lib/errors/handler.ts`),
so validation failures, "not found", "unauthorized", and unexpected errors all
return a consistent JSON shape:

```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

## 6. Database Design (AWS DynamoDB)

> **Cost:** every table below is created in DynamoDB's **PROVISIONED** capacity
> mode with small, fixed throughput numbers (see `scripts/create-tables.ts`).
> Added up across every table *and* every index, the total is 25 read + 19
> write capacity units — inside AWS's Always Free allowance of 25 RCU + 25
> WCU per account/region, which never expires. Running this project on AWS
> costs **$0** as long as you don't raise those numbers or turn on
> autoscaling. (If you exceed the traffic these support, DynamoDB will
> throttle, not silently bill you — you'll see errors, not a charge.)

Five tables, each with a purpose-built key schema:

### `basketly-users`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `id` | String (UUID) |
| GSI `EmailIndex` | `email` | String — used to look up a user at login |

Other attributes: `name`, `passwordHash` (bcrypt, never returned to clients),
`phone?`, `avatar?`, `addresses[]`, `createdAt`, `updatedAt`.

### `basketly-categories`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `id` | String |
| GSI `SlugIndex` | `slug` | String — friendly URLs (`/products?category=footwear`) |

### `basketly-products`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `id` | String |
| GSI `SlugIndex` | `slug` | String — product detail pages |
| GSI `CategoryIndex` | `categoryId` (PK) + `name` (SK) | Listing/related products by category |

Other attributes: `name`, `description`, `price`, `originalPrice?`, `stock`,
`brand`, `tags[]`, `rating`, `reviewCount`, `images[]`, `specs`, `isNew`,
`isBestSeller`, `isSale`.

### `basketly-cart`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `userId` | String |
| Sort key | `productId` | String |

Each cart line item is its **own DynamoDB item**, not an array embedded in a
single "cart blob". This means adding, updating, or removing one item is a
single, atomic `PutItem` / `UpdateItem` / `DeleteItem` call — no read-modify-write
race conditions, and no risk of clobbering a concurrent update from another tab.
Attributes: `quantity`, `selectedSize?`, `selectedColor?`, `addedAt`, `updatedAt`.

### `basketly-wishlist`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `userId` | String |
| Sort key | `productId` | String |

Same one-item-per-line-item pattern as cart. A conditional write
(`attribute_not_exists(userId)`) on insert makes "add to wishlist" naturally
idempotent — duplicate prevention happens at the database layer, not just in
application code.

### `basketly-orders`
| Key | Attribute | Type |
|---|---|---|
| Partition key | `id` | String (UUID) |
| GSI `UserIndex` | `userId` (PK) + `createdAt` (SK) | Order history for a user, newest first |

Attributes: `items[]` (product name/price/qty snapshot at purchase time — never
recomputed from current product data), `subtotal`, `shipping`, `total`,
`status` (`pending`/`paid`/`processing`/`shipped`/`delivered`/`cancelled`),
`shippingAddress`, `razorpayOrderId`, `razorpayPaymentId`.

### How the app reads/writes data

| Operation | Table(s) | DynamoDB call |
|---|---|---|
| List/search/filter products | Products | `Scan` (paginated) + in-memory filter — see note below |
| Product detail by slug | Products | `Query` on `SlugIndex` |
| Related products | Products | `Query` on `CategoryIndex` |
| Register | Users | `Query` on `EmailIndex` (dupe check) → `PutItem` |
| Login | Users | `Query` on `EmailIndex` → bcrypt compare |
| Add to cart | Cart, Products | `GetItem` (product), `Query` (existing line), `PutItem` |
| Update/remove cart item | Cart | `UpdateItem` / `DeleteItem` |
| Get cart | Cart, Products | `Query` (line items) + `BatchGetItem` (live product data) |
| Add/remove wishlist item | Wishlist | conditional `PutItem` / `DeleteItem` |
| Start checkout | Cart, Products, Razorpay | Read cart, verify stock, create Razorpay order |
| Confirm payment | Orders, Products | Verify signature → **`TransactWriteItems`**: decrement stock for every line item + create the order, all-or-nothing |
| Order history | Orders | `Query` on `UserIndex` |
| Admin: list/update orders | Orders | `Scan` / `UpdateItem` |
| Admin: create/edit/delete product | Products | `PutItem` / `UpdateItem` / `DeleteItem` |

> **Note on product search:** the catalog here is small (tens of SKUs), so
> listing/searching/filtering is done with a `Scan` plus in-memory filtering in
> `product.service.ts`. This is an honest, documented trade-off for a project
> of this size — at real-world catalog scale, this would move to a dedicated
> search index (e.g. OpenSearch or Algolia) kept in sync via DynamoDB Streams,
> with DynamoDB remaining the source of truth for a single product's record.

## 7. Environment Variables

Copy `.env.example` to `.env.local` and fill in real values — **never commit
real AWS credentials**.

| Variable | Purpose |
|---|---|
| `AWS_REGION` | AWS region your DynamoDB tables live in |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM credentials scoped to DynamoDB access |
| `DYNAMODB_ENDPOINT` | Leave empty for real AWS. Set to `http://localhost:8000` for DynamoDB Local |
| `DYNAMODB_USERS_TABLE`, `..._PRODUCTS_TABLE`, `..._CATEGORIES_TABLE`, `..._CART_TABLE`, `..._WISHLIST_TABLE` | Table names, so dev/staging/prod can point at different tables |
| `JWT_SECRET` | Long random string used to sign session cookies (`openssl rand -base64 48`) |
| `SESSION_COOKIE_NAME` | Name of the session cookie (default `basketly_session`) |
| `SESSION_TTL_SECONDS` | Session lifetime in seconds (default 7 days) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL, used for sitemap/OG tags |

The IAM user/role needs at minimum: `GetItem`, `PutItem`, `UpdateItem`,
`DeleteItem`, `Query`, `Scan`, `BatchGetItem`, `BatchWriteItem` on the five
`basketly-*` tables (plus `CreateTable`/`DescribeTable` if you'll run the setup
script with that same user).

## 8. Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# fill in AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, JWT_SECRET

# 3. Provision DynamoDB tables (safe to re-run — skips tables that already exist)
npm run db:create-tables

# 4. Seed the catalog (categories + products)
npm run db:seed

# — or steps 3+4 together:
npm run db:setup

# 5. Run the dev server
npm run dev
# → http://localhost:4028
```

### Running against DynamoDB Local (no AWS account needed)

```bash
docker run -p 8000:8000 amazon/dynamodb-local
# in .env.local:
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```
Then run `npm run db:setup` as above — it will create tables and seed data in
your local DynamoDB instance.

### Other scripts

```bash
npm run build        # production build
npm run start         # run the dev server (see package.json)
npm run serve          # run the production build
npm run lint            # ESLint
npm run type-check       # tsc --noEmit
```

## 9. API Reference

All responses are shaped `{ success: true, data }` or
`{ success: false, error: { code, message } }`.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account, starts a session |
| POST | `/api/auth/login` | – | Sign in, starts a session |
| POST | `/api/auth/logout` | – | Clears the session cookie |
| GET | `/api/auth/me` | – | Current session's user, or `null` |
| GET | `/api/products` | – | List/search/filter/sort products (`q`, `category`, `brands`, `priceMin`, `priceMax`, `rating`, `availability`, `sort`, `limit`) |
| GET | `/api/products/:idOrSlug` | – | Product detail + related products |
| GET | `/api/categories` | – | All categories |
| GET | `/api/cart` | ✅ | Current user's cart with live totals |
| POST | `/api/cart` | ✅ | Add an item (`productId`, `quantity`, `selectedSize?`, `selectedColor?`) |
| PATCH | `/api/cart/:productId` | ✅ | Update quantity |
| DELETE | `/api/cart/:productId` | ✅ | Remove one item |
| DELETE | `/api/cart` | ✅ | Clear the cart |
| POST | `/api/cart/merge` | ✅ | Merge a guest cart into the account (called once at login) |
| GET | `/api/wishlist` | ✅ | Current user's wishlist |
| POST | `/api/wishlist` | ✅ | Add a product |
| DELETE | `/api/wishlist/:productId` | ✅ | Remove a product |
| POST | `/api/wishlist/merge` | ✅ | Merge a guest wishlist into the account |
| POST | `/api/checkout/create-order` | ✅ | Opens a Razorpay order for the current cart |
| POST | `/api/checkout/verify` | ✅ | Verifies payment, creates the order, clears the cart |
| GET | `/api/orders` | ✅ | Current user's order history |
| GET | `/api/orders/:id` | ✅ | One order's detail (must belong to you) |
| GET/POST | `/api/admin/products` | 🛡️ | List all products / create a product |
| PUT/DELETE | `/api/admin/products/:id` | 🛡️ | Update / delete a product |
| GET | `/api/admin/orders` | 🛡️ | All orders |
| PATCH | `/api/admin/orders/:id` | 🛡️ | Update an order's status |
| GET | `/api/admin/stats` | 🛡️ | Dashboard metrics |

✅ = requires a signed-in session. 🛡️ = requires a signed-in **admin** session
(returns `403 FORBIDDEN` for non-admins).

## 10. Payments (Razorpay Test Mode)

Checkout uses Razorpay in **test mode** — no real money ever moves, but the
integration is real: a genuine order is created, a genuine payment widget
opens, and the payment's signature is verified server-side before an order
is ever written to the database.

1. `POST /api/checkout/create-order` — reads the user's live cart, checks
   stock, opens a Razorpay order for the current total.
2. The browser opens Razorpay's checkout widget with that order. Use test
   card **4111 1111 1111 1111**, any future expiry date, any CVV, any name.
3. On success, Razorpay hands the browser a payment ID + signature.
   `POST /api/checkout/verify` recomputes that signature server-side
   (`lib/payments/razorpay.ts`) — if it doesn't match, the "payment" is
   rejected. This is what stops someone from faking a successful payment by
   just calling the API directly.
4. Once verified, stock is decremented for every item **and** the order is
   written in a single DynamoDB `TransactWriteItems` call — either all of it
   succeeds, or none of it does. If an item sold out in the meantime, the
   whole transaction is rejected and nothing is double-booked.

To get test keys: sign up at [razorpay.com](https://razorpay.com), switch to
**Test Mode** in the dashboard, go to Settings → API Keys, and generate a
test key pair. Put them in `.env.local` as `RAZORPAY_KEY_ID`,
`RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID`. Razorpay's test
mode is free — no card or payout setup required to test it.

## 11. Admin Dashboard

The dashboard at `/admin` is fully protected — only accounts with
`role: 'admin'` can reach it (everyone else is redirected). Once you have at
least one admin account, everything else (adding products, adjusting stock,
managing orders) is done through the UI — no code, no AWS console.

**Bootstrapping your first admin** (one-time, via CLI):
```bash
# 1. Register a normal account through the site's /register page
# 2. Promote it to admin:
npm run make-admin -- you@example.com
# 3. Log out and back in, then visit /admin
```

What you can do from `/admin`:
- **Overview** — revenue, order count, low/out-of-stock alerts, a 7-day revenue chart
- **Products & Inventory** — add/edit/delete products, adjust stock inline
- **Orders** — view every order, filter by status, move an order through
  `pending → paid → processing → shipped → delivered` (or `cancelled`)

## 12. How Guest → Signed-in Cart/Wishlist Works

1. A visitor without an account can add to cart/wishlist immediately — this
   state lives in `localStorage` via Zustand, no login required.
2. When they register or log in, `AuthProvider` (`src/lib/auth-context.tsx`)
   calls `/api/cart/merge` and `/api/wishlist/merge` **once**, sending up
   whatever was in local storage.
3. The server folds those items into the user's DynamoDB cart/wishlist
   (respecting stock limits and duplicate-prevention), then the client
   re-hydrates from the server so the UI reflects the authoritative, merged
   state going forward.

## 13. Error Handling & Validation

- Every write endpoint validates its request body with a Zod schema
  (`src/lib/validation/schemas.ts`) before touching the database.
- Expected failures use a typed `AppError` (`ValidationError`,
  `UnauthorizedError`, `NotFoundError`, `ConflictError`) and are translated
  into the correct HTTP status + JSON shape automatically.
- Unexpected errors are logged server-side and returned as a generic 500 —
  internals (stack traces, DynamoDB error details) are never leaked to the
  client.
- Passwords are hashed with bcrypt before ever touching the database; the hash
  is stripped out of every API response.

## 14. Deployment Notes

- The app builds as a standard Next.js app; deploy to Netlify or Vercel.
- Set every variable from `.env.example` in your hosting provider's
  environment variable settings — do not commit `.env.local`.
- Run `npm run db:setup` once against your production AWS account/tables
  before (or right after) your first deploy.
- `sitemap.ts`, the homepage, `/products`, and `/product-detail` are marked
  `export const dynamic = 'force-dynamic'` since they read live data from
  DynamoDB — they render per-request rather than being baked in at build time.

## 15. Screenshots

_Add screenshots of the homepage, product listing, product detail, cart,
wishlist, and account pages here before submission._
