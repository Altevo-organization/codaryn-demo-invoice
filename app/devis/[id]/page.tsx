'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText, ArrowRightCircle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'
import { quotes, agency, clients, calcTotals, formatEur } from '@/lib/data'

export default function QuoteDetailPage() {
  const params = useParams()
  const id = params.id as string

  const quote = quotes.find((q) => q.id === id)

  if (!quote) {
    return (
      <AppShell title="Devis introuvable">
        <div className="p-6">
          <Link href="/devis" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-6">
            <ArrowLeft size={16} />
            Retour aux devis
          </Link>
          <p className="text-[#8B93A0]">Ce devis n&apos;existe pas.</p>
        </div>
      </AppShell>
    )
  }

  const client = clients.find((c) => c.id === quote.clientId)
  const { ht, tva, ttc } = calcTotals(quote.lines)

  return (
    <AppShell title={quote.number} subtitle="Détail du devis">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/devis" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-5 w-fit">
            <ArrowLeft size={16} />
            Retour aux devis
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden max-w-3xl"
        >
          {/* Document header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={20} className="text-[#4F7CFF]" />
                  <h2 className="text-xl font-bold text-[#F0F2F5]">{quote.number}</h2>
                </div>
                <StatusBadge status={quote.status} />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#F0F2F5]">{formatEur(ttc)}</p>
                <p className="text-xs text-[#555E6B] mt-1">TTC</p>
              </div>
            </div>
          </div>

          {/* Agency + Client info */}
          <div className="grid grid-cols-2 gap-6 p-6 border-b border-white/[0.06]">
            <div>
              <p className="text-xs text-[#555E6B] uppercase tracking-wide mb-2">Émetteur</p>
              <p className="text-sm font-semibold text-[#F0F2F5]">{agency.name}</p>
              <p className="text-xs text-[#8B93A0] mt-1">{agency.address}</p>
              <p className="text-xs text-[#8B93A0]">{agency.email}</p>
              <p className="text-xs text-[#555E6B] mt-1">SIRET : {agency.siret}</p>
              <p className="text-xs text-[#555E6B]">N° TVA : {agency.tvaNumber}</p>
            </div>
            <div>
              <p className="text-xs text-[#555E6B] uppercase tracking-wide mb-2">Client</p>
              <p className="text-sm font-semibold text-[#F0F2F5]">{quote.clientName}</p>
              {client && (
                <>
                  <p className="text-xs text-[#8B93A0] mt-1">{client.city}</p>
                  <p className="text-xs text-[#8B93A0]">{client.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
            <div>
              <p className="text-xs text-[#555E6B]">Date d&apos;émission</p>
              <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">{quote.date}</p>
            </div>
            <div>
              <p className="text-xs text-[#555E6B]">Date d&apos;expiration</p>
              <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">{quote.expiryDate}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-[#555E6B] pb-3">Désignation</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3">Qté</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3">P.U. HT</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3">TVA</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {quote.lines.map((line, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    <td className="py-3 text-sm text-[#F0F2F5]">{line.label}</td>
                    <td className="py-3 text-sm text-[#8B93A0] text-right">{line.qty}</td>
                    <td className="py-3 text-sm text-[#8B93A0] text-right">{formatEur(line.unit)}</td>
                    <td className="py-3 text-sm text-[#8B93A0] text-right">{line.tva}%</td>
                    <td className="py-3 text-sm font-medium text-[#F0F2F5] text-right">
                      {formatEur(line.qty * line.unit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 max-w-xs ml-auto">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8B93A0]">Sous-total HT</span>
                <span className="text-sm text-[#F0F2F5]">{formatEur(ht)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8B93A0]">TVA (20%)</span>
                <span className="text-sm text-[#F0F2F5]">{formatEur(tva)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span className="text-sm font-semibold text-[#F0F2F5]">Total TTC</span>
                <span className="text-base font-bold text-[#F0F2F5]">{formatEur(ttc)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <ArrowRightCircle size={16} />
              Convertir en facture
            </button>
            <button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-[#F0F2F5] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              Télécharger PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
