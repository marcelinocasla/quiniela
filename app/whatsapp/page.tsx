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
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-20 md:pb-0 antialiased overflow-hidden flex flex-col md:flex-row">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar: Chat List */}
            <aside className="w-full md:w-96 flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl relative z-20 h-full">
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <h2 className="font-black text-xl text-white tracking-tight uppercase">Chats</h2>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-primary shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                        <span className="material-icons text-xl">forum</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-6 pb-2">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors duration-300" />
                        <input
                            placeholder="Buscar mensaje..."
                            className="w-full pl-11 pr-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold h-12 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-2">
                    {chats.map((chat) => (
                        <div key={chat.id} className={cn(
                            "flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all duration-300 relative group overflow-hidden border",
                            chat.id === 1
                                ? "bg-white/10 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                                : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                        )}>
                            {/* Active Indicator */}
                            {chat.id === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>}

                            <div className="relative shrink-0">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative overflow-hidden", chat.avatarColor)}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <span className="relative z-10">{chat.name.charAt(0)}</span>
                                </div>
                                {chat.status === 'pending' && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-black flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={cn("text-sm font-black tracking-tight truncate group-hover:text-white transition-colors", chat.id === 1 ? "text-white" : "text-white/70")}>{chat.name}</h3>
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{chat.time}</span>
                                </div>
                                <p className={cn("text-xs truncate font-medium", chat.unread > 0 ? "text-white/90" : "text-white/30")}>{chat.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Mobile spacer for bottom nav */}
                <div className="h-20 md:hidden"></div>
            </aside>

            {/* Main Content: Chat View */}
            <main className="hidden md:flex flex-1 flex-col bg-black/20 relative backdrop-blur-sm">
                {/* Header */}
                <header className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-xl border-b border-white/5 relative z-30">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-white/70 hover:text-primary transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="font-black text-lg text-white tracking-tight">Juan P.</h1>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(204,255,0,0.3)]">En Línea</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-center text-white/70 hover:text-white shadow-lg">
                            <PhoneCall className="h-4 w-4" />
                        </button>
                        <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-center text-white/70 hover:text-white shadow-lg">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                {/* Chat Bubbles Area */}
                <section className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar relative">
                    <div className="flex flex-col items-center my-6">
                        <span className="px-4 py-1.5 bg-black/40 border border-white/10 rounded-full text-[10px] text-white/40 font-bold uppercase tracking-widest backdrop-blur-md shadow-lg">Hoy</span>
                    </div>

                    {/* Customer Text Message */}
                    <div className="flex flex-col items-start max-w-[70%] group">
                        <div className="glass-card border border-white/5 p-6 rounded-[2rem] rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden transition-transform hover:scale-[1.01]">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <p className="text-sm text-white/90 font-medium leading-relaxed relative z-10">Hola, te paso la jugada para la nocturna:</p>
                            <div className="mt-4 space-y-2 pl-4 border-l-2 border-primary/50 relative z-10">
                                <p className="text-sm font-black text-primary tracking-wide">10 al 528 - $500</p>
                                <p className="text-sm font-black text-primary tracking-wide">05 al 812 - $300</p>
                            </div>
                            <span className="text-[9px] text-white/30 block mt-3 text-right font-bold uppercase tracking-wider relative z-10">10:42 AM</span>
                        </div>
                    </div>

                    {/* Customer Audio Message */}
                    <div className="flex flex-col items-start max-w-[70%] group">
                        <div className="glass-card border border-white/5 p-4 rounded-[2rem] rounded-tl-none w-72 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-4 relative overflow-hidden transition-transform hover:scale-[1.01]">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.4)] relative z-10 group/play">
                                <Play className="h-5 w-5 text-black fill-black ml-1 group-hover/play:scale-110 transition-transform" />
                            </button>
                            <div className="flex-1 space-y-2 relative z-10">
                                <div className="h-8 flex items-end gap-0.5 opacity-80">
                                    {[30, 60, 40, 70, 50, 80, 40, 60, 30, 50, 70, 45, 60, 80, 50].map((h, i) => (
                                        <div key={i} className={`w-1 rounded-full transition-all duration-300 ${i % 2 === 0 ? 'bg-primary' : 'bg-primary/30'} group-hover:h-full`} style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-primary">0:12</span>
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">10:43 AM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Agency Response */}
                    <div className="flex flex-col items-end max-w-[70%] ml-auto group">
                        <div className="bg-primary/[0.15] p-6 rounded-[2rem] rounded-tr-none border border-primary/20 backdrop-blur-md shadow-[0_0_30px_rgba(204,255,0,0.05)] relative overflow-hidden transition-transform hover:scale-[1.01]">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <p className="text-sm text-white font-medium relative z-10">Recibido Juan, ahí te la cargo.</p>
                            <span className="text-[9px] text-primary block mt-3 text-right flex justify-end gap-1.5 items-center font-bold relative z-10">
                                10:45 AM <span className="text-primary font-black tracking-tighter text-xs">✓✓</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Action Panel */}
                <section className="p-6 bg-black/60 backdrop-blur-xl border-t border-white/5 space-y-4 relative z-30">
                    {/* Quick Reply Row */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white/5 rounded-2xl px-5 py-3 flex items-center border border-white/10 focus-within:border-primary/50 transition-all focus-within:bg-black/40 focus-within:shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm w-full text-white placeholder:text-white/30 font-medium outline-none"
                                placeholder="Escribe una respuesta..."
                                type="text"
                            />
                            <button className="text-white/40 hover:text-white transition-colors p-1">
                                <span className="material-icons text-xl">emoji_emotions</span>
                            </button>
                        </div>
                        <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all group shadow-lg">
                            <Mic className="h-6 w-6 text-white/60 group-hover:text-primary transition-colors duration-300" />
                        </button>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="col-span-2 bg-primary hover:bg-[#d4ff00] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] active:scale-[0.98] transition-all text-xs uppercase tracking-widest group"
                            onClick={() => setIsBetDialogOpen(true)}
                        >
                            <PlusCircle className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                            Confirmar Jugada
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-[10px] uppercase tracking-wider group">
                            <span className="material-icons text-sm text-white/60 group-hover:text-white transition-colors">reply</span>
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
                    <div className="glass-card border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                        {/* Modal Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center bg-white/5 border-b border-white/5 p-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
                                    Nueva Jugada
                                </h3>
                                <p className="text-[10px] uppercase text-primary tracking-[0.2em] font-bold mt-1">Ingresar Datos</p>
                            </div>
                            <button onClick={() => setIsBetDialogOpen(false)} className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/5 hover:border-white/10">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Lotería</label>
                                <div className="relative group">
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none text-sm font-bold cursor-pointer group-hover:border-white/20"
                                        value={betData.lottery}
                                        onChange={(e) => setBetData({ ...betData, lottery: e.target.value })}
                                        style={{ backgroundImage: 'none' }}
                                    >
                                        <option value="" className="bg-black text-white/50">Seleccionar Lotería...</option>
                                        <option value="nacional" className="bg-zinc-900">🏛️ Nacional</option>
                                        <option value="provincia" className="bg-zinc-900">🌲 Provincia</option>
                                        <option value="santafe" className="bg-zinc-900">🌾 Santa Fe</option>
                                        <option value="cordoba" className="bg-zinc-900">⛰️ Córdoba</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white transition-colors">
                                        <span className="material-icons text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Número</label>
                                    <input
                                        placeholder="00-99"
                                        className="w-full bg-black/40 border border-white/10 text-2xl font-black tracking-widest text-center focus:border-primary/50 focus:ring-1 focus:ring-primary/50 h-16 rounded-2xl text-white outline-none transition-all placeholder:text-white/10 shadow-inner"
                                        value={betData.number}
                                        maxLength={4}
                                        onChange={(e) => setBetData({ ...betData, number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Ubicación</label>
                                    <div className="relative group">
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all h-16 appearance-none text-sm font-bold cursor-pointer group-hover:border-white/20"
                                            value={betData.location}
                                            onChange={(e) => setBetData({ ...betData, location: e.target.value })}
                                        >
                                            <option value="cabeza" className="bg-zinc-900">🥇 Cabeza</option>
                                            <option value="5" className="bg-zinc-900">TOP 5</option>
                                            <option value="10" className="bg-zinc-900">TOP 10</option>
                                            <option value="20" className="bg-zinc-900">TOP 20</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-hover:text-white transition-colors">
                                            <span className="material-icons text-sm">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Monto ($)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-10 bg-black/40 border border-white/10 text-2xl font-black focus:border-primary/50 focus:ring-1 focus:ring-primary/50 h-16 rounded-2xl text-white outline-none transition-all placeholder:text-white/10 shadow-inner"
                                        value={betData.amount}
                                        onChange={(e) => setBetData({ ...betData, amount: e.target.value })}
                                    />
                                </div>
                                {betData.amount && betData.location === 'cabeza' && (
                                    <div className="flex justify-end animate-in slide-in-from-top-2 pt-2">
                                        <p className="text-[10px] text-primary font-bold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 inline-flex items-center gap-1 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                                            <span className="material-icons text-[10px]">paid</span>
                                            Premio est: ${(parseFloat(betData.amount) * 70).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-8 border-t border-white/5 bg-white/5 relative z-10">
                            <button onClick={() => setIsBetDialogOpen(false)} className="px-6 py-4 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 uppercase tracking-wider">
                                Cancelar
                            </button>
                            <button onClick={handleLoadBet} disabled={loading} className="px-8 py-4 rounded-xl bg-primary hover:bg-[#d4ff00] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all active:scale-95 flex items-center gap-2">
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
