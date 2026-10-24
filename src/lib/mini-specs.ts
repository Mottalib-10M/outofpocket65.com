/**
 * Page mini-tools (RECETTE §9.3): one subject, one calculation, always through `estimate()`, never a
 * second formula. Each spec is described once, in both languages. Number inputs only (selects carry
 * an index): the MiniSim component stays generic.
 */
import type { MiniSpec } from './mini-types';
import { estimate, actById, PART_B, PART_A, PARAMS, STATES, STATE_NAMES, dmeFee, MEDIGAP_LETTERS, defaultLocality } from './estimate';
import P27 from '../data/params-2027.json';
import { usd, pct } from './format-l';

type Lang = 'en' | 'es';
const yn = (lang: Lang) => [{ value: '0', label: lang === 'es' ? 'No' : 'No' }, { value: '1', label: lang === 'es' ? 'Sí' : 'Yes' }];
const stateOpts = (lang: Lang) => STATES.map((s, i) => ({ value: String(i), label: STATE_NAMES[s][lang] }));
export const stateIdx = (code: string) => Math.max(0, STATES.indexOf(code));
const letterOpts = MEDIGAP_LETTERS.map((l, i) => ({ value: String(i), label: `Plan ${l}` }));
const X = (lang: Lang, en: string, es: string) => (lang === 'es' ? es : en);

