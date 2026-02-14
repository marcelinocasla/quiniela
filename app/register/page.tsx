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
    const { signUpWithEmail, signInWithGoogle, signInWithFacebook } = useAuth()
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
            if (err.code === 'auth/unauthorized-domain' || err.message.includes('unauthorized-domain')) {
                setError("El dominio actual no está autorizado en Firebase. Contacte al administrador.")
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Se cerró la ventana de registro.")
            } else {
                setError("Error al registrarse con Google. Intente nuevamente.")
            }
        }
    }

    const handleFacebookLogin = async () => {
        try {
            await signInWithFacebook()
            router.push("/dashboard")
        } catch (err: any) {
            if (err.code === 'auth/unauthorized-domain' || err.message.includes('unauthorized-domain')) {
                setError("El dominio actual no está autorizado en Firebase. Contacte al administrador.")
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError("Se cerró la ventana de registro.")
            } else {
                console.error(err)
                setError("Error al registrarse con Facebook. Intente nuevamente.")
            }
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background font-sans text-white selection:bg-primary/30 transition-colors">
            {/* Background Accent Glows - Fluor Yellow & Cyan */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px]"></div>

            <div className="w-full max-w-md flex flex-col px-8 z-10 justify-center">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(204,255,0,0.2)] border border-primary/30 backdrop-blur-xl relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="material-icons-round text-primary text-6xl drop-shadow-[0_0_15px_rgba(204,255,0,0.6)] relative z-10">casino</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase text-center leading-9">
                        Crear <span className="text-primary block text-5xl mt-1 drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">Cuenta</span>
                    </h1>
                    <p className="text-white/60 text-[9px] tracking-[0.4em] mt-3 font-bold uppercase border border-white/10 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md">
                        Únete a Quiniela Digital
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4 bg-white/[0.03] p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">
                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl text-center font-bold backdrop-blur-md animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Nombre Completo</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-black/20 transition-all duration-300 hover:bg-black/30">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">person</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium text-sm"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Correo Electrónico</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-black/20 transition-all duration-300 hover:bg-black/30">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">alternate_email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium text-sm"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold ml-1">Contraseña</label>
                        <div className="relative group focus-within:ring-2 ring-primary/50 rounded-2xl border border-white/10 bg-black/20 transition-all duration-300 hover:bg-black/30">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary text-xl transition-colors">lock_outline</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:ring-0 rounded-2xl outline-none font-medium text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-[#d4ff00] text-black py-4 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest relative overflow-hidden group mt-4">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Registrarse <span className="material-icons-round text-lg">rocket_launch</span>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                    </button>
                </form>

                {/* Social Login */}
                <div className="mt-8">
                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="px-4 text-[9px] uppercase tracking-widest text-white/30 font-bold">O regístrate con</span>
                        <div className="flex-grow border-t border-white/5"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-3 py-4 border border-white/5 bg-white/[0.02] rounded-2xl hover:bg-white/5 transition-all active:scale-95 group">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Google</span>
                        </button>
                        <button onClick={handleFacebookLogin} type="button" className="flex items-center justify-center gap-3 py-4 border border-white/5 bg-white/[0.02] rounded-2xl hover:bg-white/5 transition-all active:scale-95 group">
                            <span className="material-icons-round text-white/60 group-hover:text-[#1877F2] transition-colors text-lg">facebook</span>
                            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <div className="mt-auto pt-6 text-center bg-transparent">
                    <p className="text-sm text-white/40 font-medium">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="text-primary font-black hover:underline decoration-primary/50 underline-offset-4 ml-2 hover:text-[#eaff00] transition-colors uppercase text-xs tracking-wider">INICIA SESIÓN</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
