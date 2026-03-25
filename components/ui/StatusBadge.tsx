'use client'

import type { InvoiceStatus, QuoteStatus } from '@/lib/data'

type Status = InvoiceStatus | QuoteStatus

const statusConfig: Record<Status, { label: string; className: string }> = {
  'Payée': {
    label: 'Payée',
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  'En attente': {
    label: 'En attente',
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
  'En retard': {
    label: 'En retard',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  'Accepté': {
    label: 'Accepté',
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  'Refusé': {
    label: 'Refusé',
    className: 'bg-red-500/10 text-red-400 border border-red-500/20',
  },
  'Expiré': {
    label: 'Expiré',
    className: 'bg-[#8B93A0]/10 text-[#8B93A0] border border-white/10',
  },
}

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-white/5 text-[#8B93A0] border border-white/10',
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  )
}
