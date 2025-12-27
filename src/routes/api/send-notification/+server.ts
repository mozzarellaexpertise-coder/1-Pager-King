import { json } from '@sveltejs/kit';
import { firebaseAdmin } from '$lib/server/firebaseAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  try {
    const { token, title, body } = await request.json();

    if (!token || !title || !body) {
      return json({ error: 'Missing token, title, or body' }, { status: 400 });
    }

    // 1. Prepare the message for ONE device
    const message = {
      token: token,
      notification: { title, body }
    };

    // 2. Send via Firebase
    const response = await firebaseAdmin.messaging().send(message);
    console.log('Successfully sent message:', response);

    // 3. Optional: Log to Supabase (Wrapped in try/catch so it doesn't kill the response)
    try {
      await supabaseAdmin
        .from('notifications') 
        .insert([{ token, title, body }]);
    } catch (dbErr) {
      console.warn('Supabase logging failed, but notification was sent:', dbErr);
    }

    return json({ success: true, messageId: response });
  } catch (err: any) {
    console.error('FCM Error:', err);
    return json({ 
      success: false, 
      error: err.message || 'Failed to send notification' 
    }, { status: 500 });
  }
}