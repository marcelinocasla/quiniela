"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Share2, Ban, Edit3, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export default function AdminTicketDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [bet, setBet] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        if (id) fetchBet()
    }, [id])

    const fetchBet = async () => {
        try {
            const { data, error } = await supabase
                .from('bets')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setBet(data)
        } catch (error) {
            console.error("Error fetching bet:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleVoidTicket = async () => {
        if (!confirm("¿Estás seguro de que deseas ANULAR este ticket? Esta acción no se puede deshacer.")) return

        setProcessing(true)
        try {
            const { error } = await supabase
                .from('bets')
                .update({ status: 'cancelled' })
                .eq('id', id)

            if (error) throw error

            alert("Ticket anulado con éxito")
            fetchBet() // Refresh
        } catch (error: any) {
            alert("Error al anular: " + error.message)
        } finally {
            setProcessing(false)
        }
    }

    const handleShareWhatsApp = () => {
        if (!bet) return

        const text = `
🎰 *QUINIELA DIGITAL* 🎰
--------------------------------
🧾 *Ticket:* #${bet.id.slice(0, 8)}
📅 *Fecha:* ${new Date(bet.created_at).toLocaleDateString()}
⏰ *Hora:* ${new Date(bet.created_at).toLocaleTimeString()}
--------------------------------
🔢 *Número:* *${bet.number}*
💰 *Monto:* $${bet.amount}
📍 *Ubicación:* ${bet.location || 'A los ' + bet.position}
--------------------------------
🏛️ *Lotería:*
${bet.lottery}
--------------------------------
Estado: ${bet.status.toUpperCase()}
`.trim()

        const url = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white/40">Cargando...</div>
    if (!bet) return <div className="min-h-screen flex items-center justify-center text-white/40">Ticket no encontrado</div>

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'won': return <CheckCircle2 className="w-12 h-12 text-[#CCFF00]" />
            case 'pending': return <AlertTriangle className="w-12 h-12 text-blue-400" />
            case 'cancelled': return <Ban className="w-12 h-12 text-red-500" />
            case 'lost': return <XCircle className="w-12 h-12 text-white/40" />
            default: return null
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'won': return 'GANADOR'
            case 'pending': return 'PENDIENTE'
            case 'cancelled': return 'ANULADO'
            case 'lost': return 'PERDEDOR'
            default: return status.toUpperCase()
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'won': return 'text-[#CCFF00] border-[#CCFF00] bg-[#CCFF00]/10 shadow-[0_0_20px_rgba(204,255,0,0.3)]'
            case 'pending': return 'text-blue-400 border-blue-400 bg-blue-400/10'
            case 'cancelled': return 'text-red-500 border-red-500 bg-red-500/10'
            case 'lost': return 'text-white/40 border-white/10 bg-white/5'
            default: return 'text-white'
        }
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-4">
                <Link href="/admin/tickets" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-lg font-bold">Detalle de Ticket</h1>
            </header>

            <main className="px-4 py-6 space-y-8 max-w-xl mx-auto">

                {/* Status Card */}
                <div className={`glass-card p-8 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all ${getStatusColor(bet.status)}`}>
                    <div className="p-4 rounded-full bg-white/5 backdrop-blur-md">
                        {getStatusIcon(bet.status)}
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-black tracking-widest">{getStatusText(bet.status)}</h2>
                        <p className="text-sm opacity-60 font-bold mt-1">Ticket #{bet.id.slice(0, 8)}</p>
                    </div>
                </div>

                {/* Ticket Details */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Jugada</label>
                        <div className="flex items-end justify-between">
                            <span className="text-5xl font-black text-white tracking-tighter text-[#CCFF00]">{bet.number}</span>
                            <span className="text-xl font-bold text-white mb-2">${bet.amount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lotería</label>
                            <p className="text-sm font-bold text-white leading-tight">{bet.lottery}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Ubicación</label>
                            <p className="text-sm font-bold text-white leading-tight">{bet.location || `A los ${bet.position}`}</p>
                        </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Fecha</label>
                            <p className="text-xs font-bold text-white/60">{new Date(bet.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Hora</label>
                            <p className="text-xs font-bold text-white/60">{new Date(bet.created_at).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleShareWhatsApp}
                        className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#25D366]/90 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
                    >
                        <Share2 className="w-5 h-5" />
                        Compartir por WhatsApp
                    </button>

                    {bet.status === 'pending' && (
                        <>
                            <button
                                onClick={() => alert("Función de edición próxima...")}
                                className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                            >
                                <Edit3 className="w-5 h-5 opacity-60" />
                                Editar Jugada
                            </button>

                            <button
                                onClick={handleVoidTicket}
                                disabled={processing}
                                className="w-full py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <Ban className="w-5 h-5" />
                                {processing ? 'Procesando...' : 'Anular Ticket'}
                            </button>
                        </>
                    )}
                </div>

            </main>
        </div>
    )
}
