import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'mri', group: 'cover', order: 14,
  tool: { kind: 'est', props: { act: 'mri-lumbar', acts: ['mri-lumbar', 'mri-brain', 'mri-knee'], setting: 'office' } },
  mini: { kind: 'mini:mriPlace' },
  related: ['knee', 'chiropractic', 'pt', 'part-b', 'deductible', 'home'],
  sources: ['pfs', 'opps', 'clm104c04', 'assignment', 'medigap'],
  acts: ['mri-lumbar', 'mri-brain', 'mri-knee'],
  en: {
    slug: 'does-medicare-cover-mri', nav: 'MRI scan', card: 'Imaging center or hospital, accreditation, and your 20 % for a brain, lower back or knee MRI.',
    title: 'MRI Scans and Medicare 2026: Imaging Center or Hospital',
    description: 'Part B covers an MRI your provider orders to diagnose a problem. See the 2026 price of a brain, back or knee MRI at an imaging center or hospital and your 20 %.',
    h1: 'Does Medicare cover an MRI?',
    intro: 'Yes. Part B covers an MRI when your doctor or another provider orders it to find or treat a medical problem. Where the scan is done changes your bill more than anything else, so the estimator prices it both at an imaging center and in a hospital outpatient department.',
    resume: (h) => {
      const o = h.E('mri-lumbar', { setting: 'office' });
      const hp = h.E('mri-lumbar', { setting: 'hopd' });
      const b = h.E('mri-brain', { setting: 'office' });
      const first = h.E('mri-lumbar', { setting: 'office', deductibleRemaining: h.PB.deductible });
      return `Medicare Part B covers diagnostic tests such as MRI scans when a doctor or other health care provider orders them to find or treat a medical problem. In a doctor's office or an independent diagnostic testing facility, you pay 20 % of the Medicare-approved amount after the ${h.m(h.PB.deductible)} Part B deductible, and the facility must be accredited for advanced imaging, or Medicare will not pay. At national 2026 rates an MRI of the lower back without contrast is approved ${h.m(o.approvedTotal)} at such a center, so your share is ${h.m(o.youPay)} once the deductible is met; a brain MRI comes to ${h.m(b.youPay)}. If the scan is your first Part B bill of the year, the deductible takes the whole amount and the lower back MRI costs you ${h.m(first.youPay)}. In a hospital outpatient department the bill splits in two, the radiologist's reading and the hospital's fee, and you pay the hospital a copayment that can be more than 20 % but in most cases not more than the Part A deductible. The same lower back MRI there is approved ${h.m(hp.approvedTotal)} and leaves you ${h.m(hp.youPay)}. If an imaging center is not accredited and Medicare refuses the claim for that reason, the provider cannot bill you for the test.`;
    },
    faqs: (h) => {
      const o = h.E('mri-brain', { setting: 'office' });
      const np = h.E('mri-brain', { setting: 'office', assignment: false });
      const n = h.E('mri-knee', { setting: 'hopd', coverage: 'medigap', medigap: 'N' });
      return [
        { q: 'Why is an MRI cheaper at an imaging center than at a hospital?', a: 'Because the hospital adds a facility fee. At an office or an independent imaging facility, one global fee covers the scan and the reading, and you pay 20 % of it. In a hospital outpatient department, the radiologist bills for the reading and the hospital bills its own outpatient rate, with a copayment for you on top of the 20 % of the reading. The mini tool shows the gap for three common scans.' },
        { q: 'What happens if the imaging center is not accredited?', a: 'For advanced imaging such as MRI, CT, nuclear medicine or PET done outside a hospital, Medicare pays only if the provider is accredited. If Medicare refuses to pay because the provider is not accredited, the provider cannot bill you for the test. Asking about accreditation before the appointment avoids both a delay and a dispute.' },
        { q: 'Can an imaging center charge more than the Medicare-approved amount for an MRI?', a: `Only if it does not accept assignment. A center that accepts it takes the approved amount as full payment. One that does not may charge up to 15 % above the amount allowed for non-participating providers: for a brain MRI at national rates, your bill would rise from ${h.m(o.youPay)} to ${h.m(np.youPay)} with the deductible met.` },
        { q: 'Does Medigap cover the hospital copayment for an MRI?', a: `Yes. The hospital outpatient copayment is Part B cost sharing, which Medigap pays like the 20 % coinsurance. With Plan G or Plan N and the deductible met, a knee MRI in a hospital outpatient department costs you ${h.m(n.youPay)}. Plan K pays half of it and Plan L three quarters. The Part B deductible stays yours with these plans.` },
      ];
    },
    body: (h) => {
      const acts = [['mri-brain', 'Brain, without contrast'], ['mri-lumbar', 'Lower back, without contrast'], ['mri-knee', 'Knee, without contrast']] as const;
      const rows = acts.map(([a, l]) => { const o = h.E(a, { setting: 'office' }); const hp = h.E(a, { setting: 'hopd' }); return [l, h.m(o.approvedTotal), h.m(o.youPay), h.m(hp.approvedTotal), h.m(hp.youPay)]; });
      const hp = h.E('mri-lumbar', { setting: 'hopd' });
      const hpFirst = h.E('mri-lumbar', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const man = h.E('mri-lumbar', { setting: 'office', locality: h.loc(/^Manhattan$/) });
      const al = h.E('mri-lumbar', { setting: 'office', locality: h.defaultLocality('AL') });
      const o = h.E('mri-lumbar', { setting: 'office' });
      return `
<h2>When Medicare pays for the scan</h2>
<p>Medicare groups MRI with the other diagnostic tests that are not lab work, such as CT scans, X-rays, EKGs and PET scans. Part B covers them when your provider orders them to find or treat a medical problem, in other words to rule an illness in or out. An MRI requested without such an order, as a general check, does not meet that condition.</p>
<h2>Prices for three common scans</h2>
<p>The table gives the national 2026 approved amounts for scans without contrast. At an office or imaging center, a single global fee covers the images and the radiologist's reading. In a hospital outpatient department, the reading is billed by the radiologist and the hospital charges its own rate for the scan.</p>
${h.table(['MRI, national rates', 'Imaging center: approved', 'You pay', 'Hospital outpatient: approved', 'You pay'], rows, 'Physician fee schedule (global fee, or professional component in a hospital) and OPPS Addendum B of October 2026; Part B deductible already met, provider accepting assignment.', ['l', 'r', 'r', 'r', 'r'])}
<p>The hospital share includes a copayment set for the imaging service. Medicare notes that this copayment may be more than 20 % of the approved amount, and that in most cases it cannot exceed the Part A hospital deductible, ${h.m(h.PA.inpatientDeductible)} in 2026. For an MRI the copayment stays far below that ceiling, but it is still larger than what you pay at an imaging center.</p>
<h2>The deductible and the timing of the scan</h2>
<p>When the MRI is your first Part B service of the year, the ${h.m(h.PB.deductible)} deductible is paid first. A lower back MRI at an imaging center is approved for less than the deductible, so you pay its full ${h.m(h.E('mri-lumbar', { setting: 'office', deductibleRemaining: h.PB.deductible }).youPay)}. In a hospital the deductible is used up and the copayment applies on the rest: ${h.m(hpFirst.youPay)} for the same scan, against ${h.m(hp.youPay)} later in the year.</p>
<h2>Accreditation outside the hospital</h2>
<p>For advanced imaging, meaning CT, MRI, nuclear medicine and PET, done outside a hospital, whether by a provider, a medical practice, a clinic or a free-standing radiology center, Medicare pays only if the provider is accredited. Check before the appointment. If Medicare refuses to pay for your test because the provider is not accredited, the provider cannot bill you for it.</p>
<!--tool:mini:twenty-->
<h2>Local prices and other coverage</h2>
<p>The office fee follows the local cost index of the physician fee schedule. A lower back MRI at an imaging center leaves you ${h.m(man.youPay)} in Manhattan and ${h.m(al.youPay)} in Alabama, against ${h.m(o.youPay)} at national rates, with the deductible met. Choose your state and price area in the estimator for your own figure.</p>
<p>Medigap Plan G pays the 20 % and the hospital copayment once the deductible is met, which leaves nothing for a scan later in the year. A Medicare Advantage plan sets its own imaging copay; enter your plan's figures in the estimator. Hospitals now publish their standard charges, including those negotiated with Advantage plans, on a public website, which can help when you compare places.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-resonancia-magnetica', nav: 'Resonancia magnética', card: 'Centro de imágenes u hospital, acreditación y su 20 % por una resonancia de cerebro, espalda o rodilla.',
    title: 'Resonancia magnética y Medicare 2026: centro u hospital',
    description: 'La Parte B cubre la resonancia que su proveedor indica para un diagnóstico. Vea el precio 2026 de cerebro, espalda o rodilla en centro u hospital y su 20 %.',
    h1: '¿Medicare cubre la resonancia magnética?',
    intro: 'Sí. La Parte B cubre la resonancia magnética cuando su médico u otro proveedor la indica para encontrar o tratar un problema médico. El lugar donde se hace cambia la factura más que cualquier otra cosa, así que la calculadora la calcula en un centro de imágenes y en el departamento ambulatorio de un hospital.',
    resume: (h) => {
      const o = h.E('mri-lumbar', { setting: 'office' });
      const hp = h.E('mri-lumbar', { setting: 'hopd' });
      const b = h.E('mri-brain', { setting: 'office' });
      const first = h.E('mri-lumbar', { setting: 'office', deductibleRemaining: h.PB.deductible });
      return `La Parte B de Medicare cubre las pruebas diagnósticas como la resonancia magnética cuando un médico u otro proveedor la indica para encontrar o tratar un problema médico. En un consultorio o en un centro independiente de pruebas diagnósticas, usted paga el 20 % del monto aprobado por Medicare después del deducible de la Parte B de ${h.m(h.PB.deductible)}, y el centro debe estar acreditado para imágenes avanzadas, o Medicare no paga. Con las tarifas nacionales de 2026, una resonancia de la zona lumbar sin contraste tiene un monto aprobado de ${h.m(o.approvedTotal)} en un centro así, de modo que su parte es de ${h.m(o.youPay)} con el deducible pagado; una del cerebro le cuesta ${h.m(b.youPay)}. Si la prueba es su primera factura de la Parte B del año, el deducible absorbe todo el monto y la resonancia lumbar le cuesta ${h.m(first.youPay)}. En el departamento ambulatorio de un hospital la factura se divide en dos, la lectura del radiólogo y la tarifa del hospital, y usted paga al hospital un copago que puede superar el 20 %, aunque en la mayoría de los casos no el deducible de la Parte A. La misma resonancia lumbar allí tiene un monto aprobado de ${h.m(hp.approvedTotal)} y le deja ${h.m(hp.youPay)}. Si un centro no está acreditado y Medicare rechaza la reclamación por ese motivo, el proveedor no puede cobrarle la prueba.`;
    },
    faqs: (h) => {
      const o = h.E('mri-brain', { setting: 'office' });
      const np = h.E('mri-brain', { setting: 'office', assignment: false });
      const n = h.E('mri-knee', { setting: 'hopd', coverage: 'medigap', medigap: 'N' });
      return [
        { q: '¿Por qué la resonancia cuesta menos en un centro de imágenes que en un hospital?', a: 'Porque el hospital añade su propia tarifa. En un consultorio o un centro independiente, una sola tarifa global cubre la prueba y la lectura, y usted paga el 20 %. En el departamento ambulatorio de un hospital, el radiólogo factura la lectura y el hospital su tarifa ambulatoria, con un copago para usted además del 20 % de la lectura. La minicalculadora muestra la diferencia en tres pruebas frecuentes.' },
        { q: '¿Qué pasa si el centro de imágenes no está acreditado?', a: 'En las imágenes avanzadas, como la resonancia, la tomografía, la medicina nuclear o el PET hechas fuera de un hospital, Medicare solo paga si el proveedor está acreditado. Si Medicare se niega a pagar porque el proveedor no lo está, el proveedor no puede cobrarle la prueba. Preguntar por la acreditación antes de la cita evita una demora y una disputa.' },
        { q: '¿Un centro de imágenes puede cobrar más que el monto aprobado por una resonancia?', a: `Solo si no acepta la asignación. Un centro que la acepta toma el monto aprobado como pago total. Uno que no la acepta puede cobrar hasta un 15 % por encima del monto permitido a los proveedores no participantes: por una resonancia del cerebro a tarifa nacional, su factura pasaría de ${h.m(o.youPay)} a ${h.m(np.youPay)} con el deducible pagado.` },
        { q: '¿Medigap cubre el copago del hospital por una resonancia?', a: `Sí. El copago ambulatorio del hospital es costo compartido de la Parte B, que Medigap paga igual que el coseguro del 20 %. Con el Plan G o el Plan N y el deducible pagado, una resonancia de rodilla en el departamento ambulatorio de un hospital le cuesta ${h.m(n.youPay)}. El Plan K paga la mitad y el Plan L tres cuartas partes. El deducible de la Parte B sigue a su cargo con estos planes.` },
      ];
    },
    body: (h) => {
      const acts = [['mri-brain', 'Cerebro, sin contraste'], ['mri-lumbar', 'Zona lumbar, sin contraste'], ['mri-knee', 'Rodilla, sin contraste']] as const;
      const rows = acts.map(([a, l]) => { const o = h.E(a, { setting: 'office' }); const hp = h.E(a, { setting: 'hopd' }); return [l, h.m(o.approvedTotal), h.m(o.youPay), h.m(hp.approvedTotal), h.m(hp.youPay)]; });
      const hp = h.E('mri-lumbar', { setting: 'hopd' });
      const hpFirst = h.E('mri-lumbar', { setting: 'hopd', deductibleRemaining: h.PB.deductible });
      const man = h.E('mri-lumbar', { setting: 'office', locality: h.loc(/^Manhattan$/) });
      const al = h.E('mri-lumbar', { setting: 'office', locality: h.defaultLocality('AL') });
      const o = h.E('mri-lumbar', { setting: 'office' });
      return `
<h2>Cuándo paga Medicare la resonancia</h2>
<p>Medicare agrupa la resonancia magnética con las demás pruebas diagnósticas que no son de laboratorio, como la tomografía, las radiografías, los electrocardiogramas y el PET. La Parte B las cubre cuando su proveedor las indica para encontrar o tratar un problema médico, es decir, para confirmar o descartar una enfermedad. Una resonancia pedida sin esa indicación, como chequeo general, no cumple esa condición.</p>
<h2>Precios de tres pruebas frecuentes</h2>
<p>La tabla da los montos aprobados nacionales de 2026 para pruebas sin contraste. En un consultorio o centro de imágenes, una sola tarifa global cubre las imágenes y la lectura del radiólogo. En el departamento ambulatorio de un hospital, el radiólogo factura la lectura y el hospital cobra su propia tarifa por la prueba.</p>
${h.table(['Resonancia, tarifas nacionales', 'Centro de imágenes: aprobado', 'Usted paga', 'Hospital ambulatorio: aprobado', 'Usted paga'], rows, 'Baremo de médicos (tarifa global, o componente profesional en el hospital) y Anexo B de OPPS de octubre de 2026; deducible de la Parte B ya pagado, proveedor que acepta la asignación.', ['l', 'r', 'r', 'r', 'r'])}
<p>La parte del hospital incluye un copago fijado para la prueba de imagen. Medicare indica que ese copago puede ser mayor que el 20 % del monto aprobado y que, en la mayoría de los casos, no puede superar el deducible de hospitalización de la Parte A, ${h.m(h.PA.inpatientDeductible)} en 2026. En una resonancia el copago queda muy por debajo de ese techo, pero sigue siendo mayor que lo que paga en un centro de imágenes.</p>
<h2>El deducible y el momento de la prueba</h2>
<p>Cuando la resonancia es su primer servicio de la Parte B del año, se paga primero el deducible de ${h.m(h.PB.deductible)}. Una resonancia lumbar en un centro de imágenes tiene un monto aprobado menor que el deducible, así que usted paga los ${h.m(h.E('mri-lumbar', { setting: 'office', deductibleRemaining: h.PB.deductible }).youPay)} completos. En un hospital el deducible se agota y el copago se aplica al resto: ${h.m(hpFirst.youPay)} por la misma prueba, frente a ${h.m(hp.youPay)} más adelante en el año.</p>
<h2>La acreditación fuera del hospital</h2>
<p>En las imágenes avanzadas, es decir, tomografía, resonancia, medicina nuclear y PET, hechas fuera de un hospital, ya sea por un proveedor, una consulta médica, una clínica o un centro de radiología independiente, Medicare solo paga si el proveedor está acreditado. Compruébelo antes de la cita. Si Medicare se niega a pagar su prueba porque el proveedor no está acreditado, el proveedor no puede cobrársela.</p>
<!--tool:mini:twenty-->
<h2>Precios locales y otra cobertura</h2>
<p>La tarifa de consultorio sigue el índice de costos locales del baremo de médicos. Una resonancia lumbar en un centro de imágenes le cuesta ${h.m(man.youPay)} en Manhattan y ${h.m(al.youPay)} en Alabama, frente a ${h.m(o.youPay)} a tarifa nacional, con el deducible pagado. Elija su estado y su zona en la calculadora para ver su propia cifra.</p>
<p>El Plan G de Medigap paga el 20 % y el copago del hospital una vez pagado el deducible, lo que no deja nada por una prueba más adelante en el año. Un plan Medicare Advantage fija su propio copago por imágenes; escriba las cifras de su plan en la calculadora. Los hospitales publican ahora sus cargos estándar, incluidos los negociados con los planes Advantage, en un sitio web público, lo que ayuda a comparar lugares.</p>`;
    },
  },
});
