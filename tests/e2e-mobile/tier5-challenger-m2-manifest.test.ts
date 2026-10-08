/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M2)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m2_1
 * Role: Android Scaffolding & Manifest Challenger
 * Scope: AndroidManifest.xml, network_security_config.xml, Gradle project files,
 *        resource XMLs, zero-bloat mipmap asset scaling & synchronization
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = path.resolve(__dirname, "../..");
const ANDROID_DIR = path.join(ROOT_DIR, "android");
const APP_DIR = path.join(ANDROID_DIR, "app");
const MAIN_DIR = path.join(APP_DIR, "src/main");
const RES_DIR = path.join(MAIN_DIR, "res");

/**
 * Utility helper to extract PNG dimensions from the IHDR chunk (bytes 16-24).
 * PNG signature is 8 bytes; IHDR chunk header is 8 bytes (length + chunk type).
 * Width is at offset 16 (4 bytes big-endian), Height is at offset 20 (4 bytes big-endian).
 */
function readPngDimensions(filePath: string): { width: number; height: number } {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 24) {
    throw new Error(`File ${filePath} is too small to be a valid PNG`);
  }
  // Check PNG signature: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (!isPng) {
    throw new Error(`File ${filePath} does not have a valid PNG magic header`);
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

describe("Tier 5: Challenger M2 Empirical Verification (Manifest & Scaffolding)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: AndroidManifest.xml Structural, Semantic & Security Verification
  // --------------------------------------------------------------------------
  describe("Challenge 1: AndroidManifest.xml Deep Adversarial Stress Testing", () => {
    const manifestPath = path.join(MAIN_DIR, "AndroidManifest.xml");

    it("C1.1: File exists on disk and is non-empty", () => {
      expect(fs.existsSync(manifestPath)).toBe(true);
      const stat = fs.statSync(manifestPath);
      expect(stat.size).toBeGreaterThan(500);
    });

    it("C1.2: Valid XML declaration and root <manifest> element with exact package name", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toMatch(/^<\?xml version="1\.0" encoding="utf-8"\?>/);
      expect(content).toContain('<manifest xmlns:android="http://schemas.android.com/apk/res/android"');
      expect(content).toContain('package="com.ecossistemamontanha.personalstudio"');
    });

    it("C1.3: Permission minimization: strictly 2 declared permissions and 0 extraneous/dangerous permissions", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      const permMatches = content.match(/<uses-permission[^>]+>/g) || [];

      expect(permMatches).toHaveLength(2);
      expect(content).toContain('<uses-permission android:name="android.permission.INTERNET" />');
      expect(content).toContain('<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />');

      // Prohibited high-risk / dangerous permissions
      const prohibitedPermissions = [
        "CAMERA",
        "READ_CONTACTS",
        "WRITE_CONTACTS",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "MANAGE_EXTERNAL_STORAGE",
        "READ_PHONE_STATE",
        "SEND_SMS",
        "RECEIVE_SMS",
        "SYSTEM_ALERT_WINDOW",
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_CONNECT",
      ];

      for (const prohibited of prohibitedPermissions) {
        expect(content).not.toContain(prohibited);
      }
    });

    it("C1.4: Screen orientation is strictly locked to 'portrait' on MainActivity", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:screenOrientation="portrait"');
      expect(content).not.toContain('android:screenOrientation="landscape"');
      expect(content).not.toContain('android:screenOrientation="sensor"');
      expect(content).not.toContain('android:screenOrientation="unspecified"');
    });

    it("C1.5: Soft input mode is strictly configured with 'adjustResize' to avoid covering financial forms", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:windowSoftInputMode="adjustResize"');
      expect(content).not.toContain('android:windowSoftInputMode="adjustPan"');
    });

    it("C1.6: Hardware acceleration is explicitly enabled on <application>", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:hardwareAccelerated="true"');
    });

    it("C1.7: Application specifies android:networkSecurityConfig='@xml/network_security_config'", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:networkSecurityConfig="@xml/network_security_config"');
    });

    it("C1.8: Activity specifies launchMode='singleTask' and exported='true' on the launcher activity", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:launchMode="singleTask"');
      expect(content).toContain('android:exported="true"');
      expect(content).toContain('<action android:name="android.intent.action.MAIN" />');
      expect(content).toContain('<category android:name="android.intent.category.LAUNCHER" />');
    });

    it("C1.9: FileProvider security: exported='false', grantUriPermissions='true', and authorities isolated", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      expect(content).toContain('android:name="androidx.core.content.FileProvider"');
      expect(content).toContain('android:authorities="${applicationId}.fileprovider"');
      expect(content).toContain('android:exported="false"');
      expect(content).toContain('android:grantUriPermissions="true"');
      // Critical security check: FileProvider MUST NEVER be exported
      expect(content).not.toContain('android:name="androidx.core.content.FileProvider"\n            android:authorities="${applicationId}.fileprovider"\n            android:exported="true"');
    });

    it("C1.10: MainActivity declares comprehensive configChanges to prevent WebView reloads", () => {
      const content = fs.readFileSync(manifestPath, "utf-8");
      const expectedChanges = [
        "orientation",
        "keyboardHidden",
        "keyboard",
        "screenSize",
        "locale",
        "smallestScreenSize",
        "screenLayout",
        "uiMode",
        "navigation",
        "density",
      ];
      for (const change of expectedChanges) {
        expect(content).toContain(change);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Network Security Config XML Strict Adversarial Audit
  // --------------------------------------------------------------------------
  describe("Challenge 2: Network Security Config XML Strict Adversarial Audit", () => {
    const netSecPath = path.join(RES_DIR, "xml/network_security_config.xml");

    it("C2.1: File exists on disk and is non-empty", () => {
      expect(fs.existsSync(netSecPath)).toBe(true);
      const stat = fs.statSync(netSecPath);
      expect(stat.size).toBeGreaterThan(200);
    });

    it("C2.2: Root <network-security-config> enforces cleartextTrafficPermitted='false' in <base-config>", () => {
      const content = fs.readFileSync(netSecPath, "utf-8");
      expect(content).toContain("<network-security-config>");
      expect(content).toContain('<base-config cleartextTrafficPermitted="false">');
      expect(content).not.toContain('<base-config cleartextTrafficPermitted="true">');
    });

    it("C2.3: Base config specifies trust-anchors with system certificates only", () => {
      const content = fs.readFileSync(netSecPath, "utf-8");
      expect(content).toContain('<certificates src="system" />');
      expect(content).not.toContain('<certificates src="user" />');
    });

    it("C2.4: Domain cleartext exemptions are strictly limited to local development targets", () => {
      const content = fs.readFileSync(netSecPath, "utf-8");
      expect(content).toContain('<domain-config cleartextTrafficPermitted="true">');
      expect(content).toContain('<domain includeSubdomains="true">localhost</domain>');
      expect(content).toContain('<domain includeSubdomains="true">10.0.2.2</domain>');
      expect(content).toContain('<domain includeSubdomains="true">127.0.0.1</domain>');

      // Verify no other domains are exempted
      const domains = [...content.matchAll(/<domain[^>]*>([^<]+)<\/domain>/g)].map(m => m[1].trim());
      expect(domains.sort()).toEqual(["10.0.2.2", "127.0.0.1", "localhost"].sort());
    });

    it("C2.5: Zero production domains or wildcards permit cleartext traffic", () => {
      const content = fs.readFileSync(netSecPath, "utf-8");
      expect(content).not.toContain("montanha-personal-studio.vercel.app");
      expect(content).not.toContain("vercel.app");
      expect(content).not.toContain("supabase.co");
      expect(content).not.toContain("*.com");
      expect(content).not.toContain("*");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Android Resource Definitions & Branding Alignment
  // --------------------------------------------------------------------------
  describe("Challenge 3: Android Resource Definitions & Branding Alignment", () => {
    const stringsPath = path.join(RES_DIR, "values/strings.xml");
    const colorsPath = path.join(RES_DIR, "values/colors.xml");

    it("C3.1: strings.xml exists and defines all required app identity resources", () => {
      expect(fs.existsSync(stringsPath)).toBe(true);
      const content = fs.readFileSync(stringsPath, "utf-8");
      expect(content).toContain('<string name="app_name">Montanha Personal Studio</string>');
      expect(content).toContain('<string name="title_activity_main">Montanha Personal Studio</string>');
      expect(content).toContain('<string name="package_name">com.ecossistemamontanha.personalstudio</string>');
      expect(content).toContain('<string name="custom_url_scheme">com.ecossistemamontanha.personalstudio</string>');
    });

    it("C3.2: colors.xml exists and defines core brand palette (#6958E2, #5746C9, #F8F9FE)", () => {
      expect(fs.existsSync(colorsPath)).toBe(true);
      const content = fs.readFileSync(colorsPath, "utf-8");
      expect(content).toContain('<color name="colorPrimary">#6958E2</color>');
      expect(content).toContain('<color name="colorPrimaryDark">#5746C9</color>');
      expect(content).toContain('<color name="colorAccent">#6958E2</color>');
      expect(content).toContain('<color name="colorBackground">#F8F9FE</color>');
      expect(content).toContain('<color name="activity_background">#F8F9FE</color>');
    });

    it("C3.3: colors.xml brand colors harmonize with capacitor.config.ts and public/index.html", () => {
      const colorsContent = fs.readFileSync(colorsPath, "utf-8");
      const configContent = fs.readFileSync(path.join(ROOT_DIR, "capacitor.config.ts"), "utf-8");
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, "public/index.html"), "utf-8");

      expect(colorsContent).toContain("#6958E2");
      expect(colorsContent).toContain("#F8F9FE");
      expect(configContent).toContain("#F8F9FE");
      expect(indexContent).toContain("#6958E2");
      expect(indexContent).toContain("#F8F9FE");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: Gradle Scaffolding & Wrapper Properties Empirical Verification
  // --------------------------------------------------------------------------
  describe("Challenge 4: Gradle Scaffolding & Wrapper Properties", () => {
    const gradleWrapperPath = path.join(ANDROID_DIR, "gradle/wrapper/gradle-wrapper.properties");
    const variablesGradlePath = path.join(ANDROID_DIR, "variables.gradle");
    const rootBuildGradlePath = path.join(ANDROID_DIR, "build.gradle");
    const appBuildGradlePath = path.join(APP_DIR, "build.gradle");
    const settingsGradlePath = path.join(ANDROID_DIR, "settings.gradle");

    it("C4.1: gradle-wrapper.properties exists and specifies HTTPS distribution URL", () => {
      expect(fs.existsSync(gradleWrapperPath)).toBe(true);
      const content = fs.readFileSync(gradleWrapperPath, "utf-8");
      expect(content).toMatch(/distributionUrl=https\\:\/\/services\.gradle\.org\/distributions\/gradle-[0-9.]+-all\.zip/);
      expect(content).not.toContain("http://");
    });

    it("C4.2: Gradle wrapper version is 8.x (specifically gradle-8.14.3-all.zip)", () => {
      const content = fs.readFileSync(gradleWrapperPath, "utf-8");
      expect(content).toContain("gradle-8.14.3-all.zip");
      expect(content).toContain("validateDistributionUrl=true");
      expect(content).toContain("networkTimeout=10000");
    });

    it("C4.3: variables.gradle sets compileSdkVersion >= 34 and targetSdkVersion >= 34", () => {
      expect(fs.existsSync(variablesGradlePath)).toBe(true);
      const content = fs.readFileSync(variablesGradlePath, "utf-8");
      const compileMatch = content.match(/compileSdkVersion\s*=\s*(\d+)/);
      const targetMatch = content.match(/targetSdkVersion\s*=\s*(\d+)/);
      const minMatch = content.match(/minSdkVersion\s*=\s*(\d+)/);

      expect(compileMatch).not.toBeNull();
      expect(targetMatch).not.toBeNull();
      expect(minMatch).not.toBeNull();

      const compileSdk = parseInt(compileMatch![1], 10);
      const targetSdk = parseInt(targetMatch![1], 10);
      const minSdk = parseInt(minMatch![1], 10);

      expect(compileSdk).toBeGreaterThanOrEqual(34);
      expect(targetSdk).toBeGreaterThanOrEqual(34);
      expect(minSdk).toBeGreaterThanOrEqual(23);
      expect(compileSdk).toBe(36);
      expect(targetSdk).toBe(36);
      expect(minSdk).toBe(24);
    });

    it("C4.4: app/build.gradle configures namespace and applicationId to match package ID", () => {
      expect(fs.existsSync(appBuildGradlePath)).toBe(true);
      const content = fs.readFileSync(appBuildGradlePath, "utf-8");
      expect(content).toContain('namespace = "com.ecossistemamontanha.personalstudio"');
      expect(content).toContain('applicationId "com.ecossistemamontanha.personalstudio"');
      expect(content).toContain('compileSdk = rootProject.ext.compileSdkVersion');
      expect(content).toContain('minSdkVersion rootProject.ext.minSdkVersion');
      expect(content).toContain('targetSdkVersion rootProject.ext.targetSdkVersion');
    });

    it("C4.5: root build.gradle configures AGP 8.x and repositories", () => {
      expect(fs.existsSync(rootBuildGradlePath)).toBe(true);
      const content = fs.readFileSync(rootBuildGradlePath, "utf-8");
      expect(content).toContain("com.android.tools.build:gradle:8.13.0");
      expect(content).toContain("google()");
      expect(content).toContain("mavenCentral()");
      expect(content).toContain('apply from: "variables.gradle"');
    });

    it("C4.6: settings.gradle includes :app and applies capacitor.settings.gradle", () => {
      expect(fs.existsSync(settingsGradlePath)).toBe(true);
      const content = fs.readFileSync(settingsGradlePath, "utf-8");
      expect(content).toContain("include ':app'");
      expect(content).toContain("apply from: 'capacitor.settings.gradle'");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Asset Generation & Synchronization Integrity
  // --------------------------------------------------------------------------
  describe("Challenge 5: Asset Generation & Synchronization Integrity", () => {
    const sourceIconPath = path.join(ROOT_DIR, "public/icon-512.png");
    const expectedDensities = [
      { bucket: "mipmap-mdpi", size: 48 },
      { bucket: "mipmap-hdpi", size: 72 },
      { bucket: "mipmap-xhdpi", size: 96 },
      { bucket: "mipmap-xxhdpi", size: 144 },
      { bucket: "mipmap-xxxhdpi", size: 192 },
    ];
    const iconVariants = [
      "ic_launcher.png",
      "ic_launcher_round.png",
      "ic_launcher_foreground.png",
    ];

    it("C5.1: Source icon exists and is a valid 512x512 PNG", () => {
      expect(fs.existsSync(sourceIconPath)).toBe(true);
      const dims = readPngDimensions(sourceIconPath);
      expect(dims.width).toBe(512);
      expect(dims.height).toBe(512);
    });

    it("C5.2: Exactly 15 mipmap launcher icons exist across all 5 densities", () => {
      let totalIcons = 0;
      for (const { bucket } of expectedDensities) {
        for (const variant of iconVariants) {
          const iconPath = path.join(RES_DIR, bucket, variant);
          expect(fs.existsSync(iconPath)).toBe(true);
          const stat = fs.statSync(iconPath);
          expect(stat.size).toBeGreaterThan(100);
          totalIcons++;
        }
      }
      expect(totalIcons).toBe(15);
    });

    it("C5.3: Mipmap icon dimensions match their exact density specifications", () => {
      for (const { bucket, size } of expectedDensities) {
        for (const variant of iconVariants) {
          const iconPath = path.join(RES_DIR, bucket, variant);
          const dims = readPngDimensions(iconPath);
          expect(dims.width).toBe(size);
          expect(dims.height).toBe(size);
        }
      }
    });

    it("C5.4: Splash screen drawable exists with non-zero byte size", () => {
      const splashPath = path.join(RES_DIR, "drawable/splash.png");
      expect(fs.existsSync(splashPath)).toBe(true);
      const dims = readPngDimensions(splashPath);
      expect(dims.width).toBe(512);
      expect(dims.height).toBe(512);
    });

    it("C5.5: Web assets in android/app/src/main/assets/public are synchronized with public/index.html", () => {
      const publicHtmlPath = path.join(ROOT_DIR, "public/index.html");
      const androidHtmlPath = path.join(MAIN_DIR, "assets/public/index.html");
      expect(fs.existsSync(androidHtmlPath)).toBe(true);

      const publicContent = fs.readFileSync(publicHtmlPath, "utf-8");
      const androidContent = fs.readFileSync(androidHtmlPath, "utf-8");
      expect(androidContent).toBe(publicContent);
    });

    it("C5.6: capacitor.config.json exists in assets and mirrors capacitor.config.ts parameters", () => {
      const configJsonPath = path.join(MAIN_DIR, "assets/capacitor.config.json");
      expect(fs.existsSync(configJsonPath)).toBe(true);

      const parsed = JSON.parse(fs.readFileSync(configJsonPath, "utf-8"));
      expect(parsed.appId).toBe("com.ecossistemamontanha.personalstudio");
      expect(parsed.appName).toBe("Montanha Personal Studio");
      expect(parsed.webDir).toBe(".output/public");
      expect(parsed.backgroundColor).toBe("#F8F9FE");
      expect(parsed.server.url).toBe("https://montanha-personal-studio.vercel.app");
      expect(parsed.server.cleartext).toBe(false);
      expect(parsed.server.androidScheme).toBe("https");
      expect(parsed.android.allowMixedContent).toBe(false);
      expect(parsed.android.captureInput).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 6: Adversarial Mutation Oracles & Parsing Resilience
  // --------------------------------------------------------------------------
  describe("Challenge 6: Adversarial Mutation Oracles & Parsing Resilience", () => {
    it("C6.1: Adversarial Oracle detects orientation tampering", () => {
      const validXml = fs.readFileSync(path.join(MAIN_DIR, "AndroidManifest.xml"), "utf-8");
      const mutatedXml = validXml.replace('android:screenOrientation="portrait"', 'android:screenOrientation="landscape"');
      
      const checkOrientation = (xml: string) => {
        const match = xml.match(/android:screenOrientation="([^"]+)"/);
        return match ? match[1] === "portrait" : false;
      };

      expect(checkOrientation(validXml)).toBe(true);
      expect(checkOrientation(mutatedXml)).toBe(false);
    });

    it("C6.2: Adversarial Oracle detects dangerous permission injections", () => {
      const validXml = fs.readFileSync(path.join(MAIN_DIR, "AndroidManifest.xml"), "utf-8");
      const maliciousXml = validXml.replace(
        '<uses-permission android:name="android.permission.INTERNET" />',
        '<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.CAMERA" />'
      );

      const checkNoProhibited = (xml: string) => {
        const prohibited = ["CAMERA", "RECORD_AUDIO", "READ_CONTACTS"];
        return !prohibited.some(p => xml.includes(p));
      };

      expect(checkNoProhibited(validXml)).toBe(true);
      expect(checkNoProhibited(maliciousXml)).toBe(false);
    });

    it("C6.3: Adversarial Oracle detects base cleartext traffic breach", () => {
      const validNetXml = fs.readFileSync(path.join(RES_DIR, "xml/network_security_config.xml"), "utf-8");
      const compromisedNetXml = validNetXml.replace('cleartextTrafficPermitted="false"', 'cleartextTrafficPermitted="true"');

      const checkTlsEnforcement = (xml: string) => {
        const match = xml.match(/<base-config\s+cleartextTrafficPermitted="([^"]+)"/);
        return match ? match[1] === "false" : false;
      };

      expect(checkTlsEnforcement(validNetXml)).toBe(true);
      expect(checkTlsEnforcement(compromisedNetXml)).toBe(false);
    });

    it("C6.4: Adversarial Oracle detects production domain cleartext leakage", () => {
      const validNetXml = fs.readFileSync(path.join(RES_DIR, "xml/network_security_config.xml"), "utf-8");
      const leakedNetXml = validNetXml.replace(
        '<domain includeSubdomains="true">localhost</domain>',
        '<domain includeSubdomains="true">localhost</domain>\n        <domain includeSubdomains="true">montanha-personal-studio.vercel.app</domain>'
      );

      const checkNoProdCleartext = (xml: string) => {
        return !xml.includes("montanha-personal-studio.vercel.app");
      };

      expect(checkNoProdCleartext(validNetXml)).toBe(true);
      expect(checkNoProdCleartext(leakedNetXml)).toBe(false);
    });

    it("C6.5: Live PowerShell .NET [xml] parser validates all XML files without syntax errors", () => {
      const psCommand = `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "[xml]$m = Get-Content 'android/app/src/main/AndroidManifest.xml' -Raw; [xml]$n = Get-Content 'android/app/src/main/res/xml/network_security_config.xml' -Raw; [xml]$c = Get-Content 'android/app/src/main/res/values/colors.xml' -Raw; [xml]$s = Get-Content 'android/app/src/main/res/values/strings.xml' -Raw; Write-Output ('PARSED_OK:' + $m.manifest.package + ':' + $s.resources.string[0].'#text')"`;

      const result = execSync(psCommand, { cwd: ROOT_DIR, encoding: "utf-8" }).trim();
      expect(result).toContain("PARSED_OK:com.ecossistemamontanha.personalstudio:Montanha Personal Studio");
    });
  });
});
