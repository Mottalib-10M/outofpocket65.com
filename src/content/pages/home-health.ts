import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'home-health', group: 'cover', order: 5,
  tool: { kind: 'est', props: { act: 'home-health', acts: ['home-health', 'wheelchair-manual', 'wheelchair-lightweight'] } },
  mini: { kind: 'mini:homeHealth' },
  related: ['snf', 'hospice', 'wheelchairs', 'pt', 'part-b', 'home'],
  sources: ['dmepos', 'cfr414_229', 'medigap', 'partb'],
  acts: ['home-health', 'wheelchair-manual'],
  en: {
    slug: 'does-medicare-cover-home-health-care', nav: 'Home health care', card: 'Nurse, therapist and aide visits at no cost if you are homebound; the 20 % on equipment.',
    title: 'Home Health Care and Medicare 2026: Who Qualifies and Costs',
    description: 'Medicare pays the full cost of covered home health visits for homebound patients. See the 2026 rules, the hour limits and the 20 % you pay on medical equipment.',
    h1: 'Does Medicare cover home health care?',
    intro: 'Yes, if you are homebound and need part-time skilled care, covered home health visits cost you nothing. Equipment the agency provides is the exception: 20 % after the Part B deductible. The tool shows both lines, with equipment priced on the 2026 fee schedule for your state.',
    resume: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      return `Medicare Part A and Part B cover home health care at no cost to you when four conditions are met: you need part-time or intermittent skilled services, you are homebound, a doctor or another provider such as a nurse practitioner has seen you in person and ordered the care, and a Medicare-certified home health agency provides it. Covered visits include skilled nursing like wound care, injections or monitoring of an unstable condition, physical and occupational therapy, speech-language pathology, medical social services, and home health aide help with bathing or walking while you also receive skilled care. You pay nothing for those visits, and there is no limit on their number while you qualify. Part-time generally means up to 8 hours a day and 28 hours a week of nursing and aide care combined. The one line with a bill is durable medical equipment: after the ${h.m(h.PB.deductible)} Part B deductible you pay 20 % of its approved amount. A standard manual wheelchair rented through the agency in Florida, for example, is approved ${h.m(w.extra.monthlyFee as number)} a month at first, so your share is about ${h.m((w.extra.monthlyFee as number) * h.PB.coinsurance)} a month. Medicare does not pay for round-the-clock care, meal delivery, homemaker services or personal care when that is the only help you need.`;
    },
    faqs: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      return [
        { q: 'What does homebound mean for Medicare home health?', a: 'Two conditions together. First, leaving home is not recommended because of your condition, or you cannot leave without help such as a cane, walker, wheelchair, special transportation or another person. Second, you are normally unable to leave and doing so takes a major effort. You can still leave for medical care, for religious services or for adult day care.' },
        { q: 'Is there a limit on the number of home health visits Medicare pays for?', a: 'No yearly cap on visits exists while you qualify. The limit is on hours: skilled nursing and home health aide care together are generally capped at 8 hours a day and 28 hours a week, and your provider can approve more for a short time, under 8 hours a day and up to 35 a week. Needing more than part-time care ends eligibility.' },
        { q: 'Will Medicare pay for an aide who only helps me bathe and dress?', a: 'Not on its own. Aide care for bathing, grooming, walking or feeding is covered only while you also receive skilled nursing, physical therapy, speech-language pathology or occupational therapy. Custodial or personal care that is the only help you need, homemaker services such as shopping and cleaning, and meal delivery are outside home health coverage.' },
        { q: 'Does Medigap pay the 20 % on equipment the agency brings?', a: `Yes, every standard Medigap letter pays at least part of the Part B coinsurance on durable medical equipment, and Plan G pays all of it once the deductible is met. For a standard manual wheelchair rented in Florida, the 13-month rental is approved ${h.m(w.approvedTotal)} and leaves ${h.m(w.youPay)} without Medigap. Tell the agency about your Medigap policy so the bills go to the right place.` },
      ];
    },
    body: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      const lw = h.E('wheelchair-lightweight', { state: 'FL' });
      const wTx = h.E('wheelchair-manual', { state: 'TX' });
      const first = h.E('wheelchair-manual', { state: 'FL', count: 1, deductibleRemaining: h.PB.deductible });
      return `
<h2>Four conditions, all required</h2>
<p>Home health is one of the few Medicare benefits that costs nothing at the point of care, which is why the entry rules are strict. Each of these must be true:</p>
<ul>
<li>You need part-time or intermittent skilled care: nursing, physical therapy, speech-language pathology, or continuing occupational therapy.</li>
<li>You are homebound, in the sense Medicare gives the word: leaving home is not advised or needs help, and it takes a considerable effort.</li>
<li>A doctor or another provider, such as a nurse practitioner, saw you in person, confirmed the need and ordered the care.</li>
<li>A home health agency certified by Medicare delivers it.</li>
</ul>
<p>Occupational therapy has its own sequence. It must first be ordered together with nursing, physical therapy or speech therapy; after that it can continue alone, even once the other services stop.</p>
<h2>What the agency can bring to your home</h2>
<p>The covered list is broader than nursing alone. It includes wound care for pressure sores or a surgical wound, patient and caregiver education, intravenous or nutrition therapy, injections, and monitoring of a serious illness or unstable health. Therapists can come for physical therapy, occupational therapy and speech-language pathology. Medical social services are covered, as are injectable osteoporosis drugs for women who meet certain criteria, medical supplies for use at home and durable medical equipment.</p>
<p>A home health aide can help with walking, bathing or grooming, changing bed linens and feeding, but only while one of the skilled services is also under way. Staff should visit as often as your provider orders, and the agency keeps the provider informed of your progress.</p>
<h2>Hours, not visits, set the limit</h2>
<p>When you qualify, the number of visits is unlimited. The ceiling is expressed in hours: skilled nursing and aide care combined generally stay within 8 hours a day and 28 hours a week. For a short period your provider can allow more, under 8 hours a day and up to 35 hours a week. Someone who needs more than part-time or intermittent skilled care does not qualify for the benefit, and Medicare never pays for care around the clock at home.</p>
<h2>The equipment line, the only one with a bill</h2>
<p>Durable medical equipment supplied as part of home health follows the usual Part B rule: 20 % of the approved amount after the ${h.m(h.PB.deductible)} deductible. The approved amount comes from the CMS fee schedule for your state. Wheelchairs are rented month by month and become yours after 13 continuous months of payments.</p>
${h.table(['Equipment, 13-month rental', 'First months, each', 'Approved over 13 months', 'You pay'], [
  ['Standard manual wheelchair, Florida', h.m(w.extra.monthlyFee as number), h.m(w.approvedTotal), h.m(w.youPay)],
  ['Lightweight manual wheelchair, Florida', h.m(lw.extra.monthlyFee as number), h.m(lw.approvedTotal), h.m(lw.youPay)],
  ['Standard manual wheelchair, Texas', h.m(wTx.extra.monthlyFee as number), h.m(wTx.approvedTotal), h.m(wTx.youPay)],
], 'DMEPOS fee schedule, October 2026, non-rural rates, Part B deductible already met.', ['l', 'r', 'r', 'r'])}
<p>If the equipment arrives before you have met the deductible, the first month absorbs it: the opening month of a standard manual chair in Florida costs ${h.m(first.youPay)} in that case. The mini tool takes the number of visits, the equipment amount and the deductible you still owe, and shows that visits stay at zero whatever their number.</p>
<h2>What stays outside home health</h2>
<p>Medicare excludes 24-hour care at home, home meal delivery, homemaker services such as shopping and cleaning that are unrelated to your care plan, and custodial or personal care with daily activities like bathing, dressing or using the bathroom when that is the only care you need. Those costs are yours unless other coverage pays them.</p>
<h2>Notices from the agency</h2>
<p>Before care starts, the agency should tell you how much Medicare will pay. It must also tell you, aloud and in writing, about any item or service Medicare will not pay for and what it will cost you, using a notice called the Advance Beneficiary Notice. Your provider should give you a list of agencies serving your area and disclose any financial interest in one of them. With a Medicare Advantage plan, check the plan's own home health rules; with Medigap or other insurance, tell your provider so that bills are sent correctly.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-atencion-medica-en-el-hogar', nav: 'Atención médica en el hogar', card: 'Visitas de enfermería, terapia y auxiliar sin costo si no puede salir de casa; el 20 % del equipo.',
    title: 'Atención médica en el hogar y Medicare 2026: quién califica',
    description: 'Medicare paga todas las visitas de salud en el hogar si usted no puede salir de casa. Vea las reglas de 2026, el límite de horas y el 20 % del equipo médico.',
    h1: '¿Medicare cubre la atención médica en el hogar?',
    intro: 'Sí. Si usted no puede salir de casa sin gran esfuerzo y necesita atención especializada a tiempo parcial, las visitas cubiertas no le cuestan nada. La excepción es el equipo que entrega la agencia: el 20 % después del deducible de la Parte B. La herramienta muestra las dos líneas, con el equipo según el baremo de 2026 de su estado.',
    resume: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      return `Las Partes A y B de Medicare cubren la atención médica en el hogar sin costo para usted cuando se cumplen cuatro condiciones: necesita servicios especializados a tiempo parcial o intermitentes, está confinado en su casa, un médico u otro proveedor, como una enfermera practicante, lo vio en persona y ordenó la atención, y la presta una agencia de salud en el hogar certificada por Medicare. Las visitas cubiertas incluyen enfermería especializada, como el cuidado de heridas, las inyecciones o el control de un estado inestable, fisioterapia y terapia ocupacional, patología del habla y lenguaje, servicios sociales médicos y la ayuda de un auxiliar para bañarse o caminar mientras recibe también atención especializada. Usted no paga nada por esas visitas, y no hay límite en su número mientras siga calificando. Tiempo parcial significa en general hasta 8 horas al día y 28 horas a la semana de enfermería y auxiliar en total. La única línea con factura es el equipo médico duradero: tras el deducible de la Parte B de ${h.m(h.PB.deductible)}, usted paga el 20 % de su monto aprobado. Una silla de ruedas manual estándar alquilada por medio de la agencia en Florida, por ejemplo, tiene un monto aprobado de ${h.m(w.extra.monthlyFee as number)} al mes al principio, así que su parte ronda ${h.m((w.extra.monthlyFee as number) * h.PB.coinsurance)} al mes. Medicare no paga la atención las 24 horas, la entrega de comidas, las tareas domésticas ni el cuidado personal cuando es la única ayuda que usted necesita.`;
    },
    faqs: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      return [
        { q: '¿Qué significa estar confinado en casa para la salud en el hogar de Medicare?', a: 'Dos condiciones a la vez. Primero, no se le recomienda salir por su estado, o no puede salir sin ayuda, como un bastón, un andador, una silla de ruedas, un transporte especial u otra persona. Segundo, normalmente no puede salir y hacerlo le exige un gran esfuerzo. Aun así puede salir para recibir atención médica, ir a servicios religiosos o a una guardería para adultos.' },
        { q: '¿Hay un límite en el número de visitas de salud en el hogar que paga Medicare?', a: 'No hay un tope anual de visitas mientras usted califique. El límite es de horas: la enfermería especializada y el auxiliar juntos llegan en general a 8 horas al día y 28 a la semana, y su proveedor puede aprobar más por poco tiempo, menos de 8 horas al día y hasta 35 a la semana. Necesitar más que atención a tiempo parcial pone fin a la elegibilidad.' },
        { q: '¿Medicare paga un auxiliar que solo me ayude a bañarme y vestirme?', a: 'No por sí solo. La ayuda del auxiliar para bañarse, arreglarse, caminar o comer está cubierta solo mientras usted recibe también enfermería especializada, fisioterapia, patología del habla o terapia ocupacional. El cuidado personal que es la única ayuda que necesita, las tareas domésticas como compras y limpieza, y la entrega de comidas quedan fuera de la cobertura.' },
        { q: '¿Medigap paga el 20 % del equipo que trae la agencia?', a: `Sí. Todas las letras estándar de Medigap pagan al menos una parte del coseguro de la Parte B sobre el equipo médico duradero, y el Plan G lo paga entero una vez cubierto el deducible. Para una silla manual estándar alquilada en Florida, los 13 meses tienen un monto aprobado de ${h.m(w.approvedTotal)} y le dejan ${h.m(w.youPay)} sin Medigap. Informe a la agencia de su póliza Medigap para que las facturas lleguen a donde corresponde.` },
      ];
    },
    body: (h) => {
      const w = h.E('wheelchair-manual', { state: 'FL' });
      const lw = h.E('wheelchair-lightweight', { state: 'FL' });
      const wTx = h.E('wheelchair-manual', { state: 'TX' });
      const first = h.E('wheelchair-manual', { state: 'FL', count: 1, deductibleRemaining: h.PB.deductible });
      return `
