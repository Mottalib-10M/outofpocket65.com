import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'ambulance', group: 'cover', order: 4,
  tool: { kind: 'est', props: { act: 'ambulance-emergency', acts: ['ambulance-emergency', 'ambulance-als', 'ambulance-nonemergency'], miles: 10 } },
  mini: { kind: 'mini:ambMiles' },
  related: ['dialysis', 'snf', 'home-health', 'part-b', 'deductible', 'home'],
  sources: ['afs', 'medigap', 'assignment', 'partb'],
  acts: ['ambulance-emergency', 'ambulance-nonemergency'],
  en: {
    slug: 'does-medicare-cover-ambulance', nav: 'Ambulance', card: 'Base rate plus loaded miles, emergency or scheduled, and when a ride is refused.',
    title: 'Ambulance and Medicare 2026: Base Rate, Miles and Your 20 %',
    description: 'Part B covers a ground ambulance when any other vehicle could endanger your health. See the 2026 base rate and mileage for your area, and the 20 % you pay.',
    h1: 'Does Medicare cover ambulance rides?',
    intro: 'Yes, Part B pays for ground ambulance transportation when traveling any other way could endanger your health. The tool prices a ride from the CMS ambulance fee schedule: a base rate for the level of care plus a rate for every mile with you on board.',
    resume: (h) => {
      const fl = h.defaultLocality('FL');
      const bls = h.E('ambulance-emergency', { locality: fl, miles: 10 });
      const als = h.E('ambulance-als', { locality: fl, miles: 10 });
      const first = h.E('ambulance-emergency', { locality: fl, miles: 10, deductibleRemaining: h.PB.deductible });
      return `Medicare Part B covers a ground ambulance when riding in any other vehicle could endanger your health and you need medically necessary care at a hospital, a critical access hospital, a rural emergency hospital or a skilled nursing facility, and it pays only up to the nearest facility able to treat you. Each ride is priced in two parts on the CMS ambulance fee schedule: a base rate for the level of care and a rate per loaded mile, meaning each mile with you aboard. In the rest of Florida in 2026, a ten-mile emergency ride at basic life support is approved ${h.m(bls.approvedTotal)} and leaves you ${h.m(bls.youPay)} once the Part B deductible is met; at advanced life support the approved amount rises to ${h.m(als.approvedTotal)} and your 20 % to ${h.m(als.youPay)}. If the ride is your first Part B bill of the year, the ${h.m(h.PB.deductible)} deductible comes first and the basic ride costs you ${h.m(first.youPay)}. Scheduled trips that are not emergencies, for example to dialysis, need a written order saying the ambulance is medically necessary. Medicare may also pay for an airplane or helicopter when you need fast transport that ground vehicles cannot provide.`;
    },
    faqs: (h) => {
      const fl = h.defaultLocality('FL');
      const one = h.E('ambulance-nonemergency', { locality: fl, miles: 8 });
      const n = h.E('ambulance-emergency', { locality: fl, miles: 10, coverage: 'medigap', medigap: 'N' });
      return [
        { q: 'Why did Medicare pay less because I chose a hospital farther away?', a: 'Medicare covers an ambulance only to the nearest appropriate facility that can give you the care you need. If you ask to be taken past that facility to a hospital you prefer, Medicare may not pay for the extra distance. When the nearest hospital cannot treat your condition, the trip to the one that can is the covered trip.' },
        { q: 'Does Medicare cover an ambulance to and from dialysis?', a: `It may, when your doctor writes an order stating that the ambulance is medically necessary, as can happen with end-stage renal disease. In the rest of Florida, an eight-mile scheduled trip is approved ${h.m(one.approvedTotal)}, so each leg costs you ${h.m(one.youPay)} with the deductible met and a round trip twice that. Frequent scheduled trips can also require prior authorization.` },
        { q: 'What is the paper an ambulance company asks me to sign before a scheduled trip?', a: 'It is usually the Advance Beneficiary Notice of Noncoverage. The company must give it to you when the trip is not an emergency and it believes Medicare may not pay for that specific service. Signing it means you accept to pay if Medicare refuses. The rule concerns scheduled trips, not emergencies.' },
        { q: 'Does Medigap pay my share of an ambulance bill?', a: `Every standard Medigap letter pays at least part of the Part B coinsurance. Plan G pays all of the 20 %, and Plan N does as well: the ten-mile basic ride in the rest of Florida leaves ${h.m(n.youPay)} with Plan N once the deductible is met. Plans K and L pay half or three quarters. The Part B deductible stays yours with every plan still sold to new enrollees.` },
      ];
    },
    body: (h) => {
      const fl = h.defaultLocality('FL');
      const mile = h.E('ambulance-emergency', { locality: fl, miles: 1 }).lines[1].approved;
      const bls = h.E('ambulance-emergency', { locality: fl, miles: 10 });
      const als = h.E('ambulance-als', { locality: fl, miles: 10 });
      const sch = h.E('ambulance-nonemergency', { locality: fl, miles: 10 });
      const rur = h.E('ambulance-emergency', { locality: fl, miles: 10, area: 'rural' });
      const sup = h.E('ambulance-emergency', { locality: fl, miles: 40, area: 'superRural' });
      const man = h.E('ambulance-emergency', { locality: h.loc(/^Manhattan$/), miles: 10 });
      const ca = h.E('ambulance-emergency', { locality: h.defaultLocality('CA'), miles: 10 });
      const al = h.E('ambulance-emergency', { locality: h.defaultLocality('AL'), miles: 10 });
      return `
<h2>When the ride counts as medically necessary</h2>
<p>Medicare does not ask whether an ambulance was convenient; it asks whether any other way of traveling could have put your health at risk. When the answer is yes and you need care at a hospital, a critical access hospital, a rural emergency hospital or a skilled nursing facility, Part B covers the ground ambulance. A ride taken because no car or taxi was available, while you could safely sit in one, does not meet the test.</p>
<p>The destination also counts. Medicare pays for transport to the nearest appropriate facility, the closest one able to give you the care you need. Air transport by airplane or helicopter may be covered when your condition requires immediate and rapid transport that a ground vehicle cannot provide.</p>
<h2>How a bill is built: base rate plus loaded miles</h2>
<p>Ambulance suppliers are paid from the CMS ambulance fee schedule, which sets a base rate for each level of service and a rate per loaded mile. In the rest of Florida the mileage rate is ${h.mx(mile)} per mile in an urban area, and the base rate depends on the care given on board. The codes shown are public HCPCS level II codes kept by CMS.</p>
${h.table(['Ten loaded miles, rest of Florida', 'Base rate', 'Mileage', 'Approved', 'You pay'], [
  ['Emergency, basic life support (A0429)', h.m(bls.lines[0].approved), h.m(bls.lines[1].approved), h.m(bls.approvedTotal), h.m(bls.youPay)],
  ['Emergency, advanced life support level 1 (A0427)', h.m(als.lines[0].approved), h.m(als.lines[1].approved), h.m(als.approvedTotal), h.m(als.youPay)],
  ['Scheduled, non-emergency (A0428)', h.m(sch.lines[0].approved), h.m(sch.lines[1].approved), h.m(sch.approvedTotal), h.m(sch.youPay)],
  ['Emergency, basic, rural pickup', h.m(rur.lines[0].approved), h.m(rur.lines[1].approved), h.m(rur.approvedTotal), h.m(rur.youPay)],
], 'CMS ambulance fee schedule, CY 2026, Part B deductible already met, supplier accepting assignment.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Rural pickups and long distances</h2>
<p>A pickup in a rural ZIP code is paid a little more for the base and noticeably more per mile for the first 17 miles. In the most sparsely populated areas, classed as super rural, the base rate climbs again: a 40-mile emergency ride from such an area in Florida is approved ${h.m(sup.approvedTotal)}, and your 20 % is ${h.m(sup.youPay)}. The mini tool lets you change the distance and the type of pickup.</p>
<h2>The same ride in other states</h2>
<p>Base rates follow local costs. A ten-mile basic emergency ride leaves you ${h.m(man.youPay)} in Manhattan, ${h.m(ca.youPay)} in the rest of California and ${h.m(al.youPay)} in Alabama, against ${h.m(bls.youPay)} in the rest of Florida, all with the deductible met. Pick your state and price area in the main tool to replace these examples with your own.</p>
<!--tool:mini:deductible-->
<h2>Scheduled trips, written orders and prior authorization</h2>
<p>Outside emergencies, Medicare may pay for an ambulance when your doctor or another provider gives a written order stating that it is medically necessary. A person with end-stage renal disease who cannot travel safely to dialysis by other means is the example Medicare gives.</p>
<p>Repeated scheduled trips fall under a Medicare program that applies nationwide: if you have three or more round trips in ten days, or at least one a week for three weeks or more, the ambulance company may ask Medicare for prior authorization before your fourth round trip in a 30-day period. If the request is not approved and the trips continue, Medicare denies the claims and the company may bill you for everything. You or the company may file the request; 1-800-MEDICARE answers questions about it.</p>
<h2>Notices and bills after the ride</h2>
<p>For a non-emergency trip the company thinks Medicare may refuse, it must give you an Advance Beneficiary Notice of Noncoverage first. After an emergency ride, check that the claim shows the level of service you actually received and the miles from pickup to the hospital, since both lines drive what you owe.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-ambulancia', nav: 'Ambulancia', card: 'Tarifa base más millas con el paciente, de emergencia o programada, y cuándo se rechaza un traslado.',
    title: 'Ambulancia y Medicare 2026: tarifa base, millas y su 20 %',
    description: 'La Parte B cubre la ambulancia terrestre cuando otro vehículo pondría en riesgo su salud. Vea la tarifa base y las millas de 2026 en su zona y su 20 %.',
    h1: '¿Medicare cubre la ambulancia?',
    intro: 'Sí, la Parte B paga el traslado en ambulancia terrestre cuando viajar de otra manera pondría en peligro su salud. La herramienta calcula un traslado con el baremo de ambulancias de CMS: una tarifa base según el nivel de atención más una tarifa por cada milla recorrida con usted a bordo.',
    resume: (h) => {
      const fl = h.defaultLocality('FL');
      const bls = h.E('ambulance-emergency', { locality: fl, miles: 10 });
      const als = h.E('ambulance-als', { locality: fl, miles: 10 });
      const first = h.E('ambulance-emergency', { locality: fl, miles: 10, deductibleRemaining: h.PB.deductible });
      return `La Parte B de Medicare cubre la ambulancia terrestre cuando ir en cualquier otro vehículo podría poner en peligro su salud y usted necesita atención médicamente necesaria en un hospital, un hospital de acceso crítico, un hospital rural de emergencia o un centro de enfermería especializada, y solo paga hasta el centro adecuado más cercano que pueda atenderlo. Cada traslado tiene dos partes en el baremo de ambulancias de CMS: una tarifa base según el nivel de atención y una tarifa por milla con el paciente a bordo. En el resto de Florida en 2026, un traslado de emergencia de diez millas con soporte vital básico tiene un monto aprobado de ${h.m(bls.approvedTotal)} y le cuesta ${h.m(bls.youPay)} con el deducible de la Parte B pagado; con soporte vital avanzado el monto aprobado sube a ${h.m(als.approvedTotal)} y su 20 % a ${h.m(als.youPay)}. Si el traslado es su primera factura de la Parte B del año, primero se aplica el deducible de ${h.m(h.PB.deductible)} y el traslado básico le cuesta ${h.m(first.youPay)}. Los traslados programados que no son de emergencia, por ejemplo a diálisis, necesitan una orden por escrito que diga que la ambulancia es médicamente necesaria. Medicare también puede pagar un avión o un helicóptero si necesita un traslado rápido que un vehículo terrestre no puede dar.`;
    },
    faqs: (h) => {
      const fl = h.defaultLocality('FL');
      const one = h.E('ambulance-nonemergency', { locality: fl, miles: 8 });
      const n = h.E('ambulance-emergency', { locality: fl, miles: 10, coverage: 'medigap', medigap: 'N' });
      return [
        { q: '¿Por qué Medicare pagó menos cuando elegí un hospital más lejano?', a: 'Medicare cubre la ambulancia solo hasta el centro adecuado más cercano que pueda darle la atención que necesita. Si pide que lo lleven más allá, a un hospital de su preferencia, Medicare puede no pagar la distancia adicional. Cuando el hospital más cercano no puede tratar su afección, el traslado cubierto es el que llega al que sí puede.' },
        { q: '¿Medicare cubre la ambulancia de ida y vuelta a la diálisis?', a: `Puede cubrirla si su médico escribe una orden que diga que la ambulancia es médicamente necesaria, como ocurre a veces con la enfermedad renal terminal. En el resto de Florida, un traslado programado de ocho millas tiene un monto aprobado de ${h.m(one.approvedTotal)}, así que cada trayecto le cuesta ${h.m(one.youPay)} con el deducible pagado, y la ida y vuelta el doble. Los traslados frecuentes pueden exigir autorización previa.` },
        { q: '¿Qué es el papel que me pide firmar la compañía de ambulancias antes de un traslado programado?', a: 'Suele ser el Aviso Anticipado al Beneficiario sobre la Falta de Cobertura (ABN). La compañía debe dárselo cuando el traslado no es de emergencia y cree que Medicare quizá no pague ese servicio concreto. Al firmarlo, usted acepta pagar si Medicare lo rechaza. La regla se refiere a traslados programados, no a emergencias.' },
        { q: '¿Medigap paga mi parte de la factura de la ambulancia?', a: `Todas las letras estándar de Medigap pagan al menos una parte del coseguro de la Parte B. El Plan G paga todo el 20 %, y el Plan N también: el traslado básico de diez millas en el resto de Florida le deja ${h.m(n.youPay)} con el Plan N una vez pagado el deducible. Los planes K y L pagan la mitad o tres cuartas partes. El deducible de la Parte B sigue a su cargo con todos los planes que se venden a nuevos afiliados.` },
      ];
    },
    body: (h) => {
      const fl = h.defaultLocality('FL');
      const mile = h.E('ambulance-emergency', { locality: fl, miles: 1 }).lines[1].approved;
      const bls = h.E('ambulance-emergency', { locality: fl, miles: 10 });
      const als = h.E('ambulance-als', { locality: fl, miles: 10 });
      const sch = h.E('ambulance-nonemergency', { locality: fl, miles: 10 });
      const rur = h.E('ambulance-emergency', { locality: fl, miles: 10, area: 'rural' });
      const sup = h.E('ambulance-emergency', { locality: fl, miles: 40, area: 'superRural' });
      const man = h.E('ambulance-emergency', { locality: h.loc(/^Manhattan$/), miles: 10 });
      const ca = h.E('ambulance-emergency', { locality: h.defaultLocality('CA'), miles: 10 });
      const al = h.E('ambulance-emergency', { locality: h.defaultLocality('AL'), miles: 10 });
      return `
<h2>Cuándo el traslado es médicamente necesario</h2>
<p>Medicare no pregunta si la ambulancia era cómoda; pregunta si cualquier otro medio de transporte habría puesto en riesgo su salud. Si la respuesta es sí y usted necesita atención en un hospital, un hospital de acceso crítico, un hospital rural de emergencia o un centro de enfermería especializada, la Parte B cubre la ambulancia terrestre. Un traslado pedido porque no había auto ni taxi, cuando usted podía ir sentado sin peligro, no cumple la condición.</p>
<p>El destino también importa. Medicare paga el traslado hasta el centro adecuado más cercano, el más próximo que pueda darle la atención que necesita. El transporte en avión o helicóptero puede estar cubierto cuando su estado exige un traslado inmediato y rápido que un vehículo terrestre no puede ofrecer.</p>
<h2>Cómo se arma la factura: tarifa base más millas</h2>
<p>Las compañías de ambulancias cobran según el baremo de ambulancias de CMS, que fija una tarifa base para cada nivel de servicio y una tarifa por milla con el paciente a bordo. En el resto de Florida la milla urbana se paga a ${h.mx(mile)}, y la tarifa base depende de la atención que se presta durante el viaje. Los códigos son códigos públicos HCPCS de nivel II que mantiene CMS.</p>
${h.table(['Diez millas, resto de Florida', 'Tarifa base', 'Millas', 'Aprobado', 'Usted paga'], [
  ['Emergencia, soporte vital básico (A0429)', h.m(bls.lines[0].approved), h.m(bls.lines[1].approved), h.m(bls.approvedTotal), h.m(bls.youPay)],
  ['Emergencia, soporte vital avanzado nivel 1 (A0427)', h.m(als.lines[0].approved), h.m(als.lines[1].approved), h.m(als.approvedTotal), h.m(als.youPay)],
  ['Programado, sin emergencia (A0428)', h.m(sch.lines[0].approved), h.m(sch.lines[1].approved), h.m(sch.approvedTotal), h.m(sch.youPay)],
  ['Emergencia, básico, recogida rural', h.m(rur.lines[0].approved), h.m(rur.lines[1].approved), h.m(rur.approvedTotal), h.m(rur.youPay)],
], 'Baremo de ambulancias de CMS, año 2026, deducible de la Parte B ya pagado, compañía que acepta la asignación.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Recogidas rurales y distancias largas</h2>
<p>Una recogida en un código postal rural se paga un poco más en la tarifa base y bastante más por milla en las primeras 17 millas. En las zonas menos pobladas, clasificadas como muy rurales, la tarifa base sube otra vez: un traslado de emergencia de 40 millas desde una de esas zonas en Florida tiene un monto aprobado de ${h.m(sup.approvedTotal)}, y su 20 % es de ${h.m(sup.youPay)}. La minicalculadora le permite cambiar la distancia y el tipo de recogida.</p>
<h2>El mismo traslado en otros estados</h2>
<p>Las tarifas base siguen los costos locales. Un traslado básico de emergencia de diez millas le cuesta ${h.m(man.youPay)} en Manhattan, ${h.m(ca.youPay)} en el resto de California y ${h.m(al.youPay)} en Alabama, frente a ${h.m(bls.youPay)} en el resto de Florida, siempre con el deducible pagado. Elija su estado y su zona en la herramienta principal para cambiar estos ejemplos por los suyos.</p>
<!--tool:mini:deductible-->
<h2>Traslados programados, órdenes escritas y autorización previa</h2>
<p>Fuera de las emergencias, Medicare puede pagar la ambulancia si su médico u otro proveedor da una orden escrita que diga que es médicamente necesaria. El ejemplo que da Medicare es el de una persona con enfermedad renal terminal que no puede ir a la diálisis de otra forma sin riesgo.</p>
<p>Los traslados programados repetidos entran en un programa de Medicare que se aplica en todo el país: si tiene tres o más viajes de ida y vuelta en diez días, o al menos uno por semana durante tres semanas o más, la compañía puede pedir a Medicare una autorización previa antes de su cuarto viaje de ida y vuelta en un período de 30 días. Si la solicitud no se aprueba y los traslados continúan, Medicare rechaza las reclamaciones y la compañía puede cobrarle todo. La solicitud la puede presentar usted o la compañía; en el 1-800-MEDICARE responden las dudas.</p>
<h2>Avisos y facturas después del traslado</h2>
<p>Para un traslado sin emergencia que la compañía cree que Medicare puede rechazar, debe entregarle antes un Aviso Anticipado al Beneficiario sobre la Falta de Cobertura. Tras una emergencia, revise que la reclamación indique el nivel de servicio que realmente recibió y las millas desde la recogida hasta el hospital, porque esas dos líneas deciden lo que usted debe.</p>`;
    },
  },
});
