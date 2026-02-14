"use client"

import { Wallet, TrendingUp, DollarSign, Award, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react"
import BottomNav from "@/components/BottomNav"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ReportsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    // Placeholder logic for stats - normally fetched from DB
    // In a real implementation, we would fetch aggregation from 'bets' table

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando...</div>
    if (!user) { router.push('/login'); return null; }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white uppercase">Reportes</h1>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Rendimiento de Agencia</p>
                    </div>
                </div>
            </header>

            <div className="px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Net Balance Card */}
                <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-100 transition-opacity"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-[50px]"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-black/20 rounded-2xl backdrop-blur-md border border-white/5">
                                <Wallet className="text-primary h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                                <ArrowUpRight className="h-3 w-3 text-green-500" />
                                <span className="text-[10px] font-bold text-green-500">+12.5%</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Balance Neto (Mes)</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-primary">$</span>
                                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">1.248.500</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 rounded-3xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start z-10">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ventas</span>
                            <DollarSign className="h-4 w-4 text-white/30" />
                        </div>
                        <div className="z-10">
                            <span className="text-2xl font-black text-white">$2.5M</span>
                        </div>
                    </div>
                    <div className="glass-card p-5 rounded-3xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-2xl"></div>
                        <div className="flex justify-between items-start z-10">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Premios</span>
                            <Award className="h-4 w-4 text-white/30" />
                        </div>
                        <div className="z-10">
                            <span className="text-2xl font-black text-white">$1.2M</span>
                        </div>
                    </div>
                </div>

                {/* Sales Chart Placeholder (Redesigned) */}
                <div className="glass-card border border-white/5 p-6 rounded-3xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Rendimiento Semanal
                        </h3>
                    </div>

                    {/* Bar Chart Visual */}
                    <div className="h-48 flex items-end justify-between gap-3">
                        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer">
                                <div className="w-full bg-white/5 rounded-t-lg relative h-full overflow-hidden border border-white/5 group-hover:bg-white/10 transition-colors">
                                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-primary/80 to-primary/40 group-hover:to-primary/60 transition-all rounded-t-sm" style={{ height: `${h}%` }}>
                                        <div className="absolute top-0 w-full h-[1px] bg-primary/50 shadow-[0_0_10px_#39FF14]"></div>
                                    </div>
                                </div>
                                <span className="text-[9px] text-center font-bold text-white/30 uppercase group-hover:text-primary transition-colors">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ranking de Loterias (Redesigned) */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">Ranking de Loterías</h3>
                    <div className="glass-card border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                        {/* Item */}
                        <div className="p-5 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-white">Nacional</span>
                                <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg border border-primary/10">45%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[45%] rounded-full shadow-[0_0_10px_#39FF14] group-hover:w-[48%] transition-all duration-500"></div>
                            </div>
                        </div>
                        {/* Item */}
                        <div className="p-5 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-white">Provincia</span>
                                <span className="text-xs text-white/60 font-bold bg-white/5 px-2 py-1 rounded-lg">32%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="bg-white/40 h-full w-[32%] rounded-full group-hover:bg-white/60 transition-colors"></div>
                            </div>
                        </div>
                        {/* Item */}
                        <div className="p-5 hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-white">Santa Fe</span>
                                <span className="text-xs text-white/60 font-bold bg-white/5 px-2 py-1 rounded-lg">18%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="bg-white/20 h-full w-[18%] rounded-full group-hover:bg-white/40 transition-colors"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    )
}
