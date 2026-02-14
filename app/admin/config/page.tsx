"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import BottomNav from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Clock, ShieldAlert, BadgeDollarSign, ChevronRight, Settings2 } from "lucide-react"

export default function AdminConfigPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Mock Data for Settings
    const [schedules, setSchedules] = useState([
        { id: 'previa', name: 'La Previa', closeTime: '10:00', drawTime: '10:15' },
        { id: 'primera', name: 'La Primera', closeTime: '11:45', drawTime: '12:00' },
        { id: 'matutina', name: 'Matutina', closeTime: '14:45', drawTime: '15:00' },
        { id: 'vespertina', name: 'Vespertina', closeTime: '17:45', drawTime: '18:00' },
        { id: 'nocturna', name: 'Nocturna', closeTime: '20:45', drawTime: '21:00' },
    ])

    const [limits, setLimits] = useState({
        maxPerNumber: 10000,
        maxGlobalRisk: 500000,
        minBet: 100
    })

    const handleScheduleChange = (index: number, field: 'closeTime' | 'drawTime', value: string) => {
        const newSchedules = [...schedules]
        newSchedules[index] = { ...newSchedules[index], [field]: value }
        setSchedules(newSchedules)
    }

    const handleLimitChange = (field: keyof typeof limits, value: string) => {
        setLimits(prev => ({ ...prev, [field]: parseInt(value) || 0 }))
    }

    const handleSave = async () => {
        setLoading(true)
        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                            <Settings2 className="h-5 w-5 text-purple-400" />
                        </div>
                        Configuración
                    </h1>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] pl-[3.25rem] opacity-80">Sistema Global</p>
                </div>
            </header>

            <main className="px-4 pt-8 space-y-10 max-w-4xl mx-auto relative z-10">

                {/* Draw Schedules */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Horarios de Cierre</h2>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-[50px]"></div>

                        <div className="grid grid-cols-3 gap-6 mb-2 px-4 relative z-10">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Turno</span>
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Cierre</span>
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Sorteo</span>
                        </div>

                        <div className="space-y-3 relative z-10">
                            {schedules.map((schedule, index) => (
                                <div key={schedule.id} className="grid grid-cols-3 gap-6 items-center bg-white/[0.03] p-4 rounded-xl border border-white/5 hover:bg-white/[0.06] transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors shadow-[0_0_5px_rgba(204,255,0,0.5)]"></div>
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{schedule.name}</span>
                                    </div>
                                    <div className="relative group/input">
                                        <input
                                            type="time"
                                            value={schedule.closeTime}
                                            onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-center text-xs font-bold text-white outline-none focus:border-red-500/50 focus:text-red-400 transition-all cursor-pointer shadow-inner"
                                        />
                                    </div>
                                    <div className="relative group/input">
                                        <input
                                            type="time"
                                            value={schedule.drawTime}
                                            onChange={(e) => handleScheduleChange(index, 'drawTime', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 text-center text-xs font-bold text-white/60 outline-none focus:border-white/30 focus:text-white transition-all cursor-pointer shadow-inner"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Risk & Limits */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <ShieldAlert className="h-4 w-4 text-red-400" />
                        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Límites y Riesgo</h2>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border border-white/10 space-y-8 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-500/5 rounded-full blur-[50px]"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-3 group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Tope Máximo por Número ($)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-black transition-colors">
                                        <BadgeDollarSign className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="number"
                                        value={limits.maxPerNumber}
                                        onChange={(e) => handleLimitChange('maxPerNumber', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 shadow-inner"
                                    />
                                </div>
                                <p className="text-[9px] text-white/30 font-bold ml-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-primary/50" />
                                    Límite de riesgo individual
                                </p>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Riesgo Global Máximo ($)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-focus-within:bg-red-500 group-focus-within:text-white transition-colors">
                                        <BadgeDollarSign className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="number"
                                        value={limits.maxGlobalRisk}
                                        onChange={(e) => handleLimitChange('maxGlobalRisk', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg font-bold text-white outline-none focus:border-red-500/50 transition-all placeholder:text-white/20 shadow-inner"
                                    />
                                </div>
                                <p className="text-[9px] text-white/30 font-bold ml-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3 text-red-500/50" />
                                    Tope total de banca
                                </p>
                            </div>

                            <div className="space-y-3 group md:col-span-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Apuesta Mínima ($)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-focus-within:bg-white/20 group-focus-within:text-white transition-colors">
                                        <BadgeDollarSign className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="number"
                                        value={limits.minBet}
                                        onChange={(e) => handleLimitChange('minBet', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg font-bold text-white outline-none focus:border-white/30 transition-all placeholder:text-white/20 shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Save Action */}
                <div className="pt-8 pb-12 sticky bottom-6 z-30">
                    <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className={`w-full h-14 rounded-xl text-lg font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] ${success
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                                : 'bg-primary hover:bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.25)]'
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="h-6 w-6 animate-spin mr-3" /> Guardando...</>
                            ) : success ? (
                                <><Settings2 className="h-6 w-6 mr-3" /> ¡Guardado!</>
                            ) : (
                                <><Save className="h-5 w-5 mr-3" /> Guardar Cambios</>
                            )}
                        </Button>
                    </div>
                </div>

            </main>
            <BottomNav />
        </div>
    )
}
