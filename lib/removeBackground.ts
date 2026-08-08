import sharp from 'sharp';

interface RemoveBgResult {
  buffer: Buffer;
  removedPercent: number;
}

export async function removeImageBackground(inputBuffer: Buffer): Promise<RemoveBgResult> {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  const samplePoints: { x: number; y: number }[] = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 20));

  for (let x = 0; x < width; x += step) {
    samplePoints.push({ x, y: 0 });
    samplePoints.push({ x, y: height - 1 });
  }
  for (let y = step; y < height - step; y += step) {
    samplePoints.push({ x: 0, y });
    samplePoints.push({ x: width - 1, y });
  }

  let avgR = 0, avgG = 0, avgB = 0;
  for (const pt of samplePoints) {
    const idx = (pt.y * width + pt.x) * channels;
    avgR += data[idx];
    avgG += data[idx + 1];
    avgB += data[idx + 2];
  }
  avgR = Math.round(avgR / samplePoints.length);
  avgG = Math.round(avgG / samplePoints.length);
  avgB = Math.round(avgB / samplePoints.length);

  const THRESHOLD = 55;
  const THRESHOLD_SQ = THRESHOLD * THRESHOLD;
  let removedCount = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const dr = r - avgR;
    const dg = g - avgG;
    const db = b - avgB;
    const distSq = dr * dr + dg * dg + db * db;

    if (distSq < THRESHOLD_SQ) {
      data[i + 3] = 0;
      removedCount++;
    }
  }

  const totalOpaque = data.length / channels - removedCount;
  const removedPercent = totalOpaque > 0
    ? Math.round((removedCount / (data.length / channels)) * 100)
    : 0;

  const outputBuffer = await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  return { buffer: outputBuffer, removedPercent };
}
