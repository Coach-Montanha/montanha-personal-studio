/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M3)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m3_1
 * Role: Local Build Script & CI Pipeline Challenger
 * Scope: scripts/build-apk.ps1, scripts/build-apk.sh, .github/workflows/build-apk.yml,
 *        AST syntax parsing, parameter rejection, pre-flight exit codes,
 *        disk simulation boundaries, and Ponytail build minimalism.
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { spawnSync } from "node:child_process";
import yaml from "js-yaml";
import {
  CANONICAL_SPECS,
  validateGitHubWorkflow,
  simulateBuildApkScript,
  validateDependencies,
  type GitHubWorkflowSpec,
} from "./contracts";

const ROOT_DIR = path.resolve(__dirname, "../..");
const SCRIPTS_DIR = path.join(ROOT_DIR, "scripts");
const PS_SCRIPT = path.join(SCRIPTS_DIR, "build-apk.ps1");
const BASH_SCRIPT = path.join(SCRIPTS_DIR, "build-apk.sh");
const WORKFLOW_FILE = path.join(ROOT_DIR, ".github/workflows/build-apk.yml");
const PKG_FILE = path.join(ROOT_DIR, "package.json");

// Locate sh executable from Git for POSIX testing on Windows
const SH_PATH = "C:\\Users\\Administrator\\AppData\\Local\\Programs\\Git\\usr\\bin\\sh.exe";
const HAS_POSIX_SH = fs.existsSync(SH_PATH);

