// Moteur de calcul du reste à charge Medicare, acte par acte.
// Fonctions pures, sans réseau ni import de données : les JSON de data/ sont passés en argument.
// Tous les montants restent en cents implicites (nombres à virgule) ; l'affichage arrondit.

export type Setting = 'office' | 'asc' | 'hopd' | 'inpatient';
export type MedigapLetter = 'A' | 'B' | 'C' | 'D' | 'F' | 'G' | 'K' | 'L' | 'M' | 'N';

export interface Rvu { work: number; peNF: number | null; peF: number | null; mp: number; naNF?: boolean; oppsPeNF?: number | null; oppsMp?: number | null }
export interface Gpci { work: number; pe: number; mp: number }
export const NATIONAL_GPCI: Gpci = { work: 1, pe: 1, mp: 1 };

export interface PartBParams { deductible: number; coinsurance: number }
export interface PartAParams { inpatientDeductible: number; hospitalDaily61to90: number; lifetimeReserveDaily: number; lifetimeReserveDays: number; snfDaily21to100: number; snfMaxDays: number }
export interface MedigapPlan { partBCoins: number; partBDeductible: number; excess: number; partADeductible: number; snfCoins: number; hospiceCoins: number }

const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp0 = (n: number) => (n > 0 ? n : 0);

/** Montant du Physician Fee Schedule : [(W×GPCIw) + (PE×GPCIpe) + (MP×GPCImp)] × CF (RVU26D.pdf). */
export function pfsAmount(rvu: Rvu, cf: number, facility: boolean, gpci: Gpci = NATIONAL_GPCI): number {
  const pe = facility ? rvu.peF : rvu.peNF;
  if (pe == null) throw new Error('RVU de pratique absent pour ce lieu');
  return r2((rvu.work * gpci.work + pe * gpci.pe + rvu.mp * gpci.mp) * cf);
}

/** Imagerie au cabinet : part médicale + part technique plafonnée au montant OPPS (DRA 2005 § 5102(b)). */
export function imagingOfficeAmount(prof: Rvu, tech: Rvu, cf: number, gpci: Gpci = NATIONAL_GPCI): number {
  const pc = pfsAmount(prof, cf, false, gpci);
  const tcPfs = pfsAmount(tech, cf, false, gpci);
  const hasCap = tech.oppsPeNF != null && tech.oppsPeNF > 0;
  const tcCap = hasCap ? r2((tech.work * gpci.work + (tech.oppsPeNF as number) * gpci.pe + (tech.oppsMp ?? tech.mp) * gpci.mp) * cf) : Infinity;
  return r2(pc + Math.min(tcPfs, tcCap));
}

/** Médecin non conventionné (non-participating) : montant approuvé 95 %, facturable jusqu'à 109,25 % du barème. */
export function nonParticipating(fee: number, nonParFactor = 0.95, limitingFactor = 1.0925) {
  const approved = r2(fee * nonParFactor);
  const limitingCharge = r2(fee * limitingFactor);
  return { approved, limitingCharge, excess: r2(limitingCharge - approved) };
}

export interface Line {
  /** qui facture : médecin (Part B, barème), établissement (forfait OPPS/ASC), fournisseur (DME, ambulance) */
  payee: 'doctor' | 'facility' | 'supplier';
  approved: number;
  /** quote-part propre de la ligne quand elle n'est pas 20 % (copayment OPPS national) */
  copay?: number;
  /** plafond de la quote-part de la ligne (copayment OPPS limité à la franchise Part A) */
  copayCap?: number;
  /** dépassement d'honoraires possible (non-participating) */
  excess?: number;
}

export interface CoverageInput {
  kind: 'original' | 'medigap' | 'advantage';
  medigap?: MedigapPlan;
  /** Medigap N : quote-part forfaitaire par visite au cabinet (≤ 20 $) ou aux urgences (≤ 50 $) */
  planNCopay?: number;
  /** Medicare Advantage : quote-part saisie par l'utilisateur (montant fixe ou pourcentage) et marge restante sous son plafond */
  maCopay?: number;
  maCoinsurance?: number;
  maRemainingMoop?: number;
}

export interface ShareInput {
  lines: Line[];
  partB: PartBParams;
  /** franchise Part B qu'il reste à payer cette année (0 si déjà atteinte) */
  deductibleRemaining: number;
  /** acte préventif à 0 $ (assignment accepté) */
  preventive?: boolean;
  /** dépistage colorectal devenu thérapeutique : part du patient sans franchise (0,15 en 2026, 0,10 en 2027) */
  crcShare?: number;
  coverage: CoverageInput;
}

export interface ShareResult {
  approvedTotal: number;
  deductiblePart: number;
  coinsurancePart: number;
  excessPart: number;
  /** ce que vous payez avec Original Medicare seul */
  originalOnly: number;
  /** ce que paie le Medigap, s'il y en a un */
  medigapPays: number;
  /** ce que vous payez au final selon la couverture choisie */
  youPay: number;
  medicarePays: number;
  deductibleRemainingAfter: number;
}

