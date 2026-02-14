"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Calendar, Trophy, AlertCircle, CheckCircle2, ChevronRight, Dices, RotateCcw } from "lucide-react"

// Tipos
const LOTTERIES = [
    { id: 'nacional', name: 'Nacional', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'provincia', name: 'Provincia', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { id: 'santafe', name: 'Santa Fe', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { id: 'cordoba', name: 'Córdoba', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 'entrerios', name: 'Entre Ríos', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
]

const SHIFTS = [
    { id: 'previa', name: 'La Previa', time: '10:15' },
    { id: 'primera', name: 'La Primera', time: '12:00' },
    { id: 'matutina', name: 'Matutina', time: '15:00' },
    { id: 'vespertina', name: 'Vespertina', time: '18:00' },
    { id: 'nocturna', name: 'Nocturna', time: '21:00' },
]

export default function AdminResultsPage() {
    const { user } = useAuth() // Asumimos rol admin verificado en middleware o layout superior
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Estado del Formulario
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedLottery, setSelectedLottery] = useState(LOTTERIES[0])
    const [selectedShift, setSelectedShift] = useState(SHIFTS[0])

    // Estado de los 20 números (Array de strings para permitir vacío temporalmente durante tipeo)
    const [numbers, setNumbers] = useState<string[]>(Array(20).fill(''))

    const handleNumberChange = (index: number, value: string) => {
        // Solo permitir números y máximo 4 dígitos
        if (!/^\d*$/.test(value)) return
        if (value.length > 4) return

        const newNumbers = [...numbers]
        newNumbers[index] = value
        setNumbers(newNumbers)

        // Auto-focus siguiente input si completó 4 dígitos
        if (value.length === 4 && index < 19) {
            const nextInput = document.getElementById(`num-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handlePublish = async () => {
        // Validaciones
        const cleanNumbers = numbers.map(n => n === '' ? -1 : parseInt(n))
        if (cleanNumbers.includes(-1)) {
            alert("Por favor completa los 20 números. Usa 0000 si es necesario.")
            return
        }

        setLoading(true)
        setSuccess(false)

        try {
            // Verificar si ya existe para actualizar (upsert)
            const { error } = await supabase
                .from('lottery_results')
                .upsert({
                    lottery_name: selectedLottery.name,
                    lottery_type: selectedShift.name,
                    draw_date: selectedDate, // 'YYYY-MM-DD'
                    numbers: cleanNumbers
                }, { onConflict: 'lottery_name, lottery_type, draw_date' })

            if (error) throw error

            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)

            // Opcional: Limpiar o mantener para correcciones? Mantenemos por si el admin quiere corregir algo rápido.

        } catch (error: any) {
            console.error("Error publishing results:", error)
            alert("Error al publicar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        if (confirm("¿Borrar todos los números ingresados?")) {
            setNumbers(Array(20).fill(''))
        }
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                            <Dices className="h-5 w-5 text-primary" />
                        </div>
                        Cargar Sorteo
                    </h1>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] pl-[3.25rem]">Panel de Administración</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold uppercase text-white outline-none focus:border-primary/50 transition-all shadow-inner"
                        />
                    </div>
                </div>
            </header>

            <main className="px-4 pt-8 space-y-8 max-w-4xl mx-auto relative z-10">

                {/* Selectors Card */}
                <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

                    {/* Lottery Selector */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1 flex items-center gap-2">
                            <span className="w-6 h-[1px] bg-white/20"></span> Lotería
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {LOTTERIES.map((lottery) => (
                                <button
                                    key={lottery.id}
                                    onClick={() => setSelectedLottery(lottery)}
                                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden ${selectedLottery.id === lottery.id
                                        ? `bg-white/[0.05] ${lottery.border.replace('/20', '/50')} shadow-[0_0_20px_rgba(0,0,0,0.3)] scale-105`
                                        : 'bg-black/20 border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    {selectedLottery.id === lottery.id && <div className={`absolute inset-0 bg-gradient-to-b ${lottery.bg} opacity-20`}></div>}
                                    <span className={`text-xs font-black uppercase tracking-wider relative z-10 ${selectedLottery.id === lottery.id ? 'text-white' : 'text-white/40'}`}>
                                        {lottery.name}
                                    </span>
                                    {selectedLottery.id === lottery.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse relative z-10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shift Selector */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1 flex items-center gap-2">
                            <span className="w-6 h-[1px] bg-white/20"></span> Turno
                        </label>
                        <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 snap-x">
                            {SHIFTS.map((shift) => (
                                <button
                                    key={shift.id}
                                    onClick={() => setSelectedShift(shift)}
                                    className={`flex-1 min-w-[120px] py-4 px-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap snap-center relative overflow-hidden group ${selectedShift.id === shift.id
                                        ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                                        : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="relative z-10">{shift.name}</span>
                                    {selectedShift.id === shift.id && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Numbers Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Ingreso de Números</label>
                        <button onClick={handleClear} className="text-[10px] font-bold text-red-500/80 hover:text-red-400 flex items-center gap-2 transition-colors bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <RotateCcw className="h-3 w-3" /> Limpiar
                        </button>
                    </div>

                    {/* HEAD (Cabeza) - Position 1 */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-primary/30 bg-black/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none animate-pulse"></div>

                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                                <Trophy className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">La Cabeza</h3>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1">Posición 1</p>
                            </div>
                        </div>

                        <div className="relative z-10 w-full md:w-48 group-focus-within:scale-110 transition-transform duration-300">
                            <input
                                id="num-0"
                                type="text"
                                inputMode="numeric"
                                value={numbers[0]}
                                onChange={(e) => handleNumberChange(0, e.target.value)}
                                placeholder="0000"
                                className="w-full bg-black/60 border-2 border-primary/50 text-5xl font-black text-center text-white rounded-2xl py-4 focus:border-primary focus:ring-[5px] focus:ring-primary/20 outline-none transition-all placeholder:text-white/5 tracking-widest shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Remaining Positions (2-20) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 19 }).map((_, i) => {
                            const posIndex = i + 1
                            return (
                                <div key={posIndex} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-white/[0.08] transition-colors focus-within:border-primary/50 focus-within:bg-white/[0.08] group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/0 group-focus-within:bg-primary/50 transition-colors"></div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest group-focus-within:text-primary transition-colors">Pos {posIndex + 1}</span>
                                    <input
                                        id={`num-${posIndex}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={numbers[posIndex]}
                                        onChange={(e) => handleNumberChange(posIndex, e.target.value)}
                                        placeholder="----"
                                        className="w-full bg-transparent border-none text-2xl font-black text-center text-white/90 focus:text-white focus:ring-0 outline-none p-0 placeholder:text-white/5 tracking-widest transition-colors font-mono"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-8 pb-12 sticky bottom-6 z-30">
                    <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl">
                        <Button
                            onClick={handlePublish}
                            disabled={loading}
                            className={`w-full h-14 rounded-xl text-lg font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98] ${success
                                ? 'bg-green-500 hover:bg-green-600 text-black shadow-green-500/20'
                                : 'bg-primary hover:bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.25)]'
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="h-6 w-6 animate-spin mr-3" /> Publicando...</>
                            ) : success ? (
                                <><CheckCircle2 className="h-6 w-6 mr-3" /> ¡Publicado!</>
                            ) : (
                                <><Save className="h-5 w-5 mr-3" /> Publicar Resultados</>
                            )}
                        </Button>
                    </div>
                </div>

            </main>
            <BottomNav />
        </div>
    )
}
