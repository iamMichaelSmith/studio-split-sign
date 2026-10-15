// Compose a gallery from actual plugin captures; no generated interface artwork.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const captures = path.resolve(process.argv[2] || '.local/ui-refresh-final');
const output = path.resolve('public/plugin-skins-collection.png');
const skins = ['midnight', 'neon', 'electric', 'blueprint', 'royal', 'walnut'];
(async () => {
  const layers = [];
  for (let i = 0; i < skins.length; i++) {
    const skin = skins[i];
    const x = 32 + (i % 3) * 584;
    const y = 20 + Math.floor(i / 3) * 490;
    const image = await sharp(path.join(captures, 'plugin-skin-' + skin + '.png')).resize(568, 400, {fit: 'inside'}).png().toBuffer();
    const label = Buffer.from('<svg width="568" height="36"><text x="0" y="25" font-family="Arial,Helvetica,sans-serif" font-size="23" font-weight="600" fill="#f2eee7">' + skin[0].toUpperCase() + skin.slice(1) + '</text></svg>');
    layers.push({input: label, left: x, top: y}, {input: image, left: x, top: y + 40});
  }
  await sharp({create: {width: 1800, height: 1020, channels: 4, background: '#111417'}}).composite(layers).png().toFile(output);
  console.log('Built six-skin gallery from actual plugin screens.');
})().catch(e => {console.error(e.message);process.exitCode = 1;});
