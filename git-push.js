const cp = require('child_process');
try {
  console.log("1. Running git add...");
  cp.execSync('git add .', { stdio: 'inherit' });
  console.log("2. Running git commit...");
  cp.execSync('git commit -m "fix: restore working bun and java 21 workflow with apk release"', { stdio: 'inherit' });
  console.log("3. Running git push...");
  cp.execSync('git push', { stdio: 'inherit' });
  console.log("SUCCESS!");
} catch (err) {
  console.error("Error during git push:", err.message);
  process.exit(1);
}
