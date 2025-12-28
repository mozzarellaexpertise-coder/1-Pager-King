import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// No need for 'createServerClient' or 'ssr' package here
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const { error } = await supabase.from('incoming_messages').insert({
            to_user: formData.get('to_user'),
            message: formData.get('message'),
        });
        return { success: !error };
    }
};