"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, MessageSquare, Monitor, Search, Wallet, QrCode, Banknote, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// import { useAuth } from "@/components/auth-provider" // Assuming AuthProvider is ready
import { Ticket } from "@/components/ticket"
import { initMercadoPago, Wallet as MPWallet } from '@mercadopago/sdk-react'

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
            <DashboardLayout>
                <Ticket bet={ticket} onNewBet={handleNewBet} />
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold">Nueva Jugada</h1>

                {/* Origin Toggle */}
                <div className="flex rounded-md bg-neutral-900 p-1 w-fit">
                    <button onClick={() => setOrigin("counter")} className={cn("flex items-center gap-2 rounded px-3 py-1 text-sm font-medium transition-colors", origin === "counter" ? "bg-neutral-800 text-white shadow" : "text-neutral-500 hover:text-white")}><Monitor className="h-4 w-4" /> Mostrador</button>
                    <button onClick={() => setOrigin("whatsapp")} className={cn("flex items-center gap-2 rounded px-3 py-1 text-sm font-medium transition-colors", origin === "whatsapp" ? "bg-green-600/20 text-green-500" : "text-neutral-500 hover:text-white")}><MessageSquare className="h-4 w-4" /> WhatsApp</button>
                </div>

                {/* WhatsApp Customer Search */}
                {origin === "whatsapp" && (
                    <Card className="border-green-500/20 bg-green-500/5"><CardContent className="pt-6"><div className="flex items-end gap-2"><div className="flex-1 space-y-2"><label className="text-sm font-medium text-green-500">Buscar Cliente</label><div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-green-500/50" /><Input placeholder="Celular o nombre..." className="border-green-500/20 bg-black pl-9 text-white focus-visible:ring-green-500" /></div></div><Button variant="outline" className="border-green-500/20 text-green-500 hover:bg-green-500/10">Vincular</Button></div></CardContent></Card>
                )}

                <Card className="border-neutral-800 bg-neutral-900 text-white">
                    <CardHeader><CardTitle className="text-lg">Detalles de Apuesta</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-neutral-400">Lotería</label>
                            <div className="flex flex-wrap gap-2">{lotteries.map((l) => (<button key={l.id} onClick={() => setLottery(l.id)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors", lottery === l.id ? "border-orange-500 bg-orange-500 text-white" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white")}>{l.name}</button>))}</div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3"><label className="text-sm font-medium text-neutral-400">Número</label><Input type="number" placeholder="0000" className="h-14 text-2xl font-bold tracking-widest text-center border-neutral-800 bg-black focus-visible:ring-orange-500" value={number} onChange={(e) => setNumber(e.target.value.slice(0, 4))} /></div>
                            <div className="space-y-3"><label className="text-sm font-medium text-neutral-400">Ubicación</label><div className="grid grid-cols-2 gap-2">{locations.map((loc) => (<button key={loc.id} onClick={() => setLocation(loc.id)} className={cn("flex items-center justify-center rounded-md border py-2 text-xs font-medium transition-all", location === loc.id ? "border-orange-500 bg-orange-500/10 text-orange-500" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700")}>{loc.label}</button>))}</div></div>
                        </div>
                        <div className="space-y-3"><label className="text-sm font-medium text-neutral-400">Importe</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-neutral-500">$</span><Input type="number" placeholder="0.00" className="pl-8 text-lg font-bold border-neutral-800 bg-black focus-visible:ring-orange-500" value={amount} onChange={(e) => setAmount(e.target.value)} /></div></div>

                        <div className="space-y-3 pt-4 border-t border-neutral-800">
                            <label className="text-sm font-medium text-neutral-400">Pago</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button onClick={() => setPaymentMethod("cash")} className={cn("flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors", paymentMethod === "cash" ? "border-green-500 bg-green-500/10 text-green-500" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900")}><Banknote className="h-6 w-6" /><span className="text-xs font-medium">Efectivo</span></button>
                                <button onClick={() => setPaymentMethod("mp")} className={cn("flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors", paymentMethod === "mp" ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900")}><QrCode className="h-6 w-6" /><span className="text-xs font-medium">Mercado Pago</span></button>
                                <button onClick={() => setPaymentMethod("balance")} className={cn("flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors", paymentMethod === "balance" ? "border-orange-500 bg-orange-500/10 text-orange-500" : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900")}><Wallet className="h-6 w-6" /><span className="text-xs font-medium">Saldo</span></button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 border-t border-neutral-800 bg-neutral-950/50 p-6">
                        <div className="flex w-full items-center justify-between text-sm"><span className="text-neutral-400">Total a Pagar</span><span className="text-xl font-bold text-white">${amount || "0"}</span></div>
                        <div className="flex w-full items-center justify-between text-sm"><span className="text-neutral-400">Posible Premio</span><span className="text-lg font-bold text-orange-500">${possiblePrize.toLocaleString()}</span></div>

                        {preferenceId && paymentMethod === 'mp' ? (
                            <div className="w-full">
                                <MPWallet initialization={{ preferenceId }} />
                                <Button variant="ghost" onClick={() => setPreferenceId(null)} className="w-full mt-2 text-neutral-400">Cancelar Pago</Button>
                            </div>
                        ) : (
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-lg h-12 mt-2" onClick={handleConfirm} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <>Confirmar Jugada <ArrowRight className="ml-2 h-5 w-5" /></>}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    )
}
