const fs = require('fs');
const path = require('path');

// 5 Best Video Releases Thumbnails
const BEST_THUMBNAILS = [
  {
    name: 'Prime Living — Ergonomic Bed Topper Commercial',
    file: 'og-best-1.jpg',
    url: 'https://img.youtube.com/vi/NMagLbVpOnw/hqdefault.jpg'
  },
  {
    name: 'Luxury Quilt Comforter 3 — Premium Bedding Master BD',
    file: 'og-best-2.jpg',
    url: 'https://lh3.googleusercontent.com/d/1PE8qH8clZJ4ISJCefzoRZZAFwRK8l2Mh=w1200'
  },
  {
    name: 'Serene Nights — All-Season Luxury Comforter',
    file: 'og-best-3.jpg',
    url: 'https://img.youtube.com/vi/7cL6jUNBb40/hqdefault.jpg'
  },
  {
    name: 'Order-to-Delivery Journey — 1:1 Social Proof Conversion Reel',
    file: 'og-best-4.jpg',
    url: 'https://lh3.googleusercontent.com/d/1-6sncd9putQA9EHIGIGLXWaZlQ8VEf3L=w1200'
  },
  {
    name: 'Tashrif International Academy — Institutional Documentary',
    file: 'og-best-5.jpg',
    url: 'https://lh3.googleusercontent.com/d/1LCkwmXFHSTTeON-Ic43gx5gWQyIe2Fs0=w1200'
  }
];

// Pick random thumbnail
const selected = BEST_THUMBNAILS[Math.floor(Math.random() * BEST_THUMBNAILS.length)];
console.log(`[SEO Randomizer] Picked: "${selected.name}" (${selected.file})`);

// 1. Copy selected image to og-cover.jpg
const distOgCover = path.join(__dirname, '..', 'dist', 'og-cover.jpg');
const distSelected = path.join(__dirname, '..', 'dist', selected.file);
const publicSelected = path.join(__dirname, '..', 'public', selected.file);

if (fs.existsSync(distSelected)) {
  fs.copyFileSync(distSelected, distOgCover);
} else if (fs.existsSync(publicSelected)) {
  fs.copyFileSync(publicSelected, distOgCover);
}

// 2. Update dist/index.html with the selected thumbnail
const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
if (fs.existsSync(distIndex)) {
  let html = fs.readFileSync(distIndex, 'utf8');

  // Replace default og-cover.jpg reference with the specific chosen one
  const absoluteUrl = `https://rayhangazi.github.io/Video-Edit-Portfolio/${selected.file}?v=${Date.now()}`;

  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:secure_url["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:width["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:image:height["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, '');

  const tags = `
    <meta property="og:image" content="${absoluteUrl}" />
    <meta property="og:image:secure_url" content="${absoluteUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:image:alt" content="Rayhan Gazi — ${selected.name}" />
    <meta name="twitter:image" content="${absoluteUrl}" />`;

  html = html.replace('</head>', `${tags}\n  </head>`);
  fs.writeFileSync(distIndex, html, 'utf8');
  console.log(`[SEO Randomizer] Updated dist/index.html with og:image -> ${absoluteUrl}`);
}