<h2>Cuatro condiciones, todas obligatorias</h2>
<p>La salud en el hogar es uno de los pocos beneficios de Medicare que no cuesta nada en el momento de la atención, y por eso las reglas de acceso son estrictas. Todo esto debe cumplirse:</p>
<ul>
<li>Necesita atención especializada a tiempo parcial o intermitente: enfermería, fisioterapia, patología del habla o la continuación de una terapia ocupacional.</li>
<li>Está confinado en su casa, en el sentido que le da Medicare: salir no es aconsejable o necesita ayuda, y le cuesta un esfuerzo considerable.</li>
<li>Un médico u otro proveedor, como una enfermera practicante, lo vio en persona, confirmó la necesidad y ordenó la atención.</li>
<li>La presta una agencia de salud en el hogar certificada por Medicare.</li>
</ul>
<p>La terapia ocupacional sigue un orden propio. Primero debe indicarse junto con enfermería, fisioterapia o terapia del habla; después puede continuar sola, aunque los otros servicios terminen.</p>
<h2>Lo que la agencia puede llevar a su casa</h2>
<p>La lista cubierta va más allá de la enfermería. Incluye el cuidado de úlceras por presión o de una herida quirúrgica, la educación del paciente y de quien lo cuida, la terapia intravenosa o nutricional, las inyecciones y el control de una enfermedad grave o de un estado de salud inestable. Los terapeutas pueden venir para fisioterapia, terapia ocupacional y patología del habla y lenguaje. También están cubiertos los servicios sociales médicos, los medicamentos inyectables contra la osteoporosis para mujeres que cumplen ciertos criterios, los suministros médicos para uso en casa y el equipo médico duradero.</p>
<p>Un auxiliar de salud en el hogar puede ayudarle a caminar, bañarse o arreglarse, cambiar la ropa de cama y comer, pero solo mientras recibe también uno de los servicios especializados. El personal debe visitarlo con la frecuencia que indique su proveedor, y la agencia lo mantiene al tanto de su evolución.</p>
<h2>El límite son las horas, no las visitas</h2>
<p>Si usted califica, el número de visitas no tiene límite. El techo se mide en horas: la enfermería especializada y el auxiliar juntos se mantienen en general dentro de 8 horas al día y 28 horas a la semana. Durante un tiempo corto su proveedor puede permitir más, menos de 8 horas al día y hasta 35 horas a la semana. Quien necesita más que atención especializada a tiempo parcial o intermitente no califica para el beneficio, y Medicare nunca paga atención de día y de noche en casa.</p>
<h2>El equipo, la única línea con factura</h2>
<p>El equipo médico duradero que llega con la salud en el hogar sigue la regla habitual de la Parte B: el 20 % del monto aprobado tras el deducible de ${h.m(h.PB.deductible)}. El monto aprobado sale del baremo de CMS de su estado. Las sillas de ruedas se alquilan mes a mes y pasan a ser suyas tras 13 meses seguidos de pagos.</p>
${h.table(['Equipo, alquiler de 13 meses', 'Primeros meses, cada uno', 'Aprobado en 13 meses', 'Usted paga'], [
  ['Silla manual estándar, Florida', h.m(w.extra.monthlyFee as number), h.m(w.approvedTotal), h.m(w.youPay)],
  ['Silla manual ligera, Florida', h.m(lw.extra.monthlyFee as number), h.m(lw.approvedTotal), h.m(lw.youPay)],
  ['Silla manual estándar, Texas', h.m(wTx.extra.monthlyFee as number), h.m(wTx.approvedTotal), h.m(wTx.youPay)],
], 'Baremo DMEPOS de octubre de 2026, tarifas no rurales, deducible de la Parte B ya pagado.', ['l', 'r', 'r', 'r'])}
<p>Si el equipo llega antes de que haya cubierto el deducible, el primer mes lo absorbe: en ese caso el mes inicial de una silla manual estándar en Florida le cuesta ${h.m(first.youPay)}. La minicalculadora toma el número de visitas, el monto del equipo y el deducible que aún debe, y muestra que las visitas siguen en cero sea cual sea su número.</p>
<h2>Lo que queda fuera de la salud en el hogar</h2>
<p>Medicare excluye la atención las 24 horas en casa, la entrega de comidas a domicilio, las tareas domésticas como compras y limpieza que no forman parte de su plan de atención, y el cuidado personal en actividades diarias como bañarse, vestirse o ir al baño cuando es la única atención que necesita. Esos gastos corren por su cuenta, salvo que otra cobertura los pague.</p>
<h2>Los avisos de la agencia</h2>
<p>Antes de empezar, la agencia debe decirle cuánto pagará Medicare. También debe informarle, de palabra y por escrito, de cualquier artículo o servicio que Medicare no pagará y de su costo para usted, con un aviso llamado Aviso Anticipado al Beneficiario (ABN). Su proveedor debe darle una lista de agencias que atienden su zona e informarle si tiene un interés económico en alguna. Con un plan Medicare Advantage, consulte sus reglas propias de salud en el hogar; con Medigap u otro seguro, avise a su proveedor para que las facturas se envíen bien.</p>`;
    },
  },
});
