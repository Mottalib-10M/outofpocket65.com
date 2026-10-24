/**
 * The site's main tool: what one Medicare service costs you (RECETTE §5, §17). Service × place of care
 * × price area × coverage × deductible left → the Medicare-approved amount and your share, line by line.
 * Every figure comes from `lib/estimate.ts` (CMS files of October 2026). First render = page defaults
 * (§17.5); the shared link is read after mount and written only after a user action (§18.1).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import StackedBar from '../ui/StackedBar';
import { estimate, actById, settingsOf, STATES, STATE_NAMES, localitiesOf, defaultLocality, MEDIGAP_LETTERS, PART_B, PART_A, PARAMS, type CoverageKind, type Area, type Estimate } from '../../lib/estimate';
import type { MedigapLetter, Setting } from '../../lib/engine/medicare';
import { usd, pct } from '../../lib/format-l';
import { readParams, num, str, updateURL } from '../../lib/url-state';

type Lang = 'en' | 'es';
export interface EstimatorProps {
  lang?: Lang; acts?: string[]; act?: string; setting?: Setting; state?: string; locality?: string; count?: number; miles?: number;
  price?: number; coverage?: CoverageKind; medigap?: MedigapLetter; deductibleRemaining?: number; partD?: boolean; crcYear?: 2026 | 2027;
  idPrefix?: string; methodHref?: string; title?: string; primary?: boolean;
}

const T = {
  en: {
    title: 'What this service costs you', service: 'Service', where: 'Where it is done', state: 'State', area: 'Price area',
    coverage: 'Your coverage', original: 'Original Medicare only', medigap: (l: string) => `Original Medicare + Medigap Plan ${l}`, advantage: 'Medicare Advantage plan',
    deductible: 'Part B deductible left this year', dedHelp: (m: string) => `${m} in 2026; 0 if you already met it`,
    assignment: 'Doctor accepts assignment', yes: 'Yes', no: 'No', rural: 'Rural ZIP code', areaKind: 'Pickup area', urban: 'Urban', ruralA: 'Rural', superRural: 'Super rural',
    miles: 'Loaded miles to the hospital', price: 'Price you were quoted', priceShingles: 'Pharmacy price of the dose', priceHospice: 'Copay per prescription', allowance: 'Your plan pays (allowance)',
    maCopay: 'Your plan copay for it', maCoins: 'Your plan coinsurance', moop: 'Left under your plan’s yearly limit', partD: 'Part D drug plan', partAPaid: 'Part A deductible already paid this benefit period', crcYear: 'Year of the colonoscopy',
    count: { sessions: 'Sessions', treatments: 'Treatments', months: 'Months of rental', days: 'Days in the stay', prescriptions: 'Prescriptions', units: 'Visits' } as Record<string, string>,
    settings: { office: 'Doctor’s office', asc: 'Surgery center', hopd: 'Hospital outpatient', inpatient: 'Hospital inpatient' } as Record<string, string>,
    youPay: 'You pay', approved: 'Medicare-approved amount', lines: { doctor: 'Doctor’s fee', facilityAsc: 'Surgery center fee', facilityHopd: 'Hospital outpatient fee', equipment: 'Equipment', ambulanceBase: 'Ambulance base rate', ambulanceMiles: 'Mileage', hospital: 'Hospital', snf: 'Facility', dialysis: 'Dialysis treatments', service: 'Service', price: 'Price' } as Record<string, string>,
    dedPart: 'Part B deductible used', coins: 'Your 20 % or copayment', partADed: 'Part A deductible', excess: 'Above the approved amount', medigapPays: 'Medigap pays', medicarePays: 'Medicare pays', dedAfter: 'Deductible left after this', national: 'Same service at national rates',
    barYou: 'You', barMedicare: 'Medicare', barMedigap: 'Medigap', method: 'How this is calculated', notCovered: 'Not covered by Original Medicare',
    summary: 'You pay',
  },
  es: {
    title: 'Lo que le cuesta este servicio', service: 'Servicio', where: 'Dónde se hace', state: 'Estado', area: 'Zona de precios',
    coverage: 'Su cobertura', original: 'Solo Medicare Original', medigap: (l: string) => `Medicare Original + Medigap Plan ${l}`, advantage: 'Plan Medicare Advantage',
    deductible: 'Deducible de la Parte B que le queda', dedHelp: (m: string) => `${m} en 2026; 0 si ya lo pagó`,
    assignment: 'El médico acepta la asignación', yes: 'Sí', no: 'No', rural: 'Código postal rural', areaKind: 'Zona de recogida', urban: 'Urbana', ruralA: 'Rural', superRural: 'Muy rural',
    miles: 'Millas con paciente hasta el hospital', price: 'Precio que le dieron', priceShingles: 'Precio de la dosis en la farmacia', priceHospice: 'Copago por receta', allowance: 'Su plan paga (asignación)',
    maCopay: 'Copago de su plan', maCoins: 'Coseguro de su plan', moop: 'Le queda bajo el límite anual del plan', partD: 'Plan de medicamentos Parte D', partAPaid: 'Deducible de la Parte A ya pagado en este período', crcYear: 'Año de la colonoscopia',
    count: { sessions: 'Sesiones', treatments: 'Tratamientos', months: 'Meses de alquiler', days: 'Días de estancia', prescriptions: 'Recetas', units: 'Visitas' } as Record<string, string>,
    settings: { office: 'Consultorio', asc: 'Centro de cirugía', hopd: 'Hospital ambulatorio', inpatient: 'Hospitalizado' } as Record<string, string>,
    youPay: 'Usted paga', approved: 'Monto aprobado por Medicare', lines: { doctor: 'Honorarios del médico', facilityAsc: 'Tarifa del centro de cirugía', facilityHopd: 'Tarifa del hospital ambulatorio', equipment: 'Equipo', ambulanceBase: 'Tarifa base de la ambulancia', ambulanceMiles: 'Millas', hospital: 'Hospital', snf: 'Centro', dialysis: 'Tratamientos de diálisis', service: 'Servicio', price: 'Precio' } as Record<string, string>,
    dedPart: 'Deducible de la Parte B usado', coins: 'Su 20 % o copago', partADed: 'Deducible de la Parte A', excess: 'Por encima del monto aprobado', medigapPays: 'Medigap paga', medicarePays: 'Medicare paga', dedAfter: 'Deducible restante después', national: 'Mismo servicio a tarifa nacional',
    barYou: 'Usted', barMedicare: 'Medicare', barMedigap: 'Medigap', method: 'Cómo se calcula', notCovered: 'No lo cubre Medicare Original',
    summary: 'Usted paga',
  },
};

/** Which counter an act asks for, and its default. */
function counter(id: string, kind: string): { key: string; def: number; max: number } | null {
  if (kind === 'esrd') return { key: 'treatments', def: 13, max: 31 };
  if (kind === 'partA') return { key: 'days', def: id === 'skilled-nursing' ? 30 : 5, max: 400 };
  if (kind === 'dme' && actById(id).rental) return { key: 'months', def: 13, max: 13 };
  if (id === 'hospice') return { key: 'prescriptions', def: 4, max: 100 };
  if (['physical-therapy-session', 'chiropractic-adjustment', 'acupuncture'].includes(id)) return { key: 'sessions', def: id === 'acupuncture' ? 12 : id === 'chiropractic-adjustment' ? 6 : 10, max: 100 };
  return null;
}

