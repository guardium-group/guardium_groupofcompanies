import sharp from "sharp";
import { statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const heroDir = join(__dirname, "..", "public", "images", "hero");

const files = [
  "cliffs-towing-edmonton-heroBg.png",
  "cliffs-towing-heavyduty-edmonton-heroBg.png",
  "guardium-security-edmonton-heroBg.png",
  "guardium-property-services-mgt-edmonton-heroBg.png",
  "guardium-logistics-warehousing-edmonton-heroBg.png",
];

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

for (const file of files) {
  const input = join(heroDir, file);
  const output = join(heroDir, file.replace(/\.png$/, ".jpg"));

  const beforeSize = statSync(input).size;

  await sharp(input)
    .resize({ width: 2560, withoutEnlargement: true })
    .flatten({ background: "#000000" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(output);

  const afterSize = statSync(output).size;
  const reduction = (100 * (1 - afterSize / beforeSize)).toFixed(1);

  console.log(
    `${file} -> ${file.replace(/\.png$/, ".jpg")}: ${formatBytes(beforeSize)} -> ${formatBytes(afterSize)} (-${reduction}%)`,
  );
}
