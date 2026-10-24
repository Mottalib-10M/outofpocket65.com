import type { Locale } from './routes';
const en = {
  updatedOn: 'CMS rates checked on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Costs computed by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Questions people on Medicare ask', relatedCalculators: 'Price another service', sourcesTitle: 'CMS files and Medicare.gov pages behind this page', writtenBy: 'Written by',
  asOf: 'Medicare amounts for', lastUpdated: 'CMS files of October 2026, last checked on',
  footerValidated: 'Every amount is computed from a CMS payment file',
  footerBrowser: 'Costs are worked out in your browser · nothing you enter is sent · no ZIP code, no phone number, no plan for sale',
  footerDisclaimer: 'Out of Pocket 65 is an independent site published by Radif Partners. It is not affiliated with CMS, Medicare.gov or any insurer and sells no plan. Amounts are estimates from public fee schedules: your bill depends on what your provider codes and on your plan. This is cost information, not medical advice.',
  footerPopular: 'Does Medicare cover it?',
  notFound: 'There is no page at this address. The cost estimator for any service is on the home page.',
  readMore: 'Read more', back: 'Home',
  disclaimer: 'Estimates from CMS fee schedules; your bill depends on the codes your provider uses and on your plan.',
};
const es: typeof en = {
  updatedOn: 'Tarifas de CMS revisadas el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Costos calculados por',
  skipToContent: 'Ir al contenido', mainNav: 'Navegación principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir menú',
  faqTitle: 'Preguntas de las personas con Medicare', relatedCalculators: 'Calcular otro servicio', sourcesTitle: 'Archivos de CMS y páginas de Medicare.gov de esta página', writtenBy: 'Escrito por',
  asOf: 'Montos de Medicare de', lastUpdated: 'archivos de CMS de octubre de 2026, revisados el',
  footerValidated: 'Cada monto se calcula a partir de un archivo de pagos de CMS',
  footerBrowser: 'Los costos se calculan en su navegador · nada de lo que escribe se envía · sin código postal, sin teléfono, sin planes a la venta',
  footerDisclaimer: 'Lo que Paga a los 65 es un sitio independiente publicado por Radif Partners. No está afiliado a CMS, a Medicare.gov ni a ninguna aseguradora y no vende planes. Los montos son estimaciones a partir de baremos públicos: su factura depende de los códigos que use su proveedor y de su plan. Son cifras orientativas que no sustituyen el consejo médico.',
  footerPopular: '¿Medicare lo cubre?',
  notFound: 'No hay ninguna página en esta dirección. La calculadora de costos de cualquier servicio está en la página de inicio.',
  readMore: 'Leer más', back: 'Inicio',
  disclaimer: 'Estimaciones orientativas a partir de los baremos de CMS, que no sustituyen el consejo de su médico; su factura depende de los códigos que use su proveedor y de su plan.',
};
export function t(lang: Locale) { return lang === 'es' ? es : en; }
