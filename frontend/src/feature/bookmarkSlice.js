import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch bookmarks from the server
export const fetchBookmarks = createAsyncThunk(
    'bookmarks/fetchBookmarks',
    async (userId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/bookmark/${userId}`);
        return response.data;  // Ensure this returns an array of news objects
      } catch (error) {
        if (!error.response) {
          throw error;
        }
        return rejectWithValue(error.response.data);
      }
    }
  );

// Add bookmark to the server
export const addBookmarkToServer = createAsyncThunk(
    'bookmark/addBookmarkToServer',
    async ({ userId, news }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_EXPRESS_SERVER}/bookmark`,
                { userId, news },
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding bookmark:', error);
            return rejectWithValue(error.response ? error.response.data : { message: error.message });
        }
    }
);

// Remove bookmark from the server
export const removeBookmarkFromServer = createAsyncThunk(
    'bookmark/removeBookmarkFromServer',
    async ({ userId, newsId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_EXPRESS_SERVER}/bookmark`, { data: { userId, newsId } });
            return response.data.news;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: {
    bookmark: [], // Initialize as an empty array
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmark = action.payload;
      })
      .addCase(addBookmarkToServer.fulfilled, (state, action) => {
        // Optionally update state directly if needed
        state.bookmark = action.payload;
      })
      .addCase(removeBookmarkFromServer.fulfilled, (state, action) => {
        // Optionally update state directly if needed
        state.bookmark = action.payload;
      });
  },
});

export default bookmarkSlice.reducer;
