'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { clients, agency, formatEur } from '@/lib/data'
import {
  ArrowLeft, Plus, Trash2, Save, Eye, ChevronDown,
  Building2, Calendar, Hash, FileText,
} from 'lucide-react'

interface Line {
  label: string
  qty: string
  unit: string
  tva: string
}

const emptyLine = (): Line => ({ label: '', qty: '1', unit: '', tva: '20' })

function calcLine(l: Line) {
  const q = parseFloat(l.qty) || 0
  const u = parseFloat(l.unit) || 0
  const t = parseFloat(l.tva) || 0
  const ht = q * u
  const tvaAmt = ht * (t / 100)
  return { ht, tvaAmt, ttc: ht + tvaAmt }
}

function calcTotals(lines: Line[]) {
  const ht = lines.reduce((s, l) => s + calcLine(l).ht, 0)
  const tva = lines.reduce((s, l) => s + calcLine(l).tvaAmt, 0)
  return { ht, tva, ttc: ht + tva }
}

type View = 'form' | 'preview'

export default function NewInvoicePage() {
  const router = useRouter()
  const [view, setView] = useState<View>('form')
  const [clientId, setClientId] = useState('')
  const [number, setNumber] = useState('FAC-2025-008')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [dueDate, setDueDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('30')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [saved, setSaved] = useState(false)

  const selectedClient = clients.find((c) => c.id === clientId)
  const { ht, tva, ttc } = calcTotals(lines)

  const updateLine = (i: number, field: keyof Line, value: string) => {
    setLines((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }
  const addLine = () => setLines((prev) => [...prev, emptyLine()])
  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => router.push('/factures'), 1200)
  }

  const isValid = clientId && lines.some((l) => l.label && l.unit)

  // Compute due date from payment terms
  const computedDueDate = () => {
    if (!date) return ''
    const d = new Date(date)
    d.setDate(d.getDate() + parseInt(paymentTerms || '30'))
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const displayDate = date
    ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <AppShell title="Nouvelle facture">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back + tabs */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/factures" className="flex items-center gap-1.5 text-xs text-[#8B93A0] hover:text-[#F0F2F5] transition-colors font-medium">
            <ArrowLeft size={13} />
            Retour aux factures
          </Link>
          <div className="flex bg-[#0F1115] border border-white/[0.06] rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'form' ? 'bg-[#4F7CFF] text-white' : 'text-[#8B93A0] hover:text-[#F0F2F5]'}`}
            >
              <FileText size={12} /> Édition
            </button>
            <button
              onClick={() => setView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === 'preview' ? 'bg-[#4F7CFF] text-white' : 'text-[#8B93A0] hover:text-[#F0F2F5]'}`}
            >
              <Eye size={12} /> Aperçu
            </button>
          </div>
        </div>

        {view === 'form' ? (
          <div className="space-y-5">
            {/* Header info */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Left: Invoice info */}
              <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#F0F2F5] flex items-center gap-2">
                  <Hash size={14} className="text-[#4F7CFF]" /> Informations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-[#555E6B] uppercase tracking-wide font-medium block mb-1.5">Numéro</label>
                    <input
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#F0F2F5] font-mono outline-none focus:border-[#4F7CFF]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#555E6B] uppercase tracking-wide font-medium block mb-1.5">Date d&apos;émission</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#F0F2F5] outline-none focus:border-[#4F7CFF]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#555E6B] uppercase tracking-wide font-medium block mb-1.5">Conditions de paiement</label>
                    <div className="relative">
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#F0F2F5] outline-none focus:border-[#4F7CFF]/50 transition-colors appearance-none"
                      >
                        <option value="0">Paiement immédiat</option>
                        <option value="15">15 jours</option>
                        <option value="30">30 jours nets</option>
                        <option value="45">45 jours</option>
                        <option value="60">60 jours</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555E6B] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#555E6B] uppercase tracking-wide font-medium block mb-1.5">Échéance calculée</label>
                    <div className="w-full bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-2 text-sm text-[#8B93A0]">
                      {computedDueDate() || '—'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Client */}
              <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-[#F0F2F5] flex items-center gap-2">
                  <Building2 size={14} className="text-[#4F7CFF]" /> Client
                </h3>
                <div className="relative">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-[#F0F2F5] outline-none focus:border-[#4F7CFF]/50 transition-colors appearance-none"
                  >
                    <option value="">Sélectionner un client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555E6B] pointer-events-none" />
                </div>
                {selectedClient && (
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 space-y-1">
                    <p className="text-sm font-semibold text-[#F0F2F5]">{selectedClient.name}</p>
                    <p className="text-xs text-[#8B93A0]">{selectedClient.email}</p>
                    <p className="text-xs text-[#8B93A0]">{selectedClient.phone}</p>
                    <p className="text-xs text-[#555E6B]">{selectedClient.city}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Line items */}
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F0F2F5]">Lignes de facturation</h3>
                <button
                  onClick={addLine}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#4F7CFF] hover:text-[#7b9fff] transition-colors"
                >
                  <Plus size={13} /> Ajouter une ligne
                </button>
              </div>

              <div className="p-5 space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 mb-1">
                  <span className="col-span-5 text-[10px] text-[#555E6B] uppercase tracking-wide font-medium">Désignation</span>
                  <span className="col-span-2 text-[10px] text-[#555E6B] uppercase tracking-wide font-medium text-right">Qté / Heures</span>
                  <span className="col-span-2 text-[10px] text-[#555E6B] uppercase tracking-wide font-medium text-right">P.U. HT (€)</span>
                  <span className="col-span-1 text-[10px] text-[#555E6B] uppercase tracking-wide font-medium text-right">TVA %</span>
                  <span className="col-span-2 text-[10px] text-[#555E6B] uppercase tracking-wide font-medium text-right">Total HT</span>
                </div>

                {lines.map((line, i) => {
                  const { ht: lineHt } = calcLine(line)
                  return (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-5">
                        <input
                          value={line.label}
                          onChange={(e) => updateLine(i, 'label', e.target.value)}
                          placeholder="Ex: Développement frontend"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F0F2F5] placeholder:text-[#555E6B] outline-none focus:border-[#4F7CFF]/50 transition-colors"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          value={line.qty}
                          onChange={(e) => updateLine(i, 'qty', e.target.value)}
                          type="number"
                          min="0"
                          step="0.5"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F0F2F5] text-right outline-none focus:border-[#4F7CFF]/50 transition-colors"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          value={line.unit}
                          onChange={(e) => updateLine(i, 'unit', e.target.value)}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F0F2F5] text-right outline-none focus:border-[#4F7CFF]/50 transition-colors"
                        />
                      </div>
                      <div className="col-span-1">
                        <div className="relative">
                          <select
                            value={line.tva}
                            onChange={(e) => updateLine(i, 'tva', e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-2 text-sm text-[#F0F2F5] text-right outline-none focus:border-[#4F7CFF]/50 transition-colors appearance-none"
                          >
                            <option value="0">0%</option>
                            <option value="5.5">5.5%</option>
                            <option value="10">10%</option>
                            <option value="20">20%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="text-sm font-medium text-[#F0F2F5] tabular-nums">
                          {lineHt > 0 ? formatEur(lineHt) : '—'}
                        </span>
                        {lines.length > 1 && (
                          <button
                            onClick={() => removeLine(i)}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[#555E6B] hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="px-5 pb-5 flex justify-end">
                <div className="w-72 space-y-2 border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B93A0]">Sous-total HT</span>
                    <span className="text-[#F0F2F5] tabular-nums">{formatEur(ht)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B93A0]">TVA</span>
                    <span className="text-[#F0F2F5] tabular-nums">{formatEur(tva)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-white/[0.08]">
                    <span className="text-[#F0F2F5]">Total TTC</span>
                    <span className="text-[#4F7CFF] tabular-nums">{formatEur(ttc)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl p-5">
              <label className="text-[11px] text-[#555E6B] uppercase tracking-wide font-medium block mb-2">Mentions / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Conditions de règlement, mentions légales supplémentaires, informations bancaires…"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#F0F2F5] placeholder:text-[#555E6B] outline-none focus:border-[#4F7CFF]/50 transition-colors resize-none"
              />
              <p className="text-[11px] text-[#555E6B] mt-2">
                Par défaut : &quot;Virement bancaire — IBAN FR76 XXXX XXXX XXXX XXXX — Pénalités de retard : 3× taux légal&quot;
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <Link
                href="/factures"
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-[#8B93A0] hover:text-[#F0F2F5] hover:bg-white/[0.04] transition-all font-medium"
              >
                Annuler
              </Link>
              <button
                onClick={() => setView('preview')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-[#F0F2F5] hover:bg-white/[0.09] transition-all font-medium"
              >
                <Eye size={14} />
                Aperçu
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saved}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  saved ? 'bg-emerald-500 text-white' :
                  isValid ? 'bg-[#4F7CFF] hover:bg-[#7b9fff] text-white' :
                  'bg-[#4F7CFF]/30 text-white/40 cursor-not-allowed'
                }`}
              >
                <Save size={14} />
                {saved ? 'Facture créée !' : 'Créer la facture'}
              </button>
            </div>
          </div>
        ) : (
          /* PREVIEW MODE — PDF-style */
          <div className="space-y-4">
            <div className="bg-[#0F1115] border border-white/[0.06] rounded-2xl overflow-hidden max-w-3xl mx-auto">
              {/* Preview header */}
              <div className="p-8 border-b border-white/[0.06] bg-gradient-to-br from-[#4F7CFF]/8 to-transparent">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4F7CFF] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">AP</span>
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#F0F2F5]">{agency.name}</p>
                        <p className="text-xs text-[#8B93A0]">{agency.address}</p>
                      </div>
                    </div>
                    <div className="text-xs text-[#555E6B] space-y-0.5 mt-2">
                      <p>SIRET : {agency.siret}</p>
                      <p>TVA : {agency.tvaNumber}</p>
                      <p>{agency.email} · {agency.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#555E6B] uppercase tracking-widest mb-1">Facture</p>
                    <p className="text-2xl font-bold text-[#F0F2F5] font-mono">{number}</p>
                    <div className="mt-2 space-y-1 text-right">
                      <p className="text-xs text-[#8B93A0]">Émise le <span className="text-[#F0F2F5] font-medium">{displayDate}</span></p>
                      <p className="text-xs text-[#8B93A0]">Échéance <span className="text-amber-400 font-medium">{computedDueDate()}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client block */}
              <div className="px-8 py-5 border-b border-white/[0.06]">
                <p className="text-[11px] text-[#555E6B] uppercase tracking-widest mb-2">Facturé à</p>
                {selectedClient ? (
                  <div>
                    <p className="text-sm font-bold text-[#F0F2F5]">{selectedClient.name}</p>
                    <p className="text-xs text-[#8B93A0] mt-1">{selectedClient.email} · {selectedClient.phone}</p>
                    <p className="text-xs text-[#555E6B]">{selectedClient.city}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#555E6B] italic">Aucun client sélectionné</p>
                )}
              </div>

              {/* Lines table */}
              <div className="px-8 py-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left text-[10px] font-semibold text-[#555E6B] uppercase tracking-wide pb-3">Désignation</th>
                      <th className="text-right text-[10px] font-semibold text-[#555E6B] uppercase tracking-wide pb-3">Qté</th>
                      <th className="text-right text-[10px] font-semibold text-[#555E6B] uppercase tracking-wide pb-3">P.U. HT</th>
                      <th className="text-right text-[10px] font-semibold text-[#555E6B] uppercase tracking-wide pb-3">TVA</th>
                      <th className="text-right text-[10px] font-semibold text-[#555E6B] uppercase tracking-wide pb-3">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.filter(l => l.label || l.unit).map((line, i) => {
                      const { ht: lHt } = calcLine(line)
                      return (
                        <tr key={i} className="border-b border-white/[0.04]">
                          <td className="py-3 text-sm text-[#F0F2F5]">{line.label || '—'}</td>
                          <td className="py-3 text-sm text-[#8B93A0] text-right">{line.qty}</td>
                          <td className="py-3 text-sm text-[#8B93A0] text-right">{line.unit ? formatEur(parseFloat(line.unit)) : '—'}</td>
                          <td className="py-3 text-sm text-[#8B93A0] text-right">{line.tva}%</td>
                          <td className="py-3 text-sm font-medium text-[#F0F2F5] text-right">{lHt > 0 ? formatEur(lHt) : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <div className="mt-6 max-w-xs ml-auto space-y-2 border-t border-white/[0.08] pt-4">
                  <div className="flex justify-between text-sm"><span className="text-[#8B93A0]">Sous-total HT</span><span className="text-[#F0F2F5] tabular-nums">{formatEur(ht)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#8B93A0]">TVA</span><span className="text-[#F0F2F5] tabular-nums">{formatEur(tva)}</span></div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-white/[0.08]">
                    <span className="text-[#F0F2F5]">Total TTC</span>
                    <span className="text-[#4F7CFF] tabular-nums">{formatEur(ttc)}</span>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div className="mx-8 mb-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <p className="text-xs text-[#555E6B]">
                  <span className="text-[#8B93A0] font-medium">Mode de règlement :</span> Virement bancaire — IBAN FR76 XXXX XXXX XXXX XXXX — Référence : {number}
                </p>
                <p className="text-xs text-[#555E6B] mt-1">
                  Pénalités de retard : 3× le taux d&apos;intérêt légal en vigueur. Indemnité forfaitaire pour frais de recouvrement : 40 €.
                </p>
                {notes && <p className="text-xs text-[#8B93A0] mt-2 border-t border-white/[0.04] pt-2">{notes}</p>}
              </div>

              <div className="px-8 pb-4 text-xs text-[#555E6B] text-center border-t border-white/[0.04] pt-4">
                {agency.name} · {agency.address} · SIRET {agency.siret} · TVA {agency.tvaNumber}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => setView('form')} className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-[#8B93A0] hover:text-[#F0F2F5] hover:bg-white/[0.04] transition-all font-medium">
                Modifier
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saved}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  saved ? 'bg-emerald-500 text-white' :
                  isValid ? 'bg-[#4F7CFF] hover:bg-[#7b9fff] text-white' :
                  'bg-[#4F7CFF]/30 text-white/40 cursor-not-allowed'
                }`}
              >
                <Save size={14} />
                {saved ? 'Facture créée !' : 'Créer la facture'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
