#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Unity Web Build Responsive Converter
 *
 * This script automatically converts Unity web builds to be responsive
 * for portrait orientation with 2400x1080 resolution.
 *
 * Usage: node make-responsive.js [path-to-unity-build]
 */

// Configuration
const CONFIG = {
  targetResolution: {
    width: 1080,
    height: 2400,
  },
  gameTitle: "La Gran Travesia Constitucional",
  companyName: "NolimStudios",
  productName: "La_Gran_Travesia_Constitucional",
  productVersion: "1.0",
};

/**
 * Detect file extensions for Unity build files
 * Returns object with file extensions (empty string or '.br')
 */
function detectFileExtensions(buildPath) {
  const baseName = CONFIG.productName;
  const buildDir = path.join(buildPath, "Build");

  const extensions = {
    data: "",
    framework: "",
    wasm: "",
  };

  // Check if .br versions exist
  const dataBrPath = path.join(buildDir, `${baseName}.data.br`);
  const frameworkBrPath = path.join(buildDir, `${baseName}.framework.js.br`);
  const wasmBrPath = path.join(buildDir, `${baseName}.wasm.br`);

  if (fs.existsSync(dataBrPath)) extensions.data = ".br";
  if (fs.existsSync(frameworkBrPath)) extensions.framework = ".br";
  if (fs.existsSync(wasmBrPath)) extensions.wasm = ".br";

  return extensions;
}

/**
 * Decompress .br files if they exist and uncompressed versions don't exist
 * Returns true if decompression was attempted/needed, false otherwise
 */
