"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Loader2, ChevronLeft, MoreHorizontal, Share, RotateCw, CheckCircle2, Clock, XCircle } from "lucide-react"

interface Bet {
    id: string
    created_at: string
    lottery: string
    number: number
    amount: number
    location: string
    shift: string
    status: 'pending' | 'won' | 'lost'
    possible_prize: number
    customer?: {
        name: string
    }
}

export default function BetDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [bet, setBet] = useState<Bet | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBet = async () => {
            if (!params.id) return

            const { data, error } = await supabase
                .from('bets')
                .select('*, customer:customers(name)')
                .eq('id', params.id)
                .single()

            if (data) setBet(data as Bet)
            // Mock data for design verification if not found, REMOVE IN PROD
            else if (!data && params.id === '1') {
                setBet({
                    id: '84920391',
                    created_at: new Date().toISOString(),
                    lottery: 'Nacional',
                    number: 342,
                    amount: 500,
                    location: 'cabeza',
                    shift: 'Matutina',
                    status: 'won',
                    possible_prize: 25000,
                    customer: { name: 'Cliente Ejemplo' }
                })
            }
            setLoading(false)
        }
        fetchBet()
    }, [params.id])

    const handleShare = async () => {
        if (!bet) return
        const text = `🎟️ *Ticket Quiniela Digital*\n\nJugada: ${bet.number}\nUbicación: ${bet.location}\nLotería: ${bet.lottery} (${bet.shift})\nMonto: $${bet.amount}\n\nPremio Posible: $${bet.possible_prize}\nEstado: ${bet.status.toUpperCase()}\n\nVer ticket: ${window.location.href}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ticket de Quiniela',
                    text: text,
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Error sharing', err)
            }
        } else {
            navigator.clipboard.writeText(text)
            alert("Link copiado al portapapeles")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!bet) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                <p className="text-white/50 mb-4">No se encontró la jugada.</p>
                <Button variant="outline" onClick={() => router.back()} className="border-white/20 text-white">Volver</Button>
            </div>
        )
    }

    const getLocationLabel = (loc: string) => {
        switch (loc) {
            case 'cabeza': return 'A la Cabeza'
            case 'a_los_5': return 'A los 5'
            case 'a_los_10': return 'A los 10'
            case 'a_los_20': return 'A los 20'
            default: return loc
        }
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans flex flex-col selection:bg-primary/30 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] bg-blue-600/5 rounded-full blur-[80px]" />
            </div>

            {/* Top Navigation */}
            <header className="p-6 flex items-center justify-between sticky top-0 z-40 bg-background/50 backdrop-blur-md">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5" onClick={() => router.back()}>
                    <ChevronLeft className="text-white h-5 w-5" />
                </button>
                <h1 className="text-lg font-bold tracking-tight">Detalle de Ticket</h1>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
                    <MoreHorizontal className="text-white h-5 w-5" />
                </button>
            </header>

            <main className="flex-1 px-6 pb-40">
                {/* Floating Glassmorphic Ticket */}
                <div className="relative mt-4">
                    {/* Ticket Status Badge */}
                    <div className="absolute -top-3 right-4 z-20">
                        {bet.status === 'won' && (
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] uppercase flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3" /> Ganador
                            </span>
                        )}
                        {bet.status === 'pending' && (
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-white/10 text-white/80 border border-white/10 uppercase flex items-center gap-1.5 backdrop-blur-md">
                                <Clock className="h-3 w-3" /> Pendiente
                            </span>
                        )}
                        {bet.status === 'lost' && (
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 uppercase flex items-center gap-1.5 backdrop-blur-md">
                                <XCircle className="h-3 w-3" /> No Ganador
                            </span>
                        )}
                    </div>

                    <div className="glass-card rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl shadow-black/50">
                        {/* Ticket Header */}
                        <div className="p-8 border-b border-white/5 relative bg-white/5">
                            <div className="flex flex-col gap-1">
                                <span className="text-primary text-[10px] uppercase tracking-[0.2em] font-bold">Comprobante Digital</span>
                                <h2 className="text-3xl font-black text-white tracking-tight">#{bet.id.slice(0, 5)}</h2>
                            </div>
                            <div className="mt-6 flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Fecha</p>
                                    <p className="text-sm font-medium text-white/90">{new Date(bet.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Hora</p>
                                    <p className="text-sm font-medium text-white/90">{new Date(bet.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Perforation Line Decoration */}
                        <div className="relative h-6 flex items-center bg-transparent">
                            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full"></div>
                            <div className="w-full border-t-2 border-dashed border-white/10 mx-2"></div>
                            <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full"></div>
                        </div>

                        {/* Ticket Body: Bets List */}
                        <div className="px-8 py-4 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-primary text-5xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">{bet.number}</span>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-bold">Número Jugado</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white/80 bg-white/5 px-3 py-1 rounded-lg border border-white/5">{getLocationLabel(bet.location)}</p>
                                    <div className="mt-2 text-right">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Apuesta</p>
                                        <p className="text-xl font-bold text-white">${bet.amount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Detail Box */}
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 text-xs font-medium">Lotería</span>
                                    <span className="text-sm font-bold text-white">{bet.lottery}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 text-xs font-medium">Turno</span>
                                    <span className="text-sm font-bold text-white">{bet.shift}</span>
                                </div>
                                <div className="h-px bg-white/5 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60 text-sm font-semibold">Premio Estimado</span>
                                    <span className="text-primary text-xl font-black tracking-tight drop-shadow-[0_0_8px_rgba(57,255,20,0.2)]">${bet.possible_prize}</span>
                                </div>
                            </div>
                        </div>

                        {/* Perforation Bottom Decoration */}
                        <div className="relative h-6 flex items-center bg-transparent">
                            <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full"></div>
                            <div className="w-full border-t-2 border-dashed border-white/10 mx-2"></div>
                            <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full"></div>
                        </div>

                        {/* Ticket Footer QR */}
                        <div className="p-8 flex flex-col items-center gap-4 bg-white/5">
                            <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-lg">
                                {/* QR Placeholder */}
                                <div className="w-full h-full bg-black pattern-grid opacity-90"></div>
                            </div>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Validación Digital</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Actions (iOS Style) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-background via-background/95 to-transparent z-50">
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                    <button onClick={handleShare} className="w-full bg-primary hover:bg-primary/90 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                        <Share className="h-5 w-5" />
                        Compartir Comprobante
                    </button>
                    <button onClick={() => router.push(`/whatsapp?repeat=${bet?.id}`)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] backdrop-blur-md">
                        <RotateCw className="h-5 w-5 text-primary" />
                        Repetir Jugada
                    </button>
                </div>
            </div>
        </div>
    )
}
