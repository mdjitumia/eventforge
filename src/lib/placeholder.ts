// Inline SVG placeholders so the base template has sample images without any file or network.
const enc = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export function banner(label: string, c1 = "#0ea5b7", c2 = "#6d5cf0", w = 1200, h = 600) {
  return enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs>
<rect width='100%' height='100%' fill='url(#g)'/>
<circle cx='${w * 0.82}' cy='${h * 0.2}' r='${h * 0.35}' fill='white' opacity='.10'/>
<circle cx='${w * 0.1}' cy='${h * 0.95}' r='${h * 0.4}' fill='white' opacity='.08'/>
<text x='50%' y='52%' font-family='Segoe UI, Arial, sans-serif' font-size='${Math.round(h / 11)}' font-weight='700' fill='white' text-anchor='middle' opacity='.92'>${label}</text>
<text x='50%' y='${Math.round(h * 0.52 + h / 8)}' font-family='Segoe UI, Arial, sans-serif' font-size='${Math.round(h / 24)}' fill='white' text-anchor='middle' opacity='.7'>Sample image - replace it from your dashboard</text></svg>`,
  );
}

const PALETTE = ["#0ea5b7", "#6d5cf0", "#e0892b", "#d6457a", "#2e9e6b", "#3b82f6", "#8b5cf6", "#ef6a4c"];

export function avatar(name: string, i = 0) {
  const initials = name.replace(/^(Prof(essor)?\.?|Dr\.?|Mr\.?|Ms\.?)\s+/gi, "").split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const c = PALETTE[i % PALETTE.length];
  return enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='${c}'/><circle cx='200' cy='155' r='70' fill='white' opacity='.25'/><ellipse cx='200' cy='360' rx='130' ry='110' fill='white' opacity='.25'/><text x='50%' y='57%' font-family='Segoe UI, Arial, sans-serif' font-size='120' font-weight='700' fill='white' text-anchor='middle'>${initials}</text></svg>`,
  );
}

export function logo(name: string, i = 0) {
  const c = PALETTE[i % PALETTE.length];
  const t = name.length > 22 ? name.slice(0, 21) + "…" : name;
  return enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='140' viewBox='0 0 360 140'><rect x='4' y='4' width='352' height='132' rx='18' fill='white' stroke='${c}' stroke-width='4'/><circle cx='56' cy='70' r='26' fill='${c}'/><text x='95' y='78' font-family='Segoe UI, Arial, sans-serif' font-size='24' font-weight='700' fill='#1f2937'>${t.replace(/&/g, "&amp;")}</text></svg>`,
  );
}

export function orgMark(letter: string, c = "#0ea5b7") {
  return enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' rx='28' fill='${c}'/><text x='50%' y='66%' font-family='Segoe UI, Arial, sans-serif' font-size='72' font-weight='800' fill='white' text-anchor='middle'>${letter.slice(0, 1).toUpperCase()}</text></svg>`,
  );
}

/** Text-free gradient background (used behind hero text). */
export function bg(c1 = "#0ea5b7", c2 = "#6d5cf0", w = 1600, h = 800) {
  return enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><circle cx='${w * 0.85}' cy='${h * 0.15}' r='${h * 0.4}' fill='white' opacity='.10'/><circle cx='${w * 0.05}' cy='${h}' r='${h * 0.45}' fill='white' opacity='.08'/></svg>`,
  );
}
