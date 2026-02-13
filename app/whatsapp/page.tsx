"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mic, Send, PlusCircle, CheckCircle, X, Phone, MoreVertical, Paperclip, Loader2, Play, Settings, ChevronLeft, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export default function WhatsAppPage() {
    const { user, profile } = useAuth()
    const [agencyId, setAgencyId] = useState<string | null>(null)
    const [isBetDialogOpen, setIsBetDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [betData, setBetData] = useState({
        lottery: '',
        number: '',
        amount: '',
        location: 'cabeza',
    })

    useEffect(() => {
        const fetchAgency = async () => {
            if (profile?.id) {
                const { data } = await supabase
                    .from('agencies')
                    .select('id')
                    .eq('owner_id', profile.id)
                    .single()

                if (data) setAgencyId(data.id)
            }
        }
        fetchAgency()
    }, [profile])

    const chats = [
        { id: 1, name: "Juan P.", lastMsg: "Audio (0:12)", time: "10:43 AM", status: "pending", unread: 2, avatarColor: "bg-[#ff6600]" },
        { id: 2, name: "Maria G.", lastMsg: "Quiero el 45 a la cabeza...", time: "10:15 AM", status: "pending", unread: 1, avatarColor: "bg-green-500" },
        { id: 3, name: "Ricardo L.", lastMsg: "Listo gracias!", time: "09:45 AM", status: "processed", unread: 0, avatarColor: "bg-[#ff6600]/20" },
        { id: 4, name: "Carlos M.", lastMsg: "¿Cuánto paga la cabeza?", time: "Ayer", status: "processed", unread: 0, avatarColor: "bg-neutral-500" },
    ]

    const handleLoadBet = async () => {
        if (!agencyId) {
            alert("No se encontró una agencia asociada a este usuario.")
            return
        }

        try {
            setLoading(true)
            const { error } = await supabase
                .from('bets')
                .insert([
                    {
                        agency_id: agencyId,
                        lottery: betData.lottery,
                        number: betData.number,
                        location: betData.location,
                        amount: parseFloat(betData.amount),
                        possible_prize: parseFloat(betData.amount) * (betData.location === 'cabeza' ? 70 : 7), // Example logic
                        origin: 'whatsapp',
                        status: 'pending' // Or 'confirmed' if loaded by agency
                    }
                ])

            if (error) throw error

            // Reset form and close dialog
            setIsBetDialogOpen(false)
            setBetData({ lottery: '', number: '', amount: '', location: 'cabeza' })
            alert('Jugada cargada exitosamente!')
        } catch (error) {
            console.error('Error loading bet:', error)
            alert('Error al cargar la jugada')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="flex bg-black lg:rounded-3xl overflow-hidden border border-white/5 h-[calc(100vh-100px)] relative shadow-2xl">
                {/* Sidebar: Chat List (Left Column) */}
                <aside className="w-20 sm:w-24 md:w-80 flex flex-col border-r border-[#ff6600]/20 bg-[#1a1a1a]">
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between border-b border-[#ff6600]/10 bg-[#1a1a1a]/50 backdrop-blur-sm">
                        <h2 className="hidden md:block font-bold text-white text-lg">Chats</h2>
                        <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-[#ff6600]">
                            <span className="material-icons text-2xl">local_activity</span>
                        </button>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:block p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-9 bg-black/40 border-white/5 rounded-full text-sm h-9 focus-visible:ring-[#ff6600]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
                        {chats.map((chat) => (
                            <div key={chat.id} className={cn(
                                "flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-all relative group",
                                chat.id === 1 ? "bg-[#ff6600]/10 border-r-2 border-[#ff6600]" : "opacity-80 hover:opacity-100"
                            )}>
                                <div className="relative shrink-0">
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold border-2 border-[#1a1a1a]", chat.avatarColor)}>
                                        {chat.name.charAt(0)}
                                    </div>
                                    <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#1a1a1a]", chat.status === 'pending' ? "bg-green-500" : "bg-transparent")}></span>
                                </div>
                                <div className="hidden md:block flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={cn("text-sm font-bold truncate", chat.id === 1 ? "text-white" : "text-white/80")}>{chat.name}</h3>
                                        <span className="text-[10px] text-white/40">{chat.time}</span>
                                    </div>
                                    <p className={cn("text-xs truncate", chat.unread > 0 ? "text-white font-medium" : "text-white/40")}>{chat.lastMsg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content: Chat View */}
                <main className="flex-1 flex flex-col bg-black relative">
                    {/* Header */}
                    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#ff6600]/20">
                        <div className="flex items-center gap-3">
                            <button className="md:hidden text-[#ff6600]">
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="font-bold text-sm md:text-base text-white">Juan P.</h1>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600] animate-pulse"></span>
                                    <span className="text-[10px] text-[#ff6600] font-bold uppercase tracking-wider">Pendiente</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <PhoneCall className="h-4 w-4 text-white/80" />
                            </button>
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                <MoreVertical className="h-4 w-4 text-white/80" />
                            </button>
                        </div>
                    </header>

                    {/* Chat Bubbles Area */}
                    <section className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black">
                        <div className="flex flex-col items-center my-6">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/40 font-semibold tracking-wider">HOY</span>
                        </div>

                        {/* Customer Text Message */}
                        <div className="flex flex-col items-start max-w-[85%]">
                            <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl rounded-tl-sm shadow-md">
                                <p className="text-sm text-white/90">Hola, te paso la jugada para la nocturna:</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-lg font-bold text-[#ff6600]">10 al 528 - $500</p>
                                    <p className="text-lg font-bold text-[#ff6600]">05 al 812 - $300</p>
                                </div>
                                <span className="text-[10px] text-white/30 block mt-2 text-right">10:42 AM</span>
                            </div>
                        </div>

                        {/* Customer Audio Message */}
                        <div className="flex flex-col items-start max-w-[85%]">
                            <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl rounded-tl-sm w-full shadow-md flex items-center gap-3">
                                <button className="w-10 h-10 rounded-full bg-[#ff6600] flex items-center justify-center shrink-0 hover:bg-[#ff6600]/90 transition-colors">
                                    <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                                </button>
                                <div className="flex-1 space-y-1">
                                    <div className="h-6 flex items-end gap-0.5">
                                        {[30, 60, 40, 70, 50, 80, 40, 60, 30, 50].map((h, i) => (
                                            <div key={i} className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-[#ff6600]' : 'bg-[#ff6600]/40'}`} style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-[#ff6600]">0:12</span>
                                        <span className="text-[10px] text-white/30">10:43 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agency Response */}
                        <div className="flex flex-col items-end max-w-[85%] ml-auto">
                            <div className="bg-[#ff6600] p-3 rounded-2xl rounded-tr-sm shadow-lg shadow-[#ff6600]/20">
                                <p className="text-sm text-white font-medium">Recibido Juan, ahí te la cargo.</p>
                                <span className="text-[10px] text-white/60 block mt-1 text-right flex justify-end gap-1 items-center">
                                    10:45 AM <span className="text-white/80 font-bold tracking-tighter">✓✓</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Action Panel */}
                    <section className="p-4 bg-[#1a1a1a] border-t border-[#ff6600]/20 space-y-3 relative z-20">
                        {/* Quick Reply Row */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/5 rounded-full px-4 py-2 flex items-center border border-white/10 focus-within:border-[#ff6600]/50 transition-colors">
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-white placeholder:text-white/30"
                                    placeholder="Escribe una respuesta..."
                                    type="text"
                                />
                                <button className="text-white/40 hover:text-white/80">
                                    <span className="material-icons text-lg">emoji_emotions</span>
                                </button>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Mic className="h-5 w-5 text-white/60" />
                            </button>
                        </div>

                        {/* Primary Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                className="col-span-2 bg-[#ff6600] hover:bg-[#ff6600]/90 text-white font-extrabold py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all text-base uppercase tracking-wide"
                                onClick={() => setIsBetDialogOpen(true)}
                            >
                                <PlusCircle className="h-5 w-5" />
                                Confimar Jugada
                            </Button>
                            <Button className="bg-white/5 hover:bg-white/10 text-white/90 font-bold py-6 rounded-xl flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98] transition-all text-xs uppercase tracking-wide">
                                <span className="material-icons text-sm">reply</span>
                                Responder
                            </Button>
                            <Button className="bg-green-600/20 hover:bg-green-600/30 text-green-500 font-bold py-6 rounded-xl flex items-center justify-center gap-2 border border-green-600/30 active:scale-[0.98] transition-all text-xs uppercase tracking-wide">
                                <CheckCircle className="h-4 w-4" />
                                Procesado
                            </Button>
                        </div>
                    </section>
                </main>
            </div>

            {/* Background Pattern Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-[-1]" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #ff6600 1px, transparent 0)',
                backgroundSize: '24px 24px'
            }}></div>

            {/* Bet Dialog Overlay */}
            {isBetDialogOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
                        {/* Background Splashes */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6600]/20 rounded-full blur-[60px] pointer-events-none"></div>

                        <div className="bg-gradient-to-r from-[#ff6600] to-[#ff8c42] p-5 flex justify-between items-center relative z-10">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PlusCircle className="h-5 w-5 text-white/90" />
                                Nueva Jugada
                            </h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/10 hover:text-white rounded-full" onClick={() => setIsBetDialogOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-5 relative z-10">
                            {/* Form content (similar to before but styled) */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1.5 block">Lotería</label>
                                    <select
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all appearance-none text-sm font-medium"
                                        value={betData.lottery}
                                        onChange={(e) => setBetData({ ...betData, lottery: e.target.value })}
                                    >
                                        <option value="">Seleccionar Lotería...</option>
                                        <option value="nacional">🏛️ Nacional</option>
                                        <option value="provincia">🌲 Provincia</option>
                                        <option value="santafe">🌾 Santa Fe</option>
                                        <option value="cordoba">⛰️ Córdoba</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1.5 block">Número</label>
                                        <Input
                                            placeholder="00-99"
                                            className="bg-black/50 border-white/10 text-xl font-bold tracking-widest text-center focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] h-12 rounded-xl text-white"
                                            value={betData.number}
                                            maxLength={4}
                                            onChange={(e) => setBetData({ ...betData, number: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1.5 block">Ubicación</label>
                                        <select
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all h-12 appearance-none text-sm font-medium"
                                            value={betData.location}
                                            onChange={(e) => setBetData({ ...betData, location: e.target.value })}
                                        >
                                            <option value="cabeza">🥇 Cabeza</option>
                                            <option value="5">TOP 5</option>
                                            <option value="10">TOP 10</option>
                                            <option value="20">TOP 20</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 mb-1.5 block">Monto ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-[#ff6600] font-bold text-lg">$</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="pl-9 bg-black/50 border-white/10 text-xl font-bold focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] h-12 rounded-xl text-white"
                                            value={betData.amount}
                                            onChange={(e) => setBetData({ ...betData, amount: e.target.value })}
                                        />
                                    </div>
                                    {betData.amount && betData.location === 'cabeza' && (
                                        <p className="text-[10px] text-green-400 mt-2 text-right font-medium bg-green-900/10 px-2 py-1 rounded inline-block float-right border border-green-500/10">
                                            Premio estimado: ${(parseFloat(betData.amount) * 70).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 p-5 border-t border-white/5 bg-white/5 flex gap-3 relative z-10">
                            <Button variant="outline" className="flex-1 border-white/10 text-white/70 hover:bg-white/5 hover:text-white rounded-xl" onClick={() => setIsBetDialogOpen(false)}>Cancelar</Button>
                            <Button className="flex-[2] bg-[#ff6600] hover:bg-[#ff6600]/90 text-white shadow-lg shadow-orange-500/20 rounded-xl font-bold" onClick={handleLoadBet} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Confirmar Jugada'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
