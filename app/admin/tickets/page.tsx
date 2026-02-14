"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ChevronLeft, Search, Filter, ChevronRight, AlertTriangle } from "lucide-react"

// Types
type Bet = {
    id: string
    created_at: string
    lottery: string
    number: string
    location?: string // schema says location
    position?: number // code used position
    amount: number
    status: 'pending' | 'won' | 'lost' | 'cancelled'
    user_id?: string
    profile_id?: string
}

export default function AdminTicketsPage() {
    const [bets, setBets] = useState<Bet[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>('all')

    useEffect(() => {
        fetchBets()
    }, [])

    const fetchBets = async () => {
        try {
            const { data, error } = await supabase
                .from('bets')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setBets(data || [])
        } catch (error) {
            console.error("Error fetching bets:", error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'won': return 'text-[#CCFF00] bg-[#CCFF00]/10 border-[#CCFF00]/20'
            case 'pending': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'lost': return 'text-white/40 bg-white/5 border-white/10'
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20'
            default: return 'text-white/40'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'won': return 'GANADOR'
            case 'pending': return 'PENDIENTE'
            case 'lost': return 'PERDEDOR'
            case 'cancelled': return 'ANULADO'
            default: return status
        }
    }

    const filteredBets = bets.filter(bet => {
        const matchesSearch = bet.number.includes(searchTerm) || bet.id.includes(searchTerm)
        const matchesStatus = filterStatus === 'all' || bet.status === filterStatus
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-4">
                <Link href="/admin" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-lg font-bold">Gestión de Tickets</h1>
            </header>

            <main className="px-4 py-6 space-y-6 max-w-xl mx-auto">

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Buscar por número o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setFilterStatus(filterStatus === 'all' ? 'pending' : 'all')}
                        className={`px-4 rounded-xl border flex items-center justify-center transition-all ${filterStatus !== 'all' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60'}`}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-white/40 animate-pulse">Cargando tickets...</div>
                    ) : filteredBets.length === 0 ? (
                        <div className="text-center py-10 text-white/40">No se encontraron tickets</div>
                    ) : (
                        filteredBets.map(bet => (
                            <Link key={bet.id} href={`/admin/tickets/${bet.id}`}>
                                <div className="group glass-card p-4 rounded-2xl border border-white/5 hover:border-primary/30 transition-all active:scale-[0.98] relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getStatusColor(bet.status)}`}>
                                                {getStatusLabel(bet.status)}
                                            </span>
                                            <span className="text-[10px] text-white/40">
                                                {new Date(bet.created_at).toLocaleDateString()} {new Date(bet.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-3xl font-black text-white tracking-tighter mb-1">
                                                {bet.number}
                                            </div>
                                            <div className="text-xs text-white/60 font-medium">
                                                {bet.lottery}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-primary">
                                                ${bet.amount}
                                            </div>
                                            <div className="text-[10px] text-white/40 uppercase">
                                                {bet.location || `A los ${bet.position}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
