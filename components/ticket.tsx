import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Check, Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TicketProps {
    bet: {
        id: string
        lottery: string
        number: string
        location: string
        amount: number
        possiblePrize: number
        date: Date
    }
    onNewBet: () => void
}

export function Ticket({ bet, onNewBet }: TicketProps) {
    return (
        <div className="mx-auto max-w-sm">
            <Card className="border-neutral-800 bg-neutral-900 text-white shadow-2xl">
                <CardHeader className="text-center border-b border-neutral-800 pb-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <CardTitle className="text-xl text-green-500">¡Jugada Confirmada!</CardTitle>
                    <p className="text-sm text-neutral-400">Comprobante Digital</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-wider text-neutral-500">ID Jugada</p>
                        <p className="font-mono text-lg font-bold tracking-widest">{bet.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500">Fecha</p>
                            <p className="text-sm font-medium">{format(bet.date, "dd/MM/yy HH:mm", { locale: es })}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-neutral-500">Lotería</p>
                            <p className="text-sm font-medium">{bet.lottery}</p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-neutral-950 p-4 text-center border border-neutral-800">
                        <p className="text-xs uppercase tracking-wider text-neutral-500">Número Apostado</p>
                        <p className="text-4xl font-bold text-white tracking-[0.2em] my-1">{bet.number}</p>
                        <p className="text-xs text-orange-500 font-medium">{bet.location}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-dashed border-neutral-800 pt-4">
                        <div className="text-left">
                            <p className="text-xs text-neutral-500">Importe</p>
                            <p className="text-lg font-bold">${bet.amount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-500">Posible Premio</p>
                            <p className="text-lg font-bold text-orange-500">${bet.possiblePrize.toLocaleString()}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t border-neutral-800 bg-neutral-950 p-6">
                    <Button variant="outline" className="w-full border-neutral-800 hover:bg-neutral-900 text-neutral-300">
                        <Share2 className="mr-2 h-4 w-4" />
                        Compartir (WhatsApp)
                    </Button>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={onNewBet}>
                        Nueva Jugada
                    </Button>
                </CardFooter>
            </Card>
            <p className="mt-4 text-center text-xs text-neutral-600">
                Quiniela Digital Argentina - Copia Agenciero
            </p>
        </div>
    )
}
