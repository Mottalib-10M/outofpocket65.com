/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://us-medicare-costs.example";
export const SITE_NAMES: Record<string, string> = {"en": "Out of Pocket 65", "es": "Lo que Paga a los 65"};
export const LANG_TAGS: Record<string, string> = {"en": "en-US", "es": "es-US"};
export const OG_LOCALES: Record<string, string> = {"en": "en_US", "es": "es_US"};
export const LOCALE_TAG = 'en-US';
export const CURRENCY = 'USD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-24';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Independent publisher of service-by-service Medicare cost estimates built from CMS fee schedules", "es": "Editor independiente de estimaciones de costos de Medicare servicio por servicio, a partir de los baremos de CMS"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners reads the payment files that CMS publishes every quarter (the physician fee schedule with its 109 local price areas, the hospital outpatient and surgery center rates, the equipment fee schedule for each state and the ambulance rates) and turns them into what one service actually costs you: the Medicare-approved amount, the part of your Part B deductible it uses, your 20% or hospital copayment, and what a Medigap policy or your own Advantage plan changes. Coverage rules come from medicare.gov and the federal regulations, each with its page. The site sells no plan, refers no one to an agent, asks for no ZIP code or phone number and is not affiliated with CMS or Medicare.gov. It gives prices, never medical advice.", "es": "Radif Partners lee los archivos de pago que CMS publica cada trimestre (el baremo de los médicos con sus 109 zonas de precios, las tarifas de los hospitales ambulatorios y de los centros de cirugía, el baremo de equipos de cada estado y las tarifas de ambulancia) y los convierte en lo que un servicio le cuesta de verdad: el monto aprobado por Medicare, la parte del deducible de la Parte B que consume, su 20 % o el copago del hospital, y lo que cambia una póliza Medigap o su propio plan Advantage. Las reglas de cobertura salen de medicare.gov y de la normativa federal, cada una con su página. El sitio no vende planes, no le envía a ningún agente, no pide código postal ni teléfono y no está afiliado a CMS ni a Medicare.gov. Da precios, nunca consejos médicos."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["Original Medicare Part A and Part B cost sharing", "Medicare physician fee schedule and geographic price areas", "Hospital outpatient and ambulatory surgical center payment rates", "Durable medical equipment rental rules", "Medigap standardized plan benefits", "Medicare coverage rules for preventive and screening services"], "es": ["Costos compartidos de las Partes A y B de Medicare Original", "Baremo de médicos de Medicare y zonas geográficas de precios", "Tarifas de hospitales ambulatorios y centros de cirugía ambulatoria", "Reglas de alquiler de equipo médico duradero", "Beneficios de los planes Medigap estandarizados", "Reglas de cobertura de Medicare para servicios preventivos y de detección"]};
export const CONTACT_EMAIL = "contact@us-medicare-costs.example";
export const THEME_COLOR = '#1E5B8C';
export const LOGO_SYMBOL = '20%';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'b24a3d96d1139dd4f7753f274f3023d0';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',  // vide : comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];  // forme juridique non publiée, comme sur les autres sites du portefeuille

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
