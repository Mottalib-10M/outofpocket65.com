import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'part-b', group: 'basics', order: 2,
  tool: { kind: 'est', props: { act: 'office-visit', acts: ['office-visit', 'wellness-visit', 'er-visit', 'mri-brain', 'mammogram-diagnostic', 'physical-therapy-session', 'cpap', 'ambulance-emergency', 'colonoscopy-screening', 'cataract-surgery'] } },
  mini: { kind: 'mini:twenty' },
  related: ['deductible', 'what-covers', 'not-covered', 'mri', 'ambulance', 'home'],
  sources: ['partb', 'cms_fs2026', 'assignment', 'pfs', 'opps'],
  acts: ['office-visit', 'wellness-visit', 'er-visit'],
  en: {
    slug: 'what-does-medicare-part-b-cover', nav: 'What Part B covers', card: 'Doctors, outpatient care, preventive services and equipment: the 2026 premium, deductible and your 20 %.',
    title: 'Medicare Part B Coverage 2026: What It Pays and What You Pay',
    description: 'Medicare Part B covers doctors, outpatient care, preventive services and medical equipment. The 2026 premium, deductible, your 20 % and real prices per service.',
    h1: 'What does Medicare Part B cover, and what is left for you?',
    intro: 'Part B is the medical insurance half of Original Medicare: doctor visits, outpatient care, tests, preventive services and equipment. The estimator prices a Part B service with your area and coverage.',
    resume: (h) => {
      const ov = h.E('office-visit'); const er = h.E('er-visit'); const mam = h.E('mammogram-screening');
      return `Medicare Part B is the medical insurance of Original Medicare and pays for two kinds of care: services that are medically necessary to diagnose or treat a condition, and preventive services that catch illness early. In practice that means doctor visits, outpatient surgery and hospital outpatient care, lab tests and imaging, ambulance rides, durable medical equipment such as a CPAP or a wheelchair, mental health care, outpatient therapy and a limited list of outpatient prescription drugs. In 2026 the standard premium is ${h.mx(h.P.partB.premiumStandard)} a month and the deductible ${h.m(h.PB.deductible)} a year; after that you pay 20 % of the Medicare-approved amount, with no yearly ceiling. A follow-up office visit approved at ${h.m(ov.approvedTotal)} nationally leaves you ${h.m(ov.youPay)}; an emergency room visit for a moderately severe problem leaves you ${h.m(er.youPay)} with its hospital copayment; a screening mammogram costs you ${h.m(mam.youPay)} when the provider accepts assignment. Hearing aids, routine dental care and eye exams for glasses sit outside Part B.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare Part B cover prescription drugs?', a: `Only a limited list of outpatient prescription drugs, such as the insulin used in a pump covered as medical equipment and certain drugs for outpatient and home dialysis. Drugs you pick up at a pharmacy are generally a matter for Part D, a separate drug plan you join on top of Parts A and B. Part B-covered insulin for a pump costs at most ${h.m(h.P.partB.insulinMonthMax)} for a month's supply, with no deductible.` },
      { q: 'How much is the Part B premium in 2026?', a: `The standard premium is ${h.mx(h.P.partB.premiumStandard)} a month in 2026, ${h.m(h.P.partB.premiumStandard * 12)} over the year, set in the CMS fact sheet. It is the same whatever care you use and is separate from the ${h.m(h.PB.deductible)} deductible and the 20 %. The 2027 premium is not published yet; CMS announces it in a fact sheet expected in mid-November 2026.` },
      { q: 'Does Part B pay for an emergency room visit?', a: `Yes. Part B pays for the emergency department visit and the doctor's fee: you owe a hospital copayment for the visit and for each hospital service, plus 20 % of the doctor's fee once the deductible is met. For a moderately severe problem at national rates that comes to ${h.m(h.E('er-visit').youPay)}. If you are admitted to the same hospital for a related condition within 3 days, the copayment is not charged.` },
      { q: 'Can a doctor charge more than the Part B approved amount?', a: `Only if the doctor does not accept assignment. Medicare then approves 95 % of its fee, and the doctor may add up to 15 % above that reduced amount, called the limiting charge. On a follow-up visit that adds up to ${h.m(h.E('office-visit', { assignment: false }).excessPart)} to your bill. A doctor who has opted out of Medicare is not paid by Medicare at all, except in emergencies.` },
    ],
    body: (h) => {
      const rows: Array<[string, string, Record<string, unknown>]> = [
        ['office-visit', 'Office', {}], ['wellness-visit', 'Office', {}], ['mammogram-screening', 'Office', {}],
        ['mammogram-diagnostic', 'Imaging center', { setting: 'office' }], ['mri-brain', 'Imaging center', { setting: 'office' }], ['mri-brain', 'Hospital outpatient', { setting: 'hopd' }],
        ['er-visit', 'Hospital', {}], ['physical-therapy-session', 'Office', {}], ['cpap', 'Supplier, 13 months, Florida', { count: 13 }],
      ];
      const t = rows.map(([a, where, o]) => { const e = h.E(a, o as never); return [h.label(a), where, h.m(e.approvedTotal), h.m(e.youPay)]; });
      const ovD = h.E('office-visit', { deductibleRemaining: h.PB.deductible });
      const np = h.E('office-visit', { assignment: false });
      return `
<h2>Two kinds of services</h2>
<p>Medicare.gov sorts everything Part B pays for into two groups. <strong>Medically necessary services</strong> are the services and supplies that meet accepted standards of medical practice to diagnose or treat your condition: the visit when you are sick, the scan your doctor orders, the surgery done without an overnight admission, the walker you need after a fall. <strong>Preventive services</strong> are care meant to prevent illness or find it at an early stage, such as the yearly wellness visit, screening mammograms and screening colonoscopies. Most preventive services cost you nothing when the provider accepts assignment; medically necessary services follow the deductible and the 20 %.</p>
<p>The ${h.src('partb', 'Part B coverage page')} lists, among others, ambulance services, clinical research, durable medical equipment, limited outpatient prescription drugs, mental health and substance use disorder care, and oxygen equipment. Each service on this site has its own page with its own rules: how often it is covered, who qualifies and where it can be done.</p>
<h2>The 2026 figures that drive every Part B bill</h2>
${h.table(['Item', '2026 amount', 'How it works'], [
  ['Standard monthly premium', h.mx(h.P.partB.premiumStandard), 'Paid every month, whatever care you use'],
  ['Yearly deductible', h.m(h.PB.deductible), 'You pay approved amounts until it is reached; resets each January'],
  ['Coinsurance', h.pc(h.PB.coinsurance), 'Of the approved amount, after the deductible, with no yearly cap'],
  ['Cap on one hospital outpatient copayment', h.m(h.PA.inpatientDeductible), 'Equal to the Part A deductible'],
  ['Insulin used in a pump', `${h.m(h.P.partB.insulinMonthMax)} a month at most`, 'No deductible'],
], 'Source: CMS 2026 fact sheet and medicare.gov.', ['l', 'r', 'l'])}
<p>The 2027 premium and deductible are not published yet. CMS releases them in its yearly fact sheet, expected in mid-November 2026; until then every amount on this site is the 2026 one.</p>
<h2>What common Part B services cost you</h2>
${h.table(['Service', 'Where', 'Approved', 'You pay'], t, 'National rates of October 2026, Original Medicare only, deductible already met, provider accepting assignment.', ['l', 'l', 'r', 'r'])}
<p>The same scan costs more in a hospital outpatient department than at an imaging center, because the hospital adds its own copayment to the radiologist's 20 %. When you have a choice of place, ask before booking.</p>
<h2>The deductible comes first</h2>
<p>In January your first bills go to the deductible. A follow-up visit that leaves you ${h.m(h.E('office-visit').youPay)} in June costs you ${h.m(ovD.youPay)} when it is the first Part B bill of the year, because the whole approved amount counts toward the ${h.m(h.PB.deductible)}. The ${h.a('deductible', 'deductible page')} follows a year of bills step by step.</p>
<!--tool:mini:twenty-->
<h2>Assignment, non-participating doctors and opt-outs</h2>
<p>Most doctors accept assignment: they take the approved amount as full payment, bill Medicare themselves and ask you only for the deductible and coinsurance. A non-participating doctor may accept assignment case by case or bill you up to the limiting charge: on our sample visit the approved amount drops to ${h.m(np.approvedTotal)} and the bill can rise by ${h.m(np.excessPart)}. A provider who has opted out of Medicare signs a private contract with you, and Medicare pays nothing for that care, except in an emergency or urgent need. The ${h.src('assignment', 'medicare.gov assignment page')} gives these rules.</p>
<h2>Outside Part B</h2>
<p>Part B leaves out hearing aids and the exams to fit them, most dental care, eye exams for glasses, long-term care that is not medical, cosmetic surgery, routine physical exams and concierge care. Those costs are yours unless other coverage pays them; the ${h.a('not-covered', 'list of what Medicare does not cover')} prices them. A Medicare Advantage plan must cover at least what Part B covers, often with its own copays and extra benefits.</p>`;
    },
  },
  es: {
    slug: 'que-cubre-medicare-parte-b', nav: 'Qué cubre la Parte B', card: 'Médicos, atención ambulatoria, prevención y equipo: la prima, el deducible y su 20 % en 2026.',
    title: 'Cobertura de la Parte B de Medicare 2026: qué paga y qué no',
    description: 'La Parte B de Medicare cubre médicos, atención ambulatoria, servicios preventivos y equipo médico. Prima, deducible y su 20 % en 2026, con precios reales.',
    h1: '¿Qué cubre la Parte B de Medicare y cuánto le toca pagar?',
    intro: 'La Parte B es el seguro médico de Medicare Original: consultas, atención ambulatoria, pruebas, servicios preventivos y equipo. La calculadora pone precio a un servicio de la Parte B con su zona y su cobertura.',
    resume: (h) => {
      const ov = h.E('office-visit'); const er = h.E('er-visit'); const mam = h.E('mammogram-screening');
      return `La Parte B es el seguro médico de Medicare Original y paga dos clases de atención: los servicios médicamente necesarios para diagnosticar o tratar una afección, y los servicios preventivos que detectan una enfermedad a tiempo. En la práctica, eso incluye las consultas con el médico, la cirugía y la atención ambulatoria en un hospital, los análisis y las imágenes, la ambulancia, el equipo médico duradero como un CPAP o una silla de ruedas, la salud mental, la terapia ambulatoria y una lista corta de medicamentos recetados ambulatorios. En 2026 la prima estándar es de ${h.mx(h.P.partB.premiumStandard)} al mes y el deducible de ${h.m(h.PB.deductible)} al año; después usted paga el 20 % del monto aprobado por Medicare, sin límite anual. Una consulta de seguimiento con un monto aprobado nacional de ${h.m(ov.approvedTotal)} le deja ${h.m(ov.youPay)}; una visita a urgencias por un problema moderadamente grave, ${h.m(er.youPay)} con el copago del hospital; una mamografía de detección, ${h.m(mam.youPay)} si el proveedor acepta la asignación. Los audífonos, el dentista de rutina y el examen de la vista para anteojos quedan fuera de la Parte B.`;
    },
    faqs: (h) => [
      { q: '¿La Parte B de Medicare cubre medicamentos recetados?', a: `Solo una lista limitada de medicamentos ambulatorios, como la insulina de una bomba cubierta como equipo médico y ciertos medicamentos de la diálisis ambulatoria y en casa. Los medicamentos que recoge en la farmacia suelen depender de la Parte D, un plan de medicamentos aparte que se suma a las Partes A y B. La insulina de bomba cubierta por la Parte B cuesta como máximo ${h.m(h.P.partB.insulinMonthMax)} por el suministro de un mes, sin deducible.` },
      { q: '¿Cuánto cuesta la prima de la Parte B en 2026?', a: `La prima estándar es de ${h.mx(h.P.partB.premiumStandard)} al mes en 2026, ${h.m(h.P.partB.premiumStandard * 12)} en el año, según la hoja informativa de CMS. Es la misma use o no servicios, y se suma al deducible de ${h.m(h.PB.deductible)} y al 20 %. La prima de 2027 aún no se publica: CMS la anuncia en una hoja que se espera a mediados de noviembre de 2026.` },
      { q: '¿La Parte B paga una visita a la sala de emergencias?', a: `Sí. La Parte B paga la visita al departamento de emergencias y los honorarios del médico: usted debe un copago del hospital por la visita y por cada servicio del hospital, más el 20 % de los honorarios una vez pagado el deducible. Para un problema moderadamente grave, a tarifas nacionales, son ${h.m(h.E('er-visit').youPay)}. Si lo ingresan en el mismo hospital por una afección relacionada dentro de 3 días, no se cobra el copago.` },
      { q: '¿Un médico puede cobrar más que el monto aprobado por la Parte B?', a: `Solo si no acepta la asignación. En ese caso Medicare aprueba el 95 % de su tarifa y el médico puede sumar hasta un 15 % sobre ese monto reducido, el llamado cargo límite. En una consulta de seguimiento eso añade hasta ${h.m(h.E('office-visit', { assignment: false }).excessPart)} a su factura. Un médico que se retiró de Medicare (opt-out) no recibe pago de Medicare, salvo en emergencias.` },
    ],
    body: (h) => {
      const rows: Array<[string, string, Record<string, unknown>]> = [
        ['office-visit', 'Consultorio', {}], ['wellness-visit', 'Consultorio', {}], ['mammogram-screening', 'Consultorio', {}],
        ['mammogram-diagnostic', 'Centro de imágenes', { setting: 'office' }], ['mri-brain', 'Centro de imágenes', { setting: 'office' }], ['mri-brain', 'Hospital ambulatorio', { setting: 'hopd' }],
        ['er-visit', 'Hospital', {}], ['physical-therapy-session', 'Consultorio', {}], ['cpap', 'Proveedor, 13 meses, Florida', { count: 13 }],
      ];
      const t = rows.map(([a, where, o]) => { const e = h.E(a, o as never); return [h.label(a), where, h.m(e.approvedTotal), h.m(e.youPay)]; });
      const ovD = h.E('office-visit', { deductibleRemaining: h.PB.deductible });
      const np = h.E('office-visit', { assignment: false });
      return `
<h2>Dos clases de servicios</h2>
<p>Medicare.gov ordena todo lo que paga la Parte B en dos grupos. Los <strong>servicios médicamente necesarios</strong> son los servicios y suministros que cumplen las normas aceptadas de la práctica médica para diagnosticar o tratar su afección: la consulta cuando está enfermo, la imagen que pide su médico, la cirugía sin ingreso, el andador que necesita tras una caída. Los <strong>servicios preventivos</strong> buscan evitar una enfermedad o descubrirla pronto, como la visita anual de bienestar, la mamografía de detección o la colonoscopia de detección. La mayoría de los servicios preventivos no le cuestan nada si el proveedor acepta la asignación; los servicios médicamente necesarios siguen el deducible y el 20 %.</p>
<p>La ${h.src('partb', 'página de cobertura de la Parte B')} menciona, entre otros, la ambulancia, la investigación clínica, el equipo médico duradero, algunos medicamentos ambulatorios, la salud mental y el tratamiento de adicciones, y el equipo de oxígeno. Cada servicio de este sitio tiene su página con sus reglas: cada cuánto se cubre, quién tiene derecho y dónde puede hacerse.</p>
<h2>Las cifras de 2026 que mueven cada factura</h2>
${h.table(['Concepto', 'Monto 2026', 'Cómo funciona'], [
  ['Prima mensual estándar', h.mx(h.P.partB.premiumStandard), 'Se paga cada mes, use o no servicios'],
  ['Deducible anual', h.m(h.PB.deductible), 'Usted paga los montos aprobados hasta alcanzarlo; vuelve a empezar en enero'],
  ['Coseguro', h.pc(h.PB.coinsurance), 'Del monto aprobado, después del deducible, sin límite anual'],
  ['Tope del copago de hospital ambulatorio por servicio', h.m(h.PA.inpatientDeductible), 'Igual al deducible de la Parte A'],
  ['Insulina de bomba', `${h.m(h.P.partB.insulinMonthMax)} al mes como máximo`, 'Sin deducible'],
], 'Fuente: hoja informativa de CMS de 2026 y medicare.gov.', ['l', 'r', 'l'])}
<p>La prima y el deducible de 2027 todavía no se han publicado. CMS los da a conocer en su hoja anual, prevista para mediados de noviembre de 2026; hasta entonces, todos los montos de este sitio son los de 2026.</p>
<h2>Lo que le cuestan los servicios más comunes</h2>
${h.table(['Servicio', 'Dónde', 'Aprobado', 'Usted paga'], t, 'Tarifas nacionales de octubre de 2026, solo Medicare Original, deducible ya pagado, proveedor que acepta la asignación.', ['l', 'l', 'r', 'r'])}
<p>La misma imagen cuesta más en un hospital ambulatorio que en un centro de imágenes, porque el hospital suma su propio copago al 20 % del radiólogo. Cuando pueda elegir el lugar, pregunte antes de pedir la cita.</p>
<h2>Primero va el deducible</h2>
<p>En enero, las primeras facturas se van al deducible. Una consulta de seguimiento que en junio le deja ${h.m(h.E('office-visit').youPay)} le cuesta ${h.m(ovD.youPay)} si es la primera factura de la Parte B del año, porque todo el monto aprobado cuenta para los ${h.m(h.PB.deductible)}. La ${h.a('deductible', 'página del deducible')} sigue un año de facturas paso a paso.</p>
<!--tool:mini:twenty-->
<h2>Asignación, médicos no participantes y médicos fuera de Medicare</h2>
<p>La mayoría de los médicos aceptan la asignación: toman el monto aprobado como pago completo, facturan ellos mismos a Medicare y solo le piden a usted el deducible y el coseguro. Un médico no participante puede aceptar la asignación caso por caso o cobrarle hasta el cargo límite: en nuestra consulta de ejemplo el monto aprobado baja a ${h.m(np.approvedTotal)} y la factura puede subir ${h.m(np.excessPart)}. Un proveedor que se retiró de Medicare firma con usted un contrato privado, y Medicare no paga nada por esa atención, salvo en una emergencia o necesidad urgente. La ${h.src('assignment', 'página de medicare.gov sobre la asignación')} recoge estas reglas.</p>
<h2>Fuera de la Parte B</h2>
<p>La Parte B no cubre los audífonos ni los exámenes para adaptarlos, la mayor parte de la atención dental, los exámenes de la vista para anteojos, el cuidado de largo plazo no médico, la cirugía estética, los chequeos físicos de rutina ni la medicina de membresía (concierge). Esos gastos son suyos, salvo que otra cobertura los pague; la ${h.a('not-covered', 'lista de lo que no cubre Medicare')} les pone precio. Un plan Medicare Advantage debe cubrir al menos lo mismo que la Parte B, a menudo con sus propios copagos y beneficios adicionales.</p>`;
    },
  },
});
