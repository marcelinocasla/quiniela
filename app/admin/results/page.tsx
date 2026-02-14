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
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                        <Dices className="h-6 w-6 text-primary" />
                        Cargar Sorteo
                    </h1>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest pl-8">Panel de Administración</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold uppercase text-white outline-none focus:border-primary/50 transition-all"
                    />
                </div>
            </header>

            <main className="px-4 pt-6 space-y-6 max-w-4xl mx-auto">

                {/* Selectors Card */}
                <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">

                    {/* Lottery Selector */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 ml-1">Lotería</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {LOTTERIES.map((lottery) => (
                                <button
                                    key={lottery.id}
                                    onClick={() => setSelectedLottery(lottery)}
                                    className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group ${selectedLottery.id === lottery.id
                                            ? `${lottery.bg} ${lottery.border} shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                                            : 'bg-black/20 border-white/5 hover:bg-white/5'
                                        }`}
                                >
                                    <span className={`text-xs font-black uppercase tracking-wider ${selectedLottery.id === lottery.id ? 'text-white' : 'text-white/60'}`}>
                                        {lottery.name}
                                    </span>
                                    {selectedLottery.id === lottery.id && (
                                        <div className={`absolute inset-0 rounded-xl border-2 ${lottery.border} opacity-50`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shift Selector */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50 ml-1">Turno</label>
                        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                            {SHIFTS.map((shift) => (
                                <button
                                    key={shift.id}
                                    onClick={() => setSelectedShift(shift)}
                                    className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap ${selectedShift.id === shift.id
                                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(57,255,20,0.4)]'
                                            : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    {shift.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Numbers Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/50">Ingreso de Números</label>
                        <button onClick={handleClear} className="text-[10px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                            <RotateCcw className="h-3 w-3" /> Limpiar
                        </button>
                    </div>

                    {/* HEAD (Cabeza) - Position 1 */}
                    <div className="glass-card p-6 rounded-3xl border border-primary/20 bg-primary/5 relative overflow-hidden flex items-center justify-between gap-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">La Cabeza</h3>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Posición 1</p>
                            </div>
                        </div>

                        <div className="relative z-10 w-32">
                            <input
                                id="num-0"
                                type="text"
                                inputMode="numeric"
                                value={numbers[0]}
                                onChange={(e) => handleNumberChange(0, e.target.value)}
                                placeholder="0000"
                                className="w-full bg-black/50 border-2 border-primary/50 text-3xl font-black text-center text-white rounded-xl py-3 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-white/10 tracking-widest shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Remaining Positions (2-20) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {Array.from({ length: 19 }).map((_, i) => {
                            const posIndex = i + 1
                            return (
                                <div key={posIndex} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors focus-within:border-white/20 focus-within:bg-white/10">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Pos {posIndex + 1}</span>
                                    <input
                                        id={`num-${posIndex}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={numbers[posIndex]}
                                        onChange={(e) => handleNumberChange(posIndex, e.target.value)}
                                        placeholder="----"
                                        className="w-full bg-transparent border-none text-xl font-bold text-center text-white focus:ring-0 outline-none p-0 placeholder:text-white/10 tracking-widest"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 pb-12 sticky bottom-6 z-30">
                    <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl">
                        <Button
                            onClick={handlePublish}
                            disabled={loading}
                            className={`w-full h-14 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] ${success
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                                }`}
                        >
                            {loading ? (
                                <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Publicando...</>
                            ) : success ? (
                                <><CheckCircle2 className="h-5 w-5 mr-2" /> ¡Resultados Publicados!</>
                            ) : (
                                <><Save className="h-5 w-5 mr-2" /> Publicar Resultados</>
                            )}
                        </Button>
                    </div>
                </div>

            </main>
            <BottomNav />
        </div>
    )
}
