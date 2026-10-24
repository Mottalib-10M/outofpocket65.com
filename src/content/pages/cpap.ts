import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'cpap', group: 'cover', order: 11,
  tool: { kind: 'est', props: { act: 'cpap', state: 'FL', count: 13 } },
  mini: { kind: 'mini:rental' },
  related: ['wheelchairs', 'home-health', 'part-b', 'deductible', 'home'],
  sources: ['dmepos', 'cfr414_229', 'assignment', 'medigap'],
  acts: ['cpap'],
  en: {
    slug: 'does-medicare-cover-cpap', nav: 'CPAP machine', card: 'The 12-week trial, 13 months of rental until you own it, and the masks and tubing.',
    title: 'CPAP Machines and Medicare 2026: Rental, Trial and Supplies',
    description: 'Part B covers a CPAP for obstructive sleep apnea: a 12-week trial, then 13 months of rental until you own it. See the 2026 fees by state and your 20 %.',
    h1: 'Does Medicare cover a CPAP machine?',
    intro: 'Yes, for diagnosed obstructive sleep apnea. Part B covers a 12-week trial, then keeps paying if your provider documents that the therapy helps. The machine is rented for 13 months and then belongs to you. The estimator prices the rental month by month with the 2026 fee schedule of your state.',
    resume: (h) => {
      const fl = h.E('cpap', { state: 'FL', count: 13 });
      const mo = fl.extra.monthlyFee as number;
      const mo4 = fl.extra.monthly4to13 as number;
      return `Medicare Part B covers CPAP therapy for obstructive sleep apnea as durable medical equipment. Coverage starts with a 12-week trial of the machine and its accessories once the diagnosis is made; after the trial, Medicare continues to pay if you meet your doctor or another provider in person and they record in your file that you meet the conditions and the therapy is helping. The machine is not bought outright: Medicare pays the supplier a rental for 13 continuous months, after which the machine is yours. You pay 20 % of each rental payment and of the supplies, such as masks and tubing, after the ${h.m(h.PB.deductible)} Part B deductible, provided the supplier accepts assignment. In Florida in 2026 the fee schedule allows ${h.m(mo)} a month for the first three months and ${h.m(mo4)} a month for months 4 to 13, so the full rental is approved ${h.m(fl.approvedTotal)} and your share comes to ${h.m(fl.youPay)} over 13 months, or about ${h.m(mo * h.PB.coinsurance)} a month at the start. A full face mask is allowed ${h.m(h.dmeFee('A7030', 'NU', 'FL'))} and a length of tubing ${h.m(h.dmeFee('A7037', 'NU', 'FL'))} in that state. A supplier that will not accept assignment for every rental month can make you pay upfront and wait for Medicare to reimburse you.`;
    },
    faqs: (h) => {
      const tr = h.E('cpap', { state: 'FL', count: 3 });
      const g = h.E('cpap', { state: 'FL', count: 13, coverage: 'medigap', medigap: 'G' });
      return [
        { q: 'What happens to Medicare coverage of a CPAP after the 12-week trial?', a: `It continues only if you meet your doctor or other provider in person and they document in your medical record that you meet certain conditions and that the therapy is helping you. Continued payment of the rental depends on that visit and that note. In Florida the first three months of rental cost you ${h.m(tr.youPay)} in total with the deductible met.` },
        { q: 'Do I own my CPAP machine after Medicare pays for it?', a: 'Yes, once Medicare has made rental payments for 13 continuous months, the machine becomes yours. The months must be continuous: Medicare pays the supplier as long as you keep using the machine. Supplies such as masks and tubing are billed as related supplies, at 20 % of their approved amount after the deductible.' },
        { q: 'Will Medicare cover a CPAP I had before joining Medicare?', a: 'It may. Medicare says that if you had a CPAP machine before you got Medicare and you meet certain requirements, it may cover a rental or replacement machine, accessories, or both. The usual conditions then apply: a supplier enrolled in Medicare, 20 % of the approved amount after the Part B deductible, and the rental rules for a new machine.' },
        { q: 'How much does Medigap save on a CPAP rental?', a: `Plan G pays all of your 20 % on the rental and supplies once the Part B deductible is met, so the 13 months of rental in Florida drop to ${h.m(g.youPay)}. Plans K and L pay half and three quarters of the coinsurance. The deductible itself stays yours under the plans available to people who became eligible from 2020 on.` },
      ];
    },
    body: (h) => {
      const fl = h.E('cpap', { state: 'FL', count: 13 });
      const tx = h.E('cpap', { state: 'TX', count: 13 });
      const ny = h.E('cpap', { state: 'NY', count: 13 });
      const rural = h.E('cpap', { state: 'FL', count: 13, area: 'rural' });
      const firstYear = h.E('cpap', { state: 'FL', count: 13, deductibleRemaining: h.PB.deductible });
      const mo = fl.extra.monthlyFee as number;
      const mo4 = fl.extra.monthly4to13 as number;
      return `
<h2>From diagnosis to the trial period</h2>
<p>Medicare pays for CPAP therapy, an in-home treatment for sleep apnea, once you have been diagnosed with obstructive sleep apnea. The first stage is a 12-week trial that covers the device and its accessories. What happens next depends on a follow-up: you meet your doctor or other health care provider in person, and they document in your medical record that you meet certain conditions and that the therapy is helping. With that record, coverage continues; without it, the trial is where coverage ends.</p>
<p>As with all durable medical equipment, the machine must be prescribed for use in your home and come from a supplier enrolled in Medicare. It is worth confirming both your doctor and the supplier are enrolled and will accept claims before the machine is delivered.</p>
<h2>Thirteen rental months, then the machine is yours</h2>
<p>Medicare does not buy the CPAP at the start. It pays the supplier a monthly rental for 13 months, as long as you use the machine continuously, and after the 13th continuous payment you own it. Under the federal rule for capped rental items, months 4 to 13 are paid at ${h.pc(h.P.dmeRental.months4to13FactorStandard)} of the fee of the first three months, which is why the monthly amount drops after the third month.</p>
${h.table(['Florida, 2026', 'Approved', 'Your 20 %'], [
  ['Months 1 to 3, each', h.m(mo), h.m(mo * h.PB.coinsurance)],
  ['Months 4 to 13, each', h.m(mo4), h.m(mo4 * h.PB.coinsurance)],
  ['All 13 months, deductible already met', h.m(fl.approvedTotal), h.m(fl.youPay)],
  ['All 13 months, deductible paid on the first months', h.m(firstYear.approvedTotal), h.m(firstYear.youPay)],
], 'Continuous airway pressure device, HCPCS E0601 rental, DMEPOS fee schedule October 2026, non-rural rate, supplier accepting assignment.', ['l', 'r', 'r'])}
<p>The fourth line shows the effect of the deductible when the CPAP is the first Part B item of your year: the early rental months are paid by you in full until the ${h.m(h.PB.deductible)} is used up. If the 13 months straddle two calendar years, the new year's deductible applies again from January.</p>
<h2>Masks, tubing and other supplies</h2>
<p>Part B also covers the supplies that go with the machine, such as masks and tubing, at the same 20 % after the deductible. The fee schedule lists each one separately. In Florida a full face mask, HCPCS A7030, is allowed ${h.m(h.dmeFee('A7030', 'NU', 'FL'))}, so your share is about ${h.m(h.dmeFee('A7030', 'NU', 'FL') * h.PB.coinsurance)}, and a length of tubing, A7037, is allowed ${h.m(h.dmeFee('A7037', 'NU', 'FL'))}.</p>
<h2>What changes from one state to another</h2>
<p>The DMEPOS fee schedule is set by state, with separate rates for rural areas. The 13-month rental leaves you ${h.m(tx.youPay)} in Texas and ${h.m(ny.youPay)} in New York, against ${h.m(fl.youPay)} in Florida, all at non-rural rates with the deductible met. In a rural part of Florida the rate is higher and your share reaches ${h.m(rural.youPay)}. The mini tool lets you pick your state.</p>
<!--tool:mini:medigap-->
<h2>Assignment matters more for rentals</h2>
<p>A supplier that participates in Medicare must accept assignment, which means it can charge you only the deductible and the 20 % on the approved amount. A non-participating supplier does not have to accept assignment, and may charge you more. For rented equipment the risk is specific: if the supplier is not willing to accept assignment for all 13 rental months, you may have to pay the full cost upfront, and Medicare pays you back later for its share once the claims are processed. Ask the question before the first delivery, and get the answer for the whole rental period, not just the first month.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-cpap', nav: 'Máquina CPAP', card: 'La prueba de 12 semanas, 13 meses de alquiler hasta que es suya, y las mascarillas y tubos.',
    title: 'Máquinas CPAP y Medicare 2026: alquiler, prueba e insumos',
    description: 'La Parte B cubre la CPAP para la apnea obstructiva del sueño: 12 semanas de prueba y 13 meses de alquiler hasta que es suya. Vea tarifas 2026 y su 20 %.',
    h1: '¿Medicare cubre la máquina CPAP?',
    intro: 'Sí, si tiene un diagnóstico de apnea obstructiva del sueño. La Parte B cubre una prueba de 12 semanas y sigue pagando si su proveedor documenta que la terapia le ayuda. La máquina se alquila durante 13 meses y luego es suya. La calculadora pone precio al alquiler mes a mes con el baremo de 2026 de su estado.',
    resume: (h) => {
      const fl = h.E('cpap', { state: 'FL', count: 13 });
      const mo = fl.extra.monthlyFee as number;
      const mo4 = fl.extra.monthly4to13 as number;
      return `La Parte B de Medicare cubre la terapia CPAP para la apnea obstructiva del sueño como equipo médico duradero. La cobertura empieza con una prueba de 12 semanas de la máquina y sus accesorios una vez hecho el diagnóstico; después de la prueba, Medicare sigue pagando si usted se reúne en persona con su médico u otro proveedor y este anota en su expediente que cumple las condiciones y que la terapia le ayuda. La máquina no se compra de entrada: Medicare paga al proveedor un alquiler durante 13 meses seguidos, y después la máquina es suya. Usted paga el 20 % de cada pago de alquiler y de los insumos, como mascarillas y tubos, tras el deducible de la Parte B de ${h.m(h.PB.deductible)}, siempre que el proveedor acepte la asignación. En Florida en 2026 el baremo permite ${h.m(mo)} al mes durante los tres primeros meses y ${h.m(mo4)} al mes de los meses 4 a 13, así que el alquiler completo tiene un monto aprobado de ${h.m(fl.approvedTotal)} y su parte suma ${h.m(fl.youPay)} en 13 meses, unos ${h.m(mo * h.PB.coinsurance)} al mes al principio. Una mascarilla facial completa tiene una tarifa de ${h.m(h.dmeFee('A7030', 'NU', 'FL'))} y un tubo de ${h.m(h.dmeFee('A7037', 'NU', 'FL'))} en ese estado. Un proveedor que no acepte la asignación todos los meses del alquiler puede hacerle pagar por adelantado y esperar a que Medicare le reembolse.`;
    },
    faqs: (h) => {
      const tr = h.E('cpap', { state: 'FL', count: 3 });
      const g = h.E('cpap', { state: 'FL', count: 13, coverage: 'medigap', medigap: 'G' });
      return [
        { q: '¿Qué pasa con la cobertura de la CPAP después de la prueba de 12 semanas?', a: `Continúa solo si usted se reúne en persona con su médico u otro proveedor y este documenta en su expediente que cumple ciertas condiciones y que la terapia le está ayudando. El pago del alquiler después de la prueba depende de esa visita y esa nota. En Florida, los tres primeros meses de alquiler le cuestan ${h.m(tr.youPay)} en total con el deducible pagado.` },
        { q: '¿La máquina CPAP es mía después de que Medicare la paga?', a: 'Sí. Cuando Medicare ha hecho pagos de alquiler durante 13 meses seguidos, la máquina pasa a ser suya. Los meses deben ser continuos: Medicare paga al proveedor mientras usted siga usando la máquina. Los insumos, como mascarillas y tubos, se facturan como suministros relacionados, al 20 % de su monto aprobado tras el deducible.' },
        { q: '¿Medicare cubre una CPAP que ya tenía antes de entrar en Medicare?', a: 'Puede cubrirla. Medicare indica que si usted tenía una máquina CPAP antes de tener Medicare y cumple ciertos requisitos, puede cubrir el alquiler o el reemplazo de la máquina, los accesorios, o ambos. Se aplican entonces las condiciones de siempre: un proveedor inscrito en Medicare, el 20 % del monto aprobado tras el deducible de la Parte B y las reglas de alquiler de una máquina nueva.' },
        { q: '¿Cuánto ahorra Medigap en el alquiler de una CPAP?', a: `El Plan G paga todo su 20 % del alquiler y de los insumos una vez pagado el deducible de la Parte B, así que los 13 meses de alquiler en Florida bajan a ${h.m(g.youPay)}. Los planes K y L pagan la mitad y tres cuartas partes del coseguro. El deducible sigue a su cargo con los planes disponibles para quienes son elegibles desde 2020.` },
      ];
    },
    body: (h) => {
      const fl = h.E('cpap', { state: 'FL', count: 13 });
      const tx = h.E('cpap', { state: 'TX', count: 13 });
      const ny = h.E('cpap', { state: 'NY', count: 13 });
      const rural = h.E('cpap', { state: 'FL', count: 13, area: 'rural' });
      const firstYear = h.E('cpap', { state: 'FL', count: 13, deductibleRemaining: h.PB.deductible });
      const mo = fl.extra.monthlyFee as number;
      const mo4 = fl.extra.monthly4to13 as number;
      return `
<h2>Del diagnóstico al período de prueba</h2>
<p>Medicare paga la terapia CPAP, un tratamiento en casa para la apnea del sueño, una vez que le han diagnosticado apnea obstructiva del sueño. La primera etapa es una prueba de 12 semanas que cubre el aparato y sus accesorios. Lo que sigue depende de un control: usted se reúne en persona con su médico u otro proveedor, y este documenta en su expediente que cumple ciertas condiciones y que la terapia le ayuda. Con esa constancia, la cobertura continúa; sin ella, la cobertura termina con la prueba.</p>
<p>Como todo equipo médico duradero, la máquina debe estar recetada para usar en casa y venir de un proveedor inscrito en Medicare. Conviene confirmar que su médico y el proveedor están inscritos y aceptarán las reclamaciones antes de que le entreguen la máquina.</p>
<h2>Trece meses de alquiler y luego la máquina es suya</h2>
<p>Medicare no compra la CPAP al principio. Paga al proveedor un alquiler mensual durante 13 meses, siempre que usted use la máquina sin interrupción, y tras el pago número 13 seguido la máquina es suya. Según la regla federal de los artículos de alquiler con tope, los meses 4 a 13 se pagan al ${h.pc(h.P.dmeRental.months4to13FactorStandard)} de la tarifa de los tres primeros meses, por eso el monto mensual baja a partir del cuarto mes.</p>
${h.table(['Florida, 2026', 'Aprobado', 'Su 20 %'], [
  ['Meses 1 a 3, cada uno', h.m(mo), h.m(mo * h.PB.coinsurance)],
  ['Meses 4 a 13, cada uno', h.m(mo4), h.m(mo4 * h.PB.coinsurance)],
  ['Los 13 meses, deducible ya pagado', h.m(fl.approvedTotal), h.m(fl.youPay)],
  ['Los 13 meses, deducible pagado con los primeros meses', h.m(firstYear.approvedTotal), h.m(firstYear.youPay)],
], 'Aparato de presión positiva continua, alquiler HCPCS E0601, baremo DMEPOS de octubre de 2026, tarifa no rural, proveedor que acepta la asignación.', ['l', 'r', 'r'])}
<p>La cuarta línea muestra el efecto del deducible cuando la CPAP es el primer artículo de la Parte B del año: los primeros meses de alquiler los paga usted completos hasta agotar los ${h.m(h.PB.deductible)}. Si los 13 meses abarcan dos años calendario, el deducible del año nuevo se aplica otra vez desde enero.</p>
<h2>Mascarillas, tubos y otros insumos</h2>
<p>La Parte B cubre también los insumos de la máquina, como las mascarillas y los tubos, con el mismo 20 % tras el deducible. El baremo los tarifica uno por uno. En Florida, una mascarilla facial completa, HCPCS A7030, tiene una tarifa de ${h.m(h.dmeFee('A7030', 'NU', 'FL'))}, así que su parte ronda ${h.m(h.dmeFee('A7030', 'NU', 'FL') * h.PB.coinsurance)}, y un tubo, A7037, de ${h.m(h.dmeFee('A7037', 'NU', 'FL'))}.</p>
<h2>Lo que cambia de un estado a otro</h2>
<p>El baremo DMEPOS se fija por estado, con tarifas distintas para las zonas rurales. Los 13 meses de alquiler le cuestan ${h.m(tx.youPay)} en Texas y ${h.m(ny.youPay)} en Nueva York, frente a ${h.m(fl.youPay)} en Florida, siempre con tarifas no rurales y el deducible pagado. En una zona rural de Florida la tarifa es más alta y su parte llega a ${h.m(rural.youPay)}. La minicalculadora le deja elegir su estado.</p>
<!--tool:mini:medigap-->
<h2>La asignación pesa más en un alquiler</h2>
<p>Un proveedor que participa en Medicare debe aceptar la asignación, es decir, solo puede cobrarle el deducible y el 20 % del monto aprobado. Un proveedor no participante no está obligado a aceptarla y puede cobrarle más. En el equipo alquilado el riesgo es concreto: si el proveedor no está dispuesto a aceptar la asignación durante los 13 meses de alquiler, quizá tenga que pagar el costo completo por adelantado, y Medicare le devuelve su parte después, cuando procese las reclamaciones. Haga la pregunta antes de la primera entrega y pida la respuesta para todo el período de alquiler, no solo para el primer mes.</p>`;
    },
  },
});
