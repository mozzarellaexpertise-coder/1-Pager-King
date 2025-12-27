// src/lib/server/firebaseAdmin.ts
import admin from "firebase-admin";

// Only initialize if no apps exist (prevents duplicate initialization)
if (!admin.apps.length) {
  // Parse the Firebase private key JSON from environment variable
  const key = JSON.parse(process.env.FIREBASE_PRIVATE_KEY!);

  // Replace escaped newline characters with real newlines
  key.private_key = key.private_key.replace(/\\n/g, "\n");

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(key)
  });
}

// Named export for consistency with your +server.ts
export const firebaseAdmin = admin;