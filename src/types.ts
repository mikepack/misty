export interface Scope {
  id: string;
  name: string;
  position: number; // 0 (start, left) → 0.5 (top of hill) → 1 (done, right)
}
