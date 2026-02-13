"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { supabase } from "@/lib/supabase"
import { Loader2, TrendingUp, Users, DollarSign, Trophy, Settings, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
                            borderColor: 'rgb(255, 102, 0)',
                            backgroundColor: 'rgba(255, 102, 0, 0.1)',
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
        <DashboardLayout>
            <div className="flex flex-col gap-8 pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
                        <p className="text-neutral-400">Resumen general de rendimiento y gestión.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-neutral-800 text-neutral-300 hover:bg-neutral-800">
                            <Settings className="mr-2 h-4 w-4" /> Configuración
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Agencia
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500 h-10 w-10" /></div>
                ) : (
                    <>
                        {/* KPIs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-xl hover:bg-neutral-900/80 transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-neutral-400">Ventas Totales (Hoy)</CardTitle>
                                    <DollarSign className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">${stats.totalSales.toLocaleString()}</div>
                                    <p className="text-xs text-green-500 flex items-center mt-1">
                                        <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% vs ayer
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-xl hover:bg-neutral-900/80 transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-neutral-400">Ganancia Neta (Est.)</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">${stats.netProfit.toLocaleString()}</div>
                                    <p className="text-xs text-neutral-500 mt-1">Calculado post-premios</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-xl hover:bg-neutral-900/80 transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-neutral-400">Agencias Activas</CardTitle>
                                    <Users className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.activeAgencies}</div>
                                    <p className="text-xs text-neutral-500 mt-1">De un total de {stats.activeAgencies}</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-xl hover:bg-neutral-900/80 transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-neutral-400">Premios a Pagar</CardTitle>
                                    <Trophy className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">${stats.pendingPayouts.toLocaleString()}</div>
                                    <p className="text-xs text-neutral-500 mt-1">Pendientes de liquidación</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart & Agency List */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Sales Trend Chart */}
                            <Card className="lg:col-span-2 bg-neutral-900 border-neutral-800">
                                <CardHeader>
                                    <CardTitle>Tendencia de Ventas</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-0">
                                    {salesData && <Line options={chartOptions} data={salesData} className="max-h-[300px] w-full" />}
                                </CardContent>
                            </Card>

                            {/* Top Agencies List */}
                            <Card className="bg-neutral-900 border-neutral-800">
                                <CardHeader>
                                    <CardTitle>Agencias</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {agencies.length === 0 ? (
                                            <p className="text-neutral-500 text-sm">No hay agencias registradas.</p>
                                        ) : (
                                            agencies.slice(0, 5).map((agency, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0">
                                                            {agency.email?.[0].toUpperCase() || 'A'}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-medium text-white truncate">{agency.email}</p>
                                                            <div className="flex items-center gap-1">
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                                <span className="text-xs text-neutral-400">Activo</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <Button variant="link" className="w-full text-orange-500 mt-2 text-xs">
                                        Ver todas las agencias
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
