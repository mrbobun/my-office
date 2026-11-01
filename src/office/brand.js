// This computer's own brand pack, when there is one (public/assets/brand-local/, never in git; read by src/brand/server.ts,
// handed to the page in <script id="brand-local">): the 3D lobby sign, the reception plaque and its stripe take it.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const brand = (() => {
  try { const el = typeof document !== 'undefined' && document.getElementById('brand-local'); return el ? JSON.parse(el.textContent || 'null') : null; }
  catch { return null; }
})();

let signJob = null;
/** The sign's logo, loaded once: { img, bg, stripe }, or null without a brand pack (or when the image won't load). */
export function brandSign() {
  if (!brand?.sign) return Promise.resolve(null);
  return (signJob ??= (async () => {
    const img = new Image();
    img.src = `${BASE}/assets/brand-local/${encodeURIComponent(brand.sign.logo)}`;
    await img.decode();
    return { img, bg: brand.sign.bg || '#1C2620', stripe: brand.sign.stripe || null };
  })().catch(() => null));
}

/** Draws the sign: the logo centred on its background, as large as fits with a margin. */
export function drawBrandSign(g, w, h, { img, bg }) {
  g.clearRect(0, 0, w, h);
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  const pad = h * 0.14, s = Math.min((w - 2 * pad) / img.naturalWidth, (h - 2 * pad) / img.naturalHeight);
  const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
  g.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}
