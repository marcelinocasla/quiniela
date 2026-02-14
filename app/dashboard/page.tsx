"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"

export default function AgencyDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [latestBets, setLatestBets] = useState<any[]>([])
    const [stats, setStats] = useState({ totalJugado: 0, premiosAPagar: 0, gananciaNeta: 0 })

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        } else if (user) {
            const fetchData = async () => {
                // Fetch bets for list
                const { data: betsData } = await supabase
                    .from('bets')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (betsData) setLatestBets(betsData)

                // Fetch stats (aggregates)
                const { data: allBets } = await supabase
                    .from('bets')
                    .select('amount, possible_prize, status')

                if (allBets) {
                    const totalJugado = allBets.reduce((sum, bet) => sum + Number(bet.amount), 0)
                    const premiosAPagar = allBets
                        .filter(bet => bet.status === 'won')
                        .reduce((sum, bet) => sum + Number(bet.possible_prize), 0)

                    setStats({
                        totalJugado,
                        premiosAPagar,
                        gananciaNeta: totalJugado - premiosAPagar
                    })
                }
            }
            fetchData()
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Cargando...</div>
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background text-white pb-32 font-sans selection:bg-primary/30 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
            </div>

            {/* Web App Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(57,255,20,0.15)] border border-primary/20">
                        <span className="material-icons-round text-xl">account_balance_wallet</span>
                    </div>
                    <div>
                        <h1 className="text-[10px] font-bold text-primary tracking-widest uppercase">Agencia Digital</h1>
                        <p className="text-lg font-bold text-white tracking-tight">Quiniela Premium</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all active:scale-95 relative group">
                    <span className="material-icons-round text-white/60 group-hover:text-white transition-colors">notifications</span>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#050A14]"></span>
                </button>
            </header>

            <main className="px-5 pt-8 space-y-8">
                {/* Summary Cards Horizontal Scroll */}
                <section>
                    <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar -mx-5 px-5 snap-x">
                        {/* Total Jugado */}
                        <div className="flex-none w-72 p-6 rounded-3xl glass-card snap-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-xl bg-primary/10">
                                    <span className="material-icons-round text-primary text-xl">payments</span>
                                </div>
                                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Total Jugado</span>
                            </div>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-sm text-primary font-bold opacity-80">$</span>
                                <span className="text-4xl font-black tracking-tighter text-white">{stats.totalJugado.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold bg-primary/10 w-fit px-3 py-1.5 rounded-lg border border-primary/10">
                                <span className="material-icons-round text-sm">trending_up</span>
                                <span>+12.5% vs ayer</span>
                            </div>
                        </div>

                        {/* Premios a Pagar */}
                        <div className="flex-none w-72 p-6 rounded-3xl glass-card snap-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-500"></div>

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-xl bg-orange-500/10">
                                    <span className="material-icons-round text-orange-400 text-xl">confirmation_number</span>
                                </div>
                                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Premios a Pagar</span>
                            </div>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-sm text-orange-400 font-bold opacity-80">$</span>
                                <span className="text-4xl font-black tracking-tighter text-white">{stats.premiosAPagar.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-white/40 text-xs font-bold bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                <span className="material-icons-round text-sm">schedule</span>
                                <span>Pendientes de pago</span>
                            </div>
                        </div>

                        {/* Ganancia Neta */}
                        <div className="flex-none w-72 p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_8px_32px_rgba(57,255,20,0.1)] snap-center relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                                    <span className="material-icons-round text-white text-xl">savings</span>
                                </div>
                                <span className="text-xs font-bold text-primary-foreground/70 uppercase tracking-widest">Ganancia Neta</span>
                            </div>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-sm text-primary-foreground/70 font-bold">$</span>
                                <span className="text-4xl font-black tracking-tighter text-white">{stats.gananciaNeta.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-white text-xs font-bold bg-black/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-lg border border-white/10">
                                <span className="material-icons-round text-sm">workspace_premium</span>
                                <span>Excelente</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Games Section */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(57,255,20,0.8)]"></span>
                            Últimas Jugadas
                        </h2>
                        <button className="text-[10px] font-bold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 hover:bg-primary/10" onClick={() => router.push('/reportes')}>
                            Ver Todo
                        </button>
                    </div>
                    <div className="space-y-3">
                        {latestBets.length === 0 ? (
                            <div className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                                <span className="material-icons-round text-4xl mb-2 opacity-50">receipt_long</span>
                                <p className="text-sm font-medium">No hay jugadas recientes</p>
                            </div>
                        ) : (
                            latestBets.map((bet: any) => (
                                <div key={bet.id} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.03] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${bet.status === 'won' ? 'bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 text-green-500' : bet.status === 'lost' ? 'bg-red-500/10 border border-red-500/10 text-red-500/60' : 'bg-white/5 border border-white/5 text-white/40'}`}>
                                            <span className="material-icons-round text-xl">
                                                {bet.status === 'won' ? 'emoji_events' : bet.status === 'lost' ? 'close' : 'hourglass_empty'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-sm text-white capitalize tracking-tight">{bet.lottery}</h3>
                                                <span className={`px-2 py-[2px] rounded-md text-[9px] font-bold uppercase tracking-wider border ${bet.status === 'won' ? 'bg-green-500/10 border-green-500/20 text-green-400' : bet.status === 'lost' ? 'bg-red-500/5 border-red-500/10 text-red-500/50' : 'bg-yellow-500/5 border-yellow-500/10 text-yellow-500/70'}`}>
                                                    {bet.status === 'pending' ? 'Pendiente' : bet.status === 'won' ? 'Ganador' : bet.status === 'lost' ? 'No Ganó' : bet.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/40 font-medium">
                                                ID: <span className="font-mono text-white/30">#{bet.id.slice(0, 5)}</span> • Jugada: <span className="text-white"> {bet.number}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-0.5">Posible</span>
                                            <p className="font-black text-lg text-white leading-none tracking-tight">${bet.possible_prize.toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
            <BottomNav />
        </div >
    )
}
