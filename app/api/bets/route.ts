import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock function to validate Firebase token serverside (In production use firebase-admin)
const validateUser = async (token: string) => {
    // For MVP/Demo without service account json, we'll trust the client passing the UID/Email for now
    // BUT in real implementation: verifyIdToken(token)
    return true;
}

export async function POST(request: Request) {
    try {
        const {
            lottery,
            number,
            location,
            amount,
            origin,
            paymentMethod,
            userEmail
        } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get Agency/Profile ID from email
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', userEmail).single();
        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        const profileId = profile.id;

        // 2. Get Agency ID (assuming 1 agency per owner for now)
        const { data: agency } = await supabase.from('agencies').select('id').eq('owner_id', profileId).single();
        // If no agency exists yet, create a default one for the user
        let agencyId = agency?.id;
        if (!agencyId) {
            const { data: newAgency } = await supabase.from('agencies').insert([{ owner_id: profileId, name: 'Mi Agencia' }]).select().single();
            agencyId = newAgency.id;
        }

        // 3. Calculate Prize
        const locations = [
            { id: "cabeza", multiplier: 70 },
            { id: "5", multiplier: 14 },
            { id: "10", multiplier: 7 },
            { id: "20", multiplier: 3.5 },
        ];
        const multiplier = locations.find(l => l.id === location)?.multiplier || 0;
        const possiblePrize = amount * multiplier;

        // 4. Insert Bet
        const { data: bet, error } = await supabase
            .from('bets')
            .insert([
                {
                    agency_id: agencyId,
                    profile_id: profileId, // User who placed/loaded the bet
                    lottery,
                    number,
                    location,
                    amount,
                    possible_prize: possiblePrize,
                    origin,
                    payment_method: paymentMethod,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, bet });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
