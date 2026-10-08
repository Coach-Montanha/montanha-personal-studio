/**
 * ============================================================================
 * E2E Mobile Wrapper Test Suite: Contracts, Schemas & Authoritative Validators
 * ============================================================================
 * Project: Montanha Personal Studio
 * Methodology: 4-Tier Opaque-Box Systematic Testing
 * 
 * Authoritative Sources:
 * - ORIGINAL_REQUEST.md (R1 - R4, Acceptance Criteria)
 * - PROJECT.md (Architecture, Code Layout, Features 1-15, Interface Contracts)
 * - Survey Reports (Explorer 1, 2, 3 Findings)
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ----------------------------------------------------------------------------
// 1. Authoritative Constants & Canonical Specifications
// ----------------------------------------------------------------------------

export const CANONICAL_SPECS = {
  app: {
    name: "Montanha Personal Studio",
    id: "com.ecossistemamontanha.personalstudio",
    webDir: ".output/public",
    defaultServerUrl: "https://montanha-personal-studio.vercel.app",
    androidScheme: "https",
    backgroundColor: "#F8F9FE",
    primaryColor: "#6958E2",
  },
  capacitor: {
    coreVersion: "8.5.2",
    androidVersion: "8.5.2",
    cliVersion: "8.5.2",
    minNodeEngine: ">=22.0.0",
  },
  android: {
    screenOrientation: "portrait",
    windowSoftInputMode: "adjustResize",
    hardwareAccelerated: "true",
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
    ],
    prohibitedPermissions: [
      "android.permission.CAMERA",
      "android.permission.READ_CONTACTS",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.RECORD_AUDIO",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
    ],
    networkSecurity: {
      cleartextTrafficPermitted: false,
      devCleartextDomains: ["localhost", "10.0.2.2"],
    },
    mipmaps: [
      { density: "mdpi", size: 48 },
      { density: "hdpi", size: 72 },
      { density: "xhdpi", size: 96 },
      { density: "xxhdpi", size: 144 },
      { density: "xxxhdpi", size: 192 },
    ],
  },
  buildScript: {
    minDiskSpaceBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    allowedBuildTypes: ["Debug", "Release"],
    defaultBuildType: "Debug",
    gradleDaemonFlag: "--no-daemon",
  },
  ci: {
    runner: "ubuntu-latest",
    nodeVersion: "20",
    javaVersion: "17",
    javaDistribution: "temurin",
    artifactName: "montanha-personal-studio-debug-apk",
  },
  compliance: {
    minTouchTargetPx: 44,
    minMobileInputFontSizePx: 16,
    requiredViewportFit: "cover",
  },
};

// ----------------------------------------------------------------------------
// 2. TypeScript Interfaces
// ----------------------------------------------------------------------------

export interface CapacitorConfigInput {
  appId?: string;
  appName?: string;
  webDir?: string;
  backgroundColor?: string;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
  };
  android?: {
    allowMixedContent?: boolean;
    captureInput?: boolean;
    webContentsDebuggingEnabled?: boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ManifestInspectionResult {
  valid: boolean;
  packageName?: string;
  screenOrientation?: string;
  windowSoftInputMode?: string;
  hardwareAccelerated?: boolean;
  hasNetworkSecurityConfig?: boolean;
  declaredPermissions: string[];
  unauthorizedPermissions: string[];
  errors: string[];
}

export interface NetworkSecurityInspectionResult {
  valid: boolean;
  cleartextPermittedBase: boolean;
  devCleartextDomains: string[];
  errors: string[];
}

export interface BuildScriptSimParams {
  buildType?: string;
  clean?: boolean;
  availableDiskBytes: number;
  hasJava: boolean;
  hasAndroidSdk: boolean;
}

export interface BuildScriptSimResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  apkPath?: string;
  warnDiskSpace: boolean;
}

export interface GitHubWorkflowStep {
  name?: string;
  uses?: string;
  run?: string;
  with?: Record<string, any>;
}

export interface GitHubWorkflowSpec {
  name: string;
  on: Record<string, any> | string[];
  jobs: {
    [jobName: string]: {
      "runs-on": string;
      steps: GitHubWorkflowStep[];
    };
  };
}

// ----------------------------------------------------------------------------
// 3. Domain Validators & Specification Analyzers
// ----------------------------------------------------------------------------

/**
 * Validates Capacitor Configuration against Project Blueprint and Original Request.
 */
