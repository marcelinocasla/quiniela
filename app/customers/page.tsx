"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2, X, Save, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

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
        <DashboardLayout>
            <div className="flex flex-col gap-6 selection:bg-[#ff6600]/30 min-h-screen">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Clientes</h1>
                        <p className="text-[#ff6600] text-sm font-medium tracking-widest uppercase mt-1">Gestiona tu cartera</p>
                    </div>
                    <Button onClick={() => handleOpenModal()} className="bg-[#ff6600] hover:bg-[#ff6600]/90 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 rounded-xl px-6">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                </div>

                <Card className="bg-[#121212] border border-white/5 overflow-hidden shadow-2xl rounded-2xl relative">
                    {/* Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6600]/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <CardHeader className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input
                                placeholder="Buscar por nombre o teléfono..."
                                className="pl-10 border-white/10 bg-black/40 text-white placeholder:text-white/30 focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] rounded-xl h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-20 text-center text-white/40 flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full border-2 border-[#ff6600] border-t-transparent animate-spin mb-4" />
                                <p>Cargando clientes...</p>
                            </div>
                        ) : filteredCustomers.length === 0 ? (
                            <div className="p-20 text-center text-white/40">
                                <p>No se encontraron clientes.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-white/40 uppercase text-[10px] tracking-widest font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Nombre</th>
                                            <th className="px-6 py-4">Teléfono</th>
                                            <th className="px-6 py-4">Saldo</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/80">
                                        {filteredCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-[#ff6600]/10 flex items-center justify-center text-[#ff6600] border border-[#ff6600]/20 font-bold text-lg shadow-[0_0_10px_rgba(255,102,0,0.1)]">
                                                            {customer.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{customer.full_name}</p>
                                                            {customer.notes && <p className="text-[11px] text-white/40 max-w-[200px] truncate mt-0.5">{customer.notes}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-white/60 text-xs tracking-wide">{customer.phone_number}</td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${customer.balance < 0
                                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        : customer.balance > 0
                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                            : 'bg-white/5 text-white/40 border-white/10'
                                                        }`}>
                                                        ${customer.balance.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#ff6600]/10 hover:text-[#ff6600] rounded-lg transition-colors" onClick={() => handleOpenModal(customer)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors" onClick={() => handleDelete(customer.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
                        {/* Modal Glow */}
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#ff6600]/10 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center bg-white/5 border-b border-white/5 p-5 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                                </h3>
                                <p className="text-[10px] uppercase text-[#ff6600] tracking-widest font-semibold mt-0.5">Información Personal</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Nombre Completo</label>
                                <Input
                                    className="bg-black/50 border-white/10 focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] text-white rounded-xl py-6"
                                    placeholder="Ej: Juan Perez"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Teléfono (WhatsApp)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                    <Input
                                        className="pl-11 bg-black/50 border-white/10 focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] text-white rounded-xl py-6"
                                        placeholder="Ej: +54 9 11 1234 5678"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-white/60 ml-1">Notas Adicionales</label>
                                <Input
                                    className="bg-black/50 border-white/10 focus-visible:ring-[#ff6600] focus-visible:border-[#ff6600] text-white rounded-xl py-6"
                                    placeholder="Ej: Cliente preferencial"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t border-white/5 bg-white/5 relative z-10">
                            <Button variant="outline" className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white rounded-xl px-4" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button className="bg-[#ff6600] hover:bg-[#ff6600]/90 text-white shadow-lg shadow-orange-500/20 rounded-xl px-6" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>Guardando...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4" /> Guardar</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
