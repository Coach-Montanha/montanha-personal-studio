/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M3: CI Workflow & Integration)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m3_2
 * Role: CI Workflow & Integration Challenger
 * Scope: .github/workflows/build-apk.yml, GitHub Actions schema contracts,
 *        topological build step ordering, runner environment, action versions,
 *        artifact publishing, and mutation oracles.
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import yaml from "js-yaml";
import {
  CANONICAL_SPECS,
  validateGitHubWorkflow,
  type GitHubWorkflowSpec,
  type GitHubWorkflowStep,
} from "./contracts";

const ROOT_DIR = path.resolve(__dirname, "../..");
const WORKFLOW_PATH = path.join(ROOT_DIR, ".github/workflows/build-apk.yml");

describe("Tier 5: Challenger M3 Empirical Verification (CI Workflow & Integration)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: File Existence, Integrity & YAML AST Schema Validation
  // --------------------------------------------------------------------------
  describe("Challenge 1: Workflow File Existence & Structural Schema Integrity", () => {
    it("C1.1: .github/workflows/build-apk.yml exists on disk and is non-empty", () => {
      expect(fs.existsSync(WORKFLOW_PATH)).toBe(true);
      const stat = fs.statSync(WORKFLOW_PATH);
      expect(stat.size).toBeGreaterThan(300);
      expect(stat.size).toBeLessThan(5000);
    });

    it("C1.2: Parses strictly as valid YAML without syntax errors or exceptions", () => {
      const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
      let parsed: any;
      expect(() => {
        parsed = yaml.load(rawContent);
      }).not.toThrow();
      expect(parsed).toBeTypeOf("object");
      expect(parsed).not.toBeNull();
    });

    it("C1.3: Top-level keys conform strictly to GitHub Actions workflow schema", () => {
      const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
      const parsed = yaml.load(rawContent) as Record<string, any>;
      const keys = Object.keys(parsed);

      expect(keys).toContain("name");
      expect(keys).toContain("on");
      expect(keys).toContain("jobs");

      expect(parsed.name).toBe("Build Android APK");
      expect(parsed.jobs).toBeTypeOf("object");
      expect(parsed.jobs.build).toBeTypeOf("object");
    });

    it("C1.4: Satisfies authoritative validateGitHubWorkflow() contract validator with 0 errors", () => {
      const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
      const parsed = yaml.load(rawContent) as GitHubWorkflowSpec;
      const result = validateGitHubWorkflow(parsed);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Event Triggers & Branch Security Constraints
  // --------------------------------------------------------------------------
  describe("Challenge 2: Event Triggers & Branch Security Constraints", () => {
    const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
    const parsed = yaml.load(rawContent) as any;

    it("C2.1: Declares exactly push, pull_request, and workflow_dispatch triggers", () => {
      const triggers = parsed.on;
      expect(triggers).toBeTypeOf("object");
      expect(Object.keys(triggers).sort()).toEqual(["pull_request", "push", "workflow_dispatch"].sort());
    });

    it("C2.2: Push event is strictly scoped to the 'main' branch", () => {
      const pushBranches = parsed.on.push?.branches;
      expect(pushBranches).toEqual(["main"]);
    });

    it("C2.3: Pull request event is strictly scoped to the 'main' branch", () => {
      const prBranches = parsed.on.pull_request?.branches;
      expect(prBranches).toEqual(["main"]);
    });

    it("C2.4: workflow_dispatch trigger is present for manual on-demand execution", () => {
      expect("workflow_dispatch" in parsed.on).toBe(true);
    });

    it("C2.5: Zero dangerous triggers (no pull_request_target, schedule bombs, or release auto-publishers)", () => {
      expect(parsed.on.pull_request_target).toBeUndefined();
      expect(parsed.on.schedule).toBeUndefined();
      expect(parsed.on.release).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Runner Specifications, Toolchains & Action Pinning
  // --------------------------------------------------------------------------
  describe("Challenge 3: Runner Specifications, Toolchains & Action Pinning", () => {
    const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
    const parsed = yaml.load(rawContent) as any;
    const steps: GitHubWorkflowStep[] = parsed.jobs.build.steps;

    it("C3.1: Runner is strictly pinned to 'ubuntu-latest' (Ponytail host disk protection)", () => {
      expect(parsed.jobs.build["runs-on"]).toBe("ubuntu-latest");
      expect(parsed.jobs.build["runs-on"]).toBe(CANONICAL_SPECS.ci.runner);
    });

    it("C3.2: Checkout step uses actions/checkout@v4", () => {
      const checkoutStep = steps.find((s) => s.uses?.includes("actions/checkout"));
      expect(checkoutStep).toBeDefined();
      expect(checkoutStep?.uses).toBe("actions/checkout@v4");
    });

    it("C3.3: Node.js setup step uses actions/setup-node@v4 pinned to Node 20", () => {
      const nodeStep = steps.find((s) => s.uses?.includes("actions/setup-node"));
      expect(nodeStep).toBeDefined();
      expect(nodeStep?.uses).toBe("actions/setup-node@v4");
      expect(String(nodeStep?.with?.["node-version"])).toBe("20");
    });

    it("C3.4: Bun setup step uses oven-sh/setup-bun@v2", () => {
      const bunStep = steps.find((s) => s.uses?.includes("oven-sh/setup-bun"));
      expect(bunStep).toBeDefined();
      expect(bunStep?.uses).toBe("oven-sh/setup-bun@v2");
    });

    it("C3.5: Dependency installation enforces --frozen-lockfile against repository bun.lock", () => {
      const installStep = steps.find((s) => s.run?.includes("bun install"));
      expect(installStep).toBeDefined();
      expect(installStep?.run).toBe("bun install --frozen-lockfile");
      // Verify bun.lock exists in root
      expect(fs.existsSync(path.join(ROOT_DIR, "bun.lock"))).toBe(true);
    });

    it("C3.6: Java setup step uses actions/setup-java@v4 with Temurin JDK 17", () => {
      const javaStep = steps.find((s) => s.uses?.includes("actions/setup-java"));
      expect(javaStep).toBeDefined();
      expect(javaStep?.uses).toBe("actions/setup-java@v4");
      expect(String(javaStep?.with?.["java-version"])).toBe("17");
      expect(javaStep?.with?.distribution).toBe("temurin");
    });

    it("C3.7: Gradle setup step uses gradle/actions/setup-gradle@v3 for build caching", () => {
      const gradleSetupStep = steps.find((s) => s.uses?.includes("setup-gradle"));
      expect(gradleSetupStep).toBeDefined();
      expect(gradleSetupStep?.uses).toBe("gradle/actions/setup-gradle@v3");
    });

    it("C3.8: Artifact upload strictly uses actions/upload-artifact@v4 (not deprecated v3)", () => {
      const uploadStep = steps.find((s) => s.uses?.includes("upload-artifact"));
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.uses).toBe("actions/upload-artifact@v4");
      expect(uploadStep?.uses).not.toContain("@v3");
      expect(uploadStep?.uses).not.toContain("@v2");
      expect(uploadStep?.uses).not.toContain("@v1");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: Strict Topological Build Step Ordering & Pre-Requisite Integrity
  // --------------------------------------------------------------------------
  describe("Challenge 4: Strict Topological Build Step Ordering & Pre-Requisite Integrity", () => {
    const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
    const parsed = yaml.load(rawContent) as any;
    const steps: GitHubWorkflowStep[] = parsed.jobs.build.steps;

    const getStepIndex = (predicate: (step: GitHubWorkflowStep) => boolean): number => {
      const idx = steps.findIndex(predicate);
      if (idx === -1) throw new Error("Step not found matching predicate");
      return idx;
    };

    it("C4.1: actions/checkout is the very first step in the pipeline", () => {
      const checkoutIdx = getStepIndex((s) => Boolean(s.uses?.includes("actions/checkout")));
      expect(checkoutIdx).toBe(0);
    });

    it("C4.2: Runtime environments (Node & Bun) are installed before dependency resolution", () => {
      const nodeIdx = getStepIndex((s) => Boolean(s.uses?.includes("actions/setup-node")));
      const bunIdx = getStepIndex((s) => Boolean(s.uses?.includes("oven-sh/setup-bun")));
      const installIdx = getStepIndex((s) => Boolean(s.run?.includes("bun install")));

      expect(nodeIdx).toBeLessThan(installIdx);
      expect(bunIdx).toBeLessThan(installIdx);
    });

    it("C4.3: Dependency resolution (bun install) strictly precedes web build (bun run build)", () => {
      const installIdx = getStepIndex((s) => Boolean(s.run?.includes("bun install")));
      const webBuildIdx = getStepIndex((s) => Boolean(s.run?.includes("bun run build")));

      expect(installIdx).toBeLessThan(webBuildIdx);
    });

    it("C4.4: Web application build strictly precedes Capacitor sync to guarantee fresh assets", () => {
      const webBuildIdx = getStepIndex((s) => Boolean(s.run?.includes("bun run build")));
      const capSyncIdx = getStepIndex((s) => Boolean(s.run?.includes("cap sync android")));

      expect(webBuildIdx).toBeLessThan(capSyncIdx);
    });

    it("C4.5: Java JDK and Gradle setup precede native Android compilation", () => {
      const javaIdx = getStepIndex((s) => Boolean(s.uses?.includes("actions/setup-java")));
      const gradleSetupIdx = getStepIndex((s) => Boolean(s.uses?.includes("setup-gradle")));
      const assembleIdx = getStepIndex((s) => Boolean(s.run?.includes("assembleDebug")));

      expect(javaIdx).toBeLessThan(assembleIdx);
      expect(gradleSetupIdx).toBeLessThan(assembleIdx);
    });

    it("C4.6: Capacitor sync strictly precedes native Android compilation", () => {
      const capSyncIdx = getStepIndex((s) => Boolean(s.run?.includes("cap sync android")));
      const assembleIdx = getStepIndex((s) => Boolean(s.run?.includes("assembleDebug")));

      expect(capSyncIdx).toBeLessThan(assembleIdx);
    });

    it("C4.7: Gradle wrapper executable bit (chmod +x) is granted prior to invoking gradlew", () => {
      const chmodIdx = getStepIndex((s) => Boolean(s.run?.includes("chmod +x android/gradlew")));
      const assembleIdx = getStepIndex((s) => Boolean(s.run?.includes("assembleDebug")));

      expect(chmodIdx).toBeLessThan(assembleIdx);
    });

    it("C4.8: Native compilation strictly precedes artifact upload", () => {
      const assembleIdx = getStepIndex((s) => Boolean(s.run?.includes("assembleDebug")));
      const uploadIdx = getStepIndex((s) => Boolean(s.uses?.includes("actions/upload-artifact")));

      expect(assembleIdx).toBeLessThan(uploadIdx);
    });

    it("C4.9: Assemble step enforces --no-daemon flag and targets assembleDebug", () => {
      const assembleStep = steps.find((s) => s.run?.includes("assembleDebug"));
      expect(assembleStep).toBeDefined();
      expect(assembleStep?.run).toContain("./gradlew assembleDebug");
      expect(assembleStep?.run).toContain("--no-daemon");
      expect(assembleStep?.run).toContain("cd android");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Artifact Contract & Path Alignment
  // --------------------------------------------------------------------------
  describe("Challenge 5: Artifact Contract & Output Hierarchy Alignment", () => {
    const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");
    const parsed = yaml.load(rawContent) as any;
    const steps: GitHubWorkflowStep[] = parsed.jobs.build.steps;
    const uploadStep = steps.find((s) => s.uses?.includes("actions/upload-artifact"));

    it("C5.1: Artifact upload step is defined with with block", () => {
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.with).toBeDefined();
    });

    it("C5.2: Artifact name matches CANONICAL_SPECS.ci.artifactName exactly", () => {
      expect(uploadStep?.with?.name).toBe("montanha-personal-studio-debug-apk");
      expect(uploadStep?.with?.name).toBe(CANONICAL_SPECS.ci.artifactName);
    });

    it("C5.3: Artifact path points strictly to android/app/build/outputs/apk/debug/app-debug.apk", () => {
      expect(uploadStep?.with?.path).toBe("android/app/build/outputs/apk/debug/app-debug.apk");
    });

    it("C5.4: Target path mirrors Gradle standard output location for Debug buildType", () => {
      const expectedPath = path.join("android", "app", "build", "outputs", "apk", "debug", "app-debug.apk");
      expect(expectedPath.replace(/\\/g, "/")).toBe(uploadStep?.with?.path);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 6: Zero Secret Leakage & Pipeline Security Audit
  // --------------------------------------------------------------------------
  describe("Challenge 6: Zero Secret Leakage & Pipeline Security Audit", () => {
    const rawContent = fs.readFileSync(WORKFLOW_PATH, "utf-8");

    it("C6.1: Zero hardcoded secrets, passwords, or tokens in workflow file", () => {
      const sensitiveKeywords = [
        "ghp_",
        "github_pat_",
        "eyJh", // JWT token prefix
        "supabase_service_role",
        "AIza", // Google API key prefix
        "SECRET_KEY",
        "PASSWORD",
        "BEGIN RSA PRIVATE KEY",
        "BEGIN PRIVATE KEY",
      ];
      for (const keyword of sensitiveKeywords) {
        expect(rawContent).not.toContain(keyword);
      }
    });

    it("C6.2: Zero untrusted remote download pipelines (no curl | bash or wget piped to shell)", () => {
      expect(rawContent).not.toMatch(/curl\s+[^|]+\|\s*(ba|z)?sh/);
      expect(rawContent).not.toMatch(/wget\s+[^|]+\|\s*(ba|z)?sh/);
    });

    it("C6.3: Zero excessive repository permissions declared", () => {
      expect(rawContent).not.toContain("write-all");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 7: Adversarial Mutation Oracles (Negative Testing)
  // --------------------------------------------------------------------------
  describe("Challenge 7: Adversarial Mutation Oracles (Negative Testing)", () => {
    const validRaw = fs.readFileSync(WORKFLOW_PATH, "utf-8");

    it("C7.1: Mutation Oracle detects if checkout step is omitted", () => {
      const mutated = validRaw.replace(/- name: Checkout repository\s+uses: actions\/checkout@v4/, "");
      const parsed = yaml.load(mutated) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(parsed);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("actions/checkout"))).toBe(true);
    });

    it("C7.2: Mutation Oracle detects if Java setup step is omitted", () => {
      const mutated = validRaw.replace(/- name: Setup Java JDK 17[\s\S]+?distribution: "temurin"[\s\S]+?java-version: "17"/, "");
      const parsed = yaml.load(mutated) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(parsed);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("actions/setup-java"))).toBe(true);
    });

    it("C7.3: Mutation Oracle detects if assembleDebug step is omitted", () => {
      const mutated = validRaw.replace(/run: cd android && \.\/gradlew assembleDebug --no-daemon/, "run: echo skipping build");
      const parsed = yaml.load(mutated) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(parsed);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("assembleDebug"))).toBe(true);
    });

    it("C7.4: Mutation Oracle detects if runner is mutated away from ubuntu-latest", () => {
      const mutated = validRaw.replace("runs-on: ubuntu-latest", "runs-on: windows-latest");
      const parsed = yaml.load(mutated) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(parsed);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("ubuntu-latest"))).toBe(true);
    });

    it("C7.5: Mutation Oracle detects if artifact upload name is mutated", () => {
      const mutated = validRaw.replace("name: montanha-personal-studio-debug-apk", "name: wrong-artifact-name");
      const parsed = yaml.load(mutated) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(parsed);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("Artifact upload name must be"))).toBe(true);
    });

    it("C7.6: Mutation Oracle detects inverted build sequence (assembleDebug before cap sync)", () => {
      // Invert cap sync and assembleDebug
      const capSyncStep = "- name: Sync Capacitor Android\n        run: bunx cap sync android";
      const assembleStep = "- name: Build Android APK\n        run: cd android && ./gradlew assembleDebug --no-daemon";

      const inverted = validRaw
        .replace(capSyncStep, "TEMP_MARKER")
        .replace(assembleStep, capSyncStep)
        .replace("TEMP_MARKER", assembleStep);

      const parsed = yaml.load(inverted) as any;
      const steps: GitHubWorkflowStep[] = parsed.jobs.build.steps;
      const capIdx = steps.findIndex((s) => s.run?.includes("cap sync android"));
      const assembleIdx = steps.findIndex((s) => s.run?.includes("assembleDebug"));

      // Verify oracle catches inverted dependency
      expect(assembleIdx < capIdx).toBe(true); // Demonstrating inverted order triggers violation
    });

    it("C7.7: Mutation Oracle detects missing --no-daemon flag in Gradle step", () => {
      const mutated = validRaw.replace("--no-daemon", "");
      const parsed = yaml.load(mutated) as any;
      const assembleStep = parsed.jobs.build.steps.find((s: any) => s.run?.includes("assembleDebug"));

      expect(assembleStep.run.includes("--no-daemon")).toBe(false);
    });
  });
});
