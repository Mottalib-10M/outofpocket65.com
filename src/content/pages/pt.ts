import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'pt', group: 'cover', order: 6,
  tool: { kind: 'est', props: { act: 'physical-therapy-session', acts: ['physical-therapy-session', 'physical-therapy-eval'], count: 12 } },
  mini: { kind: 'mini:kx' },
  related: ['knee', 'chiropractic', 'home-health', 'acupuncture', 'deductible', 'home'],
  sources: ['pfs', 'kx', 'medigap', 'partb'],
  acts: ['physical-therapy-session', 'physical-therapy-eval'],
  en: {
    slug: 'does-medicare-cover-physical-therapy', nav: 'Physical therapy', card: 'Evaluation and sessions at 20 %, no yearly cap, and what the KX threshold really means.',
    title: 'Physical Therapy and Medicare 2026: Sessions, KX Threshold',
    description: 'Part B pays for outpatient physical therapy with no yearly cap. See the 2026 price of an evaluation and a session, your 20 % and what the KX threshold does.',
    h1: 'Does Medicare cover physical therapy?',
    intro: 'Yes. Part B pays for medically necessary outpatient physical therapy once a provider certifies you need it, and there is no yearly limit on what Medicare pays. The estimator prices a course of sessions for your area at 2026 rates.',
    resume: (h) => {
      const ev = h.E('physical-therapy-eval');
      const one = h.E('physical-therapy-session');
      const twelve = h.E('physical-therapy-session', { count: 12 });
      const kx = h.P.therapyKxThreshold.ptSlpCombined;
      return `Medicare Part B covers outpatient physical therapy that is medically necessary, after your doctor, a nurse practitioner, a clinical nurse specialist or a physician assistant certifies that you need it, and it sets no limit on how much it pays for that therapy in a calendar year. You pay 20 % of the Medicare-approved amount once the ${h.m(h.PB.deductible)} Part B deductible is met. At national 2026 rates, the first evaluation of moderate complexity is approved ${h.m(ev.approvedTotal)}, so your share is ${h.m(ev.youPay)}, and a typical session of three 15-minute units of exercise is approved ${h.m(one.approvedTotal)}, leaving you ${h.m(one.youPay)}. A course of twelve sessions therefore costs you about ${h.m(twelve.youPay)} on top of the evaluation. The number people often confuse with a cap is the KX threshold: ${h.m(kx)} in 2026 for physical therapy and speech-language pathology combined. Once billed therapy passes it, Medicare keeps paying, but the therapist must add a modifier confirming that the care is still medically necessary and document why. Medigap Plan G pays the 20 % in full after the deductible; prices also vary with the local cost area of the clinic.`;
    },
    faqs: (h) => {
      const kx = h.P.therapyKxThreshold;
      const ev = h.E('physical-therapy-eval').approvedTotal;
      const one = h.E('physical-therapy-session').approvedTotal;
      const n = Math.floor((kx.ptSlpCombined - ev) / one);
      return [
        { q: 'Does Medicare stop paying for physical therapy after a certain amount?', a: `No. The ${h.m(kx.ptSlpCombined)} figure for 2026 is a threshold, not a cap. Above it, your therapist adds the KX modifier to the claim to confirm the therapy remains medically necessary, and keeps the records that support it. Medicare continues to pay its 80 % as long as the care is justified, so the threshold changes the paperwork, not your price.` },
        { q: 'How many sessions fit under the KX threshold?', a: `At national 2026 rates, one evaluation plus about ${h.num(n)} standard sessions stay under the ${h.m(kx.ptSlpCombined)} threshold, if no speech therapy is billed the same year. Speech-language pathology counts toward the same amount, while occupational therapy has its own threshold of ${h.m(kx.ot)}. The mini tool recalculates the count when you enter speech therapy already billed.` },
        { q: 'Who has to certify that I need physical therapy?', a: 'Your doctor or another health care provider, which Medicare says includes a nurse practitioner, a clinical nurse specialist or a physician assistant. The certification is what makes the therapy medically necessary in Medicare\'s eyes. Without it, Part B does not cover the sessions, even when they are given by a licensed physical therapist who accepts Medicare.' },
      ];
    },
    body: (h) => {
      const ev = h.E('physical-therapy-eval');
      const one = h.E('physical-therapy-session');
      const twelve = h.E('physical-therapy-session', { count: 12 });
      const firstEv = h.E('physical-therapy-eval', { deductibleRemaining: h.PB.deductible });
      const firstRun = h.E('physical-therapy-session', { count: 12, deductibleRemaining: Math.max(0, h.PB.deductible - firstEv.approvedTotal) });
      const man = h.E('physical-therapy-session', { count: 12, locality: h.loc(/^Manhattan$/) });
      const al = h.E('physical-therapy-session', { count: 12, locality: h.defaultLocality('AL') });
      const g = h.E('physical-therapy-session', { count: 12, coverage: 'medigap', medigap: 'G' });
      const k = h.E('physical-therapy-session', { count: 12, coverage: 'medigap', medigap: 'K' });
      const kx = h.P.therapyKxThreshold.ptSlpCombined;
      return `
<h2>What Part B pays for</h2>
<p>Physical therapy, in Medicare's words, helps restore or improve movement after an injury, an illness or surgery, and can also help maintain your current function or slow a decline. That last part matters: therapy does not have to promise a full recovery to be covered. What it needs is a provider's certification that it is medically necessary, and an outpatient setting such as a therapist's office or clinic.</p>
<h2>Evaluation first, then sessions</h2>
<p>A course of therapy starts with an evaluation, billed once, and continues with sessions made of timed units of exercise and hands-on work. The table prices the most common pattern at national 2026 rates: an evaluation of moderate complexity, then sessions of three 15-minute units.</p>
${h.table(['Item', 'Medicare-approved amount', 'Your 20 %'], [
  ['Evaluation, moderate complexity', h.m(ev.approvedTotal), h.m(ev.youPay)],
  ['One session, three 15-minute units', h.m(one.approvedTotal), h.m(one.youPay)],
  ['Twelve sessions', h.m(twelve.approvedTotal), h.m(twelve.youPay)],
], 'Physical therapist in private practice, national rates of the physician fee schedule (October 2026), Part B deductible already met.', ['l', 'r', 'r'])}
<p>If therapy is the first Part B care of your year, the deductible is paid out of the first claims. The evaluation then costs you ${h.m(firstEv.youPay)}, and the twelve sessions that follow ${h.m(firstRun.youPay)}, because what remains of the deductible is taken from them before the 20 % applies.</p>
<h2>The KX threshold, explained without the jargon</h2>
<p>The dollar figure attached to outpatient therapy, ${h.m(kx)} in 2026 for physical therapy and speech-language pathology together, works as a checkpoint. When the year's approved amounts reach it, the therapist must mark each further claim with the KX modifier, a statement that the therapy is still medically necessary, and keep notes that back it up. Occupational therapy has its own threshold of ${h.m(h.P.therapyKxThreshold.ot)}.</p>
<p>For you, nothing changes in price above the threshold: the session is still approved at the same amount and you still pay 20 %. What matters is the therapist's documentation, so a long course of therapy, after a joint replacement for example, is worth discussing with the clinic before the threshold is reached. The mini tool shows how many sessions fit under it.</p>
<!--tool:mini:twenty-->
<h2>Clinic location and supplemental coverage</h2>
<p>The fee for each unit is adjusted to the local cost of running a practice. Twelve sessions with the deductible met cost you ${h.m(man.youPay)} in Manhattan and ${h.m(al.youPay)} in Alabama, against ${h.m(twelve.youPay)} at national rates. Choose your state and price area in the estimator to see the figure for your clinic.</p>
<p>A Medigap policy changes the share far more than location does. Plan G pays all of the 20 %, which brings the twelve sessions to ${h.m(g.youPay)} once the deductible is met. Plan K pays half, leaving ${h.m(k.youPay)}. With a Medicare Advantage plan, the plan sets its own cost sharing, at least as broad in coverage as Original Medicare; enter your plan's figures in the estimator.</p>
<h2>Therapy at home is a separate benefit</h2>
<p>If you are homebound and receive physical therapy from a Medicare-certified home health agency, the visits fall under the ${h.a('home-health', 'home health benefit')}, and you pay nothing for them. The 20 % described on this page applies to outpatient therapy, the kind you travel to.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-fisioterapia', nav: 'Fisioterapia', card: 'Evaluación y sesiones al 20 %, sin tope anual, y lo que significa de verdad el umbral KX.',
    title: 'Fisioterapia y Medicare 2026: sesiones, umbral KX y su parte',
    description: 'La Parte B paga la fisioterapia ambulatoria sin tope anual en dólares. Vea el precio 2026 de una evaluación y una sesión, su 20 % y cómo funciona el umbral KX.',
    h1: '¿Medicare cubre la fisioterapia?',
    intro: 'Sí. La Parte B paga la fisioterapia ambulatoria médicamente necesaria cuando un proveedor certifica que la necesita, y no hay límite anual a lo que paga Medicare. La calculadora pone precio a una serie de sesiones en su zona con las tarifas de 2026.',
    resume: (h) => {
      const ev = h.E('physical-therapy-eval');
      const one = h.E('physical-therapy-session');
      const twelve = h.E('physical-therapy-session', { count: 12 });
      const kx = h.P.therapyKxThreshold.ptSlpCombined;
      return `La Parte B de Medicare cubre la fisioterapia ambulatoria médicamente necesaria, una vez que su médico, una enfermera practicante, un especialista en enfermería clínica o un asistente médico certifica que la necesita, y no fija ningún límite a lo que paga por esa terapia en un año calendario. Usted paga el 20 % del monto aprobado por Medicare cuando ya cubrió el deducible de la Parte B de ${h.m(h.PB.deductible)}. Con las tarifas nacionales de 2026, la primera evaluación de complejidad moderada tiene un monto aprobado de ${h.m(ev.approvedTotal)}, de modo que su parte es de ${h.m(ev.youPay)}, y una sesión típica de tres unidades de ejercicio de 15 minutos tiene un monto aprobado de ${h.m(one.approvedTotal)} y le deja ${h.m(one.youPay)}. Una serie de doce sesiones le cuesta así unos ${h.m(twelve.youPay)} además de la evaluación. La cifra que muchos toman por un tope es el umbral KX: ${h.m(kx)} en 2026 para fisioterapia y patología del habla juntas. Cuando la terapia facturada lo supera, Medicare sigue pagando, pero el terapeuta debe añadir un modificador que confirme que la atención sigue siendo médicamente necesaria y documentar el motivo. El Plan G de Medigap paga todo el 20 % tras el deducible; los precios también cambian según la zona de costos de la clínica.`;
    },
    faqs: (h) => {
      const kx = h.P.therapyKxThreshold;
      const ev = h.E('physical-therapy-eval').approvedTotal;
      const one = h.E('physical-therapy-session').approvedTotal;
      const n = Math.floor((kx.ptSlpCombined - ev) / one);
      return [
        { q: '¿Medicare deja de pagar la fisioterapia a partir de cierto monto?', a: `No. La cifra de ${h.m(kx.ptSlpCombined)} de 2026 es un umbral, no un tope. Por encima, su terapeuta añade el modificador KX a la reclamación para confirmar que la terapia sigue siendo médicamente necesaria, y guarda los registros que lo respaldan. Medicare sigue pagando su 80 % mientras la atención esté justificada, así que el umbral cambia los papeles, no su precio.` },
        { q: '¿Cuántas sesiones caben por debajo del umbral KX?', a: `Con las tarifas nacionales de 2026, una evaluación y unas ${h.num(n)} sesiones estándar quedan por debajo del umbral de ${h.m(kx.ptSlpCombined)}, si ese año no se factura terapia del habla. La patología del habla cuenta para el mismo monto, mientras que la terapia ocupacional tiene su propio umbral de ${h.m(kx.ot)}. La minicalculadora rehace la cuenta cuando usted escribe la terapia del habla ya facturada.` },
        { q: '¿Quién tiene que certificar que necesito fisioterapia?', a: 'Su médico u otro proveedor de salud, que según Medicare incluye a una enfermera practicante, un especialista en enfermería clínica o un asistente médico. La certificación es lo que hace que la terapia sea médicamente necesaria a ojos de Medicare. Sin ella, la Parte B no cubre las sesiones, aunque las dé un fisioterapeuta con licencia que acepte Medicare.' },
      ];
    },
    body: (h) => {
      const ev = h.E('physical-therapy-eval');
      const one = h.E('physical-therapy-session');
      const twelve = h.E('physical-therapy-session', { count: 12 });
      const firstEv = h.E('physical-therapy-eval', { deductibleRemaining: h.PB.deductible });
      const firstRun = h.E('physical-therapy-session', { count: 12, deductibleRemaining: Math.max(0, h.PB.deductible - firstEv.approvedTotal) });
      const man = h.E('physical-therapy-session', { count: 12, locality: h.loc(/^Manhattan$/) });
      const al = h.E('physical-therapy-session', { count: 12, locality: h.defaultLocality('AL') });
      const g = h.E('physical-therapy-session', { count: 12, coverage: 'medigap', medigap: 'G' });
      const k = h.E('physical-therapy-session', { count: 12, coverage: 'medigap', medigap: 'K' });
      const kx = h.P.therapyKxThreshold.ptSlpCombined;
      return `
<h2>Lo que paga la Parte B</h2>
<p>La fisioterapia, según Medicare, ayuda a recuperar o mejorar el movimiento después de una lesión, una enfermedad o una cirugía, y también puede servir para mantener su función actual o frenar un deterioro. Ese último punto importa: la terapia no tiene que prometer una recuperación completa para estar cubierta. Lo que necesita es la certificación de un proveedor de que es médicamente necesaria y un entorno ambulatorio, como el consultorio o la clínica de un terapeuta.</p>
<h2>Primero la evaluación, luego las sesiones</h2>
<p>Una serie de terapia empieza con una evaluación, que se factura una vez, y sigue con sesiones formadas por unidades de tiempo de ejercicio y trabajo manual. La tabla pone precio al esquema más común con las tarifas nacionales de 2026: una evaluación de complejidad moderada y luego sesiones de tres unidades de 15 minutos.</p>
${h.table(['Concepto', 'Monto aprobado por Medicare', 'Su 20 %'], [
  ['Evaluación, complejidad moderada', h.m(ev.approvedTotal), h.m(ev.youPay)],
  ['Una sesión, tres unidades de 15 minutos', h.m(one.approvedTotal), h.m(one.youPay)],
  ['Doce sesiones', h.m(twelve.approvedTotal), h.m(twelve.youPay)],
], 'Fisioterapeuta en consulta privada, tarifas nacionales del baremo de médicos (octubre de 2026), deducible de la Parte B ya pagado.', ['l', 'r', 'r'])}
<p>Si la terapia es su primera atención de la Parte B en el año, el deducible se paga con las primeras reclamaciones. La evaluación le cuesta entonces ${h.m(firstEv.youPay)}, y las doce sesiones siguientes ${h.m(firstRun.youPay)}, porque lo que queda del deducible se descuenta de ellas antes de aplicar el 20 %.</p>
<h2>El umbral KX, explicado sin tecnicismos</h2>
<p>La cifra en dólares ligada a la terapia ambulatoria, ${h.m(kx)} en 2026 para la fisioterapia y la patología del habla juntas, funciona como un punto de control. Cuando los montos aprobados del año la alcanzan, el terapeuta debe marcar cada reclamación siguiente con el modificador KX, que declara que la terapia sigue siendo médicamente necesaria, y conservar notas que lo justifiquen. La terapia ocupacional tiene su propio umbral de ${h.m(h.P.therapyKxThreshold.ot)}.</p>
<p>Para usted, el precio no cambia por encima del umbral: la sesión sigue con el mismo monto aprobado y usted sigue pagando el 20 %. Lo que cuenta es la documentación del terapeuta, así que conviene hablar con la clínica de una terapia larga, por ejemplo tras un reemplazo de articulación, antes de llegar al umbral. La minicalculadora muestra cuántas sesiones caben por debajo.</p>
<!--tool:mini:twenty-->
<h2>La ubicación de la clínica y la cobertura complementaria</h2>
<p>La tarifa de cada unidad se ajusta al costo local de mantener un consultorio. Doce sesiones con el deducible pagado le cuestan ${h.m(man.youPay)} en Manhattan y ${h.m(al.youPay)} en Alabama, frente a ${h.m(twelve.youPay)} a tarifa nacional. Elija su estado y su zona en la calculadora para ver la cifra de su clínica.</p>
<p>Una póliza Medigap cambia su parte mucho más que la ubicación. El Plan G paga todo el 20 %, lo que deja las doce sesiones en ${h.m(g.youPay)} con el deducible pagado. El Plan K paga la mitad y le deja ${h.m(k.youPay)}. Con un plan Medicare Advantage, el plan fija su propio costo compartido y debe cubrir al menos lo mismo que Medicare Original; escriba las cifras de su plan en la calculadora.</p>
<h2>La terapia en casa es otro beneficio</h2>
<p>Si usted está confinado en casa y recibe fisioterapia de una agencia de salud en el hogar certificada por Medicare, las visitas entran en el ${h.a('home-health', 'beneficio de salud en el hogar')} y no paga nada por ellas. El 20 % de esta página se aplica a la terapia ambulatoria, la que recibe fuera de casa.</p>`;
    },
  },
});