const SPECS: Record<string, (lang: Lang) => MiniSpec> = {
  /** Several bills against the yearly Part B deductible. */
  deductible: (lang) => ({
    title: X(lang, 'Your first bills of the year against the deductible', 'Sus primeras facturas del año frente al deducible'), cta: X(lang, 'Price a specific service', 'Calcular un servicio concreto'), ctaPage: 'home',
    inputs: [
      { id: 'b1', label: X(lang, 'First approved amount', 'Primer monto aprobado'), def: 95, unit: '$', max: 100000 },
      { id: 'b2', label: X(lang, 'Second approved amount', 'Segundo monto aprobado'), def: 196, unit: '$', max: 100000 },
      { id: 'b3', label: X(lang, 'Third approved amount', 'Tercer monto aprobado'), def: 1718, unit: '$', max: 100000 },
    ],
    run: (v) => {
      let left = PART_B.deductible; let total = 0; const rows: Array<[string, string]> = [];
      [v.b1, v.b2, v.b3].forEach((b, k) => {
        const d = Math.min(left, b); left -= d; const pay = d + (b - d) * PART_B.coinsurance; total += pay;
        rows.push([X(lang, `Bill ${k + 1}: deductible ${usd(d, lang)}`, `Factura ${k + 1}: deducible ${usd(d, lang)}`), usd(pay, lang)]);
      });
      rows.push([X(lang, 'Deductible left', 'Deducible restante'), usd(left, lang)]);
      return { head: [X(lang, 'You pay for the three', 'Usted paga por las tres'), usd(total, lang)], rows, note: X(lang, `2026 deductible ${usd(PART_B.deductible, lang)}; 2027 amount not yet published by CMS.`, `Deducible 2026 de ${usd(PART_B.deductible, lang)}; el monto de 2027 aún no lo publica CMS.`) };
    },
  }),
  /** 20 % of an approved amount, with or without assignment. */
  twenty: (lang) => ({
    title: X(lang, 'Your 20% of a Part B bill', 'Su 20 % de una factura de la Parte B'), cta: X(lang, 'Price a service in your area', 'Calcular un servicio en su zona'), ctaPage: 'home',
    inputs: [
      { id: 'amt', label: X(lang, 'Medicare-approved amount', 'Monto aprobado por Medicare'), def: 500, unit: '$', max: 1000000 },
      { id: 'asg', label: X(lang, 'Doctor accepts assignment', 'El médico acepta la asignación'), def: 1, options: yn(lang) },
      { id: 'ded', label: X(lang, 'Deductible met', 'Deducible pagado'), def: 1, options: yn(lang) },
    ],
    run: (v) => {
      const approved = v.asg ? v.amt : v.amt * PARAMS.limitingCharge.nonParticipatingFactor;
      const excess = v.asg ? 0 : v.amt * (PARAMS.limitingCharge.limitingChargeFactorOfFee - PARAMS.limitingCharge.nonParticipatingFactor);
      const d = v.ded ? 0 : Math.min(PART_B.deductible, approved);
      const pay = d + (approved - d) * PART_B.coinsurance + excess;
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(pay, lang)], rows: [[X(lang, 'Approved amount', 'Monto aprobado'), usd(approved, lang)], [X(lang, 'Deductible', 'Deducible'), usd(d, lang)], [X(lang, '20% coinsurance', 'Coseguro del 20 %'), usd((approved - d) * PART_B.coinsurance, lang)], [X(lang, 'Limiting charge above it', 'Cargo límite por encima'), usd(excess, lang)]] };
    },
  }),
  /** Physical therapy visits against the KX threshold. */
  kx: (lang) => ({
    title: X(lang, 'Therapy visits and the KX threshold', 'Sesiones de terapia y el umbral KX'), cta: X(lang, 'Price your sessions where you live', 'Calcular sus sesiones donde vive'), ctaPage: 'pt',
    inputs: [{ id: 'n', label: X(lang, 'Sessions this year', 'Sesiones este año'), def: 24, max: 300 }, { id: 'other', label: X(lang, 'Speech therapy already billed', 'Terapia del habla ya facturada'), def: 0, unit: '$', max: 100000 }],
    run: (v) => {
      const ev = estimate({ act: 'physical-therapy-eval', deductibleRemaining: 0 }).approvedTotal;
      const one = estimate({ act: 'physical-therapy-session', count: 1, deductibleRemaining: 0 }).approvedTotal;
      const total = ev + one * v.n + v.other; const kx = PARAMS.therapyKxThreshold.ptSlpCombined;
      const before = Math.max(0, Math.floor((kx - ev - v.other) / one));
      return { head: [X(lang, 'Billed toward the threshold', 'Facturado hacia el umbral'), usd(total, lang)], rows: [[X(lang, '2026 KX threshold (PT + speech)', 'Umbral KX 2026 (fisioterapia + habla)'), usd(kx, lang)], [X(lang, 'Sessions before it is reached', 'Sesiones antes de alcanzarlo'), String(before)], [X(lang, 'Your 20% (deductible met)', 'Su 20 % (deducible pagado)'), usd(total * PART_B.coinsurance, lang)]], note: X(lang, 'Above the threshold Medicare keeps paying when the therapist documents medical need: it is not a cap.', 'Por encima del umbral Medicare sigue pagando si el terapeuta documenta la necesidad médica: no es un tope.') };
    },
  }),
  /** Capped rental month by month. */
  rental: (lang) => ({
    title: X(lang, 'Rental month by month until you own it', 'Alquiler mes a mes hasta que es suyo'), cta: X(lang, 'Full equipment cost', 'Costo completo del equipo'), ctaPage: 'home',
    inputs: [{ id: 'st', label: X(lang, 'State', 'Estado'), def: stateIdx('FL'), options: stateOpts(lang) }, { id: 'eq', label: X(lang, 'Equipment', 'Equipo'), def: 0, options: ['cpap', 'wheelchair-manual', 'wheelchair-lightweight', 'wheelchair-power'].map((a, i) => ({ value: String(i), label: actById(a).label[lang] })) }],
    run: (v) => {
      const a = ['cpap', 'wheelchair-manual', 'wheelchair-lightweight', 'wheelchair-power'][v.eq];
      const e = estimate({ act: a, state: STATES[v.st], count: 13, deductibleRemaining: 0 });
      return { head: [X(lang, 'Your 20% over 13 months', 'Su 20 % en 13 meses'), usd(e.youPay, lang)], rows: [[X(lang, 'Months 1 to 3, each', 'Meses 1 a 3, cada uno'), usd(Number(e.extra.monthlyFee), lang)], [X(lang, 'Months 4 to 13, each', 'Meses 4 a 13, cada uno'), usd(Number(e.extra.monthly4to13), lang)], [X(lang, 'Approved over 13 months', 'Aprobado en 13 meses'), usd(e.approvedTotal, lang)]], note: X(lang, 'Deductible assumed met. Ownership passes to you after the 13th paid month.', 'Deducible supuesto pagado. El equipo pasa a ser suyo tras el mes 13 pagado.') };
    },
  }),
  /** Skilled nursing days. */
  snfDays: (lang) => ({
    title: X(lang, 'Days in a skilled nursing facility', 'Días en un centro de enfermería especializada'), cta: X(lang, 'With your Medigap plan', 'Con su plan Medigap'), ctaPage: 'snf',
    inputs: [{ id: 'd', label: X(lang, 'Days after the hospital', 'Días después del hospital'), def: 45, max: 400 }, { id: 'pl', label: 'Medigap', def: MEDIGAP_LETTERS.indexOf('G'), options: [{ value: '-1', label: X(lang, 'None', 'Ninguno') }, ...letterOpts] }],
    run: (v) => {
      const e = estimate({ act: 'skilled-nursing', count: v.d, ...(v.pl >= 0 ? { coverage: 'medigap' as const, medigap: MEDIGAP_LETTERS[v.pl] } : {}) });
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay, lang)], rows: [[X(lang, 'Days 21 to 100 billed', 'Días 21 a 100 facturados'), String(e.extra.coinsDays)], [X(lang, 'Daily coinsurance 2026', 'Coseguro diario 2026'), usd(PART_A.snfDaily21to100, lang)], [X(lang, 'Days Medicare does not cover', 'Días que Medicare no cubre'), String(e.extra.uncoveredDays)]] };
    },
  }),
  hospitalDays: (lang) => ({
    title: X(lang, 'A hospital stay under Part A', 'Una hospitalización en la Parte A'), cta: X(lang, 'Add a Medigap plan', 'Añadir un plan Medigap'), ctaPage: 'home',
    inputs: [{ id: 'd', label: X(lang, 'Days in the hospital', 'Días en el hospital'), def: 5, max: 400 }],
    run: (v) => {
      const e = estimate({ act: 'hospital-stay', count: v.d });
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay, lang)], rows: [[X(lang, 'Part A deductible', 'Deducible de la Parte A'), usd(e.partADeductible, lang)], [X(lang, 'Daily coinsurance', 'Coseguro diario'), usd(e.coinsurancePart, lang)], [X(lang, 'Reserve days used', 'Días de reserva usados'), String(e.extra.reserveUsed)]] };
    },
  }),
  /** Screening colonoscopy that becomes a polyp removal. */
  polyp: (lang) => ({
    title: X(lang, 'Screening, polyp removed or diagnostic', 'Detección, pólipo extirpado o diagnóstica'), cta: X(lang, 'Price it in your area', 'Calcular en su zona'), ctaPage: 'colonoscopy',
    inputs: [{ id: 'y', label: X(lang, 'Year', 'Año'), def: 0, options: [{ value: '0', label: '2026' }, { value: '1', label: '2027' }] }, { id: 's', label: X(lang, 'Where', 'Dónde'), def: 0, options: [{ value: '0', label: X(lang, 'Surgery center', 'Centro de cirugía') }, { value: '1', label: X(lang, 'Hospital outpatient', 'Hospital ambulatorio') }] }],
    run: (v) => {
      const s = v.s ? 'hopd' as const : 'asc' as const; const y = v.y ? 2027 as const : 2026 as const;
      const scr = estimate({ act: 'colonoscopy-screening', setting: s }).youPay;
      const pol = estimate({ act: 'colonoscopy-polyp', setting: s, crcYear: y });
      const dia = estimate({ act: 'colonoscopy-diagnostic', setting: s, deductibleRemaining: 0 }).youPay;
      return { head: [X(lang, 'If a polyp is removed', 'Si se extirpa un pólipo'), usd(pol.youPay, lang)], rows: [[X(lang, 'Screening, nothing found', 'Detección sin hallazgos'), usd(scr, lang)], [X(lang, 'Share with a polyp', 'Porcentaje con pólipo'), pct(y === 2027 ? P27.crcScreeningConversion.patientShare : PARAMS.crcScreeningConversion.patientShare, lang)], [X(lang, 'Diagnostic, deductible met', 'Diagnóstica, deducible pagado'), usd(dia, lang)]] };
    },
  }),
  dialysisMonth: (lang) => ({
    title: X(lang, 'Dialysis by the month', 'Diálisis por mes'), cta: X(lang, 'With your coverage', 'Con su cobertura'), ctaPage: 'dialysis',
    inputs: [{ id: 'w', label: X(lang, 'Treatments a week', 'Tratamientos por semana'), def: 3, max: 7 }],
    run: (v) => {
      const n = Math.round(v.w * 52 / 12);
      const e = estimate({ act: 'dialysis', count: n, deductibleRemaining: 0 });
      return { head: [X(lang, 'Your 20% a month', 'Su 20 % al mes'), usd(e.youPay, lang)], rows: [[X(lang, 'Treatments a month', 'Tratamientos al mes'), String(n)], [X(lang, 'Approved a month', 'Aprobado al mes'), usd(e.approvedTotal, lang)], [X(lang, 'Your 20% over 12 months', 'Su 20 % en 12 meses'), usd(e.youPay * 12, lang)]], note: X(lang, `Base rate ${usd(PARAMS.esrd.basePerTreatment, lang)} per treatment before case-mix adjustments.`, `Tarifa base de ${usd(PARAMS.esrd.basePerTreatment, lang)} por tratamiento antes de ajustes.`) };
    },
  }),
  hospiceRx: (lang) => ({
    title: X(lang, 'Hospice drug copays', 'Copagos de medicamentos en cuidados paliativos'), cta: X(lang, 'Hospice costs', 'Costos de los cuidados paliativos'), ctaPage: 'hospice',
    inputs: [{ id: 'n', label: X(lang, 'Prescriptions a month', 'Recetas al mes'), def: 4, max: 60 }, { id: 'm', label: X(lang, 'Months of care', 'Meses de cuidado'), def: 3, max: 60 }],
    run: (v) => {
      const per = estimate({ act: 'hospice', count: v.n }).youPay;
      return { head: [X(lang, 'At most', 'Como máximo'), usd(per * v.m, lang)], rows: [[X(lang, 'Per prescription', 'Por receta'), usd(PARAMS.hospice.drugCopayMax, lang)], [X(lang, 'Per month', 'Por mes'), usd(per, lang)], [X(lang, 'Hospice team, visits, equipment', 'Equipo, visitas, equipo médico'), usd(0, lang)]] };
    },
  }),
  acuCap: (lang) => ({
    title: X(lang, 'Acupuncture sessions in a year', 'Sesiones de acupuntura en un año'), cta: X(lang, 'Price the covered ones', 'Calcular las cubiertas'), ctaPage: 'acupuncture',
    inputs: [{ id: 'n', label: X(lang, 'Sessions you plan', 'Sesiones previstas'), def: 24, max: 200 }, { id: 'imp', label: X(lang, 'Improving after 12', 'Mejora tras 12'), def: 1, options: yn(lang) }, { id: 'pr', label: X(lang, 'Cash price per extra session', 'Precio por sesión extra'), def: 0, unit: '$', max: 10000 }],
    run: (v) => {
      const cap = v.imp ? 20 : 12; const cov = Math.min(cap, v.n);
      const e = estimate({ act: 'acupuncture', count: cov, deductibleRemaining: 0 });
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay + (v.n - cov) * v.pr, lang)], rows: [[X(lang, 'Covered sessions', 'Sesiones cubiertas'), String(cov)], [X(lang, 'Your 20% on them', 'Su 20 % por ellas'), usd(e.youPay, lang)], [X(lang, 'Sessions at your own cost', 'Sesiones a su cargo'), String(v.n - cov)]] };
    },
  }),
  hearing: (lang) => ({
    title: X(lang, 'Hearing aids and the hearing test', 'Audífonos y prueba de audición'), cta: X(lang, 'What Medicare does not cover', 'Lo que no cubre Medicare'), ctaPage: 'not-covered',
    inputs: [{ id: 'p', label: X(lang, 'Price quoted for the pair', 'Precio del par'), def: 0, unit: '$', max: 100000 }, { id: 'al', label: X(lang, 'Advantage hearing allowance', 'Asignación auditiva Advantage'), def: 0, unit: '$', max: 100000 }],
    run: (v) => {
      const test = estimate({ act: 'hearing-exam', deductibleRemaining: 0 });
      return { head: [X(lang, 'Hearing aids: you pay', 'Audífonos: usted paga'), usd(Math.max(0, v.p - v.al), lang)], rows: [[X(lang, 'Original Medicare pays for the aids', 'Medicare Original paga por los audífonos'), usd(0, lang)], [X(lang, 'Diagnostic hearing test, approved', 'Prueba diagnóstica, aprobado'), usd(test.approvedTotal, lang)], [X(lang, 'Your 20% of the test', 'Su 20 % de la prueba'), usd(test.youPay, lang)]] };
    },
  }),
  dental: (lang) => ({
    title: X(lang, 'A dental bill: covered or not?', 'Una factura dental: ¿cubierta o no?'), cta: X(lang, 'What Medicare does not cover', 'Lo que no cubre Medicare'), ctaPage: 'not-covered',
    inputs: [{ id: 'p', label: X(lang, 'Dental bill', 'Factura dental'), def: 0, unit: '$', max: 100000 }, { id: 'lk', label: X(lang, 'Needed before a covered treatment', 'Necesaria antes de un tratamiento cubierto'), def: 0, options: yn(lang) }, { id: 'al', label: X(lang, 'Advantage dental allowance', 'Asignación dental Advantage'), def: 0, unit: '$', max: 100000 }],
    run: (v) => {
      const pay = v.lk ? Math.min(PART_B.deductible, v.p) + Math.max(0, v.p - PART_B.deductible) * PART_B.coinsurance : Math.max(0, v.p - v.al);
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(pay, lang)], rows: [[X(lang, 'Rule applied', 'Regla aplicada'), v.lk ? X(lang, 'Part B, 20% after deductible', 'Parte B, 20 % tras el deducible') : X(lang, 'Not covered, minus allowance', 'No cubierto, menos la asignación')], [X(lang, 'Part B deductible 2026', 'Deducible de la Parte B 2026'), usd(PART_B.deductible, lang)]], note: X(lang, 'Linked care means, for example, an exam before a heart valve replacement or before radiation for head and neck cancer.', 'Atención vinculada significa, por ejemplo, un examen antes de un reemplazo de válvula cardíaca o de radioterapia de cabeza y cuello.') };
    },
  }),
  glasses: (lang) => ({
    title: X(lang, 'Glasses after cataract surgery', 'Anteojos después de la cirugía de cataratas'), cta: X(lang, 'Price the surgery', 'Calcular la cirugía'), ctaPage: 'cataract',
    inputs: [{ id: 'st', label: X(lang, 'State', 'Estado'), def: stateIdx('FL'), options: stateOpts(lang) }, { id: 'fr', label: X(lang, 'Frame you choose', 'Montura que elige'), def: 0, unit: '$', max: 10000 }],
    run: (v) => {
      const st = STATES[v.st]; const frame = dmeFee('V2020', '', st); const e = estimate({ act: 'glasses-after-cataract', state: st, deductibleRemaining: 0 });
      const up = Math.max(0, v.fr - frame);
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay + up, lang)], rows: [[X(lang, 'Approved (frame + 2 lenses)', 'Aprobado (montura + 2 lentes)'), usd(e.approvedTotal, lang)], [X(lang, 'Frame allowance in the state', 'Asignación de montura del estado'), usd(frame, lang)], [X(lang, 'Upgrade above it', 'Mejora por encima'), usd(up, lang)]] };
    },
  }),
  ambMiles: (lang) => ({
    title: X(lang, 'An ambulance ride by distance', 'Un traslado en ambulancia según la distancia'), cta: X(lang, 'Your price area', 'Su zona de precios'), ctaPage: 'ambulance',
    inputs: [{ id: 'mi', label: X(lang, 'Loaded miles', 'Millas con paciente'), def: 12, unit: 'mi', max: 500 }, { id: 'ty', label: X(lang, 'Level', 'Nivel'), def: 0, options: [{ value: '0', label: X(lang, 'Basic life support', 'Soporte vital básico') }, { value: '1', label: X(lang, 'Advanced, level 1', 'Avanzado, nivel 1') }, { value: '2', label: X(lang, 'Scheduled, non-emergency', 'Programado, sin emergencia') }] }, { id: 'r', label: X(lang, 'Rural pickup', 'Recogida rural'), def: 0, options: yn(lang) }],
    run: (v) => {
      const a = ['ambulance-emergency', 'ambulance-als', 'ambulance-nonemergency'][v.ty];
      const e = estimate({ act: a, locality: defaultLocality('FL'), miles: v.mi, area: v.r ? 'rural' : 'urban', deductibleRemaining: 0 });
      return { head: [X(lang, 'Your 20%', 'Su 20 %'), usd(e.youPay, lang)], rows: [[X(lang, 'Base rate', 'Tarifa base'), usd(e.lines[0].approved, lang)], [X(lang, 'Mileage', 'Millas'), usd(e.lines[1].approved, lang)], [X(lang, 'Approved', 'Aprobado'), usd(e.approvedTotal, lang)]], note: X(lang, 'Rest of Florida rates, deductible met; the main tool has every price area.', 'Tarifas del resto de Florida, deducible pagado; la herramienta principal tiene todas las zonas.') };
    },
  }),
  mriPlace: (lang) => ({
    title: X(lang, 'Imaging center or hospital?', '¿Centro de imágenes u hospital?'), cta: X(lang, 'Your area and coverage', 'Su zona y cobertura'), ctaPage: 'mri',
    inputs: [{ id: 'k', label: X(lang, 'MRI', 'Resonancia'), def: 0, options: ['mri-brain', 'mri-lumbar', 'mri-knee'].map((a, i) => ({ value: String(i), label: actById(a).label[lang] })) }],
    run: (v) => {
      const a = ['mri-brain', 'mri-lumbar', 'mri-knee'][v.k];
      const o = estimate({ act: a, setting: 'office', deductibleRemaining: 0 }); const h = estimate({ act: a, setting: 'hopd', deductibleRemaining: 0 });
      return { head: [X(lang, 'Difference for you', 'Diferencia para usted'), usd(h.youPay - o.youPay, lang)], rows: [[X(lang, 'Imaging center: you pay', 'Centro de imágenes: usted paga'), usd(o.youPay, lang)], [X(lang, 'Hospital outpatient: you pay', 'Hospital ambulatorio: usted paga'), usd(h.youPay, lang)]], note: X(lang, 'National rates, deductible met.', 'Tarifas nacionales, deducible pagado.') };
    },
  }),
  mammo: (lang) => ({
    title: X(lang, 'Screening or diagnostic mammogram', 'Mamografía de detección o diagnóstica'), cta: X(lang, 'Price it in your area', 'Calcular en su zona'), ctaPage: 'mammograms',
    inputs: [{ id: 'ded', label: X(lang, 'Deductible left', 'Deducible restante'), def: PART_B.deductible, unit: '$', max: PART_B.deductible }],
    run: (v) => {
      const d = estimate({ act: 'mammogram-diagnostic', deductibleRemaining: v.ded });
      return { head: [X(lang, 'Diagnostic: you pay', 'Diagnóstica: usted paga'), usd(d.youPay, lang)], rows: [[X(lang, 'Screening: you pay', 'Detección: usted paga'), usd(estimate({ act: 'mammogram-screening' }).youPay, lang)], [X(lang, 'Diagnostic, approved', 'Diagnóstica, aprobado'), usd(d.approvedTotal, lang)]] };
    },
  }),
  eyeExam: (lang) => ({
    title: X(lang, 'Which eye exam is covered?', '¿Qué examen de la vista está cubierto?'), cta: X(lang, 'Eye exams in your area', 'Exámenes en su zona'), ctaPage: 'eye-exams',
    inputs: [{ id: 'k', label: X(lang, 'Reason for the exam', 'Motivo del examen'), def: 1, options: [{ value: '0', label: X(lang, 'New glasses (routine)', 'Anteojos nuevos (rutina)') }, { value: '1', label: X(lang, 'Diabetes or eye disease', 'Diabetes o enfermedad ocular') }, { value: '2', label: X(lang, 'Glaucoma, high risk', 'Glaucoma, alto riesgo') }] }, { id: 'p', label: X(lang, 'Routine exam price', 'Precio del examen de rutina'), def: 0, unit: '$', max: 10000 }],
    run: (v) => {
      const e = v.k === 0 ? estimate({ act: 'eye-exam-routine', price: v.p }) : estimate({ act: v.k === 1 ? 'eye-exam-medical' : 'glaucoma-screening', deductibleRemaining: 0 });
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay, lang)], rows: [[X(lang, 'Covered by Part B', 'Cubierto por la Parte B'), v.k === 0 ? 'No' : X(lang, 'Yes', 'Sí')], [X(lang, 'Approved amount', 'Monto aprobado'), v.k === 0 ? '–' : usd(e.approvedTotal, lang)]], note: v.k ? X(lang, 'Deductible met, national rates.', 'Deducible pagado, tarifas nacionales.') : undefined };
    },
  }),
  medigap: (lang) => ({
    title: X(lang, 'What a Medigap letter changes', 'Lo que cambia una letra Medigap'), cta: X(lang, 'Price a service with your plan', 'Calcular un servicio con su plan'), ctaPage: 'home',
    inputs: [{ id: 'pl', label: 'Medigap', def: MEDIGAP_LETTERS.indexOf('G'), options: letterOpts }, { id: 'amt', label: X(lang, 'Approved amount', 'Monto aprobado'), def: 1000, unit: '$', max: 1000000 }],
    run: (v) => {
      const L = MEDIGAP_LETTERS[v.pl]; const pl = (PARAMS.medigap.plans as Record<string, { partBCoins: number; partBDeductible: number }>)[L];
      const d = Math.min(PART_B.deductible, v.amt); const c = (v.amt - d) * PART_B.coinsurance;
      const pays = d * pl.partBDeductible + c * pl.partBCoins;
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(d + c - pays, lang)], rows: [[X(lang, 'Without Medigap', 'Sin Medigap'), usd(d + c, lang)], [X(lang, `Plan ${L} pays`, `El plan ${L} paga`), usd(pays, lang)]], note: X(lang, 'Deductible not met yet. Plan premiums are not included.', 'Deducible aún no pagado. No incluye la prima del plan.') };
    },
  }),
  shingles: (lang) => ({
    title: X(lang, 'Two shingles doses', 'Dos dosis contra la culebrilla'), cta: X(lang, 'Other vaccines and Part B', 'Otras vacunas y la Parte B'), ctaPage: 'part-b',
    inputs: [{ id: 'd', label: X(lang, 'Part D plan', 'Plan Parte D'), def: 1, options: yn(lang) }, { id: 'p', label: X(lang, 'Pharmacy price per dose', 'Precio por dosis'), def: 0, unit: '$', max: 5000 }],
    run: (v) => {
      const e = estimate({ act: 'shingles-vaccine', partD: !!v.d, price: v.p });
      return { head: [X(lang, 'You pay for both doses', 'Usted paga por las dos dosis'), usd(e.youPay * 2, lang)], rows: [[X(lang, 'Per dose', 'Por dosis'), usd(e.youPay, lang)], [X(lang, 'Rule', 'Regla'), v.d ? X(lang, 'Part D, no cost', 'Parte D, sin costo') : X(lang, 'Not covered by Parts A and B', 'No cubierta por las Partes A y B')]] };
    },
  }),
  basket: (lang) => ({
    title: X(lang, 'A year of what Medicare leaves out', 'Un año de lo que Medicare deja fuera'), cta: X(lang, 'Price a covered service', 'Calcular un servicio cubierto'), ctaPage: 'home',
    inputs: [{ id: 'h', label: X(lang, 'Hearing aids', 'Audífonos'), def: 0, unit: '$', max: 100000 }, { id: 'd', label: X(lang, 'Dental work', 'Trabajo dental'), def: 0, unit: '$', max: 100000 }, { id: 'v', label: X(lang, 'Routine eye exam and glasses', 'Examen de la vista y anteojos'), def: 0, unit: '$', max: 100000 }, { id: 'al', label: X(lang, 'Advantage allowances, total', 'Asignaciones Advantage, total'), def: 0, unit: '$', max: 100000 }],
    run: (v) => {
      const sum = v.h + v.d + v.v;
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(Math.max(0, sum - v.al), lang)], rows: [[X(lang, 'Billed', 'Facturado'), usd(sum, lang)], [X(lang, 'Original Medicare pays', 'Medicare Original paga'), usd(0, lang)], [X(lang, 'Allowances', 'Asignaciones'), usd(Math.min(sum, v.al), lang)]] };
    },
  }),
  homeHealth: (lang) => ({
    title: X(lang, 'Home health: visits and equipment', 'Salud en el hogar: visitas y equipo'), cta: X(lang, 'Equipment by state', 'Equipo por estado'), ctaPage: 'wheelchairs',
    inputs: [{ id: 'n', label: X(lang, 'Visits in the episode', 'Visitas en el episodio'), def: 12, max: 500 }, { id: 'eq', label: X(lang, 'Equipment approved amount', 'Monto aprobado del equipo'), def: 0, unit: '$', max: 100000 }, { id: 'ded', label: X(lang, 'Deductible left', 'Deducible restante'), def: 0, unit: '$', max: PART_B.deductible }],
    run: (v) => {
      const d = Math.min(v.ded, v.eq); const eq = d + (v.eq - d) * PART_B.coinsurance;
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(eq, lang)], rows: [[X(lang, 'Nurse and therapist visits', 'Visitas de enfermería y terapia'), usd(0, lang)], [X(lang, 'Equipment (20%)', 'Equipo (20 %)'), usd(eq, lang)]] };
    },
  }),
  chiro: (lang) => ({
    title: X(lang, 'A course of chiropractic care', 'Un tratamiento quiropráctico'), cta: X(lang, 'Price adjustments where you live', 'Calcular los ajustes donde vive'), ctaPage: 'chiropractic',
    inputs: [{ id: 'n', label: X(lang, 'Adjustments', 'Ajustes'), def: 8, max: 200 }, { id: 'x', label: X(lang, 'X-rays and other services billed', 'Radiografías y otros servicios'), def: 0, unit: '$', max: 100000 }],
    run: (v) => {
      const e = estimate({ act: 'chiropractic-adjustment', count: v.n, deductibleRemaining: 0 });
      return { head: [X(lang, 'You pay', 'Usted paga'), usd(e.youPay + v.x, lang)], rows: [[X(lang, 'Adjustments, approved', 'Ajustes, aprobado'), usd(e.approvedTotal, lang)], [X(lang, 'Your 20%', 'Su 20 %'), usd(e.youPay, lang)], [X(lang, 'Not covered, full price', 'No cubierto, precio completo'), usd(v.x, lang)]] };
    },
  }),
  knee: (lang) => ({
    title: X(lang, 'Inpatient or outpatient knee replacement', 'Rodilla: hospitalizado o ambulatorio'), cta: X(lang, 'Your area and plan', 'Su zona y plan'), ctaPage: 'knee',
    inputs: [{ id: 'pl', label: 'Medigap', def: -1, options: [{ value: '-1', label: X(lang, 'None', 'Ninguno') }, ...letterOpts] }],
    run: (v) => {
      const c = v.pl >= 0 ? { coverage: 'medigap' as const, medigap: MEDIGAP_LETTERS[v.pl] } : {};
      const ip = estimate({ act: 'knee-replacement', setting: 'inpatient', deductibleRemaining: 0, ...c }).youPay;
      const op = estimate({ act: 'knee-replacement', setting: 'hopd', deductibleRemaining: 0, ...c }).youPay;
      return { head: [X(lang, 'Inpatient: you pay', 'Hospitalizado: usted paga'), usd(ip, lang)], rows: [[X(lang, 'Hospital outpatient', 'Hospital ambulatorio'), usd(op, lang)], [X(lang, 'Difference', 'Diferencia'), usd(Math.abs(ip - op), lang)]], note: X(lang, 'Part B deductible met, national rates.', 'Deducible de la Parte B pagado, tarifas nacionales.') };
    },
  }),
  cataractTwo: (lang) => ({
    title: X(lang, 'One eye or both in the same year', 'Un ojo o los dos en el mismo año'), cta: X(lang, 'Price it in your area', 'Calcular en su zona'), ctaPage: 'cataract',
    inputs: [{ id: 's', label: X(lang, 'Where', 'Dónde'), def: 0, options: [{ value: '0', label: X(lang, 'Surgery center', 'Centro de cirugía') }, { value: '1', label: X(lang, 'Hospital outpatient', 'Hospital ambulatorio') }] }],
    run: (v) => {
      const s = v.s ? 'hopd' as const : 'asc' as const;
      const first = estimate({ act: 'cataract-surgery', setting: s }); const second = estimate({ act: 'cataract-surgery', setting: s, deductibleRemaining: first.deductibleRemainingAfter });
      return { head: [X(lang, 'Both eyes: you pay', 'Los dos ojos: usted paga'), usd(first.youPay + second.youPay, lang)], rows: [[X(lang, 'First eye', 'Primer ojo'), usd(first.youPay, lang)], [X(lang, 'Second eye', 'Segundo ojo'), usd(second.youPay, lang)]], note: X(lang, 'Deductible paid once, on the first eye.', 'El deducible se paga una vez, con el primer ojo.') };
    },
  }),
  nailCare: (lang) => ({
    title: X(lang, 'Foot care visits in a year', 'Visitas de cuidado de los pies en un año'), cta: X(lang, 'Foot problems and costs', 'Problemas de los pies y costos'), ctaPage: 'podiatry',
    inputs: [{ id: 'n', label: X(lang, 'Nail care visits', 'Visitas de cuidado de uñas'), def: 6, max: 52 }, { id: 'q', label: X(lang, 'Qualifying condition', 'Afección que lo justifica'), def: 1, options: yn(lang) }],
    run: (v) => {
      const one = estimate({ act: 'podiatry-nail-care', deductibleRemaining: 0 });
      return { head: [X(lang, 'Your 20% for the year', 'Su 20 % en el año'), v.q ? usd(one.youPay * v.n, lang) : X(lang, 'Not covered', 'No cubierto')], rows: [[X(lang, 'Approved per visit', 'Aprobado por visita'), usd(one.approvedTotal, lang)], [X(lang, 'Your 20% per visit', 'Su 20 % por visita'), usd(one.youPay, lang)]], note: X(lang, 'Routine nail care is covered only in very limited circumstances; otherwise you pay all of it.', 'El cuidado de uñas de rutina solo se cubre en circunstancias muy limitadas; si no, lo paga todo usted.') };
    },
  }),
  wheelchair: (lang) => ({
    title: X(lang, 'Manual, power or scooter', 'Manual, eléctrica o escúter'), cta: X(lang, 'Rental month by month', 'Alquiler mes a mes'), ctaPage: 'cpap',
    inputs: [{ id: 'st', label: X(lang, 'State', 'Estado'), def: stateIdx('TX'), options: stateOpts(lang) }],
    run: (v) => {
      const st = STATES[v.st]; const f = (a: string) => estimate({ act: a, state: st, count: 13, deductibleRemaining: 0 }).youPay;
      return { head: [X(lang, 'Power chair, your 20%', 'Silla eléctrica, su 20 %'), usd(f('wheelchair-power'), lang)], rows: [[X(lang, 'Standard manual (13 months)', 'Manual estándar (13 meses)'), usd(f('wheelchair-manual'), lang)], [X(lang, 'Lightweight manual (13 months)', 'Manual ligera (13 meses)'), usd(f('wheelchair-lightweight'), lang)], [X(lang, 'Scooter (purchase)', 'Escúter (compra)'), usd(f('scooter'), lang)]], note: X(lang, 'Deductible met; non-rural fee schedule.', 'Deducible pagado; baremo no rural.') };
    },
  }),
  covid: (lang) => ({
    title: X(lang, 'COVID-19 tests in a season', 'Pruebas de COVID-19 en una temporada'), cta: X(lang, 'Other covered tests', 'Otras pruebas cubiertas'), ctaPage: 'what-covers',
    inputs: [{ id: 'lab', label: X(lang, 'Lab tests ordered by a provider', 'Pruebas de laboratorio indicadas'), def: 2, max: 50 }, { id: 'home', label: X(lang, 'Home tests bought', 'Pruebas caseras compradas'), def: 0, max: 100 }, { id: 'p', label: X(lang, 'Price of a home test', 'Precio de una prueba casera'), def: 0, unit: '$', max: 1000 }],
    run: (v) => ({ head: [X(lang, 'You pay', 'Usted paga'), usd(v.home * v.p, lang)], rows: [[X(lang, 'Lab tests (Part B)', 'Pruebas de laboratorio (Parte B)'), usd(estimate({ act: 'covid-test' }).youPay * v.lab, lang)], [X(lang, 'Home tests', 'Pruebas caseras'), usd(v.home * v.p, lang)]], note: X(lang, 'Part B covers lab tests ordered by a provider; home tests you buy are counted at the price you type.', 'La Parte B cubre las pruebas de laboratorio indicadas por un proveedor; las pruebas caseras que compra se cuentan al precio que escribe.') }),
  }),
};
export function getSpec(kind: string, lang: Lang): MiniSpec & { ctaPage?: string } {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown mini spec: ${kind}`);
  return f(lang);
}
export const SPEC_KINDS = Object.keys(SPECS);
