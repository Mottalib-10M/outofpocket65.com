/**
 * What one Medicare service costs you: the site's main calculation, built on the pure engine
 * (`engine/medicare.ts`) and the CMS files of `data/cms/`. Every page and tool goes through
 * `estimate()`, so a figure in a text and the figure in a tool can never disagree (RECETTE §17.4).
 *
 * Act catalog: `scripts/acts.config.mjs` (labels written by us, HCPCS level II codes only, no CPT).
 */
import { ACTS as RAW_ACTS } from '../../scripts/acts.config.mjs';
import PFS from '../data/cms/pfs.json';
import OPPS from '../data/cms/opps.json';
import ASC from '../data/cms/asc.json';
import DME from '../data/cms/dmepos.json';
import AMB from '../data/cms/ambulance.json';
import P from '../data/params-2026.json';
import COV from '../data/coverage.json';
import {
  pfsAmount, imagingOfficeAmount, nonParticipating, partBShare, cappedRental, hospitalStay, snfStay,
  ambulanceAmount, dialysisAmount, NATIONAL_GPCI, type Line, type MedigapLetter, type MedigapPlan, type Setting, type Gpci, type Rvu,
} from './engine/medicare';

export type Lang = 'en' | 'es';
export type Kind = 'pfs' | 'imaging' | 'dme' | 'ambulance' | 'partA' | 'esrd' | 'zero' | 'notCovered';
export interface Act {
  id: string; kind: Kind; label: Record<Lang, string>; hcpcs2: string[]; coverage: string;
  settings?: Setting[]; units?: number; screening?: boolean; partD?: boolean; crcScreening?: boolean; converts?: string;
  rental?: 'capped' | 'power'; purchase?: boolean; bundle?: Array<{ code: string; mod: string; qty: number }>;
  base?: string; mileage?: string; stay?: 'snf' | 'hospital'; pfsCode?: string; related?: string[];
}
export const ACTS = RAW_ACTS as unknown as Act[];
export const actById = (id: string): Act => {
  const a = ACTS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown act: ${id}`);
  return a;
};

export const CF: number = PFS.conversionFactor;
export const PARAMS = P;
export const PART_B = { deductible: P.partB.deductible, coinsurance: P.partB.coinsurance };
export const PART_A = P.partA;
export const MEDIGAP_LETTERS = Object.keys(P.medigap.plans) as MedigapLetter[];
export const medigapPlan = (l: MedigapLetter): MedigapPlan => (P.medigap.plans as Record<string, MedigapPlan>)[l];

// ---------- places ----------
export interface Locality { key: string; state: string; name: string; gpci: Gpci }
const titleCase = (s: string) => s.toLowerCase()
  .replace(/\b([a-z])/g, (m) => m.toUpperCase())
  .replace(/\bCnty\b/g, 'County').replace(/\bNyc\b/g, 'NYC').replace(/\bDc\b/g, 'DC').replace(/\bPoughkpsie\b/g, 'Poughkeepsie')
  .replace(/\b(Of|And)\b/g, (m) => m.toLowerCase()).replace(/\/N /g, '/North ');
export const LOCALITIES: Locality[] = (PFS.localities as Array<{ mac: string; state: string; locality: string; name: string; work: number; pe: number; mp: number }>)
  .map((l) => ({ key: `${l.mac}-${l.locality}`, state: l.state, name: titleCase(l.name), gpci: { work: l.work, pe: l.pe, mp: l.mp } }));
export const localityByKey = (k: string) => LOCALITIES.find((l) => l.key === k);
export const STATE_NAMES: Record<string, Record<Lang, string>> = {
  AL: { en: 'Alabama', es: 'Alabama' }, AK: { en: 'Alaska', es: 'Alaska' }, AZ: { en: 'Arizona', es: 'Arizona' }, AR: { en: 'Arkansas', es: 'Arkansas' },
  CA: { en: 'California', es: 'California' }, CO: { en: 'Colorado', es: 'Colorado' }, CT: { en: 'Connecticut', es: 'Connecticut' }, DE: { en: 'Delaware', es: 'Delaware' },
  DC: { en: 'District of Columbia', es: 'Distrito de Columbia' }, FL: { en: 'Florida', es: 'Florida' }, GA: { en: 'Georgia', es: 'Georgia' }, HI: { en: 'Hawaii', es: 'Hawái' },
  ID: { en: 'Idaho', es: 'Idaho' }, IL: { en: 'Illinois', es: 'Illinois' }, IN: { en: 'Indiana', es: 'Indiana' }, IA: { en: 'Iowa', es: 'Iowa' },
  KS: { en: 'Kansas', es: 'Kansas' }, KY: { en: 'Kentucky', es: 'Kentucky' }, LA: { en: 'Louisiana', es: 'Luisiana' }, ME: { en: 'Maine', es: 'Maine' },
  MD: { en: 'Maryland', es: 'Maryland' }, MA: { en: 'Massachusetts', es: 'Massachusetts' }, MI: { en: 'Michigan', es: 'Míchigan' }, MN: { en: 'Minnesota', es: 'Minnesota' },
  MS: { en: 'Mississippi', es: 'Misisipi' }, MO: { en: 'Missouri', es: 'Misuri' }, MT: { en: 'Montana', es: 'Montana' }, NE: { en: 'Nebraska', es: 'Nebraska' },
  NV: { en: 'Nevada', es: 'Nevada' }, NH: { en: 'New Hampshire', es: 'Nuevo Hampshire' }, NJ: { en: 'New Jersey', es: 'Nueva Jersey' }, NM: { en: 'New Mexico', es: 'Nuevo México' },
  NY: { en: 'New York', es: 'Nueva York' }, NC: { en: 'North Carolina', es: 'Carolina del Norte' }, ND: { en: 'North Dakota', es: 'Dakota del Norte' }, OH: { en: 'Ohio', es: 'Ohio' },
  OK: { en: 'Oklahoma', es: 'Oklahoma' }, OR: { en: 'Oregon', es: 'Oregón' }, PA: { en: 'Pennsylvania', es: 'Pensilvania' }, RI: { en: 'Rhode Island', es: 'Rhode Island' },
  SC: { en: 'South Carolina', es: 'Carolina del Sur' }, SD: { en: 'South Dakota', es: 'Dakota del Sur' }, TN: { en: 'Tennessee', es: 'Tennessee' }, TX: { en: 'Texas', es: 'Texas' },
  UT: { en: 'Utah', es: 'Utah' }, VT: { en: 'Vermont', es: 'Vermont' }, VA: { en: 'Virginia', es: 'Virginia' }, WA: { en: 'Washington', es: 'Washington' },
  WV: { en: 'West Virginia', es: 'Virginia Occidental' }, WI: { en: 'Wisconsin', es: 'Wisconsin' }, WY: { en: 'Wyoming', es: 'Wyoming' },
  PR: { en: 'Puerto Rico', es: 'Puerto Rico' }, VI: { en: 'US Virgin Islands', es: 'Islas Vírgenes de EE. UU.' },
};
export const STATES = Object.keys(STATE_NAMES).filter((s) => LOCALITIES.some((l) => l.state === s))
  .sort((a, b) => STATE_NAMES[a].en.localeCompare(STATE_NAMES[b].en));
export const localitiesOf = (state: string) => LOCALITIES.filter((l) => l.state === state);
/** Default locality of a state: the "Rest of …" area when there is one (most beneficiaries), else the first. */
export const defaultLocality = (state: string) => {
  const ls = localitiesOf(state);
  return (ls.find((l) => /^Rest of/i.test(l.name)) ?? ls[0])?.key ?? '';
};

// ---------- coverage rules ----------
export interface Rule { covered: 'yes' | 'no' | 'conditional'; part: string | null; rule: string; src: string }
export const RULES = COV.rules as Record<string, Rule>;
export const ruleOf = (actId: string): Rule => RULES[actById(actId).coverage];

// ---------- the estimate ----------
export type CoverageKind = 'original' | 'medigap' | 'advantage';
export type Area = 'urban' | 'rural' | 'superRural';
export interface EstimateInput {
  act: string;
  setting?: Setting;
  /** PFS / ambulance locality key (`mac-locality`); empty = national amounts. */
  locality?: string;
  /** State for equipment (DMEPOS fee schedule). */
  state?: string;
  area?: Area;
  miles?: number;
  /** Sessions, treatments, rental months, days of a stay, prescriptions… depending on the act. */
  count?: number;
  coverage?: CoverageKind;
  medigap?: MedigapLetter;
  /** Medicare Advantage: the copay ($) and coinsurance (0-1) of the user's own plan, and what is left under its yearly cap. */
  maCopay?: number;
  maCoinsurance?: number;
  maRemainingMoop?: number;
  /** Part B deductible still to pay this year. */
  deductibleRemaining?: number;
  /** Doctor accepts assignment (true by default). */
  assignment?: boolean;
  /** Price the user is quoted for a service Medicare does not cover, or the allowance of the user's plan. */
  price?: number;
  allowance?: number;
  /** Has a Part D plan (vaccines). */
  partD?: boolean;
  /** Part A deductible already paid in this benefit period. */
  partAPaid?: boolean;
  /** Colorectal screening share year (2026: 15 %, 2027: 10 %). */
  crcYear?: 2026 | 2027;
}
export type LineKey = 'doctor' | 'facilityAsc' | 'facilityHopd' | 'equipment' | 'ambulanceBase' | 'ambulanceMiles' | 'hospital' | 'snf' | 'dialysis' | 'service' | 'price';
export interface EstLine { key: LineKey; approved: number }
export type RuleKey =
  | 'partB20' | 'oppsCopay' | 'oppsCap' | 'preventive' | 'crc' | 'notCovered' | 'partD0' | 'noPartD'
  | 'homeHealth0' | 'hospice' | 'rental' | 'purchase' | 'partAHospital' | 'snf' | 'inpatientSurgery' | 'advantage' | 'covid0';
export interface Estimate {
  act: Act; setting: Setting | null; status: Rule['covered'];
  lines: EstLine[];
  approvedTotal: number;
  /** Part B deductible used by this service. */
  deductiblePart: number;
  /** Your 20 %, OPPS copayment or Part A coinsurance. */
  coinsurancePart: number;
  /** Part A deductible (inpatient stays). */
  partADeductible: number;
  /** Extra a non-participating doctor may bill (limiting charge). */
  excessPart: number;
  /** With Original Medicare alone. */
  originalOnly: number;
  medigapPays: number;
  youPay: number;
  medicarePays: number;
  deductibleRemainingAfter: number;
  rule: RuleKey;
  /** Extra facts: owned after 13 months, uncovered days, sessions above the KX threshold… */
  extra: Record<string, number | boolean>;
  /** The same service at national amounts, when the locality changes the price. */
  national?: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const gpciOf = (k?: string): Gpci => (k && localityByKey(k)?.gpci) || NATIONAL_GPCI;
type PfsAct = { global: Rvu; prof?: Rvu | null; tech?: Rvu | null };
const pfsAct = (id: string) => (PFS.acts as Record<string, PfsAct>)[id];
const oppsAct = (id: string) => (OPPS.acts as Record<string, { payment: number | null; copay: number | null }>)[id];
const ascAct = (id: string) => (ASC.acts as Record<string, { payment: number }>)[id];
export const settingsOf = (a: Act): Setting[] => {
  if (a.kind === 'pfs' || a.kind === 'imaging' || (a.kind === 'zero' && a.settings)) return (a.settings ?? ['office']).filter((s) =>
    s === 'office' || s === 'inpatient' || (s === 'asc' && !!ascAct(a.id)) || (s === 'hopd' && oppsAct(a.id)?.payment != null));
  return [];
};
/** Fee a DME supplier is paid in a state, rural or not (rural falls back to non-rural when CMS publishes none). */
export function dmeFee(code: string, mod: string, state: string, rural = false): number {
  const c = (DME.codes as Record<string, { states: Record<string, { nonRural: number | null; rural: number | null }> }>)[`${code}|${mod}`];
  const s = c?.states[state] ?? c?.states.FL;
  if (!s) throw new Error(`DMEPOS ${code}|${mod} absent`);
  return (rural ? s.rural ?? s.nonRural : s.nonRural ?? s.rural) as number;
}
type AmbRates = Record<string, { urban: number | null; rural: number | null; superRural: number | null; ruralMiles1to17: number | null }>;
export function ambulanceLines(base: string, mileage: string, locality: string, area: Area, miles: number): EstLine[] {
  const L = (AMB.localities as Record<string, { rates: AmbRates }>)[locality] ?? (AMB.localities as Record<string, { rates: AmbRates }>)[defaultLocality('FL')];
  const b = L.rates[base]; const m = L.rates[mileage];
  const baseRate = (area === 'superRural' ? b.superRural ?? b.rural : area === 'rural' ? b.rural : b.urban) as number;
  let milesAmt: number;
  if (area === 'urban') milesAmt = (m.urban as number) * miles;
  else { const first = Math.min(17, miles); milesAmt = first * ((m.ruralMiles1to17 ?? m.rural) as number) + Math.max(0, miles - 17) * (m.rural as number); }
  return [{ key: 'ambulanceBase', approved: r2(baseRate) }, { key: 'ambulanceMiles', approved: r2(milesAmt) }];
}

function doctorFee(id: string, setting: Setting, locality?: string) {
  const a = pfsAct(id); const g = gpciOf(locality);
  if (actById(id).kind === 'imaging') {
    if (setting === 'office') return imagingOfficeAmount(a.prof as Rvu, a.tech as Rvu, CF, g);
    return pfsAmount(a.prof as Rvu, CF, true, g);
  }
  return pfsAmount(a.global, CF, setting !== 'office', g);
}

export function estimate(i: EstimateInput): Estimate {
  const act = actById(i.act);
  const rule = ruleOf(act.id);
  const settings = settingsOf(act);
  const setting: Setting | null = settings.length ? (i.setting && settings.includes(i.setting) ? i.setting : settings[0]) : null;
  const coverage = i.coverage ?? 'original';
  const medigap = i.medigap ?? 'G';
  const plan = medigapPlan(medigap);
  const dedLeft = Math.max(0, Math.min(i.deductibleRemaining ?? PART_B.deductible, PART_B.deductible));
  const assignment = i.assignment ?? true;
  const count = Math.max(0, i.count ?? 1);
  const extra: Record<string, number | boolean> = {};
  const lines: Array<Line & { key: LineKey }> = [];
  let ruleKey: RuleKey = 'partB20';
  let preventive = false; let crcShare: number | undefined; let partADed = 0; let partACoins = 0; let partAKind: 'hospital' | 'snf' | null = null;
  let flatYouPay: number | null = null; // services outside Part B cost sharing

  const doctorLines = (id: string, s: Setting, units = 1) => {
    const fee = r2(doctorFee(id, s, i.locality) * units);
    if (!assignment) { const np = nonParticipating(fee, P.limitingCharge.nonParticipatingFactor, P.limitingCharge.limitingChargeFactorOfFee); lines.push({ key: 'doctor', payee: 'doctor', approved: np.approved, excess: np.excess }); }
    else lines.push({ key: 'doctor', payee: 'doctor', approved: fee });
  };
  const facilityLine = (id: string, s: Setting) => {
    if (s === 'asc') lines.push({ key: 'facilityAsc', payee: 'facility', approved: ascAct(id).payment });
    if (s === 'hopd') { const o = oppsAct(id); lines.push({ key: 'facilityHopd', payee: 'facility', approved: o.payment as number, copay: o.copay ?? undefined, copayCap: PART_A.inpatientDeductible }); }
  };

  switch (act.kind) {
    case 'pfs':
    case 'imaging': {
      const s = setting as Setting;
      const units = (act.units ?? 1) * count;
      if (s === 'inpatient') {
        doctorLines(act.id, 'hopd', units);
        partAKind = 'hospital'; ruleKey = 'inpatientSurgery';
      } else {
        doctorLines(act.id, s, units);
        facilityLine(act.id, s);
        ruleKey = s === 'hopd' ? 'oppsCopay' : 'partB20';
      }
      if (act.crcScreening) { crcShare = i.crcYear === 2027 ? 0.1 : P.crcScreeningConversion.patientShare; ruleKey = 'crc'; extra.crcShare = crcShare; }
      break;
    }
    case 'zero': {
      if (act.screening && pfsAct(act.id)) {
        const s = setting ?? 'office';
        const a = pfsAct(act.id);
        const fee = a.prof && a.tech && s === 'office' ? imagingOfficeAmount(a.prof, a.tech, CF, gpciOf(i.locality)) : pfsAmount(a.global, CF, s !== 'office', gpciOf(i.locality));
        lines.push({ key: 'doctor', payee: 'doctor', approved: fee });
        facilityLine(act.id, s);
        preventive = true; ruleKey = 'preventive';
      } else if (act.partD) {
        if (i.partD ?? true) { flatYouPay = 0; ruleKey = 'partD0'; }
        else { lines.push({ key: 'price', payee: 'supplier', approved: Math.max(0, i.price ?? 0) }); flatYouPay = Math.max(0, i.price ?? 0); ruleKey = 'noPartD'; }
      } else if (act.id === 'hospice') {
        flatYouPay = r2(Math.min(P.hospice.drugCopayMax, Math.max(0, i.price ?? P.hospice.drugCopayMax)) * count);
        ruleKey = 'hospice'; extra.prescriptions = count;
      } else if (act.id === 'home-health') { flatYouPay = 0; ruleKey = 'homeHealth0'; }
      else { flatYouPay = 0; ruleKey = 'covid0'; }
      break;
    }
    case 'notCovered': {
      const price = Math.max(0, i.price ?? 0);
      lines.push({ key: 'price', payee: 'supplier', approved: price });
      flatYouPay = coverage === 'advantage' ? Math.max(0, price - Math.max(0, i.allowance ?? 0)) : price;
      ruleKey = 'notCovered';
      break;
    }
    case 'dme': {
      const st = i.state ?? 'FL'; const rural = i.area === 'rural' || i.area === 'superRural';
      if (act.rental) {
        const b = act.bundle![0];
        const fee = dmeFee(b.code, b.mod, st, rural);
        const factor = act.rental === 'power' ? P.dmeRental.months4to13FactorPowerWheelchair : P.dmeRental.months4to13FactorStandard;
        const months = Math.min(Math.max(1, Math.round(i.count ?? P.dmeRental.cappedMonths)), P.dmeRental.cappedMonths);
        const r = cappedRental(fee, months, factor, P.dmeRental.cappedMonths);
        lines.push({ key: 'equipment', payee: 'supplier', approved: r.total });
        extra.monthlyFee = fee; extra.monthly4to13 = r2(fee * factor); extra.months = months; extra.owned = r.owned;
        ruleKey = 'rental';
      } else {
        const total = r2((act.bundle ?? []).reduce((s, b) => s + dmeFee(b.code, b.mod, st, rural) * b.qty, 0));
        lines.push({ key: 'equipment', payee: 'supplier', approved: total });
        ruleKey = 'purchase';
      }
      break;
    }
    case 'ambulance': {
      for (const l of ambulanceLines(act.base!, act.mileage!, i.locality || defaultLocality('FL'), i.area ?? 'urban', Math.max(0, i.miles ?? 10))) lines.push({ ...l, payee: 'supplier' });
      break;
    }
    case 'esrd': {
      lines.push({ key: 'dialysis', payee: 'facility', approved: dialysisAmount(P.esrd.basePerTreatment, count) });
      break;
    }
    case 'partA': {
      partAKind = act.stay === 'snf' ? 'snf' : 'hospital';
      ruleKey = partAKind === 'snf' ? 'snf' : 'partAHospital';
      break;
    }
  }

  // Part A side (inpatient stay, SNF)
  if (partAKind === 'hospital') {
    const days = act.kind === 'partA' ? count : 3;
    const h = hospitalStay(days, PART_A, i.partAPaid ?? false);
    partADed = h.deductible; partACoins = r2(h.coins61to90 + h.reserveCost);
    extra.days = days; extra.uncoveredDays = h.uncoveredDays; extra.reserveUsed = h.reserveUsed;
  } else if (partAKind === 'snf') {
    const s = snfStay(count, PART_A);
    partACoins = s.coinsurance; extra.days = count; extra.coinsDays = s.coinsDays; extra.uncoveredDays = s.uncoveredDays;
  }

  const share = partBShare({
    lines: lines.filter((l) => l.key !== 'price').map(({ key: _k, ...l }) => l), partB: PART_B, deductibleRemaining: dedLeft, preventive, crcShare,
    coverage: coverage === 'medigap' ? { kind: 'medigap', medigap: plan, planNCopay: medigap === 'N' ? (act.id === 'er-visit' ? P.medigap.planNCopayErMax : (setting === 'office' && act.kind === 'pfs' ? P.medigap.planNCopayOfficeMax : undefined)) : undefined } : { kind: 'original' },
  });
  for (const l of lines) if (l.copayCap != null && l.copay != null && l.copay > l.copayCap) ruleKey = 'oppsCap';

  let originalOnly = r2(share.originalOnly + partADed + partACoins);
  let medigapPays = 0;
  if (coverage === 'medigap') {
    const partAMedigap = r2(partADed * plan.partADeductible + partACoins * (partAKind === 'snf' ? plan.snfCoins : 1));
    medigapPays = r2(share.medigapPays + partAMedigap);
  }
  if (flatYouPay != null) { originalOnly = flatYouPay; if (coverage === 'medigap' && ruleKey === 'hospice') medigapPays = r2(flatYouPay * plan.hospiceCoins); }
  let youPay = r2(originalOnly - medigapPays);
  const approvedTotal = r2(lines.reduce((s, l) => s + l.approved, 0));
  if (coverage === 'advantage' && ruleKey !== 'notCovered' && ruleKey !== 'noPartD') {
    const raw = (i.maCopay ?? 0) + (approvedTotal + partADed) * (i.maCoinsurance ?? 0);
    youPay = r2(Math.min(raw, Math.max(0, i.maRemainingMoop ?? Infinity)));
    ruleKey = 'advantage';
    medigapPays = 0;
  }
  if (act.kind === 'notCovered' || ruleKey === 'noPartD') { youPay = flatYouPay as number; originalOnly = Math.max(0, i.price ?? 0); }
  const medicarePays = act.kind === 'notCovered' || ruleKey === 'noPartD' ? 0 : r2(Math.max(0, approvedTotal - share.deductiblePart - share.coinsurancePart));

  let national: number | undefined;
  if ((act.kind === 'pfs' || act.kind === 'imaging') && i.locality) {
    national = estimate({ ...i, locality: '', coverage: 'original' }).originalOnly;
  }
  return {
    act, setting, status: rule.covered, lines: lines.map((l) => ({ key: l.key, approved: l.approved })), approvedTotal,
    deductiblePart: share.deductiblePart, coinsurancePart: r2(share.coinsurancePart + partACoins), partADeductible: partADed, excessPart: share.excessPart,
    originalOnly, medigapPays, youPay, medicarePays, deductibleRemainingAfter: share.deductibleRemainingAfter,
    rule: ruleKey, extra, national,
  };
}

/** Shortcut for texts: what you pay with Original Medicare alone, national amounts, full deductible already met unless said. */
export const youPayOriginal = (act: string, o: Partial<EstimateInput> = {}) => estimate({ act, deductibleRemaining: 0, ...o }).originalOnly;
