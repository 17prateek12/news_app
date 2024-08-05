import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice"
import bookmarkReducer from "../feature/bookmarkSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        bookmark: bookmarkReducer,
    },
});

export default store;
