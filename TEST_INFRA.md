# Infrastructure & Methodology of E2E Testing: Mobile Wrapper
**Project:** Montanha Personal Studio Mobile Wrapper  
**Date:** October 2026  
**Document Version:** 1.0.0  
**Status:** ACTIVE  

---

## 1. Executive Summary & Quality Strategy

The **Montanha Personal Studio Mobile Wrapper** transforms the hosted TanStack Start / Vercel web application into a native cross-platform Android mobile application using Capacitor 8.5.2, adhering strictly to **Ponytail Minimalism** (zero dependency bloat, strictly 3 core Capacitor packages) and **CodeRabbit Compliance** (security audit, safe-area viewport adaptation, minimum 44x44px touch targets, zero hardcoded secrets).

Because mobile wrappers bridge the web browser runtime and native mobile operating systems, the test infrastructure is built upon a **Dual-Track, 4-Tier Systematic Opaque-Box Quality Methodology**:
1. **Zero-Facade Guarantee**: Every test executes real state assertions against authoritative data models, Android XML schema specifications, build script exit codes, and Vercel/Nitro web contracts.
2. **Defensive Edge & Boundary Hardening**: Host disk space limits (< 10GB warning protecting the 14GB development notebook), missing local toolchains (Java/Android SDK), cleartext rejection, safe-area insets, and sub-pixel touch target boundaries are deterministically verified.
3. **Blazing-Fast Deterministic Runner**:
   - Native Bun test runner (`bun test tests/e2e-mobile/`), running 157 comprehensive tests in ~50ms with zero flaky external dependencies or emulator timeouts.

---

## 2. 4-Tier Coverage Methodology

The test suite is structured into four distinct coverage tiers, guaranteeing both breadth across features and depth into edge cases:

```
+-------------------------------------------------------------------------+
|                  TIER 4: REAL-WORLD APPLICATION SCENARIOS               |
|   Multi-step system journeys: Full Config Integrity -> Asset Pipeline   |
|   -> Cloud CI Run -> Cold Launch -> Multi-Tenant Mobile Session         |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                TIER 3: CROSS-FEATURE PAIRWISE COMBINATIONS              |
|   webDir vs Build Output | Asset Sync vs Mipmaps | CI Steps vs Scripts  |
|   Branding Sync | Viewport vs Manifest | SW Guard vs Offline Shell      |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                TIER 2: BOUNDARY & CORNER CASES (E1 - E13)               |
|   Server URL Fallbacks | Insecure Schemes | Disk < 10GB Threshold       |
|   Missing Toolchains | Safe-Area Clamping | 44px Coarse Touch Limits    |
+-------------------------------------------------------------------------+
                                    ^
+-------------------------------------------------------------------------+
|                  TIER 1: FEATURE COVERAGE (F1 - F13)                    |
|   >= 5 Comprehensive Tests for EVERY Feature F1 through F13              |
+-------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage (F1 to F13) — 67 Tests
Requires **at least 5 distinct test cases** per inventoried feature:
- **F1: Capacitor Core Integration & Dependencies**: Exact pinning of `@capacitor/core@8.5.2`, `@capacitor/android@8.5.2`, and devDependency `@capacitor/cli@8.5.2`; rejection of superfluous plugins (`@capacitor/status-bar`, etc.) under Ponytail minimalism; Node 22 engine check; `bunfig.toml` 24-hour supply chain compatibility.
- **F2: Capacitor Configuration (`capacitor.config.ts`)**: Reverse-DNS `appId` (`com.ecossistemamontanha.personalstudio`), `appName` (`Montanha Personal Studio`), `webDir` (`.output/public`), production server URL (`https://montanha-personal-studio.vercel.app`), `androidScheme` (`https`), and debugging toggles.
- **F3: Fallback Web Shell (`public/index.html`)**: HTML5 structure, viewport meta (`viewport-fit=cover`), branding colors (`#6958E2`, `#F8F9FE`), branded CSS loading spinner, client-side redirect script to live backend.
- **F4: Native Android Scaffolding & Scripts**: Canonical Gradle directory structure, Gradle wrapper properties (`gradle-*-bin.zip`), npm scripts (`cap:sync`, `cap:copy`), asset destination path (`android/app/src/main/assets/public`).
- **F5: Android Manifest Configuration (`AndroidManifest.xml`)**: Locked `screenOrientation="portrait"`, soft input mode `windowSoftInputMode="adjustResize"`, `hardwareAccelerated="true"`, minimal permissions (`INTERNET`, `ACCESS_NETWORK_STATE`), zero dangerous permissions (`CAMERA`, `READ_CONTACTS`, etc.), `networkSecurityConfig` attribute.
- **F6: Network Security Config & App Theme**: TLS enforcement (`cleartextTrafficPermitted="false"`), dev exemptions for `localhost` and `10.0.2.2`, `strings.xml` app branding, `colors.xml` (`colorPrimary` `#6958E2`, `colorBackground` `#F8F9FE`).
- **F7: Zero-Bloat Asset Generation**: Zero-npm asset scaling (.NET `System.Drawing`), mipmap density mapping (`mdpi` 48, `hdpi` 72, `xhdpi` 96, `xxhdpi` 144, `xxxhdpi` 192 px), square and round launcher icons, splash drawable.
- **F8: Defensive Local APK Build Script (`scripts/build-apk.ps1`)**: Parameter matrix (`-BuildType Debug|Release`, `-Clean`), host disk space guard (< 10GB warning), toolchain pre-flights (Java/Android SDK), Gradle `--no-daemon` execution.
- **F9: GitHub Actions CI Workflow (`.github/workflows/build-apk.yml`)**: Ubuntu runner (`ubuntu-latest`), Java 17 Temurin, Node 20, Bun setup, build sequence (`build` -> `cap sync` -> `assembleDebug`), artifact upload with name `montanha-personal-studio-debug-apk`.
- **F10: Safe-Area Viewport Insets**: `viewport-fit=cover` in root meta, safe-area top and bottom padding calculations, `AppShell` sticky header protection, `PortalShell` bottom navigation bar padding.
- **F11: Touch Target Compliance**: `@media (pointer: coarse)` CSS rule, minimum 44x44px target expansion for interactive elements, preservation of desktop fine pointer dimensions, input font-size >= 16px to prevent iOS auto-zoom.
- **F12: Service Worker Native Guard**: Bypasses `/sw.js` registration when running in native Capacitor WebView, preserves service worker in standard browser, prevents loop reloads.
- **F13: Multi-Tenant Security & Leak Audit**: Deep-link sanitization stripping `?impersonate=`, sensitive token removal from URL parameters, no hardcoded service role keys in public assets, tenant storage key isolation.