export function validateCapacitorConfig(config: CapacitorConfigInput): ValidationResult {
  const errors: string[] = [];

  if (!config.appId) {
    errors.push("Missing appId");
  } else if (config.appId !== CANONICAL_SPECS.app.id) {
    errors.push(`Invalid appId '${config.appId}', expected '${CANONICAL_SPECS.app.id}'`);
  }

  if (!config.appName) {
    errors.push("Missing appName");
  } else if (config.appName !== CANONICAL_SPECS.app.name) {
    errors.push(`Invalid appName '${config.appName}', expected '${CANONICAL_SPECS.app.name}'`);
  }

  if (!config.webDir) {
    errors.push("Missing webDir");
  } else if (config.webDir !== CANONICAL_SPECS.app.webDir) {
    errors.push(`Invalid webDir '${config.webDir}', expected '${CANONICAL_SPECS.app.webDir}'`);
  }

  if (config.server) {
    if (config.server.androidScheme && config.server.androidScheme !== "https") {
      errors.push(`Invalid androidScheme '${config.server.androidScheme}', expected 'https'`);
    }
    if (config.server.url) {
      try {
        const parsed = new URL(config.server.url);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          errors.push(`Unsupported protocol in server.url: ${parsed.protocol}`);
        }
      } catch {
        errors.push(`Malformed server.url: '${config.server.url}'`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Resolves effective server URL taking environment variable into account.
 */
export function resolveEffectiveServerUrl(envServerUrl?: string): string {
  if (envServerUrl && envServerUrl.trim().length > 0) {
    return envServerUrl.trim();
  }
  return CANONICAL_SPECS.app.defaultServerUrl;
}

/**
 * Validates package.json dependencies for Ponytail zero-bloat compliance.
 */
export function validateDependencies(packageJson: {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}): ValidationResult {
  const errors: string[] = [];
  const deps = packageJson.dependencies || {};
  const devDeps = packageJson.devDependencies || {};

  // Check required dependencies
  if (!deps["@capacitor/core"]) {
    errors.push("Missing required dependency: @capacitor/core");
  } else if (!deps["@capacitor/core"].includes(CANONICAL_SPECS.capacitor.coreVersion)) {
    errors.push(`Expected @capacitor/core pinned to ${CANONICAL_SPECS.capacitor.coreVersion}, got ${deps["@capacitor/core"]}`);
  }

  if (!deps["@capacitor/android"]) {
    errors.push("Missing required dependency: @capacitor/android");
  } else if (!deps["@capacitor/android"].includes(CANONICAL_SPECS.capacitor.androidVersion)) {
    errors.push(`Expected @capacitor/android pinned to ${CANONICAL_SPECS.capacitor.androidVersion}, got ${deps["@capacitor/android"]}`);
  }

  if (!devDeps["@capacitor/cli"]) {
    errors.push("Missing required devDependency: @capacitor/cli");
  } else if (!devDeps["@capacitor/cli"].includes(CANONICAL_SPECS.capacitor.cliVersion)) {
    errors.push(`Expected @capacitor/cli pinned to ${CANONICAL_SPECS.capacitor.cliVersion}, got ${devDeps["@capacitor/cli"]}`);
  }

  // Check prohibited bloat packages (Ponytail compliance)
  const prohibitedCapPlugins = [
    "@capacitor/status-bar",
    "@capacitor/splash-screen",
    "@capacitor/device",
    "@capacitor/network",
    "@capacitor/assets",
    "@capacitor/browser",
    "@capacitor/haptics",
    "@capacitor/keyboard",
  ];

  for (const plugin of prohibitedCapPlugins) {
    if (deps[plugin] || devDeps[plugin]) {
      errors.push(`Bloat violation (Ponytail): unnecessary package '${plugin}' detected`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parses and verifies AndroidManifest.xml string contents.
 */
export function inspectAndroidManifestXml(xmlContent: string): ManifestInspectionResult {
  const errors: string[] = [];
  const declaredPermissions: string[] = [];
  const unauthorizedPermissions: string[] = [];

  // Extract package
  const packageMatch = xmlContent.match(/package\s*=\s*["']([^"']+)["']/);
  const packageName = packageMatch ? packageMatch[1] : undefined;

  // Extract orientation
  const orientationMatch = xmlContent.match(/android:screenOrientation\s*=\s*["']([^"']+)["']/);
  const screenOrientation = orientationMatch ? orientationMatch[1] : undefined;
  if (screenOrientation !== CANONICAL_SPECS.android.screenOrientation) {
    errors.push(`Expected screenOrientation '${CANONICAL_SPECS.android.screenOrientation}', got '${screenOrientation}'`);
  }

  // Extract windowSoftInputMode
  const softInputMatch = xmlContent.match(/android:windowSoftInputMode\s*=\s*["']([^"']+)["']/);
  const windowSoftInputMode = softInputMatch ? softInputMatch[1] : undefined;
  if (!windowSoftInputMode || !windowSoftInputMode.includes(CANONICAL_SPECS.android.windowSoftInputMode)) {
    errors.push(`Expected windowSoftInputMode containing '${CANONICAL_SPECS.android.windowSoftInputMode}', got '${windowSoftInputMode}'`);
  }

  // Extract hardwareAccelerated
  const hwMatch = xmlContent.match(/android:hardwareAccelerated\s*=\s*["']([^"']+)["']/);
  const hardwareAccelerated = hwMatch ? hwMatch[1] === "true" : false;
  if (!hardwareAccelerated) {
    errors.push("Expected android:hardwareAccelerated='true'");
  }

  // Extract networkSecurityConfig
  const netSecMatch = xmlContent.match(/android:networkSecurityConfig\s*=\s*["']@xml\/network_security_config["']/);
  const hasNetworkSecurityConfig = Boolean(netSecMatch);
  if (!hasNetworkSecurityConfig) {
    errors.push("Missing android:networkSecurityConfig='@xml/network_security_config'");
  }

  // Extract permissions
  const permRegex = /<uses-permission\s+android:name\s*=\s*["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = permRegex.exec(xmlContent)) !== null) {
    const perm = match[1];
    declaredPermissions.push(perm);
    if (CANONICAL_SPECS.android.prohibitedPermissions.includes(perm)) {
      unauthorizedPermissions.push(perm);
      errors.push(`Security violation: unauthorized permission '${perm}' declared in AndroidManifest.xml`);
    }
  }

  // Verify minimal required permissions
  for (const reqPerm of CANONICAL_SPECS.android.permissions) {
    if (!declaredPermissions.includes(reqPerm)) {
      errors.push(`Missing minimal required permission '${reqPerm}' in AndroidManifest.xml`);
    }
  }

  return {
    valid: errors.length === 0,
    packageName,
    screenOrientation,
    windowSoftInputMode,
    hardwareAccelerated,
    hasNetworkSecurityConfig,
    declaredPermissions,
    unauthorizedPermissions,
    errors,
  };
}

/**
 * Parses and verifies network_security_config.xml string contents.
 */
export function inspectNetworkSecurityXml(xmlContent: string): NetworkSecurityInspectionResult {
  const errors: string[] = [];
  const devCleartextDomains: string[] = [];

  const baseConfigMatch = xmlContent.match(/<base-config\s+cleartextTrafficPermitted\s*=\s*["']([^"']+)["']/);
  const cleartextPermittedBase = baseConfigMatch ? baseConfigMatch[1] === "true" : true;

  if (cleartextPermittedBase !== false) {
    errors.push("Base configuration must enforce cleartextTrafficPermitted='false' for TLS security");
  }

  const domainRegex = /<domain\s+includeSubdomains\s*=\s*["'](?:true|false)["']\s*>([^<]+)<\/domain>/g;
  let match: RegExpExecArray | null;
  while ((match = domainRegex.exec(xmlContent)) !== null) {
    devCleartextDomains.push(match[1].trim());
  }

  for (const expectedDomain of CANONICAL_SPECS.android.networkSecurity.devCleartextDomains) {
    if (!devCleartextDomains.includes(expectedDomain)) {
      errors.push(`Missing dev cleartext domain exemption for '${expectedDomain}'`);
    }
  }

  return {
    valid: errors.length === 0,
    cleartextPermittedBase,
    devCleartextDomains,
    errors,
  };
}

/**
 * Simulates local build script execution logic (scripts/build-apk.ps1).
 */
export function simulateBuildApkScript(params: BuildScriptSimParams): BuildScriptSimResult {
  const buildType = params.buildType || CANONICAL_SPECS.buildScript.defaultBuildType;
  const isClean = params.clean ?? false;

  // Validate BuildType parameter
  if (!CANONICAL_SPECS.buildScript.allowedBuildTypes.includes(buildType)) {
    return {
      exitCode: 1,
      stdout: "",
      stderr: `Invalid -BuildType '${buildType}'. Must be one of: ${CANONICAL_SPECS.buildScript.allowedBuildTypes.join(", ")}`,
      warnDiskSpace: false,
    };
  }

  // Pre-flight 1: Disk space check (< 10GB warning)
  const warnDiskSpace = params.availableDiskBytes < CANONICAL_SPECS.buildScript.minDiskSpaceBytes;
  let stdoutLogs = `[Montanha Mobile Builder] Target: ${buildType}\n`;

  if (warnDiskSpace) {
    const freeGb = (params.availableDiskBytes / (1024 * 1024 * 1024)).toFixed(2);
    stdoutLogs += `[WARNING] Host disk space low: ${freeGb} GB free (Recommended: >= 10 GB). Consider using GitHub Actions CI to avoid local disk bloat.\n`;
  }

  // Pre-flight 2: Toolchain check
  if (!params.hasJava) {
    return {
      exitCode: 2,
      stdout: stdoutLogs,
      stderr: "Pre-flight failure: Java (JDK 17+) not found in PATH or JAVA_HOME. Install OpenJDK or build on GitHub Actions CI.",
      warnDiskSpace,
    };
  }

  if (!params.hasAndroidSdk) {
    return {
      exitCode: 3,
      stdout: stdoutLogs,
      stderr: "Pre-flight failure: Android SDK not found in ANDROID_HOME or ANDROID_SDK_ROOT. Configure Android Studio or build on GitHub Actions CI.",
      warnDiskSpace,
    };
  }

  if (isClean) {
    stdoutLogs += "[Clean] Purging local Gradle caches and previous build artifacts...\n";
  }

  stdoutLogs += `[Gradle] Executing './gradlew assemble${buildType} ${CANONICAL_SPECS.buildScript.gradleDaemonFlag}'...\n`;
  const apkFileName = `app-${buildType.toLowerCase()}.apk`;
  const apkPath = `android/app/build/outputs/apk/${buildType.toLowerCase()}/${apkFileName}`;
  stdoutLogs += `[Success] APK generated successfully at: ${apkPath}\n`;

  return {
    exitCode: 0,
    stdout: stdoutLogs,
    stderr: "",
    apkPath,
    warnDiskSpace,
  };
}

/**
 * Validates GitHub Actions workflow structure and step sequence (.github/workflows/build-apk.yml).
 */
export function validateGitHubWorkflow(workflow: GitHubWorkflowSpec): ValidationResult {
  const errors: string[] = [];

  if (!workflow.name) {
    errors.push("Missing workflow name");
  }

  if (!workflow.on) {
    errors.push("Missing workflow trigger ('on')");
  }

  const jobs = workflow.jobs || {};
  const jobKeys = Object.keys(jobs);
  if (jobKeys.length === 0) {
    errors.push("Workflow must contain at least one job");
    return { valid: false, errors };
  }

  const mainJob = jobs[jobKeys[0]];
  if (mainJob["runs-on"] !== CANONICAL_SPECS.ci.runner) {
    errors.push(`Expected runs-on '${CANONICAL_SPECS.ci.runner}', got '${mainJob["runs-on"]}'`);
  }

  const steps = mainJob.steps || [];
  if (steps.length === 0) {
    errors.push("Job must define build steps");
    return { valid: false, errors };
  }

  // Verify step presence and order
  const stepUses = steps.map((s) => s.uses || "");
  const stepRuns = steps.map((s) => s.run || "");

  const hasCheckout = stepUses.some((u) => u.includes("actions/checkout"));
  if (!hasCheckout) errors.push("Missing step: actions/checkout");

  const hasSetupJava = stepUses.some((u) => u.includes("actions/setup-java"));
  if (!hasSetupJava) errors.push("Missing step: actions/setup-java");

  const hasGradleAssemble = stepRuns.some((r) => r.includes("assembleDebug"));
  if (!hasGradleAssemble) errors.push("Missing Gradle build step: assembleDebug");

  const hasUploadArtifact = stepUses.some((u) => u.includes("actions/upload-artifact"));
  if (!hasUploadArtifact) errors.push("Missing step: actions/upload-artifact");

  const uploadStep = steps.find((s) => s.uses && s.uses.includes("actions/upload-artifact"));
  if (uploadStep?.with?.name !== CANONICAL_SPECS.ci.artifactName) {
    errors.push(`Artifact upload name must be '${CANONICAL_SPECS.ci.artifactName}', got '${uploadStep?.with?.name}'`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Evaluates Service Worker native guard logic.
 */
export function shouldRegisterServiceWorker(options: {
  isBrowser: boolean;
  isNativePlatform: boolean;
  isProduction: boolean;
}): boolean {
  if (!options.isBrowser) return false;
  if (!options.isProduction) return false;
  if (options.isNativePlatform) return false; // Guarded in Capacitor Native
  return true;
}

/**
 * Evaluates Safe Area Inset fallback calculation.
 */
export function calculateSafeAreaPadding(
  basePaddingPx: number,
  safeAreaInsetPx?: number
): number {
  const inset = Math.max(0, safeAreaInsetPx || 0);
  return basePaddingPx + inset;
}

/**
 * Evaluates Touch Target compliance for interactive elements.
 */
export function evaluateTouchTargetDimensions(options: {
  pointerType: "coarse" | "fine";
  elementWidthPx: number;
  elementHeightPx: number;
}): { meetsRequirement: boolean; effectiveWidth: number; effectiveHeight: number } {
  if (options.pointerType === "coarse") {
    const effectiveWidth = Math.max(options.elementWidthPx, CANONICAL_SPECS.compliance.minTouchTargetPx);
    const effectiveHeight = Math.max(options.elementHeightPx, CANONICAL_SPECS.compliance.minTouchTargetPx);
    return {
      meetsRequirement: options.elementWidthPx >= CANONICAL_SPECS.compliance.minTouchTargetPx &&
                        options.elementHeightPx >= CANONICAL_SPECS.compliance.minTouchTargetPx,
      effectiveWidth,
      effectiveHeight,
    };
  }

  return {
    meetsRequirement: true,
    effectiveWidth: options.elementWidthPx,
    effectiveHeight: options.elementHeightPx,
  };
}

/**
 * Multi-Tenant URL Sanitizer & Impersonation Guard for Mobile Wrapper.
 */
export function sanitizeMobileWrapperUrl(rawUrl: string, isNativeWrapper: boolean): {
  sanitizedUrl: string;
  impersonationStripped: boolean;
  tokenLeakPrevented: boolean;
} {
  try {
    const parsed = new URL(rawUrl);
    let impersonationStripped = false;
    let tokenLeakPrevented = false;

    if (isNativeWrapper) {
      if (parsed.searchParams.has("impersonate")) {
        parsed.searchParams.delete("impersonate");
        impersonationStripped = true;
      }
      if (parsed.searchParams.has("access_token")) {
        parsed.searchParams.delete("access_token");
        tokenLeakPrevented = true;
      }
      if (parsed.searchParams.has("refresh_token")) {
        parsed.searchParams.delete("refresh_token");
        tokenLeakPrevented = true;
      }
    }

    return {
      sanitizedUrl: parsed.toString(),
      impersonationStripped,
      tokenLeakPrevented,
    };
  } catch {
    return {
      sanitizedUrl: rawUrl,
      impersonationStripped: false,
      tokenLeakPrevented: false,
    };
  }
}
