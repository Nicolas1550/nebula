/** Reglas puras de INFERNO. Sin temporizadores ni dependencias del navegador. */
export type MissionStatus = 'ready' | 'playing' | 'won' | 'lost';
export type MissionState = {
  status: MissionStatus;
  time: number;
  energy: number;
  hull: number;
  score: number;
  collected: number;
  combo: number;
};
export const ENERGY_PER_CORE = 20;
export const MISSION_SECONDS = 60;
export function createMission(): MissionState {
  return { status: 'ready', time: MISSION_SECONDS, energy: 0, hull: 100, score: 0, collected: 0, combo: 0 };
}
export function startMission(): MissionState { return { ...createMission(), status: 'playing' }; }
export function collectCore(state: MissionState): MissionState {
  if (state.status !== 'playing') return state;
  const energy = Math.min(100, state.energy + ENERGY_PER_CORE);
  const combo = Math.min(5, state.combo + 1);
  return {
    ...state,
    energy,
    collected: state.collected + 1,
    combo,
    score: state.score + 200 + 40 * (combo - 1),
    // Ganar es inmediato al recolectar el último núcleo, incluso si quedaba 1 segundo.
    status: energy >= 100 ? 'won' : 'playing',
  };
}
export function damageShip(state: MissionState, damage = 25): MissionState {
  if (state.status !== 'playing') return state;
  const hull = Math.max(0, state.hull - damage);
  return { ...state, hull, combo: 0, status: hull === 0 ? 'lost' : 'playing' };
}
export function tickMission(state: MissionState, seconds: number): MissionState {
  if (state.status !== 'playing') return state;
  const time = Math.max(0, state.time - Math.max(0, seconds));
  return { ...state, time, status: time === 0 ? 'lost' : 'playing' };
}
