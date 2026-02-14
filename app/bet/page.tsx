"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/BottomNav"
import { ArrowRight, MessageSquare, Monitor, Search, Wallet, QrCode, Banknote, Loader2, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
// import { useAuth } from "@/components/auth-provider" // Assuming AuthProvider is ready
import { Ticket } from "@/components/ticket"
import { initMercadoPago, Wallet as MPWallet } from '@mercadopago/sdk-react'
import Link from "next/link"

// Initialize MP Frontend SDK
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

export default function BetPage() {
    // const { user } = useAuth();
    const user = { email: "demo@quiniela.com" }; // Mock for now until Auth is fully wrapped
    const router = useRouter();

    const [origin, setOrigin] = useState<"counter" | "whatsapp">("counter")
    const [lottery, setLottery] = useState<string>("")
    const [location, setLocation] = useState<string>("cabeza")
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "mp" | "balance">("cash")
    const [number, setNumber] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [ticket, setTicket] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [preferenceId, setPreferenceId] = useState<string | null>(null);

    const lotteries = [
        { id: "nacional", name: "Nacional" },
        { id: "provincia", name: "Provincia" },
        { id: "santafe", name: "Santa Fe" },
        { id: "cordoba", name: "Córdoba" },
        { id: "mendoza", name: "Mendoza" },
    ]

    const locations = [
        { id: "cabeza", label: "A la Cabeza", multiplier: 70 },
        { id: "5", label: "A los 5", multiplier: 14 },
        { id: "10", label: "A los 10", multiplier: 7 },
        { id: "20", label: "A los 20", multiplier: 3.5 },
    ]

    const possiblePrize = amount && number ? (parseInt(amount) * (locations.find(l => l.id === location)?.multiplier || 0)) : 0

    const handleConfirm = async () => {
        if (!lottery || !number || !amount) {
            alert("Completa todos los campos");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === 'mp') {
                const res = await fetch('/api/mercadopago/preference', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: `Jugada ${lottery} - ${number}`,
                        quantity: 1,
                        unit_price: parseInt(amount),
                        userEmail: user.email
                    })
                });
                const data = await res.json();
                if (data.id) {
                    setPreferenceId(data.id);
                }
                setLoading(false);
                return; // Stop here to show MP button
            }

            // Save Bet to DB
            const res = await fetch('/api/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lottery: lotteries.find(l => l.id === lottery)?.name,
                    number,
                    location,
                    amount: parseInt(amount),
                    origin,
                    paymentMethod,
                    userEmail: user.email
                })
            });

            const data = await res.json();

            if (data.success) {
                setTicket({
                    id: data.bet.id.split('-')[0].toUpperCase(), // Short ID
                    lottery: data.bet.lottery,
                    number: data.bet.number,
                    location: data.bet.location,
                    amount: data.bet.amount,
                    possiblePrize: data.bet.possible_prize,
                    date: new Date(data.bet.created_at)
                });
            } else {
                alert("Error al cargar jugada: " + data.error);
            }

        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    const handleNewBet = () => {
        setTicket(null)
        setNumber("")
        setAmount("")
        setLottery("")
        setPreferenceId(null)
    }

    if (ticket) {
        return (
            <div className="min-h-screen bg-background text-white font-sans flex flex-col items-center justify-center p-4">
                <Ticket bet={ticket} onNewBet={handleNewBet} />
                <BottomNav />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
                <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Nueva Jugada</h1>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Cargar Apuesta</p>
                </div>
            </header>

            <div className="px-6 py-8 mx-auto max-w-2xl space-y-6">

                {/* Origin Toggle */}
                <div className="bg-black/40 backdrop-blur-md p-1 rounded-2xl flex w-fit border border-white/5">
                    <button onClick={() => setOrigin("counter")} className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all", origin === "counter" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white")}>
                        <Monitor className="h-4 w-4" /> Mostrador
                    </button>
                    <button onClick={() => setOrigin("whatsapp")} className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all", origin === "whatsapp" ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-white/40 hover:text-white")}>
                        <MessageSquare className="h-4 w-4" /> WhatsApp
                    </button>
                </div>

                {/* WhatsApp Customer Search */}
                {origin === "whatsapp" && (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-3xl animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Buscar Cliente</label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                                    <input
                                        placeholder="Celular o nombre..."
                                        className="w-full bg-black/40 border border-primary/20 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 font-bold px-4 py-2 rounded-xl text-xs transition-colors h-[42px]">
                                Vincular
                            </button>
                        </div>
                    </div>
                )}

                <div className="glass-card border border-white/5 rounded-3xl overflow-hidden relative">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-lg font-bold text-white">Detalles de Apuesta</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Lotería</label>
                            <div className="flex flex-wrap gap-2">
                                {lotteries.map((l) => (
                                    <button
                                        key={l.id}
                                        onClick={() => setLottery(l.id)}
                                        className={cn(
                                            "rounded-xl border px-4 py-2 text-xs font-bold transition-all uppercase tracking-wide",
                                            lottery === l.id
                                                ? "border-primary bg-primary text-black shadow-[0_0_15px_rgba(57,255,20,0.5)] scale-105"
                                                : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        {l.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Número</label>
                                <input
                                    type="number"
                                    placeholder="0000"
                                    className="w-full h-16 text-3xl font-black tracking-[0.2em] text-center bg-black/40 border border-white/10 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none text-white placeholder:text-white/10 transition-all"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value.slice(0, 4))}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Ubicación</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {locations.map((loc) => (
                                        <button
                                            key={loc.id}
                                            onClick={() => setLocation(loc.id)}
                                            className={cn(
                                                "flex items-center justify-center rounded-xl border py-3 text-[10px] font-bold uppercase transition-all",
                                                location === loc.id
                                                    ? "border-primary/50 bg-primary/20 text-primary"
                                                    : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            {loc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Importe</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-white/50 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full h-14 pl-10 text-xl font-bold bg-black/40 border border-white/10 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none text-white placeholder:text-white/10 transition-all"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-white/5">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Método de Pago</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button onClick={() => setPaymentMethod("cash")} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all", paymentMethod === "cash" ? "border-green-500 bg-green-500/20 text-green-500" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white")}>
                                    <Banknote className="h-6 w-6" />
                                    <span className="text-[10px] font-bold uppercase">Efectivo</span>
                                </button>
                                <button onClick={() => setPaymentMethod("mp")} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all", paymentMethod === "mp" ? "border-blue-500 bg-blue-500/20 text-blue-500" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white")}>
                                    <QrCode className="h-6 w-6" />
                                    <span className="text-[10px] font-bold uppercase">Mercado Pago</span>
                                </button>
                                <button onClick={() => setPaymentMethod("balance")} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all", paymentMethod === "balance" ? "border-primary bg-primary/20 text-primary" : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white")}>
                                    <Wallet className="h-6 w-6" />
                                    <span className="text-[10px] font-bold uppercase">Saldo</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/5 bg-black/20 p-6 backdrop-blur-sm">
                        <div className="flex w-full items-center justify-between text-sm">
                            <span className="text-white/60 font-medium">Total a Pagar</span>
                            <span className="text-2xl font-black text-white px-2 decoration-primary underline decoration-2 underline-offset-4">${amount || "0"}</span>
                        </div>
                        <div className="flex w-full items-center justify-between text-sm">
                            <span className="text-white/60 font-medium">Posible Premio</span>
                            <span className="text-lg font-bold text-primary drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">${possiblePrize.toLocaleString()}</span>
                        </div>

                        {preferenceId && paymentMethod === 'mp' ? (
                            <div className="w-full animate-in fade-in zoom-in duration-300">
                                <MPWallet initialization={{ preferenceId }} />
                                <button onClick={() => setPreferenceId(null)} className="w-full mt-2 text-sm text-white/40 hover:text-white transition-colors">Cancelar Pago</button>
                            </div>
                        ) : (
                            <button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black h-14 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:shadow-[0_0_35px_rgba(57,255,20,0.6)] active:scale-[0.98] transition-all uppercase tracking-widest mt-2 disabled:opacity-50 disabled:pointer-events-none"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Confirmar Jugada <ArrowRight className="ml-2 h-6 w-6" /></>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
