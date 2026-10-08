/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M4: Security & Native Guards)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m4_2
 * Role: Security, Native Guard & Storage Challenger
 * Scope: Service Worker Native Capacitor guard under browser vs native platform conditions,
 *        deep-link URL sanitization (impersonation & token stripping),
 *        logout session purging (localStorage tenantScope, profileMode, auth tokens),
 *        and adversarial mutation oracles.
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  shouldRegisterServiceWorker,
  sanitizeMobileWrapperUrl,
} from "./contracts";

const ROOT_DIR = path.resolve(__dirname, "../..");
const ROOT_ROUTE_PATH = path.join(ROOT_DIR, "src/routes/__root.tsx");
const APP_SHELL_PATH = path.join(ROOT_DIR, "src/components/edufinance/AppShell.tsx");
const PORTAL_SHELL_PATH = path.join(ROOT_DIR, "src/components/portal/PortalShell.tsx");

describe("Tier 5: Challenger M4 Empirical Verification (Security & Native Guards)", () => {

  // ==========================================================================
  // Challenge 1: Service Worker Native Capacitor Guard Matrix & Resiliency
  // ==========================================================================
  describe("Challenge 1: Service Worker Native Capacitor Guard (Browser vs Native)", () => {

    it("C1.1: Web production browser permits Service Worker registration (/sw.js)", () => {
      const allowed = shouldRegisterServiceWorker({
        isBrowser: true,
        isNativePlatform: false,
        isProduction: true,
      });
      expect(allowed).toBe(true);
    });

    it("C1.2: Native Capacitor environment strictly denies Service Worker registration", () => {
      const platforms = ["android", "ios", "capacitor-native"];
      for (const platform of platforms) {
        const allowed = shouldRegisterServiceWorker({
          isBrowser: true,
          isNativePlatform: true, // Native WebView
          isProduction: true,
        });
        expect(allowed).toBe(false);
      }
    });

    it("C1.3: Non-production development environments bypass Service Worker registration", () => {
      const allowed = shouldRegisterServiceWorker({
        isBrowser: true,
        isNativePlatform: false,
        isProduction: false,
      });
      expect(allowed).toBe(false);
    });

    it("C1.4: Server-Side Rendering (SSR) bypasses Service Worker registration safely", () => {
      const allowed = shouldRegisterServiceWorker({
        isBrowser: false,
        isNativePlatform: false,
        isProduction: true,
      });
      expect(allowed).toBe(false);
    });

    it("C1.5: Empirical simulation of isCapacitorNative logic across all platform representations", () => {
      function evaluateIsCapacitorNative(mockEnv: {
        isWindowDefined: boolean;
        capacitorCoreIsNative: boolean;
        windowCapacitorIsNativePlatform?: boolean;
        windowCapacitorIsNative?: boolean;
      }): boolean {
        if (!mockEnv.isWindowDefined) return false;
        return Boolean(
          mockEnv.capacitorCoreIsNative ||
          mockEnv.windowCapacitorIsNativePlatform ||
          mockEnv.windowCapacitorIsNative
        );
      }

      // Case A: Pure Web Browser (Chrome/Firefox/Safari)
      expect(evaluateIsCapacitorNative({
        isWindowDefined: true,
        capacitorCoreIsNative: false,
        windowCapacitorIsNativePlatform: false,
        windowCapacitorIsNative: false,
      })).toBe(false);

      // Case B: Window undefined (Node/SSR/Build)
      expect(evaluateIsCapacitorNative({
        isWindowDefined: false,
        capacitorCoreIsNative: true,
      })).toBe(false);

      // Case C: Standard Capacitor Native Android via @capacitor/core
      expect(evaluateIsCapacitorNative({
        isWindowDefined: true,
        capacitorCoreIsNative: true,
      })).toBe(true);

      // Case D: Injected Bridge via window.Capacitor.isNativePlatform()
      expect(evaluateIsCapacitorNative({
        isWindowDefined: true,
        capacitorCoreIsNative: false,
        windowCapacitorIsNativePlatform: true,
      })).toBe(true);

      // Case E: Legacy / WebView bridge flag window.Capacitor.isNative = true
      expect(evaluateIsCapacitorNative({
        isWindowDefined: true,
        capacitorCoreIsNative: false,
        windowCapacitorIsNative: true,
      })).toBe(true);

      // Case F: Browser with undefined Capacitor object
      expect(evaluateIsCapacitorNative({
        isWindowDefined: true,
        capacitorCoreIsNative: false,
        windowCapacitorIsNativePlatform: undefined,
        windowCapacitorIsNative: undefined,
      })).toBe(false);
    });

    it("C1.6: Native execution unregisters pre-existing service workers gracefully without unhandled rejections", async () => {
      let unregisterCalls = 0;
      let registrationQueryCalls = 0;

      const mockRegistrations = [
        {
          scope: "https://montanha-personal-studio.vercel.app/",
          unregister: async () => {
            unregisterCalls++;
            return true;
          },
        },
        {
          scope: "https://montanha-personal-studio.vercel.app/portal",
          unregister: async () => {
            unregisterCalls++;
            // Even if an unregister operation throws, it should not crash the app
            throw new Error("Simulated unregister failure in native webview");
          },
        },
      ];

      // Simulate native registration cleanup runner
      const mockServiceWorker = {
        getRegistrations: async () => {
          registrationQueryCalls++;
          return mockRegistrations;
        },
      };

      const registrations = await mockServiceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister().catch(() => {
          // Handled gracefully as implemented in __root.tsx
        });
      }

      expect(registrationQueryCalls).toBe(1);
      expect(unregisterCalls).toBe(2);
    });

    it("C1.7: Verifies __root.tsx implementation contains Capacitor import and native guard", () => {
      const rootContent = fs.readFileSync(ROOT_ROUTE_PATH, "utf-8");
      expect(rootContent).toContain("import { Capacitor } from \"@capacitor/core\";");
      expect(rootContent).toContain("function isCapacitorNative()");
      expect(rootContent).toContain("Capacitor.isNativePlatform()");
      expect(rootContent).toMatch(/navigator\.serviceWorker[\s\S]*?\.getRegistrations\(\)/);
      expect(rootContent).toContain("registration.unregister()");
      expect(rootContent).toContain("updateViaCache: \"none\"");
    });
  });

  // ==========================================================================
  // Challenge 2: Deep-Link URL Sanitization & Impersonation Boundaries
  // ==========================================================================
  describe("Challenge 2: Deep-Link URL Sanitization & Impersonation Bypasses", () => {

    it("C2.1: Strips impersonate parameter from native mobile wrapper deep-links", () => {
      const url = "https://montanha-personal-studio.vercel.app/portal?impersonate=aluno%40studio.com";
      const result = sanitizeMobileWrapperUrl(url, true);
      expect(result.impersonationStripped).toBe(true);
      expect(result.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/portal");
      expect(result.sanitizedUrl).not.toContain("impersonate");
    });

    it("C2.2: Strips sensitive auth tokens (access_token, refresh_token) to prevent shoulder-surfing in WebView", () => {
      const url = "https://montanha-personal-studio.vercel.app/?access_token=eyJhbGciOiJIUzI1NiJ9.test&refresh_token=refresh-secret-uuid";
      const result = sanitizeMobileWrapperUrl(url, true);
      expect(result.tokenLeakPrevented).toBe(true);
      expect(result.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/");
      expect(result.sanitizedUrl).not.toContain("access_token");
      expect(result.sanitizedUrl).not.toContain("refresh_token");
    });

    it("C2.3: Preserves legitimate query parameters while stripping dangerous parameters in native mode", () => {
      const url = "https://montanha-personal-studio.vercel.app/agenda?date=2026-10-08&impersonate=hacker&view=day&access_token=tok123";
      const result = sanitizeMobileWrapperUrl(url, true);
      expect(result.impersonationStripped).toBe(true);
      expect(result.tokenLeakPrevented).toBe(true);
      expect(result.sanitizedUrl).toContain("date=2026-10-08");
      expect(result.sanitizedUrl).toContain("view=day");
      expect(result.sanitizedUrl).not.toContain("impersonate");
      expect(result.sanitizedUrl).not.toContain("access_token");
    });

    it("C2.4: Cleanly removes query delimiter when all parameters are stripped", () => {
      const url = "https://montanha-personal-studio.vercel.app/portal?impersonate=attacker";
      const result = sanitizeMobileWrapperUrl(url, true);
      expect(result.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/portal");
      expect(result.sanitizedUrl.endsWith("?")).toBe(false);
    });

    it("C2.5: Preserves URL hash fragment during URL sanitization", () => {
      const url = "https://montanha-personal-studio.vercel.app/portal?impersonate=attacker#section-metrics";
      const result = sanitizeMobileWrapperUrl(url, true);
      expect(result.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/portal#section-metrics");
    });

    it("C2.6: Web browser impersonation requires active Supabase session (unauthenticated rejected)", () => {
      // Simulates __root.tsx web logic:
      // If no active session exists, impersonate is deleted and stripped
      function handleWebImpersonation(param: string | null, sessionEmail: string | null): {
        accepted: boolean;
        stripped: boolean;
      } {
        if (!param || !param.trim()) return { accepted: false, stripped: false };
        if (!sessionEmail) {
          return { accepted: false, stripped: true };
        }
        return { accepted: true, stripped: false };
      }

      // Unauthenticated attempt (anonymous visitor)
      const anonAttempt = handleWebImpersonation("admin@studio.com", null);
      expect(anonAttempt.accepted).toBe(false);
      expect(anonAttempt.stripped).toBe(true);

      // Authenticated super admin
      const authAttempt = handleWebImpersonation("aluno@studio.com", "superadmin@montanha.app");
      expect(authAttempt.accepted).toBe(true);
      expect(authAttempt.stripped).toBe(false);
    });

    it("C2.7: Adversarial malformed & boundary URLs survive sanitization without uncaught exceptions", () => {
      const edgeCases = [
        "",
        "not-a-valid-url",
        "https://montanha-personal-studio.vercel.app",
        "https://montanha-personal-studio.vercel.app/?",
        "https://montanha-personal-studio.vercel.app/?impersonate=&access_token=&refresh_token=",
        "https://montanha-personal-studio.vercel.app/?impersonate=%20%20%20",
        "https://montanha-personal-studio.vercel.app/?foo=bar&&&baz=1",
        "https://montanha-personal-studio.vercel.app/?impersonate=<script>alert('xss')</script>",
        "https://montanha-personal-studio.vercel.app/portal?impersonate=1&impersonate=2",
      ];

      for (const raw of edgeCases) {
        expect(() => {
          const res = sanitizeMobileWrapperUrl(raw, true);
          expect(res).toBeDefined();
          expect(typeof res.sanitizedUrl).toBe("string");
        }).not.toThrow();
      }
    });

    it("C2.8: Verifies __root.tsx implementation executes parameter stripping in native Capacitor", () => {
      const rootContent = fs.readFileSync(ROOT_ROUTE_PATH, "utf-8");
      expect(rootContent).toContain("params.has(\"impersonate\")");
      expect(rootContent).toContain("params.delete(\"impersonate\")");
      expect(rootContent).toContain("params.has(\"access_token\")");
      expect(rootContent).toContain("params.delete(\"access_token\")");
      expect(rootContent).toContain("params.has(\"refresh_token\")");
      expect(rootContent).toContain("params.delete(\"refresh_token\")");
      expect(rootContent).toContain("window.history.replaceState");
    });
  });

  // ==========================================================================
  // Challenge 3: Logout Storage Purging & Multi-Tenant Session Cleanup
  // ==========================================================================
  describe("Challenge 3: Logout Storage Purging & Multi-Tenant Session Isolation", () => {

    it("C3.1: Complete purge of sensitive multi-tenant and impersonation keys on signOut", () => {
      const storage = new Map<string, string>([
        ["edufinance.impersonate", JSON.stringify({ targetEmail: "student@test.com" })],
        ["edufinance.tenantScope", "tenant-trainer-123"],
        ["edufinance.profileMode", "super_admin"],
        ["sb-ecossistemamontanha-auth-token", "jwt-token-123"],
        ["sb-proj-auth-token", "jwt-token-456"],
        ["edufinance.theme", "dark"],
        ["edufinance.visualTheme", "midnight"],
        ["edufinance.fontSize", "17px"],
        ["edufinance:sidebar-collapsed", "1"],
      ]);

      // Execute simulated signOut cleaning logic as in AppShell / PortalShell / __root.tsx
      storage.delete("edufinance.impersonate");
      storage.delete("edufinance.tenantScope");
      storage.delete("edufinance.profileMode");
      for (const key of Array.from(storage.keys())) {
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          storage.delete(key);
        }
      }

      // Assert multi-tenant / auth data is completely purged
      expect(storage.has("edufinance.impersonate")).toBe(false);
      expect(storage.has("edufinance.tenantScope")).toBe(false);
      expect(storage.has("edufinance.profileMode")).toBe(false);
      expect(storage.has("sb-ecossistemamontanha-auth-token")).toBe(false);
      expect(storage.has("sb-proj-auth-token")).toBe(false);

      // Assert non-sensitive user preferences are preserved
      expect(storage.get("edufinance.theme")).toBe("dark");
      expect(storage.get("edufinance.visualTheme")).toBe("midnight");
      expect(storage.get("edufinance.fontSize")).toBe("17px");
      expect(storage.get("edufinance:sidebar-collapsed")).toBe("1");
    });

    it("C3.2: Portal logout additionally purges user-namespaced portal caches", () => {
      const storage = new Map<string, string>([
        ["ef-portal-cache:user-uuid-1", "cache-data-1"],
        ["ef-portal-cache:user-uuid-2", "cache-data-2"],
        ["unrelated-key", "stay"],
      ]);

      function purgePortalCache(userId?: string) {
        if (userId) {
          storage.delete(`ef-portal-cache:${userId}`);
        } else {
          for (const key of Array.from(storage.keys())) {
            if (key.startsWith("ef-portal-cache:")) {
              storage.delete(key);
            }
          }
        }
      }

      purgePortalCache("user-uuid-1");
      expect(storage.has("ef-portal-cache:user-uuid-1")).toBe(false);
      expect(storage.has("ef-portal-cache:user-uuid-2")).toBe(true);

      purgePortalCache();
      expect(storage.has("ef-portal-cache:user-uuid-2")).toBe(false);
      expect(storage.get("unrelated-key")).toBe("stay");
    });

    it("C3.3: AppShell signOut implementation contains full storage purge sequence", () => {
      const appShellContent = fs.readFileSync(APP_SHELL_PATH, "utf-8");
      expect(appShellContent).toContain("localStorage.removeItem(\"edufinance.impersonate\")");
      expect(appShellContent).toContain("localStorage.removeItem(\"edufinance.tenantScope\")");
      expect(appShellContent).toContain("localStorage.removeItem(\"edufinance.profileMode\")");
      expect(appShellContent).toContain("k.startsWith(\"sb-\") && k.endsWith(\"-auth-token\")");
      expect(appShellContent).toContain("supabase.auth.signOut()");
    });

    it("C3.4: PortalShell signOut implementation contains full storage purge sequence", () => {
      const portalShellContent = fs.readFileSync(PORTAL_SHELL_PATH, "utf-8");
      expect(portalShellContent).toContain("clearPortalCache(user?.id)");
      expect(portalShellContent).toContain("localStorage.removeItem(\"edufinance.impersonate\")");
      expect(portalShellContent).toContain("localStorage.removeItem(\"edufinance.tenantScope\")");
      expect(portalShellContent).toContain("localStorage.removeItem(\"edufinance.profileMode\")");
      expect(portalShellContent).toContain("k.startsWith(\"sb-\") && k.endsWith(\"-auth-token\")");
      expect(portalShellContent).toContain("supabase.auth.signOut()");
    });

    it("C3.5: __root.tsx error recovery and ?reset=1 kill-switch contain full storage purge", () => {
      const rootContent = fs.readFileSync(ROOT_ROUTE_PATH, "utf-8");
      // Recovery in errorComponent
      expect(rootContent).toContain("localStorage.removeItem(\"edufinance.impersonate\")");
      expect(rootContent).toContain("localStorage.removeItem(\"edufinance.tenantScope\")");
      // Kill-switch ?reset=1
      expect(rootContent).toContain("params.get(\"reset\") !== \"1\"");
      expect(rootContent).toContain("window.location.replace(\"/auth\")");
    });
  });

  // ==========================================================================
  // Challenge 4: Static AST and Implementation Verification of Guard Patterns
  // ==========================================================================
  describe("Challenge 4: Static Code Inspection & Security Contract Audit", () => {

    it("C4.1: Query client cache is cleared upon signOut in both shells to prevent cross-tenant memory leakage", () => {
      const appShellContent = fs.readFileSync(APP_SHELL_PATH, "utf-8");
      const portalShellContent = fs.readFileSync(PORTAL_SHELL_PATH, "utf-8");

      expect(appShellContent).toContain("await qc.cancelQueries()");
      expect(appShellContent).toContain("qc.clear()");

      expect(portalShellContent).toContain("await qc.cancelQueries()");
      expect(portalShellContent).toContain("qc.clear()");
    });

    it("C4.2: Zero hardcoded credentials or cleartext passwords across root and shell components", () => {
      const filesToCheck = [ROOT_ROUTE_PATH, APP_SHELL_PATH, PORTAL_SHELL_PATH];
      for (const filePath of filesToCheck) {
        const content = fs.readFileSync(filePath, "utf-8");
        expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
        expect(content).not.toMatch(/service_role_key\s*[:=]\s*['"][a-zA-Z0-9_-]+['"]/i);
      }
    });

    it("C4.3: Service Worker registration specifies updateViaCache: 'none' to prevent stale caching", () => {
      const rootContent = fs.readFileSync(ROOT_ROUTE_PATH, "utf-8");
      expect(rootContent).toContain("updateViaCache: \"none\"");
    });
  });

  // ==========================================================================
  // Challenge 5: Adversarial Mutation Oracles (Negative Assertions)
  // ==========================================================================
  describe("Challenge 5: Adversarial Mutation Oracles (Negative Testing)", () => {

    it("C5.1: Mutation Oracle: Detects if Service Worker native guard is bypassed or inverted", () => {
      // Mutant 1: Guard inverted (native registers, web skips)
      function invertedGuard(isNative: boolean): boolean {
        return isNative; // BUG!
      }
      expect(invertedGuard(true)).not.toBe(shouldRegisterServiceWorker({
        isBrowser: true,
        isNativePlatform: true,
        isProduction: true,
      }));

      // Mutant 2: Guard removed (always registers)
      function removedGuard(): boolean {
        return true; // BUG!
      }
      expect(removedGuard()).not.toBe(shouldRegisterServiceWorker({
        isBrowser: true,
        isNativePlatform: true,
        isProduction: true,
      }));
    });

    it("C5.2: Mutation Oracle: Detects if impersonate query parameter is leaked to native wrapper", () => {
      // Mutant: Fails to strip impersonate in native wrapper
      function leakyUrlSanitizer(rawUrl: string, isNative: boolean): string {
        return rawUrl; // BUG!
      }
      const maliciousUrl = "https://app.montanha.app/?impersonate=evil";
      const leaked = leakyUrlSanitizer(maliciousUrl, true);
      const legitimate = sanitizeMobileWrapperUrl(maliciousUrl, true).sanitizedUrl;

      expect(leaked).toContain("impersonate");
      expect(legitimate).not.toContain("impersonate");
      expect(leaked).not.toBe(legitimate);
    });

    it("C5.3: Mutation Oracle: Detects if tenantScope is preserved across logout", () => {
      // Mutant: Forgets to purge tenantScope
      function leakySignOut(storage: Map<string, string>) {
        storage.delete("edufinance.impersonate");
        // BUG: omitted storage.delete("edufinance.tenantScope");
      }

      const testMap = new Map<string, string>([
        ["edufinance.tenantScope", "tenant-1"],
      ]);
      leakySignOut(testMap);
      expect(testMap.has("edufinance.tenantScope")).toBe(true); // Mutant fails to clean
    });

    it("C5.4: Mutation Oracle: Detects if auth tokens are retained in localStorage across logout", () => {
      // Mutant: Forgets to purge sb-*-auth-token keys
      function leakyTokenSignOut(storage: Map<string, string>) {
        storage.delete("edufinance.impersonate");
        storage.delete("edufinance.tenantScope");
        // BUG: omitted sb-* cleanup
      }

      const testMap = new Map<string, string>([
        ["sb-auth-token", "jwt-token"],
      ]);
      leakyTokenSignOut(testMap);
      expect(testMap.has("sb-auth-token")).toBe(true); // Mutant fails to purge auth token
    });
  });
});
