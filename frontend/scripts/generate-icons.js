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
        .png({ progressive: true })

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

    console.log('\nIcon generation complete.')
  } catch (err) {
    console.error('Error creating icons', err)
    process.exit(1)
  }
}

render()
