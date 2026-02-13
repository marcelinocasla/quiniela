"use client"

import { useAuth } from "@/components/auth-provider"
import { ChevronDown, Calendar, Bell } from "lucide-react"

export default function Results() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ff6600]/30 pb-24">
            {/* Status Bar Spacer (iOS Style) */}
            <div className="h-12 w-full"></div>

            {/* Header Section */}
            <header className="sticky top-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Resultados del Día</h1>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
                        <Bell className="text-white/70 h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="px-4 space-y-6">
                {/* Date Selector (Horizontal Scroll) */}
                <section className="mt-4 overflow-x-auto hide-scrollbar flex space-x-3 py-2">
                    <div className="flex-shrink-0 w-16 h-20 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                        <span className="text-xs text-white/50 font-medium">LUN</span>
                        <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="flex-shrink-0 w-16 h-20 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center">
                        <span className="text-xs text-white/50 font-medium">MAR</span>
                        <span className="text-lg font-bold">13</span>
                    </div>
                    <div className="flex-shrink-0 w-16 h-20 rounded-xl bg-[#ff6600] flex flex-col items-center justify-center shadow-lg shadow-orange-500/20">
                        <span className="text-xs text-white/80 font-medium">HOY</span>
                        <span className="text-lg font-bold">14</span>
                    </div>
                    <div className="flex-shrink-0 w-16 h-20 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center opacity-50">
                        <span className="text-xs text-white/50 font-medium">JUE</span>
                        <span className="text-lg font-bold">15</span>
                    </div>
                    <div className="flex-shrink-0 w-16 h-20 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center opacity-50">
                        <span className="text-xs text-white/50 font-medium">VIE</span>
                        <span className="text-lg font-bold">16</span>
                    </div>
                    <div className="flex-shrink-0 w-10 flex items-center justify-center">
                        <Calendar className="text-white/30 h-6 w-6" />
                    </div>
                </section>

                {/* Lottery Card: NACIONAL */}
                <section className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff6600]/10 blur-[60px] rounded-full"></div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Nacional</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Lotería de la Ciudad</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] bg-[#ff6600]/20 text-[#ff6600] px-2 py-1 rounded-full font-semibold">EN VIVO</span>
                        </div>
                    </div>

                    {/* Segmented Control */}
                    <div className="flex bg-white/5 p-1 rounded-lg mb-8 overflow-x-auto hide-scrollbar">
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Previa</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Primera</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Matut.</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all bg-white/10 text-white shadow-sm">Vesp.</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Noct.</button>
                    </div>

                    {/* "La Cabeza" Display */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <span className="text-xs font-bold text-[#ff6600] tracking-widest uppercase mb-4">A la Cabeza</span>
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#ff6600] blur-2xl opacity-20 animate-pulse"></div>
                            <div className="w-32 h-32 rounded-full border-2 border-[#ff6600]/50 flex items-center justify-center bg-gradient-to-br from-[#ff6600] via-[#ff6600] to-[#ff8c42] primary-glow relative z-10">
                                <span className="text-5xl font-bold text-white tracking-tighter">7248</span>
                            </div>
                        </div>
                    </div>

                    {/* 2-Column Prize List */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {[
                            { pos: 2, num: 4510 },
                            { pos: 3, num: 8923 },
                            { pos: 4, num: 12 },
                            { pos: 5, num: 6754 },
                            { pos: 6, num: 3391 },
                            { pos: 7, num: 1288 },
                        ].map((item) => (
                            <div key={item.pos} className="flex justify-between items-center border-b border-white/5 pb-1">
                                <span className="text-xs text-white/40 font-medium">{item.pos}.</span>
                                <span className="text-sm font-semibold tracking-wide">{item.num.toString().padStart(4, '0')}</span>
                            </div>
                        ))}

                        <div className="col-span-2 py-2 flex justify-center">
                            <button className="text-xs text-[#ff6600] font-medium flex items-center gap-1">
                                Ver extracto completo <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Lottery Card: PROVINCIA */}
                <section className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Provincia</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Buenos Aires</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] bg-white/10 text-white/70 px-2 py-1 rounded-full font-semibold">FINALIZADO</span>
                        </div>
                    </div>

                    {/* Segmented Control */}
                    <div className="flex bg-white/5 p-1 rounded-lg mb-8 overflow-x-auto hide-scrollbar">
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Previa</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Primera</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Matut.</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all bg-white/10 text-white shadow-sm">Vesp.</button>
                        <button className="flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all text-white/50">Noct.</button>
                    </div>

                    {/* "La Cabeza" Display */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <span className="text-xs font-bold text-[#ff6600] tracking-widest uppercase mb-4">A la Cabeza</span>
                        <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/5 relative z-10">
                            <span className="text-5xl font-bold text-white tracking-tighter opacity-50">9022</span>
                        </div>
                    </div>

                    <div className="col-span-2 py-2 flex justify-center">
                        <button className="text-xs text-white/40 font-medium flex items-center gap-1">
                            Ver extracto completo <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                </section>

                {/* Other Lotteries Selection */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-xl flex flex-col items-center text-center">
                        <span className="text-xs text-white/40 font-bold uppercase mb-2">Santa Fe</span>
                        <div className="w-12 h-12 rounded-full border border-[#ff6600]/30 flex items-center justify-center mb-2">
                            <span className="text-lg font-bold text-[#ff6600]">08</span>
                        </div>
                        <span className="text-[10px] text-white/30">MATUTINA</span>
                    </div>
                    <div className="glass-card p-4 rounded-xl flex flex-col items-center text-center">
                        <span className="text-xs text-white/40 font-bold uppercase mb-2">Córdoba</span>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-2">
                            <span className="text-lg font-bold text-white/70">55</span>
                        </div>
                        <span className="text-[10px] text-white/30">VESPERTINA</span>
                    </div>
                </section>
            </main>
        </div>
    )
}
