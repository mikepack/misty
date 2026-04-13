'use client';

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, onDisconnect, set, remove, get } from 'firebase/database';
import { getFirebaseDb, getDbPrefix } from './firebase';
import { getIdentity, setPreferredAnimal, ADJECTIVES } from './identity';
import { ANIMAL_NAMES, ANIMAL_COLORS } from './animalAvatars';

function dbPath(path: string): string {
  const prefix = getDbPrefix();
  return prefix ? `${prefix}/${path}` : path;
}

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
  animal: string;
  lastSeen: number;
}

export function usePresence(hillId: string | null): PresenceUser[] {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const assignedAnimalRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hillId) return;

    const identity = getIdentity();
    const db = getFirebaseDb();
    const userRef = ref(db, dbPath(`presence/${hillId}/${identity.id}`));
    const presenceRef = ref(db, dbPath(`presence/${hillId}`));
    let heartbeat: ReturnType<typeof setInterval>;

    // Read current presence, pick an unused animal, then join
    get(presenceRef).then((snapshot) => {
      const data = snapshot.val() || {};
      const now = Date.now();
      const staleThreshold = 60000;

      // Collect animals and adjectives already taken by active users
      const takenAnimals = new Set<string>();
      const takenAdjectives = new Set<string>();
      for (const [id, val] of Object.entries(data) as [string, any][]) {
        if (id !== identity.id && now - val.lastSeen < staleThreshold) {
          takenAnimals.add(val.animal);
          if (val.name) {
            const adj = val.name.split(' ')[0];
            if (adj) takenAdjectives.add(adj);
          }
        }
      }

      // Prefer stored animal, fall back to first available
      const preferred = identity.preferredAnimal;
      const animal = (preferred && !takenAnimals.has(preferred))
        ? preferred
        : ANIMAL_NAMES.find((a) => !takenAnimals.has(a)) || ANIMAL_NAMES[0];
      const adjective = !takenAdjectives.has(identity.adjective)
        ? identity.adjective
        : ADJECTIVES.find((a) => !takenAdjectives.has(a)) || identity.adjective;
      const color = ANIMAL_COLORS[animal] || '#656d76';
      assignedAnimalRef.current = animal;
      setPreferredAnimal(animal);

      const presenceData = {
        name: `${adjective} ${animal}`,
        color,
        animal,
        lastSeen: Date.now(),
      };

      set(userRef, presenceData);
      onDisconnect(userRef).remove();

      heartbeat = setInterval(() => {
        set(userRef, { ...presenceData, lastSeen: Date.now() });
      }, 30000);
    });

    // Listen to all presence
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setUsers([]);
        return;
      }
      const now = Date.now();
      const staleThreshold = 60000;
      const present: PresenceUser[] = Object.entries(data)
        .map(([id, val]: [string, any]) => ({
          id,
          name: val.name,
          color: val.color,
          animal: val.animal || 'Fox',
          lastSeen: val.lastSeen,
        }))
        .filter((u) => now - u.lastSeen < staleThreshold);
      setUsers(present);
    });

    return () => {
      if (heartbeat) clearInterval(heartbeat);
      remove(userRef);
      unsubscribe();
    };
  }, [hillId]);

  return users;
}

export function useAllPresence(): Record<string, PresenceUser[]> {
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceUser[]>>({});

  useEffect(() => {
    const db = getFirebaseDb();
    const presenceRef = ref(db, dbPath('presence'));

    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setPresenceMap({});
        return;
      }
      const now = Date.now();
      const staleThreshold = 60000;
      const map: Record<string, PresenceUser[]> = {};
      for (const [hillId, users] of Object.entries(data) as [string, any][]) {
        const present = Object.entries(users)
          .map(([id, val]: [string, any]) => ({
            id,
            name: val.name,
            color: val.color,
            animal: val.animal || 'Fox',
            lastSeen: val.lastSeen,
          }))
          .filter((u) => now - u.lastSeen < staleThreshold);
        if (present.length > 0) map[hillId] = present;
      }
      setPresenceMap(map);
    });

    return () => unsubscribe();
  }, []);

  return presenceMap;
}
