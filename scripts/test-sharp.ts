import sharp from 'sharp';

async function test() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  console.log('Magic bytes (must be 89504e470d0a1a0a):', buf.subarray(0, 8).toString('hex'));
}

test();
