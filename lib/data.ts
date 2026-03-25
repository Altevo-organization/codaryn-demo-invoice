export const agency = {
  name: 'Agence Pixel',
  email: 'contact@agencepixel.fr',
  phone: '+33 1 23 45 67 89',
  address: '12 rue du Design, 75011 Paris',
  siret: '123 456 789 00012',
  tvaNumber: 'FR12345678900',
}

export const clients = [
  { id: 'c1', name: 'Atelier Dubois', email: 'contact@atelierdubois.fr', phone: '+33 1 42 86 12 34', city: 'Paris', invoiceCount: 4, totalBilled: 14600, lastActivity: 'Mars 2025' },
  { id: 'c2', name: 'Nexia Corp', email: 'finance@nexia.fr', phone: '+33 1 56 78 90 12', city: 'Lyon', invoiceCount: 3, totalBilled: 9800, lastActivity: 'Fév 2025' },
  { id: 'c3', name: 'Studio Blanc', email: 'hello@studioblanc.co', phone: '+33 6 12 34 56 78', city: 'Bordeaux', invoiceCount: 2, totalBilled: 5200, lastActivity: 'Jan 2025' },
  { id: 'c4', name: 'TechStart SAS', email: 'ops@techstart.io', phone: '+33 7 23 45 67 89', city: 'Paris', invoiceCount: 1, totalBilled: 3500, lastActivity: 'Mars 2025' },
  { id: 'c5', name: 'Maison Lebrun', email: 'direction@maisonlebrun.fr', phone: '+33 3 45 67 89 01', city: 'Strasbourg', invoiceCount: 2, totalBilled: 4200, lastActivity: 'Fév 2025' },
]

export type InvoiceStatus = 'Payée' | 'En attente' | 'En retard'
export type QuoteStatus = 'Accepté' | 'En attente' | 'Refusé' | 'Expiré'

export interface InvoiceLine {
  label: string
  qty: number
  unit: number
  tva: number
}

export interface Invoice {
  id: string
  number: string
  clientId: string
  clientName: string
  date: string
  dueDate: string
  status: InvoiceStatus
  lines: InvoiceLine[]
}

export interface Quote {
  id: string
  number: string
  clientId: string
  clientName: string
  date: string
  expiryDate: string
  status: QuoteStatus
  lines: InvoiceLine[]
}

export const invoices: Invoice[] = [
  {
    id: 'inv-001', number: 'FAC-2025-001', clientId: 'c1', clientName: 'Atelier Dubois',
    date: '31 jan 2025', dueDate: '28 fév 2025', status: 'Payée',
    lines: [
      { label: 'Développement frontend', qty: 12, unit: 250, tva: 20 },
      { label: 'Intégration API', qty: 4, unit: 250, tva: 20 },
      { label: 'Déploiement staging', qty: 1, unit: 200, tva: 20 },
    ],
  },
  {
    id: 'inv-002', number: 'FAC-2025-002', clientId: 'c1', clientName: 'Atelier Dubois',
    date: '28 fév 2025', dueDate: '28 mar 2025', status: 'Payée',
    lines: [
      { label: 'Configurateur 3D', qty: 10, unit: 280, tva: 20 },
      { label: 'Maquettes UI mobile', qty: 2, unit: 300, tva: 20 },
    ],
  },
  {
    id: 'inv-003', number: 'FAC-2025-003', clientId: 'c1', clientName: 'Atelier Dubois',
    date: '31 mar 2025', dueDate: '30 avr 2025', status: 'En attente',
    lines: [
      { label: 'Intégration paiement Stripe', qty: 10, unit: 280, tva: 20 },
      { label: 'Développement mobile v1', qty: 6, unit: 250, tva: 20 },
    ],
  },
  {
    id: 'inv-004', number: 'FAC-2025-004', clientId: 'c2', clientName: 'Nexia Corp',
    date: '15 jan 2025', dueDate: '14 fév 2025', status: 'Payée',
    lines: [
      { label: 'Audit infrastructure', qty: 8, unit: 300, tva: 20 },
      { label: 'Rapport de recommandations', qty: 4, unit: 250, tva: 20 },
    ],
  },
  {
    id: 'inv-005', number: 'FAC-2025-005', clientId: 'c2', clientName: 'Nexia Corp',
    date: '28 fév 2025', dueDate: '28 mar 2025', status: 'En retard',
    lines: [
      { label: 'Refonte dashboard analytics', qty: 14, unit: 280, tva: 20 },
      { label: 'Tests & recette', qty: 4, unit: 200, tva: 20 },
    ],
  },
  {
    id: 'inv-006', number: 'FAC-2025-006', clientId: 'c3', clientName: 'Studio Blanc',
    date: '10 jan 2025', dueDate: '9 fév 2025', status: 'Payée',
    lines: [
      { label: 'Site vitrine Next.js', qty: 8, unit: 300, tva: 20 },
      { label: 'Intégration CMS', qty: 4, unit: 250, tva: 20 },
    ],
  },
  {
    id: 'inv-007', number: 'FAC-2025-007', clientId: 'c4', clientName: 'TechStart SAS',
    date: '20 mar 2025', dueDate: '19 avr 2025', status: 'En attente',
    lines: [
      { label: 'MVP plateforme SaaS', qty: 10, unit: 280, tva: 20 },
      { label: 'Setup CI/CD', qty: 3, unit: 300, tva: 20 },
    ],
  },
]

