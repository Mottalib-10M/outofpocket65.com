import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'covid', group: 'cover', order: 24,
  tool: { kind: 'est', props: { act: 'covid-test', acts: ['covid-test', 'office-visit', 'er-visit', 'hospital-stay'] } },
  mini: { kind: 'mini:covid' },
  related: ['part-b', 'what-covers', 'shingles', 'deductible', 'home'],
  sources: ['partb', 'pfs', 'opps', 'cms_fs2026'],
  acts: ['covid-test', 'office-visit', 'er-visit'],
  en: {
    slug: 'does-medicare-cover-covid-test', nav: 'COVID-19 test', card: 'A lab test ordered by your provider costs nothing; the visit, the emergency room and home tests are another story.',
    title: 'COVID-19 Test and Medicare 2026: When It Costs You Nothing',
    description: 'Medicare Part B covers FDA-authorized COVID-19 diagnostic lab tests ordered by a provider, usually at no cost. What the visit, the ER or a home test costs you.',
    h1: 'Does Medicare cover a COVID-19 test?',
    intro: 'Yes, a diagnostic lab test ordered by your doctor or other provider, under Part B. The estimator shows the test and lets you add the visits around it.',
    resume: (h) => {
      const ov = h.E('office-visit'); const er = h.E('er-visit');
      return `Medicare Part B covers COVID-19 diagnostic laboratory tests authorized by the FDA, the tests that check whether you have COVID-19. You usually pay nothing for the test when your doctor or other health care provider orders it and you get it from a laboratory, which can be at a pharmacy, a clinic or a doctor's office, or from a hospital that takes Medicare. The test is only one line of the bill, though. The visit where the provider examines you and orders it is a separate Part B service: a follow-up office visit approved at ${h.m(ov.approvedTotal)} nationally leaves you ${h.m(ov.youPay)} once the deductible is met, or the whole approved amount if your ${h.m(h.PB.deductible)} deductible is still open. Going to an emergency room instead brings a hospital copayment, ${h.m(er.youPay)} for a moderately severe visit at national rates. The medicare.gov coverage page describes lab tests ordered by a provider; a test you buy yourself at a store is not described there, so its price is yours. In a Medicare Advantage plan, check with the plan for any cost.`;
    },
    faqs: (h) => [
      { q: 'Do I need a doctor\'s order for Medicare to pay for a COVID-19 test?', a: 'For the cost-free coverage described by medicare.gov, yes: the test is covered at usually no cost when your doctor or other health care provider orders it and a laboratory or hospital that takes Medicare performs it. The laboratory can be located at a pharmacy, a clinic or a doctor\'s office. Ask the place doing the test whether it takes Medicare before the sample is taken.' },
      { q: 'What does a COVID-19 test cost in a Medicare Advantage plan?', a: 'It depends on the plan. Medicare.gov advises people in a Medicare Advantage plan to check with their plan for any out-of-pocket cost. A plan must cover at least what Original Medicare covers, but it sets its own copays and network rules. Select Medicare Advantage in the estimator and enter your plan\'s copay for a lab test to see the result.' },
      { q: 'Is the doctor visit to get tested free too?', a: `No, the visit follows the usual Part B rules: the deductible, then 20 % of the approved amount. A typical follow-up visit leaves you ${h.m(h.E('office-visit').youPay)} at national rates once the deductible is met, and ${h.m(h.E('office-visit', { deductibleRemaining: h.PB.deductible }).youPay)} if it is your first Part B bill of the year. The yearly wellness visit is different: it costs $0 with a provider who accepts assignment.` },
    ],
    body: (h) => {
      const ov = h.E('office-visit'); const ovD = h.E('office-visit', { deductibleRemaining: h.PB.deductible });
      const er = h.E('er-visit'); const erG = h.E('er-visit', { coverage: 'medigap', medigap: 'N' });
      const hs = h.E('hospital-stay', { count: 5 });
      return `
<h2>What the coverage includes</h2>
<p>The ${h.cov('covid-test', 'medicare.gov page on COVID-19 diagnostic laboratory tests')} states three things: Part B covers FDA-authorized COVID-19 diagnostic laboratory tests; you usually pay nothing when your doctor or other provider orders the test; and the test can be done by a laboratory, including one at a pharmacy, clinic or doctor's office, or by a hospital that takes Medicare. Medicare also covers other COVID-19 services, each on its own medicare.gov page: antibody tests, the vaccine, and monoclonal antibody treatments.</p>
<h2>The bill around the test</h2>
<p>A test rarely comes alone. Here is what each step can cost with Original Medicare at national rates of October 2026, with doctors and hospitals that accept assignment.</p>
${h.table(['Step', 'You pay, deductible met', 'You pay, first bill of the year'], [
  [h.label('covid-test'), h.m(h.E('covid-test').youPay), h.m(h.E('covid-test', { deductibleRemaining: h.PB.deductible }).youPay)],
  [h.label('office-visit'), h.m(ov.youPay), h.m(ovD.youPay)],
  [h.label('er-visit'), h.m(er.youPay), h.m(h.E('er-visit', { deductibleRemaining: h.PB.deductible }).youPay)],
  [`${h.label('hospital-stay')}, 5 days (Part A)`, h.m(hs.youPay), h.m(hs.youPay)],
], 'The hospital stay is billed under Part A: its deductible is separate from the Part B deductible.', ['l', 'r', 'r'])}
<p>The emergency room visit is the expensive door: a hospital copayment for the visit and for each hospital service, plus 20 % of the doctor's fee. A Medigap Plan N turns that into a copayment of up to ${h.m(h.P.medigap.planNCopayErMax)} when you are not admitted (${h.m(erG.youPay)} here), and no copayment is charged if you are admitted to the same hospital for a related condition within 3 days. A hospital admission costs the Part A deductible, ${h.m(h.PA.inpatientDeductible)} per benefit period in 2026.</p>
<!--tool:mini:covid-->
<h2>Medigap and the visits</h2>
<p>Since the lab test itself usually costs nothing, a Medigap policy matters for the visits around it. Plan G pays the 20 % of the office visit once the deductible is met, leaving ${h.m(h.E('office-visit', { coverage: 'medigap', medigap: 'G' }).youPay)}; Plan N pays it except a copayment of up to ${h.m(h.P.medigap.planNCopayOfficeMax)} for some office visits, ${h.m(h.E('office-visit', { coverage: 'medigap', medigap: 'N' }).youPay)} in our example. Plans C and F also pay the Part B deductible, but only people eligible for Medicare before January 1, 2020 can buy them.</p>
<h2>Tests you buy yourself</h2>
<p>The coverage page describes laboratory tests ordered by a provider. A test kit bought at a store or online without an order is not described on it, so count its price as yours unless your plan says otherwise. The calculator above adds both kinds: lab tests at the Part B cost and home tests at the price you type.</p>
<h2>Before the test</h2>
<p>Ask the provider how much the test, the visit and any other service will cost, and confirm that the laboratory or hospital takes Medicare. What you owe depends on any other insurance, on how much the doctor charges, on whether the doctor accepts assignment, on the type of facility and on where you get the service. Doctors may recommend services Medicare does not cover, or more often than it covers them; ask why a service is recommended and what Medicare will actually pay.</p>
<p>The estimator uses the 2026 Part B deductible. The 2027 amount is not published yet; CMS announces it in mid-November 2026.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-prueba-de-covid', nav: 'Prueba de COVID-19', card: 'La prueba de laboratorio indicada por su proveedor no cuesta nada; la consulta, urgencias y las pruebas caseras son otra cosa.',
    title: 'Prueba de COVID-19 y Medicare 2026: cuándo no le cuesta nada',
    description: 'La Parte B cubre la prueba de laboratorio de COVID-19 que pide un proveedor, casi siempre sin costo. Lo que cuestan la consulta, urgencias y la prueba casera.',
    h1: '¿Medicare cubre la prueba de COVID-19?',
    intro: 'Sí, la prueba diagnóstica de laboratorio que pide su médico u otro proveedor, con la Parte B. La calculadora muestra la prueba y le deja añadir las visitas que la rodean.',
    resume: (h) => {
      const ov = h.E('office-visit'); const er = h.E('er-visit');
      return `La Parte B de Medicare cubre las pruebas diagnósticas de laboratorio de COVID-19 autorizadas por la FDA, las que comprueban si usted tiene COVID-19. Por lo general no paga nada por la prueba cuando la pide su médico u otro proveedor de salud y se la hace un laboratorio, que puede estar en una farmacia, una clínica o un consultorio, o un hospital que acepta Medicare. Pero la prueba es solo una línea de la factura. La consulta en la que el proveedor le examina y la pide es otro servicio de la Parte B: una consulta de seguimiento con un monto aprobado nacional de ${h.m(ov.approvedTotal)} le deja ${h.m(ov.youPay)} con el deducible pagado, o el monto aprobado entero si su deducible de ${h.m(h.PB.deductible)} sigue pendiente. Ir a urgencias en su lugar añade un copago del hospital: ${h.m(er.youPay)} por una visita moderadamente grave a tarifas nacionales. La página de cobertura de medicare.gov describe las pruebas de laboratorio indicadas por un proveedor; una prueba que compra usted en una tienda no aparece allí, así que su precio corre por su cuenta. Con un plan Medicare Advantage, consulte a su plan si hay algún costo.`;
    },
    faqs: (h) => [
      { q: '¿Necesito una orden médica para que Medicare pague la prueba de COVID-19?', a: 'Para la cobertura sin costo que describe medicare.gov, sí: la prueba se cubre, por lo general sin costo, cuando su médico u otro proveedor la pide y la hace un laboratorio o un hospital que acepta Medicare. El laboratorio puede estar en una farmacia, una clínica o un consultorio. Pregunte en el lugar de la prueba si acepta Medicare antes de que le tomen la muestra.' },
      { q: '¿Cuánto cuesta una prueba de COVID-19 con un plan Medicare Advantage?', a: 'Depende del plan. Medicare.gov aconseja a las personas con un plan Medicare Advantage consultar a su plan si hay costos de bolsillo. El plan debe cubrir al menos lo que cubre Medicare Original, pero fija sus propios copagos y reglas de red. Elija Medicare Advantage en la calculadora y escriba el copago de su plan para una prueba de laboratorio para ver el resultado.' },
      { q: '¿La consulta médica para hacerse la prueba también es gratis?', a: `No, la consulta sigue las reglas normales de la Parte B: el deducible y luego el 20 % del monto aprobado. Una consulta de seguimiento típica le deja ${h.m(h.E('office-visit').youPay)} a tarifas nacionales con el deducible pagado, y ${h.m(h.E('office-visit', { deductibleRemaining: h.PB.deductible }).youPay)} si es su primera factura de la Parte B del año. La visita anual de bienestar es distinta: cuesta 0 $ con un proveedor que acepta la asignación.` },
    ],
    body: (h) => {
      const ov = h.E('office-visit'); const ovD = h.E('office-visit', { deductibleRemaining: h.PB.deductible });
      const er = h.E('er-visit'); const erG = h.E('er-visit', { coverage: 'medigap', medigap: 'N' });
      const hs = h.E('hospital-stay', { count: 5 });
      return `
<h2>Lo que incluye la cobertura</h2>
<p>La ${h.cov('covid-test', 'página de medicare.gov sobre las pruebas de laboratorio de COVID-19')} dice tres cosas: la Parte B cubre las pruebas diagnósticas de laboratorio de COVID-19 autorizadas por la FDA; por lo general usted no paga nada cuando su médico u otro proveedor pide la prueba; y la prueba puede hacerla un laboratorio, también uno situado en una farmacia, una clínica o un consultorio, o un hospital que acepta Medicare. Medicare cubre además otros servicios de COVID-19, cada uno con su página en medicare.gov: las pruebas de anticuerpos, la vacuna y los tratamientos con anticuerpos monoclonales.</p>
<h2>La factura alrededor de la prueba</h2>
<p>Una prueba rara vez llega sola. Esto es lo que puede costar cada paso con Medicare Original, a tarifas nacionales de octubre de 2026, con médicos y hospitales que aceptan la asignación.</p>
${h.table(['Paso', 'Usted paga, deducible pagado', 'Usted paga, primera factura del año'], [
  [h.label('covid-test'), h.m(h.E('covid-test').youPay), h.m(h.E('covid-test', { deductibleRemaining: h.PB.deductible }).youPay)],
  [h.label('office-visit'), h.m(ov.youPay), h.m(ovD.youPay)],
  [h.label('er-visit'), h.m(er.youPay), h.m(h.E('er-visit', { deductibleRemaining: h.PB.deductible }).youPay)],
  [`${h.label('hospital-stay')}, 5 días (Parte A)`, h.m(hs.youPay), h.m(hs.youPay)],
], 'La hospitalización se factura a la Parte A: su deducible es distinto del de la Parte B.', ['l', 'r', 'r'])}
<p>Urgencias es la puerta cara: un copago del hospital por la visita y por cada servicio del hospital, más el 20 % de los honorarios del médico. Un Medigap Plan N lo convierte en un copago de hasta ${h.m(h.P.medigap.planNCopayErMax)} cuando no lo ingresan (${h.m(erG.youPay)} aquí), y no se cobra copago si lo ingresan en el mismo hospital por una afección relacionada dentro de 3 días. Un ingreso cuesta el deducible de la Parte A, ${h.m(h.PA.inpatientDeductible)} por período de beneficios en 2026.</p>
<!--tool:mini:covid-->
<h2>Medigap y las consultas</h2>
<p>Como la prueba de laboratorio no suele costar nada, una póliza Medigap cuenta sobre todo para las consultas que la rodean. El plan G paga el 20 % de la consulta una vez pagado el deducible y le deja ${h.m(h.E('office-visit', { coverage: 'medigap', medigap: 'G' }).youPay)}; el plan N lo paga salvo un copago de hasta ${h.m(h.P.medigap.planNCopayOfficeMax)} en algunas consultas, ${h.m(h.E('office-visit', { coverage: 'medigap', medigap: 'N' }).youPay)} en nuestro ejemplo. Los planes C y F pagan además el deducible de la Parte B, pero solo pueden comprarlos quienes tuvieron derecho a Medicare antes del 1 de enero de 2020.</p>
<h2>Las pruebas que compra usted</h2>
<p>La página de cobertura describe las pruebas de laboratorio indicadas por un proveedor. Un kit comprado en una tienda o por internet sin orden no aparece en ella, así que cuente su precio como suyo salvo que su plan diga otra cosa. La calculadora de arriba suma los dos tipos: las pruebas de laboratorio al costo de la Parte B y las caseras al precio que usted escribe.</p>
<h2>Antes de la prueba</h2>
<p>Pregunte al proveedor cuánto costarán la prueba, la consulta y cualquier otro servicio, y confirme que el laboratorio o el hospital acepta Medicare. Lo que usted debe depende de su otro seguro, de cuánto cobra el médico, de si acepta la asignación, del tipo de centro y del lugar donde recibe el servicio. Los médicos pueden recomendar servicios que Medicare no cubre, o con más frecuencia de la que los cubre; pregunte por qué se recomienda un servicio y qué pagará de verdad Medicare.</p>
<p>La calculadora usa el deducible de la Parte B de 2026. El monto de 2027 aún no se ha publicado; CMS lo anuncia a mediados de noviembre de 2026.</p>`;
    },
  },
});
