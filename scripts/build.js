const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  console.log("🚀 Installing frontend dependencies...");
  execSync("npm --prefix frontend install", { stdio: "inherit" });

  console.log("📦 Building frontend with Vite...");
  execSync("npm --prefix frontend run build", { stdio: "inherit" });

  const src = path.join(__dirname, "..", "frontend", "dist");
  const distDest = path.join(__dirname, "..", "dist");
  const pubDest = path.join(__dirname, "..", "public");

  console.log(`📁 Copying build output to dist and public...`);
  if (fs.existsSync(distDest)) {
    fs.rmSync(distDest, { recursive: true, force: true });
  }
  fs.cpSync(src, distDest, { recursive: true });

  if (fs.existsSync(pubDest)) {
    fs.rmSync(pubDest, { recursive: true, force: true });
  }
  fs.cpSync(src, pubDest, { recursive: true });

  console.log("✅ Build and distribution sync completed successfully!");
} catch (err) {
  console.error("❌ Build failed:", err.message);
  process.exit(1);
}
