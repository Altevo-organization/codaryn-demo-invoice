'use client'

import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0B0B0C]/80 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-[#F0F2F5]">{title}</h1>
        {subtitle && <p className="text-sm text-[#8B93A0]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#8B93A0] hover:text-[#F0F2F5] transition-colors">
          <Bell size={16} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-[#4F7CFF]/20 border border-[#4F7CFF]/20 flex items-center justify-center">
          <span className="text-[#4F7CFF] text-sm font-semibold">AP</span>
        </div>
      </div>
    </header>
  )
}
