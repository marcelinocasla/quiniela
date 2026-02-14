"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"

export default function AgencyDashboard() {
    const { user, profile, loading } = useAuth()
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
            {/* Background Gradients - Fluor/Blue */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                        <span className="material-icons-round text-2xl">casino</span>
                    </div>
                    <div>
                        <h1 className="text-[10px] font-black text-white/50 tracking-[0.2em] uppercase">Bienvenido</h1>
                        <p className="text-sm font-bold text-white capitalize">{profile?.full_name?.split(' ')[0] || 'Jugador'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Admin Access Button */}
                    {profile?.role === 'agency_owner' && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-primary flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                        >
                            <span className="material-icons-round text-lg">admin_panel_settings</span>
                        </button>
                    )}
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 relative group">
                        <span className="material-icons-round text-white/60 group-hover:text-white transition-colors">notifications</span>
                        <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#CCFF00]"></span>
                    </button>
                </div>
            </header>

            <main className="px-5 pt-8 space-y-10">
                {/* Hero Balance Card - Futuristic Bank Style */}
                <section className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
                    <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden border border-white/10">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <span className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] block mb-1">Tu Saldo</span>
                                <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">
                                    <span className="text-3xl align-top text-primary opacity-80 mr-1">$</span>
                                    {(150000).toLocaleString('es-AR')}
                                    {/* Mock balance for design - connect to DB later */}
                                </h2>
                            </div>
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                                <span className="material-icons-round text-white/80">account_balance</span>
                            </div>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <button className="flex-1 bg-primary text-black font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] active:scale-[0.98] transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <span className="material-icons-round text-base">add</span> Cargar
                            </button>
                            <button onClick={() => router.push('/bet/new')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-2xl backdrop-blur-md active:scale-[0.98] transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <span className="material-icons-round text-base text-primary">play_arrow</span> Jugar
                            </button>
                        </div>
                    </div>
                </section>

                {/* KPI Scroll - Neon Outlines */}
                <section>
                    <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar -mx-5 px-5 snap-x">
                        {/* Stats Cards with Neon Borders */}
                        <div className="flex-none w-40 p-5 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl snap-center flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-primary shadow-[0_0_15px_#CCFF00]"></div>
                            <span className="material-icons-round text-primary/80 text-2xl group-hover:scale-110 transition-transform">payments</span>
                            <div className="text-center">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Jugado Hoy</p>
                                <p className="text-lg font-black text-white">${stats.totalJugado.toLocaleString('es-AR')}</p>
                            </div>
                        </div>

                        <div className="flex-none w-40 p-5 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl snap-center flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-500 shadow-[0_0_15px_orange]"></div>
                            <span className="material-icons-round text-orange-400/80 text-2xl group-hover:scale-110 transition-transform">emoji_events</span>
                            <div className="text-center">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Premios</p>
                                <p className="text-lg font-black text-white">${stats.premiosAPagar.toLocaleString('es-AR')}</p>
                            </div>
                        </div>

                        <div className="flex-none w-40 p-5 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-xl snap-center flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 shadow-[0_0_15px_blue]"></div>
                            <span className="material-icons-round text-blue-400/80 text-2xl group-hover:scale-110 transition-transform">trending_up</span>
                            <div className="text-center">
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Ganancia</p>
                                <p className="text-lg font-black text-white">${stats.gananciaNeta.toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Latest Games Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 uppercase italic">
                            Últimas <span className="text-primary not-italic">Jugadas</span>
                        </h2>
                        <button
                            onClick={() => router.push('/reports')}
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <span className="material-icons-round text-white/60 text-sm">arrow_forward</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {latestBets.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
                                <span className="material-icons-round text-5xl mb-4 text-white/10">receipt_long</span>
                                <p className="text-sm font-bold text-white/40">No hay actividad reciente</p>
                                <button onClick={() => router.push('/bet/new')} className="mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:underline decoration-primary/30 underline-offset-4">
                                    Realizar primera jugada
                                </button>
                            </div>
                        ) : (
                            latestBets.map((bet: any) => (
                                <div key={bet.id} className="relative group">
                                    <div className={`absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bet.status === 'won' ? 'bg-green-500/20' : 'bg-primary/5'}`}></div>
                                    <div className="glass-card p-5 rounded-3xl relative flex items-center justify-between border border-white/5 hover:border-primary/20 transition-colors group-hover:translate-y-[-2px] duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${bet.status === 'won' ? 'bg-green-500/10 border-green-500/30 text-green-400' : bet.status === 'lost' ? 'bg-red-500/5 border-red-500/10 text-red-500/40' : 'bg-white/5 border-white/5 text-white/30'}`}>
                                                <span className="material-icons-round text-2xl">
                                                    {bet.status === 'won' ? 'emoji_events' : bet.status === 'lost' ? 'close' : 'hourglass_empty'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-base text-white capitalize tracking-wide">{bet.lottery}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-mono text-primary font-bold tracking-wider">{bet.number}</span>
                                                    <span className="text-[10px] text-white/30 font-bold uppercase">• {new Date(bet.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                {bet.status === 'pending' && <span className="text-[9px] font-bold text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded-md border border-yellow-400/20 uppercase tracking-wider">Pendiente</span>}
                                                {bet.status === 'won' && <span className="text-[9px] font-bold text-green-400/80 bg-green-400/10 px-2 py-0.5 rounded-md border border-green-400/20 uppercase tracking-wider">¡Ganador!</span>}
                                                {bet.status === 'lost' && <span className="text-[9px] font-bold text-red-400/80 bg-red-400/10 px-2 py-0.5 rounded-md border border-red-400/20 uppercase tracking-wider">No Ganó</span>}

                                                <p className="font-black text-lg text-white tracking-tight">${bet.amount}</p>
                                            </div>
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
