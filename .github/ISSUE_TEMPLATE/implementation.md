---
name: "KoPieC OS — repository task pointer"
about: "Point to canonical repository work; do not create a second delivery tracker"
title: "[Repository reference] "
---

## Repository authority

Implementation work is specified and tracked in the repository, not in this issue. Start at the [documentation index](../../docs/index.md), follow the [portfolio](../../docs/product-plan.md) to a bounded task in [projects](../../docs/projects/README.md), then read its canonical REQ/AC, decisions and policies. Existing GitHub issues are historical provenance; their state and checkboxes do not establish task completion.

## Canonical task link

<!-- Link the exact project task heading, for example docs/projects/recipes.md#task-rec-005. If no task exists, propose a repository change first using the conventions below. Do not allocate issue-local REQ/AC or duplicate task state here. -->

## Context for the repository change

<!-- Describe the observation, evidence or proposed scope change, without creating a parallel requirements/acceptance checklist. Business requirements, examples and UI wording are Polish; engineering guidance and identifiers are English. -->

## What belongs in the repository task

Use the [task conventions](../../docs/specs/README.md#project-and-task-conventions) and [specification style](../../docs/specification-style.md): actor/goal, one bounded demonstrable flow, qualified canonical REQ/AC coverage, inputs/units/source authority, exclusions, typed dependencies (target, scope, condition, phase), decision gates, implementation state, separate readiness and evidence. Keep shared rules at their canonical owner. A new requirement belongs in that owner, not this issue.

Record applicable [design/reuse](../../docs/design-system.md#ui-design) and [accessibility](../../docs/design-system.md#ui-accessibility) controls in the task: existing tokens/components, reasons and placement for new components, visual comparison, relevant states, keyboard/focus/contrast, phone/desktop and production tablet.

Apply [assurance](../../docs/engineering-assurance.md#ass-risk): data class/purpose/minimum/retention/owner, server read/write/approval rights, validation/trust boundary, write failure/retry/concurrency, history, persistent migration/backup/restore, legal applicability and responsible approver. State why a control is inapplicable rather than silently omitting it. Link source-specific controls, not just a generic promise of security.

Completion evidence belongs only in the repository task: artifact/PR/commit SHA, date/environment, exact REQ/AC results, permission/error/boundary checks, recovery evidence and explicit omissions. Preserve history and recovery; do not call a skipped check passed. Legal/operational review must be complete before applicable actual use, or that use remains blocked. Distinguish parent scope, contract input, implementation prerequisite, optional adapter and release gate; a synthetic demonstration is not real-data approval. Technical proposals stay separate from mandatory behavior.

Do not maintain a second task checklist, dependency graph or implementation status here. A historical issue's migration/retirement note describes moved requirements, never a completed feature. Retirement requires the separately authorized postmerge [protocol](../../docs/migrations/spec-library/retirement.md).
