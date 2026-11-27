# Investment scenario implementation

Scope and behavior belong to [TASK-INV-001–005](../projects/investment-scenarios.md#task-inv-001) and their SCN/PRC/STK/ECO owners. This document explains the implementation, not a second task tracker. The [MVP-1 plan](../plans/2026-11-25-1641-feat-mvp-one-investment-scenario-plan.md) and [MVP-2 plan](../plans/2026-11-26-2012-feat-mvp-two-investment-comparison-plan.md) supply the implementation decisions.

## Application and domain boundaries

The existing Next/Payload application gains `/investment-scenarios` and `/investment-scenarios/[scenarioKey]`. Thin, dynamic server pages perform authenticated initial reads. The client workspace uses the existing login at `/recipes`, shared components/tokens and an XState lifecycle. Commands remain independently authenticated server functions; rendering a page grants no write authority.

`investment-scenarios/service.ts` owns persistence, publication authorization and immutable revision/run identity. `evaluate.ts` composes three pure owners:

- `process-execution/evaluate.ts`: supplied priority/dependencies, simultaneous resource reservations, active labor, phase children, deadlines and sourced wait windows;
- `stock-inventory/evaluate.ts`: explicitly hypothetical lots, movements, source parts, admission, readiness, returns/refunds and supported sales;
- `economics-investment/`: exact decimal money, disclosed cost bases, one-time pool allocation, conditional sold-mix requirements and independent qualifications.

No hypothetical evaluation writes recipes, publications, users or operational stock/workforce records. Recipe requirements come from the authorized frozen publication and existing base-scaling function. Automatic `recipe:` consumption identities are reserved; do not enter the same consumption again as a manual movement. The frozen v1 evaluator selects the stable lowest material lot ID. V2 allocates eligible material FEFO across lots, retaining batch/WIP coverage and withholding unsupported sales without erasing provisional chronology. This is not MRP or automatic purchasing/rescheduling.

## Inputs, numbers and time

The versioned input/report schemas are JSON-safe. V1 inputs, fingerprints and `investment-scenario/1` reports remain readable/replayable through frozen readers and evaluators. Conversion creates a new v2 draft/revision, never a historical JSON rewrite. V2 uses `investment-scenario/2`, product identities separate from production batches, opening/closing WIP and boundary exposure. Evidence records measured/estimated/missing status, unit, source/date/version, period and context. Missing values remain missing; an explicit zero has a different representation. Operation contexts retain publication, scale, staffing, machine and conditions. Reusing a measurement in a changed context requires an estimate referencing the observation, or missing target time.

Instants carry offsets; interval boundaries are checked against their declared IANA zone. Resources use explicit availability windows. Weekly days/hours are descriptive availability parameters, not automatic required labor or an implicit recurrence engine. The evaluator does not use the system clock. Report dates use the saved zone.

Mass inputs retain DEC-001 precision; g/kg normalize exactly. Explicit sourced yield conversions bridge mass/pieces. Resource-capacity comparisons retain exact rational values rather than comparing rounded presentation amounts. Inventory has its own zero-capable quantity parser, leaving positive recipe-mass validation intact. Monetary calculations use rationals internally, decimal strings externally, and half-away-from-zero rounding at 0.01 PLN report boundaries. Negative totals remain signed. Full unit costs and component costs cannot charge the same product expense twice.

The required-sales calculation uses an explicit sold-piece mix, production losses and period budget, rounds to a whole mix bundle, recomputes production/cost coverage and qualifies period-mismatched capacity comparisons. It is not a demand forecast. Day results never certify recurring monthly owner-net income or payback.

V2 month evaluation maps explicit dated production/sales profiles, counts opening stock once and reconciles sourced dated replenishment/preparation with costs, labor and resources. It is not week×4 or a full monthly scheduler. Repeatability, owner-net and recurring cash have independent qualifications. The cash ledger reconciles expense identities and aggregate inclusions once; owner economic value is distinct from the income provision. Four sourced initial-outlay categories feed simple payback only from qualified positive post-owner cash. Known zero/negative cash gives `no-finite-payback`; missing basis gives `unverified`, not zero. The complete synthetic month in `src/tests/fixtures/investment-month.ts` is not a tax or demand default.

## Access and append protocol

AS1 uses the existing `administrator` role as a scenario owner. Anonymous users, editors and bakers have no scenario access. An administrator can read/append only their own records; another administrator's resource is inaccessible. There is no scenario approval operation.

Three additive Payload collections store business-sensitive JSON:

| Collection | Identity and contents |
|---|---|
| `scenario-revisions` | Owner/scenario/revision, previous revision, owner/request key, schema version, fingerprint, sourced inputs and server-resolved publication snapshots |
| `scenario-runs` | Owner/request key, immutable revision relation/fingerprint, engine version, exact saved input and computed report |
| `scenario-comparisons` | Owner/request/comparison identity, ordered run relationships, fingerprint and versioned selection manifest |

`comparison-service.ts` authorizes every run/revision/publication edge, accepts at least two distinct v2 scenario keys and pins exact run IDs/fingerprints. The comparison action recomputes saved revisions through the common engine; reopening reads the pinned reports, not latest revisions. The manifest contains identity/order, not copied financial calculations. `/investment-scenarios/comparisons/[comparisonKey]` reopens the selection, including missing-data variants; unlike bases suppress numerical deltas. Same-key identical retries return the confirmed selection; changed order/content conflicts.

Unique composite indexes back revision and request identities. User Local API operations explicitly use actor context and `overrideAccess: false`; direct REST/Admin create/update/delete operations deny. GraphQL remains disabled. Only the server service supplies the append context, with collection hooks rechecking actor and owner. Its process-stable symbol is shared across separate Next config/action bundles and cannot be supplied through JSON. Built HTTP smoke tests exercise this boundary, not just an in-process service call.

Saves use the existing dedicated-connection `BEGIN IMMEDIATE` SQLite adapter. Inside one request transaction, the service checks identical replay, expected head, authorized publications and the next append; only a successful COMMIT returns a receipt. An identical key/content/head retry returns the same record. Changed content/head under that key conflicts. Competing successors cannot silently overwrite. Runs use the same transaction/receipt rule after deterministic evaluation. There is no automatic write retry.

The workspace retains a request key across uncertain failures, keeps unsaved edits and prior confirmed reports, labels differing input/revision state, permits historical revision selection, and rejects obsolete responses after navigation/logout. Logout clears protected view state before its network request completes. Schema errors are mapped to Polish text and links reveal/focus the corresponding input. Persisted run JSON is validated before presentation.

## Migration and recovery

`20261125_155445_mvp_one` adds only the two scenario tables, their indexes and native Payload locked-document relation columns. Its generated snapshot accompanies the reviewed migration. Existing recipe and publication rows are preserved. Destructive `down` is for isolated tests; it removes scenario references and dependent runs before revisions. Production rollback uses the previous app and verified pre-migration backup, not `down` against an unknown target.

`20261127_093515_mvp_two_comparisons` adds the comparison table, indexes and relationships without converting v1/v2 bodies. The scenario suite applies down/up only in its temporary database with populated v1/v2 runs, and checks exact run preservation. Its final fresh-process restore reads all saved financial cases and manifests with owner isolation. This synthetic drill is not authorization for production rollback: stop writes, verify a separate backup restore, and use the matching prior app plus verified pre-migration backup. Do not run destructive down against live comparison history.

Follow [ADR-001 operations](mvp-zero.md#operations): stop writes, back up the database and required environment configuration, verify restore to a separate nonpublic target, then explicitly confirm the migration target and verified backup path. No new media is introduced. The scenario integration suite closes its synthetic source, copies to a distinct restored database and uses a fresh process to verify exact revisions/runs, publication history and cross-owner denial. The recipe suite additionally applies the additive migration to populated recipe data and checks preservation.

The repository/service owner still owns actual deployment, retention, backup frequency/RPO/RTO and actual-data P0 approval. Accounts/session identifiers are personal; financial assumptions/results and recipe snapshots are business-sensitive. Resource roles are anonymous capacities, not employee records. Provenance should avoid unnecessary personal names. Actual controller/privacy/legal decisions and financial-input applicability remain release-owner responsibilities; no legal, tax, food-safety, demand or real-data approval is inferred from synthetic verification.

## Verification commands

Use `.node-version` and `npm ci`, then the existing lint/type/unit/integration/build/security checks. `npm run test:scenarios` runs just the isolated scenario database suite. `npm run test:scenarios:production` owns a fresh OS-temporary synthetic target and checks built server actions, authentication, ownership-filtered REST, reference results and forged-write refusal. `npm run test:production` retains the existing recipe HTTP proof. The CI workflow includes both smoke entries; this does not assert activated branch protection or a completed hosted CI run.

For caller browser review, after building the current source run `SCENARIO_BROWSER=1 SMOKE_PASSWORD='<explicit disposable synthetic password>' npm exec --yes --package=node@24.22.3 -- npm run test:scenarios:production`. The smoke binds loopback port 3198, owns/cleans its temporary database, prints the pinned comparison URL and holds until SIGINT/SIGTERM. Only this explicit browser mode echoes a caller-provided synthetic credential; generated passwords/tokens/secrets are never printed. Do not capture credential lines in shared logs/screenshots or use actual credentials. Without explicit `SMOKE_PASSWORD`, restart with one for browser login. Stop the held smoke before another run on 3198.

See [MVP-1 receipts](../verification/mvp-one.md) and [MVP-2 evidence](../verification/mvp-two.md) for observed results and explicitly pending caller checks. Script assertions and fixture expectations are not observed HTTP/browser results.
