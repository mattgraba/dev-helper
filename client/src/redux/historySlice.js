import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Optional: hardcoded user ID for now
const USER_ID = 'test-user-1';

// Async thunk to fetch history from backend
export const fetchHistory = createAsyncThunk('history/fetchHistory', async () => {
  const res = await fetch(`http://localhost:3001/history?userId=${USER_ID}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
});

const historySlice = createSlice({
  name: 'history',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default historySlice.reducer;
