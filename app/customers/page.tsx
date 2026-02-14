"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, X, Save, Phone, User } from "lucide-react"
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
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] right-[-20%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="px-6 pt-8 pb-24 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Clientes</h1>
                        <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">Gestiona tu cartera</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all hover:scale-105 rounded-2xl w-12 h-12 flex items-center justify-center active:scale-95"
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                </div>

                <div className="glass-card border border-white/5 overflow-hidden shadow-2xl rounded-3xl relative min-h-[500px]">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm sticky top-0 z-20">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                className="w-full pl-12 pr-4 bg-black/20 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 rounded-xl h-12 outline-none transition-all font-medium text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-0">
                        {loading ? (
                            <div className="p-20 text-center text-white/40 flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4 shadow-[0_0_15px_rgba(57,255,20,0.2)]" />
                                <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Cargando...</p>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="p-20 text-center text-white/30 flex flex-col items-center">
                                <User className="h-16 w-16 mb-4 opacity-20" />
                                <p className="text-sm font-medium">No se encontraron clientes.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredCustomers.map((customer) => (
                                    <div key={customer.id} className="p-5 hover:bg-white/5 transition-colors group flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-primary border border-white/10 font-black text-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                {customer.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-base leading-tight">{customer.full_name}</p>
                                                <p className="text-xs text-white/40 font-mono mt-0.5 tracking-wide">{customer.phone_number}</p>
                                                {customer.notes && <p className="text-[10px] text-white/30 mt-1 max-w-[150px] truncate">{customer.notes}</p>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${customer.balance < 0
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                : customer.balance > 0
                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                    : 'bg-white/5 text-white/30 border-white/10'
                                                }`}>
                                                ${customer.balance.toFixed(2)}
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => handleOpenModal(customer)} className="p-2 hover:bg-white/10 text-white/50 hover:text-white rounded-lg transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(customer.id)} className="p-2 hover:bg-red-500/10 text-white/50 hover:text-red-500 rounded-lg transition-colors">
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="glass-card border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center bg-white/5 border-b border-white/5 p-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                                </h3>
                                <p className="text-[10px] uppercase text-primary tracking-widest font-bold mt-1">Información Personal</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Nombre Completo</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="w-full pl-11 pr-4 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white rounded-xl py-4 outline-none transition-all"
                                        placeholder="Ej: Juan Perez"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Teléfono (WhatsApp)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="w-full pl-11 pr-4 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white rounded-xl py-4 outline-none transition-all"
                                        placeholder="Ej: +54 9 11 1234 5678"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Notas Adicionales</label>
                                <input
                                    className="w-full px-4 bg-black/40 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white rounded-xl py-4 outline-none transition-all"
                                    placeholder="Ej: Cliente preferencial"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-white/5 bg-white/5 relative z-10">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all active:scale-95 flex items-center gap-2">
                                {saving ? (
                                    <>Guardando...</>
                                ) : (
                                    <><Save className="h-4 w-4" /> Guardar</>
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
