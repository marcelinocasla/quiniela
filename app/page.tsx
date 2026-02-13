import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Trophy, ShieldCheck, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0a0a]/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-sm font-black text-white">Q</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Quiniela Digital</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20 hover:scale-105 transition-all">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8 py-12 md:py-24 relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 backdrop-blur-xl mb-4">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
            Nueva Plataforma 2.0
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter max-w-4xl bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent relative z-10">
            La Nueva Era de la <br className="hidden md:block" />
            <span className="text-orange-500 inline-block mt-2 md:mt-0">Quiniela Digital</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto relative z-10 leading-relaxed md:leading-normal">
            Gestiona tus jugadas, controla tu agencia y recibe apuestas por WhatsApp de forma automatizada. Todo en un solo lugar, con seguridad y transparencia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full sm:w-auto relative z-10">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white w-full shadow-xl shadow-orange-900/30 hover:scale-105 transition-all font-semibold rounded-2xl">
                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 w-full hover:border-white/20 transition-all font-medium rounded-2xl">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-24 relative z-10 text-left">
            <div className="rounded-3xl border border-white/5 bg-[#121212]/50 p-8 backdrop-blur-sm hover:bg-[#121212] transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Control Total</h3>
              <p className="text-neutral-400 leading-relaxed">Dashboard completo para dueños de agencia. Estadísticas en tiempo real, control de caja y gestión de clientes.</p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#121212]/50 p-8 backdrop-blur-sm hover:bg-[#121212] transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Seguridad Garantizada</h3>
              <p className="text-neutral-400 leading-relaxed">Tus datos y los de tus clientes están protegidos. Sistema de autenticación robusto y tickets digitales verificables.</p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#121212]/50 p-8 backdrop-blur-sm hover:bg-[#121212] transition-colors group">
              <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pagos Automatizados</h3>
              <p className="text-neutral-400 leading-relaxed">Calcula premios automáticamente y gestiona los pagos a tus clientes de forma eficiente y sin errores.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-neutral-600 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container flex flex-col md:flex-row justify-between items-center px-4">
          <p>© 2024 Quiniela Digital. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-orange-500 transition-colors">Términos</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
