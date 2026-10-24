/**
 * Editorial guard for every page of src/content/pages (RECETTE §7, §11, §21): run before the build so
 * a writer sees the defect on the page that has it. `npx vitest run tests/pages.test.ts`
 * (one page: PAGE=cataract npx vitest run tests/pages.test.ts).
 */
import { describe, it, expect } from 'vitest';
import { PAGES } from '../src/lib/guides';
import { helpers } from '../src/lib/helpers';
import { SPEC_KINDS } from '../src/lib/mini-specs';
import { actById } from '../src/lib/estimate';

const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const only = process.env.PAGE;
const list = PAGES.filter((p) => !only || p.id === only);

describe.each(list.map((p) => [p.id, p] as const))('%s', (_id, p) => {
  for (const lang of ['en', 'es'] as const) {
    const T = p[lang];
    const h = helpers(lang, true);
    it(`${lang}: title 50-60, description 150-160, no em dash`, () => {
      expect(T.title.length, T.title).toBeGreaterThanOrEqual(50); expect(T.title.length, T.title).toBeLessThanOrEqual(60);
      expect(T.description.length, T.description).toBeGreaterThanOrEqual(150); expect(T.description.length, T.description).toBeLessThanOrEqual(160);
      expect(/^(how|what|when|why|calculator|¿|qué|cómo|cuánto|calculadora|about|faq)\b/i.test(T.title), 'title opens with the key term, never a question or tool word').toBe(false);
      const all = [T.title, T.description, T.h1, T.intro, T.resume(h), T.body(h), ...T.faqs(h).flatMap((f) => [f.q, f.a])].join(' ');
      expect(all.includes('—'), 'em dash').toBe(false);
      expect(/undefined|NaN|\[object/.test(all), 'template marker').toBe(false);
    });
    it(`${lang}: citable block of 130+ words in one paragraph`, () => {
      const r = T.resume(h);
      expect(words(r)).toBeGreaterThanOrEqual(130);
      expect(/<p|<\/p>|\n\n/.test(r)).toBe(false);
    });
    it(`${lang}: 3 to 5 FAQ, answers 40-90 words`, () => {
      const f = T.faqs(h);
      expect(f.length).toBeGreaterThanOrEqual(3); expect(f.length).toBeLessThanOrEqual(5);
      for (const x of f) { const n = words(x.a); expect(n, x.q).toBeGreaterThanOrEqual(40); expect(n, x.q).toBeLessThanOrEqual(90); }
    });
    it(`${lang}: body of 450+ words with h2 sections, no h1, known tools`, () => {
      const b = T.body(h);
      expect(words(b)).toBeGreaterThanOrEqual(450);
      expect(b.includes('<h2')).toBe(true);
      expect(b.includes('<h1')).toBe(false);
      for (const m of b.matchAll(/<!--tool:mini:([a-zA-Z0-9]+)/g)) expect(SPEC_KINDS).toContain(m[1]);
    });
  }
  it('tool and mini exist', () => {
    if (p.tool.kind === 'est') { const pr = p.tool.props as { act?: string; acts?: string[] }; for (const a of [pr.act, ...(pr.acts ?? [])].filter(Boolean)) expect(() => actById(a as string)).not.toThrow(); }
    if (p.mini) expect(SPEC_KINDS).toContain(p.mini.kind.slice(5));
  });
});

describe('site-wide', () => {
  it('no FAQ question appears on two pages', () => {
    const seen = new Map<string, string>();
    for (const p of PAGES) for (const lang of ['en', 'es'] as const) for (const f of p[lang].faqs(helpers(lang))) {
      const k = f.q.toLowerCase().trim();
      expect(seen.get(k), `${f.q} (${p.id})`).toBeUndefined();
      seen.set(k, p.id);
    }
  });
  it('titles and descriptions are unique', () => {
    const t = PAGES.flatMap((p) => [p.en.title, p.es.title]); const d = PAGES.flatMap((p) => [p.en.description, p.es.description]);
    expect(new Set(t).size).toBe(t.length); expect(new Set(d).size).toBe(d.length);
  });
});
