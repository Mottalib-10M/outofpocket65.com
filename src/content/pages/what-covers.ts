import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** One row per service page: which part pays, whether it is covered, what one typical use leaves you. */
const MAP: Array<[string, string, Record<string, unknown>]> = [
  ['hearing-aids', 'hearing-aids', {}], ['dental', 'dental', {}], ['cataract', 'cataract-surgery', { setting: 'asc' }],
  ['ambulance', 'ambulance-emergency', { miles: 10 }], ['home-health', 'home-health', {}], ['pt', 'physical-therapy-session', {}],
  ['chiropractic', 'chiropractic-adjustment', {}], ['colonoscopy', 'colonoscopy-screening', { setting: 'asc' }], ['shingles', 'shingles-vaccine', {}],
  ['glasses', 'glasses-after-cataract', {}], ['cpap', 'cpap', { count: 13 }], ['wheelchairs', 'wheelchair-manual', { count: 13 }],
  ['knee', 'knee-replacement', { setting: 'hopd' }], ['mri', 'mri-lumbar', { setting: 'office' }], ['dialysis', 'dialysis', { count: 1 }],
  ['snf', 'skilled-nursing', { count: 30 }], ['hospice', 'hospice', { count: 1 }], ['covid', 'covid-test', {}],
  ['acupuncture', 'acupuncture', {}], ['mammograms', 'mammogram-screening', {}], ['eye-exams', 'eye-exam-routine', {}], ['podiatry', 'podiatry-visit', {}],
];
const rows = (h: Helpers) => MAP.map(([page, act, o]) => {
  const e = h.E(act, o as never); const r = h.rule(act);
  const cov = r.covered === 'yes' ? (h.es ? 'Sí' : 'Yes') : r.covered === 'no' ? 'No' : (h.es ? 'Con condiciones' : 'With conditions');
  const pay = e.rule === 'notCovered' ? (h.es ? 'todo' : 'all of it') : h.m(e.youPay);
  return [h.a(page, h.label(act)), r.part ? r.part.replace('/', h.es ? ' y ' : ' and ') : '–', cov, pay];
});

