"use client"

import { useState, useEffect } from "react"
import { Search, Mic, PlusCircle, CheckCircle, X, Phone, MoreVertical, Play, ChevronLeft, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import BottomNav from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function WhatsAppPage() {
    const { profile } = useAuth()
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
        { id: 1, name: "Juan P.", lastMsg: "Audio (0:12)", time: "10:43 AM", status: "pending", unread: 2, avatarColor: "bg-primary" },
        { id: 2, name: "Maria G.", lastMsg: "Quiero el 45 a la cabeza...", time: "10:15 AM", status: "pending", unread: 1, avatarColor: "bg-green-500" },
        { id: 3, name: "Ricardo L.", lastMsg: "Listo gracias!", time: "09:45 AM", status: "processed", unread: 0, avatarColor: "bg-primary/20" },
        { id: 4, name: "Carlos M.", lastMsg: "¿Cuánto paga la cabeza?", time: "Ayer", status: "processed", unread: 0, avatarColor: "bg-white/20" },
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
                        possible_prize: parseFloat(betData.amount) * (betData.location === 'cabeza' ? 70 : 7),
                        origin: 'whatsapp',
                        status: 'pending'
                    }
                ])

            if (error) throw error

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
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-20 antialiased overflow-hidden flex flex-col md:flex-row">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar: Chat List */}
            <aside className="w-full md:w-80 flex flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl relative z-20 h-full">
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <h2 className="font-black text-xl text-white tracking-tight uppercase">Chats</h2>
                    <div className="p-2 rounded-full bg-white/5 text-primary">
                        <span className="material-icons text-xl">local_activity</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Buscar mensaje..."
                            className="w-full pl-10 pr-4 bg-black/20 border border-white/10 rounded-xl text-sm h-10 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {chats.map((chat) => (
                        <div key={chat.id} className={cn(
                            "flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-all relative border-b border-white/[0.02]",
                            chat.id === 1 ? "bg-primary/5 border-l-2 border-l-primary" : "opacity-70 hover:opacity-100"
                        )}>
                            <div className="relative shrink-0">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)]", chat.avatarColor)}>
                                    {chat.name.charAt(0)}
                                </div>
                                {chat.status === 'pending' && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary ring-2 ring-black animate-pulse"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={cn("text-sm font-bold truncate", chat.id === 1 ? "text-white" : "text-white/80")}>{chat.name}</h3>
                                    <span className="text-[10px] text-white/40 font-bold">{chat.time}</span>
                                </div>
                                <p className={cn("text-xs truncate font-medium", chat.unread > 0 ? "text-white" : "text-white/30")}>{chat.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Mobile spacer for bottom nav */}
                <div className="h-20 md:hidden"></div>
            </aside>

            {/* Main Content: Chat View (Hidden on mobile list view, ideally distinct routes or conditional rendering for mobile) */}
            {/* For this refactor, we keep it visible as part of the layout, assuming desktop or single page app flow */}
            <main className="hidden md:flex flex-1 flex-col bg-black/20 relative backdrop-blur-sm">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-background/60 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-white/70 hover:text-primary">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="font-bold text-lg text-white tracking-tight">Juan P.</h1>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">En Línea</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                            <PhoneCall className="h-4 w-4" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                {/* Chat Bubbles Area */}
                <section className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar relative">
                    <div className="flex flex-col items-center my-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] text-white/40 font-bold uppercase tracking-widest backdrop-blur-sm">Hoy</span>
                    </div>

                    {/* Customer Text Message */}
                    <div className="flex flex-col items-start max-w-[70%]">
                        <div className="glass-card border border-white/5 p-4 rounded-3xl rounded-tl-none shadow-lg shadow-black/20">
                            <p className="text-sm text-white/90 font-medium">Hola, te paso la jugada para la nocturna:</p>
                            <div className="mt-3 space-y-2 pl-3 border-l-2 border-primary/50">
                                <p className="text-sm font-bold text-primary">10 al 528 - $500</p>
                                <p className="text-sm font-bold text-primary">05 al 812 - $300</p>
                            </div>
                            <span className="text-[9px] text-white/30 block mt-2 text-right font-bold">10:42 AM</span>
                        </div>
                    </div>

                    {/* Customer Audio Message */}
                    <div className="flex flex-col items-start max-w-[70%]">
                        <div className="glass-card border border-white/5 p-3 rounded-3xl rounded-tl-none w-64 shadow-lg shadow-black/20 flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                                <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                            </button>
                            <div className="flex-1 space-y-1.5">
                                <div className="h-6 flex items-end gap-0.5 opacity-80">
                                    {[30, 60, 40, 70, 50, 80, 40, 60, 30, 50].map((h, i) => (
                                        <div key={i} className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-primary/40'}`} style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-bold text-primary">0:12</span>
                                    <span className="text-[9px] text-white/30 font-bold">10:43 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Agency Response */}
                    <div className="flex flex-col items-end max-w-[70%] ml-auto">
                        <div className="bg-primary/20 p-4 rounded-3xl rounded-tr-none border border-primary/20 backdrop-blur-md shadow-[0_0_20px_rgba(57,255,20,0.05)]">
                            <p className="text-sm text-white font-medium">Recibido Juan, ahí te la cargo.</p>
                            <span className="text-[9px] text-primary block mt-2 text-right flex justify-end gap-1 items-center font-bold">
                                10:45 AM <span className="text-primary font-bold tracking-tighter">✓✓</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Action Panel */}
                <section className="p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 space-y-4 relative z-20">
                    {/* Quick Reply Row */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-black/20 rounded-2xl px-4 py-2 flex items-center border border-white/10 focus-within:border-primary/50 transition-all focus-within:bg-black/40">
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-full p-2 text-white placeholder:text-white/30 font-medium outline-none"
                                placeholder="Escribe una respuesta..."
                                type="text"
                            />
                            <button className="text-white/40 hover:text-white transition-colors">
                                <span className="material-icons text-xl">emoji_emotions</span>
                            </button>
                        </div>
                        <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all group">
                            <Mic className="h-5 w-5 text-white/60 group-hover:text-primary transition-colors" />
                        </button>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className="col-span-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-[0.98] transition-all text-xs uppercase tracking-widest"
                            onClick={() => setIsBetDialogOpen(true)}
                        >
                            <PlusCircle className="h-5 w-5" />
                            Confirmar Jugada
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-[10px] uppercase tracking-wider">
                            <span className="material-icons text-sm">reply</span>
                            Responder
                        </button>
                        <button className="bg-green-500/10 hover:bg-green-500/20 text-green-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-green-500/20 hover:border-green-500/30 active:scale-[0.98] transition-all text-[10px] uppercase tracking-wider">
                            <CheckCircle className="h-4 w-4" />
                            Procesado
                        </button>
                    </div>
                </section>
            </main>

            <BottomNav />

            {/* Bet Dialog Overlay */}
            {isBetDialogOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="glass-card border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                        {/* Modal Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center bg-white/5 border-b border-white/5 p-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Nueva Jugada
                                </h3>
                                <p className="text-[10px] uppercase text-primary tracking-widest font-bold mt-1">Ingresar Datos</p>
                            </div>
                            <button onClick={() => setIsBetDialogOpen(false)} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Lotería</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none text-sm font-bold cursor-pointer"
                                        value={betData.lottery}
                                        onChange={(e) => setBetData({ ...betData, lottery: e.target.value })}
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="" className="bg-black">Seleccionar Lotería...</option>
                                        <option value="nacional" className="bg-black">🏛️ Nacional</option>
                                        <option value="provincia" className="bg-black">🌲 Provincia</option>
                                        <option value="santafe" className="bg-black">🌾 Santa Fe</option>
                                        <option value="cordoba" className="bg-black">⛰️ Córdoba</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                        <span className="material-icons text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Número</label>
                                    <input
                                        placeholder="00-99"
                                        className="w-full bg-black/40 border border-white/10 text-2xl font-black tracking-widest text-center focus:border-primary/50 focus:ring-1 focus:ring-primary/50 h-14 rounded-xl text-white outline-none transition-all placeholder:text-white/10"
                                        value={betData.number}
                                        maxLength={4}
                                        onChange={(e) => setBetData({ ...betData, number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Ubicación</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all h-14 appearance-none text-sm font-bold cursor-pointer"
                                            value={betData.location}
                                            onChange={(e) => setBetData({ ...betData, location: e.target.value })}
                                        >
                                            <option value="cabeza" className="bg-black">🥇 Cabeza</option>
                                            <option value="5" className="bg-black">TOP 5</option>
                                            <option value="10" className="bg-black">TOP 10</option>
                                            <option value="20" className="bg-black">TOP 20</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                            <span className="material-icons text-sm">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Monto ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-lg">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-9 bg-black/40 border border-white/10 text-xl font-bold focus:border-primary/50 focus:ring-1 focus:ring-primary/50 h-14 rounded-xl text-white outline-none transition-all placeholder:text-white/10"
                                        value={betData.amount}
                                        onChange={(e) => setBetData({ ...betData, amount: e.target.value })}
                                    />
                                </div>
                                {betData.amount && betData.location === 'cabeza' && (
                                    <div className="flex justify-end animate-in slide-in-from-top-1">
                                        <p className="text-[10px] text-green-400 font-bold bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 inline-flex items-center gap-1 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                            <span className="material-icons text-[10px]">paid</span>
                                            Premio est: ${(parseFloat(betData.amount) * 70).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-white/5 bg-white/5 relative z-10">
                            <button onClick={() => setIsBetDialogOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                Cancelar
                            </button>
                            <button onClick={handleLoadBet} disabled={loading} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all active:scale-95 flex items-center gap-2">
                                {loading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                                ) : (
                                    <><CheckCircle className="h-4 w-4" /> Confirmar</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
