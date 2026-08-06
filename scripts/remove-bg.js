const sharp = require('sharp');
const path = require('path');

async function removeBlackBackground() {
  const inputPath = path.join(__dirname, '../public/images/chest-nanobanana.png');
  const outputPath = path.join(__dirname, '../public/images/chest-nanobanana-temp.png');

  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // We'll do a simple flood fill from the corners
    const w = info.width;
    const h = info.height;
    const channels = info.channels;
    
    // Stack for flood fill
    const stack = [];
    const visited = new Uint8Array(w * h);

    function push(x, y) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        if (!visited[y * w + x]) {
          stack.push([x, y]);
          visited[y * w + x] = 1;
        }
      }
    }

    // Start from corners
    push(0, 0);
    push(w-1, 0);
    push(0, h-1);
    push(w-1, h-1);

    const threshold = 25; // rgb < 25 is considered black background

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = (y * w + x) * channels;
      
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      
      if (r < threshold && g < threshold && b < threshold) {
        // It's dark enough, make it transparent
        data[idx+3] = 0; // alpha = 0
        
        // Queue neighbors
        push(x-1, y);
        push(x+1, y);
        push(x, y-1);
        push(x, y+1);
      }
    }

    await sharp(data, {
      raw: {
        width: w,
        height: h,
        channels: channels
      }
    }).toFile(outputPath);

    console.log('Background removed successfully!');
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeBlackBackground();

