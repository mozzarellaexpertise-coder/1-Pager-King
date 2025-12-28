import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// No need for 'createServerClient' or 'ssr' package here
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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