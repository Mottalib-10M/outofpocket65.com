import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  pfsAmount, imagingOfficeAmount, nonParticipating, partBShare, cappedRental,
  hospitalStay, snfStay, ambulanceAmount, dialysisAmount, type MedigapPlan,
} from '../src/lib/engine/medicare';

const load = (f: string) => JSON.parse(readFileSync(join(__dirname, '..', 'src', 'data', f.endsWith('-2026.json') || f.endsWith('-2027.json') ? f : 'cms/' + f), 'utf8'));
const P = load('params-2026.json');
const pfs = load('pfs.json');
const opps = load('opps.json');
const asc = load('asc.json');
const dme = load('dmepos.json');
const amb = load('ambulance.json');
const partB = { deductible: P.partB.deductible, coinsurance: P.partB.coinsurance };
const original = { kind: 'original' as const };
const planG: MedigapPlan = P.medigap.plans.G;
const CF = pfs.conversionFactor;

describe('paramètres officiels 2026 (fiche CMS du 14/11/2025)', () => {
  it('Part B : franchise 283 $, 20 %', () => { expect(P.partB.deductible).toBe(283); expect(P.partB.premiumStandard).toBe(202.9); });
  it('Part A : 1 736 $, 434 $, 868 $, SNF 217 $', () => {
    expect(P.partA).toMatchObject({ inpatientDeductible: 1736, hospitalDaily61to90: 434, lifetimeReserveDaily: 868, snfDaily21to100: 217 });
  });
  it('facteur de conversion RVU26D = 33,4009', () => expect(CF).toBe(33.4009));
  it('Medigap G : coassurance et dépassements oui, franchise B non', () => expect(planG).toMatchObject({ partBCoins: 1, partBDeductible: 0, excess: 1 }));
});

describe('Physician Fee Schedule', () => {
  it('consultation au cabinet, national : 95,19 $ (RVU 2,85 × CF)', () => {
    expect(pfsAmount(pfs.acts['office-visit'].global, CF, false)).toBe(95.19);
    expect(pfsAmount(pfs.acts['office-visit'].global, CF, true)).toBe(57.45);
  });
  it('le moteur retrouve le montant national calculé par le script', () => {
    for (const [id, a] of Object.entries<any>(pfs.acts)) {
      if (a.global.peNF != null && !a.global.naNF) expect(Math.abs(pfsAmount(a.global, CF, false) - a.nationalNonFacility)).toBeLessThan(0.02);
    }
  });
  it('GPCI : Manhattan coûte plus cher que le national', () => {
    const ny = pfs.localities.find((l: any) => /MANHATTAN/.test(l.name));
    expect(ny).toBeTruthy();
    expect(pfsAmount(pfs.acts['office-visit'].global, CF, false, ny)).toBeGreaterThan(95.19);
  });
  it('médecin non conventionné : 95 % approuvé, plafond 109,25 %', () => {
    expect(nonParticipating(95.19)).toEqual({ approved: 90.43, limitingCharge: 104, excess: 13.57 });
  });
  it('IRM du cerveau au cabinet = part médicale + part technique (195,39 $)', () => {
    const a = pfs.acts['mri-brain'];
    expect(imagingOfficeAmount(a.prof, a.tech, CF)).toBe(195.39);
  });
});

