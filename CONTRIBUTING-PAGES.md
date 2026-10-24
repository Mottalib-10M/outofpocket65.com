# Adding or editing a page

One page = one file `src/content/pages/<id>.ts` exporting `definePage({...})` (types in
`src/lib/guide-types.ts`). The file name must equal `id`. Model: `cataract.ts`. The page is built at
`/en/<en.slug>/` and `/es/<es.slug>/`; hreflang, menus, home lists and sitemap follow by themselves.
Every page exists in English and Spanish.

## Fields

- `group`: `cover` ("Does Medicare cover X?") or `basics` (what Medicare covers, Part B, deductible).
- `order`: position in its group.
- `tool`: the main tool, shown under the H1 (first screen). `{ kind: 'est', props: {...} }` is the cost
  estimator (`src/components/calc/Estimator.tsx`). Props: `act` (default service), `acts` (services offered
  in its menu), `setting` (`office` | `asc` | `hopd` | `inpatient`), `state` (two letters), `count`
  (sessions, days, months, treatments), `miles`, `price`, `coverage` (`original` | `medigap` | `advantage`),
  `medigap` (letter), `deductibleRemaining`, `partD` (boolean), `crcYear` (2026 | 2027).
  Service ids: `scripts/acts.config.mjs`.
- `mini`: a second, smaller tool under the citable block. Specs in `src/lib/mini-specs.ts`
  (`deductible`, `twenty`, `kx`, `rental`, `snfDays`, `hospitalDays`, `polyp`, `dialysisMonth`, `hospiceRx`,
  `acuCap`, `hearing`, `dental`, `glasses`, `ambMiles`, `mriPlace`, `mammo`, `eyeExam`, `medigap`, `shingles`,
  `basket`, `homeHealth`, `chiro`, `knee`, `cataractTwo`, `nailCare`, `wheelchair`, `covid`).
  In a body, `<!--tool:mini:spec-->` places a mini-tool between paragraphs.
- `related`: 4–6 page ids (`home` allowed). `sources`: keys of `src/data/params-2026.json` → `sources`.
  `acts`: services whose medicare.gov coverage page is cited automatically.

## Text rules (checked by `npx vitest run tests/pages.test.ts`, then `npm run check`)

- `title` 50–60 characters, key term first ("Hearing Aids and Medicare 2026: …"), never "What…", "How…",
  "¿…", "Calculator…". `description` 150–160 characters.
- `resume(h)`: ONE paragraph, at least 130 words, answering the page's question with figures; shown folded
  after its first sentence.
- `faqs(h)`: 3–5 questions unique to the page (never the same question on two pages), answers 40–90 words.
- `body(h)`: HTML with `<h2>` sections, 450+ words. No `<h1>`. No em dash (—) anywhere.
- Every page reads differently: `check-unique` fails above 30 % shared text between two pages. Choose
  sections whose vocabulary is specific to the service; do not reuse sentence templates across pages.
- Never write a figure by hand. Amounts come from the helpers: `h.E(act, {...})` runs the estimator
  (national rates, deductible met unless `deductibleRemaining` is given) and returns `approvedTotal`,
  `lines[i].approved`, `youPay`, `deductiblePart`, `coinsurancePart`, `partADeductible`, `extra`;
  `h.PB.deductible` (Part B deductible 2026), `h.PA` (Part A amounts), `h.P` (all 2026 parameters, Medigap
  plans, KX threshold, ESRD rate, hospice copay), `h.P27` (2027: only the colorectal share is published),
  `h.dmeFee(code, mod, state)`, `h.loc(/^Manhattan$/)` (locality key), `h.defaultLocality('AL')`.
  Formatting: `h.m` whole dollars, `h.mx` official amount with cents, `h.pc` percent, `h.num`.
  Links: `h.a(id, text)` internal page, `h.src(key, text)` official source, `h.cov(act, text)` medicare.gov
  coverage page, `h.ext(url, text)` other official page (.gov, ecfr.gov only). `h.table(headers, rows, caption, align)`.
- 2027 Part A/B amounts are not published yet (CMS fact sheet expected mid-November 2026): say so, never
  project them.
- Coverage facts come from the medicare.gov pages saved in `raw/mgov/*.txt` and `src/data/coverage.json`.
  Nothing from memory, blogs or insurers.
- Neutral, factual: cost information, never medical advice, never "you should get". No insurer, agent,
  plan name or affiliate link. Never mention Google, search results or any other website as a competitor.
- English: American spelling. Spanish: neutral US Spanish ("usted", "deducible", "coseguro", "copago",
  "monto aprobado"), written for a Spanish-speaking person on Medicare, not word for word. Percent with a
  space (`20 %`).
- AMA licence: never write a CPT code number or a CPT descriptor. HCPCS level II codes (A0429, E0601,
  K0001, V2020, G0121…) may appear.
