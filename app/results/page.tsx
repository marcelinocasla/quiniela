"use client"
import { useAuth } from "@/components/auth-provider"
import { ChevronDown, Calendar, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import BottomNav from "@/components/BottomNav"

export default function Results() {
    const { user } = useAuth()
    const [results, setResults] = useState<any[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(true)

    // Helper to format date display
    const getDaysArray = () => {
        const days = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
                date: d.toISOString().split('T')[0],
                dayNum: d.getDate(),
                dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '')
            });
        }
        return days.reverse();
    };
    const days = getDaysArray();

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('lottery_results')
                .select('*')
                .eq('draw_date', selectedDate)

            if (data) {
                // Group by lottery_name
                const grouped: any = {};
                data.forEach(item => {
                    if (!grouped[item.lottery_name]) {
                        grouped[item.lottery_name] = [];
                    }
                    grouped[item.lottery_name].push(item);
                });
                // Sort types within groups
                const order = ['Previa', 'Primera', 'Matutina', 'Vespertina', 'Nocturna'];
                for (const key in grouped) {
                    grouped[key].sort((a: any, b: any) => order.indexOf(a.lottery_type) - order.indexOf(b.lottery_type));
                }
                setResults(Object.entries(grouped));
            } else {
                setResults([])
            }
            setLoading(false)
        }
        fetchResults()
    }, [selectedDate])

    return (
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30 pb-24 antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header Section */}
            <header className="sticky top-0 z-40 px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                        <span className="material-icons-round text-primary text-xl">emoji_events</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Resultados <span className="text-primary not-italic">Oficiales</span></h1>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Quiniela Argentina</p>
                    </div>
                </div>
            </header>

            <main className="px-4 space-y-8 pt-6 relative z-10">
                {/* Date Selector - Neon Style */}
                <section className="overflow-x-auto hide-scrollbar flex space-x-3 py-4 -mx-4 px-4 snap-x">
                    {days.map((d) => (
                        <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border snap-center group relative overflow-hidden ${selectedDate === d.date ? 'bg-primary border-primary shadow-[0_0_20px_rgba(204,255,0,0.4)] scale-110 z-10' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            <span className={`text-[9px] font-black uppercase tracking-wider relative z-10 ${selectedDate === d.date ? 'text-black' : 'text-white/50'}`}>{d.dayName}</span>
                            <span className={`text-2xl font-black relative z-10 ${selectedDate === d.date ? 'text-black' : 'text-white'}`}>{d.dayNum}</span>
                            {selectedDate === d.date && <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>}
                        </button>
                    ))}
                    <div className="flex-shrink-0 w-16 h-20 rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.02]">
                        <Calendar className="text-white/20 w-6 h-6" />
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-24 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        </div>
                        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6 relative z-10"></div>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest animate-pulse relative z-10">Sincronizando Resultados...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20 space-y-6 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <span className="material-icons-round text-5xl text-white/20 relative z-10">search_off</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">Sin Resultados</p>
                            <p className="text-white/40 text-xs mt-1">No hay sorteos disponibles para esta fecha.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {results.map(([lotteryName, lotteryDraws]: [string, any[]]) => (
                            <LotteryCard key={lotteryName} name={lotteryName} draws={lotteryDraws} />
                        ))}
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    )
}

function LotteryCard({ name, draws }: { name: string, draws: any[] }) {
    const [selectedDrawIndex, setSelectedDrawIndex] = useState(draws.length - 1);
    const currentDraw = draws[selectedDrawIndex];

    return (
        <section className="glass-card rounded-[2.5rem] p-1 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(204,255,0,0.15)] border border-white/10 group">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>

            <div className="bg-black/40 backdrop-blur-md rounded-[2.3rem] p-6 h-full border border-white/5 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{name}</h2>
                        <div className="h-1 w-12 bg-primary mt-2 rounded-full shadow-[0_0_10px_#CCFF00]"></div>
                    </div>
                    {/* <span className="text-[9px] bg-primary/20 text-primary px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-primary/20 shadow-[0_0_10px_rgba(204,255,0,0.2)]">Finalizado</span> */}
                </div>

                {/* Segmented Control - Neon Pills */}
                <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 overflow-x-auto hide-scrollbar border border-white/5">
                    {draws.map((draw, idx) => (
                        <button
                            key={draw.id}
                            onClick={() => setSelectedDrawIndex(idx)}
                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${idx === selectedDrawIndex ? 'bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            {draw.lottery_type}
                        </button>
                    ))}
                </div>

                {currentDraw && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* "La Cabeza" Display - Glowing Sphere */}
                        <div className="flex flex-col items-center justify-center mb-10 relative">
                            <span className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-primary/50"></span> A la Cabeza <span className="w-8 h-[1px] bg-primary/50"></span>
                            </span>
                            <div className="relative group cursor-default">
                                <div className="absolute inset-0 bg-primary rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                                <div className="w-40 h-40 rounded-full border border-primary/20 flex items-center justify-center bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl relative z-10 shadow-[0_0_30px_rgba(204,255,0,0.1)] group-hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-2 rounded-full border border-white/5"></div>
                                    <span className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                                        {String(currentDraw.numbers[0]).padStart(4, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Preview List - Glass Strips */}
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {currentDraw.numbers.slice(1, 11).map((num: number, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white/[0.03] px-4 py-3 rounded-xl border border-white/[0.02] hover:bg-white/[0.06] transition-colors group">
                                    <span className="text-[10px] text-white/30 font-bold group-hover:text-primary transition-colors">{idx + 2}.</span>
                                    <span className="text-base font-black text-white/90 tracking-widest font-mono group-hover:text-white transition-colors">{String(num).padStart(4, '0')}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 text-center relative z-10">
                            <button className="text-[10px] uppercase font-bold text-white/40 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto decoration-primary/30 hover:underline underline-offset-4 tracking-widest group">
                                Ver extracto completo <ChevronDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
