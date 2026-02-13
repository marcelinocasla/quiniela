import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    // In a real app, get user from session/token
    // For now we will return all customers for demo purposes as we lack the auth context here easily without headers
    // But let's verify via a query param "email" to simulate secure access
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { data: agency } = await supabase.from('agencies').select('id').eq('owner_id', profile.id).single();
    if (!agency) return NextResponse.json({ customers: [] });

    const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .eq('agency_id', agency.id)
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ customers });
}

export async function POST(request: Request) {
    try {
        const { fullName, phoneNumber, userEmail } = await request.json();

        const { data: profile } = await supabase.from('profiles').select('id').eq('email', userEmail).single();
        const { data: agency } = await supabase.from('agencies').select('id').eq('owner_id', profile?.id).single();

        if (!agency) throw new Error("Agency not found");

        const { data, error } = await supabase
            .from('customers')
            .insert([{
                agency_id: agency.id,
                full_name: fullName,
                phone_number: phoneNumber
            }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, customer: data });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
