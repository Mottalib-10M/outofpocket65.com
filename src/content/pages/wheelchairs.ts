import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'wheelchairs', group: 'cover', order: 12,
  tool: { kind: 'est', props: { act: 'wheelchair-manual', acts: ['wheelchair-manual', 'wheelchair-lightweight', 'wheelchair-power', 'scooter'], state: 'TX', count: 13 } },
  mini: { kind: 'mini:wheelchair' },
  related: ['cpap', 'home-health', 'knee', 'part-b', 'home'],
  sources: ['dmepos', 'cfr414_229', 'assignment', 'medigap'],
  acts: ['wheelchair-manual', 'wheelchair-power', 'scooter'],
  en: {
    slug: 'does-medicare-cover-wheelchairs', nav: 'Wheelchairs and scooters', card: 'Manual chairs, power chairs and scooters: rental, prior authorization and your 20 % by state.',
    title: 'Wheelchairs and Medicare 2026: Manual, Power and Scooters',
    description: 'Part B covers manual and power wheelchairs and scooters needed at home. See the 2026 rental fees by state, the exam and prior authorization rules and your 20 %.',
    h1: 'Does Medicare cover wheelchairs and scooters?',
    intro: 'Yes, when the chair or scooter is medically necessary for use in your home. Part B treats it as durable medical equipment: you pay 20 % of the approved amount after the deductible. Power models need an in-person exam and a written prescription first. The estimator prices each type with the 2026 fee schedule of your state.',
    resume: (h) => {
      const m = h.E('wheelchair-manual', { state: 'TX', count: 13 });
      const p = h.E('wheelchair-power', { state: 'TX', count: 13 });
      const s = h.E('scooter', { state: 'TX' });
      return `Medicare Part B covers manual wheelchairs, power wheelchairs and power-operated scooters as durable medical equipment when they are medically necessary and prescribed for use in your home. After the ${h.m(h.PB.deductible)} Part B deductible you pay 20 % of the Medicare-approved amount, provided the supplier is enrolled in Medicare and accepts assignment. Power wheelchairs and scooters carry two extra conditions: a face-to-face examination and a written prescription from a treating provider, and for certain power chairs a prior authorization that the supplier usually requests on your behalf. Wheelchairs are rented month by month and become yours after 13 continuous months. In Texas in 2026 a standard manual wheelchair is approved ${h.m(m.approvedTotal)} over those 13 months, so your share is ${h.m(m.youPay)}; a standard group 2 power wheelchair is approved ${h.m(p.approvedTotal)}, leaving you ${h.m(p.youPay)}. A standard scooter, priced as a purchase on the fee schedule, is approved ${h.m(s.approvedTotal)} and costs you ${h.m(s.youPay)}. A supplier that will not accept assignment for every rental month can require full payment upfront, with Medicare reimbursing its share later.`;
    },
    faqs: (h) => {
      const p = h.E('wheelchair-power', { state: 'TX', count: 13 });
      const g = h.E('wheelchair-power', { state: 'TX', count: 13, coverage: 'medigap', medigap: 'G' });
      return [
        { q: 'Why was my power wheelchair request denied by Medicare?', a: 'Medicare names two reasons a prior authorization request can be denied: Medicare finds that you do not medically require a power wheelchair, or it did not receive enough information to decide. In the second case the supplier may resubmit the request with additional documents. The face-to-face exam and the written prescription from your treating provider are the core of that file.' },
        { q: 'Who handles prior authorization for a power wheelchair?', a: 'Usually the supplier. When your physician prescribes a power wheelchair that requires prior authorization, the medical equipment supplier sends the request and the required documents to Medicare for you, and you do not need to do anything. Medicare checks that you are eligible and meet the requirements; your coverage and benefits stay the same during the review.' },
        { q: 'What does a power wheelchair cost with Medigap?', a: `Medigap pays after Medicare on the rental. With Plan G and the Part B deductible met, the 13 months of a standard group 2 power wheelchair in Texas cost you ${h.m(g.youPay)} instead of ${h.m(p.youPay)}. Plans K and L pay half or three quarters of the 20 %. Medigap does not pay for options Medicare does not approve.` },
      ];
    },
    body: (h) => {
      const st = 'TX';
      const man = h.E('wheelchair-manual', { state: st, count: 13 });
      const lw = h.E('wheelchair-lightweight', { state: st, count: 13 });
      const pw = h.E('wheelchair-power', { state: st, count: 13 });
      const sc = h.E('scooter', { state: st });
      const scFirst = h.E('scooter', { state: st, deductibleRemaining: h.PB.deductible });
      const pwFl = h.E('wheelchair-power', { state: 'FL', count: 13 });
      const pwCa = h.E('wheelchair-power', { state: 'CA', count: 13 });
      const pwRural = h.E('wheelchair-power', { state: st, count: 13, area: 'rural' });
      return `
<h2>What Medicare expects before it pays</h2>
<p>Wheelchairs and scooters help you get around when your ability to walk is limited. For Medicare to cover one, it must be medically necessary and prescribed for use in your home, like any other durable medical equipment. Power wheelchairs and scooters add a step: you need a face-to-face examination and a written prescription from a treating provider before Medicare covers them.</p>
<p>Both your doctor and the supplier must be enrolled in Medicare. Medicare pays for equipment only when it comes from an enrolled supplier, so checking enrollment before delivery avoids a claim that cannot be paid.</p>
<h2>Rental, purchase and ownership</h2>
<p>Medicare covers different kinds of equipment in different ways: some must be rented, some bought, and some can go either way. Standard and lightweight manual wheelchairs and power wheelchairs are capped rental items on the fee schedule. Medicare pays a monthly rental, and after 13 continuous months the chair belongs to you. For power wheelchairs, the monthly amount from the fourth month falls to ${h.pc(h.P.dmeRental.months4to13FactorPowerWheelchair)} of the amount paid in the first three months; for manual chairs, to ${h.pc(h.P.dmeRental.months4to13FactorStandard)}. The standard scooter is listed as a purchase.</p>
${h.table([`${h.stateName(st)}, 2026`, 'Code', 'Approved', 'Your 20 %'], [
  ['Standard manual wheelchair, 13 months of rental', 'K0001', h.m(man.approvedTotal), h.m(man.youPay)],
  ['Lightweight manual wheelchair, 13 months', 'K0003', h.m(lw.approvedTotal), h.m(lw.youPay)],
  ['Power wheelchair, group 2 standard, 13 months', 'K0823', h.m(pw.approvedTotal), h.m(pw.youPay)],
  ['Scooter, group 1 standard, purchase', 'K0800', h.m(sc.approvedTotal), h.m(sc.youPay)],
], 'DMEPOS fee schedule October 2026, non-rural rates, Part B deductible already met, supplier accepting assignment.', ['l', 'l', 'r', 'r'])}
<p>A scooter bought in one go meets the deductible at once if you have not paid it yet: in that case the same scooter costs you ${h.m(scFirst.youPay)}, the ${h.m(h.PB.deductible)} deductible plus 20 % of the rest.</p>
<h2>Prior authorization for power wheelchairs</h2>
<p>Certain types of power wheelchairs require prior approval before Medicare will pay. The supplier normally handles it: it requests prior authorization and sends Medicare the request and the documents on your behalf after your physician prescribes the chair. Medicare reviews them to confirm you are eligible and meet the requirements. Your benefits do not change during the review, and Medicare says you should not see delays in getting the equipment.</p>
<p>A request can be denied if Medicare finds you do not medically require a power wheelchair, or if it does not get enough information to decide. When information is missing, the supplier may send the request again with what was lacking.</p>
<!--tool:mini:rental-->
<h2>Where you live changes the fee</h2>
<p>The fee schedule is set state by state, with higher rates in rural areas. The 13-month rental of the standard group 2 power wheelchair leaves you ${h.m(pwFl.youPay)} in Florida and ${h.m(pwCa.youPay)} in California, against ${h.m(pw.youPay)} in Texas, at non-rural rates. In a rural part of Texas your share for the same chair rises to ${h.m(pwRural.youPay)}. The mini tool compares the four types side by side for any state.</p>
<h2>Assignment through every rental month</h2>
<p>A supplier that participates in Medicare must accept assignment: it can charge you only the deductible and the coinsurance on the approved amount. A non-participating supplier may decline assignment and charge more. With rented equipment, ask whether the supplier will accept assignment for all the rental months. If it will not, you may have to pay the full cost upfront and wait for Medicare to pay you back its share once the claims are processed.</p>
<h2>Medigap and Advantage plans</h2>
<p>Medigap pays after Medicare on the approved rental or purchase price: Plan G covers all of your 20 % once the deductible is met. A Medicare Advantage plan must cover the same equipment as Original Medicare, with its own cost sharing, which the plan's documents describe.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-sillas-de-ruedas', nav: 'Sillas de ruedas y escúteres', card: 'Sillas manuales, eléctricas y escúteres: alquiler, autorización previa y su 20 % por estado.',
    title: 'Sillas de ruedas y Medicare 2026: manuales, eléctricas y más',
    description: 'La Parte B cubre sillas de ruedas manuales, eléctricas y escúteres para usar en casa. Vea el alquiler 2026 por estado, la autorización previa y su 20 %.',
    h1: '¿Medicare cubre las sillas de ruedas y los escúteres?',
    intro: 'Sí, cuando la silla o el escúter es médicamente necesario para usar en su casa. La Parte B lo trata como equipo médico duradero: usted paga el 20 % del monto aprobado tras el deducible. Los modelos eléctricos exigen antes un examen en persona y una receta por escrito. La calculadora pone precio a cada tipo con el baremo de 2026 de su estado.',
    resume: (h) => {
      const m = h.E('wheelchair-manual', { state: 'TX', count: 13 });
      const p = h.E('wheelchair-power', { state: 'TX', count: 13 });
      const s = h.E('scooter', { state: 'TX' });
      return `La Parte B de Medicare cubre las sillas de ruedas manuales, las sillas eléctricas y los escúteres de movilidad como equipo médico duradero cuando son médicamente necesarios y están recetados para usar en su casa. Tras el deducible de la Parte B de ${h.m(h.PB.deductible)}, usted paga el 20 % del monto aprobado por Medicare, siempre que el proveedor esté inscrito en Medicare y acepte la asignación. Las sillas eléctricas y los escúteres tienen dos condiciones más: un examen en persona y una receta por escrito de un proveedor que lo atiende, y para ciertas sillas eléctricas una autorización previa que el proveedor suele pedir por usted. Las sillas de ruedas se alquilan mes a mes y pasan a ser suyas tras 13 meses seguidos. En Texas en 2026, una silla manual estándar tiene un monto aprobado de ${h.m(m.approvedTotal)} en esos 13 meses, así que su parte es de ${h.m(m.youPay)}; una silla eléctrica estándar del grupo 2 tiene un monto aprobado de ${h.m(p.approvedTotal)} y le deja ${h.m(p.youPay)}. Un escúter estándar, que el baremo tarifica como compra, tiene un monto aprobado de ${h.m(s.approvedTotal)} y le cuesta ${h.m(s.youPay)}. Un proveedor que no acepte la asignación todos los meses del alquiler puede exigirle el pago completo por adelantado, y Medicare le reembolsa su parte después.`;
    },
    faqs: (h) => {
      const p = h.E('wheelchair-power', { state: 'TX', count: 13 });
      const g = h.E('wheelchair-power', { state: 'TX', count: 13, coverage: 'medigap', medigap: 'G' });
      return [
        { q: '¿Por qué Medicare rechazó mi solicitud de silla de ruedas eléctrica?', a: 'Medicare menciona dos motivos por los que se puede rechazar una autorización previa: Medicare concluye que usted no necesita médicamente una silla eléctrica, o no recibió información suficiente para decidir. En el segundo caso el proveedor puede volver a presentar la solicitud con documentos adicionales. El examen en persona y la receta escrita de su proveedor son el centro de ese expediente.' },
        { q: '¿Quién tramita la autorización previa de una silla eléctrica?', a: 'Por lo general, el proveedor. Cuando su médico receta una silla eléctrica que requiere autorización previa, el proveedor de equipo médico envía a Medicare la solicitud y los documentos necesarios por usted, y usted no tiene que hacer nada. Medicare comprueba que es elegible y cumple los requisitos; su cobertura y sus beneficios no cambian durante la revisión.' },
        { q: '¿Cuánto cuesta una silla de ruedas eléctrica con Medigap?', a: `Medigap paga después de Medicare sobre el alquiler. Con el Plan G y el deducible de la Parte B pagado, los 13 meses de una silla eléctrica estándar del grupo 2 en Texas le cuestan ${h.m(g.youPay)} en lugar de ${h.m(p.youPay)}. Los planes K y L pagan la mitad o tres cuartas partes del 20 %. Medigap no paga las opciones que Medicare no aprueba.` },
      ];
    },
    body: (h) => {
      const st = 'TX';
      const man = h.E('wheelchair-manual', { state: st, count: 13 });
      const lw = h.E('wheelchair-lightweight', { state: st, count: 13 });
      const pw = h.E('wheelchair-power', { state: st, count: 13 });
      const sc = h.E('scooter', { state: st });
      const scFirst = h.E('scooter', { state: st, deductibleRemaining: h.PB.deductible });
      const pwFl = h.E('wheelchair-power', { state: 'FL', count: 13 });
      const pwCa = h.E('wheelchair-power', { state: 'CA', count: 13 });
      const pwRural = h.E('wheelchair-power', { state: st, count: 13, area: 'rural' });
      return `
<h2>Lo que Medicare exige antes de pagar</h2>
<p>Las sillas de ruedas y los escúteres le ayudan a desplazarse cuando su capacidad para caminar es limitada. Para que Medicare los cubra, deben ser médicamente necesarios y estar recetados para usar en su casa, como cualquier otro equipo médico duradero. Las sillas eléctricas y los escúteres suman un paso: necesita un examen en persona y una receta por escrito de un proveedor que lo atiende antes de que Medicare los cubra.</p>
<p>Su médico y el proveedor deben estar inscritos en Medicare. Medicare solo paga el equipo que viene de un proveedor inscrito, así que comprobar la inscripción antes de la entrega evita una reclamación que no se podrá pagar.</p>
<h2>Alquiler, compra y propiedad</h2>
<p>Medicare cubre los distintos equipos de maneras distintas: algunos deben alquilarse, otros comprarse y otros admiten las dos opciones. Las sillas manuales estándar y ligeras y las sillas eléctricas son artículos de alquiler con tope en el baremo. Medicare paga un alquiler mensual y, tras 13 meses seguidos, la silla es suya. En las sillas eléctricas, el monto mensual a partir del cuarto mes baja al ${h.pc(h.P.dmeRental.months4to13FactorPowerWheelchair)} de lo pagado en los tres primeros meses; en las manuales, al ${h.pc(h.P.dmeRental.months4to13FactorStandard)}. El escúter estándar figura como compra.</p>
${h.table([`${h.stateName(st)}, 2026`, 'Código', 'Aprobado', 'Su 20 %'], [
  ['Silla manual estándar, 13 meses de alquiler', 'K0001', h.m(man.approvedTotal), h.m(man.youPay)],
  ['Silla manual ligera, 13 meses', 'K0003', h.m(lw.approvedTotal), h.m(lw.youPay)],
  ['Silla eléctrica, grupo 2 estándar, 13 meses', 'K0823', h.m(pw.approvedTotal), h.m(pw.youPay)],
  ['Escúter, grupo 1 estándar, compra', 'K0800', h.m(sc.approvedTotal), h.m(sc.youPay)],
], 'Baremo DMEPOS de octubre de 2026, tarifas no rurales, deducible de la Parte B ya pagado, proveedor que acepta la asignación.', ['l', 'l', 'r', 'r'])}
<p>Un escúter comprado de una vez absorbe todo el deducible si aún no lo ha pagado: en ese caso el mismo escúter le cuesta ${h.m(scFirst.youPay)}, es decir, el deducible de ${h.m(h.PB.deductible)} más el 20 % del resto.</p>
<h2>La autorización previa de las sillas eléctricas</h2>
<p>Ciertos tipos de sillas eléctricas necesitan una aprobación previa antes de que Medicare pague. Normalmente la gestiona el proveedor: pide la autorización previa y envía a Medicare la solicitud y los documentos por usted cuando su médico receta la silla. Medicare los revisa para confirmar que es elegible y cumple los requisitos. Sus beneficios no cambian durante la revisión, y Medicare indica que no debería sufrir demoras para recibir el equipo.</p>
<p>La solicitud puede rechazarse si Medicare concluye que usted no necesita médicamente una silla eléctrica, o si no recibe información suficiente para decidir. Cuando falta información, el proveedor puede enviar de nuevo la solicitud con lo que faltaba.</p>
<!--tool:mini:rental-->
<h2>Donde vive cambia la tarifa</h2>
<p>El baremo se fija estado por estado, con tarifas más altas en las zonas rurales. Los 13 meses de alquiler de la silla eléctrica estándar del grupo 2 le cuestan ${h.m(pwFl.youPay)} en Florida y ${h.m(pwCa.youPay)} en California, frente a ${h.m(pw.youPay)} en Texas, con tarifas no rurales. En una zona rural de Texas su parte por la misma silla sube a ${h.m(pwRural.youPay)}. La minicalculadora compara los cuatro tipos en cualquier estado.</p>
<h2>La asignación durante todos los meses de alquiler</h2>
<p>Un proveedor que participa en Medicare debe aceptar la asignación: solo puede cobrarle el deducible y el coseguro sobre el monto aprobado. Un proveedor no participante puede rechazarla y cobrar más. Con un equipo alquilado, pregunte si el proveedor aceptará la asignación todos los meses del alquiler. Si no lo hace, quizá tenga que pagar el costo completo por adelantado y esperar a que Medicare le devuelva su parte cuando procese las reclamaciones.</p>
<h2>Medigap y los planes Advantage</h2>
<p>Medigap paga después de Medicare sobre el alquiler o la compra aprobados: el Plan G cubre todo su 20 % una vez pagado el deducible. Un plan Medicare Advantage debe cubrir el mismo equipo que Medicare Original, con su propio costo compartido, que figura en los documentos del plan.</p>`;
    },
  },
});
