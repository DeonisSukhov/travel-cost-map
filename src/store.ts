import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import selectionReducer from './slices/selectionSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;