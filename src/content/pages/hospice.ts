import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'hospice', group: 'cover', order: 23,
  tool: { kind: 'est', props: { act: 'hospice', count: 4, acts: ['hospice', 'skilled-nursing', 'home-health', 'hospital-stay'] } },
  mini: { kind: 'mini:hospiceRx' },
  related: ['snf', 'home-health', 'what-covers', 'not-covered', 'home'],
  sources: ['cms_fs2026', 'medigap'],
  acts: ['hospice'],
  en: {
    slug: 'does-medicare-cover-hospice', nav: 'Hospice care', card: 'End-of-life care at home or in a facility: what costs nothing, the drug copay, respite care and room and board.',
    title: 'Hospice Care and Medicare 2026: What Is Free, What Is Not',
    description: 'Medicare Part A covers hospice care for a terminal illness at no cost, except a small copay per prescription and 5 % for respite care. Room and board is not.',
    h1: 'Does Medicare cover hospice care?',
    intro: 'Yes, under Part A, from a Medicare-approved hospice. Enter the number of prescriptions a month: the estimator gives the drug copays, the only regular cost of covered hospice care.',
    resume: (h) => {
      const rx = h.E('hospice', { count: 4 });
      return `Medicare Part A covers hospice, the end-of-life care for an illness that cannot be cured, when your hospice doctor and your regular doctor, if you have one, certify that you are terminally ill with a life expectancy of 6 months or less, you accept comfort care instead of care to cure the illness, and you sign a statement choosing hospice. From a Medicare-approved hospice provider, covered hospice care costs you nothing. The exceptions are small but real: a copayment of up to ${h.m(h.P.hospice.drugCopayMax)} for each outpatient prescription for pain and symptom management, so ${h.m(rx.youPay)} for four prescriptions, and up to ${h.pc(h.P.hospice.respiteCoinsurance)} of the Medicare-approved amount for inpatient respite care, the short stay that gives a caregiver a rest. Room and board are not covered when you receive hospice care at home, in a nursing home or in an inpatient hospice facility, unless the hospice team arranges short-term inpatient or respite care. Coverage runs for two 90-day benefit periods, then an unlimited number of 60-day periods, as long as a hospice doctor recertifies that you are terminally ill.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare pay for room and board in hospice?', a: 'No, not when you get hospice care at home, or live in a nursing home or an inpatient hospice facility. If you live in a nursing home and choose hospice, the nursing home\'s room and board can remain yours to pay. If the hospice team decides you need short-term inpatient or respite care that it arranges, Medicare covers that stay.' },
      { q: 'Can I keep my regular doctor in hospice?', a: 'Yes, if you chose that doctor or nurse practitioner as the attending medical professional who helps supervise your hospice care. All care for your terminal illness must be given or arranged by the hospice team, and you cannot get the same type of hospice care from a different hospice unless you change provider, which you may do once in each benefit period.' },
      { q: 'Does Medicare still pay for health problems unrelated to the terminal illness?', a: `Yes. Original Medicare keeps paying covered benefits for health problems that are not part of the terminal illness and related conditions, with the usual deductible and coinsurance, such as the ${h.m(h.PB.deductible)} Part B deductible and 20 %. You can ask the hospice for a list of items, services and drugs it considers unrelated, with the reasons; it must give it within 3 to 5 days.` },
      { q: 'What hospice care is not covered?', a: 'Treatment intended to cure the terminal illness, prescription drugs to cure it rather than relieve symptoms, care from a hospice provider that the hospice team did not set up, and hospital outpatient care, inpatient care or ambulance transportation that the hospice team did not arrange, unless unrelated to the terminal illness. Contact the hospice team before any of these, or you might pay the entire cost.' },
    ],
    body: (h) => {
      const rows = [1, 4, 8, 15].map((n) => [String(n), h.m(h.E('hospice', { count: n }).youPay), h.m(h.E('hospice', { count: n }).youPay * 3)]);
      return `
<h2>Who qualifies</h2>
<p>You must have Part A and meet three conditions: a hospice doctor and your regular doctor, if you have one, certify that you are terminally ill with a life expectancy of 6 months or less; you accept comfort care, also called palliative care, instead of care to cure your illness; and you sign a Hospice Election Statement choosing hospice instead of other Medicare-covered treatments for the terminal illness and related conditions. The statement names the hospice, the start date and your attending doctor, and it must be completed before any hospice service.</p>
<h2>Benefit periods</h2>
<p>Hospice is covered for two 90-day benefit periods, followed by an unlimited number of 60-day periods. After the first 6 months, care continues as long as the hospice medical director or hospice doctor recertifies, after a face-to-face meeting with the hospice doctor or nurse practitioner, that you are still terminally ill. You may change hospice provider once in each benefit period, and you may stop hospice care.</p>
<h2>What you pay</h2>
<ul>
<li><strong>Covered hospice care</strong> from a Medicare-approved provider: $0.</li>
<li><strong>Outpatient drugs for pain and symptoms</strong>: up to ${h.m(h.P.hospice.drugCopayMax)} per prescription. In the rare case the hospice benefit does not cover a drug, the hospice should contact your drug plan to see if Part D covers it.</li>
<li><strong>Inpatient respite care</strong>: up to ${h.pc(h.P.hospice.respiteCoinsurance)} of the Medicare-approved amount, and never more than the inpatient deductible, ${h.m(h.PA.inpatientDeductible)} in 2026.</li>
<li><strong>Room and board</strong> where you live, if that is a nursing home or other facility: not covered.</li>
</ul>
${h.table(['Prescriptions a month', 'Most you pay a month', 'Over 3 months'], rows, `At the ${h.m(h.P.hospice.drugCopayMax)} maximum copayment per prescription. The hospice team, visits and medical equipment for the terminal illness cost nothing.`, ['r', 'r', 'r'])}
<!--tool:mini:hospiceRx-->
<h2>Medigap</h2>
<p>The standardized Medigap chart includes the Part A hospice coinsurance or copayment: Plans A, B, C, D, F, G, M and N pay it in full, Plan K pays 50 % and Plan L 75 %. With those plans, the drug copays and respite coinsurance above can drop to zero or be halved.</p>
<h2>Where care takes place</h2>
<p>Hospice care is usually given at home or in the facility where you live, such as an assisted living facility or a nursing home. Under certain conditions it can be given in an inpatient hospice facility. If the hospice team decides you need hospital inpatient care, it must arrange the stay; otherwise you might pay the entire cost of the hospital care. The hospice provider must tell you if any drug or service is not covered and why, and whether you will be required to pay for it. Coverage rules come from the ${h.cov('hospice', 'medicare.gov hospice page')}.</p>
<h2>Questions for the hospice team</h2>
<p>Ask for the addendum to your election statement that lists the items, services and drugs the hospice will not cover because it considers them unrelated to your terminal illness; if your coverage changes, the hospice gives you an updated one. Ask which of your current prescriptions it will provide, and at what copay. If you live in a nursing home, ask who will bill the room and board. And before any trip to an emergency room or any ambulance ride, call the hospice team first, so that the care is arranged by it.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-hospicio', nav: 'Cuidados paliativos (hospicio)', card: 'Cuidados al final de la vida en casa o en un centro: lo que no cuesta nada, el copago de medicamentos, el respiro y el alojamiento.',
    title: 'Cuidados paliativos y Medicare 2026: lo gratuito y lo que no',
    description: 'La Parte A de Medicare cubre el hospicio de una enfermedad terminal sin costo, salvo un copago por receta y el 5 % del respiro. No cubre el alojamiento.',
    h1: '¿Medicare cubre los cuidados paliativos (hospicio)?',
    intro: 'Sí, con la Parte A, en un hospicio aprobado por Medicare. Indique el número de recetas al mes: la calculadora da los copagos de medicamentos, el único gasto habitual de los cuidados paliativos cubiertos.',
    resume: (h) => {
      const rx = h.E('hospice', { count: 4 });
      return `La Parte A de Medicare cubre el hospicio, los cuidados al final de la vida para una enfermedad que no tiene cura, cuando el médico del hospicio y su médico habitual, si lo tiene, certifican que usted tiene una enfermedad terminal con una esperanza de vida de 6 meses o menos, acepta los cuidados de confort en lugar del tratamiento para curarla y firma una declaración en la que elige el hospicio. En un hospicio aprobado por Medicare, los cuidados cubiertos no le cuestan nada. Las excepciones son pequeñas pero reales: un copago de hasta ${h.m(h.P.hospice.drugCopayMax)} por cada receta ambulatoria para el dolor y los síntomas, es decir, ${h.m(rx.youPay)} por cuatro recetas, y hasta el ${h.pc(h.P.hospice.respiteCoinsurance)} del monto aprobado por el cuidado de respiro con internación, la estancia corta que permite descansar a quien le cuida. El alojamiento y la comida no se cubren cuando recibe el hospicio en casa, en un hogar de ancianos o en un centro de hospicio, salvo que el equipo organice una internación corta o de respiro. La cobertura dura dos períodos de 90 días y después un número ilimitado de períodos de 60 días, mientras un médico del hospicio vuelva a certificar la enfermedad terminal.`;
    },
    faqs: (h) => [
      { q: '¿Medicare paga el alojamiento y la comida en el hospicio?', a: 'No, cuando recibe los cuidados en casa o vive en un hogar de ancianos o en un centro de hospicio. Si vive en un hogar de ancianos y elige el hospicio, el alojamiento y la comida del hogar pueden seguir a su cargo. Si el equipo del hospicio decide que necesita una internación corta o de respiro que él organiza, Medicare cubre esa estancia.' },
      { q: '¿Puedo seguir con mi médico de siempre en el hospicio?', a: 'Sí, si lo eligió, a él o a una enfermera practicante, como el profesional que ayuda a supervisar sus cuidados paliativos. Toda la atención de la enfermedad terminal debe darla u organizarla el equipo del hospicio, y no puede recibir el mismo tipo de cuidado de otro hospicio salvo que cambie de proveedor, algo que puede hacer una vez en cada período de beneficios.' },
      { q: '¿Medicare sigue pagando los problemas de salud que no tienen relación con la enfermedad terminal?', a: `Sí. Medicare Original sigue pagando los beneficios cubiertos de los problemas de salud que no forman parte de la enfermedad terminal ni de sus afecciones relacionadas, con el deducible y el coseguro habituales, como el deducible de ${h.m(h.PB.deductible)} de la Parte B y el 20 %. Puede pedir al hospicio la lista de lo que considera no relacionado, con sus motivos; debe dársela en 3 a 5 días.` },
      { q: '¿Qué cuidados del hospicio no se cubren?', a: 'El tratamiento para curar la enfermedad terminal, los medicamentos para curarla en lugar de aliviar los síntomas, la atención de un hospicio que el equipo no organizó, y la atención ambulatoria u hospitalaria o la ambulancia que el equipo no organizó, salvo que no tengan relación con la enfermedad terminal. Hable con el equipo del hospicio antes, o podría pagar el costo completo.' },
    ],
    body: (h) => {
      const rows = [1, 4, 8, 15].map((n) => [String(n), h.m(h.E('hospice', { count: n }).youPay), h.m(h.E('hospice', { count: n }).youPay * 3)]);
      return `
<h2>Quién tiene derecho</h2>
<p>Debe tener la Parte A y cumplir tres condiciones: el médico del hospicio y su médico habitual, si lo tiene, certifican que tiene una enfermedad terminal con una esperanza de vida de 6 meses o menos; acepta los cuidados de confort, o paliativos, en lugar del tratamiento para curar la enfermedad; y firma una Declaración de Elección del Hospicio (Hospice Election Statement) en la que elige el hospicio en lugar de otros tratamientos cubiertos por Medicare para la enfermedad terminal y sus afecciones relacionadas. La declaración indica el hospicio, la fecha de inicio y su médico de cabecera, y debe completarse antes de cualquier servicio.</p>
<h2>Períodos de beneficios</h2>
<p>El hospicio se cubre durante dos períodos de 90 días, seguidos de un número ilimitado de períodos de 60 días. Pasados los primeros 6 meses, los cuidados continúan mientras el director médico o un médico del hospicio vuelva a certificar, tras una visita en persona con el médico o la enfermera practicante del hospicio, que la enfermedad sigue siendo terminal. Puede cambiar de hospicio una vez en cada período de beneficios, y puede dejar el hospicio.</p>
<h2>Lo que usted paga</h2>
<ul>
<li><strong>Los cuidados paliativos cubiertos</strong> de un proveedor aprobado por Medicare: 0 $.</li>
<li><strong>Los medicamentos ambulatorios para el dolor y los síntomas</strong>: hasta ${h.m(h.P.hospice.drugCopayMax)} por receta. En el caso poco frecuente de que el beneficio no cubra un medicamento, el hospicio debe consultar con su plan si lo cubre la Parte D.</li>
<li><strong>El cuidado de respiro con internación</strong>: hasta el ${h.pc(h.P.hospice.respiteCoinsurance)} del monto aprobado por Medicare, y nunca más que el deducible de hospitalización, ${h.m(h.PA.inpatientDeductible)} en 2026.</li>
<li><strong>El alojamiento y la comida</strong> donde vive, si es un hogar de ancianos u otro centro: no se cubren.</li>
</ul>
${h.table(['Recetas al mes', 'Lo máximo que paga al mes', 'En 3 meses'], rows, `Con el copago máximo de ${h.m(h.P.hospice.drugCopayMax)} por receta. El equipo del hospicio, las visitas y el equipo médico para la enfermedad terminal no cuestan nada.`, ['r', 'r', 'r'])}
<!--tool:mini:hospiceRx-->
<h2>Medigap</h2>
<p>El cuadro de los planes Medigap estandarizados incluye el coseguro o copago del hospicio de la Parte A: los planes A, B, C, D, F, G, M y N lo pagan por completo, el plan K el 50 % y el L el 75 %. Con esos planes, los copagos de medicamentos y el coseguro de respiro pueden bajar a cero o a la mitad.</p>
<h2>Dónde se dan los cuidados</h2>
<p>Los cuidados paliativos suelen darse en casa o en el lugar donde vive, como una residencia asistida o un hogar de ancianos. En ciertas condiciones pueden darse en un centro de hospicio con internación. Si el equipo decide que necesita una hospitalización, debe organizarla; si no, usted podría pagar el costo completo del hospital. El hospicio debe decirle si algún medicamento o servicio no está cubierto y por qué, y si tendrá que pagarlo. Las reglas salen de la ${h.cov('hospice', 'página de medicare.gov sobre los cuidados paliativos')}.</p>
<h2>Preguntas para el equipo del hospicio</h2>
<p>Pida el anexo de su declaración de elección que enumera los artículos, servicios y medicamentos que el hospicio no cubrirá por considerarlos sin relación con su enfermedad terminal; si su cobertura cambia, el hospicio le entrega uno actualizado. Pregunte cuáles de sus recetas actuales le dará y con qué copago. Si vive en un hogar de ancianos, pregunte quién le facturará el alojamiento y la comida. Y antes de ir a urgencias o de pedir una ambulancia, llame primero al equipo del hospicio, para que sea él quien organice la atención.</p>`;
    },
  },
});
