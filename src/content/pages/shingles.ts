import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'shingles', group: 'cover', order: 9,
  tool: { kind: 'est', props: { act: 'shingles-vaccine', partD: true } },
  mini: { kind: 'mini:shingles' },
  related: ['colonoscopy', 'covid', 'mammograms', 'part-b', 'what-covers', 'home'],
  sources: ['partb', 'whatcovered', 'medigap'],
  acts: ['shingles-vaccine'],
  en: {
    slug: 'does-medicare-cover-shingles-vaccine', nav: 'Shingles vaccine', card: 'Free with a Part D drug plan, not paid by Original Medicare without one.',
    title: 'Shingles Vaccine and Medicare 2026: Part D, Not Part B',
    description: 'The shingles vaccine costs nothing with a Part D drug plan: no deductible, no copay. Without Part D, Original Medicare does not pay for it. See both cases.',
    h1: 'Does Medicare cover the shingles vaccine?',
    intro: 'Yes, through Part D. If you have a Medicare drug plan, the shingles vaccine costs you nothing, with no deductible and no copayment. Original Medicare, Parts A and B, does not pay for it. The tool shows both situations; without Part D, enter the price you were quoted per dose.',
    resume: (h) => {
      const d = h.E('shingles-vaccine', { partD: true });
      return `The shingles vaccine is a Part D benefit, not a Part B one, and that single fact decides what you pay. With a Medicare drug plan you pay ${h.m(d.youPay)}: Part D covers every adult vaccine recommended by the Advisory Committee on Immunization Practices (ACIP) that Part B does not cover, and your plan may not charge a copayment or apply its deductible to those vaccines. The shingles vaccine protects against the varicella-zoster virus, which causes a painful skin rash and sometimes serious complications such as long-lasting pain. If you have only Original Medicare, meaning Parts A and B without a drug plan, Medicare does not pay for the vaccine, and the price charged is yours. The ${h.m(h.PB.deductible)} Part B deductible and the 20 % coinsurance play no role in either case, and a Medigap policy does not help, since it fills gaps in Part A and Part B costs only. The same no-cost rule under Part D applies to other ACIP-recommended adult vaccines, including those for respiratory syncytial virus (RSV), whooping cough and measles. The tool below compares both cases; without Part D, type the price per dose you were quoted to see the total.`;
    },
    faqs: (h) => [
      { q: 'Why is the shingles vaccine under Part D instead of Part B?', a: 'Part B pays for a limited list of preventive services and vaccines, and the shingles vaccine is not on it. Medicare places every other adult vaccine that ACIP recommends under Part D, its drug benefit. The practical consequence is that coverage depends on having a drug plan, not on Part B, so people with Parts A and B only pay for it themselves.' },
      { q: 'Can a Part D plan charge a copay for the shingles shot?', a: `No. For vaccines that ACIP recommends, which include the shingles vaccine, a Part D plan cannot charge a copayment or apply its deductible, so the vaccine costs ${h.m(h.E('shingles-vaccine', { partD: true }).youPay)} even at the start of the year. The rule comes from Medicare itself and applies to every Part D plan, whatever its premium or its copays for other drugs.` },
      { q: 'Does Medigap pay for the shingles vaccine if I have no drug plan?', a: 'No. Medigap policies pay part or all of the coinsurance, copayments and deductibles of Medicare Part A and Part B. The shingles vaccine is not a Part A or Part B service, so there is no share for a Medigap policy to pay. Without a Part D plan or other drug coverage, the price charged for the vaccine is your cost.' },
    ],
    body: (h) => {
      const d = h.E('shingles-vaccine', { partD: true });
      return `
<h2>One vaccine, two very different bills</h2>
<p>For most services on this site, the cost question is about percentages: the deductible, then 20 %. The shingles vaccine works differently. It is covered by Medicare drug coverage, Part D, and not by Part B. With Part D the answer is ${h.m(d.youPay)}. Without it, Original Medicare pays nothing toward the vaccine. There is no middle case in which Medicare pays part of it.</p>
${h.table(['Your coverage', 'Who pays', 'Your cost'], [
  ['Original Medicare with a Part D drug plan', 'The Part D plan, in full', h.m(d.youPay)],
  ['Original Medicare without a drug plan', 'Nobody in Medicare', 'Price charged'],
  ['Original Medicare with Medigap, no drug plan', 'Medigap does not cover it', 'Price charged'],
], 'Rule from medicare.gov, shingles vaccines; ACIP-recommended adult vaccines under Part D carry no deductible and no copayment.', ['l', 'l', 'r'])}
<h2>What the Part D rule guarantees</h2>
<p>Medicare's text is short and leaves little room: Part D covers all adult vaccines recommended by ACIP that are not covered under Part B, and your Part D plan will not charge a copayment or apply a deductible for them. That means the vaccine is free even in January, before you have spent anything else on prescriptions, whatever copays your plan charges for other prescriptions.</p>
<p>The same rule reaches beyond shingles. Medicare cites the vaccines for respiratory syncytial virus, for whooping cough and for measles among the ACIP-recommended adult vaccines that Part D covers at no cost. If you are planning several vaccines, the same answer applies to each of them.</p>
<h2>If you have no Medicare drug plan</h2>
<p>Parts A and B alone do not cover the shingles vaccine. In that case the price charged by the provider is what you pay, and the tool takes that price per dose to show the total. Medigap does not change the outcome, because the policies sold under that name only share Part A and Part B costs. Other drug coverage you may hold, through an employer for example, may pay for it; check with that plan.</p>
<p>The amount you are asked to pay depends on factors Medicare lists for any service: other insurance you may have, how much the provider charges, whether the provider accepts assignment, the type of facility and where you get the vaccine. Asking for the price before the appointment avoids a surprise at the counter.</p>
<!--tool:mini:basket-->
<h2>What the vaccine is for</h2>
<p>Medicare describes shingles vaccines as protection against the varicella-zoster virus, which causes a painful skin rash and sometimes serious complications, long-term pain among them. Whether and when to be vaccinated is a medical question for your doctor; this page covers only the cost.</p>
<h2>Where the vaccine sits among preventive services</h2>
<p>Part B covers many preventive services at no cost when the provider accepts assignment, such as ${h.a('colonoscopy', 'screening colonoscopies')} or ${h.a('mammograms', 'screening mammograms')}. The shingles vaccine is the exception that surprises people, because it looks like a preventive service but is paid by the drug plan. If you are comparing Part D plans during an enrollment period, its cost will be the same in all of them; the difference between plans lies elsewhere.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-vacuna-culebrilla', nav: 'Vacuna contra la culebrilla', card: 'Gratis con un plan de medicamentos de la Parte D; Medicare Original no la paga sin él.',
    title: 'Vacuna contra la culebrilla y Medicare 2026: Parte D, no B',
    description: 'La vacuna contra la culebrilla no cuesta nada con un plan de la Parte D: ni deducible ni copago. Sin Parte D, Medicare Original no la paga. Vea los dos casos.',
    h1: '¿Medicare cubre la vacuna contra la culebrilla?',
    intro: 'Sí, por medio de la Parte D. Si tiene un plan de medicamentos de Medicare, la vacuna contra la culebrilla (herpes zóster) no le cuesta nada, sin deducible ni copago. Medicare Original, las Partes A y B, no la paga. La herramienta muestra los dos casos; sin Parte D, escriba el precio por dosis que le dieron.',
    resume: (h) => {
      const d = h.E('shingles-vaccine', { partD: true });
      return `La vacuna contra la culebrilla es un beneficio de la Parte D, no de la Parte B, y ese solo dato decide lo que usted paga. Con un plan de medicamentos de Medicare paga ${h.m(d.youPay)}: la Parte D cubre todas las vacunas para adultos que recomienda el Comité Asesor sobre Prácticas de Inmunización (ACIP) y que la Parte B no cubre, y su plan no puede cobrar un copago ni aplicar su deducible a esas vacunas. La vacuna protege contra el virus de la varicela-zóster, que causa una erupción dolorosa en la piel y a veces complicaciones graves, como un dolor que dura mucho tiempo. Si solo tiene Medicare Original, es decir, las Partes A y B sin plan de medicamentos, Medicare no paga la vacuna y el precio que le cobren corre por su cuenta. El deducible de la Parte B de ${h.m(h.PB.deductible)} y el coseguro del 20 % no intervienen en ningún caso, y una póliza Medigap no ayuda, porque solo cubre huecos de los costos de las Partes A y B. La misma regla sin costo de la Parte D se aplica a otras vacunas para adultos recomendadas por el ACIP, como las del virus respiratorio sincitial (VRS), la tos ferina y el sarampión. La herramienta compara los dos casos; sin Parte D, escriba el precio por dosis para ver el total.`;
    },
    faqs: (h) => [
      { q: '¿Por qué la vacuna contra la culebrilla está en la Parte D y no en la Parte B?', a: 'La Parte B paga una lista limitada de servicios preventivos y vacunas, y la vacuna contra la culebrilla no está en ella. Medicare coloca las demás vacunas para adultos que recomienda el ACIP en la Parte D, su beneficio de medicamentos. En la práctica, la cobertura depende de tener un plan de medicamentos y no de la Parte B, así que quien solo tiene las Partes A y B la paga de su bolsillo.' },
      { q: '¿Un plan de la Parte D puede cobrar un copago por la vacuna contra la culebrilla?', a: `No. Para las vacunas que recomienda el ACIP, entre ellas la de la culebrilla, un plan de la Parte D no puede cobrar copago ni aplicar su deducible, así que la vacuna cuesta ${h.m(h.E('shingles-vaccine', { partD: true }).youPay)} incluso a principios de año. La regla viene de Medicare y vale para todos los planes de la Parte D, sea cual sea su prima o sus copagos para otros medicamentos.` },
      { q: '¿Medigap paga la vacuna contra la culebrilla si no tengo plan de medicamentos?', a: 'No. Las pólizas Medigap pagan una parte o la totalidad del coseguro, los copagos y los deducibles de las Partes A y B de Medicare. La vacuna contra la culebrilla no es un servicio de la Parte A ni de la Parte B, así que no hay ninguna parte que Medigap pueda pagar. Sin un plan de la Parte D u otra cobertura de medicamentos, el precio de la vacuna es su costo.' },
    ],
    body: (h) => {
      const d = h.E('shingles-vaccine', { partD: true });
      return `
<h2>Una vacuna, dos facturas muy distintas</h2>
<p>En casi todos los servicios de este sitio, la pregunta del costo es de porcentajes: el deducible y luego el 20 %. La vacuna contra la culebrilla funciona de otra manera. La cubre la cobertura de medicamentos de Medicare, la Parte D, y no la Parte B. Con la Parte D la respuesta es ${h.m(d.youPay)}. Sin ella, Medicare Original no paga nada por la vacuna. No hay un caso intermedio en el que Medicare pague una parte.</p>
${h.table(['Su cobertura', 'Quién paga', 'Su costo'], [
  ['Medicare Original con un plan de la Parte D', 'El plan de la Parte D, por completo', h.m(d.youPay)],
  ['Medicare Original sin plan de medicamentos', 'Nadie dentro de Medicare', 'Precio cobrado'],
  ['Medicare Original con Medigap, sin plan de medicamentos', 'Medigap no la cubre', 'Precio cobrado'],
], 'Regla de medicare.gov sobre las vacunas contra la culebrilla; las vacunas para adultos recomendadas por el ACIP en la Parte D no tienen deducible ni copago.', ['l', 'l', 'r'])}
<h2>Lo que garantiza la regla de la Parte D</h2>
<p>El texto de Medicare es breve y deja poco margen: la Parte D cubre todas las vacunas para adultos recomendadas por el ACIP que no cubre la Parte B, y su plan de la Parte D no le cobrará copago ni aplicará deducible por ellas. Es decir, la vacuna es gratuita incluso en enero, antes de que haya gastado nada en recetas, sean cuales sean los copagos de su plan para otras recetas.</p>
<p>La misma regla va más allá de la culebrilla. Medicare cita las vacunas contra el virus respiratorio sincitial, la tos ferina y el sarampión entre las vacunas para adultos recomendadas por el ACIP que la Parte D cubre sin costo. Si piensa ponerse varias, la respuesta es la misma para cada una.</p>
<h2>Si no tiene plan de medicamentos de Medicare</h2>
<p>Las Partes A y B por sí solas no cubren la vacuna contra la culebrilla. En ese caso, el precio que cobra el proveedor es lo que usted paga, y la herramienta toma ese precio por dosis para mostrar el total. Medigap no cambia el resultado, porque las pólizas que llevan ese nombre solo comparten costos de las Partes A y B. Otra cobertura de medicamentos que tenga, por ejemplo la de un empleador, puede pagarla; consulte con ese plan.</p>
<p>El monto que le pidan depende de factores que Medicare menciona para cualquier servicio: otro seguro que tenga, cuánto cobra el proveedor, si acepta la asignación, el tipo de centro y el lugar donde se vacuna. Preguntar el precio antes de la cita evita una sorpresa en el mostrador.</p>
<!--tool:mini:basket-->
<h2>Para qué sirve la vacuna</h2>
<p>Medicare describe las vacunas contra la culebrilla como una protección contra el virus de la varicela-zóster, que causa una erupción dolorosa en la piel y a veces complicaciones graves, entre ellas un dolor prolongado. Si conviene vacunarse y cuándo es una pregunta médica para su doctor; esta página trata solo del costo.</p>
<h2>El lugar de la vacuna entre los servicios preventivos</h2>
<p>La Parte B cubre muchos servicios preventivos sin costo cuando el proveedor acepta la asignación, como la ${h.a('colonoscopy', 'colonoscopia de detección')} o la ${h.a('mammograms', 'mamografía de detección')}. La vacuna contra la culebrilla es la excepción que sorprende, porque parece un servicio preventivo pero la paga el plan de medicamentos. Si compara planes de la Parte D durante un período de inscripción, su costo será el mismo en todos; la diferencia entre planes está en otra parte.</p>`;
    },
  },
});
