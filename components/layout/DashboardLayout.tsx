"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, PlusCircle, Users, BarChart3, Settings, LogOut, MessageSquare } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()

    const navItems = [
        { href: "/dashboard", label: "Inicio", icon: Home },
        { href: "/whatsapp", label: "Nueva Jugada", icon: PlusCircle }, // Direct to WhatsApp for now
        { href: "/whatsapp", label: "Pedidos WhatsApp", icon: MessageSquare },
        { href: "/customers", label: "Clientes", icon: Users },
        { href: "/results", label: "Resultados", icon: BarChart3 }, // Reusing icon or finding better one
        { href: "/reports", label: "Reportes", icon: BarChart3 },
        { href: "/settings", label: "Configuración", icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar */}
            <div className="hidden w-64 flex-col border-r border-neutral-800 bg-neutral-950 md:flex">
                <div className="flex h-16 items-center px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-orange-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">Q</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight">Quiniela Digital</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-orange-500/10 text-orange-500"
                                            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                <div className="border-t border-neutral-800 p-4">
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white">
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="flex h-16 items-center border-b border-neutral-800 bg-neutral-950 px-4 md:hidden">
                    <span className="text-lg font-bold">Quiniela Digital</span>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
