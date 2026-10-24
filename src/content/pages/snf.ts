import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'snf', group: 'cover', order: 22,
  tool: { kind: 'est', props: { act: 'skilled-nursing', count: 30, acts: ['skilled-nursing', 'hospital-stay', 'home-health'] } },
  mini: { kind: 'mini:snfDays' },
  related: ['home-health', 'hospice', 'knee', 'what-covers', 'pt', 'home'],
  sources: ['cms_fs2026', 'medigap'],
  acts: ['skilled-nursing', 'hospital-stay'],
  en: {
    slug: 'does-medicare-cover-skilled-nursing-facility', nav: 'Skilled nursing facility', card: 'Rehab after a hospital stay: the 3-day rule, $0 for 20 days, then a daily coinsurance up to day 100.',
    title: 'Skilled Nursing Facility and Medicare 2026: Cost by the Day',
    description: 'Medicare Part A covers a skilled nursing facility after a 3-day inpatient stay: $0 for days 1 to 20, a daily coinsurance from day 21, no coverage after day 100.',
    h1: 'Does Medicare cover a skilled nursing facility?',
    intro: 'Yes, for a limited time after a qualifying hospital stay, under Part A. Enter the number of days: the estimator applies the 2026 daily amounts and, if you choose one, your Medigap plan.',
    resume: (h) => {
      const d30 = h.E('skilled-nursing', { count: 30 }); const d100 = h.E('skilled-nursing', { count: 100 });
      return `Medicare Part A covers care in a skilled nursing facility (SNF) on a short-term basis, after a medically necessary inpatient hospital stay of at least 3 days in a row. The days are counted from the day you were admitted as an inpatient, not including the day you leave; time under observation or in the emergency room before admission does not count, even overnight. In each benefit period of 2026, days 1 to 20 cost you $0 once the Part A deductible is paid, and you do not pay that deductible again if you already paid it for the hospital stay in the same benefit period. Days 21 to 100 cost ${h.m(h.PA.snfDaily21to100)} each, and from day 101 you pay all costs, because Part A limits SNF coverage to 100 days per benefit period. A 30-day stay leaves you ${h.m(d30.youPay)}; the full 100 days, ${h.m(d100.youPay)}. Medigap Plans C, D, F, G, M and N pay that daily coinsurance in full, Plan K half and Plan L three quarters. Medicare Advantage plans may charge copays during the first 20 days.`;
    },
    faqs: (h) => [
      { q: 'Does time under observation count toward the 3-day stay?', a: 'No. Only days as a formally admitted inpatient count, starting with the day of admission and not counting the day of discharge. Hours or nights in the emergency room or under observation before admission are outpatient care and do not count, even if you stayed overnight. Ask the hospital whether you are an inpatient or an outpatient under observation.' },
      { q: 'What does a skilled nursing facility stay include?', a: 'A semi-private room, meals, skilled nursing care, physical and occupational therapy and speech-language pathology when needed for your health goal, medical social services, medications, medical supplies and equipment used in the facility, dietary counseling, and ambulance transportation to the nearest supplier of needed services that are not available at the facility when other transport would endanger your health.' },
      { q: 'How much do 45 days in a skilled nursing facility cost?', a: `With Original Medicare alone, days 1 to 20 cost nothing and days 21 to 45 cost ${h.m(h.PA.snfDaily21to100)} each in 2026, so ${h.m(h.E('skilled-nursing', { count: 45 }).youPay)} in all. Medigap Plan G pays that coinsurance and leaves you ${h.m(h.E('skilled-nursing', { count: 45, coverage: 'medigap', medigap: 'G' }).youPay)}; Plan K pays half and leaves ${h.m(h.E('skilled-nursing', { count: 45, coverage: 'medigap', medigap: 'K' }).youPay)}.` },
    ],
    body: (h) => {
      const days = [10, 20, 21, 30, 45, 60, 100, 120];
      const rows = days.map((d) => { const o = h.E('skilled-nursing', { count: d }); const k = h.E('skilled-nursing', { count: d, coverage: 'medigap', medigap: 'K' }); const g = h.E('skilled-nursing', { count: d, coverage: 'medigap', medigap: 'G' }); return [String(d), h.m(o.youPay), h.m(k.youPay), h.m(g.youPay), String(o.extra.uncoveredDays)]; });
      const hs = h.E('hospital-stay', { count: 4 });
      return `
<h2>The 3-day qualifying stay</h2>
<p>Medicare covers SNF care only after a qualifying inpatient hospital stay: a medically necessary stay of at least 3 days in a row as an admitted inpatient. The hospital part is paid under Part A with its own deductible, ${h.m(h.PA.inpatientDeductible)} per benefit period in 2026, so a 4-day stay before the transfer costs you ${h.m(hs.youPay)}. The nursing facility days then follow in the same benefit period, and the deductible already paid is not charged a second time. Your doctor may not need a 3-day minimum stay in some situations described on the medicare.gov page.</p>
<h2>Day by day in 2026</h2>
${h.table(['Days in the facility', 'Original Medicare only', 'With Medigap K', 'With Medigap G', 'Days not covered'], rows, `Part A deductible already paid for the hospital stay. Daily coinsurance ${h.m(h.PA.snfDaily21to100)} for days 21 to 100. Days beyond 100 are not covered and are billed at the facility's price, not shown here.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The jump comes on day 21: the first 20 days are free, and each day after costs ${h.m(h.PA.snfDaily21to100)}. Over days 21 to 100, that is 80 days and ${h.m(h.E('skilled-nursing', { count: 100 }).youPay)} in all. After day 100 Part A pays nothing more in that benefit period, and the facility bills you its own daily rate.</p>
<!--tool:mini:snfDays-->
<h2>Skilled care, not custodial care</h2>
<p>Skilled care is nursing and therapy that can only be safely and effectively performed by, or under the supervision of, professionals or technical staff: managing and observing your condition, evaluating your care, therapy toward a health goal. A stay that is only help with daily living, without a need for skilled nursing or skilled therapy, is not what this benefit pays for, and non-medical long-term care is on the list of services Original Medicare does not cover.</p>
<h2>Medigap and Medicare Advantage</h2>
<p>The SNF coinsurance is one of the columns of the standardized ${h.src('medigap', 'Medigap chart')}: Plans C, D, F, G, M and N pay 100 % of it, Plan K 50 % and Plan L 75 %, while Plans A and B do not pay it. A Medicare Advantage plan may charge copayments from the first day, including during the first 20 days; its Summary of Benefits gives the amounts and its yearly limit.</p>
<h2>After the facility</h2>
<p>When you go home, care can continue under the ${h.a('home-health', 'home health benefit')} if you qualify, with covered visits at $0, or as outpatient ${h.a('pt', 'physical therapy')} under Part B at 20 %. The 2027 daily coinsurance is not published yet; CMS announces it with the other Part A amounts in mid-November 2026.</p>`;
    },
  },
  es: {
    slug: 'medicare-cubre-centro-de-enfermeria-especializada', nav: 'Centro de enfermería especializada', card: 'Rehabilitación tras el hospital: la regla de 3 días, 0 $ durante 20 días y un coseguro diario hasta el día 100.',
    title: 'Centro de enfermería y Medicare 2026: el costo día por día',
    description: 'La Parte A cubre el centro de enfermería especializada tras 3 días en el hospital: 0 $ los días 1 a 20, coseguro diario desde el 21, sin cobertura tras el 100.',
    h1: '¿Medicare cubre un centro de enfermería especializada?',
    intro: 'Sí, por un tiempo limitado después de una hospitalización que da derecho a ello, con la Parte A. Indique el número de días: la calculadora aplica los montos diarios de 2026 y, si lo elige, su plan Medigap.',
    resume: (h) => {
      const d30 = h.E('skilled-nursing', { count: 30 }); const d100 = h.E('skilled-nursing', { count: 100 });
      return `La Parte A de Medicare cubre la atención en un centro de enfermería especializada (SNF) por un período corto, después de una hospitalización con ingreso médicamente necesaria de al menos 3 días seguidos. Los días se cuentan desde el día del ingreso como paciente hospitalizado, sin contar el día del alta; el tiempo en observación o en urgencias antes del ingreso no cuenta, aunque pase allí la noche. En cada período de beneficios de 2026, los días 1 a 20 le cuestan 0 $ una vez pagado el deducible de la Parte A, y no vuelve a pagar ese deducible si ya lo pagó por la hospitalización en el mismo período. Los días 21 a 100 cuestan ${h.m(h.PA.snfDaily21to100)} cada uno, y desde el día 101 usted paga todo, porque la Parte A limita la cobertura a 100 días por período de beneficios. Una estancia de 30 días le deja ${h.m(d30.youPay)}; los 100 días completos, ${h.m(d100.youPay)}. Los planes Medigap C, D, F, G, M y N pagan todo ese coseguro diario, el plan K la mitad y el L tres cuartas partes. Los planes Medicare Advantage pueden cobrar copagos durante los primeros 20 días.`;
    },
    faqs: (h) => [
      { q: '¿El tiempo en observación cuenta para los 3 días de hospitalización?', a: 'No. Solo cuentan los días como paciente ingresado formalmente, empezando por el día del ingreso y sin contar el día del alta. Las horas o noches en urgencias o en observación antes del ingreso son atención ambulatoria y no cuentan, aunque haya pasado la noche. Pregunte en el hospital si está ingresado o en observación como paciente ambulatorio.' },
      { q: '¿Qué incluye una estancia en un centro de enfermería especializada?', a: 'Una habitación semiprivada, las comidas, la enfermería especializada, la fisioterapia y la terapia ocupacional y del habla cuando son necesarias para su objetivo de salud, los servicios sociales médicos, los medicamentos, los suministros y el equipo médico del centro, la orientación sobre alimentación y la ambulancia al proveedor más cercano de servicios que el centro no ofrece, cuando otro transporte pondría en riesgo su salud.' },
      { q: '¿Cuánto cuestan 45 días en un centro de enfermería especializada?', a: `Con solo Medicare Original, los días 1 a 20 no cuestan nada y los días 21 a 45 cuestan ${h.m(h.PA.snfDaily21to100)} cada uno en 2026, es decir, ${h.m(h.E('skilled-nursing', { count: 45 }).youPay)} en total. El plan Medigap G paga ese coseguro y le deja ${h.m(h.E('skilled-nursing', { count: 45, coverage: 'medigap', medigap: 'G' }).youPay)}; el plan K paga la mitad y le deja ${h.m(h.E('skilled-nursing', { count: 45, coverage: 'medigap', medigap: 'K' }).youPay)}.` },
    ],
    body: (h) => {
      const days = [10, 20, 21, 30, 45, 60, 100, 120];
      const rows = days.map((d) => { const o = h.E('skilled-nursing', { count: d }); const k = h.E('skilled-nursing', { count: d, coverage: 'medigap', medigap: 'K' }); const g = h.E('skilled-nursing', { count: d, coverage: 'medigap', medigap: 'G' }); return [String(d), h.m(o.youPay), h.m(k.youPay), h.m(g.youPay), String(o.extra.uncoveredDays)]; });
      const hs = h.E('hospital-stay', { count: 4 });
      return `
<h2>La hospitalización previa de 3 días</h2>
<p>Medicare cubre el centro de enfermería solo después de una hospitalización que da derecho a ello: una estancia médicamente necesaria de al menos 3 días seguidos como paciente ingresado. La parte del hospital se paga con la Parte A y su propio deducible, ${h.m(h.PA.inpatientDeductible)} por período de beneficios en 2026, así que una estancia de 4 días antes del traslado le cuesta ${h.m(hs.youPay)}. Los días en el centro de enfermería siguen en el mismo período de beneficios, y el deducible ya pagado no se cobra de nuevo. En algunas situaciones descritas en medicare.gov, su médico puede no necesitar ese mínimo de 3 días.</p>
<h2>Día por día en 2026</h2>
${h.table(['Días en el centro', 'Solo Medicare Original', 'Con Medigap K', 'Con Medigap G', 'Días no cubiertos'], rows, `Deducible de la Parte A ya pagado por la hospitalización. Coseguro diario de ${h.m(h.PA.snfDaily21to100)} los días 21 a 100. Los días después del 100 no se cubren y se facturan al precio del centro, que no se muestra aquí.`, ['r', 'r', 'r', 'r', 'r'])}
<p>El salto llega el día 21: los primeros 20 días son gratis, y cada día siguiente cuesta ${h.m(h.PA.snfDaily21to100)}. Del día 21 al 100 son 80 días y ${h.m(h.E('skilled-nursing', { count: 100 }).youPay)} en total. Después del día 100 la Parte A no paga nada más en ese período de beneficios, y el centro le factura su propia tarifa diaria.</p>
<!--tool:mini:snfDays-->
<h2>Atención especializada, no cuidado personal</h2>
<p>La atención especializada es la enfermería y la terapia que solo pueden hacer con seguridad y eficacia profesionales o personal técnico, o bajo su supervisión: tratar y vigilar su afección, evaluar su atención, hacer terapia hacia un objetivo de salud. Una estancia que solo consiste en ayuda con la vida diaria, sin necesidad de enfermería o terapia especializada, no es lo que paga este beneficio, y el cuidado de largo plazo no médico figura en la lista de lo que Medicare Original no cubre.</p>
<h2>Medigap y Medicare Advantage</h2>
<p>El coseguro del centro de enfermería es una de las columnas del ${h.src('medigap', 'cuadro de los planes Medigap')}: los planes C, D, F, G, M y N pagan el 100 %, el plan K el 50 % y el L el 75 %, mientras que los planes A y B no lo pagan. Un plan Medicare Advantage puede cobrar copagos desde el primer día, también durante los primeros 20 días; su Resumen de beneficios da los montos y su límite anual.</p>
<h2>Después del centro</h2>
<p>Al volver a casa, la atención puede seguir con el ${h.a('home-health', 'beneficio de salud en el hogar')} si reúne los requisitos, con visitas cubiertas a 0 $, o como ${h.a('pt', 'fisioterapia')} ambulatoria de la Parte B al 20 %. El coseguro diario de 2027 aún no se publica; CMS lo anuncia con los demás montos de la Parte A a mediados de noviembre de 2026.</p>`;
    },
  },
});
