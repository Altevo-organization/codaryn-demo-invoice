'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download, Receipt } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'
import { invoices, agency, clients, calcTotals, formatEur } from '@/lib/data'

export default function InvoiceDetailPage() {
  const params = useParams()
  const id = params.id as string

  const invoice = invoices.find((inv) => inv.id === id)

  if (!invoice) {
    return (
      <AppShell title="Facture introuvable">
        <div className="p-6">
          <Link href="/factures" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-6">
            <ArrowLeft size={16} />
            Retour aux factures
          </Link>
          <p className="text-[#8B93A0]">Cette facture n&apos;existe pas.</p>
        </div>
      </AppShell>
    )
  }

  const client = clients.find((c) => c.id === invoice.clientId)
  const { ht, tva, ttc } = calcTotals(invoice.lines)

  return (
    <AppShell title={invoice.number} subtitle="Détail de la facture">
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/factures" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-5 w-fit">
            <ArrowLeft size={16} />
            Retour aux factures
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden max-w-3xl"
        >
          {/* Invoice header */}
          <div className="p-6 border-b border-white/[0.06] bg-gradient-to-r from-[#4F7CFF]/5 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4F7CFF] flex items-center justify-center">
                    <Receipt size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#555E6B]">FACTURE</p>
                    <h2 className="text-lg font-bold text-[#F0F2F5] leading-tight">{invoice.number}</h2>
                  </div>
                </div>
                <div className="mt-2">
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#555E6B] mb-1">Montant total TTC</p>
                <p className="text-3xl font-bold text-[#F0F2F5]">{formatEur(ttc)}</p>
              </div>
            </div>
          </div>

          {/* Agency + Client */}
          <div className="grid grid-cols-2 gap-6 p-6 border-b border-white/[0.06]">
            <div>
              <p className="text-xs text-[#555E6B] uppercase tracking-wide mb-2">Émetteur</p>
              <p className="text-sm font-bold text-[#F0F2F5]">{agency.name}</p>
              <p className="text-xs text-[#8B93A0] mt-1 leading-relaxed">{agency.address}</p>
              <p className="text-xs text-[#8B93A0]">{agency.email}</p>
              <p className="text-xs text-[#8B93A0]">{agency.phone}</p>
              <div className="mt-2 space-y-0.5">
                <p className="text-xs text-[#555E6B]">SIRET : {agency.siret}</p>
                <p className="text-xs text-[#555E6B]">TVA : {agency.tvaNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#555E6B] uppercase tracking-wide mb-2">Facturé à</p>
              <p className="text-sm font-bold text-[#F0F2F5]">{invoice.clientName}</p>
              {client && (
                <div className="mt-1 space-y-0.5">
                  <p className="text-xs text-[#8B93A0]">{client.city}</p>
                  <p className="text-xs text-[#8B93A0]">{client.email}</p>
                  <p className="text-xs text-[#8B93A0]">{client.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice meta */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
            <div>
              <p className="text-xs text-[#555E6B]">Date d&apos;émission</p>
              <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">{invoice.date}</p>
            </div>
            <div>
              <p className="text-xs text-[#555E6B]">Date d&apos;échéance</p>
              <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">{invoice.dueDate}</p>
            </div>
            <div>
              <p className="text-xs text-[#555E6B]">Conditions de paiement</p>
              <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">30 jours nets</p>
            </div>
          </div>

          {/* Line items */}
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-[#555E6B] pb-3 pr-4">Désignation</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3 px-2">Qté</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3 px-2">P.U. HT</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3 px-2">TVA</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] pb-3">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    <td className="py-3.5 pr-4 text-sm text-[#F0F2F5]">{line.label}</td>
                    <td className="py-3.5 px-2 text-sm text-[#8B93A0] text-right">{line.qty}</td>
                    <td className="py-3.5 px-2 text-sm text-[#8B93A0] text-right">{formatEur(line.unit)}</td>
                    <td className="py-3.5 px-2 text-sm text-[#8B93A0] text-right">{line.tva}%</td>
                    <td className="py-3.5 text-sm font-medium text-[#F0F2F5] text-right">
                      {formatEur(line.qty * line.unit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals block */}
            <div className="mt-6 max-w-xs ml-auto space-y-2 border-t border-white/[0.06] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B93A0]">Sous-total HT</span>
                <span className="text-[#F0F2F5]">{formatEur(ht)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8B93A0]">TVA 20%</span>
                <span className="text-[#F0F2F5]">{formatEur(tva)}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-white/[0.08]">
                <span className="font-bold text-[#F0F2F5] text-base">Total TTC</span>
                <span className="font-bold text-[#F0F2F5] text-base">{formatEur(ttc)}</span>
              </div>
            </div>
          </div>

          {/* Payment note */}
          <div className="mx-6 mb-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <p className="text-xs text-[#555E6B]">
              <span className="text-[#8B93A0] font-medium">Mode de règlement :</span> Virement bancaire — IBAN FR76 XXXX XXXX XXXX XXXX XXXX — Référence : {invoice.number}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <Download size={16} />
              Télécharger PDF
            </button>
            {invoice.status === 'En attente' || invoice.status === 'En retard' ? (
              <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                Marquer comme payée
              </button>
            ) : null}
            <button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-[#8B93A0] text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              Envoyer par email
            </button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
