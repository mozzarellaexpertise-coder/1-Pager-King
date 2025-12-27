import { json } from '@sveltejs/kit';
import { firebaseAdmin } from '$lib/server/firebaseAdmin';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export async function POST({ request }) {
  try {
    // 1. Extract and Validate Input
    const { title, body } = await request.json();
    
    if (!title || !body) {
      return json({ success: false, error: 'Missing title or body' }, { status: 400 });
    }

    // 2. Fetch tokens from Supabase
    // Ensure 'fcm_token' matches your Supabase column name exactly!
    const { data: devices, error: dbError } = await supabaseAdmin
      .from('devices')
      .select('fcm_token');

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return json({ success: false, error: 'Database fetch failed' }, { status: 500 });
    }
    
    // 3. Filter and clean the tokens array
    const tokens = devices?.map(d => d.fcm_token).filter(t => !!t) || [];

    if (tokens.length === 0) {
      return json({ 
        success: false, 
        message: 'No registered devices found in Supabase' 
      }, { status: 200 }); // Returning 200 so Flutter doesn't think the server crashed
    }

    // 4. Initialize Messaging and Cast to 'any' for TS flexibility if needed
    const messaging = firebaseAdmin.messaging();

    // 5. Send using the 2025 sendEachForMulticast method
    const response = await messaging.sendEachForMulticast({
      tokens: tokens,
      notification: { 
        title: title, 
        body: body 
      },
    });

    // 6. Return Success Data
    return json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
      responses: response.responses.length // Total attempts
    });

  } catch (err: any) {
    // This catches Firebase auth errors, network timeouts, etc.
    console.error('FCM Broadcast Crash:', err.message);
    
    return json({ 
      success: false, 
      error: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}