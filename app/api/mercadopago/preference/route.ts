import { NextResponse } from 'next/server';
import MercadoPagoConfig, { Preference } from 'mercadopago';

// Initialize MP Client (Token from Environment)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
    try {
        const { title, quantity, unit_price, userEmail } = await request.json();

        // In production: Validate user and amount logic against DB to prevent frontend manipulation

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        title: title,
                        quantity: quantity,
                        unit_price: unit_price,
                        currency_id: 'ARS',
                    }
                ],
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/bet/success`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/bet/failure`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/bet/pending`,
                },
                auto_return: 'approved',
            } as any
        });


        return NextResponse.json({ id: result.id, init_point: result.init_point });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
