import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';
import { firebaseAdmin } from '$lib/server/firebaseAdmin';

export async function POST({ request }) {
  const { title, body } = await request.json();

  if (!title || !body) {
    return json({ error: 'Missing title or body' }, { status: 400 });
  }

  // 1️⃣ Fetch active device tokens
  const { data: devices, error } = await supabaseAdmin
    .from('devices')
    .select('fcm_token')
    .eq('active', true);

  if (error) {
    console.error(error);
    return json({ error: 'Failed to fetch devices' }, { status: 500 });
  }

  if (!devices || devices.length === 0) {
    return json({ message: 'No active devices' });
  }

  const tokens = devices.map(d => d.fcm_token);

  // 2️⃣ Send push
  const response = await firebaseAdmin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body
    }
  });

  return json({
    success: true,
    sent: response.successCount,
    failed: response.failureCount
  });
}