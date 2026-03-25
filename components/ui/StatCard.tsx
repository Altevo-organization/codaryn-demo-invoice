'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  delay?: number
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#4F7CFF',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8B93A0]">{title}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#F0F2F5]">{value}</p>
        {subtitle && <p className="text-xs text-[#555E6B] mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
