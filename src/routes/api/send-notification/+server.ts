import { json } from '@sveltejs/kit';
import firebaseAdmin from '$lib/server/firebaseAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  try {
    // Get the request body (expects { token, title, body })
    const { token, title, body } = await request.json();

    if (!token || !title || !body) {
      return json({ error: 'Missing token, title, or body' }, { status: 400 });
    }

    // Send push notification via Firebase
    const message = {
      token,
      notification: {
        title,
        body
      }
    };

    await firebaseAdmin.messaging().send(message);

    // Optional: log notification in Supabase
    await supabaseAdmin
      .from('notifications')
      .insert([{ token, title, body, created_at: new Date().toISOString() }]);

    return json({ success: true });
  } catch (err) {
    console.error('Error sending notification:', err);
    return json({ error: 'Failed to send notification' }, { status: 500 });
  }
}