import { configureStore } from "@reduxjs/toolkit";
import { userSliceReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { orderReducer } from "./reducers/orderReducer";



export const store = configureStore({
    reducer: {
        userSliceReducer,
        cartReducer,
        orderReducer
    }
})