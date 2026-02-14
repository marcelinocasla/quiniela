import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Trophy, ShieldCheck, Banknote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#aacc00] flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)]">
              <span className="text-lg font-black text-black">Q</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">Quiniela <span className="text-primary">Digital</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-xs">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-[#d4ff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] hover:scale-105 transition-all font-black uppercase tracking-wider text-xs px-6 rounded-xl">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 flex flex-col items-center text-center space-y-10 py-12 md:py-24 relative">

          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-xl mb-4 shadow-[0_0_15px_rgba(204,255,0,0.1)] uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.8)]"></span>
            Nueva Plataforma 2.0
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl text-white relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] leading-[0.9]">
            La Nueva Era de la <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#d4ff00] to-primary animate-gradient bg-300% inline-block mt-2 md:mt-0 drop-shadow-[0_0_20px_rgba(204,255,0,0.3)]">Quiniela Digital</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto relative z-10 leading-relaxed font-medium">
            Gestiona tus jugadas, controla tu agencia y recibe apuestas por WhatsApp de forma <span className="text-white font-bold">automatizada</span>. Todo en un solo lugar, con seguridad y transparencia.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full sm:w-auto relative z-10">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="h-16 px-10 text-sm bg-primary hover:bg-[#d4ff00] text-black w-full shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:shadow-[0_0_50px_rgba(204,255,0,0.5)] hover:scale-105 transition-all font-black uppercase tracking-widest rounded-2xl group">
                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-16 px-10 text-sm border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 w-full hover:border-white/20 transition-all font-bold uppercase tracking-widest rounded-2xl hover:scale-105">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-32 relative z-10 text-left">
            <div className="glass-card rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-md hover:bg-white/5 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(204,255,0,0.1)] border border-primary/20">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Control Total</h3>
              <p className="text-white/50 leading-relaxed font-medium">Dashboard completo para dueños de agencia. Estadísticas en tiempo real, control de caja y gestión de clientes.</p>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-md hover:bg-white/5 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20">
                <ShieldCheck className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Seguridad Garantizada</h3>
              <p className="text-white/50 leading-relaxed font-medium">Tus datos y los de tus clientes están protegidos. Sistema de autenticación robusto y tickets digitales verificables.</p>
            </div>

            <div className="glass-card rounded-[2.5rem] border border-white/5 p-10 backdrop-blur-md hover:bg-white/5 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)] border border-green-500/20">
                <Banknote className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Pagos Automatizados</h3>
              <p className="text-white/50 leading-relaxed font-medium">Calcula premios automáticamente y gestiona los pagos a tus clientes de forma eficiente y sin errores.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 text-center text-xs font-bold uppercase tracking-widest text-white/30 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container flex flex-col md:flex-row justify-between items-center px-4">
          <p>© 2024 Quiniela Digital. Todos los derechos reservados.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Términos</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-primary transition-colors">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
