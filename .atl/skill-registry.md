# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| PR, pull request, branch | branch-pr | C:/Users/Manu/.config/opencode/skills/branch-pr/SKILL.md |
| 400 lines, chained PRs, stacked PRs, review slices | chained-pr | C:/Users/Manu/.config/opencode/skills/chained-pr/SKILL.md |
| docs, guide, README, RFC, onboarding, cognitive load | cognitive-doc-design | C:/Users/Manu/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| comment, feedback, PR review, collaboration | comment-writer | C:/Users/Manu/.config/opencode/skills/comment-writer/SKILL.md |
| issue, bug report, feature request | issue-creation | C:/Users/Manu/.config/opencode/skills/issue-creation/SKILL.md |
| judgment day, dual review, adversarial review, juzgar | judgment-day | C:/Users/Manu/.config/opencode/skills/judgment-day/SKILL.md |
| work unit, commit splitting, keep tests with code | work-unit-commits | C:/Users/Manu/.config/opencode/skills/work-unit-commits/SKILL.md |

## Compact Rules

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Automated checks must pass before merge
- Branch names: `type/description` matching `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)/[a-z0-9._-]+$`
- Conventional commits: `type(scope): description` matching `^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+`
- Commit type to PR label: feat→type:feature, fix→type:bug, docs→type:docs, refactor→type:refactor, chore→type:chore, style→type:chore, perf→type:feature, test→type:chore, build→type:chore, ci→type:chore, revert→type:bug, feat!/fix!→type:breaking-change

### chained-pr
- Split PRs over 400 changed lines unless maintainer accepts `size:exception`
- Keep each PR reviewable in ~60 minutes
- One deliverable work unit per PR; keep tests/docs with the unit they verify
- State start, end, prior dependencies, follow-up work, and out-of-scope in every chained PR
- Every child PR must include a dependency diagram marking current PR with `📍`
- In Feature Branch Chain, create draft/no-merge tracker PR; child PR #1 targets tracker branch, later children target immediate parent branch
- Treat polluted diffs as base bugs: retarget or rebase until only current work unit appears

### cognitive-doc-design
- Lead with the answer — decision, action, or outcome first
- Progressive disclosure — happy path first, then details/edge cases/references
- Chunking — group related info, keep flat lists short
- Signposting — headings, labels, callouts, summaries
- Recognition over recall — tables, checklists, examples over prose
- Design docs so reviewers can verify intent without reconstructing the whole story

### comment-writer
- Be useful fast — start with actionable point, no PR recap
- Be warm and direct — sound like a thoughtful teammate
- Keep it short — 1-3 short paragraphs or tight bullet list
- Explain why — give technical reason when asking for change
- Avoid pile-ons — highest-value issue only
- Match thread language — Spanish: use Rioplatense voseo (`podés`, `tenés`, `fijate`, `dale`)
- No em dashes — use commas, periods, or parentheses instead

### issue-creation
- Blank issues disabled — MUST use bug_report.yml or feature_request.yml template
- Every issue gets `status:needs-review` automatically on creation
- Maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues
- Bug Report template: `.github/ISSUE_TEMPLATE/bug_report.yml` — auto-labels: bug, status:needs-review
- Feature Request template: `.github/ISSUE_TEMPLATE/feature_request.yml` — auto-labels: enhancement, status:needs-review
- Maintainer applies: status:approved, priority:high/medium/low

### judgment-day
- Resolve project skills before launching judges — inject same Project Standards block into both judge prompts and fix prompts
- Launch two blind judges in parallel with identical target and criteria
- Wait for both judges before synthesis — never accept partial verdict
- Classify warnings as `WARNING (real)` only if normal intended use can trigger them; otherwise downgrade to INFO as `WARNING (theoretical)`
- Ask before fixing Round 1 confirmed issues
- After any fix agent runs, immediately re-launch both judges in parallel before commit/push/done/session summary
- Terminal states: only `JUDGMENT: APPROVED` or `JUDGMENT: ESCALATED`
- After 2 fix iterations with remaining issues, ask user whether to continue

### work-unit-commits
- Commit by work unit — a commit represents a deliverable behavior, fix, migration, or docs unit
- Do not commit by file type — avoid `models`, then `services`, then `tests` if none works alone
- Keep tests with code — tests belong in same commit as the behavior they verify
- Keep docs with the user-visible change — docs belong with the feature they explain
- Tell a story — reviewer should understand why each commit exists from its diff and message
- Future PR-ready — each commit should be a candidate chained PR when change grows
- SDD workload guard: if >400-line change forecast, group commits into chained PR slices before implementation

## Project Standards (auto-resolved)

### nextjs-16-react-19
- Server Components by default — add `'use client'` only for interactivity/hooks
- Next.js 16 App Router — use `app/` directory, not `pages/`
- TypeScript strict mode — no `any`, enforce types
- Path alias: `@/*` maps to project root — use `@/components/...`, never relative paths
- Tailwind CSS v4 via `@tailwindcss/postcss` — use OKLCH CSS vars from `globals.css` (`bg-primary`, `text-secondary`, etc.), never hardcode hex
- shadcn/ui style: "new-york", lucide icons — add via `pnpm dlx shadcn@latest add <name>`
- Framer-motion — use `ease: "easeOut" as const` (not cubic-bezier arrays — causes TS errors)
- Zod for form validation with `@hookform/resolvers`
- Data layer: `lib/data.ts` exports `getCursos()`, `getProducts()` — localStorage + static fallback
- Mercado Pago: `/api/checkout` is placeholder — activate with `.env.local` vars
- Routing conventions: `/cursos`, `/productos`, `/admin/cursos/nuevo`, `/admin/cursos/[id]/edit`, `/admin/productos/nuevo`, `/admin/productos/[id]/edit`

### nextjs-admin-auth
- Admin login: `admin@anacecilia.art` / `admin123`
- User login: `test@anacecilia.art` / `test123`
- Auth is mock/localStorage-based — no real backend auth yet
- Backend: Spring Boot (Java 17) at `http://localhost:8080` with H2 in-memory DB

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md (workspace) | C:/Users/Manu/OneDrive - UTN FRLP/Documentos/Web AnaRobles/anarobles-frontend/AGENTS.md | Not found — conventions from user-provided context |
| package.json | anarobles-frontend/package.json | pnpm, Next.js 16, React 19 |
| tsconfig.json | anarobles-frontend/tsconfig.json | Strict TypeScript |
| next.config.mjs | anarobles-frontend/next.config.mjs | Next.js config |
| postcss.config.mjs | anarobles-frontend/postcss.config.mjs | Tailwind CSS v4 |
