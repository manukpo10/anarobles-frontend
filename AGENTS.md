# AGENTS.md — Web AnaRobles

## Repo Structure
Two separate repos under one pnpm workspace:
- `anarobles-frontend/` — Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- `anarobles-backend/` — Spring Boot (Java, Maven)

**Working directory**: `C:\Users\Manu\OneDrive - UTN FRLP\Documentos\Web AnaRobles`
Always check which sub-repo you're modifying — most work is frontend unless backend is specified.

## Dev Commands

### Frontend
```bash
cd anarobles-frontend
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
```

### Backend
```bash
cd anarobles-backend
mvn spring-boot:run  # dev server
mvn package           # build JAR
```

## Frontend Architecture
- **Entry point**: `anarobles-frontend/app/page.tsx` (home)
- **Components**: `anarobles-frontend/components/` — organized by feature (home/, ui/)
- **Data layer**: `anarobles-frontend/lib/data.ts` — static data with localStorage override
- **Contexts**: `contexts/auth-context.tsx`, `cart-context.tsx`

Home page sections (in order):
```
HeroSection → PoeticDivider → FeaturedGallery → FeaturedWorks → ShopPreview → Footer
```

## Critical Quirks

### localStorage data override
`getStoredData("products", products)` in `lib/data.ts` checks localStorage first.
If stale "products" data exists without `featured: true`, `ShopPreview` shows empty.
Fix: open browser console → `localStorage.removeItem("products")` → refresh.

### Next.js config overrides
```js
// next.config.mjs
typescript: { ignoreBuildErrors: true },  // TS errors don't block build
images: { unoptimized: true },            // images skip Next optimization
```

### Tailwind CSS v4
Uses `@tailwindcss/postcss` not the standard tailwindcss package.
PostCSS config: `postcss.config.mjs` → `plugins: { '@tailwindcss/postcss': {} }`

## Deployment
- **Frontend**: Vercel — auto-deploys from `main` branch
- **Domain**: anaceciliarobles.com (Vercel) + Cloudflare DNS + HostGator registrar
- **DNS setup**: Cloudflare CNAME flattening for apex; nameservers at HostGator → Cloudflare
- **Backend**: Render (free tier — spins down after inactivity)

### DNS troubleshooting
If site doesn't load but works on some devices:
- DNS propagation can take up to 24h (typically 1-2h with Cloudflare)
- Check with Cloudflare DNS: `Resolve-DnsName "anaceciliarobles.com" -Server "1.1.1.1"`
- Flush local DNS: `ipconfig /flushdns` in cmd (admin)
- Or set manual DNS: preferred 1.1.1.1, alternate 1.0.0.1

## Brand Palette
- Primary (naranja): `#D9622C`
- Secondary (azul): `#194052`
- Accent (coral): `#B73E47`
- Background: `#FAF6F0` (cream)

Logo file: `/public/logo_transparente.png` — used in navbar, footer, hero watermark.

## Backend Connection
- Supabase PostgreSQL via pooler: `aws-1-us-west-2.pooler.supabase.com:5432`
- HikariCP `maximum-pool-size=1` in `application.properties` (prevents "max clients reached")
- DB user format: `postgres.rxwtsgcwsaxcbmriepoz`

## Vercel Domain Config (for reference)
Domains in Vercel dashboard:
- `anaceciliarobles.com` → Production, no redirect
- `www.anaceciliarobles.com` → Production, no redirect
- `anarobles-frontend.vercel.app` → redirects to anaceciliarobles.com