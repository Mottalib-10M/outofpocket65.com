/** Writing helpers handed to every page: links, figures computed by the engine, tables, sources. No figure is typed in a page. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { estimate, ruleOf, actById, dmeFee, LOCALITIES, STATES, STATE_NAMES, localitiesOf, defaultLocality, CF, PART_A, PART_B, PARAMS, type EstimateInput } from './estimate';
import { formatNumberL, money, pct, dateL, usd } from './format-l';
import P27 from '../data/params-2027.json';
import PFS from '../data/cms/pfs.json';
import OPPS from '../data/cms/opps.json';
import DME from '../data/cms/dmepos.json';

export type SourceKey = keyof typeof PARAMS.sources;
const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = [], lang: Locale = 'en') {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumberL(c, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function helpers(lang: Locale, strict = false) {
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict && !process.env.PAGES_DRAFT) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, lang)}">${text}</a>`;
  };
  const ext = (url: string, text: string) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`;
  const src = (k: SourceKey, text: string) => ext(PARAMS.sources[k].url, text);
  /** Link to the medicare.gov coverage page of an act. */
  const cov = (act: string, text: string) => ext(ruleOf(act).src, text);
  /** Whole dollars (calculated amounts). */
  const m = (n: number) => usd(n, lang);
  /** Official amounts with their cents ($281.71, $33.4009 stays a number). */
  const mx = (n: number) => money(n, lang);
  const num = (n: number, d = 0) => formatNumberL(n, lang, d);
  const pc = (x: number, d = 0) => pct(x, lang, d);
  /** Estimate with Original Medicare, national rates, deductible already met unless said otherwise. */
  const E = (act: string, o: Partial<EstimateInput> = {}) => estimate({ act, deductibleRemaining: 0, ...o });
  const loc = (re: RegExp) => { const l = LOCALITIES.find((x) => re.test(x.name)); if (!l) throw new Error(`locality ${re}`); return l.key; };
  const stateName = (s: string) => STATE_NAMES[s][lang];
  const label = (act: string) => actById(act).label[lang];
  return {
    lang, es: lang === 'es', a, ext, src, cov, m, mx, num, pc, E, loc, stateName, label,
    table: (h: string[], r: Array<Array<string | number>>, c?: string, al: Array<'l' | 'r'> = []) => table(h, r, c, al, lang),
    date: (iso: string) => dateL(iso, lang),
    rule: ruleOf, dmeFee, LOCALITIES, STATES, localitiesOf, defaultLocality,
    CF, PA: PART_A, PB: PART_B, P: PARAMS, P27, PFS, OPPS, DME,
  };
}
export type Helpers = ReturnType<typeof helpers>;
