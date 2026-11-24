# ADR-001 — MVP-0 application architecture

**Accepted 2026-11-24 under the user's autonomous implementation authority.** Technical acceptance covers the bounded architecture spike; actual-account/data release remains subject to the assurance policy.

One Next.js App Router application hosts the existing frontend in `(app)` and native Payload Admin/REST in `(payload)`. SQLite uses a persistent single-host filesystem; ephemeral/serverless filesystem deployment is not supported. The service owner supplies hosting, backups, operational retention and production secrets before actual use. Images/uploads are optional and excluded from this increment.

Verified combination: Payload/@payloadcms/next/@payloadcms/db-sqlite 3.94.2, Next 16.4.6, React 19.3.1, TypeScript 6.0.3, Node 24.22.3. Context7 main described forthcoming Payload 4 requirements; npm v3 metadata was checked directly. PostgreSQL is the alternative for multi-instance deployment; a beta TanStack adapter was rejected because the product explicitly requires native stable Next integration.

On 2026-11-24 the isolated SQLite spike allowed a synthetic user to create a recipe through native Admin, read it through authenticated REST (200), and rejected anonymous REST creation (403). A scoped architecture build passed with `NEXT_SPIKE=1` and production root smoke returned 200 on port 3002. This proves native runtime integration, not the full domain publication contract; frozen publication proof belongs to the recipe implementation. The temporary spike TypeScript scope excludes legacy TanStack modules pending migration and must be removed before full-app verification.

Trust boundaries: browser inputs → server schemas and collection ACLs → SQLite; Local API user calls explicitly retain access checks. Credentials, tokens and the DB remain outside git. Account data is personal; recipes are internal/business-sensitive. Anonymous callers and authenticated readers attempting draft access, publication or role escalation are the principal threats. Publication must be atomic, history immutable, errors visible, and exports permission-filtered.

Recovery: back up the stopped SQLite database plus environment configuration, restore to a separate nonpublic confirmed target, and verify frozen publication values/relations. Before real deployment the owner sets frequency/RPO/RTO and privacy/legal retention. Rollback uses the prior app revision and a verified pre-migration DB backup, never a destructive reset of an unknown database.
