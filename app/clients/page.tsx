'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, Mail, Phone, ChevronRight } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { clients, formatEur } from '@/lib/data'

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell title="Clients" subtitle={`${clients.length} clients`}>
      <div className="p-6 space-y-5">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555E6B]" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-[#0F1115] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F0F2F5] placeholder-[#555E6B] focus:outline-none focus:border-[#4F7CFF]/40 transition-colors"
          />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4 text-center">
            <p className="text-xl font-semibold text-[#F0F2F5]">{clients.length}</p>
            <p className="text-xs text-[#8B93A0] mt-0.5">Clients actifs</p>
          </div>
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4 text-center">
            <p className="text-xl font-semibold text-[#F0F2F5]">
              {formatEur(clients.reduce((s, c) => s + c.totalBilled, 0))}
            </p>
            <p className="text-xs text-[#8B93A0] mt-0.5">CA total facturé</p>
          </div>
          <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-4 text-center">
            <p className="text-xl font-semibold text-[#F0F2F5]">
              {clients.reduce((s, c) => s + c.invoiceCount, 0)}
            </p>
            <p className="text-xs text-[#8B93A0] mt-0.5">Factures totales</p>
          </div>
        </motion.div>

        {/* Client cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={`/clients/${client.id}`}
                className="block bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5 hover:border-[#4F7CFF]/30 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4F7CFF]/10 flex items-center justify-center">
                      <span className="text-[#4F7CFF] text-sm font-semibold">
                        {client.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F0F2F5] group-hover:text-white">{client.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#555E6B]" />
                        <span className="text-xs text-[#555E6B]">{client.city}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#555E6B] group-hover:text-[#4F7CFF] transition-colors" />
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-[#555E6B] shrink-0" />
                    <span className="text-xs text-[#8B93A0] truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#555E6B] shrink-0" />
                    <span className="text-xs text-[#8B93A0]">{client.phone}</span>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#555E6B]">CA facturé</p>
                    <p className="text-sm font-semibold text-[#F0F2F5]">{formatEur(client.totalBilled)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#555E6B]">Factures</p>
                    <p className="text-sm font-semibold text-[#F0F2F5]">{client.invoiceCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#555E6B]">Dernière activité</p>
                    <p className="text-xs text-[#8B93A0]">{client.lastActivity}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8B93A0]">Aucun client trouvé pour &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
