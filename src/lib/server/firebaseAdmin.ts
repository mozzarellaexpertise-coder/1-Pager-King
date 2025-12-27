import admin from "firebase-admin";

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!firebasePrivateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is not set");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(firebasePrivateKey)
    )
  });
}

export const firebaseAdmin = admin;