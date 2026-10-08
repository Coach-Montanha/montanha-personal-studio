/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M1)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m1_1
 * Role: Configuration & Contract Challenger
 * Scope: capacitor.config.ts schema, env overrides, dependency pinning, fallback resilience
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import type { CapacitorConfig } from "@capacitor/cli";

const ROOT_DIR = path.resolve(__dirname, "../..");

describe("Tier 5: Challenger Empirical Verification (Milestone M1)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: capacitor.config.ts Schema & Security Property Verification
  // --------------------------------------------------------------------------
  describe("Challenge 1: Capacitor Config Schema & Security Properties", () => {
    const configPath = path.join(ROOT_DIR, "capacitor.config.ts");

    it("C1.1: File exists and contains valid TypeScript export", () => {
      expect(fs.existsSync(configPath)).toBe(true);
      const content = fs.readFileSync(configPath, "utf-8");
      expect(content).toContain("export default config;");
      expect(content).toContain("import type { CapacitorConfig } from \"@capacitor/cli\";");
    });

    it("C1.2: Exports valid CapacitorConfig matching canonical contract", async () => {
      const imported = await import(configPath);
      const config: CapacitorConfig = imported.default;

      expect(config).toBeDefined();
      expect(config.appId).toBe("com.ecossistemamontanha.personalstudio");
      expect(config.appName).toBe("Montanha Personal Studio");
      expect(config.webDir).toBe(".output/public");
      expect(config.backgroundColor).toBe("#F8F9FE");

      // Server configuration
      expect(config.server).toBeDefined();
      expect(config.server?.cleartext).toBe(false);
      expect(config.server?.androidScheme).toBe("https");
      expect(config.server?.url).toMatch(/^https:\/\//);

      // Android security configuration
      expect(config.android).toBeDefined();
      expect(config.android?.allowMixedContent).toBe(false);
      expect(config.android?.captureInput).toBe(true);
      expect(typeof config.android?.webContentsDebuggingEnabled).toBe("boolean");
    });

    it("C1.3: Verifies no credential or secret leaks inside capacitor.config.ts", () => {
      const content = fs.readFileSync(configPath, "utf-8");
      expect(content).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
      expect(content).not.toContain("eyJh"); // JWT token pattern
      expect(content).not.toContain("password");
      expect(content).not.toContain("secret");
    });

    it("C1.4: tsconfig.json explicitly includes capacitor.config.ts", () => {
      const tsconfigPath = path.join(ROOT_DIR, "tsconfig.json");
      const tsconfigContent = fs.readFileSync(tsconfigPath, "utf-8");
      // Strip comments if any
      const cleaned = tsconfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
      const tsconfig = JSON.parse(cleaned);
      expect(tsconfig.include).toContain("capacitor.config.ts");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Environment Variable Overrides & Dynamic Behavior
  // --------------------------------------------------------------------------
  describe("Challenge 2: Environment Variable Overrides & Fallbacks", () => {
    it("C2.1: Default server URL falls back to production Vercel domain", () => {
      const output = execSync(
        `bun -e "delete process.env.CAPACITOR_SERVER_URL; import('./capacitor.config.ts').then(m => console.log(m.default.server.url))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe("https://montanha-personal-studio.vercel.app");
    });

    it("C2.2: CAPACITOR_SERVER_URL overrides server.url with custom dev host", () => {
      const customUrl = "http://10.0.2.2:3000";
      const output = execSync(
        `bun -e "process.env.CAPACITOR_SERVER_URL='${customUrl}'; import('./capacitor.config.ts').then(m => console.log(m.default.server.url))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe(customUrl);
    });

    it("C2.3: Empty string CAPACITOR_SERVER_URL cleanly falls back to default URL", () => {
      const output = execSync(
        `bun -e "process.env.CAPACITOR_SERVER_URL=''; import('./capacitor.config.ts').then(m => console.log(m.default.server.url))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe("https://montanha-personal-studio.vercel.app");
    });

    it("C2.4: NODE_ENV=production disables webContentsDebuggingEnabled", () => {
      const output = execSync(
        `bun -e "process.env.NODE_ENV='production'; import('./capacitor.config.ts').then(m => console.log(m.default.android.webContentsDebuggingEnabled))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe("false");
    });

    it("C2.5: NODE_ENV=development enables webContentsDebuggingEnabled", () => {
      const output = execSync(
        `bun -e "process.env.NODE_ENV='development'; import('./capacitor.config.ts').then(m => console.log(m.default.android.webContentsDebuggingEnabled))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe("true");
    });

    it("C2.6: Unset NODE_ENV defaults webContentsDebuggingEnabled to true", () => {
      const output = execSync(
        `bun -e "delete process.env.NODE_ENV; import('./capacitor.config.ts').then(m => console.log(m.default.android.webContentsDebuggingEnabled))"`,
        { cwd: ROOT_DIR, encoding: "utf-8" }
      ).trim();
      expect(output).toBe("true");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Dependency Pinning, Graph Isolation & Ponytail Minimalism
  // --------------------------------------------------------------------------
  describe("Challenge 3: Dependency Pinning & Graph Verification", () => {
    const pkgPath = path.join(ROOT_DIR, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    it("C3.1: Strictly pins @capacitor/core to exact version 8.5.2 without ranges", () => {
      expect(pkg.dependencies["@capacitor/core"]).toBe("8.5.2");
      expect(pkg.dependencies["@capacitor/core"]).not.toMatch(/[\^~><*]/);
    });

    it("C3.2: Strictly pins @capacitor/android to exact version 8.5.2 without ranges", () => {
      expect(pkg.dependencies["@capacitor/android"]).toBe("8.5.2");
      expect(pkg.dependencies["@capacitor/android"]).not.toMatch(/[\^~><*]/);
    });

    it("C3.3: Strictly pins @capacitor/cli to exact version 8.5.2 in devDependencies", () => {
      expect(pkg.devDependencies["@capacitor/cli"]).toBe("8.5.2");
      expect(pkg.devDependencies["@capacitor/cli"]).not.toMatch(/[\^~><*]/);
    });

    it("C3.4: Zero dependency bloat: strictly 3 Capacitor packages across all dependencies", () => {
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      const capPkgs = Object.keys(allDeps).filter((p) => p.startsWith("@capacitor/"));
      expect(capPkgs).toHaveLength(3);
      expect(capPkgs.sort()).toEqual([
        "@capacitor/android",
        "@capacitor/cli",
        "@capacitor/core",
      ]);
    });

    it("C3.5: Package scripts define cap:sync and cap:copy correctly", () => {
      expect(pkg.scripts["cap:sync"]).toBe("cap sync android");
      expect(pkg.scripts["cap:copy"]).toBe("cap copy android");
    });

    it("C3.6: Installed packages in node_modules reflect exact version 8.5.2", () => {
      const corePkg = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, "node_modules/@capacitor/core/package.json"), "utf-8")
      );
      const androidPkg = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, "node_modules/@capacitor/android/package.json"), "utf-8")
      );
      const cliPkg = JSON.parse(
        fs.readFileSync(path.join(ROOT_DIR, "node_modules/@capacitor/cli/package.json"), "utf-8")
      );

      expect(corePkg.version).toBe("8.5.2");
      expect(androidPkg.version).toBe("8.5.2");
      expect(cliPkg.version).toBe("8.5.2");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: Fallback Web Shell & Offline Resilience
  // --------------------------------------------------------------------------
  describe("Challenge 4: Fallback Shell & Static Resiliency", () => {
    const publicHtmlPath = path.join(ROOT_DIR, "public/index.html");
    const outputHtmlPath = path.join(ROOT_DIR, ".output/public/index.html");

    it("C4.1: public/index.html exists and conforms to HTML5 standards", () => {
      expect(fs.existsSync(publicHtmlPath)).toBe(true);
      const content = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(content).toContain("<!DOCTYPE html>");
      expect(content).toContain("<html lang=\"pt-BR\">");
      expect(content).toContain("charset=\"utf-8\"");
      expect(content).toContain("viewport-fit=cover");
    });

    it("C4.2: Contains canonical production redirect with infinite-loop guard", () => {
      const content = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(content).toContain("https://montanha-personal-studio.vercel.app");
      // Infinite loop guard check
      expect(content).toContain("window.location.hostname === targetHost");
    });

    it("C4.3: Implements safe-area insets in layout styling", () => {
      const content = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(content).toContain("env(safe-area-inset-top");
      expect(content).toContain("env(safe-area-inset-bottom");
    });

    it("C4.4: Implements offline resilience UI with accessible touch target", () => {
      const content = fs.readFileSync(publicHtmlPath, "utf-8");
      expect(content).toContain("window.addEventListener(\"offline\"");
      expect(content).toContain("window.addEventListener(\"online\"");
      expect(content).toContain("min-height: 44px"); // 44px touch target compliance
    });

    it("C4.5: .output/public/index.html is seeded and matches public/index.html", () => {
      expect(fs.existsSync(outputHtmlPath)).toBe(true);
      const pubContent = fs.readFileSync(publicHtmlPath, "utf-8");
      const outContent = fs.readFileSync(outputHtmlPath, "utf-8");
      expect(outContent).toBe(pubContent);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Capacitor CLI End-to-End Evaluation
  // --------------------------------------------------------------------------
  describe("Challenge 5: Capacitor CLI Config Evaluation", () => {
    it(
      "C5.1: bun x cap config parses successfully with exit code 0",
      () => {
        const stdout = execSync("bun x cap config", { cwd: ROOT_DIR, encoding: "utf-8" });
        expect(stdout).toContain("com.ecossistemamontanha.personalstudio");
        expect(stdout).toContain("Montanha Personal Studio");
        expect(stdout).toContain(".output/public");
      },
      30000
    );
  });
});
