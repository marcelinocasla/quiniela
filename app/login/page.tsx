"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { signInWithEmail, signInWithGoogle } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signInWithEmail(email, password)
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-black font-sans text-white selection:bg-[#ff6600]/30 transition-colors">
            {/* Background Accent Glows */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff6600]/10 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 bg-[#ff6600]/5 rounded-full blur-[80px]"></div>

            {/* iOS Status Bar Placeholder (Visual only) */}
            <div className="w-full flex justify-between items-end px-8 pb-2 pt-4 opacity-50">
                <span className="text-xs font-semibold">9:41</span>
                <div className="flex gap-1.5 items-center">
                    <span className="material-icons text-[14px]">signal_cellular_alt</span>
                    <span className="material-icons text-[14px]">wifi</span>
                    <span className="material-icons text-[18px]">battery_full</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-8 pt-12 pb-8">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-16">
                    <div className="w-16 h-16 bg-[#ff6600] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                        <span className="material-icons-round text-white text-4xl">casino</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
                        Quiniela<span className="text-[#ff6600] font-light">Digital</span>
                    </h1>
                    <p className="text-[#ff6600]/60 text-xs tracking-[0.2em] mt-1 font-medium">PREMIUM EXPERIENCE</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#ff6600] font-semibold mb-2 ml-1">Correo Electrónico</label>
                        <div className="relative group focus-within:ring-1 ring-[#ff6600] rounded-xl border border-[#333333] bg-[#1a1a1a]/50 transition-all duration-300">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-[#333333] group-focus-within:text-[#ff6600] text-xl">alternate_email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder:text-[#333333] focus:ring-0 rounded-xl outline-none"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#ff6600] font-semibold mb-2 ml-1">Contraseña</label>
                        <div className="relative group focus-within:ring-1 ring-[#ff6600] rounded-xl border border-[#333333] bg-[#1a1a1a]/50 transition-all duration-300">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-[#333333] group-focus-within:text-[#ff6600] text-xl">lock_outline</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-white placeholder:text-[#333333] focus:ring-0 rounded-xl outline-none"
                                placeholder="••••••••"
                                required
                            />
                            <button type="button" className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-[#333333] hover:text-white transition-colors text-xl">visibility_off</button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <a href="#" className="text-xs text-[#ff6600]/80 hover:text-[#ff6600] transition-colors font-medium">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit" className="w-full bg-[#ff6600] py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-[0.98] transition-all mt-4">
                        Iniciar Sesión
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-12">
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-[#333333]/30"></div>
                        <span className="px-4 text-[10px] uppercase tracking-widest text-[#333333] font-bold">O continúa con</span>
                        <div className="flex-grow border-t border-[#333333]/30"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-2 py-3.5 border border-[#333333] rounded-xl hover:bg-[#1a1a1a] transition-colors">
                            <span className="text-sm font-medium">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3.5 border border-[#333333] rounded-xl hover:bg-[#1a1a1a] transition-colors">
                            <span className="text-sm font-medium text-white">Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Register Link */}
                <div className="mt-auto pt-10 text-center">
                    <p className="text-sm text-[#333333]">
                        ¿No tienes una cuenta?
                        <Link href="/register" className="text-[#ff6600] font-bold hover:underline decoration-[#ff6600]/30 underline-offset-4 ml-1">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
