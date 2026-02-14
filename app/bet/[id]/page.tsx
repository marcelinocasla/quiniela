"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Loader2, ArrowLeft, AlertCircle, Trophy, MapPin, Calendar, DollarSign, Share2, RefreshCw, XCircle, Clock } from "lucide-react"
import BottomNav from "@/components/BottomNav"

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
    position: number
    draw_time: string
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
                    position: 1,
                    draw_time: '14:00',
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

    const handleRepeatBet = () => {
        router.push('/bet/new')
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
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-[80px]" />
            </div>

            <div className="px-6 pt-8 pb-24 relative z-10 flex flex-col items-center">
                <header className="w-full flex items-center justify-between mb-8">
                    <button onClick={() => router.back()} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-widest text-white/50">Ticket Digital</h1>
                    <div className="w-12"></div>
                </header>

                {loading ? (
                    <div className="w-full max-w-sm mt-10 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
                        </div>
                        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] animate-pulse text-white/40">Recuperando Apuesta...</p>
                    </div>
                ) : !bet ? (
                    <div className="glass-card p-10 rounded-[2.5rem] text-center border border-white/10 max-w-sm w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5"></div>
                        <AlertCircle className="h-16 w-16 text-white/20 mx-auto mb-6" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Apuesta No Encontrada</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-8">El ticket que buscas no existe o ha sido eliminado.</p>
                        <button onClick={() => router.push('/dashboard')} className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all w-full border border-white/5 hover:border-white/10">
                            Volver al Inicio
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-sm relative group perspective-[1000px]">
                        {/* Ticket Glow Effect */}
                        <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-40 transition-all duration-500 ${bet.status === 'won' ? 'bg-primary animate-pulse' :
                            bet.status === 'lost' ? 'bg-red-500/50' :
                                'bg-blue-500/40'
                            }`}></div>

                        {/* TICKET CONTAINER */}
                        <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl bg-[#0a0a0a] transform transition-transform duration-500 hover:rotate-x-2">
                            {/* Status Banner */}
                            <div className={`py-3 flex justify-center items-center gap-2 border-b border-white/5 shadow-lg relative overflow-hidden ${bet.status === 'won' ? 'bg-primary/10' :
                                bet.status === 'lost' ? 'bg-red-500/10' :
                                    'bg-blue-500/10'
                                }`}>
                                <div className={`absolute inset-0 opacity-20 ${bet.status === 'won' ? 'bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer' : ''
                                    }`}></div>

                                {bet.status === 'won' && <Trophy className="h-4 w-4 text-primary animate-bounce" />}
                                {bet.status === 'lost' && <XCircle className="h-4 w-4 text-red-500" />}
                                {bet.status === 'pending' && <Clock className="h-4 w-4 text-blue-400 animate-pulse" />}

                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${bet.status === 'won' ? 'text-primary' :
                                    bet.status === 'lost' ? 'text-red-500' :
                                        'text-blue-400'
                                    }`}>
                                    {bet.status === 'won' ? 'Ticket Ganador' :
                                        bet.status === 'lost' ? 'No hubo suerte' :
                                            'Sorteo Pendiente'}
                                </span>
                            </div>

                            <div className="p-8 relative">
                                {/* Watermark */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.02] pointer-events-none select-none rotate-[-45deg] whitespace-nowrap">
                                    QUINIELA
                                </div>

                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">ID de Apuesta</p>
                                        <p className="text-lg font-mono text-white/80 tracking-widest">#{bet.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Fecha</p>
                                        <p className="text-xs font-bold text-white uppercase">{new Date(bet.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                                        <p className="text-[10px] text-white/40 font-mono">{new Date(bet.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                {/* Main Number Display */}
                                <div className="text-center py-6 border-y border-white/5 bg-white/[0.02] rounded-2xl mb-8 relative overflow-hidden group/number">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-[40px] group-hover/number:bg-primary/20 transition-colors duration-500"></div>
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mb-2">Número Jugado</p>
                                    <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                        {bet.number}
                                    </h2>
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                        <MapPin className="h-3 w-3 text-primary" />
                                        <span className="text-[10px] text-white/60 font-black uppercase tracking-wider">
                                            A los {bet.position}
                                        </span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="h-3 w-3 text-white/40" />
                                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Sorteo</p>
                                        </div>
                                        <p className="text-xs font-bold text-white uppercase">{bet.lottery}</p>
                                        <p className="text-[10px] text-white/50 uppercase mt-0.5">{bet.draw_time}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="h-3 w-3 text-white/40" />
                                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Importe</p>
                                        </div>
                                        <p className="text-xl font-black text-white tracking-tight">${parseInt(bet.amount.toString()).toLocaleString('es-AR')}</p>
                                    </div>
                                </div>

                                {/* Potential Win / Won Amount */}
                                <div className={`p-5 rounded-2xl border relative overflow-hidden text-center ${bet.status === 'won'
                                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(204,255,0,0.15)]'
                                    : 'bg-gradient-to-br from-white/5 to-transparent border-white/5'
                                    }`}>
                                    {bet.status === 'won' && <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse"></div>}

                                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 relative z-10 ${bet.status === 'won' ? 'text-primary' : 'text-white/40'}`}>
                                        {bet.status === 'won' ? '¡Premio Obtenido!' : 'Premio Estimado'}
                                    </p>
                                    <p className={`text-3xl font-black tracking-tighter relative z-10 ${bet.status === 'won' ? 'text-primary drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'text-white'}`}>
                                        ${(parseInt(bet.amount.toString()) * (bet.position === 1 ? 700 : 700 / bet.position)).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Footer / Perforation Effect */}
                            <div className="relative h-6 bg-[#050505] -mx-1">
                                <div className="absolute top-0 left-0 w-full h-[1px] border-t-2 border-dashed border-white/10"></div>
                                <div className="absolute -left-3 top-[-6px] w-6 h-6 rounded-full bg-background z-20"></div>
                                <div className="absolute -right-3 top-[-6px] w-6 h-6 rounded-full bg-background z-20"></div>
                            </div>

                            <div className="bg-[#0a0a0a] p-6 pt-2 pb-8 text-center">
                                <p className="text-[9px] text-white/20 uppercase font-bold tracking-[0.2em] mb-6">Quiniela Digital Verificada</p>

                                <div className="flex gap-3">
                                    <button onClick={handleShare} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all border border-white/5 hover:border-white/10 flex items-center justify-center gap-2 group">
                                        <Share2 className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                                        Compartir
                                    </button>
                                    <button onClick={handleRepeatBet} className="flex-1 py-4 rounded-xl bg-primary hover:bg-[#d4ff00] text-black font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_25px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2 active:scale-95">
                                        <RefreshCw className="h-4 w-4" />
                                        Repetir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    )
}