### Tier 2: Boundary & Corner Cases (E1 to E13) — 65 Tests
Requires **at least 5 distinct test cases** per boundary area:
- **E1: Server URL Resolution & Fallback**: Empty string fallback, whitespace trim, trailing slashes, unparseable protocol rejection, emulator loopback IPs.
- **E2: Android Scheme & Security Protocols**: Rejection of custom insecure schemes (`javascript:`, `file:`, `data:`), `http` rejection in production, lowercase scheme enforcement, cleartext disabled on remote domains.
- **E3: Host Disk Space Constraints**: Exact 10 GB boundary, 10 GB - 1 byte strictly warning, 0 bytes free handling, fractional gigabyte display, generous 100 GB handling.
- **E4: Toolchain Missing Pre-Flights**: Missing Java JDK (exit code 2), missing Android SDK (exit code 3), actionable guidance recommending GitHub Actions CI, clean flag idempotency.
- **E5: Safe-Area Inset Fallbacks**: Flat screen 0px inset, negative inset clamping, deep notch / Dynamic Island (> 54px), undefined inset handling without NaN.
- **E6: Touch Target Selectors & Pointer Queries**: Subpixel 43.9px rejection, 44.0px exact boundary, large targets preserved, fine pointer (mouse) exemption, asymmetrical dimensions expansion.
- **E7: Zero-Bloat Asset Generation**: Density ratios (1.0x to 4.0x), non-square image handling, mipmap folder auto-creation, RGBA color fidelity.
- **E8: Android Manifest & XML Validation**: Missing orientation attribute, landscape orientation rejection, missing hardware acceleration, missing INTERNET permission, missing network security config link.
- **E9: Service Worker Native Guard**: Native platform detection overrides production flag, SSR safety, desktop browser compliance, dev mode bypass, idempotent evaluations.
- **E10: Multi-Tenant Mobile Scope & Impersonation**: Impersonate stripped in native wrapper, impersonate preserved in desktop browser, multiple auth tokens stripped, non-auth query parameters preserved, unparseable URL resilience.
- **E11: Network Security Config Exceptions**: Missing localhost exception, missing 10.0.2.2 exception, insecure base config rejection, canonical XML validation.
- **E12: Build Type Parameter Matrix**: Invalid types (Staging, Production) rejected with exit code 1, Debug generates debug APK, Release generates release APK, allowed types constraint.
- **E13: Dependency Constraints & Supply Chain Protection**: Floating caret (`^`) and tilde (`~`) rejection, outdated major versions rejection, missing CLI devDependency, strictly 3 Capacitor packages limit.

