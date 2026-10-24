import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'hearing-aids', group: 'cover', order: 1,
  tool: { kind: 'est', props: { act: 'hearing-aids', acts: ['hearing-aids', 'hearing-exam'] } },
  mini: { kind: 'mini:hearing' },
  related: ['dental', 'glasses', 'eye-exams', 'not-covered', 'part-b', 'home'],
  sources: ['notcovered', 'pfs', 'opps', 'assignment', 'medigap'],
  acts: ['hearing-aids', 'hearing-exam'],
  en: {
    slug: 'does-medicare-cover-hearing-aids', nav: 'Hearing aids', card: 'Why the devices and their fitting are yours to pay, and what Part B pays for a diagnostic hearing test.',
    title: 'Hearing Aids and Medicare 2026: Coverage, Tests and Costs',
    description: 'Original Medicare pays nothing toward hearing aids or the exams to fit them. See what Part B pays for a diagnostic hearing test in 2026 and what is left to you.',
    h1: 'Does Medicare cover hearing aids?',
    intro: 'No. Original Medicare leaves the full price of hearing aids and their fitting to you, but Part B does pay for a diagnostic hearing test. The tool below prices both: the aids at the quote you received, minus any plan allowance, and the test at 2026 rates.',
    resume: (h) => {
      const ex = h.E('hearing-exam');
      const first = h.E('hearing-exam', { deductibleRemaining: h.PB.deductible });
      const hx = h.E('hearing-exam', { setting: 'hopd' });
      return `Original Medicare, meaning Part A and Part B, does not pay for hearing aids and does not pay for the exams used to fit them, so the price of the devices, the fitting appointments and later adjustments is entirely yours, whatever the degree of hearing loss. What Part B does cover is a diagnostic hearing and balance exam that your doctor or another provider orders to find out whether you need medical treatment. At national 2026 rates that exam has a Medicare-approved amount of ${h.m(ex.approvedTotal)} in an office, so your 20 % comes to ${h.m(ex.youPay)} once the ${h.m(h.PB.deductible)} Part B deductible is behind you; if it is your first Part B bill of the year, the deductible absorbs it and you pay ${h.m(first.youPay)}. In a hospital outpatient department the hospital adds its own fee, the test is approved ${h.m(hx.approvedTotal)} and you pay ${h.m(hx.youPay)}. Once every 12 months you may see an audiologist without an order for hearing loss that has built up over many years. Medigap pays nothing toward the aids, since it only shares costs Medicare approves. Some Medicare Advantage plans add a hearing benefit; enter its allowance in the tool to see what remains.`;
    },
    faqs: (h) => {
      const ex = h.E('hearing-exam');
      const g = h.E('hearing-exam', { coverage: 'medigap', medigap: 'G' });
      return [
        { q: 'Will Medicare pay for a hearing test if I think I need hearing aids?', a: `It depends on why the test is done. Part B pays for a diagnostic hearing exam when your doctor orders it to find out whether you need medical treatment: the approved amount is ${h.m(ex.approvedTotal)} at national rates and your share ${h.m(ex.youPay)} with the deductible met. An exam whose purpose is to select and fit hearing aids is not covered, and you pay its full price.` },
        { q: 'Can I see an audiologist without a referral under Medicare?', a: 'Yes, once every 12 months, but only for non-acute hearing conditions such as hearing loss that develops over many years, or for diagnostic services tied to hearing loss treated with a surgically implanted hearing device. Any other audiology visit needs an order from your doctor or another health care provider to be covered by Part B.' },
        { q: 'Does a Medigap policy help pay for hearing aids?', a: `No. A Medigap policy pays its share only after Medicare approves a cost, and hearing aids have no Medicare-approved amount, so there is nothing for it to share. It does help with the diagnostic test: with Plan G and the deductible met, your ${h.m(ex.youPay)} for an office test falls to ${h.m(g.youPay)}. The aids themselves stay at the full price you are quoted.` },
        { q: 'Where can help with the cost of hearing aids come from?', a: 'Medicare lists three possibilities: other health coverage you have, a Medicare Advantage plan, or a Medicare Cost plan or PACE plan that includes hearing services. These plans may offer extra benefits that Original Medicare does not, such as hearing, vision or dental care. The amount and the conditions are set by each plan, so contact the plan for its own rules.' },
      ];
    },
    body: (h) => {
      const ex = h.E('hearing-exam');
      const first = h.E('hearing-exam', { deductibleRemaining: h.PB.deductible });
      const hx = h.E('hearing-exam', { setting: 'hopd' });
      const np = h.E('hearing-exam', { assignment: false });
      const ny = h.E('hearing-exam', { locality: h.loc(/^Manhattan$/) });
      const al = h.E('hearing-exam', { locality: h.defaultLocality('AL') });
      return `
<h2>The devices and the test are two separate questions</h2>
<p>People often ask whether Medicare covers hearing aids when they really need two answers. The first concerns the devices: Original Medicare does not pay for hearing aids, nor for the appointments in which an audiologist selects, programs and fits them. The second concerns the diagnosis: Part B pays for a hearing and balance exam when a provider orders it to decide whether you need medical treatment. The two can happen in the same clinic, a few days apart, and still be billed under completely different rules.</p>
${h.table(['What you get', 'Medicare-approved amount', 'You pay'], [
  ['Hearing aids and fitting exams', 'None', 'Full price'],
  ['Diagnostic hearing test, office, deductible met', h.m(ex.approvedTotal), h.m(ex.youPay)],
  ['Same test, first Part B bill of the year', h.m(first.approvedTotal), h.m(first.youPay)],
  ['Same test, hospital outpatient department', h.m(hx.approvedTotal), h.m(hx.youPay)],
], 'Original Medicare only, national 2026 rates (physician fee schedule and hospital outpatient addendum, October 2026).', ['l', 'r', 'r'])}
<h2>What makes a hearing exam diagnostic</h2>
<p>The word that matters on the order is treatment. Part B covers diagnostic hearing and balance exams, including balance checks for fall risk, when your doctor or another health care provider orders them to find out whether you need medical care. A test meant to measure your loss so that a device can be chosen and adjusted falls on the other side of the line, together with the hearing aids themselves.</p>
<p>There is one shortcut. Once every 12 months you can book an audiologist directly, with no order, for a non-acute condition such as hearing loss that has developed slowly over the years, or for diagnostic services related to hearing loss treated with a surgically implanted device. Outside that yearly visit, an order is what makes the exam payable by Part B.</p>
<h2>Where the test is done changes your share</h2>
<p>In an audiologist's or doctor's office there is one bill, the professional fee, and you owe 20 % of it. In a hospital outpatient department the professional fee is lower but the hospital adds a facility charge, and you pay a hospital copayment on top of your 20 %. At national rates that turns ${h.m(ex.youPay)} into ${h.m(hx.youPay)} for the same test. Office fees also follow local costs: the test leaves you ${h.m(ny.youPay)} in Manhattan and ${h.m(al.youPay)} in most of Alabama with the deductible met. Choose your state and price area in the tool above to see your own figure.</p>
<h2>Paying for the aids yourself</h2>
<p>Because hearing aids are not a Medicare-covered item, there is no approved amount, no 20 % and no limit on what a seller may charge. Whatever you are quoted is what you owe under Original Medicare. The same goes for the fitting appointments and the follow-up adjustments, which Medicare treats as part of the same non-covered service.</p>
<p>Ask for the price in writing before you commit, and ask what it includes. A quote that bundles the devices with several follow-up visits is easier to compare with another one that bills each visit separately. Medicare's own advice applies here: when a provider recommends something, ask why, and ask what Medicare will actually pay, since you could end up with costs you did not expect.</p>
<!--tool:mini:basket-->
<h2>Help that comes from outside Original Medicare</h2>
<p>Medicare names the places where hearing coverage can come from. Some Medicare Advantage plans include extra benefits that Original Medicare lacks, hearing among them, and so may a Medicare Cost plan or a Program of All-inclusive Care for the Elderly (PACE). Other health coverage, for example through an employer, may also pay part of the cost. An Advantage plan must give you at least the coverage of Original Medicare, so the diagnostic test stays covered there too, with the plan's own copay.</p>
<p>A plan's hearing benefit usually takes the form of an allowance or a set price. Type the allowance and the quote into the tool above: it subtracts one from the other and shows the rest as yours. Medigap works differently. It fills gaps in costs that Medicare approves, which means it can pay your share of a diagnostic test but not a cent of the hearing aids.</p>
<h2>Assignment and the price of the test</h2>
<p>An audiologist who accepts assignment takes the Medicare-approved amount as full payment and can bill you only the deductible and the 20 %. One who does not accept assignment may charge up to 15 % above the amount Medicare allows for non-participating providers. For the office test at national rates, that moves your bill from ${h.m(ex.youPay)} to ${h.m(np.youPay)}. The gap is small on a single test, but the question costs nothing to ask when you book. A provider who has opted out of Medicare entirely is a different case: Medicare pays nothing for the visit, outside emergencies.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-audifonos', nav: 'Audífonos', card: 'Por qué los aparatos y su adaptación corren por su cuenta, y lo que paga la Parte B por una prueba de audición.',
    title: 'Audífonos y Medicare 2026: cobertura, pruebas y costos',
    description: 'Medicare Original no paga los audífonos ni los exámenes para adaptarlos. Vea lo que paga la Parte B por una prueba diagnóstica de audición en 2026 y su parte.',
    h1: '¿Medicare cubre los audífonos?',
    intro: 'No. Medicare Original deja a su cargo el precio completo de los audífonos y de su adaptación, aunque la Parte B sí paga una prueba diagnóstica de audición. La herramienta calcula las dos cosas: los audífonos al precio que le cotizaron, menos la asignación de su plan, y la prueba con las tarifas de 2026.',
    resume: (h) => {
      const ex = h.E('hearing-exam');
      const first = h.E('hearing-exam', { deductibleRemaining: h.PB.deductible });
      const hx = h.E('hearing-exam', { setting: 'hopd' });
      return `Medicare Original, es decir, las Partes A y B, no paga los audífonos ni los exámenes que sirven para adaptarlos, así que el precio de los aparatos, de las citas de ajuste y de los retoques posteriores corre por su cuenta, sea cual sea su pérdida auditiva. Lo que sí cubre la Parte B es el examen diagnóstico de audición y equilibrio que su médico u otro proveedor indica para saber si usted necesita tratamiento médico. Con las tarifas nacionales de 2026, ese examen tiene un monto aprobado de ${h.m(ex.approvedTotal)} en un consultorio y su 20 % es de ${h.m(ex.youPay)} una vez pagado el deducible de la Parte B de ${h.m(h.PB.deductible)}; si es su primera factura de la Parte B en el año, el deducible la absorbe y usted paga ${h.m(first.youPay)}. En el departamento ambulatorio de un hospital se suma la tarifa del hospital: la prueba tiene un monto aprobado de ${h.m(hx.approvedTotal)} y usted paga ${h.m(hx.youPay)}. Una vez cada 12 meses puede ir al audiólogo sin orden médica por una pérdida auditiva que avanzó durante años. Medigap no paga nada de los audífonos, porque solo comparte costos que Medicare aprueba. Algunos planes Medicare Advantage incluyen un beneficio auditivo: escriba su asignación en la herramienta para ver lo que le queda.`;
    },
    faqs: (h) => {
      const ex = h.E('hearing-exam');
      const g = h.E('hearing-exam', { coverage: 'medigap', medigap: 'G' });
      return [
        { q: '¿Medicare paga la prueba de audición si creo que necesito audífonos?', a: `Depende del motivo. La Parte B paga el examen diagnóstico cuando su médico lo indica para saber si usted necesita tratamiento médico: el monto aprobado es de ${h.m(ex.approvedTotal)} a tarifa nacional y su parte de ${h.m(ex.youPay)} con el deducible pagado. Un examen cuyo fin es elegir y adaptar audífonos no está cubierto, y usted paga su precio completo.` },
        { q: '¿Puedo ir al audiólogo sin orden médica con Medicare?', a: 'Sí, una vez cada 12 meses, pero solo por afecciones auditivas que no son agudas, como una pérdida que avanza a lo largo de los años, o por servicios diagnósticos ligados a una pérdida tratada con un dispositivo auditivo implantado por cirugía. Cualquier otra visita al audiólogo necesita la orden de su médico u otro proveedor para que la cubra la Parte B.' },
        { q: '¿Una póliza Medigap ayuda a pagar los audífonos?', a: `No. Medigap paga su parte solo cuando Medicare aprueba un costo, y los audífonos no tienen monto aprobado por Medicare, así que no hay nada que compartir. Sí ayuda con la prueba diagnóstica: con el Plan G y el deducible pagado, sus ${h.m(ex.youPay)} por la prueba en consultorio bajan a ${h.m(g.youPay)}. Los aparatos siguen al precio completo que le cotizan.` },
        { q: '¿De dónde puede venir la ayuda para pagar los audífonos?', a: 'Medicare menciona tres vías: otra cobertura de salud que usted tenga, un plan Medicare Advantage, o un plan de costo de Medicare o un plan PACE que incluya servicios auditivos. Estos planes pueden ofrecer beneficios que Medicare Original no tiene, como audición, visión o atención dental. Cada plan fija el monto y las condiciones, así que consulte directamente con el suyo.' },
      ];
    },
    body: (h) => {
      const ex = h.E('hearing-exam');
      const first = h.E('hearing-exam', { deductibleRemaining: h.PB.deductible });
      const hx = h.E('hearing-exam', { setting: 'hopd' });
      const np = h.E('hearing-exam', { assignment: false });
      const ny = h.E('hearing-exam', { locality: h.loc(/^Manhattan$/) });
      const al = h.E('hearing-exam', { locality: h.defaultLocality('AL') });
      return `
<h2>Los aparatos y la prueba son dos preguntas distintas</h2>
<p>Quien pregunta si Medicare cubre los audífonos suele necesitar dos respuestas. La primera es sobre los aparatos: Medicare Original no paga los audífonos ni las citas en las que el audiólogo los elige, los programa y los adapta. La segunda es sobre el diagnóstico: la Parte B paga un examen de audición y equilibrio cuando un proveedor lo indica para decidir si usted necesita tratamiento médico. Las dos cosas pueden ocurrir en la misma clínica, con pocos días de diferencia, y facturarse con reglas totalmente distintas.</p>
${h.table(['Lo que recibe', 'Monto aprobado por Medicare', 'Usted paga'], [
  ['Audífonos y exámenes de adaptación', 'Ninguno', 'Precio completo'],
  ['Prueba diagnóstica, consultorio, deducible pagado', h.m(ex.approvedTotal), h.m(ex.youPay)],
  ['La misma prueba, primera factura del año', h.m(first.approvedTotal), h.m(first.youPay)],
  ['La misma prueba, hospital ambulatorio', h.m(hx.approvedTotal), h.m(hx.youPay)],
], 'Solo Medicare Original, tarifas nacionales de 2026 (baremo de médicos y anexo de hospitales ambulatorios, octubre de 2026).', ['l', 'r', 'r'])}
<h2>Cuándo un examen de audición es diagnóstico</h2>
<p>La palabra clave en la orden es tratamiento. La Parte B cubre los exámenes diagnósticos de audición y de equilibrio, incluido el control del riesgo de caídas, cuando su médico u otro proveedor los indica para saber si usted necesita atención médica. Una prueba hecha para medir su pérdida y así escoger y ajustar un aparato queda del otro lado, junto con los audífonos.</p>
<p>Existe un atajo. Una vez cada 12 meses puede pedir cita con un audiólogo directamente, sin orden, por una afección que no es aguda, como una pérdida auditiva que se instaló poco a poco, o por servicios diagnósticos relacionados con una pérdida tratada con un dispositivo implantado. Fuera de esa visita anual, es la orden médica la que hace que la Parte B pague el examen.</p>
<h2>El lugar de la prueba cambia lo que paga</h2>
<p>En el consultorio del audiólogo o del médico hay una sola factura, los honorarios profesionales, y usted debe el 20 %. En el departamento ambulatorio de un hospital esos honorarios son menores, pero el hospital agrega su propio cargo y usted paga un copago al hospital además de su 20 %. A tarifa nacional, eso convierte ${h.m(ex.youPay)} en ${h.m(hx.youPay)} por la misma prueba. Los honorarios de consultorio también siguen los costos locales: la prueba le cuesta ${h.m(ny.youPay)} en Manhattan y ${h.m(al.youPay)} en casi todo Alabama con el deducible pagado. Elija su estado y su zona en la herramienta para ver su cifra.</p>
<h2>Pagar los audífonos de su bolsillo</h2>
<p>Como los audífonos no son un artículo cubierto por Medicare, no tienen monto aprobado, no hay 20 % y no hay límite a lo que puede cobrar el vendedor. Lo que le cotizan es lo que usted debe con Medicare Original. Lo mismo vale para las citas de adaptación y los ajustes posteriores, que Medicare trata como parte del mismo servicio no cubierto.</p>
<p>Pida el precio por escrito antes de comprometerse y pregunte qué incluye. Una cotización que agrupa los aparatos con varias visitas de seguimiento se compara mejor con otra que cobra cada visita por separado. El consejo de Medicare vale aquí: cuando un proveedor le recomiende algo, pregunte el motivo y cuánto pagará Medicare en realidad, porque podría acabar con gastos que no esperaba.</p>
<!--tool:mini:basket-->
<h2>La ayuda que viene de fuera de Medicare Original</h2>
<p>Medicare indica de dónde puede venir una cobertura auditiva. Algunos planes Medicare Advantage incluyen beneficios que Medicare Original no tiene, entre ellos la audición, y lo mismo puede ocurrir con un plan de costo de Medicare o con el Programa de Atención Integral para Personas Mayores (PACE). Otra cobertura de salud, por ejemplo la de un empleador, también puede pagar una parte. Un plan Advantage debe darle por lo menos la cobertura de Medicare Original, así que la prueba diagnóstica sigue cubierta, con el copago propio del plan.</p>
<p>El beneficio auditivo de un plan suele ser una asignación o un precio fijo. Escriba la asignación y la cotización en la herramienta: resta una de la otra y le muestra lo que queda a su cargo. Medigap funciona de otro modo. Completa los costos que Medicare aprueba, de modo que puede pagar su parte de una prueba diagnóstica, pero ni un centavo de los audífonos.</p>
<h2>La asignación y el precio de la prueba</h2>
<p>Un audiólogo que acepta la asignación toma el monto aprobado por Medicare como pago total y solo puede cobrarle el deducible y el 20 %. Uno que no la acepta puede cobrar hasta un 15 % por encima del monto que Medicare permite a los proveedores no participantes. Para la prueba en consultorio a tarifa nacional, su factura pasa de ${h.m(ex.youPay)} a ${h.m(np.youPay)}. La diferencia es pequeña en una sola prueba, pero preguntarlo al pedir la cita no cuesta nada. Un proveedor que se retiró por completo de Medicare es otro caso: Medicare no paga nada por esa visita, salvo en emergencias.</p>`;
    },
  },
});
