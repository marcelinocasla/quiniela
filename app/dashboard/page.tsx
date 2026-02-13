"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { TrendingUp, Clock, ChevronRight, Trophy, XCircle } from "lucide-react"

export default function AgencyDashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Cargando...</div>
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-[#ff6600]/30">
            {/* Top Navigation Bar (Mobile) */}
            <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ff6600] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <span className="material-icons-round text-xl">account_balance_wallet</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-medium text-white/60 leading-none">Agencia #4205</h1>
                        <p className="text-lg font-bold text-white">Quiniela Digital</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center border border-white/10">
                    <span className="material-icons-round text-white/80">notifications</span>
                </button>
            </nav>

            <main className="px-5 pt-6 space-y-8">
                {/* Summary Cards Horizontal Scroll */}
                <section>
                    <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                        {/* Total Jugado */}
                        <div className="flex-none w-64 p-5 rounded-xl bg-[#121212] border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-icons-round text-[#ff6600] text-sm">payments</span>
                                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Total Jugado</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-[#ff6600] font-bold">$</span>
                                <span className="text-3xl font-extrabold tracking-tight">1.284.500</span>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-green-500 text-xs font-medium">
                                <TrendingUp className="h-4 w-4" />
                                <span>+12.5% vs ayer</span>
                            </div>
                        </div>

                        {/* Premios a Pagar */}
                        <div className="flex-none w-64 p-5 rounded-xl bg-[#121212] border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-icons-round text-[#ff6600] text-sm">confirmation_number</span>
                                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Premios a Pagar</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-[#ff6600] font-bold">$</span>
                                <span className="text-3xl font-extrabold tracking-tight">452.120</span>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-white/40 text-xs font-medium">
                                <Clock className="h-4 w-4" />
                                <span>8 boletas pendientes</span>
                            </div>
                        </div>

                        {/* Ganancia Neta */}
                        <div className="flex-none w-64 p-5 rounded-xl bg-[#ff6600]/10 border border-[#ff6600]/30 shadow-2xl">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-icons-round text-[#ff6600] text-sm">savings</span>
                                <span className="text-xs font-semibold text-[#ff6600]/80 uppercase tracking-wider font-bold">Ganancia Neta</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-[#ff6600] font-bold">$</span>
                                <span className="text-3xl font-extrabold tracking-tight text-[#ff6600]">832.380</span>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-[#ff6600] text-xs font-bold">
                                <Trophy className="h-4 w-4" />
                                <span>Récord Semanal</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Weekly Chart Section (Placeholder for now) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Ventas Semanales</h2>
                        <span className="text-xs font-medium text-white/40">Mar 12 - Mar 18</span>
                    </div>
                    <div className="bg-[#121212] p-6 rounded-xl border border-white/5 h-48 flex items-end justify-between gap-2">
                        {/* Bars mimicking the design */}
                        {[30, 50, 70, 100, 60, 40, 20].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                                <div className="w-full bg-white/5 rounded-full relative overflow-hidden h-full">
                                    <div
                                        className={`absolute bottom-0 w-full rounded-full ${h === 100 ? 'bg-[#ff6600] shadow-lg shadow-orange-500/20' : 'bg-[#ff6600]/20'}`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className={`text-[10px] font-medium ${h === 100 ? 'text-[#ff6600] font-bold' : 'text-white/40'}`}>
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Games Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Últimas Jugadas</h2>
                        <button className="text-xs font-bold text-[#ff6600] flex items-center gap-1 uppercase tracking-widest">
                            Ver Todo <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {/* Winner Card */}
                        <div className="bg-[#121212] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Trophy className="text-green-500 h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm">Lotería Nacional</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-green-500 text-[10px] font-bold text-white uppercase tracking-tighter">Ganador</span>
                                    </div>
                                    <p className="text-xs text-white/40 mt-1">ID: #83291 • <span className="text-white/60 font-medium">Jugada: 12 - 45 - 67</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-sm">$4.500</p>
                                <p className="text-[10px] text-white/40 mt-1">10:42 AM</p>
                            </div>
                        </div>

                        {/* Pending Card */}
                        <div className="bg-[#121212] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Clock className="text-white/40 h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm">Provincia</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/60 uppercase tracking-tighter">Pendiente</span>
                                    </div>
                                    <p className="text-xs text-white/40 mt-1">ID: #83292 • <span className="text-white/60 font-medium">Jugada: 05 - 19 - 88</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-sm">$1.200</p>
                                <p className="text-[10px] text-white/40 mt-1">10:38 AM</p>
                            </div>
                        </div>

                        {/* Lost Card */}
                        <div className="bg-[#121212] p-4 rounded-xl border border-white/5 flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <XCircle className="text-red-500/60 h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm">Montevideo</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-tighter">Sin Premio</span>
                                    </div>
                                    <p className="text-xs text-white/40 mt-1">ID: #83289 • <span className="text-white/60 font-medium">Jugada: 77 - 23 - 09</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-sm">$2.500</p>
                                <p className="text-[10px] text-white/40 mt-1">09:55 AM</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
