// Catalogue des actes du site : identifiant, libellés écrits par nous (en, es), type de calcul,
// codes publics HCPCS niveau II (affichables), et renvoi vers la règle de couverture (data/coverage.json).
//
// RÈGLE DE LICENCE (brief 2026-10-24, licence AMA lue sur https://www.cms.gov/license/ama) :
//   - Les descripteurs CPT ne sont JAMAIS repris : chaque libellé ci-dessous est écrit par nous.
//   - Les numéros CPT ne figurent PAS dans ce fichier ni dans le site : la table de correspondance
//     acte -> numéro CPT vit dans scripts/cpt-map.local.mjs, ignoré par git (.gitignore), lu
//     seulement en local par update-data.mjs pour sélectionner les lignes des fichiers CMS.
//   - Seuls les codes HCPCS niveau II (A, E, G, K, V…), tenus par CMS (œuvre du gouvernement
//     fédéral, 17 U.S.C. § 105), peuvent s'afficher (champ `hcpcs2`).
//   - Les codes dentaires (D…) sont sous droit de l'ADA : jamais affichés.
//
// kind :
//   pfs        acte de médecin (Physician Fee Schedule) ; lieux possibles dans `settings`
//   imaging    imagerie : global au cabinet, part du radiologue (mod 26) + forfait hôpital (OPPS)
//   dme        équipement (DMEPOS, barème par État, location ou achat)
//   ambulance  barème ambulance (AFS) par localité + kilomètres
//   partA      séjour hôpital ou SNF (jours, franchise Part A)
//   esrd       dialyse : forfait ESRD PPS par séance
//   zero       couvert sans reste à charge (si le praticien accepte l'assignment)
//   notCovered pas couvert par Original Medicare

