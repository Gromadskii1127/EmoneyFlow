import {
  store as developmentStore,
  loadStateFromStorage as developmentLoadStateStorage
} from './configureStore.development';

import {
  store as productStore,
  loadStateFromStorage as productLoadStateStorage
} from './configureStore.product';

export const store =
  process.env.NODE_ENV === 'production' ? productStore : developmentStore;

export const loadStateFromStorage =
  process.env.NODE_ENV === 'development'
    ? developmentLoadStateStorage
    : productLoadStateStorage;
