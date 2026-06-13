# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A detailed `AGENTS.md` lives at the repo root with deployment, DNS, brand palette, and
> environment-specific quirks. Read it for anything about Vercel/Render/Cloudflare, the brand
> colors, or the Supabase connection. This file covers build commands and code architecture;
> it avoids duplicating AGENTS.md.

## Repo Layout

A pnpm workspace holding two independent apps. **Most work is frontend** — confirm which
sub-repo you're touching before editing.

- `anarobles-frontend/` — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- `anarobles-backend/` — Spring Boot 3.2 (Java 17, Maven), JWT auth, JPA → Supabase PostgreSQL,
  Mercado Pago payments
- `maqueta/`, `imagenes/` — design mockups and source images, not application code
- `openspec/` — SDD planning artifacts

## Commands

### Frontend (`cd anarobles-frontend`)
- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint

### Backend (`cd anarobles-backend`)
- `mvn spring-boot:run` — dev server (port 8080)
- `mvn package` — build JAR
- `mvn test` — run all tests
- `mvn test -Dtest=ClassName#method` — run a single test

## Architecture — the big picture

### Frontend data flow (read this before touching any page)
Most page content is driven by **static TypeScript data modules** in `lib/`, not by live API
calls. Each module pairs a static default with a localStorage override via the `getStoredData`
helper (defined in `lib/data.ts`): it reads `localStorage` first and falls back to the static
array. The `/admin` pages edit content by writing back to localStorage — so **admin edits are
client-only and per-browser**, not persisted server-side. This is the single most important
quirk: if a list renders empty or stale, suspect leftover localStorage
(`localStorage.removeItem("<key>")` + refresh).

Data modules: `lib/data.ts` (products, courses, blog, home-page content — note the many
`// TODO` mock-data markers), `lib/obras.ts` (gallery works), `lib/articulos.ts` (articles),
`lib/animations.ts` (Framer Motion presets), `lib/utils.ts` (`cn` etc).

The one real server call from the frontend is **checkout**: `app/api/checkout/route.ts` is a
Next.js Route Handler that brokers the Mercado Pago payment flow (the only route under
`app/api/`). Auth requests also hit the network (see `contexts/auth-context.tsx`).

### Frontend structure
- `app/` — App Router routes with Spanish-named segments: `cursos` (courses), `productos`
  (products), `galeria` (gallery), `carrito` (cart), `checkout`, `mi-cuenta` (account), `auth`,
  `admin`, `blog`, `sobre-mi`, `contacto`, plus legal pages. `robots.ts` and `sitemap.ts` are
  generated route handlers. Per-route private UI lives in `_components/` folders (e.g.
  `app/cursos/[id]/_components/`).
- `contexts/` — global client state via React Context: `auth-context`, `cart-context`,
  `checkout-context`. These are the source of truth for session / cart / checkout state.
- `components/ui/` — shadcn/Radix primitives; feature folders under `components/` compose them.
- Styling is Tailwind v4 via `@tailwindcss/postcss` (not the classic `tailwindcss` plugin).

### Backend structure
Classic layered Spring Boot under `com.anacecilia.backend`:
`controller → service → repository (JPA) → entity`, with `dto/` for request/response shapes.
Class names are Spanish.

- **Domain (entities)**: `Usuario` + `Role` (users/auth), `Producto` (shop), `Curso` → `Modulo`
  → `Leccion` (courses with modules and lessons), `Inscripcion` (course enrollments), `Orden` +
  `OrdenItem` (orders). The course/order graph is the richest part of the model.
- **Controllers**: `AuthController`, `ProductoController`, `CursoController`,
  `InscripcionController`, `CheckoutController`, `PublicController`, `HealthController`.
- **Services**: `AuthService`, `ProductoService`, `CursoService`, `InscripcionService`,
  `OrdenService`, `MercadoPagoService` (payment integration).
- **Security** (`security/` + `config/SecurityConfig.java`): stateless JWT. Requests pass
  `JwtAuthenticationFilter`, which validates tokens via `JwtUtils`; users load through
  `UserDetailsServiceImpl`.
- **`config/`**: `DataInitializer` seeds initial DB rows on startup (check here before assuming
  data is missing); `GlobalExceptionHandler` centralizes error responses.
- **Config**: `application.properties` reads everything sensitive from env vars (`DB_USER`,
  `DB_PASSWORD`, `JWT_SECRET`, `MP_ACCESS_TOKEN`, `SITE_URL`, `BACKEND_URL`). Local dev can
  supply them via an optional `.env` (`spring.config.import=optional:file:.env`) or
  `application-local.properties`. JPA runs `ddl-auto=update`.

### Payments (Mercado Pago) — spans both apps
The frontend `app/api/checkout/route.ts` and the backend `CheckoutController` +
`MercadoPagoService` together implement the Mercado Pago flow. `mp.site-url` / `mp.backend-url`
in `application.properties` are the redirect/callback targets. A `mercado-pago` skill is
available — use it when working on this flow.

## Deployment summary
- **Frontend**: Vercel, auto-deploy from `main` → `anaceciliarobles.com`
- **Backend**: Render free tier (spins down after inactivity; first request is slow)
- **DNS**: Cloudflare → HostGator registrar. Flush with `ipconfig /flushdns` if stale.

## Brand
- Primary orange: `#D9622C` · Secondary blue: `#194052` · Accent coral: `#B73E47`
- Background cream: `#FAF6F0` · Logo: `public/logo_transparente.png`

## Gotchas
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.
  **TS type errors do NOT fail the build** — run `npm run lint` / `tsc` deliberately; don't
  trust a green `build` as a type check.
- Backend `HikariCP maximum-pool-size=1` (Supabase pooler limit) — don't raise it.
- Repo lives under a OneDrive-synced path with spaces; always quote the working directory.