describe('reste à charge Part B', () => {
  it('cataracte en centre ambulatoire, franchise entière à payer : 570,07 $', () => {
    const lines = [
      { payee: 'doctor' as const, approved: pfs.acts['cataract-surgery'].nationalFacility },
      { payee: 'facility' as const, approved: asc.acts['cataract-surgery'].payment },
    ];
    const r = partBShare({ lines, partB, deductibleRemaining: 283, coverage: original });
    expect(r.approvedTotal).toBe(1718.33);
    expect(r.deductiblePart).toBe(283);
    expect(r.coinsurancePart).toBe(287.07);
    expect(r.originalOnly).toBe(570.07);
    expect(r.deductibleRemainingAfter).toBe(0);
    const g = partBShare({ lines, partB, deductibleRemaining: 283, coverage: { kind: 'medigap', medigap: planG } });
    expect(g.youPay).toBe(283);
  });
  it('prothèse de genou en ambulatoire hospitalier : quote-part du forfait plafonnée à 1 736 $', () => {
    const o = opps.acts['knee-replacement'];
    expect(o.cappedAtInpatientDeductible).toBe(true);
    const lines = [
      { payee: 'doctor' as const, approved: pfs.acts['knee-replacement'].nationalFacility },
      { payee: 'facility' as const, approved: o.payment, copay: o.copay, copayCap: P.partA.inpatientDeductible },
    ];
    const r = partBShare({ lines, partB, deductibleRemaining: 0, coverage: original });
    expect(r.coinsurancePart).toBe(1967.87);
  });
  it('dépistage du côlon : 0 $ ; avec polype retiré : 15 % sans franchise (2026)', () => {
    const lines = [
      { payee: 'doctor' as const, approved: pfs.acts['colonoscopy-polyp'].nationalFacility },
      { payee: 'facility' as const, approved: asc.acts['colonoscopy-polyp'].payment },
    ];
    expect(partBShare({ lines, partB, deductibleRemaining: 283, preventive: true, coverage: original }).youPay).toBe(0);
    const r = partBShare({ lines, partB, deductibleRemaining: 283, crcShare: P.crcScreeningConversion.patientShare, coverage: original });
    expect(r.deductiblePart).toBe(0);
    expect(r.coinsurancePart).toBe(132.03);
  });
  it('dépassement d’honoraires payé par Medigap G, pas par N', () => {
    const np = nonParticipating(95.19);
    const lines = [{ payee: 'doctor' as const, approved: np.approved, excess: np.excess }];
    expect(partBShare({ lines, partB, deductibleRemaining: 0, coverage: { kind: 'medigap', medigap: planG } }).youPay).toBe(0);
    const n = partBShare({ lines, partB, deductibleRemaining: 0, coverage: { kind: 'medigap', medigap: P.medigap.plans.N, planNCopay: 20 } });
    expect(n.youPay).toBe(r2(13.57 + Math.min(20, 18.09)));
  });
  it('Medicare Advantage : quote-part du plan saisie, plafonnée par la marge sous le MOOP', () => {
    const lines = [{ payee: 'doctor' as const, approved: 1000 }];
    expect(partBShare({ lines, partB, deductibleRemaining: 283, coverage: { kind: 'advantage', maCopay: 250, maRemainingMoop: 100 } }).youPay).toBe(100);
  });
});

describe('équipements, séjours, ambulance, dialyse', () => {
  it('CPAP en Floride (zone non rurale) : 13 mois = 545,42 $ approuvés, puis l’appareil est à vous', () => {
    const fee = dme.codes['E0601|RR'].states.FL.nonRural;
    expect(fee).toBe(51.94);
    const r = cappedRental(fee, 13, P.dmeRental.months4to13FactorStandard);
    expect(r.total).toBe(545.42);
    expect(r.owned).toBe(true);
  });
  it('hospitalisation de 95 jours : 19 096 $ en 2026', () => {
    expect(hospitalStay(95, P.partA).total).toBe(19096);
  });
  it('SNF 30 jours : 2 170 $ ; au-delà de 100 jours, jours non couverts', () => {
    expect(snfStay(30, P.partA).total).toBe(2170);
    expect(snfStay(120, P.partA).uncoveredDays).toBe(20);
  });
  it('ambulance BLS urgence, 10 miles, localité 01112-05', () => {
    const l = amb.localities['01112-05'].rates;
    expect(ambulanceAmount(l.A0429.urban, l.A0425.urban, 10)).toBe(690.98);
  });
  it('dialyse : 13 séances au forfait 2026 de 281,71 $', () => expect(dialysisAmount(P.esrd.basePerTreatment, 13)).toBe(3662.23));
});

describe('licence AMA', () => {
  it('aucun descripteur CPT dans les données publiées', () => {
    const t = ['pfs.json', 'opps.json', 'asc.json'].map((f) => readFileSync(join(__dirname, '..', 'src', 'data', f.endsWith('-2026.json') || f.endsWith('-2027.json') ? f : 'cms/' + f), 'utf8')).join('');
    expect(t).not.toMatch(/Descriptor|description/i);
  });
});

function r2(n: number) { return Math.round(n * 100) / 100; }
