import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const source = process.argv[2];
if (!source)
  throw new Error(
    "Pass the directory containing the original generated PNGs. See ASSET_CREDITS.md.",
  );
const files = {
  hero: "exec-f68d3eaa-fd22-4ea9-9a60-c5b64a8b4c60.png",
  telescope: "exec-1e92791f-db0b-47df-8478-245b1a74e0f3.png",
  binoculars: "exec-5a5b290e-5b2b-4f45-90cb-dd7fdb97ba03.png",
  eyepiece: "exec-6d767d03-87ad-4015-ba80-4a1211ada2fc.png",
  tour: "exec-f24a1d30-f521-4778-aee8-1c0e9ee3a6ce.png",
  galaxy: "exec-6a7017c4-ad0d-4bcf-9eb2-3261d590a3ce.png",
};
await mkdir("public/images", { recursive: true });
for (const [name, file] of Object.entries(files)) {
  for (const width of name === "hero" ? [800, 1600] : [400, 800])
    await sharp(`${source}/${file}`)
      .resize({ width })
      .webp({ quality: 82 })
      .toFile(`public/images/${name}-${width}.webp`);
  if (["telescope", "binoculars", "eyepiece"].includes(name)) {
    const metadata = await sharp(`${source}/${file}`).metadata();
    const width = Math.round(metadata.width * 0.65),
      height = Math.round(metadata.height * 0.65);
    for (const outputWidth of [400, 800])
      await sharp(`${source}/${file}`)
        .extract({
          left: Math.round((metadata.width - width) / 2),
          top: Math.round((metadata.height - height) / 3),
          width,
          height,
        })
        .resize({ width: outputWidth })
        .webp({ quality: 82 })
        .toFile(`public/images/${name}-detail-${outputWidth}.webp`);
  }
}
for (const width of [400, 800])
  await sharp(`${source}/${files.hero}`)
    .extract({ left: 50, top: 20, width: 900, height: 620 })
    .resize({ width })
    .webp({ quality: 84 })
    .toFile(`public/images/sky-${width}.webp`);
await writeFile("public/robots.txt", "User-agent: *\nAllow: /\n");