export const quotes: Quote[] = [
  {
    id: 'q-001', number: 'DEV-2025-001', clientId: 'c1', clientName: 'Atelier Dubois',
    date: '5 jan 2025', expiryDate: '5 fév 2025', status: 'Accepté',
    lines: [
      { label: 'Plateforme e-commerce complète', qty: 1, unit: 18000, tva: 20 },
    ],
  },
  {
    id: 'q-002', number: 'DEV-2025-002', clientId: 'c2', clientName: 'Nexia Corp',
    date: '10 jan 2025', expiryDate: '10 fév 2025', status: 'Accepté',
    lines: [
      { label: 'Refonte dashboard + audit', qty: 1, unit: 9800, tva: 20 },
    ],
  },
  {
    id: 'q-003', number: 'DEV-2025-003', clientId: 'c5', clientName: 'Maison Lebrun',
    date: '1 mar 2025', expiryDate: '1 avr 2025', status: 'En attente',
    lines: [
      { label: 'Application mobile iOS/Android', qty: 1, unit: 12000, tva: 20 },
    ],
  },
  {
    id: 'q-004', number: 'DEV-2025-004', clientId: 'c4', clientName: 'TechStart SAS',
    date: '15 mar 2025', expiryDate: '15 avr 2025', status: 'En attente',
    lines: [
      { label: 'MVP SaaS v2', qty: 1, unit: 8500, tva: 20 },
      { label: 'Design system', qty: 1, unit: 2500, tva: 20 },
    ],
  },
  {
    id: 'q-005', number: 'DEV-2024-012', clientId: 'c3', clientName: 'Studio Blanc',
    date: '1 nov 2024', expiryDate: '1 déc 2024', status: 'Expiré',
    lines: [
      { label: 'Refonte complète site + branding', qty: 1, unit: 7500, tva: 20 },
    ],
  },
]

export const monthlyRevenue = [
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 4100 },
  { month: 'Déc', amount: 2800 },
  { month: 'Jan', amount: 7400 },
  { month: 'Fév', amount: 9600 },
  { month: 'Mar', amount: 6300 },
]

export function calcTotals(lines: InvoiceLine[]) {
  const ht = lines.reduce((sum, l) => sum + l.qty * l.unit, 0)
  const tva = lines.reduce((sum, l) => sum + l.qty * l.unit * (l.tva / 100), 0)
  const ttc = ht + tva
  return { ht, tva, ttc }
}

export function formatEur(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}
