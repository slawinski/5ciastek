# 5ciastek - Gemini CLI Project Mandates

These instructions are foundational mandates for the Gemini CLI and take absolute precedence over general workflows and tool defaults.

## 1. Technical Stack & Styling
- **Styling:** ALWAYS use **CSS Modules** for component-specific styles (`ComponentName.module.css`). **NEVER use Tailwind CSS.**
- **Responsive Design:** Use a **mobile-first** approach. 
  - ALWAYS use variable-based breakpoints via `postcss-custom-media`.
  - Reference `src/media-queries.css` for defined variables (e.g., `@media (--laptop)`).
  - NEVER hardcode pixel values in media queries (e.g., avoid `@media (min-width: 1024px)`).
- **Design System:** Strictly follow the **Neo-Brutalist** aesthetic (see `docs/design_system/neo_brutalist_spec.md`).
  - **Borders:** Minimum `2px solid #000000` for all components.
  - **Shadows:** Use **hard-edged** offsets (e.g., `4px 4px 0px #000000`) instead of blur-based shadows.
  - **Colors:** Use the "Sourdough Edition" palette (Flour White, Crust Black, Sourdough Yellow, Starter Pink).
  - **Transitions:** Use immediate or very short transitions (0.1s). Hover states should feel mechanical.
- **Framework:** React 19 (Client/Server) with TanStack Start.
- **Routing:** TanStack Router (Type-safe).
- **State Management:** XState 5 for complex state transitions (e.g., wizards, calculators).
- **Validation:** Zod for all schema-based input and data validation.
- **Build Tool:** Vite 7 with Nitro/Nitro server setup.

## 2. Coding Guidelines
- **Strict Typing:** TypeScript is non-negotiable. **NEVER use `any` or `unknown`** for component props or business logic. Use specific interfaces (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`).
- **Component Structure:** Every component must reside in `src/components/ComponentName/` with an `index.tsx` and its own `.module.css` file.
- **Icons:** Use `lucide-react` only. Import icons individually to ensure tree-shaking.
- **Side Effects:** Centralize complex logic in XState machines (`src/machines/`) or utility functions (`src/utils/`). Keep React components focused on rendering.

## 3. Architecture & Implementation
- **Feature-Based Architecture:** ALWAYS group logic by domain in `src/features/`.
  - Co-locate components, machines, schemas, and server functions within their respective feature folders.
  - Keep `src/components/` for truly generic, reusable UI primitives.
- **Route-Centric Logic:** Page-specific logic belongs in `src/routes/`, but should delegate business logic to features.
- **Server Functions:** Leverage TanStack Start's server functions for database operations or heavy computations, co-located within features.
- **Context Over Prop-Drilling:** Use React Context (Providers) to share complex state (like XState machines) within a feature.
- **A11y & Forms:**
  - **Unique IDs:** Every `InputField` must have a unique `id` passed as a prop.
  - **Semantic HTML:** Use landmark elements (`<main>`, `<nav>`, `<header>`, etc.) rigorously.
  - **ARIA:** Always provide descriptive `aria-label` for icon-only buttons.

## 4. Security & Performance
- **Input Sanitization:** Validate all client and server inputs using Zod schemas.
- **Dependency Hygiene:** Address all vulnerabilities reported by `npm audit` immediately.
- **Debouncing:** High-frequency user inputs (e.g., temperature inputs) must be debounced using the `useDebounce` hook.

## 5. Testing Mandates
- **Empirical Reproduction:** Before fixing any bug, you MUST create a reproduction script or test case using Vitest.
- **Logic Coverage:** All `utils` and `machines` must have accompanying unit tests in `src/tests/` or alongside the source files.
- **Verification:** Every change is incomplete without verified behavioral and structural correctness.
