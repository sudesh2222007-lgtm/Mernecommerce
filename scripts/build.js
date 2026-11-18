const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  console.log("🚀 Installing frontend dependencies...");
  execSync("npm --prefix frontend install", { stdio: "inherit" });

  console.log("📦 Building frontend with Vite...");
  execSync("npm --prefix frontend run build", { stdio: "inherit" });

  const src = path.join(__dirname, "..", "frontend", "dist");
  const dest = path.join(__dirname, "..", "dist");

  console.log(`📁 Copying build output from ${src} to ${dest}...`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log("✅ Build completed successfully!");
} catch (err) {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
}
