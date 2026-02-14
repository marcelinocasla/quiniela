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
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            {/* Header Section */}
            <header className="sticky top-0 z-40 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Resultados</h1>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Quiniela Oficial</p>
                    </div>
                </div>
            </header>

            <main className="px-4 space-y-6 pt-4">
                {/* Date Selector */}
                <section className="overflow-x-auto hide-scrollbar flex space-x-3 py-2 -mx-4 px-4">
                    {days.map((d) => (
                        <button
                            key={d.date}
                            onClick={() => setSelectedDate(d.date)}
                            className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${selectedDate === d.date ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-105' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                            <span className="text-[10px] font-bold opacity-80">{d.dayName}</span>
                            <span className="text-xl font-black">{d.dayNum}</span>
                        </button>
                    ))}
                    <div className="flex-shrink-0 w-10 flex items-center justify-center">
                        <Calendar className="text-primary/40 w-6 h-6" />
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-white/40 text-sm animate-pulse">Cargando resultados...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <span className="material-icons-round text-4xl text-white/20">search_off</span>
                        </div>
                        <p className="text-white/40 text-sm">No hay resultados disponibles para esta fecha.</p>
                    </div>
                ) : (
                    results.map(([lotteryName, lotteryDraws]: [string, any[]]) => (
                        <LotteryCard key={lotteryName} name={lotteryName} draws={lotteryDraws} />
                    ))
                )}
            </main>
            <BottomNav />
        </div>
    )
}

function LotteryCard({ name, draws }: { name: string, draws: any[] }) {
    const [selectedDrawIndex, setSelectedDrawIndex] = useState(draws.length - 1); // Default to latest (usually last in sort if pushed chronologically, but sort logic puts Nocturna last)
    const currentDraw = draws[selectedDrawIndex];

    return (
        <section className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-[80px]"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
                    <p className="text-[10px] text-primary/80 uppercase tracking-widest font-bold mt-1">Argentina</p>
                </div>
                {/* <div className="text-right">
                     <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold border border-primary/20">FINALIZADO</span>
                </div> */}
            </div>

            {/* Segmented Control */}
            <div className="flex bg-black/20 p-1 rounded-xl mb-6 overflow-x-auto hide-scrollbar border border-white/5 relative z-10">
                {draws.map((draw, idx) => (
                    <button
                        key={draw.id}
                        onClick={() => setSelectedDrawIndex(idx)}
                        className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${idx === selectedDrawIndex ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white/70'}`}
                    >
                        {draw.lottery_type}
                    </button>
                ))}
            </div>

            {currentDraw && (
                <>
                    {/* "La Cabeza" Display */}
                    <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-4">A la Cabeza</span>
                        <div className="relative group cursor-default">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                            <div className="w-32 h-32 rounded-full border border-primary/30 flex items-center justify-center bg-background/50 backdrop-blur-sm relative z-10 shadow-[0_0_20px_rgba(57,255,20,0.1)] group-hover:scale-105 transition-transform duration-500">
                                <span className="text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    {String(currentDraw.numbers[0]).padStart(4, '0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Preview List (Showing first 5 for preview) */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 relative z-10">
                        {currentDraw.numbers.slice(1, 11).map((num: number, idx: number) => (
                            <div key={idx} className="flex justify-between items-center bg-white/[0.02] px-3 py-2 rounded-lg border border-white/[0.02]">
                                <span className="text-[10px] text-white/30 font-bold">{idx + 2}.</span>
                                <span className="text-sm font-bold text-white/90 tracking-wider">{String(num).padStart(4, '0')}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 text-center relative z-10">
                        <button className="text-[10px] uppercase font-bold text-white/40 hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto">
                            Ver extracto completo <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </>
            )}
        </section>
    )
}
