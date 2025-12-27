import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  const { fcm_token, platform } = await request.json();

  if (!fcm_token || !platform) {
    return json({ error: 'Missing fields' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('devices')
    .insert({
      fcm_token,
      platform
    });

  if (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }

  return json({ success: true });
}