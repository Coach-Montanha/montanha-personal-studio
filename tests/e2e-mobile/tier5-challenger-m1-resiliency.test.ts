/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M1 - Challenger 2)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m1_2
 * Role: Fallback Resiliency, Redirect Safety & Asset Integration Challenger
 * Scope: public/index.html behavior, DOM structure, viewport, offline toggle,
 *        redirect script execution, asset sync readiness, and edge cases.
 * ============================================================================
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as vm from "node:vm";

const ROOT_DIR = path.resolve(__dirname, "../..");

describe("Tier 5: Challenger 2 Empirical Resiliency & Asset Verification", () => {
  const publicHtmlPath = path.join(ROOT_DIR, "public", "index.html");
  const outputHtmlPath = path.join(ROOT_DIR, ".output", "public", "index.html");

  // Helper to extract client script from HTML
  function getScriptCode(html: string): string {
    const match = html.match(/<script>([\s\S]*?)<\/script>/);
    if (!match) throw new Error("Could not find <script> block in HTML");
    return match[1];
  }

  // Mock DOM environment factory
  function createMockEnvironment(initialState: {
    hostname?: string;
    pathname?: string;
    search?: string;
    hash?: string;
    onLine?: boolean;
  } = {}) {
    const elements: Record<string, { id: string; textContent: string; style: Record<string, string> }> = {
      status: { id: "status", textContent: "", style: {} },
      spinner: { id: "spinner", textContent: "", style: {} },
      "retry-btn": { id: "retry-btn", textContent: "", style: {} },
    };

    const listeners: Record<string, Array<() => void>> = {};
    let replacedUrl: string | null = null;

    const mockWindow: any = {
      location: {
        hostname: initialState.hostname || "localhost",
        pathname: initialState.pathname !== undefined ? initialState.pathname : "/index.html",
        search: initialState.search || "",
        hash: initialState.hash || "",
        replace: (url: string) => {
          replacedUrl = url;
        },
      },
      addEventListener: (event: string, handler: () => void) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
      },
      dispatchEvent: (event: string) => {
        if (listeners[event]) {
          listeners[event].forEach((fn) => fn());
        }
      },
    };

    const mockDocument = {
      getElementById: (id: string) => elements[id] || null,
    };

    const mockNavigator = {
      onLine: initialState.onLine !== undefined ? initialState.onLine : true,
    };

    const context = vm.createContext({
      window: mockWindow,
      document: mockDocument,
      navigator: mockNavigator,
      URL: globalThis.URL,
      console: console,
    });

    return {
      context,
      mockWindow,
      mockDocument,
      mockNavigator,
      elements,
      getReplacedUrl: () => replacedUrl,
      resetReplacedUrl: () => {
        replacedUrl = null;
      },
    };
  }

  // ==========================================================================
  // Group 1: DOM Structure, Viewport, Meta & CSS Insets
  // ==========================================================================
  describe("Group 1: DOM Structure, Viewport, Meta & CSS Insets", () => {
    it("C2.1: Validates HTML5 doctype, pt-BR language, and UTF-8 charset", () => {
      expect(fs.existsSync(publicHtmlPath)).toBe(true);
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain('<html lang="pt-BR">');
      expect(html).toContain('<meta charset="utf-8"');
      expect(html).toContain("<title>Montanha Personal Studio</title>");
    });

    it("C2.2: Validates viewport meta with width=device-width and viewport-fit=cover", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain('content="width=device-width, initial-scale=1.0, viewport-fit=cover"');
    });

    it("C2.3: Validates iOS status-bar and web app capability meta tags", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain('<meta name="apple-mobile-web-app-capable" content="yes" />');
      expect(html).toContain('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />');
      expect(html).toContain('<meta name="apple-mobile-web-app-title" content="Montanha Personal Studio" />');
      expect(html).toContain('<meta name="mobile-web-app-capable" content="yes" />');
    });

    it("C2.4: Validates light and dark theme palette colors", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain("--bg: #F8F9FE;");
      expect(html).toContain("--bg: #050A14;");
      expect(html).toContain("--primary: #6958E2;");
      expect(html).toContain('<meta name="theme-color" content="#6958E2" />');
    });

    it("C2.5: Validates safe-area insets with fallback padding guards", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain("max(24px, env(safe-area-inset-top, 0px))");
      expect(html).toContain("max(20px, env(safe-area-inset-right, 0px))");
      expect(html).toContain("max(24px, env(safe-area-inset-bottom, 0px))");
      expect(html).toContain("max(20px, env(safe-area-inset-left, 0px))");
    });

    it("C2.6: Validates interactive touch target dimensions (>= 44x44px)", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain("min-height: 44px;");
      expect(html).toContain("min-width: 160px;");
      expect(html).toContain("touch-action: manipulation;");
    });

    it("C2.7: Validates local image fallback with onerror suppression", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).toContain('onerror="this.style.display=\'none\'"');
    });
  });

  // ==========================================================================
  // Group 2: Asset Sync Readiness & Offline Isolation
  // ==========================================================================
  describe("Group 2: Asset Sync Readiness & Offline Isolation", () => {
    it("C2.8: Verifies .output/public/index.html is identical byte-for-byte to public/index.html", () => {
      expect(fs.existsSync(outputHtmlPath)).toBe(true);
      const publicBuf = fs.readFileSync(publicHtmlPath);
      const outputBuf = fs.readFileSync(outputHtmlPath);
      expect(publicBuf.equals(outputBuf)).toBe(true);
    });

    it("C2.9: Verifies all referenced local icons and manifests exist on disk", () => {
      const icon192 = path.join(ROOT_DIR, "public", "icon-192.png");
      const appleTouch = path.join(ROOT_DIR, "public", "apple-touch-icon.png");
      const manifest = path.join(ROOT_DIR, "public", "manifest.webmanifest");
      const icon512 = path.join(ROOT_DIR, "public", "icon-512.png");

      expect(fs.existsSync(icon192)).toBe(true);
      expect(fs.existsSync(appleTouch)).toBe(true);
      expect(fs.existsSync(manifest)).toBe(true);
      expect(fs.existsSync(icon512)).toBe(true);

      expect(fs.statSync(icon192).size).toBeGreaterThan(1000);
      expect(fs.statSync(appleTouch).size).toBeGreaterThan(1000);
      expect(fs.statSync(icon512).size).toBeGreaterThan(5000);
    });

    it("C2.10: Verifies 100% offline isolation with zero external CDN dependencies in fallback shell", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(html).not.toContain("https://cdn.");
      expect(html).not.toContain("https://unpkg.com");
      expect(html).not.toContain("https://cdnjs.");
      expect(html).not.toContain("https://fonts.googleapis.com");
    });
  });

  // ==========================================================================
  // Group 3: Offline / Online Lifecycle & Script Execution Simulation
  // ==========================================================================
  describe("Group 3: Offline / Online Lifecycle & Script Execution Simulation", () => {
    const html = fs.readFileSync(publicHtmlPath, "utf-8");
    const script = getScriptCode(html);

    it("C2.11: Offline cold start disables spinner, reveals retry button, and prevents navigation", () => {
      const env = createMockEnvironment({ onLine: false, pathname: "/index.html" });
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBeNull();
      expect(env.elements.spinner.style.display).toBe("none");
      expect(env.elements["retry-btn"].style.display).toBe("inline-flex");
      expect(env.elements.status.textContent).toContain("internet");
    });

    it("C2.12: Online cold start executes canonical replacement to production URL", () => {
      const env = createMockEnvironment({ onLine: true, pathname: "/index.html" });
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBe("https://montanha-personal-studio.vercel.app");
      expect(env.elements.spinner.style.display).toBe("block");
      expect(env.elements["retry-btn"].style.display).toBe("none");
    });

    it("C2.13: Online cold start normalizes root path '/' without double slashes", () => {
      const env = createMockEnvironment({ onLine: true, pathname: "/" });
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBe("https://montanha-personal-studio.vercel.app");
    });

    it("C2.14: Preserves deep path, query parameters, and hash fragment during online redirect", () => {
      const env = createMockEnvironment({
        onLine: true,
        pathname: "/portal/aulas",
        search: "?turma=manham&active=true",
        hash: "#grade",
      });
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBe(
        "https://montanha-personal-studio.vercel.app/portal/aulas?turma=manham&active=true#grade"
      );
    });

    it("C2.15: Aborts redirect when current hostname already matches targetHost (infinite loop guard)", () => {
      const env = createMockEnvironment({
        onLine: true,
        hostname: "montanha-personal-studio.vercel.app",
        pathname: "/portal",
      });
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBeNull();
    });

    it("C2.16: Dynamic state transitions: online -> offline event switches to offline UI", () => {
      const env = createMockEnvironment({ onLine: true });
      vm.runInContext(script, env.context);
      env.resetReplacedUrl();

      env.mockNavigator.onLine = false;
      env.mockWindow.dispatchEvent("offline");

      expect(env.elements.spinner.style.display).toBe("none");
      expect(env.elements["retry-btn"].style.display).toBe("inline-flex");
      expect(env.elements.status.textContent).toContain("internet");
    });

    it("C2.17: Dynamic state transitions: offline -> online event initiates redirect", () => {
      const env = createMockEnvironment({ onLine: false, pathname: "/perfil" });
      vm.runInContext(script, env.context);
      expect(env.getReplacedUrl()).toBeNull();

      env.mockNavigator.onLine = true;
      env.mockWindow.dispatchEvent("online");

      expect(env.getReplacedUrl()).toBe("https://montanha-personal-studio.vercel.app/perfil");
      expect(env.elements.spinner.style.display).toBe("block");
      expect(env.elements["retry-btn"].style.display).toBe("none");
    });

    it("C2.18: Retry button invocation behaves idempotently according to connection status", () => {
      const env = createMockEnvironment({ onLine: false });
      vm.runInContext(script, env.context);

      // Click retry while still offline -> no navigation
      env.mockWindow.handleRetry();
      expect(env.getReplacedUrl()).toBeNull();

      // Click retry after reconnection -> navigates
      env.mockNavigator.onLine = true;
      env.mockWindow.handleRetry();
      expect(env.getReplacedUrl()).toBe("https://montanha-personal-studio.vercel.app");
    });

    it("C2.19: URL construction exception safely falls back to base PROD_URL", () => {
      const env = createMockEnvironment({ onLine: true });
      env.context.URL = function () {
        throw new Error("Simulated constructor failure");
      };
      vm.runInContext(script, env.context);

      expect(env.getReplacedUrl()).toBe("https://montanha-personal-studio.vercel.app");
    });
  });

  // ==========================================================================
  // Group 4: Adversarial Edge Cases & Security Checks
  // ==========================================================================
  describe("Group 4: Adversarial Edge Cases & Security Checks", () => {
    it("C2.20: Validates redirect target hostname cannot be subverted via path injection", () => {
      const maliciousPaths = [
        "///attacker.com",
        "//attacker.com/exploit",
        "/../../attacker.com",
        "\\attacker.com",
      ];
      for (const p of maliciousPaths) {
        const prod = "https://montanha-personal-studio.vercel.app";
        const constructed = new URL(prod + p);
        expect(constructed.hostname).toBe("montanha-personal-studio.vercel.app");
      }
    });

    it("C2.21: Detects meta http-equiv=refresh tag and verifies 5s timing parameter", () => {
      const html = fs.readFileSync(publicHtmlPath, "utf-8");
      const refreshMatch = html.match(/<meta\s+http-equiv="refresh"\s+content="(\d+);\s*url=([^"]+)"/i);
      expect(refreshMatch).not.toBeNull();
      if (refreshMatch) {
        const seconds = parseInt(refreshMatch[1], 10);
        const url = refreshMatch[2];
        expect(seconds).toBe(5);
        expect(url).toBe("https://montanha-personal-studio.vercel.app");
      }
    });
  });
});
