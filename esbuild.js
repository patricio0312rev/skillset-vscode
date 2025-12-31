const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * Plugin to copy skillset templates and fix paths
 */
const copyTemplatesPlugin = {
  name: 'copy-templates',
  setup(build) {
    build.onEnd(async () => {
      const distDir = path.join(__dirname, 'dist');

      // Ensure dist directory exists
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      try {
        // Try to copy skillset templates if they exist in node_modules
        const skillsetPath = path.join(__dirname, 'node_modules', '@patricio0312rev', 'skillset');

        if (fs.existsSync(skillsetPath)) {
          // Copy templates directory if it exists
          const templatesPath = path.join(skillsetPath, 'templates');
          if (fs.existsSync(templatesPath)) {
            const destTemplates = path.join(distDir, 'templates');
            copyRecursive(templatesPath, destTemplates);
            console.log('✓ Copied skillset templates');
          }

          // Copy lib/config if it exists
          const libPath = path.join(skillsetPath, 'src', 'lib');
          if (fs.existsSync(libPath)) {
            const destLib = path.join(distDir, 'lib');
            copyRecursive(libPath, destLib);
            console.log('✓ Copied skillset config files');
          }
        }
      } catch (error) {
        console.warn('Warning: Could not copy skillset templates:', error.message);
      }
    });
  },
};

/**
 * Recursively copy directory
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Build configuration
 */
async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'dist/extension.js',
    external: ['vscode', '@patricio0312rev/skillset'],
    format: 'cjs',
    platform: 'node',
    sourcemap: !production,
    minify: production,
    plugins: [copyTemplatesPlugin],
    logLevel: 'info',
  });

  if (watch) {
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
