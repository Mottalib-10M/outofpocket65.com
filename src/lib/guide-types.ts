/**
 * One page = ONE data file in `src/content/pages/<id>.ts`, English and Spanish. How to add a page:
 * CONTRIBUTING-PAGES.md at the repository root.
 */
import type { Helpers } from './helpers';

export type Lang = 'en' | 'es';
export type Group = 'cover' | 'basics';
export interface FAQ { q: string; a: string }
/** `est` (the cost estimator, props = EstimatorProps) or `mini:<spec>` from `lib/mini-specs.ts`. */
export interface ToolDef { kind: string; props?: Record<string, unknown> }
export interface PageText {
  slug: string; nav: string; card: string;
  /** 50–60 characters, key term first (RECETTE §11). */
  title: string;
  /** 150–160 characters. */
  description: string;
  h1: string; intro: string;
  /** Citable block, ONE paragraph of 130 words or more (RECETTE §21), shown folded after its first sentence. */
  resume: (h: Helpers) => string;
  faqs: (h: Helpers) => FAQ[];
  /** HTML with `<h2>` sections; `<!--tool:mini:spec-->` places a mini-tool between paragraphs. */
  body: (h: Helpers) => string;
}
export interface PageDef {
  id: string; group: Group; order: number;
  tool: ToolDef; mini?: ToolDef;
  related: string[];
  /** Keys of `data/params-2026.json` sources; the coverage page of each act is added from `acts`. */
  sources: string[];
  /** Acts whose medicare.gov coverage page is cited. */
  acts?: string[];
  en: PageText; es: PageText;
}
export const definePage = (g: PageDef): PageDef => g;
