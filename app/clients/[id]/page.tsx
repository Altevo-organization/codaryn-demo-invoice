'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'
import { clients, invoices, quotes, calcTotals, formatEur } from '@/lib/data'

export default function ClientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return (
      <AppShell title="Client introuvable">
        <div className="p-6">
          <Link href="/clients" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-6">
            <ArrowLeft size={16} />
            Retour aux clients
          </Link>
          <p className="text-[#8B93A0]">Ce client n&apos;existe pas.</p>
        </div>
      </AppShell>
    )
  }

  const clientInvoices = invoices.filter((inv) => inv.clientId === id)
  const clientQuotes = quotes.filter((q) => q.clientId === id)

  return (
    <AppShell title={client.name} subtitle="Fiche client">
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/clients" className="flex items-center gap-2 text-[#8B93A0] hover:text-[#F0F2F5] text-sm mb-5 w-fit">
            <ArrowLeft size={16} />
            Retour aux clients
          </Link>

          {/* Client header card */}
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4F7CFF]/10 flex items-center justify-center shrink-0">
                <span className="text-[#4F7CFF] text-lg font-bold">
                  {client.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-[#F0F2F5]">{client.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-[#555E6B]" />
                    <span className="text-sm text-[#8B93A0]">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-[#555E6B]" />
                    <span className="text-sm text-[#8B93A0]">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#555E6B]" />
                    <span className="text-sm text-[#8B93A0]">{client.city}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-[#F0F2F5]">{formatEur(client.totalBilled)}</p>
                <p className="text-xs text-[#555E6B] mt-0.5">CA total facturé</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/[0.06]">
              <div>
                <p className="text-xs text-[#555E6B]">Factures</p>
                <p className="text-lg font-semibold text-[#F0F2F5] mt-0.5">{clientInvoices.length}</p>
              </div>
              <div>
                <p className="text-xs text-[#555E6B]">Devis</p>
                <p className="text-lg font-semibold text-[#F0F2F5] mt-0.5">{clientQuotes.length}</p>
              </div>
              <div>
                <p className="text-xs text-[#555E6B]">Dernière activité</p>
                <p className="text-sm font-medium text-[#F0F2F5] mt-0.5">{client.lastActivity}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Invoices */}
        {clientInvoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4">Factures</h3>
            <div className="space-y-2">
              {clientInvoices.map((inv) => {
                const { ttc } = calcTotals(inv.lines)
                return (
                  <Link
                    key={inv.id}
                    href={`/factures/${inv.id}`}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F0F2F5] group-hover:text-white">{inv.number}</p>
                      <p className="text-xs text-[#555E6B]">Émise le {inv.date} · Échéance {inv.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#F0F2F5]">{formatEur(ttc)}</span>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Quotes */}
        {clientQuotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4">Devis</h3>
            <div className="space-y-2">
              {clientQuotes.map((q) => {
                const { ttc } = calcTotals(q.lines)
                return (
                  <Link
                    key={q.id}
                    href={`/devis/${q.id}`}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F0F2F5] group-hover:text-white">{q.number}</p>
                      <p className="text-xs text-[#555E6B]">Émis le {q.date} · Expire le {q.expiryDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#F0F2F5]">{formatEur(ttc)}</span>
                      <StatusBadge status={q.status} size="sm" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}

        {clientInvoices.length === 0 && clientQuotes.length === 0 && (
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-8 text-center">
            <Building2 size={32} className="text-[#555E6B] mx-auto mb-3" />
            <p className="text-[#8B93A0]">Aucune activité pour ce client.</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
