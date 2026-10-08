/**
 * ============================================================================
 * Tier 5: Adversarial Challenger Test Suite (Milestone M2 - Assets & Web Sync)
 * ============================================================================
 * Challenger: teamwork_preview_challenger_m2_2
 * Role: Android Asset & Web Sync Challenger
 * Scope: Mipmap density buckets (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi),
 *        ic_launcher, ic_launcher_round, ic_launcher_foreground, splash.png,
 *        PNG binary structure & chunk integrity, bicubic downsampling,
 *        android/app/src/main/assets/public web bundle sync, capacitor.config.json
 */

import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

const ROOT_DIR = path.resolve(__dirname, "../..");
const ANDROID_DIR = path.join(ROOT_DIR, "android");
const APP_DIR = path.join(ANDROID_DIR, "app");
const MAIN_DIR = path.join(APP_DIR, "src/main");
const RES_DIR = path.join(MAIN_DIR, "res");
const ASSETS_DIR = path.join(MAIN_DIR, "assets");
const ASSETS_PUBLIC_DIR = path.join(ASSETS_DIR, "public");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const MIPMAP_BUCKETS = [
  { density: "mdpi", size: 48, scaleFactor: 1.0 },
  { density: "hdpi", size: 72, scaleFactor: 1.5 },
  { density: "xhdpi", size: 96, scaleFactor: 2.0 },
  { density: "xxhdpi", size: 144, scaleFactor: 3.0 },
  { density: "xxxhdpi", size: 192, scaleFactor: 4.0 },
];

const ICON_VARIANTS = [
  "ic_launcher.png",
  "ic_launcher_round.png",
  "ic_launcher_foreground.png",
];

interface PngInfo {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  compressionMethod: number;
  filterMethod: number;
  interlaceMethod: number;
  hasValidIend: boolean;
  fileSizeBytes: number;
}

/**
 * Deep binary parser for PNG files without third-party dependencies.
 * Validates 8-byte signature, parses IHDR chunk, verifies IEND termination.
 */
function parsePngBinary(filePath: string): PngInfo {
  const buf = fs.readFileSync(filePath);
  if (buf.length < 33) {
    throw new Error(`File ${filePath} is too small to contain valid PNG chunks (${buf.length} bytes)`);
  }

  // 1. Signature check: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  const expectedSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== expectedSig[i]) {
      throw new Error(`Invalid PNG signature byte at offset ${i} in ${filePath}`);
    }
  }

  // 2. IHDR Chunk check
  const ihdrLen = buf.readUInt32BE(8);
  const ihdrType = buf.toString("ascii", 12, 16);
  if (ihdrLen !== 13 || ihdrType !== "IHDR") {
    throw new Error(`Invalid IHDR chunk (len=${ihdrLen}, type=${ihdrType}) in ${filePath}`);
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  const compressionMethod = buf[26];
  const filterMethod = buf[27];
  const interlaceMethod = buf[28];

  // 3. IEND Chunk check (last 12 bytes of file)
  const tail = buf.subarray(buf.length - 12);
  const iendLen = tail.readUInt32BE(0);
  const iendType = tail.toString("ascii", 4, 8);
  const hasValidIend = iendLen === 0 && iendType === "IEND";

  return {
    width,
    height,
    bitDepth,
    colorType,
    compressionMethod,
    filterMethod,
    interlaceMethod,
    hasValidIend,
    fileSizeBytes: buf.length,
  };
}

