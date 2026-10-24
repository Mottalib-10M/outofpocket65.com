import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'acupuncture', group: 'cover', order: 25,
  tool: { kind: 'est', props: { act: 'acupuncture', count: 12, acts: ['acupuncture', 'chiropractic-adjustment', 'physical-therapy-session'] } },
  mini: { kind: 'mini:acuCap' },
  related: ['chiropractic', 'pt', 'not-covered', 'mri', 'home'],
  sources: ['pfs', 'cms_fs2026', 'notcovered'],
  acts: ['acupuncture'],
  en: {
    slug: 'does-medicare-cover-acupuncture', nav: 'Acupuncture', card: 'Only for chronic low back pain: 12 sessions in 90 days, 8 more if you improve, 20 % of each.',
    title: 'Acupuncture and Medicare 2026: Low Back Pain Rule and Cost',
    description: 'Medicare Part B covers acupuncture, dry needling included, only for chronic low back pain: up to 12 sessions in 90 days, 20 a year, and your 20 % of each.',
    h1: 'Does Medicare cover acupuncture?',
    intro: 'Only for chronic low back pain, under Part B. Set the number of sessions: the estimator prices them at the 2026 physician fee schedule rate for your area.',
    resume: (h) => {
      const one = h.E('acupuncture'); const twelve = h.E('acupuncture', { count: 12 }); const twenty = h.E('acupuncture', { count: 20 });
      return `Medicare Part B covers acupuncture, including dry needling, for one condition only: chronic low back pain, meaning pain that has lasted 12 weeks or longer, has no known cause such as cancer that has spread or an inflammatory or infectious disease, and is not linked to surgery or pregnancy. Medicare covers up to 12 treatments in 90 days; if you show improvement, it covers 8 more, for a maximum of 20 in a 12-month period. Without improvement, further sessions are not covered and you pay 100 % of them. Each covered session costs you 20 % of the Medicare-approved amount after the ${h.m(h.PB.deductible)} Part B deductible: a first 15-minute session is approved at ${h.m(one.approvedTotal)} nationally, so ${h.m(one.youPay)} for you; 12 sessions leave you ${h.m(twelve.youPay)} and the full 20, ${h.m(twenty.youPay)}. Medicare cannot pay licensed acupuncturists directly: the treatment must come from a doctor or another provider, such as a nurse practitioner or physician assistant, who holds an accredited master's or doctoral degree in acupuncture or Oriental Medicine and a full state license to practice acupuncture.`;
    },
    faqs: (h) => [
      { q: 'Does Medicare cover acupuncture for neck pain or arthritis?', a: 'No. Part B pays for acupuncture only when it treats chronic low back pain that meets Medicare\'s definition: 12 weeks or longer, no known cause, not associated with surgery or pregnancy. Acupuncture for neck pain, knee arthritis, headaches or any other condition is not covered by Original Medicare, and you pay the full price. Some Medicare Advantage plans offer extra benefits; ask the plan.' },
      { q: 'Can a licensed acupuncturist bill Medicare?', a: 'Not directly. Medicare cannot pay licensed acupuncturists for their services. The treatment has to be given by a doctor or by another health care provider, such as a nurse practitioner or physician assistant, who has both a master\'s or doctoral degree in acupuncture or Oriental Medicine from an accredited school and a current, full, active and unrestricted license to practice acupuncture in your state.' },
      { q: 'What happens after 12 acupuncture sessions?', a: `If your low back pain is improving, Medicare covers 8 more sessions, up to 20 in 12 months; at national rates those 8 add ${h.m(h.E('acupuncture', { count: 8 }).youPay)} to your 20 %. If you are not improving, Medicare stops paying and any further session is entirely yours. Ask the provider to document your progress before the 12th session.` },
    ],
    body: (h) => {
      const man = h.E('acupuncture', { locality: h.loc(/^Manhattan$/) }); const al = h.E('acupuncture', { locality: h.defaultLocality('AL') }); const nat = h.E('acupuncture');
      const rows = [1, 6, 12, 20].map((n) => { const o = h.E('acupuncture', { count: n }); const d = h.E('acupuncture', { count: n, deductibleRemaining: h.PB.deductible }); const g = h.E('acupuncture', { count: n, coverage: 'medigap', medigap: 'G' }); return [String(n), h.m(o.approvedTotal), h.m(o.youPay), h.m(d.youPay), h.m(g.youPay)]; });
      return `
<h2>Who qualifies</h2>
<p>The ${h.cov('acupuncture', 'medicare.gov acupuncture page')} defines chronic low back pain in three parts. It has lasted 12 weeks or longer. It has no known cause: it is not related to cancer that has spread, or to an inflammatory or infectious disease. And it is not associated with surgery or pregnancy. If your back pain fits, Part B pays for acupuncture, dry needling included; if it does not, or if the pain is elsewhere, the sessions are not covered.</p>
<h2>Twelve, then twenty</h2>
<p>The number of covered sessions works in two steps. Up to 12 treatments in 90 days are covered from the start. If you show improvement, 8 more are covered, for a maximum of 20 in a 12-month period. If you are not improving, Medicare does not cover further treatment, and you pay 100 % of any session you continue.</p>
${h.table(['Covered sessions', 'Approved', 'You pay, deductible met', 'You pay, deductible not met', 'With Medigap G'], rows, 'First 15 minutes of each session, national physician fee schedule rate of October 2026, Original Medicare, provider accepting assignment.', ['r', 'r', 'r', 'r', 'r'])}
<!--tool:mini:acuCap-->
<h2>What a session costs where you live</h2>
<p>The approved amount follows the physician fee schedule and its local price areas: one session is approved at ${h.m(man.approvedTotal)} in Manhattan and ${h.m(al.approvedTotal)} in Alabama, against ${h.m(nat.approvedTotal)} at national rates. The amount priced here is the first 15 minutes of a session; a longer session is billed higher, and your 20 % rises with it. Choose your state and area in the estimator to see your own rate.</p>
<h2>Medigap and the twenty sessions</h2>
<p>A Medigap policy pays after Original Medicare on each covered session. Plan G pays the whole 20 % once the deductible is met, so 20 sessions cost you ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'G' }).youPay)}; Plan K pays half, leaving ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'K' }).youPay)}, and Plan L three quarters, leaving ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'L' }).youPay)}. Sessions beyond the covered ones, or for another condition, are not Medicare-approved, so no Medigap letter pays them.</p>
<h2>Who can give the treatment</h2>
<p>Medicare cannot pay licensed acupuncturists directly. A doctor, or another provider such as a nurse practitioner or physician assistant, can be paid if he or she has a master's or doctoral degree in acupuncture or Oriental Medicine from a school accredited by the Accreditation Commission for Acupuncture and Herbal Medicine, and a current, full, active and unrestricted license to practice acupuncture in the state where you are treated. Ask the clinic who will bill Medicare before the first session.</p>
<h2>Back pain care Medicare covers otherwise</h2>
<p>For back pain that does not meet the acupuncture rule, other Part B services follow the usual deductible and 20 %: ${h.a('pt', 'physical therapy')}, a ${h.a('chiropractic', 'chiropractic spine adjustment')} to correct a subluxation, or an ${h.a('mri', 'MRI of the lower back')} when your doctor orders it. Massage therapy is on the list of services Original Medicare does not cover. A Medicare Advantage plan must cover the low back pain acupuncture benefit and may add more; read its Summary of Benefits.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-acupuntura', nav: 'Acupuntura', card: 'Solo para el dolor lumbar crónico: 12 sesiones en 90 días, 8 más si mejora, el 20 % de cada una.',
    title: 'Acupuntura y Medicare 2026: dolor lumbar, sesiones y costo',
    description: 'La Parte B cubre la acupuntura, incluida la punción seca, solo para el dolor lumbar crónico: hasta 12 sesiones en 90 días y 20 al año, con su 20 % de cada una.',
    h1: '¿Medicare cubre la acupuntura?',
    intro: 'Solo para el dolor lumbar crónico, con la Parte B. Indique el número de sesiones: la calculadora les pone precio con la tarifa de 2026 del baremo de médicos de su zona.',
    resume: (h) => {
      const one = h.E('acupuncture'); const twelve = h.E('acupuncture', { count: 12 }); const twenty = h.E('acupuncture', { count: 20 });
      return `La Parte B de Medicare cubre la acupuntura, incluida la punción seca, para una sola afección: el dolor lumbar crónico, es decir, un dolor que dura 12 semanas o más, sin causa conocida como un cáncer que se ha extendido o una enfermedad inflamatoria o infecciosa, y que no está ligado a una cirugía o un embarazo. Medicare cubre hasta 12 sesiones en 90 días; si usted mejora, cubre 8 más, hasta un máximo de 20 en 12 meses. Si no mejora, las sesiones siguientes no se cubren y paga el 100 %. Cada sesión cubierta le cuesta el 20 % del monto aprobado por Medicare después del deducible de ${h.m(h.PB.deductible)} de la Parte B: una primera sesión de 15 minutos tiene un monto aprobado nacional de ${h.m(one.approvedTotal)}, es decir, ${h.m(one.youPay)} para usted; 12 sesiones le dejan ${h.m(twelve.youPay)} y las 20, ${h.m(twenty.youPay)}. Medicare no puede pagar directamente a los acupunturistas con licencia: el tratamiento debe darlo un médico u otro proveedor, como una enfermera practicante o un asistente médico, con un título de maestría o doctorado acreditado en acupuntura o medicina oriental y una licencia estatal plena para practicarla.`;
    },
    faqs: (h) => [
      { q: '¿Medicare cubre la acupuntura para el dolor de cuello o la artritis?', a: 'No. La Parte B paga la acupuntura solo cuando trata un dolor lumbar crónico que cumple la definición de Medicare: 12 semanas o más, sin causa conocida, sin relación con una cirugía o un embarazo. La acupuntura para el cuello, la artritis de rodilla, los dolores de cabeza o cualquier otra afección no la cubre Medicare Original, y usted paga el precio completo. Algunos planes Medicare Advantage ofrecen beneficios adicionales; pregunte a su plan.' },
      { q: '¿Un acupunturista con licencia puede facturar a Medicare?', a: 'No directamente. Medicare no puede pagar a los acupunturistas con licencia por sus servicios. El tratamiento debe darlo un médico u otro proveedor de salud, como una enfermera practicante o un asistente médico, que tenga a la vez un título de maestría o doctorado en acupuntura o medicina oriental de una escuela acreditada y una licencia vigente, plena, activa y sin restricciones para practicar la acupuntura en su estado.' },
      { q: '¿Qué pasa después de 12 sesiones de acupuntura?', a: `Si su dolor lumbar mejora, Medicare cubre 8 sesiones más, hasta 20 en 12 meses; a tarifas nacionales esas 8 suman ${h.m(h.E('acupuncture', { count: 8 }).youPay)} a su 20 %. Si no mejora, Medicare deja de pagar y cada sesión adicional corre por su cuenta. Pida al proveedor que deje constancia de su evolución antes de la sesión 12.` },
    ],
    body: (h) => {
      const man = h.E('acupuncture', { locality: h.loc(/^Manhattan$/) }); const al = h.E('acupuncture', { locality: h.defaultLocality('AL') }); const nat = h.E('acupuncture');
      const rows = [1, 6, 12, 20].map((n) => { const o = h.E('acupuncture', { count: n }); const d = h.E('acupuncture', { count: n, deductibleRemaining: h.PB.deductible }); const g = h.E('acupuncture', { count: n, coverage: 'medigap', medigap: 'G' }); return [String(n), h.m(o.approvedTotal), h.m(o.youPay), h.m(d.youPay), h.m(g.youPay)]; });
      return `
<h2>Quién tiene derecho</h2>
<p>La ${h.cov('acupuncture', 'página de medicare.gov sobre la acupuntura')} define el dolor lumbar crónico en tres partes. Ha durado 12 semanas o más. No tiene causa conocida: no se debe a un cáncer que se ha extendido ni a una enfermedad inflamatoria o infecciosa. Y no está asociado a una cirugía o un embarazo. Si su dolor de espalda cumple esas condiciones, la Parte B paga la acupuntura, también la punción seca; si no, o si el dolor está en otra parte, las sesiones no se cubren.</p>
<h2>Doce, y después veinte</h2>
<p>El número de sesiones cubiertas va en dos pasos. Desde el principio se cubren hasta 12 sesiones en 90 días. Si usted mejora, se cubren 8 más, hasta un máximo de 20 en un período de 12 meses. Si no mejora, Medicare no cubre más tratamiento, y usted paga el 100 % de las sesiones que siga recibiendo.</p>
${h.table(['Sesiones cubiertas', 'Aprobado', 'Usted paga, deducible pagado', 'Usted paga, deducible pendiente', 'Con Medigap G'], rows, 'Primeros 15 minutos de cada sesión, tarifa nacional del baremo de médicos de octubre de 2026, Medicare Original, proveedor que acepta la asignación.', ['r', 'r', 'r', 'r', 'r'])}
<!--tool:mini:acuCap-->
<h2>Lo que cuesta una sesión donde vive</h2>
<p>El monto aprobado sigue el baremo de médicos y sus zonas de precios: una sesión tiene un monto aprobado de ${h.m(man.approvedTotal)} en Manhattan y de ${h.m(al.approvedTotal)} en Alabama, frente a ${h.m(nat.approvedTotal)} a tarifa nacional. El monto calculado aquí son los primeros 15 minutos de una sesión; una sesión más larga se factura más alto y su 20 % sube con ella. Elija su estado y su zona en la calculadora para ver su tarifa.</p>
<h2>Medigap y las veinte sesiones</h2>
<p>Una póliza Medigap paga después de Medicare Original en cada sesión cubierta. El plan G paga todo el 20 % una vez pagado el deducible, así que 20 sesiones le cuestan ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'G' }).youPay)}; el plan K paga la mitad y le deja ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'K' }).youPay)}, y el plan L tres cuartas partes, y le deja ${h.m(h.E('acupuncture', { count: 20, coverage: 'medigap', medigap: 'L' }).youPay)}. Las sesiones que exceden las cubiertas, o por otra afección, no tienen monto aprobado por Medicare, así que ninguna letra Medigap las paga.</p>
<h2>Quién puede dar el tratamiento</h2>
<p>Medicare no puede pagar directamente a los acupunturistas con licencia. Puede pagar a un médico, o a otro proveedor como una enfermera practicante o un asistente médico, si tiene un título de maestría o doctorado en acupuntura o medicina oriental de una escuela acreditada por la Accreditation Commission for Acupuncture and Herbal Medicine, y una licencia vigente, plena, activa y sin restricciones para practicar la acupuntura en el estado donde se le atiende. Pregunte en la clínica quién facturará a Medicare antes de la primera sesión.</p>
<h2>Otros cuidados de la espalda que cubre Medicare</h2>
<p>Para un dolor de espalda que no cumple la regla de la acupuntura, otros servicios de la Parte B siguen el deducible y el 20 % habituales: la ${h.a('pt', 'fisioterapia')}, un ${h.a('chiropractic', 'ajuste quiropráctico de la columna')} para corregir una subluxación, o una ${h.a('mri', 'resonancia lumbar')} cuando la pide su médico. Los masajes figuran en la lista de lo que Medicare Original no cubre. Un plan Medicare Advantage debe cubrir la acupuntura para el dolor lumbar y puede añadir más; consulte su Resumen de beneficios.</p>`;
    },
  },
});
