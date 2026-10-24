import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'dental', group: 'cover', order: 2,
  tool: { kind: 'est', props: { act: 'dental', acts: ['dental', 'hospital-stay'] } },
  mini: { kind: 'mini:dental' },
  related: ['hearing-aids', 'dialysis', 'not-covered', 'part-b', 'deductible', 'home'],
  sources: ['notcovered', 'cms_fs2026', 'medigap', 'partb'],
  acts: ['dental', 'hospital-stay'],
  en: {
    slug: 'does-medicare-cover-dental', nav: 'Dental care', card: 'Cleanings, fillings and dentures are yours to pay; the few cases tied to heart, transplant, cancer or dialysis care.',
    title: 'Dental Care and Medicare 2026: The Rule and Its Exceptions',
    description: 'Medicare does not pay for cleanings, fillings, extractions or dentures in most cases. See the 2026 exceptions for heart, cancer, transplant or dialysis care.',
    h1: 'Does Medicare cover dental care?',
    intro: 'In most cases, no: routine dental work is paid in full by you under Original Medicare. A short list of dental services linked to a covered medical treatment is the exception. Enter a dental bill in the tool to see which rule applies and what is left for you.',
    resume: (h) => {
      const stay = h.E('hospital-stay', { count: 3 });
      return `Original Medicare does not cover routine dental care: cleanings, fillings, tooth extractions, dentures and implants are paid by you in full, and Medigap pays nothing toward them because there is no Medicare-approved amount to share. Medicare steps in only when the dental work is tied to a medical treatment it covers and the success of that treatment depends on it. The cases named by Medicare are an oral exam and dental treatment before a heart valve replacement or a bone marrow, organ or kidney transplant; a procedure such as an extraction to clear a mouth infection before cancer treatment like chemotherapy; treatment of a complication during head and neck cancer treatment; and dental or oral exams, plus treatment of an oral infection, before and during dialysis for end-stage renal disease. Covered outpatient dental services cost 20 % of the approved amount after the ${h.m(h.PB.deductible)} Part B deductible, plus a facility copayment in a hospital outpatient setting. When you are admitted to a hospital for the dental procedure, Part A applies: the ${h.m(h.PA.inpatientDeductible)} deductible in 2026 covers days 1 to 60 of the benefit period, so a three-day stay leaves you ${h.m(stay.youPay)} for the hospital. Some Medicare Advantage plans add a dental benefit.`;
    },
    faqs: (h) => {
      const g = h.E('hospital-stay', { count: 3, coverage: 'medigap', medigap: 'G' });
      const k = h.E('hospital-stay', { count: 3, coverage: 'medigap', medigap: 'K' });
      return [
        { q: 'Will Medicare pay for a tooth extraction before chemotherapy?', a: 'It can. Medicare lists a procedure such as a tooth extraction to treat a mouth infection before cancer treatment, chemotherapy for example, among the dental services it may cover, because the medical treatment depends on it. Done as an outpatient, you pay 20 % of the approved amount after the Part B deductible. An extraction with no link to a covered treatment stays at your full cost.' },
        { q: 'Are dentures or dental implants ever covered by Original Medicare?', a: 'Medicare names dentures and implants among the items it does not cover in most cases, alongside cleanings, fillings and extractions. Its exceptions concern exams and treatments needed for a covered medical treatment to succeed, not the replacement of missing teeth. If you want coverage for dentures, look at the dental benefit of a Medicare Advantage plan or at other coverage you may have.' },
        { q: 'What does a hospital stay for dental surgery cost with Medigap?', a: `When the stay is covered by Part A, the ${h.m(h.PA.inpatientDeductible)} deductible is the main cost for a short admission. Medigap Plan G pays it in full, which brings a three-day stay to ${h.m(g.youPay)} for the hospital part. Plan K pays half of the Part A deductible, so the same stay leaves ${h.m(k.youPay)}. The dentist or surgeon also bills Part B, which Medigap shares as usual.` },
        { q: 'Does dialysis change what Medicare pays at the dentist?', a: 'Yes, for people with end-stage renal disease. Medicare may cover dental or oral exams before and while you receive Medicare-covered dialysis, and medically necessary tests and treatments to remove an oral or dental infection over the same period. These count as Part B services: 20 % of the approved amount after the deductible. Routine care such as a cleaning stays outside the rule.' },
      ];
    },
    body: (h) => {
      const s3 = h.E('hospital-stay', { count: 3 });
      const s70 = h.E('hospital-stay', { count: 70 });
      return `
<h2>The general rule: routine dental work is yours to pay</h2>
<p>Original Medicare was not built to pay dentists. Its own list of excluded items names routine cleanings, fillings, tooth extractions, dentures and implants, and Medicare says you pay all costs for these. There is no approved amount, no 20 % share and no deductible credit: the dentist's price is the price. A Medigap policy does not change that, since it only pays part of costs Medicare has approved first.</p>
<p>This holds whatever your age or the reason your teeth need work. Even a painful abscess treated in a dental office is, as a rule, a private expense under Original Medicare. The exceptions below are narrow and depend on a link with another treatment, not on how urgent the dental problem feels.</p>
<h2>Exceptions tied to a covered medical treatment</h2>
<p>Medicare may pay for specific inpatient or outpatient dental services when they are directly related to a medical treatment it covers and that treatment's success depends on them. The cases Medicare spells out are these:</p>
<ul>
<li>an oral exam and dental treatment before a heart valve replacement, or before a bone marrow, organ or kidney transplant;</li>
<li>a procedure such as a tooth extraction to treat a mouth infection before cancer treatment, chemotherapy for example;</li>
<li>treatment of a complication that appears during head and neck cancer treatment;</li>
<li>dental or oral exams before and during Medicare-covered dialysis for end-stage renal disease, and medically necessary tests and treatment to remove an oral or dental infection over the same period.</li>
</ul>
<p>Medicare's list of non-covered services also mentions heart valve repair among the treatments that can bring related dental care under coverage. In each case the paperwork matters: the dental service has to be documented as part of the medical treatment plan, so ask the treating doctor and the dentist to coordinate before the work is done.</p>
<h2>What a covered dental service costs you</h2>
<p>When the linked dental service is done as an outpatient, it falls under Part B. You pay the ${h.m(h.PB.deductible)} deductible if it is not yet met in 2026, then 20 % of the Medicare-approved amount. In a hospital outpatient department or another facility setting, the facility also charges you a copayment. The mini tool above applies that rule to the bill you enter and shows what changes when the work is linked to a covered treatment.</p>
<p>Sometimes the dental procedure requires a hospital admission, because of your underlying condition or because the procedure itself is severe. Part A then covers the hospital, and the 2026 amounts apply per benefit period.</p>
${h.table(['Days in the hospital', 'What you pay for each day', 'Example'], [
  ['Days 1 to 60', `${h.m(h.PA.inpatientDeductible)} deductible, then $0`, `${h.m(s3.youPay)} for a three-day stay`],
  ['Days 61 to 90', h.m(h.PA.hospitalDaily61to90), `${h.m(s70.youPay)} for a 70-day stay`],
  ['Days 91 to 150 (lifetime reserve days)', h.m(h.PA.lifetimeReserveDaily), ''],
  ['After day 150', 'All costs', ''],
], 'Part A inpatient amounts for 2026 (CMS fact sheet of November 14, 2025). The dentist or surgeon bills Part B separately.', ['l', 'r', 'r'])}
<p>The 2027 Part A and Part B amounts are not published yet: CMS usually releases them in mid-November. Until then, a procedure planned for early 2027 can only be priced with the 2026 figures above.</p>
<h2>Dental benefits through other coverage</h2>
<p>Medicare Advantage plans may offer extra benefits Original Medicare does not include, dental care among them, and so may Medicare Cost plans and PACE. Other health coverage you hold can also help. Each plan decides what it pays, how often, and through which dentists, so the details are in the plan's own documents. If your plan gives a yearly dental allowance, type it in the mini tool with the bill: the tool shows what remains after the allowance is used.</p>
<h2>Questions to settle before the appointment</h2>
<p>Is the dental work needed for a treatment Medicare covers, and will the treating doctor say so in writing? Will it be done in a dental office, a hospital outpatient department or during an inpatient stay? Has the Part B deductible already been met this year? The first answer decides whether Medicare pays anything at all; the other two decide how much of the bill stays with you. For routine care with no medical link, the useful question is simpler: what is the full price, and what does it include?</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-dental', nav: 'Atención dental', card: 'Limpiezas, empastes y dentaduras corren por su cuenta; los pocos casos ligados al corazón, trasplantes, cáncer o diálisis.',
    title: 'Atención dental y Medicare 2026: la regla y sus excepciones',
    description: 'Medicare no paga limpiezas, empastes, extracciones ni dentaduras casi nunca. Vea las excepciones de 2026 ligadas al corazón, cáncer, trasplante o diálisis.',
    h1: '¿Medicare cubre la atención dental?',
    intro: 'En la mayoría de los casos, no: con Medicare Original usted paga completo el trabajo dental de rutina. La excepción es una lista corta de servicios dentales ligados a un tratamiento médico cubierto. Escriba una factura dental en la herramienta para ver qué regla se aplica y cuánto le queda a usted.',
    resume: (h) => {
      const stay = h.E('hospital-stay', { count: 3 });
      return `Medicare Original no cubre la atención dental de rutina: las limpiezas, los empastes, las extracciones, las dentaduras y los implantes los paga usted por completo, y Medigap no aporta nada porque no hay un monto aprobado por Medicare que compartir. Medicare interviene solo cuando el trabajo dental está ligado a un tratamiento médico que cubre y el éxito de ese tratamiento depende de él. Los casos que nombra Medicare son un examen oral y tratamiento dental antes de un reemplazo de válvula cardíaca o de un trasplante de médula ósea, de órgano o de riñón; un procedimiento, como una extracción, para eliminar una infección de la boca antes de un tratamiento contra el cáncer como la quimioterapia; el tratamiento de una complicación durante el tratamiento de un cáncer de cabeza y cuello; y los exámenes dentales u orales, más el tratamiento de una infección oral, antes y durante la diálisis por enfermedad renal terminal. Los servicios dentales ambulatorios cubiertos cuestan el 20 % del monto aprobado después del deducible de la Parte B de ${h.m(h.PB.deductible)}, más un copago del centro en un hospital ambulatorio. Si lo internan para el procedimiento dental, se aplica la Parte A: el deducible de ${h.m(h.PA.inpatientDeductible)} en 2026 cubre los días 1 a 60 del período de beneficios, de modo que una estancia de tres días le cuesta ${h.m(stay.youPay)} por el hospital. Algunos planes Medicare Advantage añaden un beneficio dental.`;
    },
    faqs: (h) => {
      const g = h.E('hospital-stay', { count: 3, coverage: 'medigap', medigap: 'G' });
      const k = h.E('hospital-stay', { count: 3, coverage: 'medigap', medigap: 'K' });
      return [
        { q: '¿Medicare paga una extracción dental antes de la quimioterapia?', a: 'Puede pagarla. Medicare incluye un procedimiento como la extracción de un diente para tratar una infección de la boca antes de un tratamiento contra el cáncer, por ejemplo la quimioterapia, entre los servicios dentales que puede cubrir, porque el tratamiento médico depende de ello. Si se hace de forma ambulatoria, usted paga el 20 % del monto aprobado tras el deducible de la Parte B. Una extracción sin relación con un tratamiento cubierto la paga usted completa.' },
        { q: '¿Medicare Original cubre alguna vez las dentaduras o los implantes?', a: 'Medicare menciona las dentaduras y los implantes entre lo que no cubre en la mayoría de los casos, junto con las limpiezas, los empastes y las extracciones. Sus excepciones se refieren a exámenes y tratamientos necesarios para que funcione un tratamiento médico cubierto, no a reponer dientes perdidos. Para las dentaduras, revise el beneficio dental de un plan Medicare Advantage o la otra cobertura que tenga.' },
        { q: '¿Cuánto cuesta con Medigap una hospitalización por cirugía dental?', a: `Cuando la Parte A cubre la estancia, el deducible de ${h.m(h.PA.inpatientDeductible)} es el costo principal de una internación corta. El Plan G de Medigap lo paga completo, lo que deja una estancia de tres días en ${h.m(g.youPay)} por la parte del hospital. El Plan K paga la mitad del deducible de la Parte A, así que la misma estancia le deja ${h.m(k.youPay)}. El dentista o el cirujano factura además a la Parte B, que Medigap comparte como siempre.` },
        { q: '¿La diálisis cambia lo que Medicare paga en el dentista?', a: 'Sí, para las personas con enfermedad renal terminal. Medicare puede cubrir los exámenes dentales u orales antes y durante la diálisis cubierta, y las pruebas y tratamientos médicamente necesarios para eliminar una infección oral o dental en ese mismo período. Son servicios de la Parte B: el 20 % del monto aprobado después del deducible. La atención de rutina, como una limpieza, sigue fuera de la regla.' },
      ];
    },
    body: (h) => {
      const s3 = h.E('hospital-stay', { count: 3 });
      const s70 = h.E('hospital-stay', { count: 70 });
      return `
<h2>La regla general: el trabajo dental de rutina lo paga usted</h2>
<p>Medicare Original no se diseñó para pagar al dentista. Su propia lista de exclusiones menciona las limpiezas de rutina, los empastes, las extracciones, las dentaduras y los implantes, y Medicare indica que usted paga todos esos costos. No hay monto aprobado, ni 20 %, ni deducible que se descuente: el precio del dentista es el precio. Una póliza Medigap no cambia eso, porque solo paga una parte de los costos que Medicare aprobó antes.</p>
<p>La regla vale sin importar su edad ni el motivo del tratamiento. Incluso un absceso doloroso tratado en el consultorio dental es, por lo general, un gasto privado con Medicare Original. Las excepciones son estrechas y dependen del vínculo con otro tratamiento, no de lo urgente que parezca el problema dental.</p>
<h2>Excepciones ligadas a un tratamiento médico cubierto</h2>
<p>Medicare puede pagar servicios dentales concretos, en el hospital o de forma ambulatoria, cuando están directamente relacionados con un tratamiento médico que cubre y el éxito de ese tratamiento depende de ellos. Los casos que detalla Medicare son estos:</p>
<ul>
<li>un examen oral y tratamiento dental antes de un reemplazo de válvula cardíaca, o antes de un trasplante de médula ósea, de órgano o de riñón;</li>
<li>un procedimiento, como la extracción de un diente, para tratar una infección de la boca antes de un tratamiento contra el cáncer, por ejemplo la quimioterapia;</li>
<li>el tratamiento de una complicación que aparece durante el tratamiento de un cáncer de cabeza y cuello;</li>
<li>los exámenes dentales u orales antes y durante la diálisis cubierta por enfermedad renal terminal, y las pruebas y tratamientos médicamente necesarios para eliminar una infección oral o dental en ese período.</li>
</ul>
<p>La lista de servicios no cubiertos de Medicare menciona también la reparación de una válvula cardíaca entre los tratamientos que pueden traer consigo atención dental cubierta. En todos los casos cuentan los papeles: el servicio dental debe figurar como parte del plan de tratamiento médico, así que pida al médico tratante y al dentista que se coordinen antes de empezar.</p>
<h2>Lo que le cuesta un servicio dental cubierto</h2>
<p>Si el servicio dental vinculado se hace de forma ambulatoria, lo cubre la Parte B. Usted paga el deducible de ${h.m(h.PB.deductible)} si aún no lo cubrió en 2026 y luego el 20 % del monto aprobado por Medicare. En el departamento ambulatorio de un hospital o en otro centro, este le cobra además un copago. La minicalculadora de arriba aplica esa regla a la factura que usted escribe y muestra qué cambia cuando el trabajo está ligado a un tratamiento cubierto.</p>
<p>A veces el procedimiento dental exige una internación, por su afección de fondo o porque el procedimiento es complejo. En ese caso la Parte A cubre el hospital y se aplican los montos de 2026 por período de beneficios.</p>
${h.table(['Días en el hospital', 'Lo que paga por día', 'Ejemplo'], [
  ['Días 1 a 60', `deducible de ${h.m(h.PA.inpatientDeductible)}, luego $0`, `${h.m(s3.youPay)} por una estancia de tres días`],
  ['Días 61 a 90', h.m(h.PA.hospitalDaily61to90), `${h.m(s70.youPay)} por una estancia de 70 días`],
  ['Días 91 a 150 (días de reserva de por vida)', h.m(h.PA.lifetimeReserveDaily), ''],
  ['Después del día 150', 'Todos los costos', ''],
], 'Montos de hospitalización de la Parte A para 2026 (hoja informativa de CMS del 14 de noviembre de 2025). El dentista o el cirujano factura aparte a la Parte B.', ['l', 'r', 'r'])}
<p>Los montos de 2027 de las Partes A y B todavía no se han publicado: CMS suele darlos a conocer a mediados de noviembre. Hasta entonces, un procedimiento previsto para principios de 2027 solo puede calcularse con las cifras de 2026.</p>
<h2>Beneficios dentales por otra cobertura</h2>
<p>Los planes Medicare Advantage pueden ofrecer beneficios que Medicare Original no incluye, entre ellos la atención dental, y lo mismo los planes de costo de Medicare y PACE. Otra cobertura de salud que usted tenga también puede ayudar. Cada plan decide qué paga, con qué frecuencia y con qué dentistas, así que los detalles están en sus propios documentos. Si su plan le da una asignación dental anual, escríbala en la minicalculadora junto con la factura: verá lo que queda después de usarla.</p>
<h2>Lo que conviene aclarar antes de la cita</h2>
<p>¿El trabajo dental es necesario para un tratamiento que cubre Medicare, y el médico tratante lo dirá por escrito? ¿Se hará en el consultorio dental, en el departamento ambulatorio de un hospital o durante una internación? ¿Ya pagó este año el deducible de la Parte B? La primera respuesta decide si Medicare paga algo; las otras dos, cuánto de la factura le queda a usted. Para la atención de rutina sin vínculo médico, la pregunta útil es más simple: ¿cuál es el precio total y qué incluye?</p>`;
    },
  },
});
