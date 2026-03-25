'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import StatCard from '@/components/ui/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import RevenueChart from '@/components/ui/RevenueChart'
import { invoices, quotes, monthlyRevenue, calcTotals, formatEur } from '@/lib/data'

export default function DashboardPage() {
  const totalCA = invoices.reduce((sum, inv) => {
    const { ttc } = calcTotals(inv.lines)
    return sum + ttc
  }, 0)

  const totalPaid = invoices
    .filter((inv) => inv.status === 'Payée')
    .reduce((sum, inv) => {
      const { ttc } = calcTotals(inv.lines)
      return sum + ttc
    }, 0)

  const totalPending = invoices
    .filter((inv) => inv.status === 'En attente')
    .reduce((sum, inv) => {
      const { ttc } = calcTotals(inv.lines)
      return sum + ttc
    }, 0)

  const totalOverdue = invoices
    .filter((inv) => inv.status === 'En retard')
    .reduce((sum, inv) => {
      const { ttc } = calcTotals(inv.lines)
      return sum + ttc
    }, 0)

  const recentInvoices = [...invoices].slice(-4).reverse()
  const recentQuotes = [...quotes].slice(-4).reverse()

  return (
    <AppShell title="Dashboard" subtitle="Bienvenue, Agence Pixel">
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="CA Total (TTC)"
            value={formatEur(totalCA)}
            subtitle="7 factures émises"
            icon={TrendingUp}
            iconColor="#4F7CFF"
            delay={0}
          />
          <StatCard
            title="Montant payé"
            value={formatEur(totalPaid)}
            subtitle={`${invoices.filter((i) => i.status === 'Payée').length} factures`}
            icon={CheckCircle}
            iconColor="#10b981"
            delay={0.05}
          />
          <StatCard
            title="En attente"
            value={formatEur(totalPending)}
            subtitle={`${invoices.filter((i) => i.status === 'En attente').length} factures`}
            icon={Clock}
            iconColor="#f59e0b"
            delay={0.1}
          />
          <StatCard
            title="En retard"
            value={formatEur(totalOverdue)}
            subtitle={`${invoices.filter((i) => i.status === 'En retard').length} facture`}
            icon={AlertCircle}
            iconColor="#ef4444"
            delay={0.15}
          />
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-[#F0F2F5]">Revenus mensuels</h2>
              <p className="text-xs text-[#8B93A0] mt-0.5">6 derniers mois</p>
            </div>
            <span className="text-xs text-[#4F7CFF] font-medium">HT</span>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </motion.div>

        {/* Recent lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#F0F2F5]">Factures récentes</h2>
              <Link
                href="/factures"
                className="text-xs text-[#4F7CFF] hover:underline flex items-center gap-1"
              >
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentInvoices.map((inv) => {
                const { ttc } = calcTotals(inv.lines)
                return (
                  <Link
                    key={inv.id}
                    href={`/factures/${inv.id}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F0F2F5] group-hover:text-white">{inv.number}</p>
                      <p className="text-xs text-[#555E6B]">{inv.clientName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#F0F2F5]">{formatEur(ttc)}</span>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Quotes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#F0F2F5]">Devis récents</h2>
              <Link
                href="/devis"
                className="text-xs text-[#4F7CFF] hover:underline flex items-center gap-1"
              >
                Voir tout <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentQuotes.map((q) => {
                const { ttc } = calcTotals(q.lines)
                return (
                  <Link
                    key={q.id}
                    href={`/devis/${q.id}`}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#F0F2F5] group-hover:text-white">{q.number}</p>
                      <p className="text-xs text-[#555E6B]">{q.clientName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#F0F2F5]">{formatEur(ttc)}</span>
                      <StatusBadge status={q.status} size="sm" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  )
}
