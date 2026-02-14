"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"
import { ChevronRight, LogOut, Shield, Users, Printer, Bell, Wallet } from "lucide-react"

export default function SettingsPage() {
    const { user, signOut } = useAuth()
    const [activeTab, setActiveTab] = useState<'reportes' | 'config'>('config')
    const [agency, setAgency] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAgency = async () => {
            if (!user) return
            try {
                const { data, error } = await supabase
                    .from('agencies')
                    .select('*')
                    .eq('owner_id', user.uid)
                    .single()

                if (data) {
                    setAgency(data)
                }
            } catch (err) {
                console.error("Error fetching agency:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchAgency()
    }, [user])

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="px-6 pt-8 pb-24 relative z-10">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">Panel de<br /><span className="text-primary">Control</span></h1>
                    {loading ? (
                        <div className="h-4 w-48 bg-white/5 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-xs text-white/50 font-bold tracking-widest uppercase">
                            {agency ? `Agencia: ${agency.name}` : 'Agencia No Configurada'}
                        </p>
                    )}
                </header>

                {/* Segmented Control */}
                <div className="mb-8">
                    <div className="bg-black/20 backdrop-blur-md p-1 rounded-2xl flex items-center border border-white/5">
                        <button
                            onClick={() => setActiveTab('reportes')}
                            className={`flex-1 py-3 text-[10px] uppercase font-bold rounded-xl transition-all duration-300 ${activeTab === 'reportes' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(57,255,20,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            Reportes
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`flex-1 py-3 text-[10px] uppercase font-bold rounded-xl transition-all duration-300 ${activeTab === 'config' ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(57,255,20,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            Configuración
                        </button>
                    </div>
                </div>

                {/* CONTENT: REPORTES */}
                {activeTab === 'reportes' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Net Balance Card */}
                        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Balance Neto (Mes)</span>
                                <div className="p-2 bg-white/5 rounded-lg text-primary">
                                    <Wallet className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-white/60 text-2xl font-bold">$</span>
                                <span className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">1.2M</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-primary text-[10px] font-bold bg-primary/10 w-fit px-3 py-1.5 rounded-full border border-primary/20 relative z-10">
                                <span className="material-icons text-[14px]">trending_up</span>
                                <span>+12.5% vs mes anterior</span>
                            </div>
                        </div>

                        {/* Simple Report Placeholder */}
                        <div className="glass-card p-6 rounded-3xl border border-white/5">
                            <h3 className="text-white font-bold mb-4">Resumen Semanal</h3>
                            <div className="h-40 flex items-end justify-between gap-2">
                                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end gap-2 group cursor-pointer">
                                        <div className="w-full bg-white/5 rounded-t-lg relative h-full overflow-visible transition-all duration-300 hover:bg-white/10">
                                            <div className="absolute bottom-0 w-full bg-primary rounded-t-lg group-hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] transition-all duration-300" style={{ height: `${h}%` }}></div>
                                        </div>
                                        <span className="text-[9px] text-center font-bold text-white/30 uppercase">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: CONFIGURACION */}
                {activeTab === 'config' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section: Agencia */}
                        <section>
                            <label className="text-[10px] font-bold text-primary/80 uppercase px-4 mb-3 block tracking-widest">Agencia</label>
                            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
                                <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(57,255,20,0.1)]">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Datos de la Agencia</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">
                                                {loading ? "Cargando..." : (agency ? agency.name.toUpperCase() : "SIN CONFIGURAR")}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-300">
                                            <span className="material-icons text-2xl">whatsapp</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">WhatsApp</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {agency && agency.whatsapp_number ? (
                                                    <>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Conectado</p>
                                                    </>
                                                ) : (
                                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">No Conectado</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-green-500 transition-colors" />
                                </button>
                            </div>
                        </section>

                        {/* Section: Administración */}
                        <section>
                            <label className="text-[10px] font-bold text-primary/80 uppercase px-4 mb-3 block tracking-widest">Administración</label>
                            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
                                <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Gestión de Usuarios</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Control de empleados</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-blue-500 transition-colors" />
                                </button>
                                <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300">
                                            <Printer className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Impresión</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Tickets y Térmicas</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-purple-500 transition-colors" />
                                </button>
                                <div className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                            <Bell className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white">Notificaciones</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Alertas Push</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-7 bg-primary rounded-full relative cursor-pointer shadow-inner transition-colors duration-300">
                                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer Config */}
                        <div className="pt-4 text-center">
                            <button onClick={handleSignOut} className="text-destructive font-bold text-xs flex items-center gap-2 mx-auto hover:bg-destructive/10 px-6 py-3 rounded-2xl transition-all duration-300 active:scale-95 uppercase tracking-wider border border-transparent hover:border-destructive/20">
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </button>
                            <p className="mt-8 text-[9px] text-white/10 uppercase tracking-[0.3em] font-black">Quiniela Digital v3.0</p>
                        </div>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
