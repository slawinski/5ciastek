# Security Review - 5ciastek

## Overview
The project implements standard security practices like input validation and modern tooling. However, several vulnerabilities were identified in dependencies.

## Findings

### 1. Dependency Vulnerabilities
`npm audit` identified 9 vulnerabilities (1 low, 5 moderate, 3 high):
- **Rollup (High):** Arbitrary File Write via Path Traversal (GHSA-mw96-cpmx-2vgc).
- **Seroval (High):** Multiple Denial of Service (DoS) vulnerabilities, Remote Code Execution (RCE) via JSON Deserialization, and Prototype Pollution (GHSA-3rxj-6cgf-8cfw).
- **Undici (Moderate):** Unbounded decompression chain in HTTP responses (GHSA-g9mf-h72j-4rw9).
- **JS-YAML (Moderate):** Prototype pollution in merge (GHSA-mh29-5h37-fv8m).

### 2. Input Validation
- **Zod:** The project uses `zod` for schema-based input validation (`fermentationSchema`), which is excellent for preventing malformed data and some injection attacks.
- **Server Functions:** `calculateFermentationTimesServer` is used via TanStack Start, which executes logic on the server, potentially reducing the exposure of client-side logic.

### 3. Client-Side Security
- **XSS:** No obvious use of `dangerouslySetInnerHTML`. React's default behavior handles most XSS protections.
- **CSRF:** TanStack Start and Router handle data mutations; ensure CSRF protection is configured if custom server endpoints are used.
- **Security Headers:** Basic meta tags are present, but more robust headers (CSP, HSTS, etc.) should be configured in the nitro/server setup.

### 4. Code Patterns
- **InputField:** The use of `[key: string]: any` for props in `InputField` is an anti-pattern. While not a direct security risk, it can lead to accidental exposure of sensitive data if not carefully managed.

## Recommendations
- **Audit Fix:** Run `npm audit fix` immediately to address vulnerable dependencies. Some may require manual updates if they are transitive.
- **Configure Security Headers:** Use Nitro's configuration to set secure HTTP headers:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Strict Typing:** Replace `any` in component props with more specific types to prevent unexpected behaviors.
- **Environment Secrets:** Ensure no API keys or secrets are committed (checked: none found in core files).
