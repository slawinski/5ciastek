# Documentation index

## Reading route and authority

Start here → select a bounded child issue → read its parent scope, contract owners and applicable policies → consult cited examples. Existing issue requirements remain behavioral authority. Shared references explain them; examples do not amend acceptance criteria. Use issue-qualified identifiers (for example, `#17 AC-01`) when citing requirements across issues.

| Subject | Read | Boundary |
|---|---|---|
| Task form and language | [Specification style](specification-style.md), [implementation template](../.github/ISSUE_TEMPLATE/implementation.md) | Polish business specifications and application UI; English engineering guidance and identifiers |
| UI | [Design system](design-system.md), [#25](https://github.com/slawinski/5ciastek/issues/25) | Governs tokens, component reuse, accessibility and the Payload Admin exception |
| Security, integrity, privacy and release | [Engineering assurance](engineering-assurance.md), [#20](https://github.com/slawinski/5ciastek/issues/20), [#21](https://github.com/slawinski/5ciastek/issues/21), [#22](https://github.com/slawinski/5ciastek/issues/22), [#23](https://github.com/slawinski/5ciastek/issues/23), [#24](https://github.com/slawinski/5ciastek/issues/24) | Required controls depend on risk and release stage; documentation is not evidence of enforcement |
| Recipe versions and frozen composition | [#14](https://github.com/slawinski/5ciastek/issues/14) | Historical published values remain inputs to consumers |
| Scaling | [#17](https://github.com/slawinski/5ciastek/issues/17) | Takes quantities; does not save or approve a production plan |
| Saved production plan and approved versions | [#33](https://github.com/slawinski/5ciastek/issues/33) | Approval is not execution or proof of feasibility |
| Production events and projection contract | [#18](https://github.com/slawinski/5ciastek/issues/18), children #34–#37 | #19 writes; #30 supplies isolated simulation equivalents; #31 reads. Actual transfer/occupancy requires its own fact |
| Workforce | [Workforce planning](workforce-planning.md), #26–#29; #27 children #38–#40 | Keep planned availability, individual attendance and anonymous person-minutes distinct; #33 owns the saved production plan |
| Map presentation | [#31](https://github.com/slawinski/5ciastek/issues/31), children #41–#43; geometry #32 | Layout does not change production results; #32 is not a second renderer/list |
| Sales balance / cost allocation | [#4](https://github.com/slawinski/5ciastek/issues/4) / [#5](https://github.com/slawinski/5ciastek/issues/5) | Physical returns differ from refunds; shared labor needs an explicit allocation split before exact costing |

Shared derived references (the cited issue remains the behavioral authority):

- [Bilingual glossary](domain/glossary.md): one glossary with Polish definitions and English identities, not translated requirement mirrors.
- [Reference examples](reference-examples.md): per-domain tables citing issue-qualified AC; executable fixtures remain implementation work.
- [Open decisions](decisions.md): unresolved mass precision and stream partition/order, not accepted policy. Only implementations depending on those choices are blocked; do not invent domain answers.

For example, #41/#42 can demonstrate the #18 contract using a #30 fixture without waiting for a live backend. That demonstration does not establish live quantities before #35 or actual resource occupancy before #36. Distinguish a contract input from implemented prerequisites and real-data release gates using the [relationship meanings](specification-style.md#znaczenie-powiązań).

## Current stack and applicability

[package.json](../package.json) is the source for installed dependency declarations and scripts. Current maintenance uses React 19 with TanStack Start, type-safe TanStack Router, TanStack Query, XState 5 for complex transitions, Zod for schema-based validation, and Vite 7 with Nitro server output. Do not substitute a new state library from starter tutorial examples.

Next.js/Payload are target architecture work: [#13](https://github.com/slawinski/5ciastek/issues/13) selects the architecture; [#16](https://github.com/slawinski/5ciastek/issues/16) performs migration. Target-specific policy applies when that work is undertaken; it is not a mandate to rewrite routine maintenance.

## Commands

After installing the manifest dependencies with `npm install`:

| Command | Manifest script | Purpose |
|---|---|---|
| `npm run dev` | `vite dev --port 3000` | Local development on port 3000 |
| `npm run build` | `vite build` | Production build; required before production start |
| `npm run start` | `node .output/server/index.mjs` | Start the built production server, not first-time development setup |
| `npm run serve` | `vite preview` | Preview the build, distinct from development and production start |
| `npm run test` | `vitest run` | Existing product tests |

These are the only current npm scripts. There are no `lint`, `typecheck`, security-gate or release-validation scripts. The assurance policy and #24 describe required delivery work, not installed CI or enforced gates. Listing a command is not evidence that it has run or passed.

## Engineering guidance

### Structure and types

- Use TypeScript with specific interfaces. Do not use `any` or `unknown` for component props or business logic; use appropriate concrete types such as `React.ButtonHTMLAttributes<HTMLButtonElement>`.
- Follow the [design system](design-system.md) placement rule: truly generic primitives belong in `src/components/ComponentName/` with `index.tsx` and `ComponentName.module.css`; feature-specific components stay with their feature in `src/features/`. Do not move every component to the shared library.
- Group domain components, machines, schemas and server functions within their feature. Keep complex logic in XState machines or utilities, not rendering components; use `src/machines/` or `src/utils/` for shared logic rather than moving feature logic out of its domain.
- Keep page-specific routing in `src/routes/` and delegate business logic to features. The shared layout is `src/routes/__root.tsx`; use the router's `Link` for SPA navigation and route loaders or TanStack Query for data loading as appropriate to the existing feature.
- Use TanStack Start server functions for database operations or heavy computations, co-located with their feature. Use React Context providers for complex state shared within a feature instead of prop-drilling.

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
