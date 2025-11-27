const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '..', 'public')
const input = path.join(publicDir, 'icon.svg')

if (!fs.existsSync(input)) {
  console.error('Missing `public/icon.svg` — please add your source SVG first.')
  process.exit(1)
}

const outputs = [
  { file: 'apple-icon.png', size: 180 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'icon-32x32.png', size: 32 },
  { file: 'icon-16x16.png', size: 16 },
  // Dark / Light variants (tint) for 32px
  { file: 'icon-dark-32x32.png', size: 32, tint: { r: 20, g: 20, b: 20 } },
  { file: 'icon-light-32x32.png', size: 32, tint: { r: 230, g: 230, b: 230 } },
]

async function render() {
  try {
    for (const o of outputs) {
      const outPath = path.join(publicDir, o.file)
      let pipeline = sharp(input, { density: 600 })
        .resize(o.size, o.size, { fit: 'contain', background: '#00000000' })
        // Use non-interlaced PNGs for better compatibility with ico generators
        .png({ progressive: false })

      // Apply tint if provided — this helps create dark or light variants
      if (o.tint) {
        const { r, g, b } = o.tint
        // Create an overlay of the tint color and composite over it
        const overlay = Buffer.from(
          `<svg width="${o.size}" height="${o.size}" xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='rgb(${r},${g},${b})' opacity='0.0'/></svg>`
        )
        pipeline = pipeline.composite([
          { input: overlay, blend: 'overlay' }
        ])
      }

      await pipeline.toFile(outPath)
      console.log(`Wrote ${outPath}`)
    }

    // Create a favicon.ico from the 16x16 and 32x32 PNGs (if available)
    try {
      // Prefer `png-to-ico`/`to-ico` but fall back to `favicons` for robust generation
      let toIco = null
      try {
        toIco = require('to-ico')
      } catch (e) {
        try {
          toIco = require('png-to-ico')
        } catch (err) {
          toIco = null
        }
      }
      const icoInput32 = path.join(publicDir, 'favicon-32x32.png')
      const icoInput16 = path.join(publicDir, 'favicon-16x16.png')
      const icoOutput = path.join(publicDir, 'favicon.ico')

      if (fs.existsSync(icoInput32) && fs.existsSync(icoInput16)) {
        const buf32 = fs.readFileSync(icoInput32)
        const buf16 = fs.readFileSync(icoInput16)
        if (toIco) {
          const buffer = await toIco([buf32, buf16])
          fs.writeFileSync(icoOutput, buffer)
          console.log(`Wrote ${icoOutput}`)
        } else {
          // Fallback to favicons package which can generate ICOs among other icons
          const favicons = require('favicons')
          const config = {
            path: '/',
            icons: {
              android: false,
              appleIcon: false,
              coast: false,
              favicons: true,
              firefox: false,
              windows: false,
              yandex: false,
            },
          }
          try {
            const response = await favicons(input, config)
            // Write each generated file into `public`
            if (response.images) {
              for (const image of response.images) {
                const outPath = path.join(publicDir, image.name)
                fs.writeFileSync(outPath, image.contents)
                console.log(`Wrote ${outPath}`)
              }
            }
            if (response.files) {
              for (const file of response.files) {
                const outPath = path.join(publicDir, file.name)
                fs.writeFileSync(outPath, file.contents)
                console.log(`Wrote ${outPath}`)
              }
            }
          } catch (favErr) {
            console.warn('favicons fallback failed — unable to generate favicon.ico. Error:', favErr.message)
          }
        }
      } else {
        console.log('Skipping favicon.ico generation: missing input PNGs')
      }
    } catch (err) {
      console.warn('png-to-ico failed — skipping .ico generation. To enable, run `npm install --save-dev png-to-ico`. Error:', err.message)
    }

    console.log('\nIcon generation complete.')
  } catch (err) {
    console.error('Error creating icons', err)
    process.exit(1)
  }
}

render()
