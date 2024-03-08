const KEY = 'dynamic-msw';

export function loadState() {
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch {
    // Ignore
  }
}

export async function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
  } catch {
    // Ignore
  }
}

export async function removeState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore
  }
}
