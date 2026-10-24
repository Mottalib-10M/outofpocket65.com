/** Formatting by page language (RECETTE §4: one locale per language, never one per site). */
const TAG = { en: 'en-US', es: 'es-US' } as const;
export type L = keyof typeof TAG;
const cache = new Map<string, Intl.NumberFormat>();
function nf(lang: L, o: Intl.NumberFormatOptions) {
  const k = lang + JSON.stringify(o);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(TAG[lang], o));
  return cache.get(k)!;
}
export const formatNumberL = (v: number, lang: L, d = 0) => nf(lang, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
/** Dollars: whole dollars unless the official fee has cents ($32.50 stays $32.50). */
export const money = (v: number, lang: L) => {
  const cents = Math.round(v * 100) % 100 !== 0;
  const s = nf(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).format(v);
  return lang === 'es' ? s.replace(/^US\$/, '$').replace(/\s?US\$$/, ' $') : s;
};
export const pct = (v: number, lang: L, d = 0) => nf(lang, { style: 'percent', minimumFractionDigits: d, maximumFractionDigits: d }).format(v).replace(/(\d)\s%/, '$1\u00a0%'); // Intl fait foi : « 20% » en anglais (2026-10-24)
/** "2026-10-22" → "October 22, 2026" / "22 de octubre de 2026" (UTC, never shifts a day). */
export const dateL = (iso: string, lang: L) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(TAG[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** Calculator results: whole dollars, never cents on screen (RECETTE §4.1). */
export const usd = (v: number, lang: L) => nf(lang, { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(v));
/** Official amounts cited in a text keep their cents ($33.4009 stays as published, $281.71 too). */
export const usdExact = (v: number, lang: L) => money(v, lang);
