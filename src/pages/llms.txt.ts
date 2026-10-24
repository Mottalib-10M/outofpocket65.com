/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { ACTS, LOCALITIES, PART_B } from '../lib/estimate';
export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Medicare out-of-pocket cost estimates in dollars for ${ACTS.length} services, in English and Spanish: the Medicare-approved amount, the Part B deductible ($${PART_B.deductible} in 2026), the 20 % coinsurance or hospital outpatient copayment, the limiting charge, and what a Medigap plan or the user's own Medicare Advantage copays change. Built from the public CMS files of October 2026 (physician fee schedule RVU26D with ${LOCALITIES.length} localities, OPPS Addendum B, ASC Addendum AA, DMEPOS DME26-D by state, ambulance fee schedule CY 2026) and the medicare.gov coverage page of each service. 2027 Part A and B amounts are not published yet and are not projected. Last updated ${LAST_UPDATED}. Published by Radif Partners, an independent publisher; not affiliated with CMS or Medicare.gov; no plan sold, no lead form, no medical advice.`,
    '',
    '## Does Medicare cover it? (English)',
    `- [Medicare out-of-pocket cost estimator](${SITE_URL}${route('home', 'en')}): one service, your area, your coverage.`,
    ...[...PAGES].sort((a, b) => (a.group === b.group ? a.order - b.order : a.group === 'basics' ? -1 : 1)).map((p) => `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`),
    '',
    '## En español',
    `- [Calculadora de costos de Medicare](${SITE_URL}${route('home', 'es')})`,
    ...PAGES.filter((p) => p.es).map((p) => `- [${p.es!.nav}](${SITE_URL}${route(p.id, 'es')}): ${p.es!.card}`),
    '',
    '## Method',
    `- [How the costs are calculated](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