describe("Tier 5: Challenger M3 Empirical Verification (Build Scripts & CI Pipeline)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: PowerShell Script AST Syntax, Parameter Validation & Defense
  // --------------------------------------------------------------------------
  describe("Challenge 1: PowerShell AST Syntax & Defensive Parameter Validation", () => {
    it("C1.1: File exists on disk and is non-empty", () => {
      expect(fs.existsSync(PS_SCRIPT)).toBe(true);
      const stat = fs.statSync(PS_SCRIPT);
      expect(stat.size).toBeGreaterThan(1000);
    });

    it("C1.2: .NET [System.Management.Automation.Language.Parser] parses script with 0 syntax errors", () => {
      const psCommand = [
        "$errs = $null",
        `$ast = [System.Management.Automation.Language.Parser]::ParseFile('${PS_SCRIPT.replace(/'/g, "''")}', [ref]$null, [ref]$errs)`,
        "if ($errs.Count -gt 0) {",
        "  Write-Error ('AST_ERRORS:' + ($errs | Out-String))",
        "  exit 1",
        "} else {",
        "  Write-Output ('AST_SUCCESS:' + $ast.GetType().Name)",
        "}",
      ].join("; ");

      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        psCommand,
      ], { cwd: ROOT_DIR, encoding: "utf-8" });

      expect(proc.status).toBe(0);
      expect(proc.stdout).toContain("AST_SUCCESS:ScriptBlockAst");
      expect(proc.stderr).toBe("");
    });

    it("C1.3: Script declares param block with default BuildType='Debug' and Clean switch", () => {
      const content = fs.readFileSync(PS_SCRIPT, "utf-8");
      expect(content).toContain("[CmdletBinding()]");
      expect(content).toMatch(/param\s*\(/);
      expect(content).toContain('$BuildType = "Debug"');
      expect(content).toMatch(/\[switch\]\s*\$Clean/);
    });

    it("C1.4: Empirical parameter validation: rejects invalid BuildType variants with Exit Code 1", () => {
      const invalidVariants = ["FooBar", "Production", "Staging", "InvalidVariant"];
      for (const variant of invalidVariants) {
        const proc = spawnSync("powershell", [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          PS_SCRIPT,
          "-BuildType",
          variant,
        ], { cwd: ROOT_DIR, encoding: "utf-8" });

        expect(proc.status).toBe(1);
        expect(proc.stderr).toContain(`Invalid -BuildType '${variant}'. Must be one of: Debug, Release`);
      }
    });

    it("C1.5: Empirical parameter validation: accepts case variations and normalizes to canonical casing", () => {
      const validCases = ["debug", "DEBUG", "release", "RELEASE"];
      for (const variant of validCases) {
        const proc = spawnSync("powershell", [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          PS_SCRIPT,
          "-BuildType",
          variant,
        ], { cwd: ROOT_DIR, encoding: "utf-8" });

        // Normalization occurs before Java preflight check (which exits with code 2 on this host)
        const expectedCanonical = variant.toLowerCase() === "debug" ? "Debug" : "Release";
        expect(proc.stdout).toContain(`[Montanha Mobile Builder] Target: ${expectedCanonical}`);
        expect(proc.status).toBe(2); // Preflight Java exit code
      }
    });

    it("C1.6: Adversarial injection attempts in -BuildType are rejected with Exit Code 1", () => {
      const maliciousInputs = [
        "Debug; Get-Process",
        "Release & calc.exe",
        "Debug' OR 1=1 --",
        "`nWrite-Host pwned",
      ];

      for (const payload of maliciousInputs) {
        const proc = spawnSync("powershell", [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          PS_SCRIPT,
          "-BuildType",
          payload,
        ], { cwd: ROOT_DIR, encoding: "utf-8" });

        expect(proc.status).toBe(1);
        expect(proc.stderr).toContain("Invalid -BuildType");
      }
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Bash Companion Script Syntax, Execution & Normalization
  // --------------------------------------------------------------------------
  describe("Challenge 2: Bash Script Syntax & Compatibility", () => {
    it("C2.1: Bash script exists, has executable permissions header and set -e", () => {
      expect(fs.existsSync(BASH_SCRIPT)).toBe(true);
      const content = fs.readFileSync(BASH_SCRIPT, "utf-8");
      expect(content).toMatch(/^#!\/usr\/bin\/env bash/);
      expect(content).toContain("set -e");
    });

    it("C2.2: POSIX syntax parsing check (sh -n) validates with 0 syntax errors", () => {
      if (!HAS_POSIX_SH) return;
      const proc = spawnSync(SH_PATH, ["-n", BASH_SCRIPT], {
        cwd: ROOT_DIR,
        encoding: "utf-8",
      });
      expect(proc.status).toBe(0);
      expect(proc.stderr.trim()).toBe("");
    });

    it("C2.3: Bash script rejects invalid -BuildType variants with Exit Code 1", () => {
      if (!HAS_POSIX_SH) return;
      const proc = spawnSync(SH_PATH, [BASH_SCRIPT, "-BuildType", "InvalidVariant"], {
        cwd: ROOT_DIR,
        encoding: "utf-8",
      });
      expect(proc.status).toBe(1);
      expect(proc.stderr).toContain("Invalid -BuildType 'InvalidVariant'. Must be one of: Debug, Release");
    });

    it("C2.4: Bash script rejects unknown flags with Exit Code 1", () => {
      if (!HAS_POSIX_SH) return;
      const proc = spawnSync(SH_PATH, [BASH_SCRIPT, "--unrecognized-flag"], {
        cwd: ROOT_DIR,
        encoding: "utf-8",
      });
      expect(proc.status).toBe(1);
      expect(proc.stderr).toContain("Unknown option: --unrecognized-flag");
    });

    it("C2.5: Bash script responds to --help with Exit Code 0", () => {
      if (!HAS_POSIX_SH) return;
      const proc = spawnSync(SH_PATH, [BASH_SCRIPT, "--help"], {
        cwd: ROOT_DIR,
        encoding: "utf-8",
      });
      expect(proc.status).toBe(0);
      expect(proc.stdout).toContain("Usage: ./scripts/build-apk.sh");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Toolchain Pre-Flight Verification & Exit Code Integrity
  // --------------------------------------------------------------------------
  describe("Challenge 3: Toolchain Pre-Flight Verification & Exit Code Integrity", () => {
    it("C3.1: Host missing Java exits strictly with Exit Code 2 and contract error message", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], {
        cwd: ROOT_DIR,
        env: { ...process.env, JAVA_HOME: "" },
        encoding: "utf-8",
      });

      expect(proc.status).toBe(2);
      expect(proc.stderr).toContain(
        "Pre-flight failure: Java (JDK 17+) not found in PATH or JAVA_HOME. Install OpenJDK or build on GitHub Actions CI."
      );
    });

    it("C3.2: Mocked Java + missing Android SDK exits strictly with Exit Code 3", () => {
      const tempJava = path.join(os.tmpdir(), "mock-java-" + Date.now());
      fs.mkdirSync(path.join(tempJava, "bin"), { recursive: true });
      fs.writeFileSync(path.join(tempJava, "bin", "java.exe"), "");

      try {
        const proc = spawnSync("powershell", [
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Bypass",
          "-File",
          PS_SCRIPT,
        ], {
          cwd: ROOT_DIR,
          env: {
            ...process.env,
            JAVA_HOME: tempJava,
            ANDROID_HOME: "",
            ANDROID_SDK_ROOT: "",
          },
          encoding: "utf-8",
        });

        expect(proc.status).toBe(3);
        expect(proc.stderr).toContain(
          "Pre-flight failure: Android SDK not found in ANDROID_HOME or ANDROID_SDK_ROOT. Configure Android Studio or build on GitHub Actions CI."
        );
      } finally {
        fs.rmSync(tempJava, { recursive: true, force: true });
      }
    });

    it("C3.3: Bash script with simulated Java and missing Android SDK exits with Exit Code 3", () => {
      if (!HAS_POSIX_SH) return;
      const bashCmd = `TMPJAVA=$(mktemp -d); mkdir -p "$TMPJAVA/bin"; touch "$TMPJAVA/bin/java.exe"; export JAVA_HOME="$TMPJAVA"; export ANDROID_HOME=""; export ANDROID_SDK_ROOT=""; sh "${BASH_SCRIPT.replace(/\\/g, "/")}"; code=$?; rm -rf "$TMPJAVA"; exit $code`;
      const proc = spawnSync(SH_PATH, ["-c", bashCmd], {
        cwd: ROOT_DIR,
        encoding: "utf-8",
      });

      expect(proc.status).toBe(3);
      expect(proc.stderr).toContain("Pre-flight failure: Android SDK not found in ANDROID_HOME or ANDROID_SDK_ROOT");
    });

    it("C3.4: Host resource defense: Gradle wrapper is NEVER invoked when pre-flight checks fail", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], { cwd: ROOT_DIR, encoding: "utf-8" });

      // Gradle execution output marker should NOT be present
      expect(proc.stdout).not.toContain("[Gradle] Executing");
      expect(proc.stdout).not.toContain("assembleDebug");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: Host Resource Protection & Disk Space Calculation Boundaries
  // --------------------------------------------------------------------------
  describe("Challenge 4: Host Resource Protection & Disk Calculation Boundaries", () => {
    it("C4.1: Exactly 10 GB (10,737,418,240 bytes) does NOT emit low disk warning", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], {
        cwd: ROOT_DIR,
        env: { ...process.env, SIMULATE_DISK_BYTES: "10737418240" },
        encoding: "utf-8",
      });

      expect(proc.stdout).not.toContain("[WARNING]");
    });

    it("C4.2: 10 GB minus 1 byte (10,737,418,239 bytes) strictly emits low disk warning", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], {
        cwd: ROOT_DIR,
        env: { ...process.env, SIMULATE_DISK_BYTES: "10737418239" },
        encoding: "utf-8",
      });

      expect(proc.stdout).toContain(
        "[WARNING] Host disk space low: 10.00 GB free (Recommended: >= 10 GB). Consider using GitHub Actions CI to avoid local disk bloat."
      );
    });

    it("C4.3: Low disk simulation (8 GB) formats free space with 2 decimal digits", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], {
        cwd: ROOT_DIR,
        env: { ...process.env, SIMULATE_DISK_BYTES: "8589934592" },
        encoding: "utf-8",
      });

      expect(proc.stdout).toContain("[WARNING] Host disk space low: 8.00 GB free");
    });

    it("C4.4: Zero bytes disk space simulation handles 0 safely without division by zero crash", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
      ], {
        cwd: ROOT_DIR,
        env: { ...process.env, SIMULATE_DISK_BYTES: "0" },
        encoding: "utf-8",
      });

      expect(proc.stdout).toContain("[WARNING] Host disk space low: 0.00 GB free");
      expect(proc.status).toBe(2); // Still halted at Java preflight
    });

    it("C4.5: Memory and daemon safety: script configures --no-daemon and -Xmx2048m", () => {
      const content = fs.readFileSync(PS_SCRIPT, "utf-8");
      expect(content).toContain('$gradleDaemonFlag = "--no-daemon"');
      expect(content).toContain('$env:GRADLE_OPTS = "-Xmx2048m"');
      expect(content).toContain("-Dorg.gradle.jvmargs=-Xmx2048m");

      const bashContent = fs.readFileSync(BASH_SCRIPT, "utf-8");
      expect(bashContent).toContain('GRADLE_DAEMON_FLAG="--no-daemon"');
      expect(bashContent).toContain('export GRADLE_OPTS="-Xmx2048m"');
      expect(bashContent).toContain('-Dorg.gradle.jvmargs="-Xmx2048m"');
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Cache Invalidation & Clean Switch Behavior
  // --------------------------------------------------------------------------
  describe("Challenge 5: Cache Invalidation & Clean Switch Behavior", () => {
    it("C5.1: Executing with -Clean does not fail when intermediates directory does not exist", () => {
      const proc = spawnSync("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        PS_SCRIPT,
        "-Clean",
      ], { cwd: ROOT_DIR, encoding: "utf-8" });

      // Should not throw or crash on clean handling, fails cleanly at preflight Java check
      expect(proc.status).toBe(2);
      expect(proc.stderr).toContain("Pre-flight failure: Java");
    });

    it("C5.2: Clean logic specifically targets intermediates directory without touching source code", () => {
      const content = fs.readFileSync(PS_SCRIPT, "utf-8");
      expect(content).toContain('Join-Path $androidDir "app\\build\\intermediates"');
      expect(content).not.toContain("Remove-Item -Path $androidDir -Recurse");

      const bashContent = fs.readFileSync(BASH_SCRIPT, "utf-8");
      expect(bashContent).toContain('rm -rf "$ANDROID_DIR/app/build/intermediates"');
      expect(bashContent).not.toContain('rm -rf "$ANDROID_DIR"');
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 6: GitHub Actions Workflow Security & Contract Compliance
  // --------------------------------------------------------------------------
  describe("Challenge 6: CI Workflow Security & Contract Compliance", () => {
    it("C6.1: Workflow file exists and parses as valid YAML", () => {
      expect(fs.existsSync(WORKFLOW_FILE)).toBe(true);
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const doc = yaml.load(rawContent) as Record<string, any>;
      expect(doc).toBeDefined();
      expect(doc.name).toBe("Build Android APK");
      expect(doc.jobs.build).toBeDefined();
    });

    it("C6.2: Workflow complies 100% with canonical validateGitHubWorkflow contract", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const doc = yaml.load(rawContent) as GitHubWorkflowSpec;
      const res = validateGitHubWorkflow(doc);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it("C6.3: Supply chain security: all external GitHub actions are pinned to major version tags", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const doc = yaml.load(rawContent) as any;
      const steps = doc.jobs.build.steps as Array<{ uses?: string }>;

      const externalActionSteps = steps.filter((s) => s.uses);
      expect(externalActionSteps.length).toBeGreaterThanOrEqual(5);

      for (const step of externalActionSteps) {
        expect(step.uses).toMatch(/@[vV]?\d+(\.\d+)?$/);
        expect(step.uses).not.toContain("@main");
        expect(step.uses).not.toContain("@master");
      }
    });

    it("C6.4: Dependency installation security: uses 'bun install --frozen-lockfile'", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      expect(rawContent).toContain("bun install --frozen-lockfile");
    });

    it("C6.5: Cloud runner and JDK configuration match project specifications", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const doc = yaml.load(rawContent) as any;
      expect(doc.jobs.build["runs-on"]).toBe("ubuntu-latest");

      const javaStep = doc.jobs.build.steps.find((s: any) => s.uses && s.uses.includes("setup-java"));
      expect(javaStep).toBeDefined();
      expect(javaStep.with.distribution).toBe("temurin");
      expect(javaStep.with["java-version"]).toBe("17");
    });

    it("C6.6: Artifact publication matches exact contract name and APK output path", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const doc = yaml.load(rawContent) as any;
      const uploadStep = doc.jobs.build.steps.find((s: any) => s.uses && s.uses.includes("upload-artifact"));
      expect(uploadStep).toBeDefined();
      expect(uploadStep.with.name).toBe(CANONICAL_SPECS.ci.artifactName);
      expect(uploadStep.with.name).toBe("montanha-personal-studio-debug-apk");
      expect(uploadStep.with.path).toBe("android/app/build/outputs/apk/debug/app-debug.apk");
    });

    it("C6.7: Zero secrets or sensitive credentials leaked in workflow", () => {
      const rawContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      expect(rawContent).not.toContain("AWS_SECRET");
      expect(rawContent).not.toContain("PASSWORD");
      expect(rawContent).not.toContain("API_KEY");
      expect(rawContent).not.toContain("curl -d");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 7: Package.json Integration & Ponytail Minimalism
  // --------------------------------------------------------------------------
  describe("Challenge 7: Package.json Scripts & Ponytail Minimalism", () => {
    it("C7.1: package.json scripts defines 'build:apk' pointing to scripts/build-apk.ps1", () => {
      const pkg = JSON.parse(fs.readFileSync(PKG_FILE, "utf-8"));
      expect(pkg.scripts["build:apk"]).toBe("powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1");
    });

    it("C7.2: Ponytail minimalism: strictly 3 Capacitor packages installed", () => {
      const pkg = JSON.parse(fs.readFileSync(PKG_FILE, "utf-8"));
      const res = validateDependencies(pkg);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);

      const capDeps = Object.keys(pkg.dependencies || {}).filter(k => k.startsWith("@capacitor/"));
      const capDevDeps = Object.keys(pkg.devDependencies || {}).filter(k => k.startsWith("@capacitor/"));

      expect(capDeps).toEqual(["@capacitor/android", "@capacitor/core"]);
      expect(capDevDeps).toEqual(["@capacitor/cli"]);
      expect(capDeps.length + capDevDeps.length).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 8: Adversarial Mutation Oracles
  // --------------------------------------------------------------------------
  describe("Challenge 8: Adversarial Mutation Oracles for Build Pipeline", () => {
    it("C8.1: Mutation Oracle detects tampering with Java exit code (e.g. changed from 2 to 1)", () => {
      const scriptCode = fs.readFileSync(PS_SCRIPT, "utf-8");
      const mutatedCode = scriptCode.replace(
        "exit 2",
        "exit 1"
      );

      const checkJavaExitCode = (code: string) => {
        return code.includes("Java (JDK 17+) not found") && code.includes("exit 2");
      };

      expect(checkJavaExitCode(scriptCode)).toBe(true);
      expect(checkJavaExitCode(mutatedCode)).toBe(false);
    });

    it("C8.2: Mutation Oracle detects tampering with Android SDK exit code (e.g. changed from 3 to 1)", () => {
      const scriptCode = fs.readFileSync(PS_SCRIPT, "utf-8");
      const mutatedCode = scriptCode.replace(
        "exit 3",
        "exit 1"
      );

      const checkSdkExitCode = (code: string) => {
        return code.includes("Android SDK not found") && code.includes("exit 3");
      };

      expect(checkSdkExitCode(scriptCode)).toBe(true);
      expect(checkSdkExitCode(mutatedCode)).toBe(false);
    });

    it("C8.3: Mutation Oracle detects tampering with Gradle daemon flag (e.g. removing --no-daemon)", () => {
      const scriptCode = fs.readFileSync(PS_SCRIPT, "utf-8");
      const mutatedCode = scriptCode.replace(
        '$gradleDaemonFlag = "--no-daemon"',
        '$gradleDaemonFlag = ""'
      );

      const checkDaemonFlag = (code: string) => {
        return code.includes('$gradleDaemonFlag = "--no-daemon"');
      };

      expect(checkDaemonFlag(scriptCode)).toBe(true);
      expect(checkDaemonFlag(mutatedCode)).toBe(false);
    });

    it("C8.4: Mutation Oracle detects tampering with CI workflow artifact name", () => {
      const validWorkflow = yaml.load(fs.readFileSync(WORKFLOW_FILE, "utf-8")) as GitHubWorkflowSpec;
      const mutatedWorkflow = JSON.parse(JSON.stringify(validWorkflow)) as GitHubWorkflowSpec;

      // Tamper with artifact name
      const uploadStep = mutatedWorkflow.jobs.build.steps.find((s) => s.uses && s.uses.includes("upload-artifact"));
      if (uploadStep && uploadStep.with) {
        uploadStep.with.name = "tampered-apk-name";
      }

      expect(validateGitHubWorkflow(validWorkflow).valid).toBe(true);
      const mutatedResult = validateGitHubWorkflow(mutatedWorkflow);
      expect(mutatedResult.valid).toBe(false);
      expect(mutatedResult.errors[0]).toContain("Artifact upload name must be 'montanha-personal-studio-debug-apk'");
    });

    it("C8.5: Mutation Oracle detects removal of frozen lockfile in CI dependencies step", () => {
      const wfContent = fs.readFileSync(WORKFLOW_FILE, "utf-8");
      const compromisedWf = wfContent.replace("--frozen-lockfile", "");

      const checkFrozenLockfile = (wf: string) => {
        return wf.includes("bun install --frozen-lockfile");
      };

      expect(checkFrozenLockfile(wfContent)).toBe(true);
      expect(checkFrozenLockfile(compromisedWf)).toBe(false);
    });
  });

});
