import { json } from '@sveltejs/kit';
import firebaseAdmin from '$lib/server/firebaseAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  try {
    const { title, body } = await request.json();
    if (!title || !body) {
      return json({ error: 'Missing title or body' }, { status: 400 });
    }

    const { data: devices, error } = await supabaseAdmin
      .from('devices')
      .select('token');

    if (error) return json({ error: 'Failed to fetch devices' }, { status: 500 });
    if (!devices || devices.length === 0) return json({ message: 'No devices registered' });

    const tokens = devices.map(d => d.token);

    // ✅ TS workaround: cast messaging to any
    const messaging = firebaseAdmin.messaging() as any;

    const response = await messaging.sendMulticast({
      tokens,
      notification: { title, body },
    });

    return json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err) {
    console.error('Error sending broadcast:', err);
    return json({ error: 'Failed to send broadcast notification' }, { status: 500 });
  }
}
