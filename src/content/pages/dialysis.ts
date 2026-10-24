import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'dialysis', group: 'cover', order: 21,
  tool: { kind: 'est', props: { act: 'dialysis', count: 13, acts: ['dialysis', 'ambulance-nonemergency', 'office-visit', 'hospital-stay'] } },
  mini: { kind: 'mini:dialysisMonth' },
  related: ['ambulance', 'dental', 'part-b', 'what-covers', 'home'],
  sources: ['esrd', 'cms_fs2026', 'afs'],
  acts: ['dialysis', 'ambulance-nonemergency'],
  en: {
    slug: 'does-medicare-cover-dialysis', nav: 'Dialysis', card: 'Outpatient and home dialysis for kidney failure: the base rate per treatment and your 20 % a month.',
    title: 'Dialysis and Medicare 2026: Your 20 % per Session and Month',
    description: 'Medicare covers dialysis for end-stage renal disease under Parts A and B. The 2026 base rate per treatment, your 20 % a month, home dialysis and the exclusions.',
    h1: 'Does Medicare cover dialysis?',
    intro: 'Yes, for end-stage renal disease: Part B pays outpatient and home dialysis, Part A dialysis during a hospital stay. The estimator counts a month of treatments at the 2026 national base rate.',
    resume: (h) => {
      const one = h.E('dialysis', { count: 1 }); const mo = h.E('dialysis', { count: 13 }); const g = h.E('dialysis', { count: 13, coverage: 'medigap', medigap: 'G' });
      return `Medicare covers dialysis for people with end-stage renal disease (ESRD), permanent kidney failure that needs dialysis or a transplant. To get the full ESRD benefit with Original Medicare you need both parts: Part B pays outpatient treatments in a Medicare-certified dialysis facility or at home, home dialysis training, equipment and supplies, and the drugs used for dialysis; Part A pays dialysis while you are an inpatient. Medicare usually covers 3 hemodialysis treatments a week, or the equivalent peritoneal dialysis. CMS pays facilities a base rate of ${h.mx(h.P.esrd.basePerTreatment)} per treatment in 2026, before adjustments for each patient and facility, so your 20 % is about ${h.m(one.youPay)} a treatment once the Part B deductible is met. Thirteen treatments, roughly a month at three a week, come to ${h.m(mo.approvedTotal)} approved and ${h.m(mo.youPay)} for you, with no yearly cap. A Medigap Plan G brings that to ${h.m(g.youPay)}. You keep paying the monthly Part B premium, and the Part D premium if you have a drug plan.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare pay for home dialysis equipment?', a: 'Yes. Part B covers the home dialysis machine, the water treatment system, a basic recliner and supplies such as alcohol, wipes, sterile drapes, rubber gloves and scissors, plus training for you and the person helping you, given by a Medicare-certified home dialysis training facility. Home visits by trained facility workers to check your equipment and water supply are also covered.' },
      { q: 'Does Medicare cover an ambulance to dialysis?', a: `Only when traveling in any other vehicle could endanger your health, and only from home to the nearest dialysis facility and back. A scheduled non-emergency basic ambulance ride of 10 miles in the rest of Florida is approved at ${h.m(h.E('ambulance-nonemergency', { miles: 10 }).approvedTotal)} and leaves you ${h.m(h.E('ambulance-nonemergency', { miles: 10 }).youPay)} with the deductible met. Rides for convenience are not covered.` },
      { q: 'What does Medicare not cover for dialysis?', a: 'Paid dialysis aides to help you at home, pay you or a helper lose during home dialysis training, a place to stay during your treatment, and blood or packed red blood cells for home dialysis unless they are part of a doctor\'s service. Other insurance you have may pay some of those costs.' },
      { q: 'Is the kidney doctor billed separately?', a: `Yes. Outpatient doctors' services for ESRD are billed under Part B: after the ${h.m(h.PB.deductible)} deductible you pay 20 % of the approved amount. Medicare covers a face-to-face visit with your doctor or certain non-doctor providers once a month for home dialysis. During a hospital stay, the kidney doctor's monthly payment is based on the number of days you are in the hospital.` },
    ],
    body: (h) => {
      const per = h.P.esrd.basePerTreatment;
      const rows = [1, 4, 13, 156].map((n) => { const e = h.E('dialysis', { count: n }); const g = h.E('dialysis', { count: n, coverage: 'medigap', medigap: 'G' }); const k = h.E('dialysis', { count: n, coverage: 'medigap', medigap: 'K' }); return [String(n), h.m(e.approvedTotal), h.m(e.youPay), h.m(k.youPay), h.m(g.youPay)]; });
      const hosp = h.E('hospital-stay', { count: 4 });
      return `
<h2>Who qualifies and which part pays</h2>
<p>The dialysis benefit is for people with ESRD. Part B covers outpatient dialysis and doctors' services in a Medicare-certified facility or at home, including dialysis for acute kidney injury. Part A covers dialysis when you are admitted to a hospital: then the Part A deductible of ${h.m(h.PA.inpatientDeductible)} per benefit period applies, so a 4-day stay costs you ${h.m(hosp.youPay)}, whatever the number of treatments during it. Your dialysis facility must provide the covered items and services itself or through an arrangement with another provider.</p>
<h2>What 20 % means over a year</h2>
<p>Dialysis is one of the few Part B services you use several times a week for years, which makes the absence of a yearly cap on the 20 % weigh heavily. The table counts treatments at the national base rate of ${h.mx(per)}; your facility's rate is adjusted by CMS for its area and for each patient, so your own approved amount can differ.</p>
${h.table(['Treatments', 'Approved', 'Original Medicare only', 'Medigap K', 'Medigap G'], rows, 'Deductible already met, 2026 national base rate before patient and facility adjustments. 156 treatments: one year at three a week.', ['r', 'r', 'r', 'r', 'r'])}
<p>Medigap Plan K pays half of your 20 % until its yearly out-of-pocket limit of ${h.m(h.P.medigap.planKOutOfPocketLimit)} in 2026, after which it pays everything for the rest of the year; the table shows the half without the cap. Plans A, B, C, D, F, G, M and N pay the whole 20 % for these treatments. With a Medicare Advantage plan, the plan's own copay and yearly limit apply: read your plan materials.</p>
<!--tool:mini:dialysisMonth-->
<h2>Drugs used for dialysis</h2>
<p>Part B covers drugs for outpatient and home dialysis: heparin, the antidote for heparin when medically necessary, topical anesthetics and erythropoiesis-stimulating agents such as epoetin alfa or darbepoetin alfa to treat anemia related to ESRD. It also covers phosphate binders and other treatments that lower phosphorus in people with ESRD. Lab tests that are part of the dialysis services, heart monitoring and oxygen during treatment at a facility, and monitoring of your access site are covered too. Talk with your care team about any drug, including over-the-counter products.</p>
<h2>Dental care before a transplant or during dialysis</h2>
<p>Original Medicare does not cover most dental care, but dialysis for ESRD is one of the cases where it may pay for dental services closely related to the covered treatment. The ${h.a('dental', 'dental page')} explains the exceptions.</p>
<h2>Where the figures come from</h2>
<p>The base rate is the 2026 figure of the ${h.src('esrd', 'CMS final rule for the ESRD prospective payment system')}. The coverage rules come from the ${h.cov('dialysis', 'medicare.gov dialysis services page')}. The 2027 base rate and the 2027 Part B deductible are not published yet.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-dialisis', nav: 'Diálisis', card: 'Diálisis ambulatoria y en casa por insuficiencia renal: tarifa base por sesión y su 20 % al mes.',
    title: 'Diálisis y Medicare 2026: su 20 % por sesión y por mes',
    description: 'Medicare cubre la diálisis por enfermedad renal terminal con las Partes A y B. Tarifa base 2026 por sesión, su 20 % al mes, la diálisis en casa y lo excluido.',
    h1: '¿Medicare cubre la diálisis?',
    intro: 'Sí, para la enfermedad renal terminal: la Parte B paga la diálisis ambulatoria y en casa, la Parte A la diálisis durante una hospitalización. La calculadora cuenta un mes de sesiones a la tarifa base nacional de 2026.',
    resume: (h) => {
      const one = h.E('dialysis', { count: 1 }); const mo = h.E('dialysis', { count: 13 }); const g = h.E('dialysis', { count: 13, coverage: 'medigap', medigap: 'G' });
      return `Medicare cubre la diálisis de las personas con enfermedad renal terminal (ESRD), una insuficiencia renal permanente que requiere diálisis o un trasplante. Para recibir todo el beneficio con Medicare Original hacen falta las dos partes: la Parte B paga las sesiones ambulatorias en un centro de diálisis certificado por Medicare o en casa, la capacitación para la diálisis en casa, el equipo y los suministros, y los medicamentos de la diálisis; la Parte A paga la diálisis cuando está hospitalizado. Medicare suele cubrir 3 sesiones de hemodiálisis por semana, o la diálisis peritoneal equivalente. CMS paga a los centros una tarifa base de ${h.mx(h.P.esrd.basePerTreatment)} por sesión en 2026, antes de los ajustes por paciente y por centro, así que su 20 % ronda ${h.m(one.youPay)} por sesión una vez pagado el deducible de la Parte B. Trece sesiones, casi un mes a tres por semana, suman ${h.m(mo.approvedTotal)} aprobados y ${h.m(mo.youPay)} para usted, sin límite anual. Un Medigap Plan G lo reduce a ${h.m(g.youPay)}. Usted sigue pagando la prima mensual de la Parte B, y la de la Parte D si tiene un plan de medicamentos.`;
    },
    faqs: (h) => [
      { q: '¿Medicare paga el equipo de diálisis en casa?', a: 'Sí. La Parte B cubre la máquina de diálisis, el sistema de tratamiento del agua, un sillón reclinable básico y suministros como alcohol, toallitas, paños estériles, guantes y tijeras, además de la capacitación para usted y la persona que le ayuda, impartida por un centro certificado por Medicare. También se cubren las visitas a domicilio del personal del centro para revisar el equipo y el agua.' },
      { q: '¿Medicare cubre la ambulancia para ir a diálisis?', a: `Solo cuando viajar en cualquier otro vehículo pondría en peligro su salud, y solo de su casa al centro de diálisis más cercano y de vuelta. Un traslado programado sin emergencia de 10 millas en el resto de Florida tiene un monto aprobado de ${h.m(h.E('ambulance-nonemergency', { miles: 10 }).approvedTotal)} y le deja ${h.m(h.E('ambulance-nonemergency', { miles: 10 }).youPay)} con el deducible pagado. Los traslados por comodidad no se cubren.` },
      { q: '¿Qué no cubre Medicare en la diálisis?', a: 'Los auxiliares pagados para ayudarle con la diálisis en casa, el sueldo que usted o quien le ayuda pierdan durante la capacitación, un lugar donde alojarse durante el tratamiento, y la sangre o los glóbulos rojos para la diálisis en casa, salvo que formen parte de un servicio médico. Otro seguro que tenga puede pagar parte de esos gastos.' },
      { q: '¿El nefrólogo se factura aparte?', a: `Sí. Los servicios ambulatorios del médico por la enfermedad renal se facturan a la Parte B: después del deducible de ${h.m(h.PB.deductible)} usted paga el 20 % del monto aprobado. Medicare cubre una visita en persona al mes con su médico o con ciertos profesionales no médicos para la diálisis en casa. Durante una hospitalización, el pago mensual del nefrólogo depende de los días que pase en el hospital.` },
    ],
    body: (h) => {
      const per = h.P.esrd.basePerTreatment;
      const rows = [1, 4, 13, 156].map((n) => { const e = h.E('dialysis', { count: n }); const g = h.E('dialysis', { count: n, coverage: 'medigap', medigap: 'G' }); const k = h.E('dialysis', { count: n, coverage: 'medigap', medigap: 'K' }); return [String(n), h.m(e.approvedTotal), h.m(e.youPay), h.m(k.youPay), h.m(g.youPay)]; });
      const hosp = h.E('hospital-stay', { count: 4 });
      return `
<h2>Quién tiene derecho y qué parte paga</h2>
<p>El beneficio de diálisis es para las personas con enfermedad renal terminal. La Parte B cubre la diálisis ambulatoria y los servicios del médico en un centro certificado por Medicare o en casa, incluida la diálisis por lesión renal aguda. La Parte A cubre la diálisis cuando lo ingresan en un hospital: entonces se aplica el deducible de la Parte A, ${h.m(h.PA.inpatientDeductible)} por período de beneficios, y una estancia de 4 días le cuesta ${h.m(hosp.youPay)}, sea cual sea el número de sesiones. Su centro de diálisis debe dar los artículos y servicios cubiertos por sí mismo o mediante un acuerdo con otro proveedor.</p>
<h2>Lo que significa el 20 % en un año</h2>
<p>La diálisis es uno de los pocos servicios de la Parte B que se usan varias veces por semana durante años, y por eso la falta de un límite anual para el 20 % pesa tanto. La tabla cuenta las sesiones a la tarifa base nacional de ${h.mx(per)}; CMS ajusta la tarifa de su centro según la zona y cada paciente, así que su monto aprobado puede ser distinto.</p>
${h.table(['Sesiones', 'Aprobado', 'Solo Medicare Original', 'Medigap K', 'Medigap G'], rows, 'Deducible ya pagado, tarifa base nacional de 2026 antes de los ajustes por paciente y centro. 156 sesiones: un año a tres por semana.', ['r', 'r', 'r', 'r', 'r'])}
<p>El plan Medigap K paga la mitad de su 20 % hasta su límite anual de gastos de ${h.m(h.P.medigap.planKOutOfPocketLimit)} en 2026; a partir de ahí lo paga todo el resto del año, y la tabla muestra la mitad sin ese tope. Los planes A, B, C, D, F, G, M y N pagan todo el 20 % de estas sesiones. Con un plan Medicare Advantage se aplican el copago y el límite anual del plan: consulte los documentos de su plan.</p>
<!--tool:mini:dialysisMonth-->
<h2>Los medicamentos de la diálisis</h2>
<p>La Parte B cubre los medicamentos de la diálisis ambulatoria y en casa: la heparina, su antídoto cuando es médicamente necesario, los anestésicos tópicos y los agentes estimulantes de la eritropoyesis, como la epoetina alfa o la darbepoetina alfa, para la anemia ligada a la enfermedad renal. También cubre los quelantes del fósforo y otros tratamientos que lo reducen. Se cubren además los análisis que forman parte de la diálisis, el control cardíaco y el oxígeno durante la sesión en el centro, y la vigilancia del acceso vascular. Hable con su equipo de atención sobre cualquier medicamento, incluidos los de venta libre.</p>
<h2>El dentista antes de un trasplante o durante la diálisis</h2>
<p>Medicare Original no cubre la mayor parte de la atención dental, pero la diálisis por enfermedad renal terminal es uno de los casos en los que puede pagar servicios dentales muy ligados al tratamiento cubierto. La ${h.a('dental', 'página del dentista')} explica las excepciones.</p>
<h2>De dónde salen las cifras</h2>
<p>La tarifa base es la de 2026 de la ${h.src('esrd', 'regla final de CMS del sistema de pago de la enfermedad renal terminal')}. Las reglas de cobertura salen de la ${h.cov('dialysis', 'página de medicare.gov sobre la diálisis')}. La tarifa base de 2027 y el deducible de la Parte B de 2027 aún no se han publicado.</p>`;
    },
  },
});
