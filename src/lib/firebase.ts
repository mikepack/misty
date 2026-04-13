import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

let app: FirebaseApp | null = null;
let db: Database | null = null;

function getDbUrl(): string {
  const url = process.env.NEXT_PUBLIC_FIREBASE_DB_URL;
  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_DB_URL is not set. ' +
      'Set it in .env.local or as a Vercel environment variable.'
    );
  }
  return url;
}

export function getDbPrefix(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_DB_PREFIX || '';
}

export function getFirebaseDb(): Database {
  if (db) return db;

  if (getApps().length === 0) {
    app = initializeApp({ databaseURL: getDbUrl() });
  } else {
    app = getApps()[0];
  }

  db = getDatabase(app);
  return db;
}
