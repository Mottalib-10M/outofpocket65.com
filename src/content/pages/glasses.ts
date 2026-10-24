import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'glasses', group: 'cover', order: 10,
  tool: { kind: 'est', props: { act: 'glasses-after-cataract', acts: ['glasses-after-cataract', 'eye-exam-routine'], state: 'FL' } },
  mini: { kind: 'mini:glasses' },
  related: ['cataract', 'eye-exams', 'hearing-aids', 'not-covered', 'home'],
  sources: ['dmepos', 'notcovered', 'medigap'],
  acts: ['glasses-after-cataract', 'eye-exam-routine'],
  en: {
    slug: 'does-medicare-cover-glasses', nav: 'Glasses and contacts', card: 'Not covered, except one pair with standard frames after each cataract surgery.',
    title: 'Eyeglasses and Medicare 2026: The Cataract Exception, Priced',
    description: 'Medicare does not pay for everyday glasses or contacts, only one pair after each cataract surgery with a lens implant. See the 2026 frame allowance by state.',
    h1: 'Does Medicare cover glasses?',
    intro: 'Usually not. Original Medicare leaves everyday glasses and contact lenses, and the eye exam to prescribe them, to you. The exception is one pair of glasses with standard frames, or one set of contacts, after each cataract surgery that implants a lens. The estimator prices that pair from the 2026 fee schedule of your state.',
    resume: (h) => {
      const fl = h.E('glasses-after-cataract', { state: 'FL' });
      const first = h.E('glasses-after-cataract', { state: 'FL', deductibleRemaining: h.PB.deductible });
      return `Original Medicare does not pay for eyeglasses or contact lenses in general, and it does not pay for the routine eye exam, also called a refraction, used to prescribe them: you pay all of those costs. Part B makes one exception. After each cataract surgery that implants an intraocular lens, it covers one pair of eyeglasses with standard frames, or one set of contact lenses, at 20 % of the Medicare-approved amount once the ${h.m(h.PB.deductible)} Part B deductible is met. The approved amount comes from the CMS fee schedule for medical equipment, state by state. In Florida in 2026, a standard frame is allowed ${h.m(h.dmeFee('V2020', '', 'FL'))} and each single-vision lens ${h.m(h.dmeFee('V2100', '', 'FL'))}, so the pair is approved ${h.m(fl.approvedTotal)} and your share is ${h.m(fl.youPay)}; if the deductible has not been touched yet, the whole pair falls inside it and you pay ${h.m(first.youPay)}. A frame that costs more than the standard allowance is an upgrade, and the difference is yours. Medicare pays only when the supplier participates in Medicare, whether you or the supplier files the claim. Some Medicare Advantage plans add a vision benefit for everyday glasses.`;
    },
    faqs: (h) => {
      const fl = h.E('glasses-after-cataract', { state: 'FL' });
      const g = h.E('glasses-after-cataract', { state: 'FL', coverage: 'medigap', medigap: 'G' });
      return [
        { q: 'If I had cataract surgery on both eyes, do I get two pairs of glasses?', a: 'Medicare covers one pair of eyeglasses with standard frames, or one set of contact lenses, after each cataract surgery that implants an intraocular lens. The rule is written per surgery, so a second operation on the other eye opens a second covered pair. Glasses bought between the two surgeries, or later for a change of prescription without new surgery, are not covered.' },
        { q: 'Does Medicare pay for designer frames after cataract surgery?', a: `It pays toward standard frames only. A designer or upgraded frame is allowed, but Medicare approves the same amount as for a standard one and you pay any additional cost. In Florida the 2026 frame allowance is ${h.m(h.dmeFee('V2020', '', 'FL'))}; anything above it comes from your pocket, on top of your 20 % of the approved pair, which is ${h.m(fl.youPay)} with the deductible met.` },
        { q: 'Can I choose contact lenses instead of glasses after cataract surgery?', a: 'Yes. The benefit is one pair of eyeglasses with standard frames or one set of contact lenses after each covered surgery, not both. The same conditions apply: 20 % of the approved amount after the Part B deductible, and a supplier that participates in Medicare. Lenses ordered from a supplier outside Medicare are not paid, even if you file the claim yourself.' },
        { q: 'Will Medigap pay my 20 % for post-cataract glasses?', a: `Yes, since the pair is a Part B covered item with an approved amount. Plan G pays all of the 20 % once the deductible is met, which brings the Florida pair to ${h.m(g.youPay)}. Medigap does not pay for frame upgrades above the allowance, nor for everyday glasses Medicare does not cover, because neither has a Medicare-approved amount to share.` },
      ];
    },
    body: (h) => {
      const st = (s: string) => h.E('glasses-after-cataract', { state: s });
      const fl = st('FL'); const ca = st('CA'); const ia = st('IA'); const wy = st('WY');
      return `
<h2>The general rule: glasses are a personal expense</h2>
<p>Medicare Part B does not usually cover eyeglasses or contact lenses. Medicare places routine eye exams for glasses on its list of things Original Medicare does not pay for, so the visit where your prescription is measured is also at your own cost. Whatever the optician charges for frames, lenses, coatings or a spare pair is outside Medicare.</p>
<p>Exams that look for or follow an eye disease are another matter: a yearly exam for diabetic retinopathy, glaucoma tests for people at high risk, or exams to diagnose an eye condition are medical services under Part B. They are covered on the ${h.a('eye-exams', 'eye exams page')}, not here.</p>
<h2>The one exception: after cataract surgery</h2>
<p>When a surgeon removes a cataract and implants an intraocular lens, Part B covers corrective lenses afterwards: one pair of eyeglasses with standard frames or one set of contact lenses, after each such surgery. You pay 20 % of the Medicare-approved amount after the deductible. The surgery itself is priced on the ${h.a('cataract', 'cataract surgery page')}.</p>
<p>The approved amount is set by the CMS fee schedule for durable medical equipment, prosthetics, orthotics and supplies. It lists a fee for the standard frame, coded V2020, and one for each lens, such as V2100 for a single-vision lens. Those amounts differ slightly by state:</p>
${h.table(['State', 'Frame allowance', 'Approved pair', 'Your 20 %'], [
  [h.stateName('FL'), h.m(h.dmeFee('V2020', '', 'FL')), h.m(fl.approvedTotal), h.m(fl.youPay)],
  [h.stateName('CA'), h.m(h.dmeFee('V2020', '', 'CA')), h.m(ca.approvedTotal), h.m(ca.youPay)],
  [h.stateName('IA'), h.m(h.dmeFee('V2020', '', 'IA')), h.m(ia.approvedTotal), h.m(ia.youPay)],
  [h.stateName('WY'), h.m(h.dmeFee('V2020', '', 'WY')), h.m(wy.approvedTotal), h.m(wy.youPay)],
], 'Standard frame plus two single-vision lenses, DMEPOS fee schedule October 2026, deductible already met.', ['l', 'r', 'r', 'r'])}
<h2>Upgrades and the frame allowance</h2>
<p>Medicare is clear that you pay any additional cost for upgraded frames. In practice, the allowance works like a credit toward the frame you choose: if your frame costs more than the standard amount, Medicare still approves only the standard amount and the rest is yours. The mini tool takes the price of the frame you have in mind and adds the upgrade to your share.</p>
<!--tool:mini:cataractTwo-->
<h2>Buy from a supplier that participates in Medicare</h2>
<p>Medicare will only pay for contact lenses or eyeglasses from a supplier that participates in Medicare, and this holds whether you or the supplier submits the claim. Asking the shop before you order costs nothing and settles the question. A participating supplier must accept assignment, which limits what it can bill you to the deductible and the 20 % on the approved amount, plus any upgrade you chose.</p>
<h2>Vision benefits outside Original Medicare</h2>
<p>Some Medicare Advantage plans offer extra benefits Original Medicare does not cover, vision among them. Such a benefit can pay toward everyday glasses or the routine eye exam, under the plan's own limits; contact the plan for details. A Medigap policy does not add a vision benefit: it can pay your 20 % on post-cataract glasses, since they are a covered item, but nothing toward everyday glasses.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-anteojos', nav: 'Anteojos y lentes de contacto', card: 'No cubiertos, salvo un par con montura estándar después de cada cirugía de cataratas.',
    title: 'Anteojos y Medicare 2026: la excepción de las cataratas',
    description: 'Medicare no paga anteojos ni lentes de contacto de uso diario, solo un par tras cada cirugía de cataratas con implante. Vea la asignación 2026 por estado.',
    h1: '¿Medicare cubre los anteojos?',
    intro: 'Por lo general, no. Medicare Original deja a su cargo los anteojos y lentes de contacto de uso diario, y también el examen de la vista para recetarlos. La excepción es un par de anteojos con montura estándar, o un juego de lentes de contacto, después de cada cirugía de cataratas que implanta un lente. La calculadora pone precio a ese par con el baremo de 2026 de su estado.',
    resume: (h) => {
      const fl = h.E('glasses-after-cataract', { state: 'FL' });
      const first = h.E('glasses-after-cataract', { state: 'FL', deductibleRemaining: h.PB.deductible });
      return `Medicare Original no paga los anteojos ni los lentes de contacto en general, ni el examen de la vista de rutina, también llamado refracción, que sirve para recetarlos: usted paga todos esos costos. La Parte B tiene una excepción. Después de cada cirugía de cataratas que implanta un lente intraocular, cubre un par de anteojos con montura estándar, o un juego de lentes de contacto, al 20 % del monto aprobado por Medicare una vez pagado el deducible de la Parte B de ${h.m(h.PB.deductible)}. El monto aprobado sale del baremo de CMS para equipo médico, estado por estado. En Florida en 2026, la montura estándar tiene una asignación de ${h.m(h.dmeFee('V2020', '', 'FL'))} y cada lente monofocal de ${h.m(h.dmeFee('V2100', '', 'FL'))}, así que el par tiene un monto aprobado de ${h.m(fl.approvedTotal)} y su parte es de ${h.m(fl.youPay)}; si todavía no ha usado nada del deducible, el par entero queda dentro de él y usted paga ${h.m(first.youPay)}. Una montura que cuesta más que la asignación estándar es una mejora, y la diferencia corre por su cuenta. Medicare solo paga si el proveedor participa en Medicare, ya presente la reclamación usted o el proveedor. Algunos planes Medicare Advantage añaden un beneficio de visión para los anteojos de uso diario.`;
    },
    faqs: (h) => {
      const fl = h.E('glasses-after-cataract', { state: 'FL' });
      const g = h.E('glasses-after-cataract', { state: 'FL', coverage: 'medigap', medigap: 'G' });
      return [
        { q: 'Si me operaron de cataratas en los dos ojos, ¿recibo dos pares de anteojos?', a: 'Medicare cubre un par de anteojos con montura estándar, o un juego de lentes de contacto, después de cada cirugía de cataratas que implanta un lente intraocular. La regla se aplica por cirugía, así que una segunda operación en el otro ojo da derecho a un segundo par cubierto. Los anteojos comprados entre las dos cirugías, o más tarde por un cambio de graduación sin nueva cirugía, no están cubiertos.' },
        { q: '¿Medicare paga una montura de diseñador después de la cirugía de cataratas?', a: `Solo paga para una montura estándar. Puede elegir una montura de diseñador o mejorada, pero Medicare aprueba el mismo monto que para una estándar y usted paga el costo adicional. En Florida la asignación de 2026 para la montura es de ${h.m(h.dmeFee('V2020', '', 'FL'))}; lo que la supere sale de su bolsillo, además de su 20 % del par aprobado, que es de ${h.m(fl.youPay)} con el deducible pagado.` },
        { q: '¿Puedo elegir lentes de contacto en lugar de anteojos tras la cirugía de cataratas?', a: 'Sí. El beneficio es un par de anteojos con montura estándar o un juego de lentes de contacto después de cada cirugía cubierta, no las dos cosas. Se aplican las mismas condiciones: el 20 % del monto aprobado tras el deducible de la Parte B y un proveedor que participe en Medicare. Los lentes pedidos a un proveedor fuera de Medicare no se pagan, aunque usted presente la reclamación.' },
        { q: '¿Medigap paga mi 20 % de los anteojos después de las cataratas?', a: `Sí, porque el par es un artículo cubierto por la Parte B con monto aprobado. El Plan G paga todo el 20 % con el deducible pagado, lo que deja el par de Florida en ${h.m(g.youPay)}. Medigap no paga las mejoras de montura por encima de la asignación ni los anteojos de uso diario que Medicare no cubre, porque ninguno tiene un monto aprobado por Medicare que compartir.` },
      ];
    },
    body: (h) => {
      const st = (s: string) => h.E('glasses-after-cataract', { state: s });
      const fl = st('FL'); const ca = st('CA'); const ia = st('IA'); const wy = st('WY');
      return `
<h2>La regla general: los anteojos son un gasto personal</h2>
<p>La Parte B de Medicare no suele cubrir los anteojos ni los lentes de contacto. Medicare incluye los exámenes de la vista de rutina para anteojos en su lista de lo que Medicare Original no paga, así que la consulta en la que se mide su graduación también corre por su cuenta. Lo que cobre la óptica por monturas, cristales, tratamientos o un par de repuesto queda fuera de Medicare.</p>
<p>Los exámenes que buscan o vigilan una enfermedad de los ojos son otra cosa: un examen anual de retinopatía diabética, las pruebas de glaucoma para personas de alto riesgo o los exámenes para diagnosticar una afección ocular son servicios médicos de la Parte B. Se tratan en la ${h.a('eye-exams', 'página de exámenes de la vista')}, no aquí.</p>
<h2>La única excepción: después de la cirugía de cataratas</h2>
<p>Cuando un cirujano retira una catarata e implanta un lente intraocular, la Parte B cubre los lentes correctivos de después: un par de anteojos con montura estándar o un juego de lentes de contacto, tras cada una de esas cirugías. Usted paga el 20 % del monto aprobado por Medicare después del deducible. La cirugía en sí se calcula en la ${h.a('cataract', 'página de la cirugía de cataratas')}.</p>
<p>El monto aprobado lo fija el baremo de CMS para equipo médico duradero, prótesis, órtesis y suministros. Tiene una tarifa para la montura estándar, con el código V2020, y otra para cada lente, como el V2100 para un lente monofocal. Esos montos varían un poco según el estado:</p>
${h.table(['Estado', 'Asignación de montura', 'Par aprobado', 'Su 20 %'], [
  [h.stateName('FL'), h.m(h.dmeFee('V2020', '', 'FL')), h.m(fl.approvedTotal), h.m(fl.youPay)],
  [h.stateName('CA'), h.m(h.dmeFee('V2020', '', 'CA')), h.m(ca.approvedTotal), h.m(ca.youPay)],
  [h.stateName('IA'), h.m(h.dmeFee('V2020', '', 'IA')), h.m(ia.approvedTotal), h.m(ia.youPay)],
  [h.stateName('WY'), h.m(h.dmeFee('V2020', '', 'WY')), h.m(wy.approvedTotal), h.m(wy.youPay)],
], 'Montura estándar más dos lentes monofocales, baremo DMEPOS de octubre de 2026, deducible ya pagado.', ['l', 'r', 'r', 'r'])}
<h2>Las mejoras y la asignación de la montura</h2>
<p>Medicare dice con claridad que usted paga el costo adicional de una montura mejorada. En la práctica, la asignación funciona como un crédito para la montura que elija: si la suya cuesta más que el monto estándar, Medicare sigue aprobando solo el monto estándar y el resto lo paga usted. La minicalculadora toma el precio de la montura que tiene en mente y suma la mejora a su parte.</p>
<!--tool:mini:cataractTwo-->
<h2>Compre a un proveedor que participe en Medicare</h2>
<p>Medicare solo paga lentes de contacto o anteojos de un proveedor que participa en Medicare, y esto vale tanto si presenta la reclamación usted como si la presenta el proveedor. Preguntar en la óptica antes de hacer el pedido no cuesta nada y resuelve la duda. Un proveedor participante debe aceptar la asignación, lo que limita lo que puede cobrarle al deducible y al 20 % del monto aprobado, más la mejora que usted haya elegido.</p>
<h2>Beneficios de visión fuera de Medicare Original</h2>
<p>Algunos planes Medicare Advantage ofrecen beneficios que Medicare Original no cubre, entre ellos la visión. Ese beneficio puede pagar parte de los anteojos de uso diario o del examen de rutina, dentro de los límites del plan; consulte con el plan los detalles. Una póliza Medigap no añade un beneficio de visión: puede pagar su 20 % de los anteojos posteriores a las cataratas, porque son un artículo cubierto, pero nada de los anteojos de uso diario.</p>`;
    },
  },
});
