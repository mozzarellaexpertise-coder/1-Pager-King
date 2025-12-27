// src/lib/server/firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  const key = JSON.parse(process.env.FIREBASE_PRIVATE_KEY!);
  
  // Replace escaped newlines with real newlines
  key.private_key = key.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(key)
  });
}

export default admin;