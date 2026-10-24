import { describe, it, expect } from 'vitest';
import { estimate, ACTS, settingsOf, LOCALITIES, STATES, localitiesOf, defaultLocality, ruleOf, PART_A } from '../src/lib/estimate';

const manhattan = LOCALITIES.find((l) => /Manhattan/.test(l.name))!.key;

describe('catalog', () => {
  it('every act has a coverage rule and both labels', () => {
    for (const a of ACTS) { expect(ruleOf(a.id)).toBeTruthy(); expect(a.label.en && a.label.es).toBeTruthy(); }
  });
  it('109 PFS localities, every state has a default area', () => {
    expect(LOCALITIES.length).toBe(109);
    for (const s of STATES) expect(localitiesOf(s).some((l) => l.key === defaultLocality(s))).toBe(true);
  });
  it('a setting is offered only when CMS publishes its rate', () => {
    expect(settingsOf(ACTS.find((a) => a.id === 'cataract-surgery')!)).toEqual(['asc', 'hopd']);
    expect(settingsOf(ACTS.find((a) => a.id === 'mammogram-diagnostic')!)).toEqual(['office']);
  });
  it('every act runs without error in every setting', () => {
    for (const a of ACTS) for (const s of [undefined, ...settingsOf(a)]) {
      const e = estimate({ act: a.id, setting: s, price: 1000, count: 2 });
      expect(Number.isFinite(e.youPay)).toBe(true);
      expect(e.youPay).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('Part B services', () => {
  it('cataract surgery at a surgery center, deductible not met: $570.07 (same as the engine test)', () => {
    const e = estimate({ act: 'cataract-surgery', setting: 'asc' });
    expect(e.approvedTotal).toBe(1718.33);
    expect(e.youPay).toBe(570.07);
    expect(estimate({ act: 'cataract-surgery', setting: 'asc', coverage: 'medigap', medigap: 'G' }).youPay).toBe(283);
    expect(estimate({ act: 'cataract-surgery', setting: 'asc', coverage: 'medigap', medigap: 'C' }).youPay).toBe(0);
  });
  it('knee replacement as a hospital outpatient: facility copayment capped at the Part A deductible', () => {
    const e = estimate({ act: 'knee-replacement', setting: 'hopd', deductibleRemaining: 0 });
    expect(e.coinsurancePart).toBe(1967.87);
    expect(e.rule).toBe('oppsCap');
  });
  it('knee replacement as an inpatient: Part A deductible + 20 % of the surgeon', () => {
    const e = estimate({ act: 'knee-replacement', setting: 'inpatient', deductibleRemaining: 0 });
    expect(e.partADeductible).toBe(PART_A.inpatientDeductible);
    expect(e.youPay).toBeGreaterThan(PART_A.inpatientDeductible);
    expect(estimate({ act: 'knee-replacement', setting: 'inpatient', coverage: 'medigap', medigap: 'G', deductibleRemaining: 0 }).youPay).toBe(0);
  });
  it('a locality changes the price: Manhattan costs more than the national amount', () => {
    const e = estimate({ act: 'office-visit', locality: manhattan, deductibleRemaining: 0 });
    expect(e.youPay).toBeGreaterThan(estimate({ act: 'office-visit', deductibleRemaining: 0 }).youPay);
    expect(e.national).toBe(19.04);
  });
  it('a doctor who does not accept assignment: limiting charge, paid by Medigap G but not N', () => {
    const e = estimate({ act: 'office-visit', assignment: false, deductibleRemaining: 0 });
    expect(e.excessPart).toBe(13.57);
    expect(estimate({ act: 'office-visit', assignment: false, deductibleRemaining: 0, coverage: 'medigap', medigap: 'G' }).youPay).toBe(0);
  });
  it('physical therapy sessions multiply', () => {
    const one = estimate({ act: 'physical-therapy-session', count: 1, deductibleRemaining: 0 }).approvedTotal;
    expect(estimate({ act: 'physical-therapy-session', count: 10, deductibleRemaining: 0 }).approvedTotal).toBeCloseTo(one * 10, 1);
  });
});

describe('screening, not covered, Part D', () => {
  it('screening colonoscopy $0; with a polyp 15 % in 2026, 10 % in 2027, never the deductible', () => {
    expect(estimate({ act: 'colonoscopy-screening', setting: 'asc' }).youPay).toBe(0);
    expect(estimate({ act: 'colonoscopy-polyp', setting: 'asc' }).youPay).toBe(132.03);
    const y27 = estimate({ act: 'colonoscopy-polyp', setting: 'asc', crcYear: 2027 });
    expect(y27.deductiblePart).toBe(0);
    expect(y27.youPay).toBe(88.02);
  });
  it('hearing aids: the full price, even with Medigap; an Advantage allowance comes off', () => {
    expect(estimate({ act: 'hearing-aids', price: 4000, coverage: 'medigap', medigap: 'G' }).youPay).toBe(4000);
    expect(estimate({ act: 'hearing-aids', price: 4000, coverage: 'advantage', allowance: 1500 }).youPay).toBe(2500);
  });
  it('shingles vaccine: $0 with Part D, the price without', () => {
    expect(estimate({ act: 'shingles-vaccine', partD: true }).youPay).toBe(0);
    expect(estimate({ act: 'shingles-vaccine', partD: false, price: 200 }).youPay).toBe(200);
  });
});

describe('equipment, ambulance, stays, dialysis', () => {
  it('CPAP in Florida: 13 months = $545.42 approved, you pay 20 % with the deductible met', () => {
    const e = estimate({ act: 'cpap', state: 'FL', count: 13, deductibleRemaining: 0 });
    expect(e.approvedTotal).toBe(545.42);
    expect(e.youPay).toBe(109.08);
    expect(e.extra.owned).toBe(true);
  });
  it('rural equipment fee is higher', () => {
    expect(estimate({ act: 'wheelchair-manual', state: 'FL', area: 'rural' }).approvedTotal).toBeGreaterThan(estimate({ act: 'wheelchair-manual', state: 'FL' }).approvedTotal);
  });
  it('ambulance BLS 10 urban miles in San Francisco = $690.98 approved (engine test)', () => {
    expect(estimate({ act: 'ambulance-emergency', locality: '01112-05', miles: 10 }).approvedTotal).toBe(690.98);
  });
  it('95 hospital days: $19,096; Medigap pays everything but the deductible with plan K at 50 %', () => {
    expect(estimate({ act: 'hospital-stay', count: 95 }).youPay).toBe(19096);
    expect(estimate({ act: 'hospital-stay', count: 95, coverage: 'medigap', medigap: 'K' }).youPay).toBe(868);
  });
  it('SNF 30 days: $2,170; plan G pays it, plan K half', () => {
    expect(estimate({ act: 'skilled-nursing', count: 30 }).youPay).toBe(2170);
    expect(estimate({ act: 'skilled-nursing', count: 30, coverage: 'medigap', medigap: 'G' }).youPay).toBe(0);
    expect(estimate({ act: 'skilled-nursing', count: 30, coverage: 'medigap', medigap: 'K' }).youPay).toBe(1085);
  });
  it('dialysis: 13 sessions, 20 % after the deductible', () => {
    expect(estimate({ act: 'dialysis', count: 13, deductibleRemaining: 0 }).youPay).toBe(732.45);
  });
  it('Advantage: the plan copay, capped by what is left under its yearly limit', () => {
    expect(estimate({ act: 'mri-brain', setting: 'office', coverage: 'advantage', maCopay: 250, maRemainingMoop: 100 }).youPay).toBe(100);
  });
});
