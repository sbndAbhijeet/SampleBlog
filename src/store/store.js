import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './authSlice'

const store = configureStore({
    reducer: {
        AuthReducer
    }
})

export default store;