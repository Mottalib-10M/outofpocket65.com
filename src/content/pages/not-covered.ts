import { definePage } from '../../lib/guide-types';
import type { Helpers } from '../../lib/helpers';

/** Each excluded item next to the covered service closest to it. */
const pairs = (h: Helpers) => {
  const x = (a: string, o: Record<string, unknown> = {}) => h.m(h.E(a, o as never).youPay);
  return h.es ? [
    ['Audífonos y examen para adaptarlos', h.a('hearing-aids', 'Prueba diagnóstica de audición indicada por un médico'), x('hearing-exam', { setting: 'office' })],
    ['Examen de la vista para anteojos', h.a('eye-exams', 'Examen médico de los ojos (diabetes, glaucoma)'), x('eye-exam-medical', { setting: 'office' })],
    ['Anteojos comunes', h.a('glasses', 'Anteojos tras una cirugía de cataratas'), x('glasses-after-cataract')],
    ['Cuidado de los pies de rutina', h.a('podiatry', 'Consulta con el podólogo por un problema del pie'), x('podiatry-visit')],
    ['Masajes', h.a('pt', 'Sesión de fisioterapia'), x('physical-therapy-session')],
    ['Acupuntura para otro dolor', h.a('acupuncture', 'Acupuntura para el dolor lumbar crónico'), x('acupuncture')],
  ] : [
    ['Hearing aids and fitting exams', h.a('hearing-aids', 'Diagnostic hearing test ordered by a doctor'), x('hearing-exam', { setting: 'office' })],
    ['Eye exam for glasses', h.a('eye-exams', 'Medical eye exam (diabetes, glaucoma)'), x('eye-exam-medical', { setting: 'office' })],
    ['Ordinary glasses', h.a('glasses', 'Glasses after cataract surgery'), x('glasses-after-cataract')],
    ['Routine foot care', h.a('podiatry', 'Podiatrist visit for a foot problem'), x('podiatry-visit')],
    ['Massage therapy', h.a('pt', 'Physical therapy session'), x('physical-therapy-session')],
    ['Acupuncture for other pain', h.a('acupuncture', 'Acupuncture for chronic low back pain'), x('acupuncture')],
  ];
};