export function ruleText(e: Estimate, lang: Lang): string {
  const m = (v: number) => usd(v, lang); const es = lang === 'es';
  const ded = m(PART_B.deductible);
  switch (e.rule) {
    case 'partB20': return es ? `Parte B: usted paga el deducible anual (${ded} en 2026) y luego el 20 % del monto aprobado.` : `Part B: you pay the yearly deductible (${ded} in 2026), then 20 % of the approved amount.`;
    case 'oppsCopay': return es ? `En un hospital ambulatorio, el copago del hospital es el de CMS para ese servicio, además del 20 % del médico.` : `In a hospital outpatient department, the hospital copayment is the one CMS sets for the service, on top of 20 % of the doctor’s fee.`;
    case 'oppsCap': return es ? `El copago del hospital por un servicio no puede superar el deducible de la Parte A (${m(PART_A.inpatientDeductible)} en 2026): se aplica el tope.` : `The hospital copayment for one service cannot exceed the Part A deductible (${m(PART_A.inpatientDeductible)} in 2026): the cap applies here.`;
    case 'preventive': return es ? 'Servicio preventivo: 0 $ si el médico acepta la asignación. Si se encuentra algo y se trata en el momento, puede haber un costo.' : 'Preventive service: $0 if the provider accepts assignment. If something is found and treated during the visit, a cost can apply.';
    case 'crc': return es ? `Detección convertida en tratamiento: ${pct(Number(e.extra.crcShare), lang)} del monto aprobado, sin deducible (42 CFR 410.152).` : `Screening that turned into treatment: ${pct(Number(e.extra.crcShare), lang)} of the approved amount, with no deductible (42 CFR 410.152).`;
    case 'notCovered': return es ? 'Medicare Original no lo paga: usted paga el precio completo. Medigap tampoco lo cubre.' : 'Original Medicare does not pay for it: you pay the full price. Medigap does not cover it either.';
    case 'partD0': return es ? 'Las vacunas recomendadas por el ACIP no cuestan nada con un plan de la Parte D.' : 'Vaccines recommended by ACIP cost nothing with a Part D drug plan.';
    case 'noPartD': return es ? 'Sin Parte D, Medicare Original no paga esta vacuna: usted paga el precio de la farmacia.' : 'Without Part D, Original Medicare does not pay for this vaccine: you pay the pharmacy price.';
    case 'homeHealth0': return es ? 'Los servicios de salud en el hogar cubiertos no cuestan nada; el equipo médico que entrega la agencia cuesta el 20 %.' : 'Covered home health services cost nothing; medical equipment the agency supplies costs 20 %.';
    case 'hospice': return es ? `Cuidados paliativos: hasta ${m(PARAMS.hospice.drugCopayMax)} por receta para el control de síntomas; el resto no cuesta nada.` : `Hospice: up to ${m(PARAMS.hospice.drugCopayMax)} per prescription for symptom control; everything else costs nothing.`;
    case 'rental': return es ? `Alquiler con tope: tarifa completa los meses 1 a 3, reducida los meses 4 a 13; después de 13 meses el equipo es suyo. Usted paga el 20 %.` : `Capped rental: full fee in months 1 to 3, a lower fee in months 4 to 13; after 13 months the equipment is yours. You pay 20 %.`;
    case 'purchase': return es ? 'Compra al baremo del estado: usted paga el 20 % del monto aprobado después del deducible.' : 'Purchase at your state’s fee schedule: you pay 20 % of the approved amount after the deductible.';
    case 'partAHospital': return es ? `Parte A por período de beneficios: deducible de ${m(PART_A.inpatientDeductible)} (días 1 a 60), ${m(PART_A.hospitalDaily61to90)} por día (61 a 90), ${m(PART_A.lifetimeReserveDaily)} por día de reserva.` : `Part A per benefit period: ${m(PART_A.inpatientDeductible)} deductible (days 1 to 60), ${m(PART_A.hospitalDaily61to90)} a day (61 to 90), ${m(PART_A.lifetimeReserveDaily)} a reserve day.`;
    case 'snf': return es ? `Centro de enfermería tras una hospitalización: días 1 a 20 sin costo, ${m(PART_A.snfDaily21to100)} por día del 21 al 100, todo a partir del día 101.` : `Skilled nursing after a hospital stay: days 1 to 20 at $0, ${m(PART_A.snfDaily21to100)} a day for days 21 to 100, all costs from day 101.`;
    case 'inpatientSurgery': return es ? `Hospitalizado: el deducible de la Parte A cubre el hospital, más el 20 % de los honorarios del cirujano en la Parte B.` : `As an inpatient: the Part A deductible covers the hospital, plus 20 % of the surgeon’s fee under Part B.`;
    case 'advantage': return es ? 'Plan Medicare Advantage: se aplica el copago y el coseguro que usted indicó, con el tope anual de su plan. Revise su resumen de beneficios.' : 'Medicare Advantage: the copay and coinsurance you entered apply, up to your plan’s yearly limit. Check your Summary of Benefits.';
    case 'covid0': return es ? 'Una prueba de laboratorio indicada por su médico no suele costar nada en un proveedor que acepta Medicare.' : 'A lab test your provider orders usually costs nothing at a provider that takes Medicare.';
  }
}

