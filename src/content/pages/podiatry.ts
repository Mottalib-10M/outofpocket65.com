import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'podiatry', group: 'cover', order: 28,
  tool: { kind: 'est', props: { act: 'podiatry-visit', acts: ['podiatry-visit', 'podiatry-nail-care', 'office-visit'] } },
  mini: { kind: 'mini:nailCare' },
  related: ['not-covered', 'part-b', 'wheelchairs', 'deductible', 'home'],
  sources: ['pfs', 'cms_fs2026', 'assignment'],
  acts: ['podiatry-visit'],
  en: {
    slug: 'does-medicare-cover-podiatry', nav: 'Podiatrist and foot care', card: 'Treatment of foot injuries and diseases at 20 %; routine nail, corn and callus care only in rare cases.',
    title: 'Podiatry and Medicare 2026: Covered Foot Care and Your Cost',
    description: 'Medicare Part B covers a podiatrist for medically necessary care of foot injuries and diseases, at 20 %. Routine care, like nail trimming, is rarely covered.',
    h1: 'Does Medicare cover a podiatrist?',
    intro: 'Yes, when the visit treats a foot injury or disease, under Part B. The estimator prices a podiatrist visit, or nail care in the limited cases Medicare pays for it, with your area.',
    resume: (h) => {
      const v = h.E('podiatry-visit'); const vd = h.E('podiatry-visit', { deductibleRemaining: h.PB.deductible }); const n = h.E('podiatry-nail-care');
      return `Medicare Part B covers foot exams and treatment by a podiatrist, a foot doctor, when you need medically necessary treatment for a foot injury or disease, such as hammer toe, bunion deformities or heel spurs. After the ${h.m(h.PB.deductible)} Part B deductible you pay 20 % of the Medicare-approved amount, and in a hospital outpatient setting you also pay a hospital copayment. A podiatrist office visit for a foot problem is approved at ${h.m(v.approvedTotal)} at national rates in 2026, so it costs you ${h.m(v.youPay)} once the deductible is met, or ${h.m(vd.youPay)} as the first Part B bill of the year. Routine foot care is usually not covered: cutting or removing corns and calluses, trimming, cutting or clipping nails, and hygienic or preventive maintenance such as cleaning and soaking the feet. In most cases you pay all of it. In very limited circumstances Medicare does cover routine foot care, and then you pay 20 % after the deductible: a nail care visit approved at ${h.m(n.approvedTotal)} leaves you ${h.m(n.youPay)}. Ask the podiatrist which part of the visit will be billed to Medicare.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare pay for toenail trimming?', a: `Usually not. Trimming, cutting or clipping nails is routine foot care, which Medicare does not usually cover; in most cases you pay the whole price. In very limited circumstances Medicare covers it, and you then pay 20 % of the approved amount after the deductible, ${h.m(h.E('podiatry-nail-care').youPay)} per visit at national rates. Ask the podiatrist whether your condition qualifies before the visit.` },
      { q: 'Is bunion or heel spur treatment covered?', a: `Yes. Part B covers podiatrist exams and treatment that are medically necessary for foot injuries or diseases, and medicare.gov names hammer toe, bunion deformities and heel spurs as examples. You pay 20 % after the deductible. A podiatrist office visit for such a problem costs you ${h.m(h.E('podiatry-visit').youPay)} at national rates once the deductible is met; surgery or imaging, if needed, is billed separately.` },
      { q: 'Can a podiatrist charge more than the Medicare-approved amount?', a: `Only a podiatrist who does not accept assignment. Medicare then approves 95 % of the fee and the podiatrist may bill up to the limiting charge, 15 % above that amount. On a podiatrist visit that means up to ${h.m(h.E('podiatry-visit', { assignment: false }).excessPart)} more, which Medigap Plans F and G pay. Check whether the office accepts assignment when you book.` },
    ],
    body: (h) => {
      const v = h.E('podiatry-visit'); const n = h.E('podiatry-nail-care'); const np = h.E('podiatry-visit', { assignment: false });
      const man = h.E('podiatry-visit', { locality: h.loc(/^Manhattan$/) }); const al = h.E('podiatry-visit', { locality: h.defaultLocality('AL') });
      const g = h.E('podiatry-visit', { coverage: 'medigap', medigap: 'G' }); const nn = h.E('podiatry-visit', { coverage: 'medigap', medigap: 'N' });
      return `
<h2>Medical foot care versus routine foot care</h2>
<p>The line Medicare draws is between treatment and upkeep. Exams and treatment for foot injuries or diseases are covered as medically necessary services: a painful bunion, a hammer toe, a heel spur, an injury that needs care. Routine foot care is upkeep: corns and calluses cut or removed, nails trimmed, cut or clipped, and hygienic or preventive maintenance like cleaning and soaking your feet. Medicare does not usually cover it.</p>
${h.table(['Visit', 'Covered?', 'Approved', 'You pay'], [
  [h.label('podiatry-visit'), 'Yes', h.m(v.approvedTotal), h.m(v.youPay)],
  [`${h.label('podiatry-visit')}, doctor not accepting assignment`, 'Yes', h.m(np.approvedTotal), h.m(np.youPay)],
  [h.label('podiatry-nail-care'), 'Only in very limited cases', h.m(n.approvedTotal), `${h.m(n.youPay)} if covered`],
  ['Corns, calluses, routine nail trimming', 'Usually not', '–', 'All of it'],
], 'National rates of October 2026, Original Medicare, deductible already met.', ['l', 'l', 'r', 'r'])}
<h2>Your area and your podiatrist</h2>
<p>A podiatrist bills under the physician fee schedule, so the approved amount follows your price area: ${h.m(man.approvedTotal)} for a visit in Manhattan, ${h.m(al.approvedTotal)} in Alabama. A podiatrist who does not accept assignment is approved 95 % of the fee and may bill up to the limiting charge: on our sample visit you pay ${h.m(np.youPay)} instead of ${h.m(v.youPay)}. The ${h.src('assignment', 'medicare.gov page on assignment')} explains how to check.</p>
<!--tool:mini:nailCare-->
<h2>Medigap and Medicare Advantage</h2>
<p>Medigap pays its share of covered foot care. Plan G pays the 20 % and the excess charge, leaving you ${h.m(g.youPay)} on a visit once the deductible is met. Plan N pays the 20 % but may leave a copayment of up to ${h.m(h.P.medigap.planNCopayOfficeMax)} for some office visits (${h.m(nn.youPay)} here) and does not pay the excess charge. Routine foot care that Medicare does not cover is not paid by any Medigap letter. A Medicare Advantage plan sets its own copay for a specialist visit; enter it in the estimator.</p>
<h2>A year of foot care</h2>
<p>Costs add up over visits. Four podiatrist visits for a heel spur in a year cost you ${h.m(h.E('podiatry-visit', { count: 4 }).youPay)} at national rates once the deductible is met, or ${h.m(h.E('podiatry-visit', { count: 4, deductibleRemaining: h.PB.deductible }).youPay)} if they are your first Part B bills of the year. In a hospital outpatient clinic, a hospital copayment is added to each visit. Original Medicare has no yearly cap on the 20 %, so a long course of treatment is where a Medigap policy makes the largest difference.</p>
<h2>Before the visit</h2>
<p>Tell the office why you are coming: a foot injury or disease, or routine care. Ask whether the podiatrist accepts assignment, and which services of the visit will be billed to Medicare and which to you. If you get routine nail care at the same visit as a covered treatment, the bill can show a covered line at 20 % and a line you pay in full. Doctors may recommend services Medicare does not cover; ask why, and what Medicare will actually pay. Coverage rules come from the ${h.cov('podiatry-visit', 'medicare.gov foot care page')}.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-podologo', nav: 'Podólogo y cuidado de los pies', card: 'El tratamiento de lesiones y enfermedades del pie al 20 %; uñas, callos y durezas de rutina solo en casos raros.',
    title: 'Podólogo y Medicare 2026: el cuidado de pies que se cubre',
    description: 'La Parte B cubre al podólogo para tratar, si es médicamente necesario, lesiones y enfermedades del pie, al 20 %. La rutina, como cortar uñas, casi no.',
    h1: '¿Medicare cubre el podólogo?',
    intro: 'Sí, cuando la consulta trata una lesión o una enfermedad del pie, con la Parte B. La calculadora pone precio a una consulta con el podólogo, o al cuidado de uñas en los casos limitados que Medicare paga, con su zona.',
    resume: (h) => {
      const v = h.E('podiatry-visit'); const vd = h.E('podiatry-visit', { deductibleRemaining: h.PB.deductible }); const n = h.E('podiatry-nail-care');
      return `La Parte B de Medicare cubre los exámenes y tratamientos de un podólogo, el médico de los pies, cuando necesita un tratamiento médicamente necesario para una lesión o una enfermedad del pie, como el dedo en martillo, los juanetes o los espolones del talón. Después del deducible de ${h.m(h.PB.deductible)} de la Parte B usted paga el 20 % del monto aprobado por Medicare, y en un hospital ambulatorio paga además un copago del hospital. Una consulta con el podólogo por un problema del pie tiene un monto aprobado de ${h.m(v.approvedTotal)} a tarifas nacionales de 2026, así que le cuesta ${h.m(v.youPay)} con el deducible pagado, o ${h.m(vd.youPay)} si es su primera factura de la Parte B del año. El cuidado de rutina de los pies no suele cubrirse: cortar o quitar callos y durezas, recortar o cortar las uñas, y el mantenimiento higiénico o preventivo como lavar y remojar los pies. En la mayoría de los casos lo paga todo usted. En circunstancias muy limitadas Medicare sí cubre ese cuidado, y entonces paga el 20 % tras el deducible: una visita de cuidado de uñas con un monto aprobado de ${h.m(n.approvedTotal)} le deja ${h.m(n.youPay)}. Pregunte al podólogo qué parte de la visita se facturará a Medicare.`;
    },
    faqs: (h) => [
      { q: '¿Medicare paga el corte de las uñas de los pies?', a: `Por lo general no. Recortar o cortar las uñas es cuidado de rutina de los pies, que Medicare no suele cubrir; en la mayoría de los casos usted paga el precio completo. En circunstancias muy limitadas Medicare lo cubre, y entonces paga el 20 % del monto aprobado tras el deducible, ${h.m(h.E('podiatry-nail-care').youPay)} por visita a tarifas nacionales. Pregunte al podólogo si su afección da derecho antes de la cita.` },
      { q: '¿Se cubre el tratamiento de un juanete o un espolón?', a: `Sí. La Parte B cubre los exámenes y tratamientos del podólogo médicamente necesarios para lesiones o enfermedades del pie, y medicare.gov cita como ejemplos el dedo en martillo, los juanetes y los espolones del talón. Usted paga el 20 % tras el deducible. Una consulta con el podólogo por uno de esos problemas le cuesta ${h.m(h.E('podiatry-visit').youPay)} a tarifas nacionales con el deducible pagado; la cirugía o las imágenes, si hacen falta, se facturan aparte.` },
      { q: '¿Un podólogo puede cobrar más que el monto aprobado por Medicare?', a: `Solo un podólogo que no acepta la asignación. Medicare aprueba entonces el 95 % de la tarifa y el podólogo puede cobrar hasta el cargo límite, un 15 % por encima de ese monto. En una consulta eso son hasta ${h.m(h.E('podiatry-visit', { assignment: false }).excessPart)} más, que pagan los planes Medigap F y G. Pregunte si el consultorio acepta la asignación al pedir la cita.` },
    ],
    body: (h) => {
      const v = h.E('podiatry-visit'); const n = h.E('podiatry-nail-care'); const np = h.E('podiatry-visit', { assignment: false });
      const man = h.E('podiatry-visit', { locality: h.loc(/^Manhattan$/) }); const al = h.E('podiatry-visit', { locality: h.defaultLocality('AL') });
      const g = h.E('podiatry-visit', { coverage: 'medigap', medigap: 'G' }); const nn = h.E('podiatry-visit', { coverage: 'medigap', medigap: 'N' });
      return `
<h2>Cuidado médico de los pies frente a cuidado de rutina</h2>
<p>La línea que traza Medicare separa el tratamiento del mantenimiento. Los exámenes y tratamientos de lesiones o enfermedades del pie se cubren como servicios médicamente necesarios: un juanete doloroso, un dedo en martillo, un espolón del talón, una lesión que necesita atención. El cuidado de rutina es mantenimiento: cortar o quitar callos y durezas, recortar o cortar las uñas, y el mantenimiento higiénico o preventivo como lavar y remojar los pies. Medicare no suele cubrirlo.</p>
${h.table(['Visita', '¿Cubierta?', 'Aprobado', 'Usted paga'], [
  [h.label('podiatry-visit'), 'Sí', h.m(v.approvedTotal), h.m(v.youPay)],
  [`${h.label('podiatry-visit')}, sin asignación`, 'Sí', h.m(np.approvedTotal), h.m(np.youPay)],
  [h.label('podiatry-nail-care'), 'Solo en casos muy limitados', h.m(n.approvedTotal), `${h.m(n.youPay)} si se cubre`],
  ['Callos, durezas, corte de uñas de rutina', 'Por lo general no', '–', 'Todo'],
], 'Tarifas nacionales de octubre de 2026, Medicare Original, deducible ya pagado.', ['l', 'l', 'r', 'r'])}
<h2>Su zona y su podólogo</h2>
<p>El podólogo factura según el baremo de médicos, así que el monto aprobado sigue su zona de precios: ${h.m(man.approvedTotal)} por una consulta en Manhattan, ${h.m(al.approvedTotal)} en Alabama. A un podólogo que no acepta la asignación se le aprueba el 95 % de la tarifa y puede cobrar hasta el cargo límite: en nuestra consulta de ejemplo usted paga ${h.m(np.youPay)} en lugar de ${h.m(v.youPay)}. La ${h.src('assignment', 'página de medicare.gov sobre la asignación')} explica cómo comprobarlo.</p>
<!--tool:mini:nailCare-->
<h2>Medigap y Medicare Advantage</h2>
<p>Medigap paga su parte del cuidado de los pies cubierto. El plan G paga el 20 % y el cargo adicional, y le deja ${h.m(g.youPay)} por consulta con el deducible pagado. El plan N paga el 20 % pero puede dejarle un copago de hasta ${h.m(h.P.medigap.planNCopayOfficeMax)} en algunas consultas (${h.m(nn.youPay)} aquí) y no paga el cargo adicional. El cuidado de rutina que Medicare no cubre no lo paga ninguna letra Medigap. Un plan Medicare Advantage fija su propio copago para la consulta con un especialista; escríbalo en la calculadora.</p>
<h2>Un año de cuidado de los pies</h2>
<p>Los costos se suman de visita en visita. Cuatro consultas con el podólogo por un espolón en un año le cuestan ${h.m(h.E('podiatry-visit', { count: 4 }).youPay)} a tarifas nacionales con el deducible pagado, o ${h.m(h.E('podiatry-visit', { count: 4, deductibleRemaining: h.PB.deductible }).youPay)} si son sus primeras facturas de la Parte B del año. En una clínica ambulatoria de hospital se añade un copago del hospital a cada visita. Medicare Original no tiene límite anual para el 20 %, así que un tratamiento largo es donde una póliza Medigap marca más diferencia.</p>
<h2>Antes de la cita</h2>
<p>Diga en el consultorio por qué va: una lesión o enfermedad del pie, o cuidado de rutina. Pregunte si el podólogo acepta la asignación, y qué servicios de la visita se facturarán a Medicare y cuáles a usted. Si en la misma visita recibe cuidado de uñas de rutina y un tratamiento cubierto, la factura puede mostrar una línea cubierta al 20 % y otra que paga entera. Los médicos pueden recomendar servicios que Medicare no cubre; pregunte por qué y qué pagará de verdad Medicare. Las reglas salen de la ${h.cov('podiatry-visit', 'página de medicare.gov sobre el cuidado de los pies')}.</p>`;
    },
  },
});