function decompressBrFiles(buildPath) {
  const baseName = CONFIG.productName;
  const buildDir = path.join(buildPath, "Build");

  const brFiles = [
    {
      br: `${baseName}.data.br`,
      uncompressed: `${baseName}.data`,
    },
    {
      br: `${baseName}.framework.js.br`,
      uncompressed: `${baseName}.framework.js`,
    },
    {
      br: `${baseName}.wasm.br`,
      uncompressed: `${baseName}.wasm`,
    },
  ];

  let decompressedCount = 0;
  let skippedCount = 0;

  // Check if brotli command is available
  let brotliAvailable = false;
  try {
    execSync("which brotli", { stdio: "ignore" });
    brotliAvailable = true;
  } catch (e) {
    console.log(
      "⚠️  Warning: 'brotli' command not found. Skipping decompression."
    );
    console.log("   Install it with: brew install brotli");
    return false;
  }

  console.log("🔓 Checking for compressed files...");

  for (const file of brFiles) {
    const brPath = path.join(buildDir, file.br);
    const uncompressedPath = path.join(buildDir, file.uncompressed);

    // If .br file exists and uncompressed version doesn't exist
    if (fs.existsSync(brPath) && !fs.existsSync(uncompressedPath)) {
      try {
        console.log(`   Decompressing ${file.br}...`);
        execSync(`brotli -d "${brPath}"`, { stdio: "inherit" });
        decompressedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to decompress ${file.br}:`, error.message);
      }
    } else if (fs.existsSync(brPath) && fs.existsSync(uncompressedPath)) {
      skippedCount++;
      console.log(
        `   ⏭️  ${file.uncompressed} already exists, skipping ${file.br}`
      );
    }
  }

  if (decompressedCount > 0) {
    console.log(`✅ Decompressed ${decompressedCount} file(s)`);
  } else if (skippedCount > 0) {
    console.log(`ℹ️  All files already decompressed (${skippedCount} skipped)`);
  } else {
    console.log("ℹ️  No .br files found or already decompressed");
  }

  return decompressedCount > 0;
}

/**
 * Generate HTML template with correct file extensions
 * Note: After decompression, this will always use uncompressed files (empty extensions)
 */
function generateHTMLTemplate(fileExtensions) {
  return `<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes"
    />
     <title>La Gran Travesia Constitucional</title>
    <link rel="shortcut icon" href="TemplateData/travesia_logo.jpg" />
    <link rel="stylesheet" href="TemplateData/style.css" />
  </head>
  <body>
    <div id="unity-container" class="unity-mobile">
      <canvas
        id="unity-canvas"
        width="${CONFIG.targetResolution.width}"
        height="${CONFIG.targetResolution.height}"
        tabindex="-1"
      ></canvas>
      <div id="unity-loading-bar">
        <div id="unity-logo"></div>
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full"></div>
        </div>
      </div>
      <div id="unity-warning"></div>
    </div>
    <script>
      var canvas = document.querySelector("#unity-canvas");

      // Shows a temporary message banner/ribbon for a few seconds, or
      // a permanent error message on top of the canvas if type=='error'.
      // If type=='warning', a yellow highlight color is used.
      // Modify or remove this function to customize the visually presented
      // way that non-critical warnings and error messages are presented to the
      // user.
      function unityShowBanner(msg, type) {
        var warningBanner = document.querySelector("#unity-warning");
        function updateBannerVisibility() {
          warningBanner.style.display = warningBanner.children.length
            ? "block"
            : "none";
        }
        var div = document.createElement("div");
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == "error") div.style = "background: red; padding: 10px;";
        else {
          if (type == "warning")
            div.style = "background: yellow; padding: 10px;";
          setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
          }, 5000);
        }
        updateBannerVisibility();
      }

      var buildUrl = "Build";
      var loaderUrl = buildUrl + "/${CONFIG.productName}.loader.js";
      var config = {
        arguments: [],
        dataUrl: buildUrl + "/${CONFIG.productName}.data${fileExtensions.data}",
        frameworkUrl: buildUrl + "/${CONFIG.productName}.framework.js${
    fileExtensions.framework
  }",
        codeUrl: buildUrl + "/${CONFIG.productName}.wasm${fileExtensions.wasm}",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "${CONFIG.companyName}",
        productName: "${CONFIG.productName}",
        productVersion: "${CONFIG.productVersion}",
        showBanner: unityShowBanner,
        // errorHandler: function(err, url, line) {
        //    alert("error " + err + " occurred at line " + line);
        //    // Return 'true' if you handled this error and don't want Unity
        //    // to process it further, 'false' otherwise.
        //    return true;
        // },
      };

      // By default, Unity keeps WebGL canvas render target size matched with
      // the DOM size of the canvas element (scaled by window.devicePixelRatio)
      // Set this to false if you want to decouple this synchronization from
      // happening inside the engine, and you would instead like to size up
      // the canvas DOM size and WebGL render target sizes yourself.
      // config.matchWebGLToCanvasSize = false;

      // If you would like all file writes inside Unity Application.persistentDataPath
      // directory to automatically persist so that the contents are remembered when
      // the user revisits the site the next time, uncomment the following line:
      // config.autoSyncPersistentDataPath = true;
      // This autosyncing is currently not the default behavior to avoid regressing
      // existing user projects that might rely on the earlier manual
      // JS_FileSystem_Sync() behavior, but in future Unity version, this will be
      // expected to change.

      // Force mobile style for all devices since this is portrait-only
      document.querySelector("#unity-container").className = "unity-mobile";
      canvas.className = "unity-mobile";

      // Responsive scaling function
      function resizeCanvas() {
        const container = document.querySelector("#unity-container");
        const canvas = document.querySelector("#unity-canvas");

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate aspect ratio (${CONFIG.targetResolution.width}:${
    CONFIG.targetResolution.height
  } = ${(
    CONFIG.targetResolution.width / CONFIG.targetResolution.height
  ).toFixed(3)})
        const targetAspectRatio = ${CONFIG.targetResolution.width} / ${
    CONFIG.targetResolution.height
  };
        const viewportAspectRatio = viewportWidth / viewportHeight;

        let canvasWidth, canvasHeight;

        if (viewportAspectRatio > targetAspectRatio) {
          // Viewport is wider than target, fit to height
          canvasHeight = viewportHeight;
          canvasWidth = canvasHeight * targetAspectRatio;
        } else {
          // Viewport is taller than target, fit to width
          canvasWidth = viewportWidth;
          canvasHeight = canvasWidth / targetAspectRatio;
        }

        // Apply dimensions
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";

        // Center the canvas
        container.style.left = "50%";
        container.style.top = "50%";
        container.style.transform = "translate(-50%, -50%)";
      }

      // Initial resize
      resizeCanvas();

      // Resize on window resize
      window.addEventListener("resize", resizeCanvas);

      document.querySelector("#unity-loading-bar").style.display = "block";

      var script = document.createElement("script");
      script.src = loaderUrl;
      script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          document.querySelector("#unity-progress-bar-full").style.width =
            100 * progress + "%";
        })
          .then((unityInstance) => {
            document.querySelector("#unity-loading-bar").style.display = "none";
          })
          .catch((message) => {
            alert(message);
          });
      };

      document.body.appendChild(script);
    </script>
  </body>
</html>`;
}

// CSS template for responsive styling
const CSS_TEMPLATE = `body {
  padding: 0;
  margin: 0;
  background: #ffffff;
  overflow: hidden;
}

#unity-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#unity-canvas {
  background: #ffffff;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

#unity-loading-bar {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: none;
  z-index: 1000;
}

#unity-logo {
  width: 154px;
  height: 130px;
  background: url("unity-logo-light.png") no-repeat center;
  margin: 0 auto;
}

#unity-progress-bar-empty {
  width: 141px;
  height: 18px;
  margin-top: 10px;
  margin-left: 6.5px;
  background: url("progress-bar-empty-light.png") no-repeat center;
}

#unity-progress-bar-full {
  width: 0%;
  height: 18px;
  margin-top: 10px;
  background: url("progress-bar-full-light.png") no-repeat center;
}

