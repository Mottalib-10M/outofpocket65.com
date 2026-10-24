import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'chiropractic', group: 'cover', order: 7,
  tool: { kind: 'est', props: { act: 'chiropractic-adjustment', count: 8 } },
  mini: { kind: 'mini:chiro' },
  related: ['pt', 'acupuncture', 'mri', 'not-covered', 'part-b', 'home'],
  sources: ['pfs', 'assignment', 'medigap', 'notcovered'],
  acts: ['chiropractic-adjustment'],
  en: {
    slug: 'does-medicare-cover-chiropractic', nav: 'Chiropractic care', card: 'Only the hands-on spinal adjustment for a subluxation is covered; X-rays and massage are not.',
    title: 'Chiropractic Care and Medicare 2026: The One Covered Service',
    description: 'Part B pays only for spinal adjustments that correct a subluxation. See the 2026 approved amount per adjustment, your 20 % and the services left to you.',
    h1: 'Does Medicare cover chiropractic care?',
    intro: 'Only in part. Part B pays for one thing a chiropractor does, the adjustment of the spine to correct a subluxation, and nothing else the chiropractor orders. The estimator prices a series of adjustments in your area with the 2026 fee schedule.',
    resume: (h) => {
      const one = h.E('chiropractic-adjustment');
      const eight = h.E('chiropractic-adjustment', { count: 8 });
      const first = h.E('chiropractic-adjustment', { deductibleRemaining: h.PB.deductible });
      return `Medicare Part B covers a single chiropractic service: manual manipulation of the spine to correct a subluxation, which Medicare describes as spinal joints that fail to move properly while the contact between them remains intact, done with the chiropractor's hands or with a small hand-held device called an activator. Everything else a chiropractor provides or orders is outside coverage and billed to you in full, including X-rays, massage therapy and acupuncture. For the covered adjustment you pay 20 % of the Medicare-approved amount after the ${h.m(h.PB.deductible)} Part B deductible. At national 2026 rates, an adjustment of three to four spinal regions is approved ${h.m(one.approvedTotal)}, so each visit costs you ${h.m(one.youPay)} once the deductible is met, and a course of eight adjustments about ${h.m(eight.youPay)}. If the adjustment is your first Part B bill of the year, it falls entirely within the deductible and you pay the whole ${h.m(first.youPay)}. Medigap pays the 20 % on the adjustment under most letters but cannot pay for the excluded services, since they have no approved amount. The mini tool adds the excluded items you were billed to your share.`;
    },
    faqs: (h) => {
      const one = h.E('chiropractic-adjustment');
      const np = h.E('chiropractic-adjustment', { assignment: false });
      return [
        { q: 'Does Medicare pay for X-rays taken by a chiropractor?', a: 'No. Medicare states that it does not cover other services or tests a chiropractor orders, and it names X-rays first among them, along with massage therapy and acupuncture. Imaging ordered by your doctor or another provider to diagnose a medical problem is a different case: it falls under the Part B rules for diagnostic tests, at 20 % after the deductible.' },
        { q: 'What is a subluxation in Medicare terms?', a: 'Medicare uses the word for spinal joints that fail to move properly while the contact between the joints stays intact. Correcting it by manual manipulation of the spine is the only chiropractic service Part B covers, whether the chiropractor uses the hands or an activator, a hand-held instrument. Adjustments of other parts of the body are not part of the covered service.' },
        { q: 'Can a chiropractor charge more than the Medicare-approved amount?', a: `A chiropractor who accepts assignment takes the approved amount as full payment, so you owe only the deductible and 20 %. One who does not accept assignment may charge up to 15 % above the amount allowed for non-participating providers: at national rates your share of an adjustment rises from ${h.m(one.youPay)} to ${h.m(np.youPay)}. Services Medicare does not cover have no limit at all.` },
      ];
    },
    body: (h) => {
      const one = h.E('chiropractic-adjustment');
      const twelve = h.E('chiropractic-adjustment', { count: 12 });
      const man = h.E('chiropractic-adjustment', { count: 12, locality: h.loc(/^Manhattan$/) });
      const al = h.E('chiropractic-adjustment', { count: 12, locality: h.defaultLocality('AL') });
      const tx = h.E('chiropractic-adjustment', { count: 12, locality: h.defaultLocality('TX') });
      const g = h.E('chiropractic-adjustment', { count: 12, coverage: 'medigap', medigap: 'G' });
      const l = h.E('chiropractic-adjustment', { count: 12, coverage: 'medigap', medigap: 'L' });
      const firstTwelve = h.E('chiropractic-adjustment', { count: 12, deductibleRemaining: h.PB.deductible });
      return `
<h2>A narrow benefit with sharp edges</h2>
<p>Chiropractic care, as Medicare describes it, covers techniques such as adjustments of the spine or other parts of the body to relieve pain. Medicare pays for a much smaller slice of that field. Part B covers adjustments of the spine by a chiropractor to correct a subluxation, done by hand or with an activator, and stops there. Adjusting a shoulder, a hip or a knee falls outside it, and so does every other service or test the chiropractor orders, massage and X-rays included: the clinic sets those prices.</p>
<p>In practice, a visit to a chiropractor can produce two kinds of lines on the same day: the covered spinal adjustment, which follows the Part B rule, and services Medicare does not pay for, which you settle in full. Asking the clinic which line each service belongs to before treatment starts avoids most surprises.</p>
<h2>Price of the covered adjustment</h2>
<p>The adjustment is paid under the physician fee schedule. The national 2026 amount for manipulation of three to four spinal regions is ${h.m(one.approvedTotal)}, and your 20 % is ${h.m(one.youPay)} per visit once the deductible is met. Over a typical course, the amounts add up visit by visit:</p>
${h.table(['Twelve adjustments', 'Approved', 'You pay'], [
  ['National rates, deductible met', h.m(twelve.approvedTotal), h.m(twelve.youPay)],
  ['National rates, deductible not yet met', h.m(firstTwelve.approvedTotal), h.m(firstTwelve.youPay)],
  ['Manhattan, deductible met', h.m(man.approvedTotal), h.m(man.youPay)],
  ['Rest of Texas, deductible met', h.m(tx.approvedTotal), h.m(tx.youPay)],
  ['Alabama, deductible met', h.m(al.approvedTotal), h.m(al.youPay)],
], 'Spinal manipulation, three to four regions, physician fee schedule October 2026, chiropractor accepting assignment.', ['l', 'r', 'r'])}
<p>The second line shows how the deductible works here: because a single adjustment is approved for less than the ${h.m(h.PB.deductible)} deductible, the first several visits of the year are paid by you in full until the deductible is used up, and only then does the 20 % apply.</p>
<h2>Services that stay at full price</h2>
<p>Medicare is explicit that it does not cover other services or tests a chiropractor orders, and it names X-rays, massage therapy and acupuncture. There is no approved amount for these items, so there is nothing for Medicare or a Medigap policy to share, and no cap on the price. Enter what you were billed for them in the mini tool to see the full cost of a course of care.</p>
<p>Acupuncture deserves a word, because Medicare does cover it in one situation, for chronic low back pain, under its own rules and providers. That coverage does not pass through a chiropractor's order; the ${h.a('acupuncture', 'acupuncture page')} explains it.</p>
<!--tool:mini:medigap-->
<h2>Supplemental coverage and the adjustment</h2>
<p>Medigap pays after Medicare on the covered adjustment. With Plan G, twelve adjustments cost you ${h.m(g.youPay)} once the deductible is met; Plan L pays 75 % of the coinsurance and leaves ${h.m(l.youPay)}. A Medicare Advantage plan has to cover the spinal adjustment at least as Original Medicare does, and some plans add extra benefits; the plan's own documents give the copay.</p>
<h2>Before a course of care begins</h2>
<p>Ask the chiropractor whether they accept assignment, which keeps your share at 20 % of the approved amount, and whether they participate in Medicare at all: a provider who has opted out is not paid by Medicare, even for the adjustment. Ask also which planned services are not covered and what they cost. Medicare's own advice is to ask why a service is recommended and what Medicare will pay for it, so that the bill matches what you expected.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-quiropractico', nav: 'Quiropráctico', card: 'Solo el ajuste manual de la columna por una subluxación está cubierto; radiografías y masajes no.',
    title: 'Quiropráctico y Medicare 2026: el único servicio cubierto',
    description: 'La Parte B solo paga los ajustes de columna que corrigen una subluxación. Vea el monto aprobado de 2026 por ajuste, su 20 % y lo que queda a su cargo.',
    h1: '¿Medicare cubre al quiropráctico?',
    intro: 'Solo en parte. La Parte B paga una sola cosa de lo que hace un quiropráctico, el ajuste de la columna para corregir una subluxación, y nada más de lo que indique. La calculadora pone precio a una serie de ajustes en su zona con el baremo de 2026.',
    resume: (h) => {
      const one = h.E('chiropractic-adjustment');
      const eight = h.E('chiropractic-adjustment', { count: 8 });
      const first = h.E('chiropractic-adjustment', { deductibleRemaining: h.PB.deductible });
      return `La Parte B de Medicare cubre un único servicio quiropráctico: la manipulación manual de la columna para corregir una subluxación, que Medicare describe como articulaciones de la columna que no se mueven bien aunque el contacto entre ellas sigue intacto, hecha con las manos del quiropráctico o con un pequeño instrumento de mano llamado activador. Todo lo demás que el quiropráctico hace o indica queda fuera de la cobertura y se le cobra completo, incluidas las radiografías, la masoterapia y la acupuntura. Por el ajuste cubierto usted paga el 20 % del monto aprobado por Medicare después del deducible de la Parte B de ${h.m(h.PB.deductible)}. Con las tarifas nacionales de 2026, un ajuste de tres a cuatro regiones de la columna tiene un monto aprobado de ${h.m(one.approvedTotal)}, así que cada visita le cuesta ${h.m(one.youPay)} con el deducible pagado, y una serie de ocho ajustes unos ${h.m(eight.youPay)}. Si el ajuste es su primera factura de la Parte B del año, queda dentro del deducible y usted paga los ${h.m(first.youPay)} completos. Medigap paga el 20 % del ajuste con la mayoría de las letras, pero no puede pagar los servicios excluidos, porque no tienen monto aprobado. La minicalculadora suma a su parte lo que le cobraron por esos servicios.`;
    },
    faqs: (h) => {
      const one = h.E('chiropractic-adjustment');
      const np = h.E('chiropractic-adjustment', { assignment: false });
      return [
        { q: '¿Medicare paga las radiografías que toma un quiropráctico?', a: 'No. Medicare indica que no cubre otros servicios ni pruebas que indique un quiropráctico, y menciona primero las radiografías, junto con la masoterapia y la acupuntura. Las imágenes que indica su médico u otro proveedor para diagnosticar un problema médico son otro caso: siguen las reglas de la Parte B para pruebas diagnósticas, con el 20 % después del deducible.' },
        { q: '¿Qué es una subluxación para Medicare?', a: 'Medicare usa la palabra para las articulaciones de la columna que no se mueven bien aunque el contacto entre ellas sigue intacto. Corregirla con la manipulación manual de la columna es el único servicio quiropráctico que cubre la Parte B, ya sea con las manos o con un activador, un instrumento de mano. Los ajustes de otras partes del cuerpo no forman parte del servicio cubierto.' },
        { q: '¿Un quiropráctico puede cobrar más que el monto aprobado por Medicare?', a: `Un quiropráctico que acepta la asignación toma el monto aprobado como pago total, así que usted solo debe el deducible y el 20 %. Uno que no la acepta puede cobrar hasta un 15 % por encima del monto permitido a los proveedores no participantes: a tarifa nacional, su parte de un ajuste sube de ${h.m(one.youPay)} a ${h.m(np.youPay)}. Los servicios que Medicare no cubre no tienen ningún límite.` },
      ];
    },
    body: (h) => {
      const one = h.E('chiropractic-adjustment');
      const twelve = h.E('chiropractic-adjustment', { count: 12 });
      const man = h.E('chiropractic-adjustment', { count: 12, locality: h.loc(/^Manhattan$/) });
      const al = h.E('chiropractic-adjustment', { count: 12, locality: h.defaultLocality('AL') });
      const tx = h.E('chiropractic-adjustment', { count: 12, locality: h.defaultLocality('TX') });
      const g = h.E('chiropractic-adjustment', { count: 12, coverage: 'medigap', medigap: 'G' });
      const l = h.E('chiropractic-adjustment', { count: 12, coverage: 'medigap', medigap: 'L' });
      const firstTwelve = h.E('chiropractic-adjustment', { count: 12, deductibleRemaining: h.PB.deductible });
      return `
<h2>Un beneficio estrecho y con límites claros</h2>
<p>La quiropráctica, tal como la describe Medicare, abarca técnicas como los ajustes de la columna o de otras partes del cuerpo para aliviar el dolor. Medicare paga una parte mucho menor de ese campo. La Parte B cubre los ajustes de la columna que hace un quiropráctico para corregir una subluxación, a mano o con un activador, y ahí se detiene. Ajustar un hombro, una cadera o una rodilla queda fuera, igual que cualquier otro servicio o prueba que indique el quiropráctico, masajes y radiografías incluidos: esos precios los fija la clínica.</p>
<p>En la práctica, una visita al quiropráctico puede generar dos tipos de líneas el mismo día: el ajuste de la columna cubierto, que sigue la regla de la Parte B, y servicios que Medicare no paga, que usted salda completos. Preguntar a la clínica a qué línea pertenece cada servicio antes de empezar evita la mayoría de las sorpresas.</p>
<h2>El precio del ajuste cubierto</h2>
<p>El ajuste se paga con el baremo de médicos. El monto nacional de 2026 por la manipulación de tres a cuatro regiones de la columna es de ${h.m(one.approvedTotal)}, y su 20 % es de ${h.m(one.youPay)} por visita con el deducible pagado. En una serie típica, los montos se suman visita a visita:</p>
${h.table(['Doce ajustes', 'Aprobado', 'Usted paga'], [
  ['Tarifas nacionales, deducible pagado', h.m(twelve.approvedTotal), h.m(twelve.youPay)],
  ['Tarifas nacionales, deducible aún pendiente', h.m(firstTwelve.approvedTotal), h.m(firstTwelve.youPay)],
  ['Manhattan, deducible pagado', h.m(man.approvedTotal), h.m(man.youPay)],
  ['Resto de Texas, deducible pagado', h.m(tx.approvedTotal), h.m(tx.youPay)],
  ['Alabama, deducible pagado', h.m(al.approvedTotal), h.m(al.youPay)],
], 'Manipulación de la columna, tres a cuatro regiones, baremo de médicos de octubre de 2026, quiropráctico que acepta la asignación.', ['l', 'r', 'r'])}
<p>La segunda línea muestra cómo funciona aquí el deducible: como un solo ajuste tiene un monto aprobado menor que el deducible de ${h.m(h.PB.deductible)}, las primeras visitas del año las paga usted completas hasta agotar el deducible, y solo entonces se aplica el 20 %.</p>
<h2>Los servicios que se pagan a precio completo</h2>
<p>Medicare dice con claridad que no cubre otros servicios ni pruebas que indique un quiropráctico, y nombra las radiografías, la masoterapia y la acupuntura. Esos conceptos no tienen monto aprobado, así que ni Medicare ni una póliza Medigap tienen nada que compartir, y su precio no tiene tope. Escriba lo que le cobraron por ellos en la minicalculadora para ver el costo total de la serie.</p>
<p>La acupuntura merece una aclaración, porque Medicare sí la cubre en un caso, el dolor lumbar crónico, con reglas y proveedores propios. Esa cobertura no pasa por la indicación de un quiropráctico; la ${h.a('acupuncture', 'página sobre acupuntura')} lo explica.</p>
<!--tool:mini:medigap-->
<h2>La cobertura complementaria y el ajuste</h2>
<p>Medigap paga después de Medicare sobre el ajuste cubierto. Con el Plan G, doce ajustes le cuestan ${h.m(g.youPay)} con el deducible pagado; el Plan L paga el 75 % del coseguro y le deja ${h.m(l.youPay)}. Un plan Medicare Advantage debe cubrir el ajuste de la columna por lo menos como Medicare Original, y algunos planes añaden beneficios; el copago figura en los documentos del plan.</p>
<h2>Antes de empezar una serie de sesiones</h2>
<p>Pregunte al quiropráctico si acepta la asignación, que mantiene su parte en el 20 % del monto aprobado, y si participa en Medicare: un proveedor que se retiró de Medicare no recibe pagos de Medicare, ni siquiera por el ajuste. Pregunte también qué servicios previstos no están cubiertos y cuánto cuestan. El consejo de Medicare es preguntar por qué se recomienda un servicio y cuánto pagará Medicare, para que la factura coincida con lo que esperaba.</p>`;
    },
  },
});
