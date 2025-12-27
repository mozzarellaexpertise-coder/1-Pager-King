import { json } from '@sveltejs/kit';
import { firebaseAdmin } from '$lib/server/firebaseAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  try {
    const { title, body } = await request.json();

    // 1. Fetch the correct column name from Supabase
    const { data: devices, error } = await supabaseAdmin
      .from('devices')
      .select('fcm_token'); // Match your registration field name

    if (error) return json({ error: 'DB Fetch Failed' }, { status: 500 });
    
    // 2. Safety check: Don't call Firebase if no tokens exist
    const tokens = devices?.map(d => d.fcm_token).filter(t => !!t) || [];
    if (tokens.length === 0) {
      return json({ success: false, message: 'No devices found' }, { status: 200 });
    }

    const messaging = firebaseAdmin.messaging();

    // 3. Use the NEW 2025 Method: sendEachForMulticast
    const response = await messaging.sendEachForMulticast({
      tokens: tokens,
      notification: { title, body },
    });

    return json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err: any) {
    console.error('FCM Error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}