#unity-warning {
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%);
  background: white;
  padding: 10px;
  display: none;
  z-index: 1001;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}`;

/**
 * Main function to process Unity build directory
 */
function processUnityBuild(buildPath) {
  console.log(`🚀 Processing Unity build at: ${buildPath}`);

  // Check if directory exists
  if (!fs.existsSync(buildPath)) {
    console.error(`❌ Error: Directory ${buildPath} does not exist`);
    process.exit(1);
  }

  // Decompress .br files first (if they exist)
  decompressBrFiles(buildPath);

  // Detect file extensions (prefer uncompressed files if they exist)
  console.log("🔍 Detecting file extensions...");
  const fileExtensions = detectFileExtensions(buildPath);
  console.log(
    `✅ Detected extensions: data${fileExtensions.data}, framework${fileExtensions.framework}, wasm${fileExtensions.wasm}`
  );

  // If files were decompressed, force use of uncompressed versions
  const baseName = CONFIG.productName;
  const buildDir = path.join(buildPath, "Build");

  // Check if uncompressed versions exist and prefer them
  const uncompressedData = path.join(buildDir, `${baseName}.data`);
  const uncompressedFramework = path.join(buildDir, `${baseName}.framework.js`);
  const uncompressedWasm = path.join(buildDir, `${baseName}.wasm`);

  if (fs.existsSync(uncompressedData)) fileExtensions.data = "";
  if (fs.existsSync(uncompressedFramework)) fileExtensions.framework = "";
  if (fs.existsSync(uncompressedWasm)) fileExtensions.wasm = "";

  // Check for required files

  const requiredFiles = [
    "index.html",
    "TemplateData/style.css",
    `Build/${baseName}.loader.js`,
  ];

  console.log("📋 Checking required files...");
  for (const file of requiredFiles) {
    const filePath = path.join(buildPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Required file ${file} not found`);
      process.exit(1);
    }
  }

  // Check Unity build files
  const dataFile = path.join(
    buildDir,
    `${baseName}.data${fileExtensions.data}`
  );
  const frameworkFile = path.join(
    buildDir,
    `${baseName}.framework.js${fileExtensions.framework}`
  );
  const wasmFile = path.join(
    buildDir,
    `${baseName}.wasm${fileExtensions.wasm}`
  );

  if (!fs.existsSync(dataFile)) {
    console.error(
      `❌ Error: Required file Build/${baseName}.data${fileExtensions.data} not found`
    );
    process.exit(1);
  }
  if (!fs.existsSync(frameworkFile)) {
    console.error(
      `❌ Error: Required file Build/${baseName}.framework.js${fileExtensions.framework} not found`
    );
    process.exit(1);
  }
  if (!fs.existsSync(wasmFile)) {
    console.error(
      `❌ Error: Required file Build/${baseName}.wasm${fileExtensions.wasm} not found`
    );
    process.exit(1);
  }
  console.log("✅ All required files found");

  // Create backup of original files
  console.log("💾 Creating backups...");
  const backupDir = path.join(buildPath, "backup");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  fs.copyFileSync(
    path.join(buildPath, "index.html"),
    path.join(backupDir, "index.html.backup")
  );
  fs.copyFileSync(
    path.join(buildPath, "TemplateData/style.css"),
    path.join(backupDir, "style.css.backup")
  );
  console.log("✅ Backups created");

  // Write new responsive files
  console.log("📝 Writing responsive files...");

  // Generate HTML with correct file extensions
  const htmlContent = generateHTMLTemplate(fileExtensions);

  // Write HTML file
  fs.writeFileSync(path.join(buildPath, "index.html"), htmlContent);
  console.log("✅ index.html updated");

  // Write CSS file
  fs.writeFileSync(
    path.join(buildPath, "TemplateData/style.css"),
    CSS_TEMPLATE
  );
  console.log("✅ style.css updated");

  console.log("🎉 Unity build successfully converted to responsive!");
  console.log(
    `📱 Resolution: ${CONFIG.targetResolution.width}x${CONFIG.targetResolution.height}`
  );
  console.log(`🎮 Game: ${CONFIG.gameTitle}`);
  console.log(`📁 Build path: ${buildPath}`);
  console.log(`💾 Backups saved in: ${backupDir}`);
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
🎮 Unity Web Build Responsive Converter

This script automatically converts Unity web builds to be responsive
for portrait orientation with ${CONFIG.targetResolution.width}x${CONFIG.targetResolution.height} resolution.

Usage:
  node make-responsive.js [path-to-unity-build]

Examples:
  node make-responsive.js .
  node make-responsive.js ./my-unity-build
  node make-responsive.js /path/to/unity/build

Features:
  ✅ Responsive scaling for any screen size
  ✅ Portrait orientation optimization
  ✅ Removes desktop UI elements
  ✅ Automatic canvas centering
  ✅ Creates backups of original files
  ✅ White background for better contrast
  ✅ Automatic detection of .br compressed files
  ✅ Automatic decompression of .br files (requires 'brotli' command)

Required files in build directory:
  - index.html
  - TemplateData/style.css
  - Build/La_Gran_Travesia_Constitucional.loader.js
  - Build/La_Gran_Travesia_Constitucional.data (or .data.br)
  - Build/La_Gran_Travesia_Constitucional.framework.js (or .framework.js.br)
  - Build/La_Gran_Travesia_Constitucional.wasm (or .wasm.br)
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    showHelp();
    return;
  }

  const buildPath = path.resolve(args[0]);
  processUnityBuild(buildPath);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processUnityBuild, CONFIG };
