import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export interface ImageInfo {
  path: string;
  relativePath: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
  hasWebP: boolean;
  webpSize?: number;
  savings?: number;
}

export interface ScanResult {
  totalImages: number;
  totalSize: number;
  images: ImageInfo[];
  pngCount: number;
  webpCount: number;
  potentialSavings: number;
}

export interface ConvertResult {
  success: boolean;
  originalPath: string;
  webpPath: string;
  originalSize: number;
  webpSize: number;
  savings: number;
  savingsPercent: number;
}

/**
 * Scan all images in the public directory
 */
export async function scanImages(): Promise<ScanResult> {
  const publicDir = path.join(process.cwd(), 'public');
  const images: ImageInfo[] = [];
  let totalSize = 0;
  let pngCount = 0;
  let webpCount = 0;
  let potentialSavings = 0;

  async function scanDirectory(dir: string, relativeTo: string = '') {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(relativeTo, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relativePath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        
        if (['.png', '.webp', '.jpg', '.jpeg'].includes(ext)) {
          const stats = await fs.promises.stat(fullPath);
          const metadata = await sharp(fullPath).metadata();
          
          const isPng = ext === '.png';
          const isWebP = ext === '.webp';
          
          // Check if WebP version exists for PNG
          let hasWebP = false;
          let webpSize: number | undefined;
          let savings: number | undefined;
          
          if (isPng) {
            pngCount++;
            const webpPath = fullPath.replace(/\.png$/i, '.webp');
            if (fs.existsSync(webpPath)) {
              hasWebP = true;
              const webpStats = await fs.promises.stat(webpPath);
              webpSize = webpStats.size;
              savings = stats.size - webpStats.size;
              if (savings > 0) potentialSavings += savings;
            } else {
              // Estimate potential savings (typically 25-35% for PNG to WebP)
              const estimatedWebpSize = Math.floor(stats.size * 0.7);
              potentialSavings += stats.size - estimatedWebpSize;
            }
          } else if (isWebP) {
            webpCount++;
          }

          images.push({
            path: fullPath,
            relativePath: '/images/' + relativePath.replace(/^images[/\\]?/, ''),
            size: stats.size,
            format: ext.slice(1),
            width: metadata.width,
            height: metadata.height,
            hasWebP,
            webpSize,
            savings,
          });

          totalSize += stats.size;
        }
      }
    }
  }

  await scanDirectory(publicDir);

  return {
    totalImages: images.length,
    totalSize,
    images: images.sort((a, b) => b.size - a.size),
    pngCount,
    webpCount,
    potentialSavings,
  };
}

/**
 * Convert a single PNG to WebP
 */
export async function convertToWebP(
  inputPath: string,
  quality: number = 80,
  lossless: boolean = false
): Promise<ConvertResult> {
  const outputPath = inputPath.replace(/\.png$/i, '.webp');
  
  const originalStats = await fs.promises.stat(inputPath);
  const originalSize = originalStats.size;

  await sharp(inputPath)
    .webp({ quality, lossless })
    .toFile(outputPath);

  const webpStats = await fs.promises.stat(outputPath);
  const webpSize = webpStats.size;
  const savings = originalSize - webpSize;
  const savingsPercent = (savings / originalSize) * 100;

  return {
    success: true,
    originalPath: inputPath,
    webpPath: outputPath,
    originalSize,
    webpSize,
    savings,
    savingsPercent,
  };
}

/**
 * Convert multiple PNGs to WebP
 */
export async function convertMultipleToWebP(
  paths: string[],
  quality: number = 80,
  lossless: boolean = false,
  onProgress?: (current: number, total: number) => void
): Promise<ConvertResult[]> {
  const results: ConvertResult[] = [];
  
  for (let i = 0; i < paths.length; i++) {
    try {
      const result = await convertToWebP(paths[i], quality, lossless);
      results.push(result);
    } catch (error) {
      console.error(`Error converting ${paths[i]}:`, error);
      results.push({
        success: false,
        originalPath: paths[i],
        webpPath: '',
        originalSize: 0,
        webpSize: 0,
        savings: 0,
        savingsPercent: 0,
      });
    }
    
    if (onProgress) {
      onProgress(i + 1, paths.length);
    }
  }
  
  return results;
}

/**
 * Delete original PNG after WebP conversion
 */
export async function deleteOriginalPng(pngPath: string): Promise<boolean> {
  try {
    const webpPath = pngPath.replace(/\.png$/i, '.webp');
    
    // Only delete if WebP exists
    if (!fs.existsSync(webpPath)) {
      throw new Error('WebP version does not exist');
    }
    
    await fs.promises.unlink(pngPath);
    return true;
  } catch (error) {
    console.error(`Error deleting ${pngPath}:`, error);
    return false;
  }
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
