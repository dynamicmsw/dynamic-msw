import {
  type Store,
  selectOpenPageURL,
  dashboardActions,
  configureScenario,
} from '@dynamic-msw/core';

export function subscribeToOpenPageURLChanges(store: Store) {
  return store.subscribe(() => {
    const openPageURL = selectOpenPageURL(store.getState());
    if (openPageURL) {
      store.dispatch(dashboardActions.setOpenPageURL(null));
      window.location.href = getURL(openPageURL)?.href || openPageURL;
    }
  });
}

function getURL(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    try {
      return new URL(window.location.origin + url);
    } catch {
      return null;
    }
  }
}
