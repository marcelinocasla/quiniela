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
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="px-6 pt-8 pb-24 relative z-10">
                {/* Header */}
                <header className="mb-10 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase italic">Panel de <br /><span className="text-primary not-italic">Control</span></h1>
                        {loading ? (
                            <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-[10px] text-white/50 font-black tracking-[0.2em] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_5px_#CCFF00]"></span>
                                {agency ? agency.name.toUpperCase() : 'AGENCIA S/C'}
                            </p>
                        )}
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white/20" />
                    </div>
                </header>

                {/* Segmented Control */}
                <div className="mb-10">
                    <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-[1.2rem] flex items-center border border-white/10 shadow-inner max-w-sm mx-auto">
                        <button
                            onClick={() => setActiveTab('reportes')}
                            className={`flex-1 py-3 text-[10px] uppercase font-black tracking-widest rounded-2xl transition-all duration-300 ${activeTab === 'reportes' ? 'bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            Reportes
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`flex-1 py-3 text-[10px] uppercase font-black tracking-widest rounded-2xl transition-all duration-300 ${activeTab === 'config' ? 'bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            Configuración
                        </button>
                    </div>
                </div>

                {/* CONTENT: REPORTES */}
                {activeTab === 'reportes' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Net Balance Card */}
                        <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/10 hover:border-primary/20 transition-colors duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-500 pointer-events-none -translate-y-1/2 translate-x-1/2 animate-pulse"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-lg">Balance Neto</span>
                                <div className="p-3 bg-white/5 rounded-2xl text-primary border border-white/5 shadow-lg shadow-black/20">
                                    <Wallet className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-white/40 text-3xl font-bold">$</span>
                                <span className="text-white text-6xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">1.2M</span>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-primary text-[10px] font-black bg-primary/10 w-fit px-4 py-2 rounded-xl border border-primary/20 relative z-10 shadow-[0_0_10px_rgba(204,255,0,0.1)]">
                                <span className="material-icons text-[16px]">trending_up</span>
                                <span>+12.5% vs mes anterior</span>
                            </div>
                        </div>

                        {/* Simple Report Placeholder */}
                        <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-black/60 to-transparent"></div>
                            <h3 className="text-white font-black uppercase tracking-tight mb-6 relative z-10">Resumen Semanal</h3>
                            <div className="h-40 flex items-end justify-between gap-3 relative z-10">
                                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end gap-3 group cursor-pointer">
                                        <div className="w-full bg-white/5 rounded-t-xl relative h-full overflow-hidden transition-all duration-300 hover:bg-white/10 border-x border-t border-white/5">
                                            <div className="absolute bottom-0 w-full bg-primary rounded-t-xl group-hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all duration-500 ease-out" style={{ height: `${h}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-center font-black text-white/30 uppercase group-hover:text-primary transition-colors">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: CONFIGURACION */}
                {activeTab === 'config' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Section: Agencia */}
                        <section>
                            <label className="text-[10px] font-black text-primary uppercase px-4 mb-4 block tracking-[0.2em] flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-primary/50"></span> Agencia
                            </label>
                            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                <button className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors group border-b border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(204,255,0,0.2)] border border-primary/20">
                                            <Shield className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">Datos de la Agencia</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                                {loading ? "Cargando..." : (agency ? agency.name.toUpperCase() : "SIN CONFIGURAR")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all relative z-10">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] border border-green-500/20">
                                            <span className="material-icons text-2xl">whatsapp</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white group-hover:text-green-500 transition-colors uppercase tracking-tight">WhatsApp</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {agency && agency.whatsapp_number ? (
                                                    <>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                                                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Conectado</p>
                                                    </>
                                                ) : (
                                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">No Conectado</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-all relative z-10">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Section: Administración */}
                        <section>
                            <label className="text-[10px] font-black text-primary uppercase px-4 mb-4 block tracking-[0.2em] flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-primary/50"></span> Administración
                            </label>
                            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                <button className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors group border-b border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-blue-500/20">
                                            <Users className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">Gestión de Usuarios</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Control de empleados</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-black transition-all relative z-10">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors group border-b border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-purple-500/20">
                                            <Printer className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white group-hover:text-purple-500 transition-colors uppercase tracking-tight">Impresión</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Tickets y Térmicas</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-black transition-all relative z-10">
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                </button>
                                <div className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] border border-yellow-500/20">
                                            <Bell className="h-7 w-7" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Notificaciones</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Alertas Push</p>
                                        </div>
                                    </div>
                                    <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(204,255,0,0.3)] transition-all duration-300 relative z-10">
                                        <div className="absolute right-1 top-1 w-6 h-6 bg-black rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Footer Config */}
                        <div className="pt-8 text-center">
                            <button onClick={handleSignOut} className="text-red-500 font-black text-xs flex items-center gap-2 mx-auto hover:bg-red-500/10 px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 uppercase tracking-widest border border-red-500/20 hover:border-red-500/40 shadow-lg shadow-black/30">
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </button>
                            <p className="mt-8 text-[9px] text-white/10 uppercase tracking-[0.4em] font-black">Quiniela Digital v3.0</p>
                        </div>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