export default function Estimator(props: EstimatorProps) {
  const lang: Lang = props.lang ?? 'en';
  const t = T[lang];
  const acts = props.acts && props.acts.length ? props.acts : [props.act ?? 'cataract-surgery'];
  const id = (k: string) => `${props.idPrefix ?? 'est'}-${k}`;
  const d0 = {
    act: props.act ?? acts[0], setting: props.setting ?? '', state: props.state ?? 'FL', locality: props.locality ?? '',
    count: props.count ?? -1, miles: props.miles ?? 10, price: props.price ?? 0, cov: props.coverage === 'medigap' ? `mg-${props.medigap ?? 'G'}` : props.coverage === 'advantage' ? 'ma' : 'original',
    ded: props.deductibleRemaining ?? PART_B.deductible,
  };
  const [act, setAct] = useState(d0.act);
  const [setting, setSetting] = useState<string>(d0.setting);
  const [state, setState] = useState(d0.state);
  const [locality, setLocality] = useState(d0.locality || defaultLocality(d0.state));
  const [area, setArea] = useState<Area>('urban');
  const [count, setCount] = useState<number>(d0.count);
  const [miles, setMiles] = useState(d0.miles);
  const [price, setPrice] = useState(d0.price);
  const [allowance, setAllowance] = useState(0);
  const [cov, setCov] = useState(d0.cov);
  const [ded, setDed] = useState(d0.ded);
  const [assignment, setAssignment] = useState('yes');
  const [maCopay, setMaCopay] = useState(0);
  const [maCoins, setMaCoins] = useState(20);
  const [moop, setMoop] = useState(5000);
  const [partD, setPartD] = useState(props.partD === false ? 'no' : 'yes');
  const [partAPaid, setPartAPaid] = useState('no');
  const [crcYear, setCrcYear] = useState(String(props.crcYear ?? 2026));

  useEffect(() => {
    const u = readParams(window.location.search);
    const a = str(u, 'a', d0.act); if (acts.includes(a)) setAct(a);
    setSetting(str(u, 's', d0.setting));
    const st = str(u, 'st', d0.state); if (STATE_NAMES[st]) setState(st);
    setLocality(str(u, 'l', d0.locality || defaultLocality(st)));
    setArea(str(u, 'ar', 'urban') as Area); setCount(num(u, 'n', d0.count)); setMiles(num(u, 'mi', d0.miles)); setPrice(num(u, 'p', d0.price));
    setAllowance(num(u, 'al', 0)); setCov(str(u, 'c', d0.cov)); setDed(num(u, 'd', d0.ded)); setAssignment(str(u, 'as', 'yes'));
    setMaCopay(num(u, 'mc', 0)); setMaCoins(num(u, 'mx', 20)); setMoop(num(u, 'mo', 5000));
  }, []);

  const A = actById(act);
  const settings = settingsOf(A);
  const sett = (settings.includes(setting as Setting) ? setting : settings[0]) as Setting | undefined;
  const ctr = counter(act, A.kind);
  const n = ctr ? (count < 0 ? ctr.def : count) : 1;
  const usesLocality = A.kind === 'pfs' || A.kind === 'imaging' || A.kind === 'ambulance' || (A.kind === 'zero' && !!A.screening);
  const usesState = usesLocality || A.kind === 'dme';
  const usesDed = !['notCovered', 'partA', 'zero'].includes(A.kind);
  const covKind: CoverageKind = cov === 'ma' ? 'advantage' : cov.startsWith('mg-') ? 'medigap' : 'original';
  const letter = (cov.startsWith('mg-') ? cov.slice(3) : 'G') as MedigapLetter;
  const locs = localitiesOf(state);
  const loc = locs.some((l) => l.key === locality) ? locality : defaultLocality(state);

  const e = useMemo(() => estimate({
    act, setting: sett, locality: usesLocality ? loc : '', state, area, miles, count: n, coverage: covKind, medigap: letter,
    maCopay, maCoinsurance: maCoins / 100, maRemainingMoop: moop, deductibleRemaining: ded, assignment: assignment === 'yes',
    price: A.id === 'hospice' && price === 0 ? PARAMS.hospice.drugCopayMax : price, allowance, partD: partD === 'yes', partAPaid: partAPaid === 'yes', crcYear: crcYear === '2027' ? 2027 : 2026,
  }), [act, sett, loc, state, area, miles, n, covKind, letter, maCopay, maCoins, moop, ded, assignment, price, allowance, partD, partAPaid, crcYear, usesLocality, A.id]);

  useEffect(() => {
    updateURL({ a: acts.length > 1 ? act : undefined, s: sett, st: usesState ? state : undefined, l: usesLocality ? loc : undefined, ar: area !== 'urban' ? area : undefined,
      n: ctr ? n : undefined, mi: A.kind === 'ambulance' ? miles : undefined, p: price || undefined, al: allowance || undefined, c: cov !== 'original' ? cov : undefined,
      d: ded !== PART_B.deductible ? ded : undefined, as: assignment !== 'yes' ? assignment : undefined, mc: cov === 'ma' ? maCopay : undefined, mx: cov === 'ma' ? maCoins : undefined, mo: cov === 'ma' ? moop : undefined });
  }, [act, sett, state, loc, area, n, miles, price, allowance, cov, ded, assignment, maCopay, maCoins, moop]);

  const m = (v: number) => usd(v, lang);
  const covOptions = [{ value: 'original', label: t.original }, ...MEDIGAP_LETTERS.map((l) => ({ value: `mg-${l}`, label: t.medigap(l) })), { value: 'ma', label: t.advantage }];
  const rows: Array<[string, string]> = [];
  if (A.kind !== 'notCovered' && e.approvedTotal > 0) {
    if (e.lines.length > 1) for (const l of e.lines) rows.push([t.lines[l.key], m(l.approved)]);
    rows.push([t.approved, m(e.approvedTotal)]);
  }
  if (e.partADeductible) rows.push([t.partADed, m(e.partADeductible)]);
  if (e.deductiblePart) rows.push([t.dedPart, m(e.deductiblePart)]);
  if (e.coinsurancePart) rows.push([t.coins, m(e.coinsurancePart)]);
  if (e.excessPart) rows.push([t.excess, m(e.excessPart)]);
  if (covKind === 'medigap' && e.medigapPays) rows.push([t.medigapPays, `− ${m(e.medigapPays)}`]);
  if (e.medicarePays) rows.push([t.medicarePays, m(e.medicarePays)]);
  if (usesDed && covKind !== 'advantage') rows.push([t.dedAfter, m(e.deductibleRemainingAfter)]);
  const barTotal = e.youPay + e.medicarePays + (covKind === 'medigap' ? e.medigapPays : 0);
  const countLabel = ctr ? t.count[ctr.key] : '';
  const dmeRural = A.kind === 'dme';

  return (
    <div data-estimateur className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <p className="text-base font-semibold text-navy-900">{props.title ?? t.title}</p>
      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <form className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(ev) => ev.preventDefault()}>
          {acts.length > 1 && <SelectField id={id('act')} className="sm:col-span-2" label={t.service} value={act} onChange={(v) => { setAct(v); setCount(-1); }} options={acts.map((a) => ({ value: a, label: actById(a).label[lang] }))} />}
          <p className="text-sm text-navy-700 sm:hidden sm:col-span-2" aria-hidden="true">{t.summary}: <strong className="tabular-nums text-navy-900">{m(e.youPay)}</strong></p>
          {settings.length > 1 && <SelectField id={id('setting')} label={t.where} value={sett ?? ''} onChange={setSetting} options={settings.map((s) => ({ value: s, label: t.settings[s] }))} />}
          {ctr && <NumberField id={id('count')} label={countLabel} value={n} onChange={setCount} max={ctr.max} />}
          {A.kind === 'ambulance' && <NumberField id={id('miles')} label={t.miles} value={miles} onChange={setMiles} unit="mi" max={500} />}
          {(A.kind === 'notCovered' || (A.partD && partD === 'no')) && <NumberField id={id('price')} label={A.partD ? t.priceShingles : t.price} value={price} onChange={setPrice} unit="$" max={1000000} />}
          {A.id === 'hospice' && <NumberField id={id('price')} label={t.priceHospice} value={price === 0 ? PARAMS.hospice.drugCopayMax : price} onChange={setPrice} unit="$" max={PARAMS.hospice.drugCopayMax} decimals={0} />}
          {usesState && <SelectField id={id('state')} label={t.state} value={state} onChange={(v) => { setState(v); setLocality(defaultLocality(v)); }} options={STATES.map((s) => ({ value: s, label: STATE_NAMES[s][lang] }))} />}
          {usesLocality && locs.length > 1 && <SelectField id={id('loc')} label={t.area} value={loc} onChange={setLocality} options={locs.map((l) => ({ value: l.key, label: l.name }))} />}
          {A.kind === 'ambulance' && <SelectField id={id('area')} label={t.areaKind} value={area} onChange={(v) => setArea(v as Area)} options={[{ value: 'urban', label: t.urban }, { value: 'rural', label: t.ruralA }, { value: 'superRural', label: t.superRural }]} />}
          {dmeRural && <Toggle id={id('rural')} label={t.rural} value={area === 'urban' ? 'no' : 'yes'} onChange={(v) => setArea(v === 'yes' ? 'rural' : 'urban')} options={[{ value: 'no', label: t.no }, { value: 'yes', label: t.yes }]} />}
          {A.partD && <Toggle id={id('partd')} label={t.partD} value={partD} onChange={setPartD} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} />}
          <SelectField id={id('cov')} className="sm:col-span-2" label={t.coverage} value={cov} onChange={setCov} options={covOptions} />
          {cov === 'ma' && A.kind !== 'notCovered' && <NumberField id={id('mac')} label={t.maCopay} value={maCopay} onChange={setMaCopay} unit="$" max={100000} />}
          {cov === 'ma' && A.kind !== 'notCovered' && <NumberField id={id('max')} label={t.maCoins} value={maCoins} onChange={setMaCoins} unit="%" max={100} />}
          {cov === 'ma' && A.kind !== 'notCovered' && <NumberField id={id('moop')} label={t.moop} value={moop} onChange={setMoop} unit="$" max={100000} />}
          {cov === 'ma' && A.kind === 'notCovered' && <NumberField id={id('allow')} label={t.allowance} value={allowance} onChange={setAllowance} unit="$" max={1000000} />}
          {usesDed && cov !== 'ma' && <NumberField id={id('ded')} label={t.deductible} value={ded} onChange={setDed} unit="$" max={PART_B.deductible} help={t.dedHelp(m(PART_B.deductible))} />}
          {(A.kind === 'pfs' || A.kind === 'imaging') && <Toggle id={id('assign')} label={t.assignment} value={assignment} onChange={setAssignment} options={[{ value: 'yes', label: t.yes }, { value: 'no', label: t.no }]} />}
          {(A.kind === 'partA' || sett === 'inpatient') && <Toggle id={id('pa')} label={t.partAPaid} value={partAPaid} onChange={setPartAPaid} options={[{ value: 'no', label: t.no }, { value: 'yes', label: t.yes }]} />}
          {A.crcScreening && <Toggle id={id('crc')} label={t.crcYear} value={crcYear} onChange={setCrcYear} options={[{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }]} />}
        </form>
        <div aria-live="polite" data-resultat className="self-start rounded-lg bg-accent-50 p-4">
          <p className="text-sm font-medium text-navy-700">{t.youPay}{A.kind === 'notCovered' ? ` · ${t.notCovered}` : ''}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{m(e.youPay)}</p>
          {rows.length > 0 && <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {rows.map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
          </tbody></table>}
          {barTotal > 0 && <div className="mt-3"><StackedBar ariaPrefix={t.approved} total={barTotal} segments={[{ label: t.barYou, value: e.youPay, color: '#154062' }, { label: t.barMedicare, value: e.medicarePays, color: '#81b8e4' }, ...(covKind === 'medigap' ? [{ label: t.barMedigap, value: e.medigapPays, color: '#d9eaf7' }] : [])]} /></div>}
          <p className="mt-3 text-xs text-navy-700">{ruleText(e, lang)}</p>
          {e.national != null && Math.abs(e.national - e.originalOnly) >= 1 && covKind === 'original' && <p className="mt-1 text-xs text-navy-700">{t.national}: {m(e.national)}</p>}
          {props.methodHref && <a href={props.methodHref} className="mt-2 inline-block text-xs font-medium text-accent-700 underline">{t.method}</a>}
        </div>
      </div>
    </div>
  );
}
