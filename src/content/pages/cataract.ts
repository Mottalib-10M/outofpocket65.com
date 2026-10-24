import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cataract', group: 'cover', order: 3,
  tool: { kind: 'est', props: { act: 'cataract-surgery', setting: 'asc' } },
  mini: { kind: 'mini:cataractTwo' },
  related: ['glasses', 'eye-exams', 'part-b', 'deductible', 'home'],
  sources: ['asc', 'opps', 'pfs', 'cms_fs2026'],
  acts: ['cataract-surgery', 'glasses-after-cataract'],
  en: {
    slug: 'does-medicare-cover-cataract-surgery', nav: 'Cataract surgery', card: 'Surgeon and facility fees for one eye, surgery center or hospital, and the glasses after.',
    title: 'Cataract Surgery and Medicare 2026: What You Pay per Eye',
    description: 'Medicare Part B covers cataract surgery with a standard lens. See the 2026 approved amount for surgeon and facility, your 20 % and the glasses after it.',
    h1: 'Does Medicare cover cataract surgery, and what will you pay?',
    intro: 'Yes, Part B covers it with a standard lens implant. The estimator below prices one eye with the surgeon’s fee for your area and the facility rate CMS pays in October 2026.',
    resume: (h) => {
      const asc = h.E('cataract-surgery', { setting: 'asc', deductibleRemaining: h.PB.deductible });
      const hop = h.E('cataract-surgery', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      return `Medicare Part B pays for cataract surgery that removes the clouded lens and implants a conventional intraocular lens, and two bills come out of it: one from the surgeon and one from the place where the surgery is done. At national rates in October 2026, the surgeon is approved ${h.m(asc.lines[0].approved)} and an ambulatory surgery center ${h.m(asc.lines[1].approved)}, so the eye costs ${h.m(asc.approvedTotal)} in total. With Original Medicare alone and the ${h.m(h.PB.deductible)} Part B deductible still to pay, your share is ${h.m(asc.youPay)}: the deductible, then 20 % of the rest. The same eye in a hospital outpatient department is approved ${h.m(hop.approvedTotal)} and leaves you ${h.m(hop.youPay)}, because the hospital rate is almost twice the surgery center rate. A Medigap Plan G brings the bill down to the deductible alone; Plans C and F, open only to people eligible before 2020, bring it to zero. Premium lenses that also correct astigmatism or near vision cost extra, and Medicare does not pay that difference.`;
    },
    faqs: (h) => {
      const g = h.E('glasses-after-cataract', { state: 'FL' });
      return [
        { q: 'Is the second eye cheaper than the first?', a: `Usually, because the Part B deductible of ${h.m(h.PB.deductible)} is paid once a year. If both eyes are done in the same calendar year, the second one costs you 20 % of its approved amount and nothing more. If the second eye slips into January, the new year's deductible applies again, so timing the two surgeries can save you the deductible once.` },
        { q: 'Does Medicare pay for glasses after cataract surgery?', a: `Yes, one pair of glasses with standard frames, or one set of contact lenses, after each surgery that implants a lens. In Florida the approved amount for a standard frame and two single-vision lenses is ${h.m(g.approvedTotal)}, so your 20 % is about ${h.m(g.youPay)} once the deductible is met. A frame above the allowance costs you the difference, and the glasses must come from a supplier enrolled in Medicare.` },
        { q: 'Why is the hospital so much more expensive than a surgery center?', a: `CMS pays a hospital outpatient department ${h.m(h.E('cataract-surgery', { setting: 'hopd' }).lines[1].approved)} for the same eye and an ambulatory surgery center ${h.m(h.E('cataract-surgery', { setting: 'asc' }).lines[1].approved)}, before local wage adjustments. Your 20 % follows the facility rate, so choosing a surgery center lowers your share with the same surgeon fee. Ask the surgeon's office which facility it uses before the date is set.` },
        { q: 'Are premium lenses for astigmatism covered?', a: 'Medicare pays its usual amount for the surgery and for a conventional lens. A toric lens for astigmatism or a lens that also corrects near vision is allowed, but the extra charge for the premium lens and the added exams are yours to pay. Ask for that price before the surgery date: it is not a Medicare-approved cost, so Medigap does not pay it either.' },
      ];
    },
    body: (h) => {
      const asc = h.E('cataract-surgery', { setting: 'asc' });
      const hop = h.E('cataract-surgery', { setting: 'hopd' });
      const man = h.E('cataract-surgery', { setting: 'asc', locality: h.loc(/^Manhattan$/) });
      const al = h.E('cataract-surgery', { setting: 'asc', locality: h.defaultLocality('AL') });
      const n = h.E('cataract-surgery', { setting: 'asc', coverage: 'medigap', medigap: 'N', deductibleRemaining: h.PB.deductible });
      return `
<h2>Two bills for one eye</h2>
<p>Cataract surgery under Medicare is never a single price. The surgeon bills Part B under the physician fee schedule, and the facility bills its own rate. The facility rate covers the operating room, the nurses, the anesthesia supplies and the conventional lens itself.</p>
${h.table(['Line', 'Surgery center', 'Hospital outpatient'], [
  ['Surgeon, national rate', h.m(asc.lines[0].approved), h.m(hop.lines[0].approved)],
  ['Facility', h.m(asc.lines[1].approved), h.m(hop.lines[1].approved)],
  ['Approved for the eye', h.m(asc.approvedTotal), h.m(hop.approvedTotal)],
  ['You pay, deductible already met', h.m(asc.youPay), h.m(hop.youPay)],
], 'One eye, conventional lens, Original Medicare only, CMS rates for October 2026 (facility rates before local wage adjustment).', ['l', 'r', 'r'])}
<h2>Where you live changes the surgeon's fee</h2>
<p>The physician fee schedule is adjusted for ${h.LOCALITIES.length} local price areas. The same surgery center eye leaves you ${h.m(man.youPay)} in Manhattan and ${h.m(al.youPay)} in Alabama with the deductible met, against ${h.m(asc.youPay)} at national rates. Facility rates also vary with each hospital's local wage index, which CMS applies to each facility; the estimator shows the national facility rate and says so. Pick your state and area in the tool to see your surgeon's fee.</p>
<h2>What Medigap changes, letter by letter</h2>
<p>A Medigap policy pays after Original Medicare. Plan G pays all of your 20 % but not the Part B deductible, so a first eye in January costs you ${h.m(h.PB.deductible)} and a second eye later that year costs nothing. Plan N also pays the 20 %, which leaves ${h.m(n.youPay)} for the first eye with the deductible still due; its small copay applies to office visits, not to the surgery. Plans K and L pay half or three quarters of your share. The coverage menu of the estimator above lists every letter.</p>
<h2>Medicare Advantage plans</h2>
<p>An Advantage plan must cover cataract surgery, but it sets its own copays and often requires prior authorization and an in-network surgeon. Some plans charge a flat copay for outpatient surgery, others a percentage. Enter your plan's figure and what is left under its yearly out-of-pocket limit, both in the Summary of Benefits, and the estimator applies them to the approved amount.</p>
<!--tool:mini:glasses-->
<h2>Before the surgery date</h2>
<p>Ask three questions. Which facility will be used, surgery center or hospital outpatient department? Does the surgeon accept assignment, so that the approved amount is the full fee? Is a premium lens being proposed, and at what price? The answers decide most of what you will pay, and the first two can change your share by several hundred dollars with the same doctor.</p>
<p>Keep the paperwork that follows. The Medicare Summary Notice lists each line with its approved amount and the part marked as yours; compare it with the bills from the surgeon and the facility before paying. A bill above your 20 % from a provider who accepts assignment is a billing error to raise with the office, not a price to negotiate.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-cirugia-de-cataratas', nav: 'Cirugía de cataratas', card: 'Honorarios del cirujano y del centro por un ojo, centro de cirugía u hospital, y los anteojos después.',
    title: 'Cirugía de cataratas y Medicare 2026: lo que paga por ojo',
    description: 'La Parte B cubre la cirugía de cataratas con lente estándar. Vea el monto aprobado de 2026 del cirujano y del centro, su 20 % y los anteojos de después.',
    h1: '¿Medicare cubre la cirugía de cataratas y cuánto pagará?',
    intro: 'Sí, la Parte B la cubre con un lente intraocular estándar. La calculadora pone precio a un ojo con los honorarios del cirujano de su zona y la tarifa del centro que paga CMS en octubre de 2026.',
    resume: (h) => {
      const asc = h.E('cataract-surgery', { setting: 'asc', deductibleRemaining: h.PB.deductible });
      const hop = h.E('cataract-surgery', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      return `La Parte B de Medicare paga la cirugía de cataratas que retira el cristalino opaco e implanta un lente intraocular convencional, y de ella salen dos facturas: la del cirujano y la del lugar donde se opera. Con las tarifas nacionales de octubre de 2026, el cirujano tiene un monto aprobado de ${h.m(asc.lines[0].approved)} y un centro de cirugía ambulatoria de ${h.m(asc.lines[1].approved)}, es decir, ${h.m(asc.approvedTotal)} por el ojo. Con solo Medicare Original y el deducible de la Parte B de ${h.m(h.PB.deductible)} todavía pendiente, usted paga ${h.m(asc.youPay)}: el deducible y luego el 20 % del resto. El mismo ojo en el departamento ambulatorio de un hospital tiene un monto aprobado de ${h.m(hop.approvedTotal)} y le deja ${h.m(hop.youPay)}, porque la tarifa del hospital es casi el doble de la del centro de cirugía. Un Medigap Plan G reduce la factura al deducible; los planes C y F, abiertos solo a quienes eran elegibles antes de 2020, la llevan a cero. Los lentes premium que corrigen también el astigmatismo o la vista de cerca cuestan más, y Medicare no paga esa diferencia.`;
    },
    faqs: (h) => {
      const g = h.E('glasses-after-cataract', { state: 'FL' });
      return [
        { q: '¿El segundo ojo cuesta menos que el primero?', a: `Por lo general sí, porque el deducible de la Parte B de ${h.m(h.PB.deductible)} se paga una vez al año. Si los dos ojos se operan en el mismo año calendario, el segundo le cuesta el 20 % de su monto aprobado y nada más. Si el segundo pasa a enero, se aplica de nuevo el deducible del año nuevo; programar las dos cirugías puede ahorrarle un deducible.` },
        { q: '¿Medicare paga los anteojos después de la cirugía de cataratas?', a: `Sí: un par de anteojos con montura estándar, o un juego de lentes de contacto, después de cada cirugía que implanta un lente. En Florida el monto aprobado de una montura estándar y dos lentes monofocales es de ${h.m(g.approvedTotal)}, así que su 20 % ronda ${h.m(g.youPay)} con el deducible pagado. Una montura más cara le cuesta la diferencia, y el proveedor debe estar inscrito en Medicare.` },
        { q: '¿Por qué el hospital cuesta mucho más que un centro de cirugía?', a: `CMS paga al departamento ambulatorio de un hospital ${h.m(h.E('cataract-surgery', { setting: 'hopd' }).lines[1].approved)} por el mismo ojo y a un centro de cirugía ambulatoria ${h.m(h.E('cataract-surgery', { setting: 'asc' }).lines[1].approved)}, antes de los ajustes salariales locales. Su 20 % sigue la tarifa del centro, de modo que operarse en un centro de cirugía reduce lo que paga con los mismos honorarios del cirujano.` },
        { q: '¿Están cubiertos los lentes premium para el astigmatismo?', a: 'Medicare paga su monto habitual por la cirugía y por un lente convencional. Puede elegir un lente tórico para el astigmatismo o uno que corrige también la vista de cerca, pero el cargo adicional del lente premium y los exámenes extra corren por su cuenta. Pida ese precio antes de fijar la fecha: no es un costo aprobado por Medicare, así que Medigap tampoco lo paga.' },
      ];
    },
    body: (h) => {
      const asc = h.E('cataract-surgery', { setting: 'asc' });
      const hop = h.E('cataract-surgery', { setting: 'hopd' });
      const man = h.E('cataract-surgery', { setting: 'asc', locality: h.loc(/^Manhattan$/) });
      const al = h.E('cataract-surgery', { setting: 'asc', locality: h.defaultLocality('AL') });
      const n = h.E('cataract-surgery', { setting: 'asc', coverage: 'medigap', medigap: 'N', deductibleRemaining: h.PB.deductible });
      return `
<h2>Dos facturas por un ojo</h2>
<p>Con Medicare, la cirugía de cataratas nunca tiene un precio único. El cirujano factura a la Parte B según el baremo de médicos, y el centro factura su propia tarifa. La tarifa del centro incluye el quirófano, el personal de enfermería, los insumos de anestesia y el lente convencional.</p>
${h.table(['Concepto', 'Centro de cirugía', 'Hospital ambulatorio'], [
  ['Cirujano, tarifa nacional', h.m(asc.lines[0].approved), h.m(hop.lines[0].approved)],
  ['Centro', h.m(asc.lines[1].approved), h.m(hop.lines[1].approved)],
  ['Aprobado por el ojo', h.m(asc.approvedTotal), h.m(hop.approvedTotal)],
  ['Usted paga, deducible ya pagado', h.m(asc.youPay), h.m(hop.youPay)],
], 'Un ojo, lente convencional, solo Medicare Original, tarifas de CMS de octubre de 2026 (tarifas del centro antes del ajuste salarial local).', ['l', 'r', 'r'])}
<h2>Donde vive cambia los honorarios del cirujano</h2>
<p>El baremo de médicos se ajusta en ${h.LOCALITIES.length} zonas de precios. El mismo ojo en un centro de cirugía le cuesta ${h.m(man.youPay)} en Manhattan y ${h.m(al.youPay)} en Alabama con el deducible pagado, frente a ${h.m(asc.youPay)} a tarifa nacional. Las tarifas de los centros también varían con el índice salarial de cada hospital, que CMS aplica centro por centro; la calculadora muestra la tarifa nacional del centro y lo indica. Elija su estado y su zona para ver los honorarios de su cirujano.</p>
<h2>Lo que cambia Medigap, letra por letra</h2>
<p>Una póliza Medigap paga después de Medicare Original. El Plan G paga todo su 20 % pero no el deducible de la Parte B: un primer ojo en enero le cuesta ${h.m(h.PB.deductible)} y un segundo ojo más tarde ese año no le cuesta nada. El Plan N también paga el 20 %, lo que deja ${h.m(n.youPay)} por el primer ojo con el deducible pendiente; su pequeño copago se aplica a las consultas, no a la cirugía. Los planes K y L pagan la mitad o tres cuartas partes de su parte. El menú de cobertura de la calculadora tiene todas las letras.</p>
<h2>Planes Medicare Advantage</h2>
<p>Un plan Advantage debe cubrir la cirugía de cataratas, pero fija sus propios copagos y a menudo exige autorización previa y un cirujano de la red. Algunos planes cobran un copago fijo por la cirugía ambulatoria, otros un porcentaje. Escriba la cifra de su plan y lo que le queda bajo su límite anual de gastos, que figuran en el resumen de beneficios, y la calculadora los aplica al monto aprobado.</p>
<!--tool:mini:glasses-->
<h2>Antes de fijar la fecha</h2>
<p>Haga tres preguntas. ¿Qué centro se usará, un centro de cirugía o el departamento ambulatorio de un hospital? ¿El cirujano acepta la asignación, de modo que el monto aprobado sea el pago total? ¿Le proponen un lente premium, y a qué precio? Las respuestas deciden casi todo lo que pagará, y las dos primeras pueden cambiar su parte en varios cientos de dólares con el mismo médico.</p>
<p>Guarde los papeles que llegan después. El Resumen de Medicare (Medicare Summary Notice) indica cada concepto con su monto aprobado y la parte que le corresponde a usted; compárelo con las facturas del cirujano y del centro antes de pagar. Una factura por encima de su 20 % de un proveedor que acepta la asignación es un error de facturación que debe aclarar con la oficina, no un precio que negociar.</p>`;
    },
  },
});
