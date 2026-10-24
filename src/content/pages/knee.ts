import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'knee', group: 'cover', order: 13,
  tool: { kind: 'est', props: { act: 'knee-replacement', setting: 'inpatient' } },
  mini: { kind: 'mini:knee' },
  related: ['pt', 'snf', 'mri', 'wheelchairs', 'deductible', 'home'],
  sources: ['cms_fs2026', 'pfs', 'opps', 'clm104c04', 'medigap'],
  acts: ['knee-replacement'],
  en: {
    slug: 'does-medicare-cover-knee-replacement', nav: 'Knee replacement', card: 'Inpatient or outpatient, the Part A deductible, the surgeon’s 20 % and the rehab after.',
    title: 'Knee Replacement and Medicare 2026: Inpatient vs Outpatient',
    description: 'Medicare covers a medically necessary total knee replacement. See the 2026 cost as inpatient or outpatient, the Part A deductible, the surgeon fee and Medigap.',
    h1: 'Does Medicare cover knee replacement surgery?',
    intro: 'Yes, Medicare covers a medically necessary total knee replacement, either with a hospital admission under Part A or as a hospital outpatient under Part B. What you pay depends on that status more than on anything else. The estimator compares both with 2026 rates.',
    resume: (h) => {
      const ip = h.E('knee-replacement', { setting: 'inpatient' });
      const op = h.E('knee-replacement', { setting: 'hopd' });
      const g = h.E('knee-replacement', { setting: 'inpatient', coverage: 'medigap', medigap: 'G' });
      return `Medicare covers a total knee replacement when it is medically necessary, and the bill depends first on whether you are admitted as an inpatient or treated as a hospital outpatient. Admitted with a doctor's order to a hospital that accepts Medicare, Part A covers the hospital stay after the ${h.m(h.PA.inpatientDeductible)} Part A deductible for 2026, which pays for days 1 to 60 of the benefit period, and Part B covers the surgeon at 20 % of the approved amount. At national rates the surgeon's fee is approved ${h.m(ip.lines[0].approved)}, so an inpatient knee replacement costs you about ${h.m(ip.youPay)} once the Part B deductible is met: the Part A deductible plus ${h.m(ip.coinsurancePart)} for the surgeon. As a hospital outpatient, the hospital's rate is approved ${h.m(op.lines[1].approved)}, but your hospital copayment for a single service cannot exceed the Part A deductible, so your total lands at ${h.m(op.youPay)}, close to the inpatient figure. If the Part A deductible was already paid in the same benefit period, an inpatient stay leaves only the surgeon's 20 %. Medigap Plan G pays both the Part A deductible and the 20 %, which brings the inpatient case to ${h.m(g.youPay)}. The 2027 Part A and Part B amounts are not published yet.`;
    },
    faqs: (h) => {
      const paid = h.E('knee-replacement', { setting: 'inpatient', partAPaid: true });
      const k = h.E('knee-replacement', { setting: 'inpatient', coverage: 'medigap', medigap: 'K' });
      const snf = h.E('skilled-nursing', { count: 30 });
      return [
        { q: 'Does it matter whether I am admitted or kept as an outpatient for a knee replacement?', a: 'Yes. Medicare itself advises finding out whether you are an inpatient or an outpatient, because what you pay may differ. As an inpatient, Part A applies and you owe its deductible for the benefit period. As an outpatient, Part B applies: 20 % of the surgeon\'s fee plus a hospital copayment, capped for one service at the Part A deductible amount.' },
        { q: 'What if I already paid the Part A deductible this benefit period?', a: `Then an inpatient knee replacement in the same benefit period costs you only the surgeon's share under Part B: ${h.m(paid.youPay)} at national rates with the Part B deductible met. The Part A deductible applies per benefit period, not per calendar year, so a recent hospital stay can change the cost of the surgery a great deal.` },
        { q: 'Will Medicare pay for a skilled nursing stay after knee surgery?', a: `After a qualifying inpatient stay of at least 3 days in a row, not counting the day you leave, Part A covers skilled nursing facility care: days 1 to 20 at no daily cost, then ${h.m(h.PA.snfDaily21to100)} a day for days 21 to 100 in 2026. Thirty days would cost ${h.m(snf.youPay)}. Observation time and outpatient surgery do not count toward the 3 days.` },
        { q: 'How much does Medigap Plan K leave for a knee replacement?', a: `Plan K pays half of the Part A deductible and half of the Part B coinsurance. For an inpatient knee replacement at national rates, with the Part B deductible met, that leaves you ${h.m(k.youPay)}. Plan K also has a yearly out-of-pocket limit of ${h.m(h.P.medigap.planKOutOfPocketLimit)} in 2026: once you reach it and the Part B deductible, it pays all covered costs for the rest of the year.` },
      ];
    },
    body: (h) => {
      const ip = h.E('knee-replacement', { setting: 'inpatient' });
      const op = h.E('knee-replacement', { setting: 'hopd' });
      const ipFirst = h.E('knee-replacement', { setting: 'inpatient', deductibleRemaining: h.PB.deductible });
      const opFirst = h.E('knee-replacement', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const paid = h.E('knee-replacement', { setting: 'inpatient', partAPaid: true });
      const man = h.E('knee-replacement', { setting: 'inpatient', locality: h.loc(/^Manhattan$/) });
      const al = h.E('knee-replacement', { setting: 'inpatient', locality: h.defaultLocality('AL') });
      const snf20 = h.E('skilled-nursing', { count: 20 });
      const snf30 = h.E('skilled-nursing', { count: 30 });
      return `
<h2>Inpatient or outpatient: the question that sets the price</h2>
<p>Medicare covers many medically necessary inpatient and outpatient surgeries, and a total knee replacement can be either. Inpatient means you are formally admitted to the hospital with a doctor's order saying you need inpatient care; staying overnight is not enough on its own. Outpatient means the hospital treats you without that admission; time under observation counts as outpatient, even overnight. Medicare's own advice before a surgery is to find out which one you are, because Part A pays for the first and Part B for the second.</p>
${h.table(['National rates, 2026', 'Inpatient (Part A + Part B)', 'Hospital outpatient (Part B)'], [
  ['Surgeon, approved amount', h.m(ip.lines[0].approved), h.m(op.lines[0].approved)],
  ['Hospital', `Part A, ${h.m(h.PA.inpatientDeductible)} deductible`, `${h.m(op.lines[1].approved)} approved, copay capped`],
  ['You pay, Part B deductible met', h.m(ip.youPay), h.m(op.youPay)],
  ['You pay, Part B deductible not met', h.m(ipFirst.youPay), h.m(opFirst.youPay)],
], 'Physician fee schedule and OPPS Addendum B of October 2026; Part A amounts from the CMS fact sheet of November 14, 2025. Original Medicare only.', ['l', 'r', 'r'])}
<h2>As an inpatient</h2>
<p>For each benefit period in 2026, Part A charges a ${h.m(h.PA.inpatientDeductible)} deductible and then nothing for days 1 to 60, which covers a semi-private room, meals, general nursing, drugs given as part of the treatment and other hospital services and supplies. Part B then pays 80 % of the approved amount for the doctors who treat you during the stay, which leaves the surgeon's 20 % to you: ${h.m(ip.coinsurancePart)} at national rates. A private room that is not medically necessary, a television or phone billed separately, private-duty nursing and personal care items are not covered.</p>
<p>The Part A deductible is due once per benefit period, not once a year. If you were already hospitalized recently and paid it in the same benefit period, the knee replacement costs you only the surgeon's share, ${h.m(paid.youPay)}.</p>
<h2>As a hospital outpatient</h2>
<p>When the operation is done without admission, Part B pays the hospital's outpatient rate, which for a total knee replacement is high: ${h.m(op.lines[1].approved)} nationally. Your hospital copayment on such a service would normally exceed the Part A deductible, but the CMS claims rules limit the copayment for one outpatient service to the inpatient deductible amount. You then add 20 % of the surgeon's fee. That is why the two columns end up so close.</p>
<h2>The surgeon's fee where you live</h2>
<p>The surgeon is paid under the physician fee schedule, adjusted to local costs. The inpatient case leaves you ${h.m(man.youPay)} in Manhattan and ${h.m(al.youPay)} in Alabama, against ${h.m(ip.youPay)} nationally, with the Part B deductible met. Other doctors who treat you during the stay also bill Part B; pick your area in the estimator to price the surgeon.</p>
<!--tool:mini:snfDays-->
<h2>After the surgery</h2>
<p>Recovery can bring two more kinds of bills. A skilled nursing facility stay after a qualifying inpatient stay of at least 3 days in a row is covered by Part A: ${h.m(snf20.youPay)} for the first 20 days, then ${h.m(h.PA.snfDaily21to100)} a day, so 30 days come to ${h.m(snf30.youPay)}. Outpatient ${h.a('pt', 'physical therapy')} afterwards is a Part B service at 20 % with no yearly cap. A walker or a wheelchair for use at home falls under the ${h.a('wheelchairs', 'durable medical equipment rules')}.</p>
<h2>Medigap, Advantage and 2027</h2>
<p>Medigap Plan G pays the Part A deductible and all Part B coinsurance, leaving only the Part B deductible if it is still due. Plan N does the same on these lines. With a Medicare Advantage plan, the plan may charge copayments during the first 60 days of a hospital stay instead of the Part A deductible; its documents give the figures. CMS has not yet published the 2027 Part A deductible or the 2027 Part B amounts, expected in mid-November, so a surgery planned for 2027 can only be priced with 2026 figures for now.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-reemplazo-de-rodilla', nav: 'Reemplazo de rodilla', card: 'Hospitalizado o ambulatorio, el deducible de la Parte A, el 20 % del cirujano y la rehabilitación.',
    title: 'Reemplazo de rodilla y Medicare 2026: hospital y su parte',
    description: 'Medicare cubre el reemplazo total de rodilla médicamente necesario. Vea el costo 2026 internado o ambulatorio, el deducible de la Parte A, el cirujano, Medigap.',
    h1: '¿Medicare cubre la cirugía de reemplazo de rodilla?',
    intro: 'Sí. Medicare cubre el reemplazo total de rodilla médicamente necesario, ya sea con una internación en el hospital bajo la Parte A o como paciente ambulatorio del hospital bajo la Parte B. Lo que paga depende de esa condición más que de cualquier otra cosa. La calculadora compara los dos casos con las tarifas de 2026.',
    resume: (h) => {
      const ip = h.E('knee-replacement', { setting: 'inpatient' });
      const op = h.E('knee-replacement', { setting: 'hopd' });
      const g = h.E('knee-replacement', { setting: 'inpatient', coverage: 'medigap', medigap: 'G' });
      return `Medicare cubre el reemplazo total de rodilla cuando es médicamente necesario, y la factura depende ante todo de si lo internan o lo atienden como paciente ambulatorio del hospital. Si lo ingresan con una orden médica en un hospital que acepta Medicare, la Parte A cubre la estancia después del deducible de la Parte A de ${h.m(h.PA.inpatientDeductible)} en 2026, que paga los días 1 a 60 del período de beneficios, y la Parte B cubre al cirujano al 20 % del monto aprobado. A tarifa nacional, los honorarios del cirujano tienen un monto aprobado de ${h.m(ip.lines[0].approved)}, así que un reemplazo de rodilla con internación le cuesta unos ${h.m(ip.youPay)} con el deducible de la Parte B pagado: el deducible de la Parte A más ${h.m(ip.coinsurancePart)} por el cirujano. Como paciente ambulatorio, la tarifa del hospital tiene un monto aprobado de ${h.m(op.lines[1].approved)}, pero su copago al hospital por un solo servicio no puede superar el deducible de la Parte A, de modo que su total queda en ${h.m(op.youPay)}, muy cerca de la cifra con internación. Si ya pagó el deducible de la Parte A en el mismo período de beneficios, una internación solo le deja el 20 % del cirujano. El Plan G de Medigap paga el deducible de la Parte A y el 20 %, lo que lleva el caso con internación a ${h.m(g.youPay)}. Los montos de 2027 de las Partes A y B todavía no se han publicado.`;
    },
    faqs: (h) => {
      const paid = h.E('knee-replacement', { setting: 'inpatient', partAPaid: true });
      const k = h.E('knee-replacement', { setting: 'inpatient', coverage: 'medigap', medigap: 'K' });
      const snf = h.E('skilled-nursing', { count: 30 });
      return [
        { q: '¿Importa si me internan o me atienden como paciente ambulatorio para el reemplazo de rodilla?', a: 'Sí. El propio Medicare aconseja averiguar si usted es paciente internado o ambulatorio, porque lo que paga puede ser distinto. Internado, se aplica la Parte A y usted debe su deducible del período de beneficios. Ambulatorio, se aplica la Parte B: el 20 % de los honorarios del cirujano más un copago al hospital, con un tope por servicio igual al deducible de la Parte A.' },
        { q: '¿Y si ya pagué el deducible de la Parte A en este período de beneficios?', a: `Entonces un reemplazo de rodilla con internación en el mismo período de beneficios solo le cuesta la parte del cirujano en la Parte B: ${h.m(paid.youPay)} a tarifa nacional con el deducible de la Parte B pagado. El deducible de la Parte A se aplica por período de beneficios, no por año calendario, así que una hospitalización reciente puede cambiar mucho el costo de la cirugía.` },
        { q: '¿Medicare paga una estancia en un centro de enfermería después de la cirugía de rodilla?', a: `Tras una internación que califique, de al menos 3 días seguidos sin contar el día del alta, la Parte A cubre el centro de enfermería especializada: los días 1 a 20 sin costo diario y luego ${h.m(h.PA.snfDaily21to100)} al día de los días 21 a 100 en 2026. Treinta días costarían ${h.m(snf.youPay)}. El tiempo en observación y la cirugía ambulatoria no cuentan para esos 3 días.` },
        { q: '¿Cuánto deja el Plan K de Medigap por un reemplazo de rodilla?', a: `El Plan K paga la mitad del deducible de la Parte A y la mitad del coseguro de la Parte B. Por un reemplazo de rodilla con internación a tarifa nacional, con el deducible de la Parte B pagado, le deja ${h.m(k.youPay)}. El Plan K tiene además un límite anual de gastos de ${h.m(h.P.medigap.planKOutOfPocketLimit)} en 2026: al alcanzarlo, junto con el deducible de la Parte B, paga todos los costos cubiertos el resto del año.` },
      ];
    },
    body: (h) => {
      const ip = h.E('knee-replacement', { setting: 'inpatient' });
      const op = h.E('knee-replacement', { setting: 'hopd' });
      const ipFirst = h.E('knee-replacement', { setting: 'inpatient', deductibleRemaining: h.PB.deductible });
      const opFirst = h.E('knee-replacement', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const paid = h.E('knee-replacement', { setting: 'inpatient', partAPaid: true });
      const man = h.E('knee-replacement', { setting: 'inpatient', locality: h.loc(/^Manhattan$/) });
      const al = h.E('knee-replacement', { setting: 'inpatient', locality: h.defaultLocality('AL') });
      const snf20 = h.E('skilled-nursing', { count: 20 });
      const snf30 = h.E('skilled-nursing', { count: 30 });
      return `
<h2>Internado o ambulatorio: la pregunta que fija el precio</h2>
<p>Medicare cubre muchas cirugías médicamente necesarias, con internación o ambulatorias, y un reemplazo total de rodilla puede ser de los dos tipos. Internado significa que lo ingresan formalmente en el hospital con una orden médica que dice que necesita atención hospitalaria; pasar la noche no basta por sí solo. Ambulatorio significa que el hospital lo atiende sin ese ingreso; el tiempo en observación cuenta como ambulatorio, aunque sea de noche. El consejo de Medicare antes de una cirugía es averiguar en qué situación está, porque la Parte A paga la primera y la Parte B la segunda.</p>
${h.table(['Tarifas nacionales, 2026', 'Internado (Parte A + Parte B)', 'Hospital ambulatorio (Parte B)'], [
  ['Cirujano, monto aprobado', h.m(ip.lines[0].approved), h.m(op.lines[0].approved)],
  ['Hospital', `Parte A, deducible de ${h.m(h.PA.inpatientDeductible)}`, `${h.m(op.lines[1].approved)} aprobado, copago con tope`],
  ['Usted paga, deducible de la Parte B pagado', h.m(ip.youPay), h.m(op.youPay)],
  ['Usted paga, deducible de la Parte B pendiente', h.m(ipFirst.youPay), h.m(opFirst.youPay)],
], 'Baremo de médicos y Anexo B de OPPS de octubre de 2026; montos de la Parte A según la hoja informativa de CMS del 14 de noviembre de 2025. Solo Medicare Original.', ['l', 'r', 'r'])}
<h2>Con internación</h2>
<p>Por cada período de beneficios de 2026, la Parte A cobra un deducible de ${h.m(h.PA.inpatientDeductible)} y luego nada durante los días 1 a 60, lo que incluye una habitación semiprivada, las comidas, la enfermería general, los medicamentos que forman parte del tratamiento y otros servicios y suministros del hospital. La Parte B paga entonces el 80 % del monto aprobado de los médicos que lo atienden durante la estancia, y a usted le queda el 20 % del cirujano: ${h.m(ip.coinsurancePart)} a tarifa nacional. No están cubiertos una habitación privada que no sea médicamente necesaria, el televisor o el teléfono que se cobren aparte, la enfermería privada ni los artículos de cuidado personal.</p>
<p>El deducible de la Parte A se paga una vez por período de beneficios, no una vez al año. Si estuvo hospitalizado hace poco y ya lo pagó en el mismo período de beneficios, el reemplazo de rodilla solo le cuesta la parte del cirujano, ${h.m(paid.youPay)}.</p>
<h2>Como paciente ambulatorio del hospital</h2>
<p>Cuando la operación se hace sin internación, la Parte B paga la tarifa ambulatoria del hospital, que en un reemplazo total de rodilla es alta: ${h.m(op.lines[1].approved)} a nivel nacional. Su copago al hospital por un servicio así superaría normalmente el deducible de la Parte A, pero las reglas de reclamaciones de CMS limitan el copago de un solo servicio ambulatorio al monto del deducible de hospitalización. A eso se suma el 20 % de los honorarios del cirujano. Por eso las dos columnas quedan tan cerca.</p>
<h2>Los honorarios del cirujano según donde vive</h2>
<p>El cirujano cobra según el baremo de médicos, ajustado a los costos locales. El caso con internación le cuesta ${h.m(man.youPay)} en Manhattan y ${h.m(al.youPay)} en Alabama, frente a ${h.m(ip.youPay)} a nivel nacional, con el deducible de la Parte B pagado. Los demás médicos que lo atienden durante la estancia también facturan a la Parte B; elija su zona en la calculadora para calcular al cirujano.</p>
<!--tool:mini:snfDays-->
<h2>Después de la cirugía</h2>
<p>La recuperación puede traer otros dos tipos de facturas. Una estancia en un centro de enfermería especializada tras una internación que califique, de al menos 3 días seguidos, la cubre la Parte A: ${h.m(snf20.youPay)} los primeros 20 días y luego ${h.m(h.PA.snfDaily21to100)} al día, así que 30 días suman ${h.m(snf30.youPay)}. La ${h.a('pt', 'fisioterapia')} ambulatoria posterior es un servicio de la Parte B al 20 %, sin tope anual. Un andador o una silla de ruedas para usar en casa sigue las ${h.a('wheelchairs', 'reglas del equipo médico duradero')}.</p>
<h2>Medigap, Advantage y 2027</h2>
<p>El Plan G de Medigap paga el deducible de la Parte A y todo el coseguro de la Parte B, y solo le deja el deducible de la Parte B si aún lo debe. El Plan N hace lo mismo en estas líneas. Con un plan Medicare Advantage, el plan puede cobrar copagos durante los primeros 60 días de hospitalización en lugar del deducible de la Parte A; sus documentos dan las cifras. CMS todavía no ha publicado el deducible de la Parte A ni los montos de la Parte B de 2027, previstos para mediados de noviembre, así que una cirugía prevista para 2027 solo puede calcularse por ahora con las cifras de 2026.</p>`;
    },
  },
});
