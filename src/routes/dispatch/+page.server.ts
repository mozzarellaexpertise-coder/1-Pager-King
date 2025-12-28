import { fail } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'; 
import type { PageServerLoad, Actions } from './$types';

// Use the Service Role key to bypass RLS for the Dispatcher
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const load: PageServerLoad = async () => {
  // Fetch recipients from your profiles table
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .order('display_name', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error.message);
    return { profiles: [] };
  }

  return { profiles };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const to_user = formData.get('to_user') as string;
    const message = formData.get('message') as string;

    if (!to_user || !message) {
      return fail(400, { error: 'Recipient and message are required' });
    }

    const { error } = await supabase.from('incoming_messages').insert({
      to_user,
      message,
      delivered: false
    });

    if (error) {
      console.error('Error sending message:', error.message);
      return fail(500, { error: 'Failed to send pager message' });
    }

    return { success: true };
  }
};