export default definePage({
  id: 'what-covers', group: 'basics', order: 1,
  tool: { kind: 'est', props: { act: 'hospital-stay', count: 5, acts: ['hospital-stay', 'skilled-nursing', 'office-visit', 'er-visit', 'home-health', 'hospice', 'shingles-vaccine', 'hearing-aids', 'dental'] } },
  mini: { kind: 'mini:hospitalDays' },
  related: ['part-b', 'not-covered', 'snf', 'hospice', 'home-health', 'home'],
  sources: ['whatcovered', 'partb', 'notcovered', 'cms_fs2026'],
  acts: ['hospital-stay', 'skilled-nursing', 'shingles-vaccine'],
  en: {
    slug: 'what-does-medicare-cover', nav: 'What Medicare covers', card: 'Part A, Part B and Part D side by side, with what common services leave you to pay.',
    title: 'Medicare Coverage 2026: What Parts A, B and D Pay for You',
    description: 'What Medicare covers in 2026, part by part: hospital and nursing care under Part A, doctors and outpatient care under Part B, vaccines under D, and the gaps.',
    h1: 'What does Medicare cover?',
    intro: 'Original Medicare is two insurances, Part A for hospital care and Part B for medical care, with drug plans under Part D. The estimator starts on a hospital stay; switch the service to see another part at work.',
    resume: (h) => {
      const hs = h.E('hospital-stay', { count: 5 }); const snf = h.E('skilled-nursing', { count: 30 });
      return `Medicare covers health care in three layers. Part A, hospital insurance, pays for inpatient hospital stays, care in a skilled nursing facility after a qualifying stay, hospice and part of home health care; in 2026 a hospital stay costs you the ${h.m(h.PA.inpatientDeductible)} Part A deductible for days 1 to 60 of a benefit period, so a 5-day stay leaves you ${h.m(hs.youPay)}, and a 30-day nursing facility stay after it leaves you ${h.m(snf.youPay)}. Part B, medical insurance, pays for doctors, outpatient care, preventive services, lab tests, imaging, ambulance rides and medical equipment, with a ${h.m(h.PB.deductible)} yearly deductible and then 20 % of the approved amount. Part D, sold by private plans, covers prescription drugs and the adult vaccines Part B does not, such as the shingles vaccine, which costs nothing with a Part D plan. Medicare Advantage plans, also called Part C, bundle Parts A and B and must cover at least the same services. What none of them covers in Original Medicare: hearing aids, routine dental care, eye exams for glasses and non-medical long-term care.`;
    },
    faqs: (h) => [
      { q: 'What is the difference between Medicare Part A and Part B?', a: `Part A is hospital insurance: inpatient stays, skilled nursing facility care, hospice and some home health care, with a ${h.m(h.PA.inpatientDeductible)} deductible per benefit period in 2026. Part B is medical insurance: doctors, outpatient care, preventive services, tests and equipment, with a ${h.m(h.PB.deductible)} yearly deductible and 20 % coinsurance. Part B also has a monthly premium, ${h.mx(h.P.partB.premiumStandard)} standard in 2026.` },
      { q: 'Does Medicare cover a stay in the hospital for observation?', a: 'Part A pays only when you are formally admitted as an inpatient on a doctor\'s order. Time spent under observation or in the emergency room before admission is outpatient care billed under Part B, and it does not count toward the 3 days in a row of inpatient stay required before Medicare covers a skilled nursing facility. Ask the hospital which status you are in.' },
      { q: 'Does Medicare cover vaccines?', a: 'Some under Part B, the others under Part D. Part D covers every adult vaccine recommended by the federal immunization advisory committee that Part B does not cover, including shingles, RSV, whooping cough and measles, with no deductible and no copayment for those vaccines. Without a Part D plan, those vaccines are not paid by Original Medicare.' },
      { q: 'Do Medicare Advantage plans cover more than Original Medicare?', a: 'They must cover at least what Parts A and B cover, and many add vision, hearing or dental benefits that Original Medicare lacks. In exchange they set their own copays and networks, and their yearly out-of-pocket limit replaces the open-ended 20 %. The Summary of Benefits of each plan gives its figures.' },
    ],
    body: (h) => {
      const hs95 = h.E('hospital-stay', { count: 95 });
      return `
<h2>The four parts of Medicare</h2>
<ul>
<li><strong>Part A, hospital insurance.</strong> Inpatient hospital care (semi-private room, meals, nursing, drugs given during the stay), skilled nursing facility care for a limited time after a qualifying hospital stay, hospice, and home health care when you qualify.</li>
<li><strong>Part B, medical insurance.</strong> Medically necessary services and preventive services: doctor visits, outpatient surgery, hospital outpatient care, lab tests, imaging, ambulance, durable medical equipment, mental health care, outpatient therapy and a limited list of drugs.</li>
<li><strong>Part C, Medicare Advantage.</strong> A private plan that replaces Parts A and B, covers at least the same services and often adds extras, with its own copays and a yearly limit.</li>
<li><strong>Part D, drug coverage.</strong> A private plan for prescription drugs and for the adult vaccines Part B does not cover.</li>
</ul>
<h2>Service by service: covered or not, and what you pay</h2>
${h.table(['Service', 'Part', 'Covered?', 'You pay'], rows(h), 'National rates of October 2026, deductible already met, Original Medicare only. Ambulance: 10 miles, rest of Florida. CPAP and wheelchair: 13 rental months in Florida. Skilled nursing: 30 days.', ['l', 'l', 'l', 'r'])}
<p>Each line links to its page, with the rules of the service (how often, who qualifies, which provider) and an estimator set for it. "With conditions" means Medicare pays only in defined cases: acupuncture for chronic low back pain only, chiropractic care for spine adjustments only, glasses after cataract surgery only.</p>
<h2>Hospital stays: days, not percentages</h2>
<p>Part A does not charge 20 %. It charges by the day, per benefit period: nothing after the deductible for days 1 to 60, ${h.m(h.PA.hospitalDaily61to90)} a day for days 61 to 90, then ${h.m(h.PA.lifetimeReserveDaily)} a day for up to ${h.PA.lifetimeReserveDays} lifetime reserve days, which can be used only once in a lifetime; after day 150 you pay all costs. A 95-day stay comes to ${h.m(hs95.youPay)}. A private room, private-duty nursing and a television or phone billed separately are not covered.</p>
<!--tool:mini:hospitalDays-->
<h2>How to check a service that is not listed here</h2>
<p>Medicare.gov keeps a ${h.src('whatcovered', 'coverage page for each test, item or service')}, with who is eligible, how often it is covered and what you pay. Before a test or treatment, ask the doctor why it is recommended and whether Medicare will cover it: your doctor may propose services Medicare does not cover, or covers less often than proposed. What you owe depends on your other insurance, on how much the doctor charges, on whether the doctor accepts assignment, on the type of facility and on where you get the service. The estimator on this page handles the last three for the services it lists.</p>
<h2>What Original Medicare leaves out</h2>
<p>Eye exams for glasses, non-medical long-term care, cosmetic surgery, massage therapy, routine physical exams, hearing aids and the exams to fit them, concierge care, care from a provider who opted out of Medicare except in an emergency, and most dental care. The ${h.a('not-covered', 'page on what Medicare does not cover')} details each one and the few exceptions, such as dental care linked to a heart valve replacement or dialysis.</p>`;
    },
  },
  es: {
    slug: 'que-cubre-medicare', nav: 'Qué cubre Medicare', card: 'Las Partes A, B y D lado a lado, con lo que le dejan los servicios más comunes.',
    title: 'Cobertura de Medicare 2026: lo que pagan las Partes A, B y D',
    description: 'Lo que cubre Medicare en 2026, parte por parte: hospital y enfermería con la A, médicos y atención ambulatoria con la B, vacunas con la D, y lo que falta.',
    h1: '¿Qué cubre Medicare?',
    intro: 'Medicare Original son dos seguros, la Parte A para el hospital y la Parte B para la atención médica, con los planes de medicamentos de la Parte D. La calculadora empieza con una hospitalización; cambie el servicio para ver otra parte en acción.',
    resume: (h) => {
      const hs = h.E('hospital-stay', { count: 5 }); const snf = h.E('skilled-nursing', { count: 30 });
      return `Medicare cubre la atención médica en tres capas. La Parte A, el seguro de hospital, paga las hospitalizaciones con ingreso, la atención en un centro de enfermería especializada tras una estancia que da derecho a ella, los cuidados paliativos y una parte de la atención en el hogar; en 2026 una hospitalización le cuesta el deducible de la Parte A, ${h.m(h.PA.inpatientDeductible)}, por los días 1 a 60 de un período de beneficios, así que una estancia de 5 días le deja ${h.m(hs.youPay)}, y 30 días en un centro de enfermería después, ${h.m(snf.youPay)}. La Parte B, el seguro médico, paga los médicos, la atención ambulatoria, los servicios preventivos, los análisis, las imágenes, la ambulancia y el equipo médico, con un deducible anual de ${h.m(h.PB.deductible)} y luego el 20 % del monto aprobado. La Parte D, que venden planes privados, cubre los medicamentos recetados y las vacunas para adultos que no cubre la Parte B, como la de la culebrilla, que no cuesta nada con un plan de la Parte D. Los planes Medicare Advantage, o Parte C, reúnen las Partes A y B y deben cubrir al menos lo mismo. Lo que ninguna cubre en Medicare Original: audífonos, dentista de rutina, examen de la vista para anteojos y cuidado de largo plazo no médico.`;
    },
    faqs: (h) => [
      { q: '¿Qué diferencia hay entre la Parte A y la Parte B de Medicare?', a: `La Parte A es el seguro de hospital: hospitalizaciones, centro de enfermería especializada, cuidados paliativos y parte de la atención en el hogar, con un deducible de ${h.m(h.PA.inpatientDeductible)} por período de beneficios en 2026. La Parte B es el seguro médico: médicos, atención ambulatoria, prevención, pruebas y equipo, con un deducible anual de ${h.m(h.PB.deductible)} y un coseguro del 20 %. La Parte B tiene además una prima mensual, ${h.mx(h.P.partB.premiumStandard)} la estándar en 2026.` },
      { q: '¿Medicare cubre una estancia en el hospital en observación?', a: 'La Parte A paga solo cuando lo ingresan formalmente como paciente hospitalizado por orden de un médico. El tiempo en observación o en urgencias antes del ingreso es atención ambulatoria de la Parte B y no cuenta para los 3 días seguidos de hospitalización que exige Medicare antes de cubrir un centro de enfermería especializada. Pregunte en el hospital en qué condición está.' },
      { q: '¿Medicare cubre las vacunas?', a: 'Algunas con la Parte B y las demás con la Parte D. La Parte D cubre todas las vacunas para adultos recomendadas por el comité federal de inmunización que no cubre la Parte B, entre ellas la de la culebrilla, el VRS, la tos ferina y el sarampión, sin deducible ni copago para esas vacunas. Sin un plan de la Parte D, Medicare Original no las paga.' },
      { q: '¿Los planes Medicare Advantage cubren más que Medicare Original?', a: 'Deben cubrir al menos lo que cubren las Partes A y B, y muchos añaden beneficios de visión, audición o dental que Medicare Original no tiene. A cambio, fijan sus propios copagos y redes, y su límite anual de gastos de bolsillo sustituye al 20 % sin tope. El Resumen de beneficios de cada plan da sus cifras.' },
    ],
    body: (h) => {
      const hs95 = h.E('hospital-stay', { count: 95 });
      return `
<h2>Las cuatro partes de Medicare</h2>
<ul>
<li><strong>Parte A, seguro de hospital.</strong> La hospitalización con ingreso (habitación semiprivada, comidas, enfermería, medicamentos durante la estancia), el centro de enfermería especializada por un tiempo limitado tras una hospitalización que da derecho a él, los cuidados paliativos y la atención en el hogar cuando reúne los requisitos.</li>
<li><strong>Parte B, seguro médico.</strong> Servicios médicamente necesarios y servicios preventivos: consultas, cirugía ambulatoria, atención ambulatoria en el hospital, análisis, imágenes, ambulancia, equipo médico duradero, salud mental, terapia ambulatoria y una lista limitada de medicamentos.</li>
<li><strong>Parte C, Medicare Advantage.</strong> Un plan privado que sustituye a las Partes A y B, cubre al menos lo mismo y a menudo añade beneficios, con sus propios copagos y un límite anual.</li>
<li><strong>Parte D, cobertura de medicamentos.</strong> Un plan privado para los medicamentos recetados y las vacunas para adultos que no cubre la Parte B.</li>
</ul>
<h2>Servicio por servicio: si está cubierto y cuánto paga</h2>
${h.table(['Servicio', 'Parte', '¿Cubierto?', 'Usted paga'], rows(h), 'Tarifas nacionales de octubre de 2026, deducible ya pagado, solo Medicare Original. Ambulancia: 10 millas, resto de Florida. CPAP y silla de ruedas: 13 meses de alquiler en Florida. Centro de enfermería: 30 días.', ['l', 'l', 'l', 'r'])}
<p>Cada línea lleva a su página, con las reglas del servicio (cada cuánto, quién tiene derecho, qué proveedor) y una calculadora preparada para él. «Con condiciones» significa que Medicare paga solo en casos definidos: la acupuntura solo para el dolor lumbar crónico, el quiropráctico solo para los ajustes de la columna, los anteojos solo después de una cirugía de cataratas.</p>
<h2>Hospitalización: días, no porcentajes</h2>
<p>La Parte A no cobra un 20 %. Cobra por día y por período de beneficios: nada después del deducible del día 1 al 60, ${h.m(h.PA.hospitalDaily61to90)} por día del 61 al 90, y luego ${h.m(h.PA.lifetimeReserveDaily)} por día durante un máximo de ${h.PA.lifetimeReserveDays} días de reserva de por vida, que solo se usan una vez en la vida; después del día 150 usted paga todo. Una estancia de 95 días suma ${h.m(hs95.youPay)}. No se cubren la habitación privada, la enfermería privada ni la televisión o el teléfono que se cobran aparte.</p>
<!--tool:mini:hospitalDays-->
<h2>Cómo comprobar un servicio que no aparece aquí</h2>
<p>Medicare.gov tiene una ${h.src('whatcovered', 'página de cobertura para cada prueba, artículo o servicio')}, con quién tiene derecho, cada cuánto se cubre y cuánto paga usted. Antes de una prueba o un tratamiento, pregunte al médico por qué lo recomienda y si Medicare lo cubrirá: puede proponerle servicios que Medicare no cubre, o que cubre con menos frecuencia. Lo que usted debe depende de su otro seguro, de cuánto cobra el médico, de si acepta la asignación, del tipo de centro y del lugar donde recibe el servicio. La calculadora de esta página tiene en cuenta los tres últimos para los servicios que lista.</p>
<h2>Lo que Medicare Original deja fuera</h2>
<p>Los exámenes de la vista para anteojos, el cuidado de largo plazo no médico, la cirugía estética, los masajes, los chequeos físicos de rutina, los audífonos y los exámenes para adaptarlos, la medicina de membresía, la atención de un proveedor que se retiró de Medicare salvo en una emergencia, y la mayor parte de la atención dental. La ${h.a('not-covered', 'página sobre lo que no cubre Medicare')} detalla cada uno y las pocas excepciones, como la atención dental ligada a un reemplazo de válvula cardíaca o a la diálisis.</p>`;
    },
  },
});
