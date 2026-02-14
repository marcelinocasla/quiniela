"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const { signUpWithEmail, signInWithGoogle } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await signUpWithEmail(email, password)
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
        <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden bg-background font-sans text-white selection:bg-primary/30 transition-colors">
            {/* Background Accent Glows */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-2/3 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"></div>

            <div className="flex-1 flex flex-col px-8 pt-12 pb-8 z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(57,255,20,0.15)] border border-primary/20 backdrop-blur-md">
                        <span className="material-icons-round text-primary text-5xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">casino</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white uppercase text-center leading-9">
                        Crear <span className="text-primary font-light block">Cuenta</span>
                    </h1>
                    <p className="text-primary/80 text-[10px] tracking-[0.3em] mt-2 font-bold uppercase">ÚNETE A QUINIELA DIGITAL</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl text-center font-medium backdrop-blur-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-widest text-primary/80 font-bold ml-1">Nombre Completo</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-white/5 transition-all duration-300">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">person</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-widest text-primary/80 font-bold ml-1">Correo Electrónico</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-white/5 transition-all duration-300">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">alternate_email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-widest text-primary/80 font-bold ml-1">Contraseña</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-white/5 transition-all duration-300">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">lock_outline</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 py-4 rounded-2xl font-bold text-lg text-primary-foreground shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] active:scale-[0.98] transition-all duration-300 uppercase tracking-wide mt-2">
                        Registrarse
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="px-4 text-[10px] uppercase tracking-widest text-white/30 font-bold">O regístrate con</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-3 py-3.5 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-all active:scale-95">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 opacity-80" />
                            <span className="text-sm font-semibold text-white/80">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-3 py-3.5 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-all active:scale-95">
                            <span className="text-sm font-semibold text-white/80">Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <div className="mt-auto pt-6 text-center">
                    <p className="text-sm text-white/40 font-medium">
                        ¿Ya tienes una cuenta?
                        <Link href="/login" className="text-primary font-bold hover:underline decoration-primary/50 underline-offset-4 ml-2 hover:text-primary/80 transition-colors">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
