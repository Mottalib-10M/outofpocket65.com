import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'colonoscopy', group: 'cover', order: 8,
  tool: { kind: 'est', props: { act: 'colonoscopy-screening', acts: ['colonoscopy-screening', 'colonoscopy-polyp', 'colonoscopy-diagnostic'], setting: 'asc' } },
  mini: { kind: 'mini:polyp' },
  related: ['mammograms', 'shingles', 'mri', 'part-b', 'deductible', 'home'],
  sources: ['cfr410_152', 'asc', 'opps', 'pfs'],
  acts: ['colonoscopy-screening', 'colonoscopy-polyp', 'colonoscopy-diagnostic'],
  en: {
    slug: 'does-medicare-cover-colonoscopy', nav: 'Colonoscopy', card: 'Screening at $0, the share you owe when a polyp is removed, and diagnostic colonoscopies.',
    title: 'Colonoscopy and Medicare 2026: Screening, Polyps, Your Share',
    description: 'A screening colonoscopy costs nothing with Medicare, but a removed polyp changes the bill. See the 2026 and 2027 shares, the surgery center and hospital rates.',
    h1: 'Does Medicare cover a colonoscopy?',
    intro: 'Yes. A screening colonoscopy costs you nothing when the provider accepts assignment. If a polyp is removed during it, you owe a set share of the approved amount with no deductible. The estimator prices all three cases, screening, polyp removal and diagnostic, by facility.',
    resume: (h) => {
      const scr = h.E('colonoscopy-screening', { setting: 'asc' });
      const pol = h.E('colonoscopy-polyp', { setting: 'asc' });
      const polH = h.E('colonoscopy-polyp', { setting: 'hopd' });
      const p27 = h.E('colonoscopy-polyp', { setting: 'asc', crcYear: 2027 });
      const dia = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      return `Medicare Part B covers screening colonoscopies with no minimum age, once every 120 months if you are not at high risk for colorectal cancer, or 48 months after a previous flexible sigmoidoscopy, and once every 24 months if you are at high risk. When the doctor accepts assignment you pay ${h.m(scr.youPay)} for the screening, including a follow-up colonoscopy after a positive stool-based or blood-based screening test. The bill changes if the doctor finds and removes a polyp or other tissue during the screening: in 2026 you then pay ${h.pc(h.P.crcScreeningConversion.patientShare)} of the approved amount to the doctor and to the facility, and the Part B deductible does not apply. At national rates in an ambulatory surgery center that comes to ${h.m(pol.youPay)} on an approved ${h.m(pol.approvedTotal)}; in a hospital outpatient department, ${h.m(polH.youPay)}. Federal rules lower the share to ${h.pc(h.P27.crcScreeningConversion.patientShare)} from 2027 to 2029, so the same surgery center case will cost ${h.m(p27.youPay)}, and to zero in 2030. A colonoscopy ordered because of symptoms is diagnostic, not screening: 20 % after the deductible, or ${h.m(dia.youPay)} in a surgery center once the deductible is met.`;
    },
    faqs: (h) => {
      const pol = h.E('colonoscopy-polyp', { setting: 'asc' });
      const dia = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      const diaFirst = h.E('colonoscopy-diagnostic', { setting: 'asc', deductibleRemaining: h.PB.deductible });
      return [
        { q: 'Why did I get a bill after a screening colonoscopy that was supposed to be free?', a: `Most often because a polyp or other tissue was removed during the exam. Medicare then treats the procedure differently and you pay ${h.pc(h.P.crcScreeningConversion.patientShare)} of the approved amount to both the doctor and the facility in 2026, with no deductible. In a surgery center at national rates, that is ${h.m(pol.youPay)}. The Medicare Summary Notice shows which line carries that share.` },
        { q: 'Is a colonoscopy after a positive stool test still a screening?', a: 'Yes. When a Medicare-covered stool-based test, such as a fecal occult blood test or a multi-target stool DNA test, or a blood-based biomarker screening test comes back positive, Part B covers the follow-up colonoscopy as a screening test. With a provider who accepts assignment, you pay nothing for it, unless a polyp is removed during the procedure.' },
        { q: 'What does a diagnostic colonoscopy cost with Medicare?', a: `A colonoscopy done because of symptoms is not a screening, so the usual Part B rule applies: 20 % of the approved amount after the deductible. At national rates in a surgery center, your share is ${h.m(dia.youPay)} with the deductible met, or ${h.m(diaFirst.youPay)} if it is your first Part B bill of the year. In a hospital outpatient department it is higher.` },
        { q: 'How often will Medicare pay for a screening colonoscopy?', a: 'Every 24 months if you are at high risk for colorectal cancer. If you are not at high risk, once every 120 months, or 48 months after a previous flexible sigmoidoscopy. There is no minimum age. A screening done sooner than these intervals is not covered as a screening, so check the date of your last one before booking.' },
      ];
    },
    body: (h) => {
      const sA = h.E('colonoscopy-screening', { setting: 'asc' });
      const sH = h.E('colonoscopy-screening', { setting: 'hopd' });
      const pA = h.E('colonoscopy-polyp', { setting: 'asc' });
      const pH = h.E('colonoscopy-polyp', { setting: 'hopd' });
      const p27A = h.E('colonoscopy-polyp', { setting: 'asc', crcYear: 2027 });
      const p27H = h.E('colonoscopy-polyp', { setting: 'hopd', crcYear: 2027 });
      const dA = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      const dH = h.E('colonoscopy-diagnostic', { setting: 'hopd' });
      const share26 = h.pc(h.P.crcScreeningConversion.patientShare);
      const share27 = h.pc(h.P27.crcScreeningConversion.patientShare);
      return `
<h2>Three procedures that look the same on the day</h2>
<p>From the patient's side, a colonoscopy is one appointment. On the claim, it can be one of three things, and each one is paid under a different rule. A screening colonoscopy is a preventive service. A screening during which a polyp is removed keeps its screening status but carries a reduced coinsurance. A diagnostic colonoscopy, ordered because of symptoms, follows the ordinary Part B rule.</p>
${h.table(['National rates, 2026', 'Surgery center: approved', 'You pay', 'Hospital outpatient: approved', 'You pay'], [
  ['Screening, nothing removed', h.m(sA.approvedTotal), h.m(sA.youPay), h.m(sH.approvedTotal), h.m(sH.youPay)],
  [`Screening with polyp removal (${share26}, no deductible)`, h.m(pA.approvedTotal), h.m(pA.youPay), h.m(pH.approvedTotal), h.m(pH.youPay)],
  ['Diagnostic, deductible met', h.m(dA.approvedTotal), h.m(dA.youPay), h.m(dH.approvedTotal), h.m(dH.youPay)],
], 'Doctor fee from the physician fee schedule, facility from the ASC and OPPS addenda of October 2026, provider accepting assignment.', ['l', 'r', 'r', 'r', 'r'])}
<h2>When a polyp is removed</h2>
<p>Removing a polyp is the one event that turns a free screening into a bill. Medicare's rule is precise: you pay ${share26} of the approved amount for the provider's services, and in a hospital outpatient setting or an ambulatory surgical center you also pay the facility ${share26}. The Part B deductible does not apply, so the share is the same in January as in December.</p>
<p>The percentage is written into federal regulation, 42 CFR 410.152, and already scheduled to fall. Part B pays ${h.pc(1 - h.P.crcScreeningConversion.patientShare)} through 2026, ${h.pc(1 - h.P27.crcScreeningConversion.patientShare)} from 2027 through 2029 and the full amount from 2030. Your share therefore drops to ${share27} in 2027, which turns the surgery center example into ${h.m(p27A.youPay)} and the hospital example into ${h.m(p27H.youPay)}, before reaching zero in 2030. The 2027 approved amounts themselves are not published yet, so these examples use the 2026 rates with the 2027 percentage; the mini tool lets you switch the year.</p>
<h2>Surgery center or hospital outpatient department</h2>
<p>The doctor's fee is the same in both places. The facility fee is not: CMS pays a hospital outpatient department noticeably more than an ambulatory surgery center for the same procedure. For a plain screening this makes no difference to you, since you pay nothing either way. As soon as a polyp is removed, or the procedure is diagnostic, your share follows the facility rate, which is why the hospital column of the table is higher. If both options are available, asking where the procedure will be done is a fair question.</p>
<!--tool:mini:deductible-->
<h2>How often a screening is covered</h2>
<ul>
<li>Every 24 months if you are at high risk for colorectal cancer.</li>
<li>Every 120 months if you are not at high risk.</li>
<li>48 months after a previous flexible sigmoidoscopy, if you are not at high risk.</li>
</ul>
<p>There is no minimum age. A screening colonoscopy can also follow a positive result from a Medicare-covered stool test, such as a fecal occult blood test or a multi-target stool DNA test, or from a blood-based biomarker test; that follow-up is covered as a screening too.</p>
<h2>Diagnostic colonoscopies</h2>
<p>When the colonoscopy is ordered because of symptoms, it is no longer preventive. You pay the Part B deductible if it is still due, then 20 % of the approved amount, and in a hospital outpatient department a hospital copayment. With the deductible met, that is ${h.m(dA.youPay)} in a surgery center and ${h.m(dH.youPay)} in a hospital at national rates. Medigap Plan G pays that 20 % in full; it also pays the share on a polyp removal, which is Part B coinsurance like any other.</p>
<h2>Reading the bill afterwards</h2>
<p>Expect at least two claims, the doctor's and the facility's, and compare each with the Medicare Summary Notice. A screening line marked as yours to pay, with nothing removed and a provider who accepts assignment, is worth questioning with the billing office.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-colonoscopia', nav: 'Colonoscopia', card: 'Detección a $0, lo que paga si le extirpan un pólipo y las colonoscopias diagnósticas.',
    title: 'Colonoscopia y Medicare 2026: detección, pólipos y su parte',
    description: 'La colonoscopia de detección no cuesta nada con Medicare, pero un pólipo extirpado cambia la factura. Vea los porcentajes 2026 y 2027 y las tarifas por centro.',
    h1: '¿Medicare cubre la colonoscopia?',
    intro: 'Sí. La colonoscopia de detección no le cuesta nada si el proveedor acepta la asignación. Si durante el examen se extirpa un pólipo, usted debe un porcentaje fijo del monto aprobado, sin deducible. La calculadora pone precio a los tres casos, detección, pólipo y diagnóstica, según el centro.',
    resume: (h) => {
      const scr = h.E('colonoscopy-screening', { setting: 'asc' });
      const pol = h.E('colonoscopy-polyp', { setting: 'asc' });
      const polH = h.E('colonoscopy-polyp', { setting: 'hopd' });
      const p27 = h.E('colonoscopy-polyp', { setting: 'asc', crcYear: 2027 });
      const dia = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      return `La Parte B de Medicare cubre la colonoscopia de detección sin edad mínima, una vez cada 120 meses si usted no tiene alto riesgo de cáncer colorrectal, o 48 meses después de una sigmoidoscopia flexible anterior, y una vez cada 24 meses si tiene alto riesgo. Si el médico acepta la asignación, usted paga ${h.m(scr.youPay)} por la detección, incluida la colonoscopia de seguimiento tras un resultado positivo en una prueba de heces o de sangre. La factura cambia si el médico encuentra y extirpa un pólipo u otro tejido durante el examen: en 2026 usted paga entonces el ${h.pc(h.P.crcScreeningConversion.patientShare)} del monto aprobado al médico y al centro, y no se aplica el deducible de la Parte B. Con las tarifas nacionales en un centro de cirugía ambulatoria eso supone ${h.m(pol.youPay)} sobre un monto aprobado de ${h.m(pol.approvedTotal)}; en el departamento ambulatorio de un hospital, ${h.m(polH.youPay)}. La normativa federal baja ese porcentaje al ${h.pc(h.P27.crcScreeningConversion.patientShare)} de 2027 a 2029, así que el mismo caso en un centro de cirugía costará ${h.m(p27.youPay)}, y a cero en 2030. Una colonoscopia indicada por síntomas es diagnóstica, no de detección: el 20 % tras el deducible, o ${h.m(dia.youPay)} en un centro de cirugía con el deducible pagado.`;
    },
    faqs: (h) => {
      const pol = h.E('colonoscopy-polyp', { setting: 'asc' });
      const dia = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      const diaFirst = h.E('colonoscopy-diagnostic', { setting: 'asc', deductibleRemaining: h.PB.deductible });
      return [
        { q: '¿Por qué recibí una factura tras una colonoscopia de detección que debía ser gratuita?', a: `Casi siempre porque se extirpó un pólipo u otro tejido durante el examen. Medicare trata entonces el procedimiento de otro modo y usted paga en 2026 el ${h.pc(h.P.crcScreeningConversion.patientShare)} del monto aprobado al médico y al centro, sin deducible. En un centro de cirugía a tarifa nacional son ${h.m(pol.youPay)}. El Resumen de Medicare muestra en qué línea figura ese porcentaje.` },
        { q: '¿Una colonoscopia después de una prueba de heces positiva sigue siendo de detección?', a: 'Sí. Cuando una prueba de heces cubierta por Medicare, como la de sangre oculta en heces o la de ADN fecal multiobjetivo, o una prueba de biomarcadores en sangre da positivo, la Parte B cubre la colonoscopia de seguimiento como prueba de detección. Con un proveedor que acepta la asignación no paga nada, salvo que se extirpe un pólipo durante el procedimiento.' },
        { q: '¿Cuánto cuesta una colonoscopia diagnóstica con Medicare?', a: `Una colonoscopia hecha por síntomas no es de detección, así que se aplica la regla habitual de la Parte B: el 20 % del monto aprobado después del deducible. A tarifa nacional en un centro de cirugía, su parte es de ${h.m(dia.youPay)} con el deducible pagado, o de ${h.m(diaFirst.youPay)} si es su primera factura de la Parte B del año. En el departamento ambulatorio de un hospital es mayor.` },
        { q: '¿Cada cuánto paga Medicare una colonoscopia de detección?', a: 'Cada 24 meses si usted tiene alto riesgo de cáncer colorrectal. Si no tiene alto riesgo, una vez cada 120 meses, o 48 meses después de una sigmoidoscopia flexible anterior. No hay edad mínima. Una detección hecha antes de esos plazos no se cubre como detección, así que revise la fecha de la última antes de pedir cita.' },
      ];
    },
    body: (h) => {
      const sA = h.E('colonoscopy-screening', { setting: 'asc' });
      const sH = h.E('colonoscopy-screening', { setting: 'hopd' });
      const pA = h.E('colonoscopy-polyp', { setting: 'asc' });
      const pH = h.E('colonoscopy-polyp', { setting: 'hopd' });
      const p27A = h.E('colonoscopy-polyp', { setting: 'asc', crcYear: 2027 });
      const p27H = h.E('colonoscopy-polyp', { setting: 'hopd', crcYear: 2027 });
      const dA = h.E('colonoscopy-diagnostic', { setting: 'asc' });
      const dH = h.E('colonoscopy-diagnostic', { setting: 'hopd' });
      const share26 = h.pc(h.P.crcScreeningConversion.patientShare);
      const share27 = h.pc(h.P27.crcScreeningConversion.patientShare);
      return `
<h2>Tres procedimientos que parecen iguales ese día</h2>
<p>Para el paciente, una colonoscopia es una sola cita. En la reclamación puede ser una de tres cosas, y cada una se paga con una regla distinta. La colonoscopia de detección es un servicio preventivo. Una detección en la que se extirpa un pólipo conserva su carácter de detección, pero lleva un coseguro reducido. La colonoscopia diagnóstica, indicada por síntomas, sigue la regla común de la Parte B.</p>
${h.table(['Tarifas nacionales, 2026', 'Centro de cirugía: aprobado', 'Usted paga', 'Hospital ambulatorio: aprobado', 'Usted paga'], [
  ['Detección, sin extirpación', h.m(sA.approvedTotal), h.m(sA.youPay), h.m(sH.approvedTotal), h.m(sH.youPay)],
  [`Detección con pólipo extirpado (${share26}, sin deducible)`, h.m(pA.approvedTotal), h.m(pA.youPay), h.m(pH.approvedTotal), h.m(pH.youPay)],
  ['Diagnóstica, deducible pagado', h.m(dA.approvedTotal), h.m(dA.youPay), h.m(dH.approvedTotal), h.m(dH.youPay)],
], 'Honorarios del médico según el baremo de médicos, centro según los anexos ASC y OPPS de octubre de 2026, proveedor que acepta la asignación.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Cuando se extirpa un pólipo</h2>
<p>Extirpar un pólipo es lo que convierte una detección gratuita en una factura. La regla de Medicare es precisa: usted paga el ${share26} del monto aprobado por los servicios del proveedor, y en el departamento ambulatorio de un hospital o en un centro de cirugía ambulatoria paga además el ${share26} al centro. El deducible de la Parte B no se aplica, así que el porcentaje es el mismo en enero que en diciembre.</p>
<p>El porcentaje está fijado en la normativa federal, 42 CFR 410.152, y ya tiene previsto bajar. La Parte B paga el ${h.pc(1 - h.P.crcScreeningConversion.patientShare)} hasta 2026, el ${h.pc(1 - h.P27.crcScreeningConversion.patientShare)} de 2027 a 2029 y el monto completo desde 2030. Su parte baja así al ${share27} en 2027, lo que deja el ejemplo del centro de cirugía en ${h.m(p27A.youPay)} y el del hospital en ${h.m(p27H.youPay)}, antes de llegar a cero en 2030. Los montos aprobados de 2027 todavía no se han publicado, así que estos ejemplos usan las tarifas de 2026 con el porcentaje de 2027; la minicalculadora le deja cambiar el año.</p>
<h2>Centro de cirugía o departamento ambulatorio de un hospital</h2>
<p>Los honorarios del médico son los mismos en los dos lugares. La tarifa del centro no: CMS paga bastante más a un departamento ambulatorio de hospital que a un centro de cirugía ambulatoria por el mismo procedimiento. En una detección simple esto no le afecta, porque no paga nada en ninguno de los dos. En cuanto se extirpa un pólipo, o si el procedimiento es diagnóstico, su parte sigue la tarifa del centro, y por eso la columna del hospital es más alta. Si tiene las dos opciones, preguntar dónde se hará es una pregunta razonable.</p>
<!--tool:mini:deductible-->
<h2>Con qué frecuencia se cubre la detección</h2>
<ul>
<li>Cada 24 meses si usted tiene alto riesgo de cáncer colorrectal.</li>
<li>Cada 120 meses si no tiene alto riesgo.</li>
<li>48 meses después de una sigmoidoscopia flexible anterior, si no tiene alto riesgo.</li>
</ul>
<p>No hay edad mínima. Una colonoscopia de detección también puede seguir a un resultado positivo en una prueba de heces cubierta por Medicare, como la de sangre oculta en heces o la de ADN fecal multiobjetivo, o en una prueba de biomarcadores en sangre; ese seguimiento también se cubre como detección.</p>
<h2>Las colonoscopias diagnósticas</h2>
<p>Cuando la colonoscopia se indica por síntomas, deja de ser preventiva. Usted paga el deducible de la Parte B si aún lo debe, luego el 20 % del monto aprobado y, en el departamento ambulatorio de un hospital, un copago al hospital. Con el deducible pagado, son ${h.m(dA.youPay)} en un centro de cirugía y ${h.m(dH.youPay)} en un hospital a tarifa nacional. El Plan G de Medigap paga ese 20 % completo; también paga el porcentaje de una extirpación de pólipo, que es coseguro de la Parte B como cualquier otro.</p>
<h2>Revisar la factura después</h2>
<p>Espere al menos dos reclamaciones, la del médico y la del centro, y compare cada una con el Resumen de Medicare. Una línea de detección marcada a su cargo, sin extirpación y con un proveedor que acepta la asignación, merece una consulta con la oficina de facturación.</p>`;
    },
  },
});
