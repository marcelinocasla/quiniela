"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Loader2, Share2, Copy, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

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
            <DashboardLayout>
                <div className="flex justify-center items-center h-[80vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
            </DashboardLayout>
        )
    }

    if (!bet) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                    <p className="text-neutral-500 mb-4">No se encontró la jugada.</p>
                    <Button variant="outline" onClick={() => router.back()}>Volver</Button>
                </div>
            </DashboardLayout>
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
        <DashboardLayout>
            <div className="max-w-md mx-auto py-8">
                <Button variant="ghost" className="mb-6 text-neutral-400 hover:text-white pl-0" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>

                <div className="relative">
                    {/* Ticket Card */}
                    <Card className="bg-neutral-900 border-none overflow-hidden relative shadow-2xl shadow-black/50">
                        {/* Top Decoration */}
                        <div className="h-2 w-full bg-gradient-to-r from-orange-600 to-red-600" />

                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            {bet.status === 'pending' && <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10"><Clock className="h-3 w-3" /> PENDIENTE</span>}
                            {bet.status === 'won' && <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/30"><CheckCircle className="h-3 w-3" /> GANADOR</span>}
                            {bet.status === 'lost' && <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-500/30"><XCircle className="h-3 w-3" /> NO GANADOR</span>}
                        </div>

                        <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <span className="text-9xl font-black rotate-[-30deg]">QUINIELA</span>
                            </div>

                            <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-1">Ticket Digital</p>
                            <h2 className="text-2xl font-bold text-white mb-8 font-mono">#{bet.id.slice(0, 8)}</h2>

                            {/* Main Number */}
                            <div className="mb-8 relative">
                                <div className="text-6xl font-black text-white tracking-widest relative z-10 px-6 py-2">
                                    {bet.number.toString().padStart(4, '0')}
                                </div>
                                {/* Glow behind number */}
                                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
                            </div>

                            {/* Details Grid */}
                            <div className="w-full grid grid-cols-2 gap-y-6 gap-x-4 mb-8 text-left bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Lotería</span>
                                    <span className="text-sm text-white font-medium">{bet.lottery}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Turno</span>
                                    <span className="text-sm text-orange-400 font-medium">{bet.shift}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Ubicación</span>
                                    <span className="text-sm text-white font-medium">{getLocationLabel(bet.location)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Fecha</span>
                                    <span className="text-sm text-white font-medium">{new Date(bet.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col border-t border-white/10 pt-2 col-span-2 flex-row justify-between items-center">
                                    <span className="text-xs text-neutral-400">Monto Apostado</span>
                                    <span className="text-lg text-white font-bold">${bet.amount}</span>
                                </div>
                                <div className="flex flex-col border-t border-white/10 pt-2 col-span-2 flex-row justify-between items-center bg-orange-500/10 -mx-4 px-4 py-2 -mb-2 rounded-b-lg">
                                    <span className="text-xs text-orange-400 font-bold uppercase">Premio Estimado</span>
                                    <span className="text-xl text-orange-500 font-black">${bet.possible_prize}</span>
                                </div>
                            </div>

                            {/* Client Name */}
                            {bet.customer?.name && (
                                <p className="text-xs text-neutral-600 mb-6">Jugado por: {bet.customer.name}</p>
                            )}

                            <div className="w-full flex flex-col gap-3">
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-[0.98]" onClick={handleShare}>
                                    <Share2 className="mr-2 h-5 w-5" /> Compartir Ticket
                                </Button>
                                <Button variant="outline" className="w-full border-neutral-800 text-neutral-300 hover:bg-white/5 hover:text-white py-6 rounded-xl" onClick={() => router.push(`/whatsapp?repeat=${bet.id}`)}>
                                    <Copy className="mr-2 h-4 w-4" /> Repetir Jugada
                                </Button>
                            </div>
                        </CardContent>

                        {/* Serrated Edges Bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-4 bg-[#0a0a0a]" style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)' }}></div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
