'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'
import { invoices, type InvoiceStatus, calcTotals, formatEur } from '@/lib/data'
import { Plus } from 'lucide-react'

type Filter = 'Toutes' | InvoiceStatus

const FILTERS: Filter[] = ['Toutes', 'Payée', 'En attente', 'En retard']

export default function FacturesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Toutes')

  const filtered = activeFilter === 'Toutes'
    ? invoices
    : invoices.filter((inv) => inv.status === activeFilter)

  const totalPaid = invoices
    .filter((i) => i.status === 'Payée')
    .reduce((s, i) => s + calcTotals(i.lines).ttc, 0)

  const totalPending = invoices
    .filter((i) => i.status === 'En attente')
    .reduce((s, i) => s + calcTotals(i.lines).ttc, 0)

  const totalOverdue = invoices
    .filter((i) => i.status === 'En retard')
    .reduce((s, i) => s + calcTotals(i.lines).ttc, 0)

  return (
    <AppShell title="Factures" subtitle={`${invoices.length} factures`}>
      <div className="p-6 space-y-5">
        {/* Header action */}
        <div className="flex justify-end">
          <Link href="/factures/nouvelle" className="flex items-center gap-2 bg-[#4F7CFF] hover:bg-[#7b9fff] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={14} /> Nouvelle facture
          </Link>
        </div>
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-xs text-[#8B93A0] mb-1">Payées</p>
            <p className="text-lg font-bold text-emerald-400">{formatEur(totalPaid)}</p>
            <p className="text-xs text-[#555E6B] mt-0.5">{invoices.filter((i) => i.status === 'Payée').length} factures</p>
          </div>
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-xs text-[#8B93A0] mb-1">En attente</p>
            <p className="text-lg font-bold text-amber-400">{formatEur(totalPending)}</p>
            <p className="text-xs text-[#555E6B] mt-0.5">{invoices.filter((i) => i.status === 'En attente').length} factures</p>
          </div>
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-xs text-[#8B93A0] mb-1">En retard</p>
            <p className="text-lg font-bold text-red-400">{formatEur(totalOverdue)}</p>
            <p className="text-xs text-[#555E6B] mt-0.5">{invoices.filter((i) => i.status === 'En retard').length} facture</p>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeFilter === f
                  ? 'bg-[#4F7CFF] text-white'
                  : 'bg-[#0F1115] border border-white/[0.06] text-[#8B93A0] hover:text-[#F0F2F5] hover:border-white/[0.1]'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Numéro</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Client</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Émise le</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Échéance</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] px-5 py-3.5">Montant TTC</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] px-5 py-3.5">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const { ttc } = calcTotals(inv.lines)
                  return (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/factures/${inv.id}`}
                          className="text-sm font-medium text-[#4F7CFF] hover:underline"
                        >
                          {inv.number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#F0F2F5]">{inv.clientName}</td>
                      <td className="px-5 py-3.5 text-sm text-[#8B93A0]">{inv.date}</td>
                      <td className="px-5 py-3.5 text-sm text-[#8B93A0]">{inv.dueDate}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#F0F2F5] text-right">{formatEur(ttc)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusBadge status={inv.status} size="sm" />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#8B93A0] text-sm">Aucune facture dans cette catégorie.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  )
}
