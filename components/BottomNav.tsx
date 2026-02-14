"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, Settings, User, FileText } from "lucide-react"

export default function BottomNav() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#050A14]/90 backdrop-blur-xl border-t border-white/5 px-6 flex justify-between items-center z-[100] pb-2 safe-area-bottom">
            <Link href="/dashboard" className="flex flex-col items-center space-y-1 w-16 group">
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/dashboard') ? 'bg-primary/20' : 'bg-transparent'}`}>
                    <LayoutDashboard className={`h-6 w-6 transition-colors ${isActive('/dashboard') ? 'text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'text-white/40 group-hover:text-white/70'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-white/40'}`}>Inicio</span>
            </Link>

            <Link href="/results" className="flex flex-col items-center space-y-1 w-16 group">
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/results') ? 'bg-primary/20' : 'bg-transparent'}`}>
                    <FileText className={`h-6 w-6 transition-colors ${isActive('/results') ? 'text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'text-white/40 group-hover:text-white/70'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive('/results') ? 'text-primary' : 'text-white/40'}`}>Resultados</span>
            </Link>

            <div className="relative -top-6">
                <Link href="/bet/new">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.4)] active:scale-95 transition-all active:shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                        <span className="material-icons-round text-[#050A14] text-3xl font-bold">+</span>
                    </div>
                </Link>
            </div>

            <Link href="/customers" className="flex flex-col items-center space-y-1 w-16 group">
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/customers') ? 'bg-primary/20' : 'bg-transparent'}`}>
                    <User className={`h-6 w-6 transition-colors ${isActive('/customers') ? 'text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'text-white/40 group-hover:text-white/70'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive('/customers') ? 'text-primary' : 'text-white/40'}`}>Clientes</span>
            </Link>

            <Link href="/settings" className="flex flex-col items-center space-y-1 w-16 group">
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive('/settings') ? 'bg-primary/20' : 'bg-transparent'}`}>
                    <Settings className={`h-6 w-6 transition-colors ${isActive('/settings') ? 'text-primary drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'text-white/40 group-hover:text-white/70'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive('/settings') ? 'text-primary' : 'text-white/40'}`}>Ajustes</span>
            </Link>
        </nav>
    )
}
