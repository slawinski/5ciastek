# Documentation index

Start with the [product portfolio](product-plan.md): MVP-0 recipes, MVP-1 as a narrow connected investment scenario, then MVP-2 mixed-product comparison. Operations and growth remain independent follow-on projects, not compulsory sequential release buckets. Sourced manual measurements can support the first scenario without a complete production recorder.

## Reading route and authority

Follow portfolio → bounded [repository task](projects/README.md) → canonical [capability specification](specs/README.md#capability-registry) and qualified REQ/AC → applicable [decision](decisions.md) and policy → derived examples. For example, [TASK-REC-005](projects/recipes.md#task-rec-005) identifies the scaling flow, [REC-REQ-002](specs/recipes.md#rec-req-002) owns its calculation rule and [REC-AC-010](specs/recipes.md#rec-ac-010) gives concrete results. Read its dependencies and DEC-001 boundary before implementation.

Capability specs own business/UI behavior; project task sections are the sole delivery tracker. The portfolio and indexes do not mirror task state. GitHub issues and the [source archive](migrations/spec-library/source-baseline.json) are historical provenance only. [Coverage](migrations/spec-library/coverage.md) explains migration destinations; [retirement](migrations/spec-library/retirement.md) remains a caller-owned postmerge action, not feature completion. Documentation readiness or a synthetic demonstration does not prove implementation or real-data release approval.

| Subject | Read | Boundary |
|---|---|---|
| Task form and language | [Specification style](specification-style.md), [implementation template](../.github/ISSUE_TEMPLATE/implementation.md) | Polish business specifications and application UI; English engineering guidance and identifiers |
| UI | [Design](design-system.md#ui-design), [accessibility](design-system.md#ui-accessibility) | Tokens, component reuse, accessibility and the Payload Admin exception |
| Security, integrity, privacy and release | [Engineering assurance](engineering-assurance.md#ass-risk), [delivery tasks](projects/engineering-assurance.md) | P0 before actual accounts/data; P1 before actual production-event use, not automatically investment MVP-1; P2 before applicable high-risk use |
| Recipe versions and frozen composition | [REC-REQ-001](specs/recipes.md#rec-req-001) | Historical published values remain inputs to consumers |
| Scaling | [REC-REQ-002](specs/recipes.md#rec-req-002), [REC-REQ-012](specs/recipes.md#rec-req-012) | Takes quantities; does not save or approve a production plan |
| Saved production plan and approved versions | [PLN-REQ-001](specs/production-plans.md#pln-req-001) | Approval is not execution or proof of feasibility |
| Production events and projection | [EVT-REQ-001](specs/production-records.md#evt-req-001), [EVT-REQ-009](specs/production-records.md#evt-req-009) | Actual transfer/occupancy requires its own fact; simulated equivalents remain isolated |
| Shared execution, stock and costs | [PRC](specs/process-execution.md), [STK](specs/stock-inventory.md), [ECO](specs/economics-investment.md) | One owner per shared rule, consumed by actual and hypothetical flows |
| Workforce | [Compatibility guide](workforce-planning.md), [WRK-REQ-001](specs/workforce.md#wrk-req-001) | Planned availability, individual attendance and anonymous person-minutes are distinct; PLN owns the saved production plan |
| Map presentation | [MAP](specs/flow-map-demo.md) | Layout does not change production results; one renderer and alternative list |
| Sales balance / cost allocation | [SAL-REQ-003](specs/sales-returns.md#sal-req-003), [STK-REQ-002](specs/stock-inventory.md#stk-req-002), [ECO-REQ-001](specs/economics-investment.md#eco-req-001) | Physical returns differ from refunds; shared labor needs explicit allocation before exact costing |

Derived references (the linked canonical spec remains the behavioral authority):

- [Bilingual glossary](domain/glossary.md): one glossary with Polish definitions and English identities, not translated requirement mirrors.
- [Reference examples](reference-examples.md): per-domain tables citing qualified canonical REQ/AC; executable fixtures remain implementation work.
- [Decisions](decisions.md): DEC-001 accepts 0.001 g precision; stream partition/order remains open in DEC-002. Only implementations depending on an open choice are blocked.

For example, [TASK-MAP-001](projects/flow-map.md#task-map-001) can demonstrate the EVT projection with isolated MAP fixtures without a live backend. It does not establish actual quantities ([EVT-REQ-011](specs/production-records.md#evt-req-011)) or occupancy ([EVT-REQ-013](specs/production-records.md#evt-req-013)). Distinguish contract inputs, implementation prerequisites and real-data release gates using the [relationship meanings](specification-style.md#znaczenie-powiązań). DEC-001 and DEC-002 remain OPEN at their affected persistent mass/stream boundaries; examples choose neither policy.

## Current stack and applicability

[package.json](../package.json) is the source for installed dependencies and scripts. Current maintenance uses React 19, Next.js App Router, Payload 3 with SQLite, TanStack Query, XState 5 and Zod. Vite supports Vitest, not the application runtime. See [ADR-001](architecture/mvp-zero.md) for compatibility and deployment constraints.

Architecture/migration evidence belongs to [TASK-REC-001](projects/recipes.md#task-rec-001) and [TASK-REC-002](projects/recipes.md#task-rec-002). Actual-account/data release remains subject to P0 approval.

## Commands

After installing the manifest dependencies with `npm install`:

| Command | Manifest script | Purpose |
|---|---|---|
| `npm run dev` | `next dev --webpack -p 3000` | Local development on port 3000 |
| `npm run build` | `next build --webpack` | Production build; required before production start |
| `npm run start` | `next start -p 3000` | Start the built production server |
| `npm run test` | `vitest run` | Existing product tests |

Also run `npm run lint`, `npm run typecheck`, `npm run test:integration` and `npm run security`. Use Node from `.node-version`, install with `npm ci`, and provide explicit `PAYLOAD_SECRET`/`DATABASE_URI` from `.env.example`. [MVP-0 operations](architecture/mvp-zero.md) describes migration and synthetic setup. CI configuration is not evidence of activated branch protection or actual-data release approval.

## Engineering guidance

### Structure and types

- Use TypeScript with specific interfaces. Do not use `any` or `unknown` for component props or business logic; use appropriate concrete types such as `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- Follow the [design system](design-system.md) placement rule: truly generic primitives belong in `src/components/ComponentName/` with `index.tsx` and `ComponentName.module.css`; feature-specific components stay with their feature in `src/features/`. Do not move every component to the shared library.
- Group domain components, machines, schemas and server functions within their feature. Keep complex logic in XState machines or utilities, not rendering components; use `src/machines/` or `src/utils/` for shared logic rather than moving feature logic out of its domain.
- Keep page-specific routing in `src/app/(app)/` and delegate business logic to features. Its layout owns the frontend shell; use Next `Link` and server pages / Query hydration for data loading.
- Use validated Next server functions co-located with their feature. Payload owns persistence; user-facing Local API calls explicitly enforce actor access. Use React Context providers for complex state shared within a feature instead of prop-drilling.

### UI, accessibility and performance

- Use CSS Modules for component styles, not Tailwind. Follow the [design system](design-system.md) for authoritative tokens and reuse before adding components; the [Neo-Brutalist specification](design_system/neo_brutalist_spec.md) is supporting detail, not a competing token source.
- Preserve the Sourdough/neo-brutalist character: visible black borders (at least 2px; reuse the governing border token), hard offset shadows without blur, and immediate or very short (0.1s) mechanical transitions. Use the governing palette/tokens rather than introducing a separate palette from color names such as Flour White, Crust Black, Sourdough Yellow or Starter Pink.
- Work mobile-first. Use `postcss-custom-media` breakpoints from `src/media-queries.css` (for example `@media (--laptop)`), not hardcoded pixel media queries. Follow the design system's mobile/desktop, zoom, touch-target and reduced-motion checks.
- Use `lucide-react` icons only, imported individually for tree-shaking.
- Pass a unique `id` to every `InputField`; use semantic landmarks (`main`, `nav`, `header`) and descriptive `aria-label` values for icon-only buttons. Preserve keyboard, focus, contrast and applicable loading/empty/error/disabled states required by the design system.
- Debounce high-frequency user inputs (for example temperature inputs) with the existing `useDebounce` hook.

### Validation, dependency hygiene and verification

- Validate all client and server inputs with Zod schemas; client validation does not replace server validation. Apply access, integrity, privacy and recovery controls from [engineering assurance](engineering-assurance.md), rather than copying a second policy here.
- Respond promptly to every vulnerability reported by `npm audit`: assess applicability and remediate proportionally to the assurance risk/release stage. Any deviation needs the policy's owner, justification and review date; do not silently ignore a finding or claim a scan/gate is installed or passed.
- Before fixing a bug, establish an empirical reproduction with a script or a Vitest test case. Add regression evidence for the behavior being fixed.
- Utilities and machines require accompanying unit tests in `src/tests/` or alongside their source. Verify behavioral and structural correctness for changes, with evidence appropriate to the scope; prose-only edits use document checks rather than new product tests.
- Report actual checks and unresolved risks. A skipped test is not a passed test, and a synthetic demonstration is not a real-data release approval. Keep required CI/release evidence and legal/operational approvals under the existing assurance policy.
