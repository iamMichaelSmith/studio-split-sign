// Compose branded, code-defined layouts using untouched screenshots from the real editor.
// Run the SplitSheetScreenshotRenderer target first with SPLITSHEET_SCREENSHOT_DIR set.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const captures = path.join(root, '.local/email-marketing-captures');
const output = path.join(root, 'public');
const embed = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
const image = (file, x, y, w, h) => `<image href="${embed(file)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const text = (x, y, size, content, color = '#f8e9d3', weight = 400, extra = '') => `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" ${extra}>${content}</text>`;
const base = body => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="800" viewBox="0 0 1600 800"><defs><linearGradient id="bg"><stop stop-color="#35271d"/><stop offset="1" stop-color="#171512"/></linearGradient></defs><rect width="1600" height="800" fill="url(#bg)"/><rect x="0" y="0" width="1600" height="4" fill="#d1a36c"/>${body}</svg>`;
async function save(name, svg) {
  fs.writeFileSync(path.join(output, `email-hero-${name}.svg`), svg);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(output, `email-hero-${name}.png`));
}
(async () => {
  const scenes = [
    ['session', 'CAPTURE THE SESSION', ['Great session.', 'Clear next steps.'], 'Song. Contributors. Review.', 'plugin-song.png'],
    ['collaboration', 'GIVE EVERYONE A NEXT STEP', ['Keep the', 'music moving.'], 'Invite. Review. Sign.', 'plugin-contributors.png'],
    ['vault', 'KEEP THE RECORD WITHIN REACH', ['Your session.', 'On record.'], 'Find the sheet. Download the packet.', 'plugin-review-send.png'],
    ['profiles', 'BUILT FOR YOUR REGULAR CREW', ['Same chemistry.', 'Less repeat entry.'], 'Approved profiles for the next session.', 'plugin-contributors.png'],
    ['next-session', 'READY FOR THE NEXT COLLABORATION', ['Make it a', 'studio habit.'], 'Web workspace. Windows VST3. Your workflow.', 'plugin-song.png']
  ];
  for (const [name, eyebrow, lines, note, capture] of scenes) {
    const svg = base(text(70, 106, 17, eyebrow, '#d1a36c', 700, 'letter-spacing="3"') +
      lines.map((line, i) => text(70, 270 + i * 82, 64, line, '#f8e9d3', 700)).join('') +
      `<rect x="70" y="402" width="68" height="4" fill="#c69561"/>` +
      text(70, 462, 23, note, '#c8b6a0') + text(70, 697, 17, 'SPLIT SHEET STUDIO', '#d1a36c', 700, 'letter-spacing="3"') +
      `<rect x="658" y="61" width="882" height="681" rx="16" fill="#110f0d" stroke="#806246" stroke-width="2"/>` +
      image(path.join(captures, capture), 675, 78, 848, 647));
    await save(name, svg);
  }
  const skinSvg = base(text(70, 75, 17, 'WINDOWS VST3  /  CREATOR AND STUDIO', '#d1a36c', 700, 'letter-spacing="3"') +
    text(70, 145, 54, 'Three skins. One studio workflow.', '#f8e9d3', 700) +
    image(path.join(captures, 'plugin-skin-denim.png'), 35, 266, 450, 316) +
    image(path.join(captures, 'plugin-skin-speakeasy.png'), 498, 206, 604, 425) +
    image(path.join(captures, 'plugin-skin-plush.png'), 1115, 266, 450, 316) +
    text(260, 679, 28, 'DENIM', '#f8e9d3', 700, 'text-anchor="middle" letter-spacing="3"') +
    text(800, 679, 28, 'SPEAKEASY', '#f8e9d3', 700, 'text-anchor="middle" letter-spacing="3"') +
    text(1340, 679, 28, 'PLUSH', '#f8e9d3', 700, 'text-anchor="middle" letter-spacing="3"') +
    text(800, 743, 23, 'Your workflow. Your studio. Your look.', '#c8b6a0', 400, 'text-anchor="middle"'));
  await save('skins', skinSvg);
  console.log('Built six email heroes from real app captures.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
