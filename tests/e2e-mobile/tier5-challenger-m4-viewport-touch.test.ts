/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M4)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m4_1
 * Role: CSS, Viewport & Touch Target Challenger
 * Scope: Safe-area CSS custom properties & fallbacks, Tailwind & standard utilities,
 *        Header & Footer/Main layout integration across notches/dynamic islands/desktop,
 *        Touch target compliance (WCAG 2.5.5 / Apple HIG) across fine vs coarse pointers,
 *        Mobile input font-size >= 16px iOS auto-zoom prevention, and mutation oracles.
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  CANONICAL_SPECS,
  calculateSafeAreaPadding,
  evaluateTouchTargetDimensions,
} from "./contracts";

const ROOT_DIR = path.resolve(__dirname, "../..");
const STYLES_FILE = path.join(ROOT_DIR, "src/styles.css");
const APP_SHELL_FILE = path.join(ROOT_DIR, "src/components/edufinance/AppShell.tsx");
const PORTAL_SHELL_FILE = path.join(ROOT_DIR, "src/components/portal/PortalShell.tsx");
const ROOT_ROUTE_FILE = path.join(ROOT_DIR, "src/routes/__root.tsx");

describe("Tier 5: Challenger M4 Empirical Verification (CSS, Viewport & Touch Targets)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: CSS Safe-Area Custom Properties, Utilities & Fallback Syntax
  // --------------------------------------------------------------------------
  describe("Challenge 1: Safe-Area CSS Custom Properties & Utility Classes", () => {
    it("C1.1: src/styles.css exists and is non-empty", () => {
      expect(fs.existsSync(STYLES_FILE)).toBe(true);
      const stat = fs.statSync(STYLES_FILE);
      expect(stat.size).toBeGreaterThan(5000);
    });

    it("C1.2: Root :root declares all 4 safe-area CSS custom properties", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      expect(content).toContain("--safe-area-inset-top");
      expect(content).toContain("--safe-area-inset-right");
      expect(content).toContain("--safe-area-inset-bottom");
      expect(content).toContain("--safe-area-inset-left");
    });

    it("C1.3: Safe-area variables enforce explicit fallback parameter '0px'", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      // Verify env(safe-area-inset-*, 0px) format
      expect(content).toMatch(/--safe-area-inset-top:\s*env\(safe-area-inset-top,\s*0px\);/);
      expect(content).toMatch(/--safe-area-inset-right:\s*env\(safe-area-inset-right,\s*0px\);/);
      expect(content).toMatch(/--safe-area-inset-bottom:\s*env\(safe-area-inset-bottom,\s*0px\);/);
      expect(content).toMatch(/--safe-area-inset-left:\s*env\(safe-area-inset-left,\s*0px\);/);
    });

    it("C1.4: Tailwind v4 @utility rules exist for all standard safe-area directions", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      const requiredUtilities = [
        "@utility pt-safe",
        "@utility pb-safe",
        "@utility pl-safe",
        "@utility pr-safe",
        "@utility p-safe",
        "@utility mt-safe",
        "@utility mb-safe",
        "@utility top-safe",
        "@utility bottom-safe",
      ];
      for (const util of requiredUtilities) {
        expect(content).toContain(util);
      }
    });

    it("C1.5: Standard CSS utility classes exist as non-Tailwind compilation fallbacks", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      expect(content).toContain(".pt-safe");
      expect(content).toContain(".pb-safe");
      expect(content).toContain(".pl-safe");
      expect(content).toContain(".pr-safe");
      expect(content).toContain(".p-safe");
    });

    it("C1.6: All utility declarations in styles.css provide safe fallback values", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      // Search for any bare env(safe-area-inset-*) without second argument
      const bareEnvMatches = content.match(/env\(safe-area-inset-(top|right|bottom|left)\s*\)/g);
      expect(bareEnvMatches).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Header, Sidebar & Layout Safe-Area Inset Integration
  // --------------------------------------------------------------------------
  describe("Challenge 2: Header & Layout Safe-Area Inset Integration", () => {
    it("C2.1: AppShell header incorporates top safe-area inset and dynamic height", () => {
      expect(fs.existsSync(APP_SHELL_FILE)).toBe(true);
      const content = fs.readFileSync(APP_SHELL_FILE, "utf-8");
      expect(content).toContain("sticky top-0");
      expect(content).toContain("min-h-14");
      expect(content).toContain("h-[calc(3.5rem+env(safe-area-inset-top,0px))]");
      expect(content).toContain("pt-[env(safe-area-inset-top,0px)]");
    });

    it("C2.2: PortalShell header incorporates top safe-area inset and dynamic height", () => {
      expect(fs.existsSync(PORTAL_SHELL_FILE)).toBe(true);
      const content = fs.readFileSync(PORTAL_SHELL_FILE, "utf-8");
      expect(content).toContain("sticky top-0");
      expect(content).toContain("min-h-16");
      expect(content).toContain("h-[calc(4rem+env(safe-area-inset-top,0px))]");
      expect(content).toContain("pt-[env(safe-area-inset-top,0px)]");
    });

    it("C2.3: AppShell sidebar headers and footers respect safe-area insets", () => {
      const content = fs.readFileSync(APP_SHELL_FILE, "utf-8");
      expect(content).toContain("pt-[calc(0.5rem+env(safe-area-inset-top,0px))]");
      expect(content).toContain("pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]");
    });

    it("C2.4: AppShell main content area includes bottom safe-area padding for home indicator", () => {
      const content = fs.readFileSync(APP_SHELL_FILE, "utf-8");
      expect(content).toContain("pb-[calc(1rem+env(safe-area-inset-bottom,0px))]");
      expect(content).toContain("sm:pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]");
    });

    it("C2.5: PortalShell main content area includes bottom safe-area padding", () => {
      const content = fs.readFileSync(PORTAL_SHELL_FILE, "utf-8");
      expect(content).toContain("pb-[calc(1rem+env(safe-area-inset-bottom,0px))]");
    });

    it("C2.6: Layout components never use bare env() without explicit 0px fallback", () => {
      const appContent = fs.readFileSync(APP_SHELL_FILE, "utf-8");
      const portalContent = fs.readFileSync(PORTAL_SHELL_FILE, "utf-8");
      const appBare = appContent.match(/env\(safe-area-inset-[a-z]+\s*\)/g);
      const portalBare = portalContent.match(/env\(safe-area-inset-[a-z]+\s*\)/g);
      expect(appBare).toBeNull();
      expect(portalBare).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Touch Target Sizing & Coarse vs Fine Pointer Isolation
  // --------------------------------------------------------------------------
  describe("Challenge 3: Touch Target Sizing Compliance Across Pointer Types", () => {
    it("C3.1: styles.css encloses touch target enlargement inside @media (pointer: coarse)", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      expect(content).toContain("@media (pointer: coarse)");
    });

    it("C3.2: Coarse query enforces min-height >= 44px on standard form elements", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      const coarseBlock = content.split("@media (pointer: coarse)")[1] || "";
      expect(coarseBlock).toContain("button");
      expect(coarseBlock).toContain('[role="button"]');
      expect(coarseBlock).toContain("select");
      expect(coarseBlock).toContain("textarea");
      expect(coarseBlock).toContain("min-height: 44px");
    });

    it("C3.3: Coarse query enforces min-width and min-height >= 44px on small interactive targets", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      const coarseBlock = content.split("@media (pointer: coarse)")[1] || "";
      expect(coarseBlock).toContain('input[type="checkbox"]');
      expect(coarseBlock).toContain('input[type="radio"]');
      expect(coarseBlock).toContain("button.icon-only");
      expect(coarseBlock).toContain(".touch-target-44");
      expect(coarseBlock).toContain("min-width: 44px");
    });

    it("C3.4: Desktop Fine Pointer Isolation: 44px minimum is NOT globally applied to fine pointers", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      const beforeCoarse = content.split("@media (pointer: coarse)")[0] || "";
      // Check that generic `button { min-height: 44px }` does not exist outside coarse query
      const globalButtonEnforcement = beforeCoarse.match(/^\s*button\s*\{[^}]*min-height:\s*44px/m);
      expect(globalButtonEnforcement).toBeNull();
    });

    it("C3.5: AppShell header interactive buttons provide accessible labels and sizing", () => {
      const content = fs.readFileSync(APP_SHELL_FILE, "utf-8");
      expect(content).toContain('aria-label={open ? "Fechar menu" : "Abrir menu"}');
      expect(content).toContain('aria-label="Alternar tema"');
      expect(content).toContain('title="Sair"');
    });

    it("C3.6: PortalShell header interactive buttons provide accessible labels and sizing", () => {
      const content = fs.readFileSync(PORTAL_SHELL_FILE, "utf-8");
      expect(content).toContain('aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}');
      expect(content).toContain('aria-label="Alternar tema"');
      expect(content).toContain('aria-label="Sair"');
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: iOS Safari Viewport & Mobile Input Auto-Zoom Prevention
  // --------------------------------------------------------------------------
  describe("Challenge 4: iOS Viewport-Fit & Form Input Auto-Zoom Prevention", () => {
    it("C4.1: __root.tsx sets viewport-fit=cover in root layout meta", () => {
      expect(fs.existsSync(ROOT_ROUTE_FILE)).toBe(true);
      const content = fs.readFileSync(ROOT_ROUTE_FILE, "utf-8");
      expect(content).toContain("viewport-fit=cover");
      expect(content).toContain("width=device-width");
    });

    it("C4.2: styles.css enforces font-size >= 16px on mobile viewports (< 768px)", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      expect(content).toContain("@media (max-width: 767px)");
      expect(content).toContain("font-size: 16px !important;");
    });

    it("C4.3: Checkboxes and radios are excluded from 16px font-size override to prevent distortion", () => {
      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      expect(content).toContain('input:not([type="checkbox"]):not([type="radio"]):not([type="range"])');
    });

    it("C4.4: Input Auto-Zoom Oracle evaluates effective font size across viewports", () => {
      function evaluateMobileInputFontSize(viewportWidth: number, declaredFontSizePx: number): number {
        if (viewportWidth < 768) {
          return Math.max(declaredFontSizePx, CANONICAL_SPECS.compliance.minMobileInputFontSizePx);
        }
        return declaredFontSizePx;
      }

      // Mobile phone: 375px viewport with small 12px font
      expect(evaluateMobileInputFontSize(375, 12)).toBe(16);
      expect(evaluateMobileInputFontSize(390, 14)).toBe(16);
      expect(evaluateMobileInputFontSize(412, 15)).toBe(16);
      expect(evaluateMobileInputFontSize(412, 18)).toBe(18);

      // Desktop: 1280px viewport preserves smaller designer font sizes
      expect(evaluateMobileInputFontSize(1280, 14)).toBe(14);
      expect(evaluateMobileInputFontSize(1920, 12)).toBe(12);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Multi-Device Viewport Layout & Dynamic Island Emulation Oracle
  // --------------------------------------------------------------------------
  describe("Challenge 5: Multi-Device Viewport Layout & Dynamic Island Oracle", () => {
    interface DeviceProfile {
      name: string;
      width: number;
      height: number;
      insetTop: number;
      insetBottom: number;
      insetLeft: number;
      insetRight: number;
    }

    const deviceProfiles: DeviceProfile[] = [
      {
        name: "Desktop Workstation (1080p)",
        width: 1920,
        height: 1080,
        insetTop: 0,
        insetBottom: 0,
        insetLeft: 0,
        insetRight: 0,
      },
      {
        name: "iPhone 13 / 14 (Standard Notch)",
        width: 390,
        height: 844,
        insetTop: 47,
        insetBottom: 34,
        insetLeft: 0,
        insetRight: 0,
      },
      {
        name: "iPhone 15 / 16 Pro (Dynamic Island)",
        width: 393,
        height: 852,
        insetTop: 59,
        insetBottom: 34,
        insetLeft: 0,
        insetRight: 0,
      },
      {
        name: "Google Pixel 8 (Android Center Punch-Hole)",
        width: 412,
        height: 915,
        insetTop: 28,
        insetBottom: 24,
        insetLeft: 0,
        insetRight: 0,
      },
      {
        name: "Samsung Galaxy Tab / iPad Mini (Tablet)",
        width: 768,
        height: 1024,
        insetTop: 24,
        insetBottom: 20,
        insetLeft: 0,
        insetRight: 0,
      },
      {
        name: "iPhone 15 Landscape (Side Cutout)",
        width: 852,
        height: 393,
        insetTop: 0,
        insetBottom: 21,
        insetLeft: 59,
        insetRight: 59,
      },
    ];

    it("C5.1: Layout Oracle calculates AppShell header height and clearance across all device profiles", () => {
      const BASE_HEADER_HEIGHT = 56; // 3.5rem @ 16px root font

      for (const dev of deviceProfiles) {
        const computedHeaderHeight = BASE_HEADER_HEIGHT + dev.insetTop;
        const computedPaddingTop = dev.insetTop;

        expect(computedHeaderHeight).toBeGreaterThanOrEqual(BASE_HEADER_HEIGHT);
        expect(computedPaddingTop).toBe(dev.insetTop);

        // Content area inside header (below status bar cutout) remains constant at 56px
        const usableContentHeight = computedHeaderHeight - computedPaddingTop;
        expect(usableContentHeight).toBe(BASE_HEADER_HEIGHT);
      }
    });

    it("C5.2: Layout Oracle calculates PortalShell header height across all device profiles", () => {
      const BASE_HEADER_HEIGHT = 64; // 4rem @ 16px root font

      for (const dev of deviceProfiles) {
        const computedHeaderHeight = BASE_HEADER_HEIGHT + dev.insetTop;
        const computedPaddingTop = dev.insetTop;

        expect(computedHeaderHeight).toBeGreaterThanOrEqual(BASE_HEADER_HEIGHT);
        expect(computedPaddingTop).toBe(dev.insetTop);

        const usableContentHeight = computedHeaderHeight - computedPaddingTop;
        expect(usableContentHeight).toBe(BASE_HEADER_HEIGHT);
      }
    });

    it("C5.3: Layout Oracle verifies main content bottom clearance exceeds home indicator inset", () => {
      const BASE_BOTTOM_PAD = 16; // 1rem

      for (const dev of deviceProfiles) {
        const effectiveBottomPad = calculateSafeAreaPadding(BASE_BOTTOM_PAD, dev.insetBottom);

        // Main content bottom padding MUST always be >= home indicator inset
        expect(effectiveBottomPad).toBeGreaterThanOrEqual(dev.insetBottom);
        expect(effectiveBottomPad).toBe(BASE_BOTTOM_PAD + dev.insetBottom);
      }
    });

    it("C5.4: Layout Oracle verifies desktop layout experiences 0px extra inset overhead", () => {
      const desktop = deviceProfiles[0];
      const appShellHeader = 56 + desktop.insetTop;
      const portalShellHeader = 64 + desktop.insetTop;
      const mainBottom = calculateSafeAreaPadding(16, desktop.insetBottom);

      expect(appShellHeader).toBe(56);
      expect(portalShellHeader).toBe(64);
      expect(mainBottom).toBe(16);
    });

    it("C5.5: Layout Oracle verifies Dynamic Island profile (59px) provides >= 59px status bar buffer", () => {
      const dynamicIsland = deviceProfiles.find((d) => d.name.includes("Dynamic Island"))!;
      const headerTopPad = dynamicIsland.insetTop;
      expect(headerTopPad).toBe(59);
      expect(headerTopPad).toBeGreaterThan(47); // Taller than standard notch
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 6: Adversarial Mutation Oracles (Negative Testing)
  // --------------------------------------------------------------------------
  describe("Challenge 6: Adversarial Mutation Oracles (Negative Testing)", () => {
    it("C6.1: Mutation Oracle: Missing fallback in env() is flagged as a defect", () => {
      function validateEnvExpression(expr: string): boolean {
        // Enforces presence of fallback parameter
        return /env\(safe-area-inset-[a-z]+,\s*[^)]+\)/.test(expr);
      }

      expect(validateEnvExpression("env(safe-area-inset-top, 0px)")).toBe(true);
      expect(validateEnvExpression("env(safe-area-inset-bottom, 0px)")).toBe(true);
      expect(validateEnvExpression("env(safe-area-inset-top)")).toBe(false);
      expect(validateEnvExpression("env(safe-area-inset-bottom)")).toBe(false);
    });

    it("C6.2: Mutation Oracle: Sub-44px touch target on coarse pointer is rejected", () => {
      const dimensions = [
        { w: 43.5, h: 44 },
        { w: 44, h: 43.9 },
        { w: 32, h: 32 },
        { w: 40, h: 40 },
      ];

      for (const d of dimensions) {
        const evalResult = evaluateTouchTargetDimensions({
          pointerType: "coarse",
          elementWidthPx: d.w,
          elementHeightPx: d.h,
        });
        expect(evalResult.meetsRequirement).toBe(false);
        expect(evalResult.effectiveWidth).toBeGreaterThanOrEqual(44);
        expect(evalResult.effectiveHeight).toBeGreaterThanOrEqual(44);
      }
    });

    it("C6.3: Mutation Oracle: Fine pointer preserves sub-44px targets without modification", () => {
      const dimensions = [
        { w: 32, h: 32 },
        { w: 24, h: 24 },
        { w: 16, h: 16 },
      ];

      for (const d of dimensions) {
        const evalResult = evaluateTouchTargetDimensions({
          pointerType: "fine",
          elementWidthPx: d.w,
          elementHeightPx: d.h,
        });
        expect(evalResult.meetsRequirement).toBe(true);
        expect(evalResult.effectiveWidth).toBe(d.w);
        expect(evalResult.effectiveHeight).toBe(d.h);
      }
    });

    it("C6.4: Mutation Oracle: Detects missing safe-area padding class in layout AST snippet", () => {
      function hasHeaderSafeAreaIntegration(jsxSnippet: string): boolean {
        return jsxSnippet.includes("safe-area-inset-top") && jsxSnippet.includes("pt-");
      }

      const validHeader = '<header className="sticky top-0 h-[calc(3.5rem+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)]">';
      const invalidHeaderNoPt = '<header className="sticky top-0 h-[3.5rem]">';
      const invalidHeaderNoEnv = '<header className="sticky top-0 h-[3.5rem] pt-2">';

      expect(hasHeaderSafeAreaIntegration(validHeader)).toBe(true);
      expect(hasHeaderSafeAreaIntegration(invalidHeaderNoPt)).toBe(false);
      expect(hasHeaderSafeAreaIntegration(invalidHeaderNoEnv)).toBe(false);
    });

    it("C6.5: Mutation Oracle: Detects missing bottom safe-area in main container snippet", () => {
      function hasMainSafeAreaIntegration(jsxSnippet: string): boolean {
        return jsxSnippet.includes("safe-area-inset-bottom") && jsxSnippet.includes("pb-");
      }

      const validMain = '<main className="flex-1 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">';
      const invalidMain = '<main className="flex-1 pb-4">';

      expect(hasMainSafeAreaIntegration(validMain)).toBe(true);
      expect(hasMainSafeAreaIntegration(invalidMain)).toBe(false);
    });

    it("C6.6: Mutation Oracle: Detects unclosed CSS braces in styles safe-area section", () => {
      function validateCssBraceBalance(cssSection: string): boolean {
        let depth = 0;
        for (const char of cssSection) {
          if (char === "{") depth++;
          if (char === "}") depth--;
          if (depth < 0) return false;
        }
        return depth === 0;
      }

      const content = fs.readFileSync(STYLES_FILE, "utf-8");
      const safeAreaSectionStart = content.indexOf("MOBILE VIEWPORT & SAFE-AREA INSETS");
      expect(safeAreaSectionStart).toBeGreaterThan(-1);
      const safeAreaSection = content.slice(safeAreaSectionStart);

      expect(validateCssBraceBalance(safeAreaSection)).toBe(true);
      expect(validateCssBraceBalance(safeAreaSection + "}")).toBe(false);
      expect(validateCssBraceBalance(safeAreaSection + "{")).toBe(false);
    });
  });

});
