import { json } from '@sveltejs/kit';
import { firebaseAdmin } from '$lib/server/firebaseAdmin';

export async function POST({ request }) {
  // Example: send a Firebase message
  const data = await request.json();

  await firebaseAdmin.messaging().send({
    token: data.token,
    notification: {
      title: data.title,
      body: data.body
    }
  });

  return json({ success: true });
}