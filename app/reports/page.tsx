"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Wallet } from "lucide-react"

export default function ReportsPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen pb-24 font-sans text-white relative">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Reportes</h1>
                    <p className="text-sm text-white/40 font-medium">Análisis de rendimiento - Agencia #4205</p>
                </header>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Net Balance Card */}
                    <div className="bg-[#ff6600] p-6 rounded-2xl shadow-xl shadow-orange-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="text-white/80 text-sm font-bold tracking-wide">Balance Neto (Mes)</span>
                            <Wallet className="text-white/60 h-5 w-5" />
                        </div>
                        <div className="flex items-baseline gap-1 relative z-10">
                            <span className="text-white/80 text-2xl font-bold">$</span>
                            <span className="text-white text-4xl font-extrabold tracking-tighter">1.248.500</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/10 w-fit px-3 py-1.5 rounded-full border border-white/10 relative z-10">
                            <span className="material-icons text-[14px]">trending_up</span>
                            <span>+12.5% vs mes anterior</span>
                        </div>
                    </div>

                    {/* Sales Chart Placeholder */}
                    <div className="bg-[#121212] border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff6600]/50 to-transparent opacity-50"></div>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Rendimiento Semanal</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6600]"></div>
                                    <span className="text-[10px] font-bold text-white/40">Ventas</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                    <span className="text-[10px] font-bold text-white/40">Premios</span>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart Visual */}
                        <div className="h-40 flex items-end justify-between gap-2">
                            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer">
                                    <div className="w-full bg-[#ff6600]/10 rounded-t-sm relative h-full overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-[#ff6600] group-hover:bg-[#ff6600]/80 transition-colors" style={{ height: `${h}%` }}></div>
                                        <div className="absolute bottom-0 w-full bg-white/20" style={{ height: `${h * 0.4}%` }}></div>
                                    </div>
                                    <span className="text-[9px] text-center font-bold text-white/30 uppercase">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ranking de Loterias */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Ranking de Loterías</h3>
                        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {/* Item */}
                            <div className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-white">Nacional</span>
                                    <span className="text-xs text-[#ff6600] font-bold">45%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-[#ff6600] h-full w-[45%] rounded-full shadow-[0_0_10px_#ff6600]"></div>
                                </div>
                            </div>
                            {/* Item */}
                            <div className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-white">Provincia</span>
                                    <span className="text-xs text-[#ff6600] font-bold">32%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-[#ff6600] h-full w-[32%] rounded-full opacity-80"></div>
                                </div>
                            </div>
                            {/* Item */}
                            <div className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-white">Santa Fe</span>
                                    <span className="text-xs text-[#ff6600] font-bold">18%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="bg-[#ff6600] h-full w-[18%] rounded-full opacity-60"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Glows */}
            <div className="fixed -top-32 -right-32 w-96 h-96 bg-[#ff6600]/10 rounded-full blur-[128px] pointer-events-none z-[-1]"></div>
        </DashboardLayout>
    )
}
