#!/usr/bin/env node
// update-data.mjs — relit les fichiers publics de CMS et régénère data/*.json.
//
// Sources (œuvres du gouvernement fédéral des États-Unis, 17 U.S.C. § 105 : « Copyright protection
// under this title is not available for any work of the United States Government ») :
//   - Physician Fee Schedule, fichier RVU trimestriel (RVU26D, octobre 2026)
//   - OPPS Addendum B trimestriel (octobre 2026)
//   - ASC Addendum AA trimestriel (octobre 2026)
//   - DMEPOS fee schedule trimestriel (DME26-D, octobre 2026)
//   - Ambulance fee schedule public use file (CY 2026)
// Les fichiers CMS portent la mention « CPT codes and descriptions only are copyright 2026 American
// Medical Association » : on ne lit AUCUN descripteur CPT et on n'écrit AUCUN numéro CPT dans data/.
// La correspondance acte -> numéro CPT vient de scripts/cpt-map.local.mjs (local, hors git).
//
// Usage : node scripts/update-data.mjs            (télécharge dans raw/, écrit data/)
//         node scripts/update-data.mjs --offline  (réutilise raw/ déjà téléchargé)
// Le cron GitHub Actions (phase 2) ne relance que la partie niveau II (DMEPOS, ambulance) si
// cpt-map.local.mjs est absent ; la partie PFS/OPPS/ASC se relance en local à chaque trimestre.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACTS } from './acts.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'raw');
const DATA = join(ROOT, 'src', 'data', 'cms');
const OFFLINE = process.argv.includes('--offline');
const TODAY = new Date().toISOString().slice(0, 10);

// Pages de dépôt lues pour trouver le dernier fichier ; repli sur l'URL connue au 2026-10-24.
const SOURCES = {
  pfs: {
    page: 'https://www.cms.gov/medicare/payment/fee-schedules/physician/pfs-relative-value-files',
    known: 'https://www.cms.gov/files/zip/rvu26d-updated-08-26-2026.zip',
    label: 'CMS, Physician Fee Schedule relative value file RVU26D (October 2026 release, updated 08/26/2026)',
  },
  opps: {
    page: 'https://www.cms.gov/medicare/payment/prospective-payment-systems/hospital-outpatient-pps/quarterly-addenda-updates/october-2026-addendum-b',
    known: 'https://www.cms.gov/files/zip/October-2026-OPPS-Addendum-B.zip',
    label: 'CMS, OPPS Addendum B, October 2026 (file dated 10/14/2026)',
  },
  asc: {
    page: 'https://www.cms.gov/medicare/payment/prospective-payment-systems/ambulatory-surgical-center-asc/asc-payment-rates-addenda',
    known: 'https://www.cms.gov/files/zip/october-2026-asc-approved-hcpcs-code-payment-rates.zip',
    label: 'CMS, ASC Addendum AA, October 2026',
  },
  dme: {
    page: 'https://www.cms.gov/medicare/payment/fee-schedules/dmepos/dmepos-fee-schedule/dme26-d',
    known: 'https://www.cms.gov/files/zip/dme26-d.zip',
    label: 'CMS, DMEPOS fee schedule DME26-D (October 2026)',
  },
  afs: {
    page: 'https://www.cms.gov/medicare/payment/fee-schedules/ambulance/ambulance-fee-schedule-public-use-files',
    known: 'https://www.cms.gov/files/zip/cy-2026-file.zip',
    label: 'CMS, Ambulance Fee Schedule public use file CY 2026',
  },
};

// ---------- utilitaires ----------
function parseCSVLine(line, sep = ',') {
  const out = []; let cur = ''; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === sep) { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}
function readText(file) {
  const buf = readFileSync(file);
  // Les fichiers CMS mélangent UTF-8 (BOM) et Latin-1 : on décode en Latin-1 si l'UTF-8 échoue.
  const utf = buf.toString('utf8');
  return (utf.includes('�') ? buf.toString('latin1') : utf).replace(/^﻿/, '');
}
const num = (s) => {
  if (s == null) return null;
  const t = String(s).replace(/[$,\s]/g, '');
  if (t === '' || t === '.' || t === 'NA' || t === 'n/a') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};
const round2 = (n) => Math.round(n * 100) / 100;

