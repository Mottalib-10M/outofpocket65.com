import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';
import { PART_B } from '../../lib/estimate';

/** A year that starts with three bills: each one eats part of the deductible. */
const year = (h: Helpers) => {
  const steps: Array<[string, Record<string, unknown>]> = [['office-visit', {}], ['mri-lumbar', { setting: 'office' }], ['physical-therapy-eval', {}], ['physical-therapy-session', { count: 4 }]];
  let left = h.PB.deductible; let total = 0;
  const rows = steps.map(([a, o]) => {
    const e = h.E(a, { ...o, deductibleRemaining: left } as never);
    const before = left; left = e.deductibleRemainingAfter; total += e.youPay;
    return { a, e, before, after: left };
  });
  return { rows, total };
};

export default definePage({
  id: 'deductible', group: 'basics', order: 4,
  tool: { kind: 'est', props: { act: 'mri-lumbar', setting: 'office', deductibleRemaining: PART_B.deductible, acts: ['mri-lumbar', 'office-visit', 'physical-therapy-session', 'cataract-surgery', 'knee-replacement', 'colonoscopy-diagnostic', 'cpap'] } },
  mini: { kind: 'mini:deductible' },
  related: ['part-b', 'what-covers', 'colonoscopy', 'cataract', 'home'],
  sources: ['cms_fs2026', 'partb', 'medigap', 'cfr410_152'],
  acts: ['office-visit'],
  en: {
    slug: 'medicare-part-b-deductible', nav: 'Part B deductible', card: 'The 2026 deductible, how your first bills of the year use it, and which services skip it.',
    title: 'Medicare Part B Deductible 2026: How Your First Bills Use It',
    description: 'The 2026 Medicare Part B deductible, bill by bill: how your first claims of the year use it up, which services skip it, which Medigap plans pay it, and 2027.',
    h1: 'The Medicare Part B deductible: how it works in 2026',
    intro: 'Before Part B pays its 80 %, you pay the yearly deductible. Leave the deductible field at its full amount to price a first bill of the year, or set it to zero for a bill later on.',
    resume: (h) => {
      const y = year(h);
      return `The Part B deductible is ${h.m(h.PB.deductible)} in 2026: once per calendar year, you pay the Medicare-approved amount of your Part B services in full until your payments reach that sum, and only then does Medicare start paying 80 %. It is counted on approved amounts, not on what a doctor lists as the charge, and it starts again at zero each January 1. A year that opens with a follow-up visit (${h.m(y.rows[0].e.approvedTotal)} approved) and a lower back MRI at an imaging center uses up the whole deductible on those two bills; the physical therapy that follows is billed at 20 % from the first session. Several services never touch it: most preventive services, which cost $0 with a provider who accepts assignment, a screening colonoscopy that turns into polyp removal, and Part B-covered insulin used in a pump. Among Medigap policies, only Plans C and F pay the deductible, and only people eligible for Medicare before January 1, 2020 can buy them. The 2027 amount is not published yet; CMS announces it in mid-November 2026.`;
    },
    faqs: (h) => [
      { q: 'Does the Part B deductible reset every January?', a: `Yes. It runs on the calendar year, not on your enrollment date: whatever you paid toward it in 2026 stops counting on January 1, 2027, and the new year's amount starts from zero. That is why a procedure planned for late December can cost you less than the same one in early January, when the ${h.m(h.PB.deductible)} has to be paid again first.` },
      { q: 'Is the Part B deductible the same as the Part A deductible?', a: `No. The Part B deductible, ${h.m(h.PB.deductible)} in 2026, is paid once a year on doctor and outpatient bills. The Part A deductible, ${h.m(h.PA.inpatientDeductible)} in 2026, is paid for each benefit period on an inpatient hospital stay, so it can come back more than once in the same year. Neither one counts toward the other.` },
      { q: 'Which Medigap plans pay the Part B deductible?', a: `Only Plans C and F, and they are closed to anyone who became eligible for Medicare on or after January 1, 2020. Plan G pays the same benefits as F except this deductible, and Plan D the same as C except it. With G or D, the first ${h.m(h.PB.deductible)} of Part B approved amounts each year stays with you.` },
      { q: 'Do I pay the deductible for a free preventive visit?', a: `No. Preventive services with no cost sharing, such as the yearly wellness visit or a screening mammogram, are paid in full by Medicare when the provider accepts assignment, and they do not draw on your deductible. If a test or treatment is added during the same visit, that extra service follows the normal rules and can use part of the ${h.m(h.PB.deductible)}.` },
    ],
    body: (h) => {
      const y = year(h);
      const t = y.rows.map((r) => [h.label(r.a), h.m(r.e.approvedTotal), h.m(r.e.deductiblePart), h.m(r.e.coinsurancePart), h.m(r.e.youPay), h.m(r.after)]);
      const kneeJan = h.E('knee-replacement', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const kneeJun = h.E('knee-replacement', { setting: 'hopd' });
      return `
<h2>One year of bills, step by step</h2>
<p>The deductible is not a fee you send to Medicare. It is the first slice of the approved amounts you are billed, taken in the order your claims are processed. The table follows one person through the first weeks of 2026, at national rates, with doctors who accept assignment.</p>
${h.table(['Bill', 'Approved', 'Deductible', '20 % part', 'You pay', 'Deductible left'], t, `Starting with the full ${h.m(h.PB.deductible)} deductible on January 1, 2026.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The first two bills absorb the deductible, and the second one is split: part of it goes to the deductible and the rest is charged at 20 %. From the therapy evaluation onwards, every bill is 20 % of the approved amount. Over these bills you pay ${h.m(y.total)} in all.</p>
<h2>Timing a planned procedure</h2>
<p>For a large bill, the deductible changes the total by its full amount. An outpatient knee replacement in a hospital leaves you ${h.m(kneeJan.youPay)} when it is the first Part B claim of the year, and ${h.m(kneeJun.youPay)} once the deductible has already been met by other care. Medical needs come first, but when the date is flexible, the calendar year matters.</p>
<!--tool:mini:deductible-->
<h2>Services that skip the deductible</h2>
<ul>
<li><strong>Preventive services with no cost sharing</strong>, such as the yearly wellness visit, screening mammograms and screening colonoscopies, when the provider accepts assignment.</li>
<li><strong>A screening colonoscopy that becomes polyp removal</strong>: you pay ${h.pc(h.P.crcScreeningConversion.patientShare)} of the approved amount in 2026 with no deductible, under ${h.src('cfr410_152', '42 CFR 410.152')}. The share falls to ${h.pc(h.P27.crcScreeningConversion.patientShare)} in 2027.</li>
<li><strong>Part B-covered insulin used in a pump</strong>: at most ${h.m(h.P.partB.insulinMonthMax)} for a month's supply, deductible not applied.</li>
<li><strong>Home health visits and hospice care</strong>, which cost nothing for covered services; a hospice drug copay of up to ${h.m(h.P.hospice.drugCopayMax)} per prescription can apply.</li>
</ul>
<h2>Medigap and the deductible</h2>
<p>The standardized Medigap chart has a column for the Part B deductible, and only two letters fill it: C and F. If you became eligible for Medicare on or after January 1, 2020, you cannot buy either; Plans D and G give the same benefits except the deductible. High-deductible versions of F and G exist in some states: you pay up to ${h.m(h.P.medigap.highDeductibleFG)} in 2026 of deductibles, coinsurance and copayments before the policy pays anything. Plans K and L pay 100 % of covered services for the rest of the year once you reach their out-of-pocket limit and the yearly Part B deductible.</p>
<h2>Medicare Advantage</h2>
<p>A Medicare Advantage plan applies its own cost sharing in place of the Part B deductible and 20 %, as written in its Summary of Benefits. In the estimator, choose Medicare Advantage and type your plan's figures.</p>
<h2>The 2027 deductible</h2>
<p>CMS has not published the 2027 Part B deductible. It appears each year in the fact sheet on Part A and Part B premiums and deductibles, expected in mid-November 2026. We do not estimate it in advance; the amounts on this page will change when the official figure is out.</p>`;
    },
  },
  es: {
    slug: 'deducible-de-la-parte-b', nav: 'Deducible de la Parte B', card: 'El deducible de 2026, cómo lo consumen sus primeras facturas y qué servicios no lo usan.',
    title: 'Deducible de la Parte B de Medicare 2026: cómo se aplica',
    description: 'El deducible de la Parte B de 2026, factura por factura: cómo lo consumen sus primeras facturas, qué servicios no lo usan, qué Medigap lo paga y el de 2027.',
    h1: 'El deducible de la Parte B de Medicare en 2026',
    intro: 'Antes de que la Parte B pague su 80 %, usted paga el deducible anual. Deje el deducible completo para calcular la primera factura del año, o póngalo en cero para una factura posterior.',
    resume: (h) => {
      const y = year(h);
      return `El deducible de la Parte B es de ${h.m(h.PB.deductible)} en 2026: una vez por año calendario, usted paga entero el monto aprobado por Medicare de sus servicios de la Parte B hasta que sus pagos lleguen a esa suma, y solo entonces Medicare empieza a pagar el 80 %. Se cuenta sobre los montos aprobados, no sobre lo que el médico pone como precio, y vuelve a cero cada 1 de enero. Un año que empieza con una consulta de seguimiento (${h.m(y.rows[0].e.approvedTotal)} aprobados) y una resonancia lumbar en un centro de imágenes agota el deducible con esas dos facturas; la fisioterapia que sigue se cobra al 20 % desde la primera sesión. Varios servicios nunca lo tocan: la mayoría de los servicios preventivos, que cuestan 0 $ con un proveedor que acepta la asignación, la colonoscopia de detección que termina en extirpación de pólipos y la insulina de bomba cubierta por la Parte B. Entre las pólizas Medigap, solo los planes C y F pagan el deducible, y solo pueden comprarlos quienes tuvieron derecho a Medicare antes del 1 de enero de 2020. El monto de 2027 aún no se publica; CMS lo anuncia a mediados de noviembre de 2026.`;
    },
    faqs: (h) => [
      { q: '¿El deducible de la Parte B vuelve a empezar cada enero?', a: `Sí. Sigue el año calendario, no la fecha en que usted se inscribió: lo pagado en 2026 deja de contar el 1 de enero de 2027, y el monto del nuevo año empieza desde cero. Por eso un procedimiento programado a finales de diciembre puede costarle menos que el mismo a principios de enero, cuando hay que volver a pagar primero los ${h.m(h.PB.deductible)}.` },
      { q: '¿El deducible de la Parte B es el mismo que el de la Parte A?', a: `No. El de la Parte B, ${h.m(h.PB.deductible)} en 2026, se paga una vez al año sobre las facturas de médicos y atención ambulatoria. El de la Parte A, ${h.m(h.PA.inpatientDeductible)} en 2026, se paga por cada período de beneficios en una hospitalización, así que puede repetirse en el mismo año. Ninguno cuenta para el otro.` },
      { q: '¿Qué planes Medigap pagan el deducible de la Parte B?', a: `Solo los planes C y F, que están cerrados para quien tuvo derecho a Medicare a partir del 1 de enero de 2020. El plan G da los mismos beneficios que el F salvo este deducible, y el plan D los mismos que el C salvo el deducible. Con G o D, los primeros ${h.m(h.PB.deductible)} de montos aprobados de la Parte B de cada año siguen a su cargo.` },
      { q: '¿Pago el deducible en una visita preventiva gratuita?', a: `No. Los servicios preventivos sin costo compartido, como la visita anual de bienestar o la mamografía de detección, los paga Medicare por completo si el proveedor acepta la asignación, y no consumen su deducible. Si en la misma visita se añade una prueba o un tratamiento, ese servicio adicional sigue las reglas normales y puede usar parte de los ${h.m(h.PB.deductible)}.` },
    ],
    body: (h) => {
      const y = year(h);
      const t = y.rows.map((r) => [h.label(r.a), h.m(r.e.approvedTotal), h.m(r.e.deductiblePart), h.m(r.e.coinsurancePart), h.m(r.e.youPay), h.m(r.after)]);
      const kneeJan = h.E('knee-replacement', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const kneeJun = h.E('knee-replacement', { setting: 'hopd' });
      return `
<h2>Un año de facturas, paso a paso</h2>
<p>El deducible no es una cuota que se envía a Medicare. Es la primera parte de los montos aprobados que le facturan, en el orden en que se tramitan sus reclamaciones. La tabla sigue a una persona durante las primeras semanas de 2026, a tarifas nacionales, con médicos que aceptan la asignación.</p>
${h.table(['Factura', 'Aprobado', 'Deducible', 'Parte del 20 %', 'Usted paga', 'Deducible restante'], t, `Con el deducible completo de ${h.m(h.PB.deductible)} el 1 de enero de 2026.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Las dos primeras facturas absorben el deducible, y la segunda se reparte: una parte va al deducible y el resto se cobra al 20 %. Desde la evaluación de fisioterapia, cada factura es el 20 % del monto aprobado. En total, por estas facturas usted paga ${h.m(y.total)}.</p>
<h2>Elegir la fecha de un procedimiento programado</h2>
<p>En una factura grande, el deducible cambia el total en todo su monto. Un reemplazo de rodilla ambulatorio en un hospital le deja ${h.m(kneeJan.youPay)} si es la primera reclamación de la Parte B del año, y ${h.m(kneeJun.youPay)} si otra atención ya cubrió el deducible. La necesidad médica va primero, pero cuando la fecha es flexible, el año calendario cuenta.</p>
<!--tool:mini:deductible-->
<h2>Servicios que no pasan por el deducible</h2>
<ul>
<li><strong>Servicios preventivos sin costo compartido</strong>, como la visita anual de bienestar, la mamografía de detección y la colonoscopia de detección, si el proveedor acepta la asignación.</li>
<li><strong>Una colonoscopia de detección que termina en extirpación de pólipos</strong>: usted paga el ${h.pc(h.P.crcScreeningConversion.patientShare)} del monto aprobado en 2026, sin deducible, según el ${h.src('cfr410_152', '42 CFR 410.152')}. La parte baja al ${h.pc(h.P27.crcScreeningConversion.patientShare)} en 2027.</li>
<li><strong>La insulina de bomba cubierta por la Parte B</strong>: como máximo ${h.m(h.P.partB.insulinMonthMax)} por el suministro de un mes, sin deducible.</li>
<li><strong>Las visitas de salud en el hogar y los cuidados paliativos</strong>, que no cuestan nada por los servicios cubiertos; en paliativos puede haber un copago de hasta ${h.m(h.P.hospice.drugCopayMax)} por receta.</li>
</ul>
<h2>Medigap y el deducible</h2>
<p>El cuadro de los planes Medigap estandarizados tiene una columna para el deducible de la Parte B, y solo dos letras la cubren: C y F. Si tuvo derecho a Medicare a partir del 1 de enero de 2020, no puede comprar ninguno de los dos; los planes D y G dan los mismos beneficios salvo el deducible. En algunos estados existen versiones de deducible alto de F y G: usted paga hasta ${h.m(h.P.medigap.highDeductibleFG)} en 2026 de deducibles, coseguros y copagos antes de que la póliza pague algo. Los planes K y L pagan el 100 % de los servicios cubiertos el resto del año una vez alcanzado su límite de gastos y el deducible anual de la Parte B.</p>
<h2>Medicare Advantage</h2>
<p>Un plan Medicare Advantage aplica su propio costo compartido en lugar del deducible y del 20 % de la Parte B, según su Resumen de beneficios. En la calculadora, elija Medicare Advantage y escriba las cifras de su plan.</p>
<h2>El deducible de 2027</h2>
<p>CMS no ha publicado el deducible de la Parte B de 2027. Aparece cada año en la hoja informativa sobre primas y deducibles de las Partes A y B, prevista para mediados de noviembre de 2026. No lo calculamos por adelantado; los montos de esta página cambiarán cuando salga la cifra oficial.</p>`;
    },
  },
});
