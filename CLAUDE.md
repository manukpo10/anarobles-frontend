# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A detailed `AGENTS.md` lives at the repo root with deployment, DNS, brand palette, and
> environment-specific quirks. Read it for anything about Vercel/Render/Cloudflare, the brand
> colors, or the Supabase connection. This file covers build commands and code architecture;
> it avoids duplicating AGENTS.md. Note: `AGENTS.md` is gitignored — it's local-only and won't
> exist on a fresh clone or be visible to other collaborators via GitHub.

## Repo Layout

A git repo holding two independent apps — **not** a pnpm/npm workspace despite the stray
`anarobles-frontend/pnpm-workspace.yaml` (that file is just a pnpm build-approval list for
`sharp`, not a workspace definition). Each app has its own lockfile and deploy target.
**Most work is frontend** — confirm which sub-repo you're touching before editing.

- `anarobles-frontend/` — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, npm
- `anarobles-backend/` — Spring Boot 3.2 (Java 17, Maven), JWT auth, JPA → Supabase PostgreSQL,
  Mercado Pago payments (raw REST calls, no SDK)
- `maqueta/`, `imagenes/` — design mockups and source images, not application code
- `openspec/` — SDD planning artifacts (currently just empty archived-change folders)

## Commands

### Frontend (`cd anarobles-frontend`)
- `npm run dev` — dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint, but currently **broken**: no `eslint`/`eslint-config-next` in
  `devDependencies` or `node_modules`. There's nothing for it to run — don't treat a clean
  exit as a passing lint gate.

### Backend (`cd anarobles-backend`)
- `mvn spring-boot:run` — dev server (port 8080)
- `mvn package` — build JAR
- `mvn test` — run all tests
- `mvn test -Dtest=ClassName#method` — run a single test

## Architecture — the big picture

### Frontend data flow (read this before touching any page)
Most page content is driven by **static TypeScript data modules** in `lib/`, not by live API
calls. Two of them have a localStorage override via the `getStoredData` helper (defined in
`lib/data.ts`): `getCursos()` (key `"cursos"`) and the products list (key `"products"`) each
read `localStorage` first and fall back to a static array. The `/admin/cursos` and
`/admin/productos` pages write back to those keys — so **those admin edits are client-only and
per-browser**, not persisted server-side. This is the single most important quirk: if courses
or products render empty or stale, suspect leftover localStorage
(`localStorage.removeItem("cursos" | "products")` + refresh). Blog (`lib/articulos.ts`) and
gallery (`lib/obras.ts`) have no localStorage override and no `/admin` editor — they're purely
static.

Data modules: `lib/data.ts` (products, courses, home-page content — note the many `// TODO`
mock-data markers), `lib/obras.ts` (gallery works), `lib/articulos.ts` (articles),
`lib/animations.ts` (Framer Motion presets), `lib/utils.ts` (`cn` etc).

The frontend hits the network from a few places, all via `NEXT_PUBLIC_API_URL` to the backend:
`app/api/checkout/route.ts` (Mercado Pago flow), `contexts/auth-context.tsx` (login/session),
and `lib/data.ts`'s `fetchCursosFromAPI()` (consumed by `app/cursos/_page-content.tsx`). Two
more Route Handlers under `app/api/` integrate third-party services directly instead of the
backend: `waitlist/` (posts signups to Resend, needs `RESEND_API_KEY`) and `instagram/` (proxies
a Behold feed, needs `BEHOLD_FEED_ID`). There's no `.env.example` — grep `process.env` for the
full list of vars a given feature reads.

### Frontend structure
- `app/` — App Router routes with Spanish-named segments: `cursos` (courses), `productos`
  (products), `galeria` (gallery), `carrito` (cart), `checkout`, `mi-cuenta` (account), `auth`,
  `admin`, `blog`, `sobre-mi`, `contacto`, plus legal pages (`privacidad`, `terminos`).
  `robots.ts` and `sitemap.ts` are generated route handlers. Per-route private UI lives in
  `_components/` folders (e.g. `app/cursos/[id]/_components/`).
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
`MercadoPagoService` together implement the Mercado Pago flow. `MercadoPagoService` calls the
Mercado Pago REST API directly via `java.net.http.HttpClient` — there's no official SDK
dependency. `mp.site-url` / `mp.backend-url` in `application.properties` are the redirect/
callback targets. A `mercado-pago` skill is available — use it when working on this flow.

## Deployment summary
- **Frontend**: Vercel, auto-deploy from `main` → `anaceciliarobles.com`
- **Backend**: Render free tier (spins down after inactivity; first request is slow)
- **DNS**: Cloudflare → HostGator registrar. Flush with `ipconfig /flushdns` if stale.

## Brand
- Primary orange: `#FA7A35` · Secondary blue: `#1A5276` · Accent coral: `#B73E47`
- Background cream: `#FAF6F0` · Logo: `public/logo_transparente.png`
- Canonical colors are the OKLCH custom properties in `app/globals.css` (`--primary`,
  `--secondary`, `--accent`); the hex codes above are that file's own header comment, kept
  here for quick reference.

## Gotchas
- `npm run lint` has no ESLint installed — see Commands above, don't trust it as a gate.
- `next.config.mjs` sets security headers and restricts image `formats` to webp. It does
  **not** set `typescript.ignoreBuildErrors` or `images.unoptimized` — TS/build errors and
  image optimization behave normally. (This flipped since an earlier version of this file;
  re-check the file directly if a claim about it ever seems off.)
- Backend `HikariCP maximum-pool-size=1` (Supabase pooler limit) — don't raise it.
- Repo lives under a OneDrive-synced path with spaces; always quote the working directory.
