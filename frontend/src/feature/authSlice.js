import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/auth/user`, { withCredentials: true });
        console.log("Profile", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        status: 'idle',
    },
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
