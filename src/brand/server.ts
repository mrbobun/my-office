// A brand pack of this computer's own, read on the server: public/assets/brand-local/ (in .gitignore, never published).
// brand.json gives the name, the top bar's mark and the 3D sign; brand.css, when there, restyles the interface.
// Without the folder the office looks as it always did.
import fs from 'node:fs';
import path from 'node:path';

export type LocalBrand = {
  name?: string;
  mark?: string;   // a file in the folder, for the top bar
  sign?: { logo: string; bg?: string; stripe?: string };   // the lobby sign and reception plaque, and the reception's stripe
  css: boolean;
};

const DIR = () => path.join(process.env.OFFICE_ROOT || process.cwd(), 'public', 'assets', 'brand-local');
const FILE = /^[\w.-]+$/;   // a plain file name in that folder, nothing else
const COLOR = /^#[0-9a-f]{6}$/i;

export function localBrand(): LocalBrand | null {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DIR(), 'brand.json'), 'utf8'));
    const s = j?.sign;
    return {
      name: typeof j?.name === 'string' ? j.name.slice(0, 40) : undefined,
      mark: typeof j?.mark === 'string' && FILE.test(j.mark) ? j.mark : undefined,
      sign: s && typeof s.logo === 'string' && FILE.test(s.logo)
        ? { logo: s.logo, bg: COLOR.test(s.bg) ? s.bg : undefined, stripe: COLOR.test(s.stripe) ? s.stripe : undefined }
        : undefined,
      css: fs.existsSync(path.join(DIR(), 'brand.css')),
    };
  } catch { return null; }
}
