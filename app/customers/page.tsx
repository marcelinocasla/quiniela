"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, X, Save, Phone, User, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import BottomNav from "@/components/BottomNav"

// Types
interface Customer {
    id: string
    full_name: string
    phone_number: string
    balance: number
    notes: string | null
}

export default function CustomersPage() {
    const { profile } = useAuth()
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [agencyId, setAgencyId] = useState<string | null>(null)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [formData, setFormData] = useState({
        full_name: "",
        phone_number: "",
        notes: ""
    })
    const [saving, setSaving] = useState(false)

    // Fetch Agency & Customers
    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.id) return

            // 1. Get Agency ID
            const { data: agency } = await supabase
                .from('agencies')
                .select('id')
                .eq('owner_id', profile.id)
                .single()

            if (agency) {
                setAgencyId(agency.id)
                // 2. Get Customers
                const { data: customersData } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('agency_id', agency.id)
                    .order('created_at', { ascending: false })

                if (customersData) setCustomers(customersData)
            }
            setLoading(false)
        }
        fetchData()
    }, [profile])

    // Filter Customers
    const filteredCustomers = customers.filter(c =>
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone_number.includes(searchTerm)
    )

    // Handlers
    const handleOpenModal = (customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer)
            setFormData({
                full_name: customer.full_name,
                phone_number: customer.phone_number,
                notes: customer.notes || ""
            })
        } else {
            setEditingCustomer(null)
            setFormData({ full_name: "", phone_number: "", notes: "" })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!agencyId) return alert("Error: No se encontró agencia asociada.")
        if (!formData.full_name || !formData.phone_number) return alert("Nombre y Teléfono son obligatorios.")

        setSaving(true)
        try {
            if (editingCustomer) {
                // Update
                const { error } = await supabase
                    .from('customers')
                    .update({
                        full_name: formData.full_name,
                        phone_number: formData.phone_number,
                        notes: formData.notes
                    })
                    .eq('id', editingCustomer.id)

                if (error) throw error

                // Update Local State
                setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...formData } : c))

            } else {
                // Create
                const { data, error } = await supabase
                    .from('customers')
                    .insert([{
                        agency_id: agencyId,
                        full_name: formData.full_name,
                        phone_number: formData.phone_number,
                        notes: formData.notes,
                        balance: 0
                    }])
                    .select()
                    .single()

                if (error) throw error
                if (data) setCustomers([data, ...customers])
            }
            setIsModalOpen(false)
        } catch (error: any) {
            console.error("Error saving customer:", error)
            alert("Error al guardar cliente: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return

        try {
            const { error } = await supabase.from('customers').delete().eq('id', id)
            if (error) throw error
            setCustomers(customers.filter(c => c.id !== id))
        } catch (error: any) {
            console.error("Error deleting customer:", error)
            alert("Error al eliminar cliente")
        }
    }

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[20%] right-[-20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="px-6 pt-8 pb-24 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                                <User className="h-5 w-5 text-primary" />
                            </span>
                            Clientes
                        </h1>
                        <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase pl-[3.25rem]">Gestiona tu cartera</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary hover:bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all hover:scale-105 rounded-2xl w-12 h-12 flex items-center justify-center active:scale-95 group"
                    >
                        <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="glass-card border border-white/10 overflow-hidden shadow-2xl rounded-[2.5rem] relative min-h-[500px]">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm sticky top-0 z-20">
                        <div className="relative group/search">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within/search:text-primary transition-colors duration-300" />
                            <input
                                type="text"
                                placeholder="BUSCAR CLIENTE..."
                                className="w-full pl-14 pr-6 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-[3px] focus:ring-primary/20 text-white placeholder:text-white/20 rounded-2xl h-14 outline-none transition-all font-bold text-xs uppercase tracking-wider shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="p-20 text-center text-white/40 flex flex-col items-center justify-center h-[400px]">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="h-10 w-10 text-primary animate-spin relative z-10" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-6 animate-pulse text-primary">Cargando Base de Datos...</p>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="p-20 text-center text-white/30 flex flex-col items-center justify-center h-[400px]">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                                    <User className="h-8 w-8 opacity-20" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-wider">No se encontraron clientes.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredCustomers.map((customer) => (
                                    <div key={customer.id} className="p-5 hover:bg-white/[0.03] transition-colors group flex items-center justify-between relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-primary border border-white/10 font-black text-xl shadow-[0_0_15px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                                                {customer.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-base leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">{customer.full_name}</p>
                                                <p className="text-[10px] text-white/40 font-bold mt-1 tracking-widest flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {customer.phone_number}
                                                </p>
                                                {customer.notes && <p className="text-[9px] text-white/30 mt-1 max-w-[200px] truncate italic bg-white/5 px-2 py-0.5 rounded w-fit">{customer.notes}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 relative z-10">
                                            <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black border tracking-wider shadow-lg ${customer.balance < 0
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10'
                                                : customer.balance > 0
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/10'
                                                    : 'bg-white/5 text-white/30 border-white/10'
                                                }`}>
                                                ${customer.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => handleOpenModal(customer)} className="p-2 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-colors border border-transparent hover:border-white/10">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(customer.id)} className="p-2 hover:bg-red-500/10 text-white/50 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="glass-card border border-white/10 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative bg-[#0a0a0a]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

                        <div className="flex justify-between items-center bg-white/[0.02] border-b border-white/5 p-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                                    {editingCustomer ? 'Editar' : 'Nuevo'} <span className="text-primary not-italic">Cliente</span>
                                </h3>
                                <p className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mt-1">Información Personal</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/5">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Nombre Completo</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-focus-within:bg-primary group-focus-within:text-black transition-colors duration-300">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        className="w-full pl-14 pr-4 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-[3px] focus:ring-primary/20 text-white rounded-2xl py-4 outline-none transition-all shadow-inner font-bold placeholder:text-white/10 placeholder:font-normal"
                                        placeholder="Ej: Juan Perez"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Teléfono (WhatsApp)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-focus-within:bg-green-500 group-focus-within:text-white transition-colors duration-300">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <input
                                        className="w-full pl-14 pr-4 bg-black/40 border border-white/10 focus:border-green-500/50 focus:ring-[3px] focus:ring-green-500/20 text-white rounded-2xl py-4 outline-none transition-all shadow-inner font-bold placeholder:text-white/10 placeholder:font-normal"
                                        placeholder="Ej: +54 9 11 1234 5678"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Notas Adicionales</label>
                                <input
                                    className="w-full px-5 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-[3px] focus:ring-primary/20 text-white rounded-2xl py-4 outline-none transition-all shadow-inner font-bold placeholder:text-white/10 placeholder:font-normal"
                                    placeholder="Ej: Cliente preferencial"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-8 border-t border-white/5 bg-white/[0.02] relative z-10">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving} className="px-8 py-4 rounded-xl bg-primary hover:bg-[#d4ff00] text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.25)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all active:scale-95 flex items-center gap-2">
                                {saving ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                                ) : (
                                    <><Save className="h-4 w-4" /> Guardar Cliente</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    )
}
