import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SelectionState } from '../types';

const initialState: SelectionState = {
  selectedFromId: undefined,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedFrom(state, action: PayloadAction<string | undefined>) {
      state.selectedFromId = action.payload;
    },
    clearSelected(state) {
      state.selectedFromId = undefined;
    },
  },
});

export const { setSelectedFrom, clearSelected } = selectionSlice.actions;
export default selectionSlice.reducer;