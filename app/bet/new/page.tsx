"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"
import { ChevronLeft, Trash2, Plus, Info, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function NewBetPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    // State for form inputs
    const [selectedLotteries, setSelectedLotteries] = useState<string[]>([])
    const [selectedShift, setSelectedShift] = useState<string>("")
    const [number, setNumber] = useState("")
    const [amount, setAmount] = useState("")
    const [position, setPosition] = useState("1") // Default to 'A la Cabeza'

    // State for the ticket (list of bets)
    const [ticket, setTicket] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Derived state
    const totalAmount = ticket.reduce((sum, item) => sum + item.amount, 0)

    // Configuration Options
    const lotteries = [
        { id: 'nacional', name: 'Nacional' },
        { id: 'provincia', name: 'Provincia' },
        { id: 'santafe', name: 'Santa Fe' },
        { id: 'cordoba', name: 'Córdoba' },
        { id: 'entrerios', name: 'Entre Ríos' },
    ]

    const shifts = [
        { id: 'previa', name: 'La Previa', time: '10:15' },
        { id: 'primera', name: 'La Primera', time: '12:00' },
        { id: 'matutina', name: 'Matutina', time: '15:00' },
        { id: 'vespertina', name: 'Vespertina', time: '18:00' },
        { id: 'nocturna', name: 'Nocturna', time: '21:00' },
    ]

    const positions = [
        { id: '1', name: 'A la Cabeza (1)' },
        { id: '5', name: 'A los 5' },
        { id: '10', name: 'A los 10' },
        { id: '20', name: 'A los 20' },
    ]

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [user, loading, router])

    const handleAddLine = () => {
        if (!selectedShift) {
            alert("Selecciona un turno")
            return
        }
        if (selectedLotteries.length === 0) {
            alert("Selecciona al menos una lotería")
            return
        }
        if (!number || number.length < 2 || number.length > 4) {
            alert("El número debe tener entre 2 y 4 cifras")
            return
        }
        if (!amount || Number(amount) < 1) {
            alert("Ingresa un monto válido")
            return
        }

        // Add a line for each selected lottery
        const newLines = selectedLotteries.map(lotteryId => {
            const lotteryName = lotteries.find(l => l.id === lotteryId)?.name || lotteryId
            return {
                id: Date.now() + Math.random(), // Temp unique ID
                lottery: lotteryName,
                shift: shifts.find(s => s.id === selectedShift)?.name,
                number,
                position: Number(position),
                amount: Number(amount)
            }
        })

        setTicket([...ticket, ...newLines])

        // Reset inputs mostly, keep shift/lottery for convenience? 
        // Let's reset number and amount for rapid entry
        setNumber("")
        setAmount("")
    }

    const removeLine = (id: number) => {
        setTicket(ticket.filter(item => item.id !== id))
    }

    const handlePlaceBet = async () => {
        if (ticket.length === 0) return
        setIsSubmitting(true)

        try {
            // Prepare data for Supabase
            const betsToInsert = ticket.map(item => ({
                user_id: user?.uid, // Using Firebase UID stored in profile
                lottery: item.lottery, // Schema expects 'lottery' text
                number: item.number,
                position: item.position,
                amount: item.amount,
                status: 'pending',
                possible_prize: calculatePrize(item.number, item.amount, item.position)
            }))
            // Note: 'shift'/draw_time column might be missing in schema based on previous view? 
            // Let's check schema later. For now assuming 'lottery' might handle it or we need a column.
            // Actually, looking at dashboard mocks, we might need to store shift.
            // But schema.sql viewed earlier had: lottery, number, position, amount, status, possible_prize. 
            // Ideally we should concatenate lottery + shift or just store into 'lottery' column like "Nacional - Matutina".

            const finalBets = betsToInsert.map(b => ({
                ...b,
                lottery: `${b.lottery} - ${ticket.find(t => t.number === b.number && t.amount === b.amount)?.shift}`
            }))

            const { error } = await supabase
                .from('bets')
                .insert(finalBets)

            if (error) throw error

            setShowSuccess(true)
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)

        } catch (error: any) {
            console.error("Error placing bet:", error)
            alert("Error al realizar la jugada: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const calculatePrize = (number: string, amount: number, pos: number) => {
        // Standard multipliers (approx)
        let multiplier = 0
        const digits = number.length

        if (digits === 2) multiplier = 70
        if (digits === 3) multiplier = 600
        if (digits === 4) multiplier = 3500

        // Divide by position (if betting to 10, prize is 1/10th)
        return (amount * multiplier) / pos
    }

    const toggleLottery = (id: string) => {
        if (selectedLotteries.includes(id)) {
            setSelectedLotteries(selectedLotteries.filter(l => l !== id))
        } else {
            setSelectedLotteries([...selectedLotteries, id])
        }
    }

    if (loading) return null

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white p-6">
                <div className="glass-card p-10 rounded-3xl text-center space-y-6 max-w-sm w-full border border-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-xl"></div>
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto relative z-10">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2">¡Jugada Realizada!</h2>
                        <p className="text-white/60">Tu ticket ha sido generado con éxito. ¡Mucha suerte!</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-32 antialiased">
            {/* Navbar */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-4">
                <Link href="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-lg font-bold">Nueva Jugada</h1>
            </header>

            <main className="px-4 py-6 space-y-8 max-w-xl mx-auto">

                {/* 1. Select Shift */}
                <section>
                    <label className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-3 block">1. Elige el Turno</label>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                        {shifts.map(shift => (
                            <button
                                key={shift.id}
                                onClick={() => setSelectedShift(shift.id)}
                                className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all ${selectedShift === shift.id ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                            >
                                <span className="block text-sm font-bold">{shift.name}</span>
                                <span className={`text-[10px] font-medium opacity-80 block mt-0.5`}>{shift.time}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Select Lotteries */}
                <section>
                    <label className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-3 block">2. Selecciona Loterías</label>
                    <div className="grid grid-cols-2 gap-3">
                        {lotteries.map(lottery => (
                            <button
                                key={lottery.id}
                                onClick={() => toggleLottery(lottery.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all relative overflow-hidden group ${selectedLotteries.includes(lottery.id) ? 'bg-white/10 border-primary/50 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedLotteries.includes(lottery.id) ? 'border-primary bg-primary' : 'border-white/30'}`}>
                                    {selectedLotteries.includes(lottery.id) && <span className="text-[8px] text-black font-bold">✓</span>}
                                </div>
                                <span className="text-sm font-bold">{lottery.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Input Numbers */}
                <section className="glass-card p-5 rounded-3xl border border-white/10">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 block">3. Detalle de Apuesta</label>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-white/60 mb-1.5 block ml-1">Número</label>
                                <input
                                    type="tel"
                                    maxLength={4}
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="1234"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-center text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/60 mb-1.5 block ml-1">Monto ($)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="100"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-center text-primary placeholder:text-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-white/60 mb-1.5 block ml-1">Ubicación</label>
                            <div className="flex bg-white/5 p-1 rounded-xl">
                                {positions.map(pos => (
                                    <button
                                        key={pos.id}
                                        onClick={() => setPosition(pos.id)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${position === pos.id ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
                                    >
                                        {pos.name.replace('A la ', '').replace('A los ', '')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddLine}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white font-bold uppercase text-xs tracking-widest transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar al Ticket
                        </button>
                    </div>
                </section>

                {/* 4. Ticket Summary */}
                {ticket.length > 0 && (
                    <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-lg font-bold">Tu Ticket</h3>
                            <button onClick={() => setTicket([])} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Limpiar
                            </button>
                        </div>

                        <div className="space-y-2">
                            {ticket.map((item, idx) => (
                                <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                                            {item.number}
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold">{item.lottery} • {item.shift}</p>
                                            <p className="text-[10px] text-white/40 uppercase font-bold mt-0.5">A los {item.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-primary">${item.amount}</span>
                                        <button onClick={() => removeLine(item.id)} className="text-white/20 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="glass-card p-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Total a Pagar</span>
                                <span className="text-4xl font-black text-white tracking-tighter">${totalAmount.toLocaleString('es-AR')}</span>
                            </div>
                            <button
                                onClick={handlePlaceBet}
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Procesando...' : 'Confirmar Jugada'}
                            </button>
                        </div>
                    </section>
                )}

            </main>
        </div>
    )
}
