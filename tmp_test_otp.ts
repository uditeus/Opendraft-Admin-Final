import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    console.log('Testing signInWithOtp existence check...');
    const email = 'nonexistent@example.com';
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false
            }
        });
        console.log('Error:', error);
    } catch (e) {
        console.log('Exception:', e);
    }
}

test();
