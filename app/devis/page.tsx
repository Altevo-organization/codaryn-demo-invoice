'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'
import { quotes, calcTotals, formatEur } from '@/lib/data'

export default function DevisPage() {
  const total = quotes.reduce((sum, q) => {
    const { ttc } = calcTotals(q.lines)
    return sum + ttc
  }, 0)

  const accepted = quotes.filter((q) => q.status === 'Accepté')
  const pending = quotes.filter((q) => q.status === 'En attente')

  return (
    <AppShell title="Devis" subtitle={`${quotes.length} devis`}>
      <div className="p-6 space-y-5">
        {/* Header actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex gap-3">
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-xl px-4 py-2.5 text-center">
              <p className="text-lg font-semibold text-[#F0F2F5]">{accepted.length}</p>
              <p className="text-xs text-[#8B93A0]">Acceptés</p>
            </div>
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-xl px-4 py-2.5 text-center">
              <p className="text-lg font-semibold text-[#F0F2F5]">{pending.length}</p>
              <p className="text-xs text-[#8B93A0]">En attente</p>
            </div>
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-xl px-4 py-2.5 text-center">
              <p className="text-lg font-semibold text-[#F0F2F5]">{formatEur(total)}</p>
              <p className="text-xs text-[#8B93A0]">Valeur totale</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#4F7CFF] hover:bg-[#4F7CFF]/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} />
            Nouveau devis
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Numéro</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Client</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Date</th>
                  <th className="text-left text-xs font-medium text-[#555E6B] px-5 py-3.5">Expiration</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] px-5 py-3.5">Montant TTC</th>
                  <th className="text-right text-xs font-medium text-[#555E6B] px-5 py-3.5">Statut</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q, i) => {
                  const { ttc } = calcTotals(q.lines)
                  return (
                    <motion.tr
                      key={q.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/devis/${q.id}`}
                          className="text-sm font-medium text-[#4F7CFF] hover:underline"
                        >
                          {q.number}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#F0F2F5]">{q.clientName}</td>
                      <td className="px-5 py-3.5 text-sm text-[#8B93A0]">{q.date}</td>
                      <td className="px-5 py-3.5 text-sm text-[#8B93A0]">{q.expiryDate}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[#F0F2F5] text-right">{formatEur(ttc)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusBadge status={q.status} size="sm" />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
