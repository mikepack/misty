import { ref, get } from 'firebase/database';
import { getFirebaseDb, getDbPrefix } from './firebase';

function dbPath(path: string): string {
  const prefix = getDbPrefix();
  return prefix ? `${prefix}/${path}` : path;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string): Promise<boolean> {
  const db = getFirebaseDb();
  const snapshot = await get(ref(db, dbPath('password')));
  const storedHash = snapshot.val();
  if (!storedHash) return true; // No password set = no gate
  const inputHash = await sha256(password);
  return inputHash === storedHash;
}

const SESSION_KEY = 'hill-chart-authed';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SESSION_KEY) === 'true';
}

export function setAuthenticated(): void {
  localStorage.setItem(SESSION_KEY, 'true');
}
