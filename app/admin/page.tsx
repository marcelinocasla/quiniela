"use client"

import { useState, useEffect } from "react"
import BottomNav from "@/components/BottomNav"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Loader2, TrendingUp, Users, DollarSign, Trophy, Settings, Plus, ArrowUpRight, ArrowDownRight, Dices, Settings2, ChevronRight, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalSales: 0,
        netProfit: 0,
        activeAgencies: 0,
        pendingPayouts: 0
    })
    const [agencies, setAgencies] = useState<any[]>([])
    const [salesData, setSalesData] = useState<any>(null)

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // 1. Fetch Agencies
                const { data: agenciesData } = await supabase
                    .from('users')
                    .select('*')
                // Assuming 'role' column exists or we filter differently. For now fetching all users as agencies mock.
                // In real app: .eq('role', 'agency')

                setAgencies(agenciesData || [])
                const activeCount = agenciesData ? agenciesData.length : 0 // refine logic based on 'status' column if exists

                // 2. Fetch Bets for KPIs
                // Get today's bets
                const today = new Date().toISOString().split('T')[0]
                const { data: todayBets } = await supabase
                    .from('bets')
                    .select('amount, possible_prize, status, created_at')
                    .gte('created_at', `${today}T00:00:00`)
                    .lte('created_at', `${today}T23:59:59`)

                let totalSales = 0
                let pendingPayouts = 0

                if (todayBets) {
                    totalSales = todayBets.reduce((acc, bet) => acc + bet.amount, 0)
                    pendingPayouts = todayBets
                        .filter(b => b.status === 'won')
                        .reduce((acc, bet) => acc + bet.possible_prize, 0)
                }

                // Mock Profit Calculation (e.g. 20% of sales - payouts, or just sales - payouts)
                // Profit = Sales - Payouts (Simplified)
                const netProfit = totalSales - pendingPayouts

                setStats({
                    totalSales,
                    netProfit,
                    activeAgencies: activeCount,
                    pendingPayouts
                })

                // 3. Prepare Chart Data (Mocking last 7 days trend)
                const labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
                const dataPoints = [12000, 19000, 3000, 5000, 2000, 3000, totalSales] // Last point is today

                setSalesData({
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Ventas',
                            data: dataPoints,
                            borderColor: '#39FF14',
                            backgroundColor: 'rgba(57, 255, 20, 0.1)',
                            tension: 0.4,
                        },
                    ],
                })

                setLoading(false)
            } catch (error) {
                console.error("Error fetching admin data:", error)
                setLoading(false)
            }
        }

        fetchAdminData()
    }, [])

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#666',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#666',
                }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="px-6 py-8 flex flex-col gap-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Panel de Control</h1>
                        <p className="text-white/40 text-sm font-medium">Resumen general de rendimiento y gestión.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase border border-white/5">
                            <Settings className="h-4 w-4" /> Configuración
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center gap-2 text-xs font-bold uppercase shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]">
                            <Plus className="h-4 w-4" /> Agregar Agencia
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
                ) : (
                    <>
                        {/* KPIs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Ventas Hoy</span>
                                        <DollarSign className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-3xl font-black text-white tracking-tight">${stats.totalSales.toLocaleString()}</div>
                                    <p className="text-[10px] text-primary font-bold flex items-center mt-2 bg-primary/10 w-fit px-2 py-1 rounded-lg">
                                        <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% vs ayer
                                    </p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Ganancia Neta</span>
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div className="text-3xl font-black text-white tracking-tight">${stats.netProfit.toLocaleString()}</div>
                                    <p className="text-[10px] text-white/40 font-bold mt-2">Calculado post-premios</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Agencias</span>
                                        <Users className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="text-3xl font-black text-white tracking-tight">{stats.activeAgencies}</div>
                                    <p className="text-[10px] text-white/40 font-bold mt-2">De un total de {stats.activeAgencies}</p>
                                </div>
                            </div>

                            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Premios Ptes.</span>
                                        <Trophy className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div className="text-3xl font-black text-white tracking-tight">${stats.pendingPayouts.toLocaleString()}</div>
                                    <p className="text-[10px] text-white/40 font-bold mt-2">Pendientes de liquidación</p>
                                </div>
                            </div>

                            {/* Navigation Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Link href="/admin/results" className="glass-card p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden flex items-center justify-between">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-all"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Dices className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Cargar Resultados</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Gestión de Sorteos</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors relative z-10" />
                                </Link>

                                <Link href="/admin/tickets" className="glass-card p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden flex items-center justify-between">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-all"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Ticket className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Gestionar Tickets</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Control y Anulación</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-blue-400 transition-colors relative z-10" />
                                </Link>

                                <Link href="/admin/config" className="glass-card p-6 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group relative overflow-hidden flex items-center justify-between">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-all"></div>
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                            <Settings2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Configuración Global</h3>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Horarios y Límites</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-purple-400 transition-colors relative z-10" />
                                </Link>
                            </div>
                        </div>

                        {/* Chart & Agency List */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sales Trend Chart */}
                            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white">Tendencia de Ventas</h3>
                                </div>
                                <div className="pl-0">
                                    {salesData && <Line options={chartOptions} data={salesData} className="max-h-[300px] w-full" />}
                                </div>
                            </div>

                            {/* Top Agencies List */}
                            <div className="glass-card p-6 rounded-3xl border border-white/5">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white">Agencias</h3>
                                </div>
                                <div className="space-y-4">
                                    {agencies.length === 0 ? (
                                        <p className="text-white/40 text-sm font-medium">No hay agencias registradas.</p>
                                    ) : (
                                        agencies.slice(0, 5).map((agency, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                                                        {agency.email?.[0].toUpperCase() || 'A'}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold text-white truncate">{agency.email}</p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                            <span className="text-[10px] text-white/60 font-bold uppercase">Activo</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button className="w-full text-primary hover:text-primary/80 mt-4 text-xs font-bold uppercase tracking-widest transition-colors">
                                    Ver todas las agencias
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