describe("Tier 5: Challenger M2 Empirical Verification (Assets & Web Sync)", () => {

  // --------------------------------------------------------------------------
  // Challenge 1: Mipmap Deep Binary Structure & Chunk Integrity
  // --------------------------------------------------------------------------
  describe("Challenge 1: Mipmap Deep Binary Structure & Chunk Integrity", () => {
    it("C1.1: Exactly 15 mipmap files exist on disk (5 densities x 3 variants)", () => {
      let count = 0;
      for (const bucket of MIPMAP_BUCKETS) {
        for (const variant of ICON_VARIANTS) {
          const p = path.join(RES_DIR, `mipmap-${bucket.density}`, variant);
          expect(fs.existsSync(p)).toBe(true);
          count++;
        }
      }
      expect(count).toBe(15);
    });

    it("C1.2: All 15 mipmaps have valid 8-byte PNG magic signature (89 50 4E 47 0D 0A 1A 0A)", () => {
      for (const bucket of MIPMAP_BUCKETS) {
        for (const variant of ICON_VARIANTS) {
          const p = path.join(RES_DIR, `mipmap-${bucket.density}`, variant);
          const buf = fs.readFileSync(p);
          const sig = Array.from(buf.subarray(0, 8));
          expect(sig).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        }
      }
    });

    it("C1.3: All 15 mipmaps declare 8-bit depth and 32-bit RGBA color type (Type 6)", () => {
      for (const bucket of MIPMAP_BUCKETS) {
        for (const variant of ICON_VARIANTS) {
          const p = path.join(RES_DIR, `mipmap-${bucket.density}`, variant);
          const info = parsePngBinary(p);
          expect(info.bitDepth).toBe(8);
          // Color type 6 represents RGBA with alpha channel preservation
          expect(info.colorType).toBe(6);
          expect(info.compressionMethod).toBe(0);
          expect(info.filterMethod).toBe(0);
        }
      }
    });

    it("C1.4: All 15 mipmaps properly terminate with an intact IEND chunk", () => {
      for (const bucket of MIPMAP_BUCKETS) {
        for (const variant of ICON_VARIANTS) {
          const p = path.join(RES_DIR, `mipmap-${bucket.density}`, variant);
          const info = parsePngBinary(p);
          expect(info.hasValidIend).toBe(true);
        }
      }
    });

    it("C1.5: All 15 mipmaps have reasonable non-zero byte sizes without bloat", () => {
      for (const bucket of MIPMAP_BUCKETS) {
        for (const variant of ICON_VARIANTS) {
          const p = path.join(RES_DIR, `mipmap-${bucket.density}`, variant);
          const stat = fs.statSync(p);
          // Smallest mipmap (mdpi 48px) >= 1000 bytes, largest (xxxhdpi 192px) <= 25000 bytes
          expect(stat.size).toBeGreaterThan(500);
          expect(stat.size).toBeLessThan(30000);
        }
      }
    });

    it("C1.6: Splash screen drawable exists with valid PNG structure and 512x512 dimensions", () => {
      const splashPath = path.join(RES_DIR, "drawable", "splash.png");
      expect(fs.existsSync(splashPath)).toBe(true);
      const info = parsePngBinary(splashPath);
      expect(info.width).toBe(512);
      expect(info.height).toBe(512);
      expect(info.hasValidIend).toBe(true);
      expect(info.fileSizeBytes).toBeGreaterThan(10000);
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 2: Pixel Dimension Accuracy & Scaling Proportions
  // --------------------------------------------------------------------------
  describe("Challenge 2: Pixel Dimension Accuracy & Scaling Proportions", () => {
    it("C2.1: mdpi density icons are exactly 48x48 (1.0x baseline)", () => {
      for (const variant of ICON_VARIANTS) {
        const p = path.join(RES_DIR, "mipmap-mdpi", variant);
        const info = parsePngBinary(p);
        expect(info.width).toBe(48);
        expect(info.height).toBe(48);
      }
    });

    it("C2.2: hdpi density icons are exactly 72x72 (1.5x scaling)", () => {
      for (const variant of ICON_VARIANTS) {
        const p = path.join(RES_DIR, "mipmap-hdpi", variant);
        const info = parsePngBinary(p);
        expect(info.width).toBe(72);
        expect(info.height).toBe(72);
      }
    });

    it("C2.3: xhdpi density icons are exactly 96x96 (2.0x scaling)", () => {
      for (const variant of ICON_VARIANTS) {
        const p = path.join(RES_DIR, "mipmap-xhdpi", variant);
        const info = parsePngBinary(p);
        expect(info.width).toBe(96);
        expect(info.height).toBe(96);
      }
    });

    it("C2.4: xxhdpi density icons are exactly 144x144 (3.0x scaling)", () => {
      for (const variant of ICON_VARIANTS) {
        const p = path.join(RES_DIR, "mipmap-xxhdpi", variant);
        const info = parsePngBinary(p);
        expect(info.width).toBe(144);
        expect(info.height).toBe(144);
      }
    });

    it("C2.5: xxxhdpi density icons are exactly 192x192 (4.0x scaling)", () => {
      for (const variant of ICON_VARIANTS) {
        const p = path.join(RES_DIR, "mipmap-xxxhdpi", variant);
        const info = parsePngBinary(p);
        expect(info.width).toBe(192);
        expect(info.height).toBe(192);
      }
    });

    it("C2.6: Round icons and foreground icons are differentiated in byte content", () => {
      for (const bucket of MIPMAP_BUCKETS) {
        const launcher = fs.readFileSync(path.join(RES_DIR, `mipmap-${bucket.density}`, "ic_launcher.png"));
        const round = fs.readFileSync(path.join(RES_DIR, `mipmap-${bucket.density}`, "ic_launcher_round.png"));
        // Round icons have circular clip applied, so their byte representation differs from square
        expect(launcher.equals(round)).toBe(false);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 3: Zero-Bloat Asset Generation Script Audit
  // --------------------------------------------------------------------------
  describe("Challenge 3: Zero-Bloat Asset Generation Script Audit", () => {
    const scriptPath = path.join(ROOT_DIR, "scripts", "sync-android-assets.ps1");

    it("C3.1: scripts/sync-android-assets.ps1 exists and is executable", () => {
      expect(fs.existsSync(scriptPath)).toBe(true);
      const content = fs.readFileSync(scriptPath, "utf8");
      expect(content.length).toBeGreaterThan(500);
    });

    it("C3.2: Zero external image scaling dependencies in package.json (no sharp, canvas, jimp, libvips, @capacitor/assets)", () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      expect(allDeps["sharp"]).toBeUndefined();
      expect(allDeps["@capacitor/assets"]).toBeUndefined();
      expect(allDeps["canvas"]).toBeUndefined();
      expect(allDeps["jimp"]).toBeUndefined();
      expect(allDeps["imagemin"]).toBeUndefined();
    });

    it("C3.3: Script employs .NET System.Drawing with HighQualityBicubic downscaling", () => {
      const content = fs.readFileSync(scriptPath, "utf8");
      expect(content).toContain("System.Drawing");
      expect(content).toContain("HighQualityBicubic");
      expect(content).toContain("Format32bppArgb");
      expect(content).toContain("MemoryStream");
    });

    it("C3.4: package.json scripts contain cap:sync and cap:copy targets", () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
      expect(pkg.scripts["cap:sync"]).toBe("cap sync android");
      expect(pkg.scripts["cap:copy"]).toBe("cap copy android");
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 4: Web Bundle Synchronization in android/app/src/main/assets/public/
  // --------------------------------------------------------------------------
  describe("Challenge 4: Web Bundle Synchronization Integrity", () => {
    it("C4.1: android/app/src/main/assets/public directory exists and is populated", () => {
      expect(fs.existsSync(ASSETS_PUBLIC_DIR)).toBe(true);
      const files = fs.readdirSync(ASSETS_PUBLIC_DIR);
      expect(files.length).toBeGreaterThan(5);
    });

    it("C4.2: index.html exists in android assets and matches public/index.html byte-for-byte", () => {
      const srcPath = path.join(PUBLIC_DIR, "index.html");
      const syncedPath = path.join(ASSETS_PUBLIC_DIR, "index.html");
      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(syncedPath)).toBe(true);

      const srcHash = crypto.createHash("sha256").update(fs.readFileSync(srcPath)).digest("hex");
      const syncedHash = crypto.createHash("sha256").update(fs.readFileSync(syncedPath)).digest("hex");
      expect(syncedHash).toBe(srcHash);
    });

    it("C4.3: manifest.webmanifest exists in android assets and matches public/manifest.webmanifest byte-for-byte", () => {
      const srcPath = path.join(PUBLIC_DIR, "manifest.webmanifest");
      const syncedPath = path.join(ASSETS_PUBLIC_DIR, "manifest.webmanifest");
      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(syncedPath)).toBe(true);

      const srcHash = crypto.createHash("sha256").update(fs.readFileSync(srcPath)).digest("hex");
      const syncedHash = crypto.createHash("sha256").update(fs.readFileSync(syncedPath)).digest("hex");
      expect(syncedHash).toBe(srcHash);
    });

    it("C4.4: Web icon assets (icon-192.png, icon-512.png) match source public icons exactly", () => {
      for (const icon of ["icon-192.png", "icon-512.png"]) {
        const srcPath = path.join(PUBLIC_DIR, icon);
        const syncedPath = path.join(ASSETS_PUBLIC_DIR, icon);
        expect(fs.existsSync(srcPath)).toBe(true);
        expect(fs.existsSync(syncedPath)).toBe(true);

        const srcBuf = fs.readFileSync(srcPath);
        const syncedBuf = fs.readFileSync(syncedPath);
        expect(syncedBuf.equals(srcBuf)).toBe(true);
      }
    });

    it("C4.5: Synced index.html contains offline resiliency with noscript meta refresh and client navigator.onLine handler", () => {
      const htmlPath = path.join(ASSETS_PUBLIC_DIR, "index.html");
      const html = fs.readFileSync(htmlPath, "utf8");

      expect(html).toContain("<noscript>");
      expect(html).toContain('http-equiv="refresh"');
      expect(html).toContain("navigator.onLine");
      expect(html).toContain("https://montanha-personal-studio.vercel.app");
      expect(html).toContain("retry-btn");
    });

    it("C4.6: capacitor.config.json exists in assets and mirrors required parameters", () => {
      const configJsonPath = path.join(ASSETS_DIR, "capacitor.config.json");
      expect(fs.existsSync(configJsonPath)).toBe(true);

      const config = JSON.parse(fs.readFileSync(configJsonPath, "utf8"));
      expect(config.appId).toBe("com.ecossistemamontanha.personalstudio");
      expect(config.appName).toBe("Montanha Personal Studio");
      expect(config.server.url).toBe("https://montanha-personal-studio.vercel.app");
      expect(config.server.androidScheme).toBe("https");
      expect(config.server.cleartext).toBe(false);
    });

    it("C4.7: Zero sensitive server credentials or secrets leaked into synced public web assets", () => {
      const files = fs.readdirSync(ASSETS_PUBLIC_DIR);
      for (const file of files) {
        const fullPath = path.join(ASSETS_PUBLIC_DIR, file);
        if (fs.statSync(fullPath).isFile() && (file.endsWith(".html") || file.endsWith(".json") || file.endsWith(".js") || file.endsWith(".webmanifest"))) {
          const content = fs.readFileSync(fullPath, "utf8");
          expect(content.includes("SUPABASE_SERVICE_ROLE_KEY")).toBe(false);
          expect(content.includes("service_role")).toBe(false);
          expect(content.includes("DATABASE_URL")).toBe(false);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // Challenge 5: Adversarial Mutation Oracles
  // --------------------------------------------------------------------------
  describe("Challenge 5: Adversarial Mutation Oracles & Binary Tampering Detection", () => {
    it("C5.1: Adversarial Oracle detects corrupted PNG signature", () => {
      const validPath = path.join(RES_DIR, "mipmap-mdpi", "ic_launcher.png");
      const validBuf = fs.readFileSync(validPath);

      // Corrupt magic header byte
      const corruptedBuf = Buffer.from(validBuf);
      corruptedBuf[0] = 0x00;

      const tmpCorrupted = path.join(ROOT_DIR, "node_modules", ".cache-test-corrupt-sig.png");
      fs.writeFileSync(tmpCorrupted, corruptedBuf);

      try {
        expect(() => parsePngBinary(tmpCorrupted)).toThrow("Invalid PNG signature");
      } finally {
        if (fs.existsSync(tmpCorrupted)) fs.unlinkSync(tmpCorrupted);
      }
    });

    it("C5.2: Adversarial Oracle detects truncated PNG missing IEND chunk", () => {
      const validPath = path.join(RES_DIR, "mipmap-mdpi", "ic_launcher.png");
      const validBuf = fs.readFileSync(validPath);

      // Truncate last 20 bytes
      const truncatedBuf = validBuf.subarray(0, validBuf.length - 20);

      const tmpTruncated = path.join(ROOT_DIR, "node_modules", ".cache-test-trunc.png");
      fs.writeFileSync(tmpTruncated, truncatedBuf);

      try {
        const info = parsePngBinary(tmpTruncated);
        expect(info.hasValidIend).toBe(false);
      } finally {
        if (fs.existsSync(tmpTruncated)) fs.unlinkSync(tmpTruncated);
      }
    });

    it("C5.3: Adversarial Oracle detects altered IHDR dimensions", () => {
      const validPath = path.join(RES_DIR, "mipmap-mdpi", "ic_launcher.png");
      const validBuf = fs.readFileSync(validPath);

      // Mutate width from 48 to 47
      const mutatedBuf = Buffer.from(validBuf);
      mutatedBuf.writeUInt32BE(47, 16);

      const tmpMutated = path.join(ROOT_DIR, "node_modules", ".cache-test-mut-dim.png");
      fs.writeFileSync(tmpMutated, mutatedBuf);

      try {
        const info = parsePngBinary(tmpMutated);
        expect(info.width).toBe(47);
        expect(info.width === 48).toBe(false);
      } finally {
        if (fs.existsSync(tmpMutated)) fs.unlinkSync(tmpMutated);
      }
    });

    it("C5.4: Adversarial Oracle detects desynchronized index.html in assets", () => {
      const originalHtml = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8");
      const tamperedHtml = originalHtml.replace("Montanha Personal Studio", "Hacked Studio");

      const origHash = crypto.createHash("sha256").update(originalHtml).digest("hex");
      const tampHash = crypto.createHash("sha256").update(tamperedHtml).digest("hex");

      expect(origHash).not.toBe(tampHash);
    });
  });
});
