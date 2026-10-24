import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'eye-exams', group: 'cover', order: 27,
  tool: { kind: 'est', props: { act: 'eye-exam-medical', setting: 'office', acts: ['eye-exam-medical', 'glaucoma-screening', 'eye-exam-routine', 'cataract-surgery'] } },
  mini: { kind: 'mini:eyeExam' },
  related: ['cataract', 'glasses', 'not-covered', 'what-covers', 'home'],
  sources: ['pfs', 'opps', 'cms_fs2026', 'notcovered'],
  acts: ['eye-exam-routine', 'eye-exam-medical'],
  en: {
    slug: 'does-medicare-cover-eye-exams', nav: 'Eye exams', card: 'Routine exams for glasses are not covered; the yearly diabetic eye exam and glaucoma tests are, at 20 %.',
    title: 'Eye Exams and Medicare 2026: Which Ones Are Covered and Cost',
    description: 'Medicare does not cover routine eye exams for glasses. Part B covers a yearly diabetic eye exam, glaucoma tests at high risk and eye disease care, at 20 %.',
    h1: 'Does Medicare cover eye exams?',
    intro: 'It depends on why you need the exam. Pick the exam in the estimator: a medical eye exam is priced at the 2026 rate for your area, a routine exam for glasses at the price you type.',
    resume: (h) => {
      const m = h.E('eye-exam-medical', { setting: 'office' }); const o = h.E('eye-exam-medical', { setting: 'hopd' }); const g = h.E('glaucoma-screening');
      return `Original Medicare does not cover routine eye exams, the refractions done to prescribe eyeglasses or contact lenses: you pay all of that cost. It does cover eye care with a medical reason under Part B. People with diabetes get an exam for diabetic retinopathy once a year, from an eye doctor legally allowed to do the test in their state. People at high risk get glaucoma tests. Exams to diagnose or treat an eye disease are covered as doctor services. All of these follow the Part B deductible, ${h.m(h.PB.deductible)} in 2026, then 20 % of the approved amount. A medical eye exam for an established patient is approved at ${h.m(m.approvedTotal)} nationally in an eye doctor's office, so ${h.m(m.youPay)} for you; the same exam in a hospital outpatient department costs you ${h.m(o.youPay)} because the hospital adds its copayment. A glaucoma test for a person at high risk leaves you ${h.m(g.youPay)}. Some Medicare Advantage plans offer vision benefits that Original Medicare does not, including routine exams; contact the plan.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare cover an eye exam if I have diabetes?', a: `Yes, once a year: Part B covers an exam for diabetic retinopathy if you have diabetes, done by an eye doctor who is legally allowed to perform the test in your state. You pay 20 % of the approved amount after the deductible, plus a copayment in a hospital outpatient setting. At national rates that is ${h.m(h.E('eye-exam-medical', { setting: 'office' }).youPay)} in an office once the deductible is met.` },
      { q: 'Why does an eye exam for new glasses cost me the full price?', a: 'Because Medicare excludes routine eye exams, sometimes called eye refractions, done to prescribe eyeglasses or contact lenses. Even when the same visit checks your eye health, the refraction part is yours to pay. Ask the office to separate the medical part, which Part B can cover when there is a medical reason, from the refraction, and its price, before the visit.' },
      { q: 'Does Medigap pay for a routine eye exam?', a: 'No. A Medigap policy only pays its share of services Medicare covers. A routine exam for glasses has no Medicare-approved amount, so whatever your letter, the whole price is yours. For a covered medical eye exam, Plan G pays the 20 % once the deductible is met. Vision benefits for routine exams come only from a Medicare Advantage plan that offers them, or other coverage.' },
    ],
    body: (h) => {
      const m = h.E('eye-exam-medical', { setting: 'office' }); const o = h.E('eye-exam-medical', { setting: 'hopd' }); const g = h.E('glaucoma-screening');
      const md = h.E('eye-exam-medical', { setting: 'office', deductibleRemaining: h.PB.deductible });
      const man = h.E('eye-exam-medical', { setting: 'office', locality: h.loc(/^Manhattan$/) }); const al = h.E('eye-exam-medical', { setting: 'office', locality: h.defaultLocality('AL') });
      return `
<h2>Covered or not: the reason decides</h2>
${h.table(['Exam', 'Covered?', 'Approved', 'You pay'], [
  ['Routine exam for glasses or contacts', 'No', '–', 'All of it'],
  ['Diabetic retinopathy exam, once a year', 'Yes, with diabetes', h.m(m.approvedTotal), h.m(m.youPay)],
  ['Medical eye exam, in an office', 'Yes', h.m(m.approvedTotal), h.m(m.youPay)],
  ['Medical eye exam, hospital outpatient', 'Yes', h.m(o.approvedTotal), h.m(o.youPay)],
  [h.label('glaucoma-screening'), 'Yes, if at high risk', h.m(g.approvedTotal), h.m(g.youPay)],
], 'National rates of October 2026, Original Medicare, deductible already met, eye doctor accepting assignment. The diabetic exam is priced as a medical eye exam for an established patient.', ['l', 'l', 'r', 'r'])}
<p>An office visit with an eye doctor can include both kinds of work: checking the health of the eye, which Medicare may pay when there is a medical reason, and measuring your prescription for glasses, which it never pays. The bill can then show a covered line and a line that is entirely yours.</p>
<h2>What the deductible and your area change</h2>
<p>If the eye exam is your first Part B bill of the year, the deductible takes the whole approved amount, and you pay ${h.m(md.youPay)} instead of ${h.m(m.youPay)}. The physician fee schedule also follows your price area: the same office exam is approved at ${h.m(man.approvedTotal)} in Manhattan and ${h.m(al.approvedTotal)} in Alabama. Choose your state in the estimator above to see your local amount.</p>
<!--tool:mini:eyeExam-->
<h2>Where the exam is done</h2>
<p>In an eye doctor's own office, you pay 20 % of one approved amount. In a hospital outpatient department, the eye doctor bills a lower professional fee and the hospital adds its facility charge, with its own copayment: ${h.m(o.youPay)} for you against ${h.m(m.youPay)} in an office, at national rates. For a yearly exam with no urgency, the office is usually the cheaper choice for you.</p>
<h2>Medigap on a covered eye exam</h2>
<p>For a medical eye exam, Medigap Plan G pays the 20 % once the deductible is met and leaves you ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'G' }).youPay)}; Plan K pays half and leaves ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'K' }).youPay)}. In January, before the deductible is met, Plan G leaves you the deductible part, ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'G', deductibleRemaining: h.PB.deductible }).youPay)} here.</p>
<h2>After cataract surgery</h2>
<p>Medicare does not pay for glasses in general, with one exception: one pair of glasses with standard frames, or one set of contact lenses, after each cataract surgery that implants an intraocular lens. The ${h.a('glasses', 'glasses page')} prices that pair, and the ${h.a('cataract', 'cataract surgery page')} the operation itself.</p>
<h2>Vision benefits outside Original Medicare</h2>
<p>Some Medicare Advantage plans offer extra benefits Original Medicare does not cover, such as vision services. The amounts and the network are in the plan's Summary of Benefits. In the estimator, choose Medicare Advantage and enter any allowance the plan gives next to the price of a routine exam to see what remains for you. Coverage rules come from the ${h.cov('eye-exam-routine', 'medicare.gov routine eye exams page')} and the ${h.cov('eye-exam-medical', 'medicare.gov diabetic eye exams page')}.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-examenes-de-la-vista', nav: 'Exámenes de la vista', card: 'El examen de rutina para anteojos no se cubre; el examen anual por diabetes y el de glaucoma sí, al 20 %.',
    title: 'Examen de la vista y Medicare 2026: cuáles cubre y su costo',
    description: 'Medicare no cubre el examen de la vista para anteojos. La Parte B cubre el examen anual por diabetes, el de glaucoma de alto riesgo y las enfermedades del ojo.',
    h1: '¿Medicare cubre los exámenes de la vista?',
    intro: 'Depende del motivo del examen. Elija el examen en la calculadora: el examen médico se calcula con la tarifa de 2026 de su zona, el de rutina para anteojos con el precio que usted escribe.',
    resume: (h) => {
      const m = h.E('eye-exam-medical', { setting: 'office' }); const o = h.E('eye-exam-medical', { setting: 'hopd' }); const g = h.E('glaucoma-screening');
      return `Medicare Original no cubre los exámenes de la vista de rutina, las refracciones que sirven para recetar anteojos o lentes de contacto: usted paga todo ese costo. Sí cubre, con la Parte B, la atención de los ojos que tiene un motivo médico. Las personas con diabetes tienen un examen de retinopatía diabética una vez al año, hecho por un oculista autorizado por ley para hacer la prueba en su estado. Las personas de alto riesgo tienen pruebas de glaucoma. Los exámenes para diagnosticar o tratar una enfermedad del ojo se cubren como servicios médicos. Todos siguen el deducible de la Parte B, ${h.m(h.PB.deductible)} en 2026, y luego el 20 % del monto aprobado. Un examen médico de los ojos para un paciente establecido tiene un monto aprobado nacional de ${h.m(m.approvedTotal)} en el consultorio del oculista, es decir, ${h.m(m.youPay)} para usted; el mismo examen en un hospital ambulatorio le cuesta ${h.m(o.youPay)} porque el hospital suma su copago. Una prueba de glaucoma para una persona de alto riesgo le deja ${h.m(g.youPay)}. Algunos planes Medicare Advantage ofrecen beneficios de visión que Medicare Original no tiene, incluidos los exámenes de rutina; consulte al plan.`;
    },
    faqs: (h) => [
      { q: '¿Medicare cubre el examen de la vista si tengo diabetes?', a: `Sí, una vez al año: la Parte B cubre un examen de retinopatía diabética si tiene diabetes, hecho por un oculista autorizado por ley para hacer la prueba en su estado. Usted paga el 20 % del monto aprobado después del deducible, más un copago en un hospital ambulatorio. A tarifas nacionales eso son ${h.m(h.E('eye-exam-medical', { setting: 'office' }).youPay)} en un consultorio con el deducible pagado.` },
      { q: '¿Por qué pago el precio completo del examen para anteojos nuevos?', a: 'Porque Medicare excluye los exámenes de la vista de rutina, también llamados refracciones, que sirven para recetar anteojos o lentes de contacto. Aunque la misma visita revise la salud de sus ojos, la parte de la refracción corre por su cuenta. Pida en el consultorio que separen la parte médica, que la Parte B puede cubrir si hay un motivo médico, de la refracción, y su precio, antes de la cita.' },
      { q: '¿Medigap paga un examen de la vista de rutina?', a: 'No. Una póliza Medigap solo paga su parte de los servicios que cubre Medicare. Un examen de rutina para anteojos no tiene monto aprobado por Medicare, así que con cualquier letra el precio completo es suyo. En un examen médico de los ojos cubierto, el plan G paga el 20 % una vez pagado el deducible. Los beneficios de visión para exámenes de rutina solo vienen de un plan Medicare Advantage que los ofrezca, o de otra cobertura.' },
    ],
    body: (h) => {
      const m = h.E('eye-exam-medical', { setting: 'office' }); const o = h.E('eye-exam-medical', { setting: 'hopd' }); const g = h.E('glaucoma-screening');
      const md = h.E('eye-exam-medical', { setting: 'office', deductibleRemaining: h.PB.deductible });
      const man = h.E('eye-exam-medical', { setting: 'office', locality: h.loc(/^Manhattan$/) }); const al = h.E('eye-exam-medical', { setting: 'office', locality: h.defaultLocality('AL') });
      return `
<h2>Cubierto o no: decide el motivo</h2>
${h.table(['Examen', '¿Cubierto?', 'Aprobado', 'Usted paga'], [
  ['Examen de rutina para anteojos o lentes de contacto', 'No', '–', 'Todo'],
  ['Examen de retinopatía diabética, una vez al año', 'Sí, con diabetes', h.m(m.approvedTotal), h.m(m.youPay)],
  ['Examen médico de los ojos, en consultorio', 'Sí', h.m(m.approvedTotal), h.m(m.youPay)],
  ['Examen médico de los ojos, hospital ambulatorio', 'Sí', h.m(o.approvedTotal), h.m(o.youPay)],
  [h.label('glaucoma-screening'), 'Sí, si es de alto riesgo', h.m(g.approvedTotal), h.m(g.youPay)],
], 'Tarifas nacionales de octubre de 2026, Medicare Original, deducible ya pagado, oculista que acepta la asignación. El examen por diabetes se calcula como un examen médico de los ojos para un paciente establecido.', ['l', 'l', 'r', 'r'])}
<p>Una consulta con el oculista puede incluir dos trabajos: revisar la salud del ojo, que Medicare puede pagar si hay un motivo médico, y medir su graduación para anteojos, que nunca paga. La factura puede mostrar entonces una línea cubierta y otra que es toda suya.</p>
<h2>Lo que cambian el deducible y su zona</h2>
<p>Si el examen de la vista es su primera factura de la Parte B del año, el deducible se lleva todo el monto aprobado, y usted paga ${h.m(md.youPay)} en lugar de ${h.m(m.youPay)}. El baremo de médicos también sigue su zona de precios: el mismo examen en consultorio tiene un monto aprobado de ${h.m(man.approvedTotal)} en Manhattan y de ${h.m(al.approvedTotal)} en Alabama. Elija su estado en la calculadora de arriba para ver su monto local.</p>
<!--tool:mini:eyeExam-->
<h2>Dónde se hace el examen</h2>
<p>En el consultorio del oculista, usted paga el 20 % de un solo monto aprobado. En un departamento ambulatorio de hospital, el oculista factura unos honorarios profesionales menores y el hospital añade su cargo de instalación, con su propio copago: ${h.m(o.youPay)} para usted frente a ${h.m(m.youPay)} en un consultorio, a tarifas nacionales. Para un examen anual sin urgencia, el consultorio suele ser lo más barato para usted.</p>
<h2>Medigap en un examen cubierto</h2>
<p>En un examen médico de los ojos, el plan Medigap G paga el 20 % una vez pagado el deducible y le deja ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'G' }).youPay)}; el plan K paga la mitad y le deja ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'K' }).youPay)}. En enero, antes de pagar el deducible, el plan G le deja la parte del deducible, ${h.m(h.E('eye-exam-medical', { setting: 'office', coverage: 'medigap', medigap: 'G', deductibleRemaining: h.PB.deductible }).youPay)} en este caso.</p>
<h2>Después de una cirugía de cataratas</h2>
<p>Medicare no paga los anteojos en general, con una excepción: un par de anteojos con montura estándar, o un juego de lentes de contacto, después de cada cirugía de cataratas que implanta un lente intraocular. La ${h.a('glasses', 'página de los anteojos')} calcula ese par, y la ${h.a('cataract', 'página de la cirugía de cataratas')} la operación.</p>
<h2>Beneficios de visión fuera de Medicare Original</h2>
<p>Algunos planes Medicare Advantage ofrecen beneficios adicionales que Medicare Original no cubre, como servicios de visión. Los montos y la red figuran en el Resumen de beneficios del plan. En la calculadora, elija Medicare Advantage y escriba la asignación que dé el plan junto al precio del examen de rutina para ver lo que le queda. Las reglas salen de la ${h.cov('eye-exam-routine', 'página de medicare.gov sobre los exámenes de rutina')} y de la ${h.cov('eye-exam-medical', 'página de medicare.gov sobre los exámenes por diabetes')}.</p>`;
    },
  },
});