export const ACTS = [
  // --- requêtes de la liste fermée kp-us.txt ---
  { id: 'hearing-aids', kind: 'notCovered', label: { en: 'Hearing aids', es: 'Audífonos' }, hcpcs2: [], related: ['hearing-exam'], coverage: 'hearing-aids' },
  { id: 'hearing-exam', kind: 'pfs', settings: ['office', 'hopd'], label: { en: 'Diagnostic hearing test (full audiogram)', es: 'Prueba diagnóstica de audición (audiograma completo)' }, hcpcs2: [], coverage: 'hearing-exam' },
  { id: 'dental', kind: 'notCovered', label: { en: 'Routine dental care (cleanings, fillings, extractions, dentures)', es: 'Atención dental de rutina (limpiezas, empastes, extracciones, dentaduras)' }, hcpcs2: [], coverage: 'dental' },
  { id: 'cataract-surgery', kind: 'pfs', settings: ['asc', 'hopd'], label: { en: 'Cataract surgery with a standard lens implant, one eye', es: 'Cirugía de cataratas con lente intraocular estándar, un ojo' }, hcpcs2: [], related: ['glasses-after-cataract'], coverage: 'cataract-surgery' },
  { id: 'glasses-after-cataract', kind: 'dme', purchase: true, label: { en: 'Glasses after cataract surgery (standard frame + single-vision lenses)', es: 'Anteojos después de la cirugía de cataratas (montura estándar + lentes monofocales)' }, hcpcs2: ['V2020', 'V2100'], bundle: [{ code: 'V2020', mod: '', qty: 1 }, { code: 'V2100', mod: '', qty: 2 }], coverage: 'eyeglasses' },
  { id: 'ambulance-emergency', kind: 'ambulance', label: { en: 'Emergency ground ambulance, basic life support', es: 'Ambulancia terrestre de emergencia, soporte vital básico' }, hcpcs2: ['A0429', 'A0425'], base: 'A0429', mileage: 'A0425', coverage: 'ambulance' },
  { id: 'ambulance-als', kind: 'ambulance', label: { en: 'Emergency ground ambulance, advanced life support (level 1)', es: 'Ambulancia terrestre de emergencia, soporte vital avanzado (nivel 1)' }, hcpcs2: ['A0427', 'A0425'], base: 'A0427', mileage: 'A0425', coverage: 'ambulance' },
  { id: 'ambulance-nonemergency', kind: 'ambulance', label: { en: 'Scheduled non-emergency ambulance (for example to dialysis)', es: 'Ambulancia programada sin emergencia (por ejemplo, a diálisis)' }, hcpcs2: ['A0428', 'A0425'], base: 'A0428', mileage: 'A0425', coverage: 'ambulance' },
  { id: 'home-health', kind: 'zero', label: { en: 'Home health visits (nurse, therapist, aide)', es: 'Visitas de salud en el hogar (enfermera, terapeuta, auxiliar)' }, hcpcs2: [], coverage: 'home-health' },
  { id: 'physical-therapy-eval', kind: 'pfs', settings: ['office'], label: { en: 'Physical therapy evaluation, moderate complexity', es: 'Evaluación de fisioterapia, complejidad moderada' }, hcpcs2: [], coverage: 'physical-therapy' },
  { id: 'physical-therapy-session', kind: 'pfs', settings: ['office'], units: 3, label: { en: 'Physical therapy session (three 15-minute units of exercise)', es: 'Sesión de fisioterapia (tres unidades de ejercicio de 15 minutos)' }, hcpcs2: [], coverage: 'physical-therapy' },
  { id: 'chiropractic-adjustment', kind: 'pfs', settings: ['office'], label: { en: 'Chiropractic spinal adjustment, 3 to 4 regions', es: 'Ajuste quiropráctico de la columna, 3 a 4 regiones' }, hcpcs2: [], coverage: 'chiropractic' },
  { id: 'colonoscopy-screening', kind: 'zero', screening: true, settings: ['asc', 'hopd'], label: { en: 'Screening colonoscopy, average risk', es: 'Colonoscopia de detección, riesgo promedio' }, hcpcs2: ['G0121'], pfsCode: 'G0121', converts: 'colonoscopy-polyp', coverage: 'colonoscopy' },
  { id: 'colonoscopy-polyp', kind: 'pfs', settings: ['asc', 'hopd'], crcScreening: true, label: { en: 'Screening colonoscopy that turns into polyp removal', es: 'Colonoscopia de detección en la que se extirpa un pólipo' }, hcpcs2: [], coverage: 'colonoscopy' },
  { id: 'colonoscopy-diagnostic', kind: 'pfs', settings: ['asc', 'hopd'], label: { en: 'Diagnostic colonoscopy (symptoms, not screening)', es: 'Colonoscopia diagnóstica (por síntomas, no de detección)' }, hcpcs2: [], coverage: 'colonoscopy' },
  { id: 'shingles-vaccine', kind: 'zero', partD: true, label: { en: 'Shingles vaccine', es: 'Vacuna contra la culebrilla (herpes zóster)' }, hcpcs2: [], coverage: 'shingles-vaccine' },
  { id: 'cpap', kind: 'dme', rental: 'capped', label: { en: 'CPAP machine for sleep apnea (13-month rental)', es: 'Máquina CPAP para la apnea del sueño (alquiler de 13 meses)' }, hcpcs2: ['E0601'], bundle: [{ code: 'E0601', mod: 'RR', qty: 1 }], supplies: [{ code: 'A7030', mod: 'NU' }, { code: 'A7037', mod: 'NU' }], coverage: 'cpap' },
  { id: 'wheelchair-manual', kind: 'dme', rental: 'capped', label: { en: 'Standard manual wheelchair (rental)', es: 'Silla de ruedas manual estándar (alquiler)' }, hcpcs2: ['K0001'], bundle: [{ code: 'K0001', mod: 'RR', qty: 1 }], coverage: 'wheelchairs' },
  { id: 'wheelchair-lightweight', kind: 'dme', rental: 'capped', label: { en: 'Lightweight manual wheelchair (rental)', es: 'Silla de ruedas manual ligera (alquiler)' }, hcpcs2: ['K0003'], bundle: [{ code: 'K0003', mod: 'RR', qty: 1 }], coverage: 'wheelchairs' },
  { id: 'wheelchair-power', kind: 'dme', rental: 'power', label: { en: 'Power wheelchair, group 2 standard (rental, prior authorization)', es: 'Silla de ruedas eléctrica, grupo 2 estándar (alquiler, autorización previa)' }, hcpcs2: ['K0823'], bundle: [{ code: 'K0823', mod: 'RR', qty: 1 }], coverage: 'wheelchairs' },
  { id: 'scooter', kind: 'dme', purchase: true, label: { en: 'Mobility scooter (purchase)', es: 'Escúter de movilidad (compra)' }, hcpcs2: ['K0800'], bundle: [{ code: 'K0800', mod: 'NU', qty: 1 }], coverage: 'wheelchairs' },
  { id: 'knee-replacement', kind: 'pfs', settings: ['hopd', 'inpatient'], label: { en: 'Total knee replacement', es: 'Reemplazo total de rodilla' }, hcpcs2: [], coverage: 'knee-replacement' },
  { id: 'mri-brain', kind: 'imaging', settings: ['office', 'hopd'], label: { en: 'MRI of the brain without contrast', es: 'Resonancia magnética del cerebro sin contraste' }, hcpcs2: [], coverage: 'mri' },
  { id: 'mri-lumbar', kind: 'imaging', settings: ['office', 'hopd'], label: { en: 'MRI of the lower back without contrast', es: 'Resonancia magnética de la zona lumbar sin contraste' }, hcpcs2: [], coverage: 'mri' },
  { id: 'mri-knee', kind: 'imaging', settings: ['office', 'hopd'], label: { en: 'MRI of the knee without contrast', es: 'Resonancia magnética de la rodilla sin contraste' }, hcpcs2: [], coverage: 'mri' },
  { id: 'dialysis', kind: 'esrd', label: { en: 'Outpatient dialysis treatment (per session)', es: 'Tratamiento de diálisis ambulatoria (por sesión)' }, hcpcs2: [], coverage: 'dialysis' },
  { id: 'skilled-nursing', kind: 'partA', stay: 'snf', label: { en: 'Skilled nursing facility stay after a hospital stay', es: 'Estancia en un centro de enfermería especializada después de una hospitalización' }, hcpcs2: [], coverage: 'snf' },
  { id: 'hospital-stay', kind: 'partA', stay: 'hospital', label: { en: 'Inpatient hospital stay', es: 'Hospitalización' }, hcpcs2: [], coverage: 'hospital' },
  { id: 'hospice', kind: 'zero', label: { en: 'Hospice care', es: 'Cuidados paliativos (hospicio)' }, hcpcs2: [], coverage: 'hospice' },
  { id: 'covid-test', kind: 'zero', label: { en: 'COVID-19 lab test ordered by a doctor', es: 'Prueba de laboratorio de COVID-19 indicada por un médico' }, hcpcs2: [], coverage: 'covid-test' },
  { id: 'acupuncture', kind: 'pfs', settings: ['office'], label: { en: 'Acupuncture session for chronic low back pain (first 15 minutes)', es: 'Sesión de acupuntura para el dolor lumbar crónico (primeros 15 minutos)' }, hcpcs2: [], coverage: 'acupuncture' },
  { id: 'mammogram-screening', kind: 'zero', screening: true, settings: ['office'], label: { en: 'Screening mammogram (yearly)', es: 'Mamografía de detección (anual)' }, hcpcs2: [], coverage: 'mammogram' },
  { id: 'mammogram-diagnostic', kind: 'imaging', settings: ['office', 'hopd'], label: { en: 'Diagnostic mammogram, both breasts', es: 'Mamografía diagnóstica, ambas mamas' }, hcpcs2: [], coverage: 'mammogram' },
  { id: 'eye-exam-routine', kind: 'notCovered', label: { en: 'Routine eye exam for glasses', es: 'Examen de la vista de rutina para anteojos' }, hcpcs2: [], coverage: 'eye-exam-routine' },
  { id: 'eye-exam-medical', kind: 'pfs', settings: ['office', 'hopd'], label: { en: 'Medical eye exam, established patient (for example diabetes or glaucoma follow-up)', es: 'Examen médico de los ojos, paciente establecido (por ejemplo, control de diabetes o glaucoma)' }, hcpcs2: [], coverage: 'eye-exam-medical' },
  { id: 'glaucoma-screening', kind: 'pfs', settings: ['office'], label: { en: 'Glaucoma screening for people at high risk', es: 'Detección de glaucoma para personas de alto riesgo' }, hcpcs2: ['G0117'], pfsCode: 'G0117', coverage: 'eye-exam-medical' },
  { id: 'podiatry-nail-care', kind: 'pfs', settings: ['office'], label: { en: 'Nail trimming for a qualifying foot condition', es: 'Corte de uñas por una afección del pie que lo justifica' }, hcpcs2: ['G0127'], pfsCode: 'G0127', coverage: 'podiatry' },
  { id: 'podiatry-visit', kind: 'pfs', settings: ['office'], label: { en: 'Podiatrist office visit for a foot problem', es: 'Consulta con el podólogo por un problema del pie' }, hcpcs2: [], coverage: 'podiatry' },
  // --- actes transverses utilisés par plusieurs pages et par le simulateur principal ---
  { id: 'office-visit', kind: 'pfs', settings: ['office'], label: { en: 'Doctor office visit, established patient (typical 20-30 minutes)', es: 'Consulta médica, paciente establecido (20-30 minutos)' }, hcpcs2: [], coverage: 'office-visit' },
  { id: 'wellness-visit', kind: 'zero', screening: true, settings: ['office'], label: { en: 'Yearly wellness visit', es: 'Visita anual de bienestar' }, hcpcs2: ['G0439'], pfsCode: 'G0439', coverage: 'wellness-visit' },
  { id: 'er-visit', kind: 'pfs', settings: ['hopd'], label: { en: 'Emergency room visit, moderately severe problem', es: 'Visita a la sala de emergencias, problema moderadamente grave' }, hcpcs2: [], coverage: 'er-visit' },
];
