"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ChevronLeft, Trash2, CheckCircle2, Eraser, ArrowRight, Delete } from "lucide-react"

export default function NewBetPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    // State
    const [step, setStep] = useState(1) // 1: Turno, 2: Lotería, 3: Números
    const [selectedShift, setSelectedShift] = useState<string>("")
    const [selectedLotteries, setSelectedLotteries] = useState<string[]>([])

    // Input State
    const [activeField, setActiveField] = useState<'number' | 'amount'>('number')
    const [number, setNumber] = useState("")
    const [amount, setAmount] = useState("")
    const [position, setPosition] = useState("1")

    const [ticket, setTicket] = useState<any[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Configuration
    const shifts = [
        { id: 'previa', name: 'LA PREVIA', time: '10:15' },
        { id: 'primera', name: 'LA PRIMERA', time: '12:00' },
        { id: 'matutina', name: 'MATUTINA', time: '15:00' },
        { id: 'vespertina', name: 'VESPERTINA', time: '18:00' },
        { id: 'nocturna', name: 'NOCTURNA', time: '21:00' },
    ]

    const lotteries = [
        { id: 'nacional', name: 'NACIONAL' },
        { id: 'provincia', name: 'PROVINCIA' },
        { id: 'santafe', name: 'SANTA FE' },
        { id: 'cordoba', name: 'CÓRDOBA' },
        { id: 'entrerios', name: 'ENTRE RÍOS' },
    ]

    const positions = [
        { id: '1', name: 'CABEZA' },
        { id: '5', name: 'A LOS 5' },
        { id: '10', name: 'A LOS 10' },
        { id: '20', name: 'A LOS 20' },
    ]

    useEffect(() => {
        if (!loading && !user) router.push("/login")
    }, [user, loading, router])

    // Keypad Logic
    const handleKeypadPress = (val: string) => {
        if (activeField === 'number') {
            if (number.length >= 4) return
            setNumber(prev => prev + val)
        } else {
            if (amount.length >= 6) return
            setAmount(prev => prev + val)
        }
    }

    const handleBackspace = () => {
        if (activeField === 'number') setNumber(prev => prev.slice(0, -1))
        else setAmount(prev => prev.slice(0, -1))
    }

    const handleAddLine = () => {
        if (!selectedShift) return alert("Falta el Turno")
        if (selectedLotteries.length === 0) return alert("Falta Lotería")
        if (number.length < 2) return alert("Número mínimo 2 cifras")
        if (!amount || Number(amount) < 1) return alert("Monto inválido")

        const newLines = selectedLotteries.map(lotteryId => {
            const lotteryName = lotteries.find(l => l.id === lotteryId)?.name
            const shiftName = shifts.find(s => s.id === selectedShift)?.name
            return {
                id: Date.now() + Math.random(),
                lottery: lotteryName,
                shift: shiftName,
                number,
                position: Number(position),
                amount: Number(amount)
            }
        })

        setTicket([...ticket, ...newLines])
        setNumber("")
        setAmount("")
        setActiveField('number') // Reset focus
        // Optional: Scroll to receipt?
    }

    const handlePlaceBet = async () => {
        if (ticket.length === 0) return
        setIsSubmitting(true)

        try {
            const betsToInsert = ticket.map(item => ({
                user_id: user?.uid,
                lottery: `${item.lottery} - ${item.shift}`,
                number: item.number,
                position: item.position,
                amount: item.amount,
                status: 'pending',
                possible_prize: calculatePrize(item.number, item.amount, item.position)
            }))

            const { error } = await supabase.from('bets').insert(betsToInsert)
            if (error) throw error

            setShowSuccess(true)
            setTimeout(() => router.push('/dashboard'), 3000)
        } catch (error: any) {
            alert("Error: " + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const calculatePrize = (number: string, amount: number, pos: number) => {
        let multiplier = 0
        if (number.length === 2) multiplier = 70
        if (number.length === 3) multiplier = 600
        if (number.length === 4) multiplier = 3500
        return (amount * multiplier) / pos
    }

    const toggleLottery = (id: string) => {
        setSelectedLotteries(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        )
    }

    if (loading) return null
    if (showSuccess) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white text-center">
            <div className="space-y-6">
                <CheckCircle2 className="w-24 h-24 text-[#CCFF00] mx-auto animate-bounce" />
                <h1 className="text-4xl font-black text-[#CCFF00]">¡JUGADA EXITOSA!</h1>
                <p className="text-xl">Mucha suerte 🍀</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#CCFF00]/30 pb-32">

            {/* High Contrast Header */}
            <header className="bg-[#0f172a] border-b border-white/10 px-4 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
                <Link href="/dashboard" className="p-2 bg-white/10 rounded-lg">
                    <ChevronLeft className="w-8 h-8 text-white" />
                </Link>
                <h1 className="text-2xl font-black tracking-wider text-white">NUEVA JUGADA</h1>
                <div className="w-12" /> {/* Spacer */}
            </header>

            <main className="px-4 py-6 space-y-8 max-w-lg mx-auto">

                {/* STEP 1: TURNO */}
                <section>
                    <h2 className="text-[#CCFF00] text-lg font-black uppercase tracking-widest mb-3 border-b border-[#CCFF00]/20 pb-1">1. ¿Qué Turno?</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {shifts.map(shift => (
                            <button
                                key={shift.id}
                                onClick={() => setSelectedShift(shift.id)}
                                className={`w-full py-4 px-6 rounded-xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${selectedShift === shift.id
                                        ? 'bg-[#CCFF00] border-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                                        : 'bg-[#1e293b] border-white/10 text-white hover:bg-[#334155]'
                                    }`}
                            >
                                <span className="text-xl font-bold">{shift.name}</span>
                                <span className={`text-sm font-bold ${selectedShift === shift.id ? 'text-black/80' : 'text-white/50'}`}>{shift.time}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* STEP 2: LOTERIA */}
                <section>
                    <h2 className="text-[#CCFF00] text-lg font-black uppercase tracking-widest mb-3 border-b border-[#CCFF00]/20 pb-1">2. ¿Qué Lotería?</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {lotteries.map(lottery => (
                            <button
                                key={lottery.id}
                                onClick={() => toggleLottery(lottery.id)}
                                className={`w-full py-4 px-6 rounded-xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${selectedLotteries.includes(lottery.id)
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                                        : 'bg-[#1e293b] border-white/10 text-white hover:bg-[#334155]'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedLotteries.includes(lottery.id) ? 'bg-white border-white text-blue-600' : 'border-white/30'
                                    }`}>
                                    {selectedLotteries.includes(lottery.id) && <span className="font-black">✓</span>}
                                </div>
                                <span className="text-xl font-bold">{lottery.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* STEP 3: NUMEROS (Keypad) */}
                <section className="bg-[#1e293b] p-4 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-[#CCFF00] text-lg font-black uppercase tracking-widest mb-4 border-b border-[#CCFF00]/20 pb-1">3. Tu Apuesta</h2>

                    {/* Display Inputs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div
                            onClick={() => setActiveField('number')}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${activeField === 'number' ? 'border-[#CCFF00] bg-white/5 shadow-inner' : 'border-white/10 bg-black/20'
                                }`}
                        >
                            <label className="text-xs text-white/50 font-bold uppercase block mb-1">NÚMERO</label>
                            <div className={`text-4xl font-black tracking-widest h-12 flex items-center justify-center ${!number ? 'text-white/20' : 'text-white'}`}>
                                {number || "----"}
                            </div>
                        </div>
                        <div
                            onClick={() => setActiveField('amount')}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${activeField === 'amount' ? 'border-[#CCFF00] bg-white/5 shadow-inner' : 'border-white/10 bg-black/20'
                                }`}
                        >
                            <label className="text-xs text-white/50 font-bold uppercase block mb-1">MONTO</label>
                            <div className={`text-4xl font-black tracking-widest h-12 flex items-center justify-center ${!amount ? 'text-white/20' : 'text-[#CCFF00]'}`}>
                                {amount ? `$${amount}` : "$0"}
                            </div>
                        </div>
                    </div>

                    {/* Positions */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {positions.map(pos => (
                            <button
                                key={pos.id}
                                onClick={() => setPosition(pos.id)}
                                className={`py-2 rounded-lg text-[10px] font-bold uppercase border active:scale-95 transition-all ${position === pos.id ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20'
                                    }`}
                            >
                                {pos.name}
                            </button>
                        ))}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handleKeypadPress(num.toString())}
                                className="h-16 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-3xl font-bold shadow-lg active:translate-y-1 transition-all"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => setNumber("")} // Clear field? Or just backspace logic
                            className="h-16 rounded-xl bg-red-900/40 hover:bg-red-900/60 text-red-500 font-bold flex items-center justify-center active:translate-y-1 transition-all"
                        >
                            <Trash2 />
                        </button>
                        <button
                            onClick={() => handleKeypadPress("0")}
                            className="h-16 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-3xl font-bold shadow-lg active:translate-y-1 transition-all"
                        >
                            0
                        </button>
                        <button
                            onClick={handleBackspace}
                            className="h-16 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center active:translate-y-1 transition-all"
                        >
                            <Delete />
                        </button>
                    </div>

                    <button
                        onClick={handleAddLine}
                        className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <ArrowRight className="w-6 h-6" /> AGREGAR
                    </button>
                </section>

                {/* Ticket Summary */}
                {ticket.length > 0 && (
                    <section className="bg-[#1e293b] p-4 rounded-3xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white text-lg">TU TICKET ({ticket.length})</h3>
                            <span className="text-2xl font-black text-[#CCFF00]">${ticket.reduce((a, b) => a + b.amount, 0)}</span>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                            {ticket.map((item) => (
                                <div key={item.id} className="bg-black/40 p-3 rounded-xl flex justify-between items-center border border-white/5">
                                    <div className="leading-tight">
                                        <div className="font-black text-white text-xl">{item.number}</div>
                                        <div className="text-[10px] text-white/50 uppercase">{item.lottery} • {item.shift}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#CCFF00] text-lg">${item.amount}</span>
                                        <button onClick={() => setTicket(ticket.filter(t => t.id !== item.id))} className="text-red-500">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handlePlaceBet}
                            disabled={isSubmitting}
                            className="w-full py-6 rounded-2xl bg-[#CCFF00] hover:bg-[#b2df00] text-black font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.3)] active:scale-[0.95] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR TODO'}
                        </button>
                    </section>
                )}

            </main>
        </div>
    )
}
