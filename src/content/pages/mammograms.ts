import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'mammograms', group: 'cover', order: 26,
  tool: { kind: 'est', props: { act: 'mammogram-screening', acts: ['mammogram-screening', 'mammogram-diagnostic', 'wellness-visit', 'office-visit'] } },
  mini: { kind: 'mini:mammo' },
  related: ['colonoscopy', 'mri', 'deductible', 'part-b', 'home'],
  sources: ['pfs', 'cms_fs2026', 'partb'],
  acts: ['mammogram-screening'],
  en: {
    slug: 'does-medicare-cover-mammograms', nav: 'Mammograms', card: 'Yearly screening at $0 from age 40, a baseline between 35 and 39, and 20 % for a diagnostic mammogram.',
    title: 'Mammograms and Medicare 2026: Screening $0, Diagnostic 20 %',
    description: 'Medicare Part B covers a screening mammogram every 12 months from age 40 at no cost, a baseline at 35 to 39, and diagnostic ones at 20 % after the deductible.',
    h1: 'Does Medicare cover mammograms?',
    intro: 'Yes, under Part B: screening mammograms cost nothing with a provider who accepts assignment; diagnostic ones cost 20 %. Switch the service in the estimator to compare the two.',
    resume: (h) => {
      const s = h.E('mammogram-screening'); const d = h.E('mammogram-diagnostic', { deductibleRemaining: h.PB.deductible }); const dm = h.E('mammogram-diagnostic');
      return `Medicare Part B covers three kinds of mammograms, and they are not billed the same way. A baseline mammogram, usually the first one, is covered once in a lifetime for women aged 35 to 39. A screening mammogram is covered once every 12 months for women 40 and older, and it costs nothing when the provider accepts assignment: Medicare pays the full approved amount, ${h.m(s.approvedTotal)} at national rates in 2026. A diagnostic mammogram, done to investigate a symptom, a sign of breast cancer or an abnormal screening result, is covered as often as medically necessary, but it follows the usual Part B rules: the ${h.m(h.PB.deductible)} deductible, then 20 % of the approved amount. At national rates a diagnostic mammogram of both breasts is approved at ${h.m(dm.approvedTotal)}; it costs you ${h.m(dm.youPay)} once the deductible is met and ${h.m(d.youPay)} if it is your first Part B bill of the year. A breast ultrasound is covered when it is medically necessary and ordered by your provider. Medicare Advantage plans must cover these mammograms too.`;
    },
    faqs: (h) => [
      { q: 'Why did I get a bill after a free screening mammogram?', a: `Usually because something else happened that day. If the radiologist asked for more images or an ultrasound after the screening, those are diagnostic services billed at 20 % after the deductible. A provider who does not accept assignment can also bill you. A diagnostic mammogram leaves you ${h.m(h.E('mammogram-diagnostic').youPay)} at national rates with the deductible met; check the Medicare Summary Notice for the line that is yours.` },
      { q: 'How often does Medicare pay for a mammogram?', a: 'A screening mammogram once every 12 months for women 40 and older, a baseline mammogram once in a lifetime between 35 and 39, and diagnostic mammograms more often than once a year when they are medically necessary. Since a screening is covered once every 12 months, check the date of your previous one before booking the next.' },
      { q: 'Does Medigap pay for a diagnostic mammogram?', a: `Yes, the part Original Medicare leaves to you. Plan G pays the 20 % once the deductible is met, so a diagnostic mammogram costs you ${h.m(h.E('mammogram-diagnostic', { coverage: 'medigap', medigap: 'G' }).youPay)}; Plans C and F also pay the Part B deductible, but only people eligible for Medicare before January 1, 2020 can buy them. The screening mammogram needs no Medigap: it is already $0.` },
    ],
    body: (h) => {
      const s = h.E('mammogram-screening'); const dm = h.E('mammogram-diagnostic'); const dd = h.E('mammogram-diagnostic', { deductibleRemaining: h.PB.deductible });
      const man = h.E('mammogram-diagnostic', { locality: h.loc(/^Manhattan$/) }); const al = h.E('mammogram-diagnostic', { locality: h.defaultLocality('AL') });
      return `
<h2>Three mammograms, three rules</h2>
${h.table(['Type', 'Who', 'How often', 'You pay'], [
  ['Baseline', 'Women 35 to 39', 'Once in a lifetime', '$0 with assignment'],
  ['Screening', 'Women 40 and older', 'Once every 12 months', `${h.m(s.youPay)} with assignment`],
  ['Diagnostic', 'When medically necessary', 'As often as needed', `20 % after the deductible: ${h.m(dm.youPay)} to ${h.m(dd.youPay)}`],
], 'Medicare.gov rules; diagnostic amounts at national rates of October 2026, with and without the deductible met.', ['l', 'l', 'l', 'r'])}
<p>The difference between screening and diagnostic is not the machine but the reason. A screening mammogram checks a woman with no symptoms. A diagnostic mammogram investigates abnormalities, including symptoms or signs of breast cancer. The same visit can switch from one to the other if the radiologist decides more images are needed, and the bill switches with it.</p>
<h2>What a diagnostic mammogram costs you</h2>
<p>The approved amount comes from the physician fee schedule, with a part for the radiologist who reads the images and a technical part for the equipment and staff. It varies with your price area: ${h.m(man.approvedTotal)} in Manhattan and ${h.m(al.approvedTotal)} in Alabama, against ${h.m(dm.approvedTotal)} nationally. Your 20 % follows it.</p>
<!--tool:mini:mammo-->
<h2>Three years, three bills</h2>
<p>A year with only the yearly screening costs you nothing, while Medicare pays the provider ${h.m(s.approvedTotal)}. A year in which the screening in March leads to a call back for diagnostic images, with the deductible still open, costs you ${h.m(dd.youPay)} for those images, because the whole approved amount falls into the deductible. The same call back in October, after other care has used up the deductible, costs you ${h.m(dm.youPay)}. With Medigap Plan G, the October bill drops to ${h.m(h.E('mammogram-diagnostic', { coverage: 'medigap', medigap: 'G' }).youPay)} and the March one stays at the deductible part. The order of your bills in the year matters as much as the test itself.</p>
<h2>Follow-up after an abnormal result</h2>
<p>After a screening that needs a second look, your doctor or other provider may order a diagnostic mammogram and a breast ultrasound to check specific areas. Medicare covers breast ultrasounds only when they are medically necessary and ordered by your provider. Each follow-up service is billed under Part B with the deductible and 20 %; an ${h.a('mri', 'MRI')} ordered later follows the same rules, with a higher amount in a hospital outpatient department than at an imaging center.</p>
<h2>Medigap and Medicare Advantage</h2>
<p>For the screening, Medigap changes nothing because there is nothing to pay. For diagnostic imaging, Plans A, B, C, D, F, G, M and N pay the whole 20 %, Plan K half of it and Plan L three quarters. A Medicare Advantage plan must cover the same mammograms as Original Medicare and sets its own cost sharing for the diagnostic ones; its Summary of Benefits gives the copay.</p>
<h2>Before the appointment</h2>
<p>Check three things. That 12 months have passed since your last screening mammogram. That the facility and the radiologist accept assignment, so that the screening stays at $0. And, if you are called back, whether the next images will be billed as diagnostic. Coverage rules come from the ${h.cov('mammogram-screening', 'medicare.gov mammograms page')}.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-mamografias', nav: 'Mamografías', card: 'Detección anual a 0 $ desde los 40, una de referencia entre 35 y 39 años, y el 20 % de una diagnóstica.',
    title: 'Mamografías y Medicare 2026: gratis o al 20 % según el tipo',
    description: 'La Parte B cubre una mamografía de detección cada 12 meses desde los 40 sin costo, una de referencia entre 35 y 39 y las diagnósticas al 20 % tras el deducible.',
    h1: '¿Medicare cubre las mamografías?',
    intro: 'Sí, con la Parte B: la mamografía de detección no cuesta nada con un proveedor que acepta la asignación; la diagnóstica cuesta el 20 %. Cambie el servicio en la calculadora para comparar las dos.',
    resume: (h) => {
      const s = h.E('mammogram-screening'); const d = h.E('mammogram-diagnostic', { deductibleRemaining: h.PB.deductible }); const dm = h.E('mammogram-diagnostic');
      return `La Parte B de Medicare cubre tres tipos de mamografía, y no se facturan igual. La mamografía de referencia, por lo general la primera, se cubre una vez en la vida para las mujeres de 35 a 39 años. La mamografía de detección se cubre una vez cada 12 meses para las mujeres de 40 años o más, y no cuesta nada si el proveedor acepta la asignación: Medicare paga todo el monto aprobado, ${h.m(s.approvedTotal)} a tarifas nacionales de 2026. La mamografía diagnóstica, que se hace para estudiar un síntoma, un signo de cáncer de mama o un resultado anormal, se cubre tantas veces como sea médicamente necesario, pero sigue las reglas habituales de la Parte B: el deducible de ${h.m(h.PB.deductible)} y luego el 20 % del monto aprobado. A tarifas nacionales, una mamografía diagnóstica de ambas mamas tiene un monto aprobado de ${h.m(dm.approvedTotal)}; le cuesta ${h.m(dm.youPay)} con el deducible pagado y ${h.m(d.youPay)} si es su primera factura de la Parte B del año. La ecografía mamaria se cubre cuando es médicamente necesaria y la pide su proveedor. Los planes Medicare Advantage también deben cubrir estas mamografías.`;
    },
    faqs: (h) => [
      { q: '¿Por qué recibí una factura después de una mamografía de detección gratuita?', a: `Normalmente porque ese día pasó algo más. Si el radiólogo pidió más imágenes o una ecografía después de la detección, son servicios diagnósticos que se cobran al 20 % tras el deducible. Un proveedor que no acepta la asignación también puede facturarle. Una mamografía diagnóstica le deja ${h.m(h.E('mammogram-diagnostic').youPay)} a tarifas nacionales con el deducible pagado; busque en el Resumen de Medicare la línea que le corresponde.` },
      { q: '¿Cada cuánto paga Medicare una mamografía?', a: 'Una mamografía de detección cada 12 meses para las mujeres de 40 años o más, una de referencia una sola vez en la vida entre los 35 y los 39 años, y las diagnósticas con más frecuencia que una vez al año cuando son médicamente necesarias. Como la detección se cubre una vez cada 12 meses, compruebe la fecha de la última antes de pedir la siguiente.' },
      { q: '¿Medigap paga una mamografía diagnóstica?', a: `Sí, la parte que Medicare Original le deja a usted. El plan G paga el 20 % una vez pagado el deducible, así que una mamografía diagnóstica le cuesta ${h.m(h.E('mammogram-diagnostic', { coverage: 'medigap', medigap: 'G' }).youPay)}; los planes C y F pagan además el deducible de la Parte B, pero solo pueden comprarlos quienes tuvieron derecho a Medicare antes del 1 de enero de 2020. La mamografía de detección no necesita Medigap: ya cuesta 0 $.` },
    ],
    body: (h) => {
      const s = h.E('mammogram-screening'); const dm = h.E('mammogram-diagnostic'); const dd = h.E('mammogram-diagnostic', { deductibleRemaining: h.PB.deductible });
      const man = h.E('mammogram-diagnostic', { locality: h.loc(/^Manhattan$/) }); const al = h.E('mammogram-diagnostic', { locality: h.defaultLocality('AL') });
      return `
<h2>Tres mamografías, tres reglas</h2>
${h.table(['Tipo', 'Quién', 'Cada cuánto', 'Usted paga'], [
  ['De referencia', 'Mujeres de 35 a 39 años', 'Una vez en la vida', '0 $ con asignación'],
  ['De detección', 'Mujeres de 40 años o más', 'Una vez cada 12 meses', `${h.m(s.youPay)} con asignación`],
  ['Diagnóstica', 'Cuando es médicamente necesaria', 'Las veces necesarias', `20 % tras el deducible: de ${h.m(dm.youPay)} a ${h.m(dd.youPay)}`],
], 'Reglas de medicare.gov; montos de la diagnóstica a tarifas nacionales de octubre de 2026, con y sin el deducible pagado.', ['l', 'l', 'l', 'r'])}
<p>La diferencia entre detección y diagnóstico no es el aparato sino el motivo. La mamografía de detección revisa a una mujer sin síntomas. La diagnóstica estudia anomalías, como síntomas o signos de cáncer de mama. La misma cita puede pasar de una a otra si el radiólogo decide que hacen falta más imágenes, y la factura cambia con ella.</p>
<h2>Lo que le cuesta una mamografía diagnóstica</h2>
<p>El monto aprobado sale del baremo de médicos, con una parte para el radiólogo que lee las imágenes y una parte técnica para el equipo y el personal. Varía según su zona de precios: ${h.m(man.approvedTotal)} en Manhattan y ${h.m(al.approvedTotal)} en Alabama, frente a ${h.m(dm.approvedTotal)} a nivel nacional. Su 20 % lo sigue.</p>
<!--tool:mini:mammo-->
<h2>Tres años, tres facturas</h2>
<p>Un año con solo la detección anual no le cuesta nada, y Medicare paga al proveedor ${h.m(s.approvedTotal)}. Un año en que la detección de marzo termina con una nueva cita para imágenes diagnósticas, con el deducible aún pendiente, le cuesta ${h.m(dd.youPay)} por esas imágenes, porque todo el monto aprobado va al deducible. La misma cita en octubre, cuando otra atención ya agotó el deducible, le cuesta ${h.m(dm.youPay)}. Con el plan Medigap G, la factura de octubre baja a ${h.m(h.E('mammogram-diagnostic', { coverage: 'medigap', medigap: 'G' }).youPay)} y la de marzo se queda en la parte del deducible. El orden de sus facturas en el año cuenta tanto como la prueba misma.</p>
<h2>El seguimiento tras un resultado anormal</h2>
<p>Después de una detección que necesita una segunda mirada, su médico u otro proveedor puede pedir una mamografía diagnóstica y una ecografía mamaria para revisar zonas concretas. Medicare cubre la ecografía mamaria solo cuando es médicamente necesaria y la pide su proveedor. Cada servicio de seguimiento se factura a la Parte B con el deducible y el 20 %; una ${h.a('mri', 'resonancia magnética')} posterior sigue las mismas reglas, con un monto mayor en un hospital ambulatorio que en un centro de imágenes.</p>
<h2>Medigap y Medicare Advantage</h2>
<p>En la detección, Medigap no cambia nada porque no hay nada que pagar. En las imágenes diagnósticas, los planes A, B, C, D, F, G, M y N pagan todo el 20 %, el plan K la mitad y el L tres cuartas partes. Un plan Medicare Advantage debe cubrir las mismas mamografías que Medicare Original y fija su propio costo compartido para las diagnósticas; su Resumen de beneficios da el copago.</p>
<h2>Antes de la cita</h2>
<p>Compruebe tres cosas. Que han pasado 12 meses desde su última mamografía de detección. Que el centro y el radiólogo aceptan la asignación, para que la detección siga a 0 $. Y, si la vuelven a llamar, si las nuevas imágenes se facturarán como diagnósticas. Las reglas salen de la ${h.cov('mammogram-screening', 'página de medicare.gov sobre las mamografías')}.</p>`;
    },
  },
});
