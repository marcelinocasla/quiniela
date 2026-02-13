"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, Settings, User, FileText } from "lucide-react"

export function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 flex justify-between items-center z-[100] pb-2">
            <Link href="/dashboard" className="flex flex-col items-center space-y-1 w-16">
                <LayoutDashboard className={`h-6 w-6 ${isActive('/dashboard') ? 'text-primary' : 'text-white/40'}`} />
                <span className={`text-[10px] font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-white/40'}`}>Inicio</span>
            </Link>

            <Link href="/results" className="flex flex-col items-center space-y-1 w-16">
                <FileText className={`h-6 w-6 ${isActive('/results') ? 'text-primary' : 'text-white/40'}`} />
                <span className={`text-[10px] font-medium ${isActive('/results') ? 'text-primary' : 'text-white/40'}`}>Resultados</span>
            </Link>

            <div className="relative -top-6">
                <Link href="/whatsapp">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 rotate-45 active:scale-95 transition-transform">
                        <span className="material-icons-round text-white -rotate-45 text-3xl font-light">+</span>
                    </div>
                </Link>
            </div>

            <Link href="/customers" className="flex flex-col items-center space-y-1 w-16">
                <User className={`h-6 w-6 ${isActive('/customers') ? 'text-primary' : 'text-white/40'}`} />
                <span className={`text-[10px] font-medium ${isActive('/customers') ? 'text-primary' : 'text-white/40'}`}>Clientes</span>
            </Link>

            <Link href="/settings" className="flex flex-col items-center space-y-1 w-16">
                <Settings className={`h-6 w-6 ${isActive('/settings') ? 'text-primary' : 'text-white/40'}`} />
                <span className={`text-[10px] font-medium ${isActive('/settings') ? 'text-primary' : 'text-white/40'}`}>Ajustes</span>
            </Link>
        </nav>
    )
}
