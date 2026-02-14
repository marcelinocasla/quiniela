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
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                        <Settings2 className="h-6 w-6 text-primary" />
                        Configuración
                    </h1>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest pl-8">Sistema Global</p>
                </div>
            </header>

            <main className="px-4 pt-6 space-y-8 max-w-4xl mx-auto">

                {/* Draw Schedules */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Clock className="h-4 w-4 text-white/60" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Horarios de Cierre</h2>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
                        <div className="grid grid-cols-3 gap-4 mb-2 px-2">
                            <span className="text-[9px] font-bold text-white/30 uppercase">Turno</span>
                            <span className="text-[9px] font-bold text-white/30 uppercase text-center">Cierre de Apuestas</span>
                            <span className="text-[9px] font-bold text-white/30 uppercase text-center">Hora del Sorteo</span>
                        </div>

                        {schedules.map((schedule, index) => (
                            <div key={schedule.id} className="grid grid-cols-3 gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-xs font-black text-white uppercase tracking-wider">{schedule.name}</span>
                                <input
                                    type="time"
                                    value={schedule.closeTime}
                                    onChange={(e) => handleScheduleChange(index, 'closeTime', e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg py-2 text-center text-xs font-bold text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                                />
                                <input
                                    type="time"
                                    value={schedule.drawTime}
                                    onChange={(e) => handleScheduleChange(index, 'drawTime', e.target.value)}
                                    className="bg-black/40 border border-white/10 rounded-lg py-2 text-center text-xs font-bold text-white/60 outline-none focus:border-white/30 transition-all cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Risk & Limits */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <ShieldAlert className="h-4 w-4 text-white/60" />
                        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest">Límites y Riesgo</h2>
                    </div>

                    <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 ml-1">Tope Máximo por Número ($)</label>
                                <div className="relative">
                                    <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/60" />
                                    <input
                                        type="number"
                                        value={limits.maxPerNumber}
                                        onChange={(e) => handleLimitChange('maxPerNumber', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <p className="text-[9px] text-white/30 font-medium ml-1">Monto máximo que se aceptará para un solo número en un sorteo.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 ml-1">Riesgo Global Máximo ($)</label>
                                <div className="relative">
                                    <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400/60" />
                                    <input
                                        type="number"
                                        value={limits.maxGlobalRisk}
                                        onChange={(e) => handleLimitChange('maxGlobalRisk', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-red-500/50 transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <p className="text-[9px] text-white/30 font-medium ml-1">Tope total de premios a pagar permitidos por sorteo.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 ml-1">Apuesta Mínima ($)</label>
                                <div className="relative">
                                    <BadgeDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                    <input
                                        type="number"
                                        value={limits.minBet}
                                        onChange={(e) => handleLimitChange('minBet', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Save Action */}
                <div className="pt-4 pb-12 sticky bottom-6 z-30">
                    <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className={`w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] ${success
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Guardando...</>
                            ) : success ? (
                                <><Settings2 className="h-5 w-5 mr-2" /> ¡Configuración Guardada!</>
                            ) : (
                                <><Save className="h-5 w-5 mr-2" /> Guardar Cambios</>
                            )}
                        </Button>
                    </div>
                </div>

            </main>
            <BottomNav />
        </div>
    )
}