export default definePage({
  id: 'not-covered', group: 'basics', order: 3,
  tool: { kind: 'est', props: { act: 'hearing-aids', acts: ['hearing-aids', 'dental', 'eye-exam-routine', 'hearing-exam', 'eye-exam-medical', 'podiatry-visit'] } },
  mini: { kind: 'mini:basket' },
  related: ['what-covers', 'hearing-aids', 'dental', 'eye-exams', 'glasses', 'home'],
  sources: ['notcovered', 'assignment', 'whatcovered'],
  acts: ['hearing-aids', 'dental', 'eye-exam-routine'],
  en: {
    slug: 'what-does-medicare-not-cover', nav: 'What Medicare does not cover', card: 'Hearing aids, dental care, eye exams for glasses and the rest, with the covered service next to each.',
    title: 'Not Covered by Medicare in 2026: Full List and Exceptions',
    description: 'Not covered by Original Medicare: hearing aids, most dental care, eye exams for glasses, long-term care. The exceptions, and the covered service next to each.',
    h1: 'What does Medicare not cover?',
    intro: 'For a service Original Medicare leaves out, type the price you were quoted: the estimator shows that it is all yours, and what an Advantage plan allowance would take off.',
    resume: (h) => {
      const he = h.E('hearing-exam', { setting: 'office' });
      return `Original Medicare, Parts A and B, does not pay for eye exams for prescription glasses, non-medical long-term care, cosmetic surgery, massage therapy, routine physical exams, hearing aids and the exams for fitting them, concierge care, covered services from a provider who has opted out of Medicare (except in an emergency or urgent need), and most dental care such as cleanings, fillings, extractions and dentures. For these you pay the whole bill, and a Medigap policy pays nothing either, because Medigap only fills gaps in services Medicare covers. Several exclusions have a covered neighbor: a diagnostic hearing test ordered by a doctor is covered, leaving you ${h.m(he.youPay)} at national rates with the deductible met, while the hearing aid itself is not; one pair of glasses is covered after cataract surgery; dental care closely tied to a heart valve replacement, an organ transplant, cancer treatment or dialysis can be paid. A Medicare Advantage plan, a Medicare Cost Plan or a PACE plan may add vision, hearing and dental benefits.`;
    },
    faqs: (h) => [
      { q: 'Does Medigap pay for services Medicare does not cover?', a: 'No. A Medigap policy pays part or all of the deductibles, coinsurance and copayments of services Original Medicare covers. When Medicare pays nothing, as for hearing aids, routine dental care or an eye exam for glasses, there is no Medicare cost sharing for Medigap to pay, so the bill stays yours whatever letter you hold. Plans C, D, F, G, M and N do pay 80 % of a foreign travel emergency up to plan limits, a separate benefit.' },
      { q: 'Does Medicare cover a yearly physical exam?', a: `Original Medicare does not cover routine physical exams. It covers a yearly wellness visit, which is a different service: a review of your health and a personalized prevention plan, at $0 with a provider who accepts assignment. Tests or treatment added during that visit can cost 20 %. The wellness visit is approved at ${h.m(h.E('wellness-visit').approvedTotal)} nationally and costs you ${h.m(h.E('wellness-visit').youPay)}.` },
      { q: 'What happens if my doctor opted out of Medicare?', a: 'Medicare pays nothing for items or services you get from a provider who opted out, even when Medicare would cover them elsewhere, except in an emergency or urgent need. You sign a private contract and pay what the provider charges, often up front. Providers opt out for at least 2 years. Your State Health Insurance Assistance Program can help before you sign.' },
    ],
    body: (h) => `
<h2>The list, as medicare.gov gives it</h2>
<ul>
<li><strong>Eye exams for prescription eyeglasses</strong>, also called refractions.</li>
<li><strong>Non-medical long-term care.</strong></li>
<li><strong>Cosmetic surgery</strong> and <strong>massage therapy</strong>.</li>
<li><strong>Routine physical exams.</strong></li>
<li><strong>Hearing aids and the exams for fitting them.</strong></li>
<li><strong>Concierge care</strong>, also called retainer-based, boutique or direct care.</li>
<li><strong>Services from a provider who opted out</strong> of Medicare, except in an emergency or urgent need.</li>
<li><strong>Most dental care</strong>: routine cleanings, fillings, tooth extractions, dentures.</li>
</ul>
<p>Each item is on the ${h.src('notcovered', 'medicare.gov page of services Parts A and B do not cover')}. The page adds that you pay for them yourself unless you have other health coverage or a plan that covers them.</p>
<h2>The covered service next to each exclusion</h2>
<p>An exclusion is rarely as wide as it sounds. In most cases a medical version of the same care is covered, at 20 % after the deductible, while the routine version is not.</p>
${h.table(['Not covered', 'Covered instead', 'You pay for the covered one'], pairs(h), 'National rates of October 2026, deductible met, provider accepting assignment. Glasses: standard frame and two single-vision lenses, Florida.', ['l', 'l', 'r'])}
<h2>Dental care: four exceptions</h2>
<p>Original Medicare may pay for dental services closely related to certain covered care: before or with a heart valve repair or replacement, an organ transplant, cancer-related treatment, and dialysis for end-stage renal disease. Outside those cases, cleanings, fillings, extractions and dentures are yours to pay. The ${h.a('dental', 'dental page')} prices both sides.</p>
<h2>Who can pay what Medicare does not</h2>
<p>A Medicare Advantage plan, a Medicare Cost Plan or a Program of All-inclusive Care for the Elderly (PACE) may cover extra benefits such as certain vision, hearing and dental services. Other health coverage you have may also pay part of these costs. If your plan gives you an allowance for glasses, hearing aids or dental work, the calculator below adds up a year of excluded expenses and subtracts what those allowances cover.</p>
<!--tool:mini:basket-->
<h2>Before you get a service</h2>
<p>Ask the doctor or supplier how much the test, item or service will cost and why it is recommended. Doctors may propose services Medicare does not cover, or offer them more often than Medicare pays. What you owe depends on your other insurance, on how much the doctor charges, on whether the doctor accepts assignment, on the type of facility and on where you get the service. For a covered service, the estimator gives the Medicare-approved amount; for an excluded one, only the price quoted counts.</p>`,
  },
  es: {
    slug: 'que-no-cubre-medicare', nav: 'Lo que no cubre Medicare', card: 'Audífonos, dentista, examen de la vista para anteojos y el resto, con el servicio cubierto al lado de cada uno.',
    title: 'Lo que no cubre Medicare en 2026: la lista y las excepciones',
    description: 'Lo que no cubre Medicare Original: audífonos, casi todo el dentista, examen de la vista para anteojos y más, con sus excepciones y el servicio cubierto vecino.',
    h1: '¿Qué no cubre Medicare?',
    intro: 'Para un servicio que Medicare Original deja fuera, escriba el precio que le dieron: la calculadora muestra que lo paga todo usted, y lo que descontaría la asignación de un plan Advantage.',
    resume: (h) => {
      const he = h.E('hearing-exam', { setting: 'office' });
      return `Medicare Original, es decir, las Partes A y B, no paga los exámenes de la vista para anteojos recetados, el cuidado de largo plazo no médico, la cirugía estética, los masajes, los chequeos físicos de rutina, los audífonos ni los exámenes para adaptarlos, la medicina de membresía (concierge), los servicios cubiertos de un proveedor que se retiró de Medicare (salvo emergencia o necesidad urgente) ni la mayor parte de la atención dental, como limpiezas, empastes, extracciones y dentaduras. Por todo eso usted paga la factura completa, y una póliza Medigap tampoco paga nada, porque Medigap solo completa los servicios que Medicare cubre. Varias exclusiones tienen un vecino cubierto: la prueba diagnóstica de audición que pide un médico está cubierta y le deja ${h.m(he.youPay)} a tarifas nacionales con el deducible pagado, mientras que el audífono no; un par de anteojos se cubre tras una cirugía de cataratas; la atención dental muy ligada a un reemplazo de válvula cardíaca, un trasplante de órgano, un tratamiento contra el cáncer o la diálisis puede pagarse. Un plan Medicare Advantage, un plan de costo de Medicare o un plan PACE pueden añadir visión, audición y dental.`;
    },
    faqs: (h) => [
      { q: '¿Medigap paga los servicios que Medicare no cubre?', a: 'No. Una póliza Medigap paga una parte o la totalidad de los deducibles, coseguros y copagos de los servicios que cubre Medicare Original. Cuando Medicare no paga nada, como en los audífonos, el dentista de rutina o el examen de la vista para anteojos, no hay costo compartido de Medicare que Medigap pueda pagar, y la factura sigue siendo suya. Los planes C, D, F, G, M y N sí pagan el 80 % de una emergencia en el extranjero hasta el límite del plan, un beneficio aparte.' },
      { q: '¿Medicare cubre un chequeo físico anual?', a: `Medicare Original no cubre los chequeos físicos de rutina. Cubre una visita anual de bienestar, que es otro servicio: una revisión de su salud y un plan de prevención personalizado, a 0 $ con un proveedor que acepta la asignación. Las pruebas o tratamientos añadidos en esa visita pueden costar el 20 %. La visita de bienestar tiene un monto aprobado nacional de ${h.m(h.E('wellness-visit').approvedTotal)} y le cuesta ${h.m(h.E('wellness-visit').youPay)}.` },
      { q: '¿Qué pasa si mi médico se retiró de Medicare?', a: 'Medicare no paga nada por los artículos o servicios que reciba de un proveedor que se retiró (opt-out), aunque Medicare los cubriría en otro lugar, salvo en una emergencia o necesidad urgente. Usted firma un contrato privado y paga lo que el proveedor cobre, a menudo por adelantado. El retiro dura al menos 2 años. El programa estatal de asistencia sobre seguros de salud (SHIP) puede ayudarle antes de firmar.' },
    ],
    body: (h) => `
<h2>La lista, tal como la da medicare.gov</h2>
<ul>
<li><strong>Exámenes de la vista para anteojos recetados</strong>, también llamados refracciones.</li>
<li><strong>Cuidado de largo plazo no médico.</strong></li>
<li><strong>Cirugía estética</strong> y <strong>masajes</strong>.</li>
<li><strong>Chequeos físicos de rutina.</strong></li>
<li><strong>Audífonos y los exámenes para adaptarlos.</strong></li>
<li><strong>Medicina de membresía</strong> (concierge, boutique o atención directa).</li>
<li><strong>Servicios de un proveedor que se retiró</strong> de Medicare, salvo en una emergencia o necesidad urgente.</li>
<li><strong>La mayor parte de la atención dental</strong>: limpiezas, empastes, extracciones, dentaduras.</li>
</ul>
<p>Cada punto figura en la ${h.src('notcovered', 'página de medicare.gov de lo que no cubren las Partes A y B')}. La página añade que usted los paga, salvo que tenga otra cobertura médica o un plan que los incluya.</p>
<h2>El servicio cubierto junto a cada exclusión</h2>
<p>Una exclusión casi nunca es tan amplia como parece. En la mayoría de los casos, la versión médica de la misma atención está cubierta, al 20 % después del deducible, mientras que la de rutina no.</p>
${h.table(['No cubierto', 'Cubierto en su lugar', 'Usted paga por el cubierto'], pairs(h), 'Tarifas nacionales de octubre de 2026, deducible pagado, proveedor que acepta la asignación. Anteojos: montura estándar y dos lentes monofocales, Florida.', ['l', 'l', 'r'])}
<h2>La atención dental: cuatro excepciones</h2>
<p>Medicare Original puede pagar servicios dentales muy ligados a ciertos cuidados cubiertos: antes o junto con la reparación o el reemplazo de una válvula cardíaca, un trasplante de órgano, un tratamiento contra el cáncer y la diálisis por enfermedad renal terminal. Fuera de esos casos, las limpiezas, los empastes, las extracciones y las dentaduras corren por su cuenta. La ${h.a('dental', 'página del dentista')} da precio a los dos lados.</p>
<h2>Quién puede pagar lo que Medicare no paga</h2>
<p>Un plan Medicare Advantage, un plan de costo de Medicare o un Programa de Atención Integral para Personas Mayores (PACE) pueden cubrir beneficios adicionales, como ciertos servicios de visión, audición y dental. Otra cobertura médica que tenga también puede pagar una parte. Si su plan le da una asignación para anteojos, audífonos o dentista, la calculadora de abajo suma un año de gastos excluidos y resta lo que cubren esas asignaciones.</p>
<!--tool:mini:basket-->
<h2>Antes de recibir un servicio</h2>
<p>Pregunte al médico o al proveedor cuánto costará la prueba, el artículo o el servicio y por qué lo recomienda. Los médicos pueden proponer servicios que Medicare no cubre, o con más frecuencia de la que Medicare paga. Lo que usted debe depende de su otro seguro, de cuánto cobra el médico, de si acepta la asignación, del tipo de centro y del lugar donde recibe el servicio. Para un servicio cubierto, la calculadora da el monto aprobado por Medicare; para uno excluido, solo cuenta el precio que le dieron.</p>`,
  },
});
