/** Mini-tools (RECETTE §9.3). Each subject is described once in `lib/mini-specs.ts`, in both languages. */
export interface MiniInput { id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; options?: Array<{ value: string; label: string }> }
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string }
export interface MiniSpec { title: string; cta: string; ctaPage?: string; inputs: MiniInput[]; run: (v: Record<string, number>) => MiniOut }