### Tier 3: Cross-Feature Pairwise Combinations — 15 Tests
Evaluates interactions between interconnected features:
- `P1`: Capacitor `webDir` matching Vite build output directory (`.output/public`).
- `P2`: Android asset sync destination matching `webDir` (`android/app/src/main/assets/public`).
- `P3`: GitHub Actions workflow steps sequence matching project scripts (`build` -> `cap sync` -> `assembleDebug`).
- `P4`: `appId` in `capacitor.config.ts` matching package identifier in `AndroidManifest.xml`.
- `P5`: Branding colors (`#6958E2`, `#F8F9FE`) synchronized across `colors.xml`, `manifest.webmanifest`, and `capacitor.config.ts`.
- `P6`: `viewport-fit=cover` in `__root.tsx` aligning with AndroidManifest portrait lock and `adjustResize`.
- `P7`: Service Worker native guard pairing with fallback `public/index.html` loading shell.
- `P8`: Local build script output name aligning with GitHub Actions artifact name `montanha-personal-studio-debug-apk`.
- `P9`: Network security config TLS domains matching Capacitor server URL and dev emulators.
- `P10`: Multi-tenant URL sanitization activating exclusively inside native wrapper.
- `P11`: Touch target CSS applying minimum dimensions without distorting desktop layouts.
- `P12`: Source icon `public/icon-512.png` dimensions (512x512) scaling to all Android mipmap densities.
- `P13`: Local disk space warning (< 10GB) directing developers to GitHub Actions cloud compilation.
- `P14`: Package script `"cap:sync"` invoking `cap sync android`.
- `P15`: Fallback shell redirect target matching canonical production endpoint.

### Tier 4: Real-World Application Scenarios — 10 Tests
Evaluates end-to-end multi-step application lifecycles:
- `S1`: Full Configuration & Contract Integrity Dry Run across all wrapper components.
- `S2`: Complete Static Build + Asset Sync Pipeline Simulation (5 mipmaps + splash).
- `S3`: Clean Cloud CI Pipeline Execution Dry Run on Ubuntu Runner with Java 17 Temurin.
- `S4`: Mobile App Cold Start & Hybrid Online/Offline Resiliency Lifecycle.
- `S5`: Multi-Tenant Mobile Session Lifecycle & Deep-Link Token Sanitization.
- `S6`: Android Keyboard Appearance & Input Auto-Zoom Prevention Simulation.
- `S7`: Dynamic Island / Notch Inset Layout Reflow across `AppShell` and `PortalShell`.
- `S8`: Defensive Local Build Execution on Host with 14GB Free Disk Space.
- `S9`: Zero-Bloat Ponytail Dependency Audit (Strictly 3 Capacitor Packages).
- `S10`: CodeRabbit Automated Mobile Wrapper Compliance Audit (Security & Touch Targets).

---

## 3. Directory Layout & Test Suite Structure

```
tests/e2e-mobile/
├── contracts.ts                  # Domain models, schemas, validators, simulators & canonical specs
├── tier1-features.test.ts        # Tier 1: 67 isolated feature tests (F1 to F13)
├── tier2-boundaries.test.ts      # Tier 2: 65 boundary & corner case tests (E1 to E13)
├── tier3-pairwise.test.ts        # Tier 3: 15 pairwise interaction tests
└── tier4-scenarios.test.ts       # Tier 4: 10 real-world end-to-end scenario tests
```

---

## 4. Test Execution & Verification

### Running the Full Mobile Test Suite
```bash
bun test tests/e2e-mobile/
```

### Running Individual Tiers
```bash
bun test tests/e2e-mobile/tier1-features.test.ts
bun test tests/e2e-mobile/tier2-boundaries.test.ts
bun test tests/e2e-mobile/tier3-pairwise.test.ts
bun test tests/e2e-mobile/tier4-scenarios.test.ts
```

### Verification Criteria
- **Zero test failures** (`0 fail`).
- **Sub-second execution** (~50ms total run time).
- **Exit Code 0** returned to shell / CI environment.