async function latestZip(src) {
  if (OFFLINE) return src.known;
  try {
    const html = await (await fetch(src.page)).text();
    const m = [...html.matchAll(/href="(\/files\/zip\/[^"]+\.zip)"/gi)].map((x) => x[1]);
    if (m.length) return 'https://www.cms.gov' + m[0];
  } catch { /* repli */ }
  return src.known;
}
async function fetchZip(key) {
  const url = await latestZip(SOURCES[key]);
  const dir = join(RAW, key);
  const zip = join(RAW, `${key}.zip`);
  if (!OFFLINE || !existsSync(dir)) {
    mkdirSync(RAW, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${key}: HTTP ${res.status} sur ${url}`);
    writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
    mkdirSync(dir, { recursive: true });
    execFileSync('unzip', ['-o', '-q', zip, '-d', dir]);
  }
  return { url, dir };
}
const findFile = (dir, re) => {
  const f = readdirSync(dir).find((n) => re.test(n));
  if (!f) throw new Error(`fichier ${re} introuvable dans ${dir}`);
  return join(dir, f);
};

// ---------- correspondance acte -> code de ligne ----------
let CPT = {};
const cptPath = join(ROOT, 'scripts', 'cpt-map.local.mjs');
if (existsSync(cptPath)) CPT = (await import(cptPath)).CPT;
const rowCode = (a) => a.pfsCode || CPT[a.id] || null; // pfsCode = code HCPCS niveau II (public)
const needsRow = ACTS.filter((a) => ['pfs', 'imaging'].includes(a.kind) || (a.kind === 'zero' && a.screening));

// ---------- PFS ----------
async function buildPfs() {
  const { url, dir } = await fetchZip('pfs');
  const lines = readText(findFile(dir, /^PPRRVU\d+_\w+_nonQPP\.csv$/i)).split(/\r?\n/);
  const rows = new Map();
  let cf = null;
  for (const l of lines) {
    const c = parseCSVLine(l);
    if (!/^[A-Z0-9]{5}$/.test(c[0] || '')) continue;
    const key = `${c[0]}|${c[1] || ''}`;
    rows.set(key, {
      status: c[3], work: num(c[5]), peNF: num(c[6]), peF: num(c[8]), mp: num(c[10]),
      naNF: c[7] === 'NA', global: c[14], cf: num(c[25]),
      oppsPeNF: num(c[29]), oppsPeF: num(c[30]), oppsMp: num(c[31]),
    });
    if (!cf && num(c[25])) cf = num(c[25]);
  }
  const acts = {};
  for (const a of needsRow) {
    const code = rowCode(a);
    if (!code) { console.warn(`PFS: pas de code pour ${a.id} (cpt-map.local.mjs absent ?)`); continue; }
    const g = rows.get(`${code}|`);
    if (!g) { console.warn(`PFS: ligne absente pour ${a.id}`); continue; }
    const pick = (r) => r && { work: r.work, peNF: r.peNF, peF: r.peF, mp: r.mp, naNF: r.naNF, oppsPeNF: r.oppsPeNF, oppsMp: r.oppsMp };
    acts[a.id] = {
      status: g.status, globalDays: g.global,
      global: pick(g), prof: pick(rows.get(`${code}|26`)), tech: pick(rows.get(`${code}|TC`)),
      nationalNonFacility: round2((g.work + g.peNF + g.mp) * cf),
      nationalFacility: round2((g.work + g.peF + g.mp) * cf),
    };
  }
  // GPCI par localité
  const gl = readText(findFile(dir, /^GPCI\d+\.csv$/i)).split(/\r?\n/);
  const localities = [];
  for (const l of gl) {
    const c = parseCSVLine(l);
    if (!/^\d{5}$/.test(c[0] || '') || !/^[A-Z]{2}$/.test(c[1] || '')) continue;
    localities.push({ mac: c[0], state: c[1], locality: c[2], name: c[3].replace(/\*+$/, '').trim(), work: num(c[4]), pe: num(c[5]), mp: num(c[6]) });
  }
  return { source: SOURCES.pfs.label, source_url: url, retrieved_at: TODAY, valid_from: '2026-10-01', valid_to: '2026-12-31', conversionFactor: cf, acts, localities };
}

// ---------- OPPS ----------
async function buildOpps() {
  const { url, dir } = await fetchZip('opps');
  const lines = readText(findFile(dir, /\.txt$/i)).split(/\r?\n/);
  const rows = new Map();
  for (const l of lines) {
    const c = l.split('\t').map((s) => s.replace(/^"|"$/g, '').trim());
    if (/^[A-Z0-9]{5}$/.test(c[0] || '')) rows.set(c[0], { si: c[2], apc: c[3], payment: num(c[5]), copay: num(c[6]) ?? num(c[7]), minCopay: num(c[7]), note: c[11] || '' });
  }
  const acts = {};
  for (const a of needsRow) {
    const code = rowCode(a); const r = code && rows.get(code);
    if (r) acts[a.id] = { si: r.si, apc: r.apc, payment: r.payment, copay: r.copay, cappedAtInpatientDeductible: /capped at inpatient deductible/i.test(r.note) };
  }
  return { source: SOURCES.opps.label, source_url: url, retrieved_at: TODAY, valid_from: '2026-10-01', valid_to: '2026-12-31', note: 'National unadjusted rates (before the hospital wage index).', acts };
}

// ---------- ASC ----------
async function buildAsc() {
  const { url, dir } = await fetchZip('asc');
  const lines = readText(findFile(dir, /ASC-AA\.csv$/i)).split(/\r?\n/);
  const rows = new Map();
  for (const l of lines) {
    const c = parseCSVLine(l);
    if (/^[A-Z0-9]{5}$/.test(c[0] || '')) rows.set(c[0], { pi: c[4], payment: num(c[6]) });
  }
  const acts = {};
  for (const a of needsRow) {
    const code = rowCode(a); const r = code && rows.get(code);
    if (r && r.payment != null) acts[a.id] = r;
  }
  return { source: SOURCES.asc.label, source_url: url, retrieved_at: TODAY, valid_from: '2026-10-01', valid_to: '2026-12-31', note: 'National unadjusted ASC rates.', acts };
}

// ---------- DMEPOS (codes HCPCS niveau II, publics) ----------
async function buildDme() {
  const { url, dir } = await fetchZip('dme');
  const lines = readText(findFile(dir, /^DMEPOS_\w+\.csv$/i)).split(/\r?\n/);
  const header = parseCSVLine(lines.find((l) => l.startsWith('HCPCS,')));
  const stateCols = header.map((h, i) => [h, i]).filter(([h]) => /^[A-Z]{2} \((NR|R)\)$/.test(h));
  const wanted = new Set();
  for (const a of ACTS.filter((x) => x.kind === 'dme')) for (const b of [...(a.bundle || []), ...(a.supplies || [])]) wanted.add(`${b.code}|${b.mod || ''}`);
  const codes = {};
  for (const l of lines) {
    const c = parseCSVLine(l);
    const key = `${c[0]}|${c[1] || ''}`;
    if (!wanted.has(key) || c[2]) continue; // pas de second modificateur
    const states = {};
    for (const [h, i] of stateCols) {
      const st = h.slice(0, 2); const kind = h.includes('(NR)') ? 'nonRural' : 'rural';
      const v = num(c[i]);
      (states[st] ||= {})[kind] = v && v > 0 ? v : null;
    }
    codes[key] = { code: c[0], mod: c[1] || '', category: c[4], cmsShortDescriptor: c[c.length - 1], states };
  }
  for (const k of wanted) if (!codes[k]) console.warn(`DMEPOS: ${k} absent`);
  return { source: SOURCES.dme.label, source_url: url, retrieved_at: TODAY, valid_from: '2026-10-01', valid_to: '2026-12-31', codes };
}

// ---------- Ambulance (codes niveau II) ----------
async function buildAfs() {
  const { url, dir } = await fetchZip('afs');
  const lines = readText(findFile(dir, /PUF.*\.txt$/i)).split(/\r?\n/);
  const wanted = new Set(ACTS.filter((a) => a.kind === 'ambulance').flatMap((a) => [a.base, a.mileage]));
  const localities = {};
  for (const l of lines) {
    const c = l.split('\t').map((s) => s.trim());
    if (!wanted.has(c[2])) continue;
    const key = `${c[0]}-${c[1]}`;
    (localities[key] ||= { mac: c[0], locality: c[1], gpci: num(c[4]), rates: {} }).rates[c[2]] = { urban: num(c[6]), rural: num(c[7]), superRural: num(c[8]), ruralMiles1to17: num(c[9]) };
  }
  return { source: SOURCES.afs.label, source_url: url, retrieved_at: TODAY, valid_from: '2026-01-01', valid_to: '2026-12-31', localities };
}

// ---------- exécution ----------
mkdirSync(DATA, { recursive: true });
const out = {};
if (Object.keys(CPT).length) {
  out.pfs = await buildPfs(); out.opps = await buildOpps(); out.asc = await buildAsc();
} else console.warn('cpt-map.local.mjs absent : PFS/OPPS/ASC non régénérés (données existantes conservées).');
out.dmepos = await buildDme();
out.ambulance = await buildAfs();
for (const [k, v] of Object.entries(out)) {
  writeFileSync(join(DATA, `${k}.json`), JSON.stringify(v, null, 1) + '\n');
  console.log(`src/data/cms/${k}.json`, k === 'pfs' ? `${Object.keys(v.acts).length} actes, ${v.localities.length} localités, CF ${v.conversionFactor}` :
    k === 'dmepos' ? `${Object.keys(v.codes).length} codes` : k === 'ambulance' ? `${Object.keys(v.localities).length} localités` : `${Object.keys(v.acts).length} actes`);
}
// Garde-fou de licence : aucun numéro CPT ne doit sortir dans data/.
const cptNumbers = new Set(Object.values(CPT));
for (const f of readdirSync(DATA).filter((n) => n.endsWith('.json'))) {
  const t = readFileSync(join(DATA, f), 'utf8');
  for (const n of cptNumbers) if (new RegExp(`"${n}"|\\b${n}\\b`).test(t)) throw new Error(`Licence AMA : le numéro ${n} apparaît dans src/data/cms/${f}`);
}
console.log('Garde-fou licence : aucun numéro CPT dans data/.');
