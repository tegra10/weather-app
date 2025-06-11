const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 64, 192, 512];
const svgPath = path.join(__dirname, '../src/assets/weather-logo.svg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate favicon.ico (multiple sizes in one file)
    const faviconSizes = [16, 32, 64];
    const faviconBuffers = await Promise.all(
      faviconSizes.map(size =>
        sharp(svgBuffer)
          .resize(size, size)
          .toFormat('png')
          .toBuffer()
      )
    );

    // Write the favicon.ico
    const faviconPath = path.join(publicDir, 'favicon.ico');
    fs.writeFileSync(faviconPath, Buffer.concat(faviconBuffers));

    // Generate PNG files
    for (const size of sizes) {
      if (size > 64) { // Skip sizes already in favicon
        const pngBuffer = await sharp(svgBuffer)
          .resize(size, size)
          .toFormat('png')
          .toBuffer();

        const outputPath = path.join(publicDir, `logo${size}.png`);
        fs.writeFileSync(outputPath, pngBuffer);
      }
    }

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 