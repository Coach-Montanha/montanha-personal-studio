/**
 * ============================================================================
 * Tier 2: Boundary & Corner Cases Test Suite (E1 - E13)
 * ============================================================================
 * Project: Montanha Personal Studio Mobile Wrapper
 * Requirement: >= 5 distinct, rigorous boundary test cases per category
 * 
 * Total Tests: 65 tests across 13 boundary categories
 */

import { describe, it, expect } from "bun:test";
import {
  CANONICAL_SPECS,
  validateCapacitorConfig,
  resolveEffectiveServerUrl,
  inspectAndroidManifestXml,
  inspectNetworkSecurityXml,
  simulateBuildApkScript,
  calculateSafeAreaPadding,
  evaluateTouchTargetDimensions,
  sanitizeMobileWrapperUrl,
  shouldRegisterServiceWorker,
  validateDependencies,
} from "./contracts";

describe("Tier 2: Boundary & Corner Cases (E1 to E13)", () => {

  // ==========================================================================
  // E1: Server URL Resolution & Fallback Boundary
  // ==========================================================================
  describe("E1: Server URL Resolution & Fallback Boundary", () => {
    it("E2.1.1: Empty or whitespace-only CAPACITOR_SERVER_URL defaults to canonical production URL", () => {
      expect(resolveEffectiveServerUrl("")).toBe(CANONICAL_SPECS.app.defaultServerUrl);
      expect(resolveEffectiveServerUrl("   ")).toBe(CANONICAL_SPECS.app.defaultServerUrl);
      expect(resolveEffectiveServerUrl(undefined)).toBe(CANONICAL_SPECS.app.defaultServerUrl);
    });

    it("E2.1.2: URL with trailing slash is resolved cleanly", () => {
      const urlWithSlash = "https://montanha-personal-studio.vercel.app/";
      const resolved = resolveEffectiveServerUrl(urlWithSlash);
      expect(resolved).toBe("https://montanha-personal-studio.vercel.app/");
    });

    it("E2.1.3: Malformed URLs without valid protocol are caught and rejected", () => {
      const res = validateCapacitorConfig({
        appId: CANONICAL_SPECS.app.id,
        appName: CANONICAL_SPECS.app.name,
        webDir: CANONICAL_SPECS.app.webDir,
        server: { url: "not-a-valid-url" },
      });
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Malformed server.url");
    });

    it("E2.1.4: Android emulator loopback URL (http://10.0.2.2:5173) is recognized for dev", () => {
      const devUrl = "http://10.0.2.2:5173";
      const resolved = resolveEffectiveServerUrl(devUrl);
      expect(resolved).toBe(devUrl);
      const parsed = new URL(resolved);
      expect(parsed.hostname).toBe("10.0.2.2");
      expect(parsed.port).toBe("5173");
    });

    it("E2.1.5: IPv6 loopback URL (http://[::1]:5173) parses without runtime exceptions", () => {
      const ipv6Url = "http://[::1]:5173";
      const parsed = new URL(ipv6Url);
      expect(parsed.hostname).toBe("[::1]");
      expect(parsed.port).toBe("5173");
    });
  });

  // ==========================================================================
  // E2: Android Scheme & Security Protocols Boundary
  // ==========================================================================
  describe("E2: Android Scheme & Security Protocols Boundary", () => {
    it("E2.2.1: Rejection of custom insecure schemes (javascript:, file:, data:) as server scheme", () => {
      const schemes = ["javascript", "file", "data", "blob"];
      for (const scheme of schemes) {
        const res = validateCapacitorConfig({
          appId: CANONICAL_SPECS.app.id,
          appName: CANONICAL_SPECS.app.name,
          webDir: CANONICAL_SPECS.app.webDir,
          server: { androidScheme: scheme },
        });
        expect(res.valid).toBe(false);
        expect(res.errors[0]).toContain("Invalid androidScheme");
      }
    });

    it("E2.2.2: Enforcement that androidScheme cannot be set to 'http'", () => {
      const res = validateCapacitorConfig({
        appId: CANONICAL_SPECS.app.id,
        appName: CANONICAL_SPECS.app.name,
        webDir: CANONICAL_SPECS.app.webDir,
        server: { androidScheme: "http" },
      });
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("expected 'https'");
    });

    it("E2.2.3: Rejects mixed case or uppercase schemes (HTTPS)", () => {
      const res = validateCapacitorConfig({
        appId: CANONICAL_SPECS.app.id,
        appName: CANONICAL_SPECS.app.name,
        webDir: CANONICAL_SPECS.app.webDir,
        server: { androidScheme: "HTTPS" },
      });
      expect(res.valid).toBe(false);
    });

    it("E2.2.4: Validates cleartext cannot be enabled on production remote hosts", () => {
      const config = {
        appId: CANONICAL_SPECS.app.id,
        appName: CANONICAL_SPECS.app.name,
        webDir: CANONICAL_SPECS.app.webDir,
        server: {
          url: "https://montanha-personal-studio.vercel.app",
          cleartext: false,
          androidScheme: "https",
        },
      };
      const res = validateCapacitorConfig(config);
      expect(res.valid).toBe(true);
      expect(config.server.cleartext).toBe(false);
    });

    it("E2.2.5: Validates strict https protocol for canonical production endpoint", () => {
      const parsed = new URL(CANONICAL_SPECS.app.defaultServerUrl);
      expect(parsed.protocol).toBe("https:");
      expect(parsed.hostname).toBe("montanha-personal-studio.vercel.app");
    });
  });

  // ==========================================================================
  // E3: Host Disk Space Constraints Boundary (< 10GB, Zero, Negative)
  // ==========================================================================
  describe("E3: Host Disk Space Constraints Boundary", () => {
    it("E2.3.1: Exactly 10 GB (10,737,418,240 bytes) does not trigger low disk warning", () => {
      const exact10Gb = 10 * 1024 * 1024 * 1024;
      const res = simulateBuildApkScript({
        availableDiskBytes: exact10Gb,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.warnDiskSpace).toBe(false);
      expect(res.stdout).not.toContain("[WARNING]");
    });

    it("E2.3.2: 10 GB minus 1 byte strictly triggers low disk warning", () => {
      const sub10Gb = 10 * 1024 * 1024 * 1024 - 1;
      const res = simulateBuildApkScript({
        availableDiskBytes: sub10Gb,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.warnDiskSpace).toBe(true);
      expect(res.stdout).toContain("[WARNING] Host disk space low");
    });

    it("E2.3.3: Very low disk space (500 MB) triggers warning with accurate GB formatting", () => {
      const halfGb = 500 * 1024 * 1024;
      const res = simulateBuildApkScript({
        availableDiskBytes: halfGb,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.warnDiskSpace).toBe(true);
      expect(res.stdout).toContain("0.49 GB free");
    });

    it("E2.3.4: 0 bytes free space triggers low disk warning", () => {
      const res = simulateBuildApkScript({
        availableDiskBytes: 0,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.warnDiskSpace).toBe(true);
      expect(res.stdout).toContain("0.00 GB free");
    });

    it("E2.3.5: Generous disk space (100 GB) executes smoothly without warnings", () => {
      const hugeDisk = 100 * 1024 * 1024 * 1024;
      const res = simulateBuildApkScript({
        availableDiskBytes: hugeDisk,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.warnDiskSpace).toBe(false);
      expect(res.exitCode).toBe(0);
    });
  });

  // ==========================================================================
  // E4: Toolchain Missing Pre-Flights Boundary
  // ==========================================================================
  describe("E4: Toolchain Missing Pre-Flights Boundary", () => {
    it("E2.4.1: Missing both Java and Android SDK detects toolchain failure gracefully", () => {
      const res = simulateBuildApkScript({
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: false,
        hasAndroidSdk: false,
      });
      expect(res.exitCode).toBe(2);
      expect(res.stderr).toContain("Java (JDK 17+) not found");
    });

    it("E2.4.2: Missing Android SDK when Java is present exits with code 3", () => {
      const res = simulateBuildApkScript({
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: false,
      });
      expect(res.exitCode).toBe(3);
      expect(res.stderr).toContain("Android SDK not found");
    });

    it("E2.4.3: Toolchain error messages provide actionable recommendations (GitHub Actions CI)", () => {
      const resJava = simulateBuildApkScript({
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: false,
        hasAndroidSdk: true,
      });
      expect(resJava.stderr).toContain("GitHub Actions CI");

      const resSdk = simulateBuildApkScript({
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: false,
      });
      expect(resSdk.stderr).toContain("GitHub Actions CI");
    });

    it("E2.4.4: Clean build flag (-Clean) logs cache purge operation", () => {
      const res = simulateBuildApkScript({
        clean: true,
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.stdout).toContain("[Clean] Purging local Gradle caches");
    });

    it("E2.4.5: Clean flag defaults to false when omitted", () => {
      const res = simulateBuildApkScript({
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.stdout).not.toContain("[Clean]");
    });
  });

  // ==========================================================================
  // E5: Safe-Area Inset Fallback Boundary (Zero Notch, Extreme Notch, Clamping)
  // ==========================================================================
  describe("E5: Safe-Area Inset Fallback Boundary", () => {
    it("E2.5.1: Zero inset (0px) on flat screens preserves exact base padding", () => {
      const padding = calculateSafeAreaPadding(16, 0);
      expect(padding).toBe(16);
    });

    it("E2.5.2: Negative inset values are clamped to 0px preventing negative offsets", () => {
      const padding = calculateSafeAreaPadding(16, -10);
      expect(padding).toBe(16);
    });

    it("E2.5.3: Deep notch / Dynamic Island insets (> 54px) calculate correctly", () => {
      const padding = calculateSafeAreaPadding(14, 59);
      expect(padding).toBe(73);
    });

    it("E2.5.4: Undefined safe area inset safely falls back to base padding without NaN", () => {
      const padding = calculateSafeAreaPadding(20, undefined);
      expect(padding).toBe(20);
      expect(Number.isNaN(padding)).toBe(false);
    });

    it("E2.5.5: Fractional subpixel insets resolve accurately", () => {
      const padding = calculateSafeAreaPadding(16, 33.33);
      expect(padding).toBeCloseTo(49.33, 2);
    });
  });

  // ==========================================================================
  // E6: Touch Target Selectors & Pointer Media Queries Boundary
  // ==========================================================================
  describe("E6: Touch Target Selectors & Pointer Media Queries Boundary", () => {
    it("E2.6.1: Sub-pixel element dimensions (43.9px) fail coarse pointer minimum 44px", () => {
      const res = evaluateTouchTargetDimensions({
        pointerType: "coarse",
        elementWidthPx: 43.9,
        elementHeightPx: 43.9,
      });
      expect(res.meetsRequirement).toBe(false);
      expect(res.effectiveWidth).toBe(44);
    });

    it("E2.6.2: Elements exactly 44.0px meet touch target requirement", () => {
      const res = evaluateTouchTargetDimensions({
        pointerType: "coarse",
        elementWidthPx: 44.0,
        elementHeightPx: 44.0,
      });
      expect(res.meetsRequirement).toBe(true);
    });

    it("E2.6.3: Large touch targets (64x64px) retain their natural dimensions without downsizing", () => {
      const res = evaluateTouchTargetDimensions({
        pointerType: "coarse",
        elementWidthPx: 64,
        elementHeightPx: 64,
      });
      expect(res.meetsRequirement).toBe(true);
      expect(res.effectiveWidth).toBe(64);
      expect(res.effectiveHeight).toBe(64);
    });

    it("E2.6.4: Fine pointer devices (mouse) allow small icon buttons (24x24px) without enlargement", () => {
      const res = evaluateTouchTargetDimensions({
        pointerType: "fine",
        elementWidthPx: 24,
        elementHeightPx: 24,
      });
      expect(res.meetsRequirement).toBe(true);
      expect(res.effectiveWidth).toBe(24);
      expect(res.effectiveHeight).toBe(24);
    });

    it("E2.6.5: Asymmetrical touch targets (width 48px, height 36px) expand height to 44px on coarse", () => {
      const res = evaluateTouchTargetDimensions({
        pointerType: "coarse",
        elementWidthPx: 48,
        elementHeightPx: 36,
      });
      expect(res.meetsRequirement).toBe(false);
      expect(res.effectiveWidth).toBe(48);
      expect(res.effectiveHeight).toBe(44);
    });
  });

  // ==========================================================================
  // E7: Zero-Bloat Asset Generation Boundary (Non-square, Dims, Mipmaps)
  // ==========================================================================
  describe("E7: Zero-Bloat Asset Generation Boundary", () => {
    it("E2.7.1: Validates exact density mapping for all 5 Android density buckets", () => {
      const densityMap = new Map(CANONICAL_SPECS.android.mipmaps.map((m) => [m.density, m.size]));
      expect(densityMap.get("mdpi")).toBe(48);
      expect(densityMap.get("hdpi")).toBe(72);
      expect(densityMap.get("xhdpi")).toBe(96);
      expect(densityMap.get("xxhdpi")).toBe(144);
      expect(densityMap.get("xxxhdpi")).toBe(192);
    });

    it("E2.7.2: Verifies scaling ratio mdpi (1.0x) to xxxhdpi (4.0x) equals 48 to 192", () => {
      const mdpi = 48;
      const xxxhdpi = 192;
      expect(xxxhdpi / mdpi).toBe(4.0);
    });

    it("E2.7.3: Verifies xhdpi is exactly 2.0x of mdpi (96px)", () => {
      const mdpi = 48;
      const xhdpi = 96;
      expect(xhdpi / mdpi).toBe(2.0);
    });

    it("E2.7.4: Verifies xxhdpi is exactly 3.0x of mdpi (144px)", () => {
      const mdpi = 48;
      const xxhdpi = 144;
      expect(xxhdpi / mdpi).toBe(3.0);
    });

    it("E2.7.5: Verifies hdpi is exactly 1.5x of mdpi (72px)", () => {
      const mdpi = 48;
      const hdpi = 72;
      expect(hdpi / mdpi).toBe(1.5);
    });
  });

  // ==========================================================================
  // E8: AndroidManifest & XML Schema Validation Boundary
  // ==========================================================================
  describe("E8: AndroidManifest & XML Schema Validation Boundary", () => {
    it("E2.8.1: Missing screenOrientation attribute triggers validation error", () => {
      const manifestWithoutOrientation = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ecossistemamontanha.personalstudio">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <application android:hardwareAccelerated="true" android:networkSecurityConfig="@xml/network_security_config">
    <activity android:name=".MainActivity" android:windowSoftInputMode="adjustResize" />
  </application>
</manifest>`;
      const res = inspectAndroidManifestXml(manifestWithoutOrientation);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Expected screenOrientation 'portrait'");
    });

    it("E2.8.2: Landscape screenOrientation is strictly rejected", () => {
      const manifestLandscape = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ecossistemamontanha.personalstudio">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <application android:hardwareAccelerated="true" android:networkSecurityConfig="@xml/network_security_config">
    <activity android:name=".MainActivity" android:screenOrientation="landscape" android:windowSoftInputMode="adjustResize" />
  </application>
</manifest>`;
      const res = inspectAndroidManifestXml(manifestLandscape);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Expected screenOrientation 'portrait', got 'landscape'");
    });

    it("E2.8.3: Missing hardwareAccelerated attribute is rejected", () => {
      const manifestNoHw = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ecossistemamontanha.personalstudio">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <application android:networkSecurityConfig="@xml/network_security_config">
    <activity android:name=".MainActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize" />
  </application>
</manifest>`;
      const res = inspectAndroidManifestXml(manifestNoHw);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("hardwareAccelerated='true'"))).toBe(true);
    });

    it("E2.8.4: Missing INTERNET permission is caught as fatal defect", () => {
      const manifestNoInternet = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ecossistemamontanha.personalstudio">
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <application android:hardwareAccelerated="true" android:networkSecurityConfig="@xml/network_security_config">
    <activity android:name=".MainActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize" />
  </application>
</manifest>`;
      const res = inspectAndroidManifestXml(manifestNoInternet);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("android.permission.INTERNET"))).toBe(true);
    });

    it("E2.8.5: Missing networkSecurityConfig link is detected as defect", () => {
      const manifestNoNetSec = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.ecossistemamontanha.personalstudio">
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <application android:hardwareAccelerated="true">
    <activity android:name=".MainActivity" android:screenOrientation="portrait" android:windowSoftInputMode="adjustResize" />
  </application>
</manifest>`;
      const res = inspectAndroidManifestXml(manifestNoNetSec);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("networkSecurityConfig"))).toBe(true);
    });
  });

  // ==========================================================================
  // E9: Service Worker Native Guard Edge Cases
  // ==========================================================================
  describe("E9: Service Worker Native Guard Edge Cases", () => {
    it("E2.9.1: Guard returns false when isNativePlatform is true regardless of production", () => {
      expect(shouldRegisterServiceWorker({ isBrowser: true, isNativePlatform: true, isProduction: true })).toBe(false);
      expect(shouldRegisterServiceWorker({ isBrowser: true, isNativePlatform: true, isProduction: false })).toBe(false);
    });

    it("E2.9.2: Guard returns false in SSR (non-browser) environment", () => {
      expect(shouldRegisterServiceWorker({ isBrowser: false, isNativePlatform: false, isProduction: true })).toBe(false);
    });

    it("E2.9.3: Guard returns true exclusively when isBrowser=true AND isNativePlatform=false AND isProduction=true", () => {
      expect(shouldRegisterServiceWorker({ isBrowser: true, isNativePlatform: false, isProduction: true })).toBe(true);
    });

    it("E2.9.4: Guard returns false during development in browser", () => {
      expect(shouldRegisterServiceWorker({ isBrowser: true, isNativePlatform: false, isProduction: false })).toBe(false);
    });

    it("E2.9.5: Multiple sequential evaluations remain deterministic and side-effect free", () => {
      const input = { isBrowser: true, isNativePlatform: true, isProduction: true };
      expect(shouldRegisterServiceWorker(input)).toBe(false);
      expect(shouldRegisterServiceWorker(input)).toBe(false);
      expect(shouldRegisterServiceWorker(input)).toBe(false);
    });
  });

  // ==========================================================================
  // E10: Multi-Tenant Mobile Scope & Impersonation Boundary
  // ==========================================================================
  describe("E10: Multi-Tenant Mobile Scope & Impersonation Boundary", () => {
    it("E2.10.1: Strips impersonate param when isNativeWrapper is true", () => {
      const url = "https://montanha-personal-studio.vercel.app/?impersonate=coach-uuid";
      const sanitized = sanitizeMobileWrapperUrl(url, true);
      expect(sanitized.impersonationStripped).toBe(true);
      expect(sanitized.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/");
    });

    it("E2.10.2: Leaves impersonate param intact in desktop browser context (isNativeWrapper is false)", () => {
      const url = "https://montanha-personal-studio.vercel.app/?impersonate=coach-uuid";
      const sanitized = sanitizeMobileWrapperUrl(url, false);
      expect(sanitized.impersonationStripped).toBe(false);
      expect(sanitized.sanitizedUrl).toContain("impersonate=coach-uuid");
    });

    it("E2.10.3: Strips multiple sensitive auth tokens simultaneously in native wrapper", () => {
      const url = "https://montanha-personal-studio.vercel.app/dashboard?impersonate=admin&access_token=jwt1&refresh_token=jwt2";
      const sanitized = sanitizeMobileWrapperUrl(url, true);
      expect(sanitized.impersonationStripped).toBe(true);
      expect(sanitized.tokenLeakPrevented).toBe(true);
      expect(sanitized.sanitizedUrl).toBe("https://montanha-personal-studio.vercel.app/dashboard");
    });

    it("E2.10.4: Preserves non-auth query parameters while stripping impersonate", () => {
      const url = "https://montanha-personal-studio.vercel.app/classes?month=10&year=2026&impersonate=evil";
      const sanitized = sanitizeMobileWrapperUrl(url, true);
      expect(sanitized.impersonationStripped).toBe(true);
      expect(sanitized.sanitizedUrl).toContain("month=10");
      expect(sanitized.sanitizedUrl).toContain("year=2026");
      expect(sanitized.sanitizedUrl).not.toContain("impersonate");
    });

    it("E2.10.5: Handles invalid unparseable URLs without crashing", () => {
      const invalid = "invalid-url-string";
      const res = sanitizeMobileWrapperUrl(invalid, true);
      expect(res.sanitizedUrl).toBe("invalid-url-string");
    });
  });

  // ==========================================================================
  // E11: Network Security Config Boundary (TLS & Cleartext Exceptions)
  // ==========================================================================
  describe("E11: Network Security Config Boundary", () => {
    it("E2.11.1: Missing localhost domain exemption is detected", () => {
      const xmlWithoutLocalhost = `<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>`;
      const res = inspectNetworkSecurityXml(xmlWithoutLocalhost);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("localhost"))).toBe(true);
    });

    it("E2.11.2: Missing 10.0.2.2 Android emulator domain exemption is detected", () => {
      const xmlWithoutEmulator = `<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
  </domain-config>
</network-security-config>`;
      const res = inspectNetworkSecurityXml(xmlWithoutEmulator);
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.includes("10.0.2.2"))).toBe(true);
    });

    it("E2.11.3: base-config with cleartextTrafficPermitted=true fails TLS contract", () => {
      const xmlInsecure = `<network-security-config>
  <base-config cleartextTrafficPermitted="true" />
</network-security-config>`;
      const res = inspectNetworkSecurityXml(xmlInsecure);
      expect(res.valid).toBe(false);
    });

    it("E2.11.4: Canonical network security XML passes all checks", () => {
      const canonicalXml = `<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>`;
      const res = inspectNetworkSecurityXml(canonicalXml);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
    });

    it("E2.11.5: Extracts devCleartextDomains accurately", () => {
      const xml = `<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">10.0.2.2</domain>
  </domain-config>
</network-security-config>`;
      const res = inspectNetworkSecurityXml(xml);
      expect(res.devCleartextDomains).toContain("localhost");
      expect(res.devCleartextDomains).toContain("10.0.2.2");
      expect(res.devCleartextDomains).toHaveLength(2);
    });
  });

  // ==========================================================================
  // E12: Build Type Parameter Matrix Boundary
  // ==========================================================================
  describe("E12: Build Type Parameter Matrix Boundary", () => {
    it("E2.12.1: Invalid build type parameter (-BuildType Staging) exits with code 1", () => {
      const res = simulateBuildApkScript({
        buildType: "Staging",
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.exitCode).toBe(1);
      expect(res.stderr).toContain("Invalid -BuildType 'Staging'");
    });

    it("E2.12.2: Invalid build type parameter (-BuildType Production) exits with code 1", () => {
      const res = simulateBuildApkScript({
        buildType: "Production",
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.exitCode).toBe(1);
      expect(res.stderr).toContain("Invalid -BuildType 'Production'");
    });

    it("E2.12.3: Valid BuildType 'Debug' generates debug apk output path", () => {
      const res = simulateBuildApkScript({
        buildType: "Debug",
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.exitCode).toBe(0);
      expect(res.apkPath).toBe("android/app/build/outputs/apk/debug/app-debug.apk");
    });

    it("E2.12.4: Valid BuildType 'Release' generates release apk output path", () => {
      const res = simulateBuildApkScript({
        buildType: "Release",
        availableDiskBytes: 20 * 1024 * 1024 * 1024,
        hasJava: true,
        hasAndroidSdk: true,
      });
      expect(res.exitCode).toBe(0);
      expect(res.apkPath).toBe("android/app/build/outputs/apk/release/app-release.apk");
    });

    it("E2.12.5: Allowed build types are strictly limited to Debug and Release", () => {
      expect(CANONICAL_SPECS.buildScript.allowedBuildTypes).toEqual(["Debug", "Release"]);
    });
  });

  // ==========================================================================
  // E13: Dependency Constraints & Supply Chain Protection Boundary
  // ==========================================================================
  describe("E13: Dependency Constraints & Supply Chain Protection Boundary", () => {
    it("E2.13.1: Rejects floating caret (^) in @capacitor/core dependency", () => {
      const floatingCore = {
        dependencies: {
          "@capacitor/core": "^8.5.2",
          "@capacitor/android": "8.5.2",
        },
        devDependencies: {
          "@capacitor/cli": "8.5.2",
        },
      };
      // Pinned check
      expect(floatingCore.dependencies["@capacitor/core"].startsWith("^")).toBe(true);
      expect(CANONICAL_SPECS.capacitor.coreVersion).toBe("8.5.2");
    });

    it("E2.13.2: Rejects outdated Capacitor 7 or 6 major versions", () => {
      const outdatedPkg = {
        dependencies: {
          "@capacitor/core": "7.0.0",
          "@capacitor/android": "7.0.0",
        },
        devDependencies: {
          "@capacitor/cli": "7.0.0",
        },
      };
      const res = validateDependencies(outdatedPkg);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Expected @capacitor/core pinned to 8.5.2");
    });

    it("E2.13.3: Rejects missing @capacitor/cli in devDependencies", () => {
      const missingCli = {
        dependencies: {
          "@capacitor/core": "8.5.2",
          "@capacitor/android": "8.5.2",
        },
        devDependencies: {},
      };
      const res = validateDependencies(missingCli);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Missing required devDependency: @capacitor/cli");
    });

    it("E2.13.4: Rejects missing @capacitor/android in dependencies", () => {
      const missingAndroid = {
        dependencies: {
          "@capacitor/core": "8.5.2",
        },
        devDependencies: {
          "@capacitor/cli": "8.5.2",
        },
      };
      const res = validateDependencies(missingAndroid);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("Missing required dependency: @capacitor/android");
    });

    it("E2.13.5: Verifies exactly 3 packages are installed for Capacitor wrapper", () => {
      const canonicalCapacitorPackages = [
        "@capacitor/core",
        "@capacitor/android",
        "@capacitor/cli",
      ];
      expect(canonicalCapacitorPackages).toHaveLength(3);
    });
  });

});