/** Reste à charge Part B pour un acte (une ou plusieurs lignes facturées). */
export function partBShare(i: ShareInput): ShareResult {
  const approvedTotal = r2(i.lines.reduce((s, l) => s + l.approved, 0));
  const excessPart = r2(i.lines.reduce((s, l) => s + (l.excess ?? 0), 0));
  let deductiblePart = 0;
  let coinsurancePart = 0;
  if (i.preventive) {
    // rien : ni franchise ni quote-part
  } else if (i.crcShare != null) {
    coinsurancePart = r2(approvedTotal * i.crcShare); // franchise non applicable (42 CFR 410.152(l)(5))
  } else {
    let ded = clamp0(Math.min(i.deductibleRemaining, approvedTotal));
    deductiblePart = r2(ded);
    for (const l of i.lines) {
      // la franchise s'impute ligne par ligne, dans l'ordre
      const take = Math.min(ded, l.approved);
      ded -= take;
      const base = l.approved - take;
      // OPPS : la quote-part nationale est un taux (copay ÷ forfait) appliqué au reste après franchise
      // (Medicare Claims Processing Manual, ch. 4, § 30.2, « program payment percentage ») ; sinon 20 % du montant approuvé.
      const rate = l.copay != null && l.approved > 0 ? l.copay / l.approved : i.partB.coinsurance;
      let share = base * rate;
      if (l.copayCap != null) share = Math.min(share, l.copayCap);
      coinsurancePart += share;
    }
    coinsurancePart = r2(coinsurancePart);
  }
  const originalOnly = r2(deductiblePart + coinsurancePart + excessPart);
  const deductibleRemainingAfter = r2(clamp0(i.deductibleRemaining - deductiblePart));

  let youPay = originalOnly;
  let medigapPays = 0;
  const c = i.coverage;
  if (c.kind === 'medigap' && c.medigap) {
    const g = c.medigap;
    medigapPays = r2(deductiblePart * g.partBDeductible + coinsurancePart * g.partBCoins + excessPart * g.excess);
    if (c.planNCopay != null) medigapPays = r2(clamp0(medigapPays - Math.min(c.planNCopay, coinsurancePart)));
    youPay = r2(originalOnly - medigapPays);
  } else if (c.kind === 'advantage') {
    // Medicare Advantage : on applique le barème du plan saisi par l'utilisateur, jamais un plan listé
    const raw = c.maCopay != null ? c.maCopay : approvedTotal * (c.maCoinsurance ?? 0);
    youPay = r2(Math.min(raw, c.maRemainingMoop ?? Infinity));
  }
  return {
    approvedTotal, deductiblePart, coinsurancePart, excessPart, originalOnly, medigapPays, youPay,
    medicarePays: r2(approvedTotal - deductiblePart - coinsurancePart), deductibleRemainingAfter,
  };
}

/** Location plafonnée d'un équipement (42 CFR 414.229) : mois 1 à 3 au tarif plein, mois 4 à 13 réduits. */
export function cappedRental(monthlyFee: number, months: number, factor4to13 = 0.75, cap = 13) {
  const m = Math.min(Math.max(0, Math.floor(months)), cap);
  const schedule: number[] = [];
  for (let k = 1; k <= m; k++) schedule.push(r2(k <= 3 ? monthlyFee : monthlyFee * factor4to13));
  return { schedule, total: r2(schedule.reduce((s, x) => s + x, 0)), owned: m >= cap };
}

/** Séjour hospitalier Part A sur une période de prestations. */
export function hospitalStay(days: number, p: PartAParams, deductibleAlreadyPaid = false, reserveDaysLeft = 60) {
  const d = Math.max(0, Math.floor(days));
  const deductible = d > 0 && !deductibleAlreadyPaid ? p.inpatientDeductible : 0;
  const d61to90 = clamp0(Math.min(d, 90) - 60);
  const reserveUsed = Math.min(clamp0(d - 90), Math.max(0, reserveDaysLeft));
  const uncoveredDays = clamp0(d - 90 - reserveUsed);
  return {
    deductible,
    days61to90: d61to90, coins61to90: d61to90 * p.hospitalDaily61to90,
    reserveUsed, reserveCost: reserveUsed * p.lifetimeReserveDaily,
    uncoveredDays,
    total: deductible + d61to90 * p.hospitalDaily61to90 + reserveUsed * p.lifetimeReserveDaily,
  };
}

/** Séjour en SNF après hospitalisation : 0 $ jours 1-20, forfait jours 21-100, rien au-delà. */
export function snfStay(days: number, p: PartAParams) {
  const d = Math.max(0, Math.floor(days));
  const coinsDays = clamp0(Math.min(d, p.snfMaxDays) - 20);
  return { coinsDays, coinsurance: coinsDays * p.snfDaily21to100, uncoveredDays: clamp0(d - p.snfMaxDays), total: coinsDays * p.snfDaily21to100 };
}

/** Ambulance : forfait de base + kilométrage (miles) au tarif de la localité (AFS). */
export function ambulanceAmount(baseRate: number, mileRate: number, miles: number) {
  return r2(baseRate + mileRate * Math.max(0, miles));
}

/** Dialyse : forfait ESRD PPS par séance × nombre de séances (avant ajustements de cas). */
export function dialysisAmount(basePerTreatment: number, treatments: number) {
  return r2(basePerTreatment * Math.max(0, treatments));
}
