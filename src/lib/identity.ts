export const ADJECTIVES = [
  'Swift', 'Calm', 'Bold', 'Shy', 'Wise',
  'Wild', 'Gentle', 'Fierce', 'Lucky', 'Quiet',
  'Brave', 'Sly', 'Keen', 'Jolly', 'Plucky',
  'Nimble', 'Mighty', 'Witty', 'Noble', 'Crafty',
];

export interface UserIdentity {
  id: string;
  adjective: string;
  preferredAnimal?: string;
}

const STORAGE_KEY = 'hill-chart-identity-v3';

export function getIdentity(): UserIdentity {
  if (typeof window === 'undefined') {
    return {
      id: crypto.randomUUID(),
      adjective: ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)],
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }

  const identity: UserIdentity = {
    id: crypto.randomUUID(),
    adjective: ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  return identity;
}

export function setPreferredAnimal(animal: string): void {
  if (typeof window === 'undefined') return;
  const identity = getIdentity();
  identity.preferredAnimal = animal;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}
