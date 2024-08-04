import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebaseInit";


export const handleUsersignInAsync = createAsyncThunk("/user/signIn", async(payload)=>{
    return await signInWithEmailAndPassword(auth, payload.email, payload.password);
});


export const handleUsersSignUpAsync = createAsyncThunk("/user/signUp", async(payload)=>{
    return await createUserWithEmailAndPassword(auth, payload.email, payload.password, payload.name);
});

export const handleUserSignOut = createAsyncThunk("/user/signOut", async() =>{
    return await signOut(auth);
});

const initialState = {
    user : null,
    loggedIn : false
}

const userSlice = createSlice({
    name: "user",
    initialState : initialState,
    reducers :{
        clearUser : (state)=>{
            state.user = null;
            state.loggedIn = false
        },

        setUser : (state, action) =>{
            state.user = action.payload.userUid;
            state.loggedIn = action.payload.loggedIn;
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(handleUsersignInAsync.fulfilled, (state, action)=>{
            state.user = action.payload.userUid
            state.loggedIn = true;
        })
        .addCase(handleUsersSignUpAsync.fulfilled, (state, action)=>{
            state.user = action.payload.userUid
            state.loggedIn = true;
        })
        .addCase(handleUserSignOut.fulfilled, (state)=>{
            state.user = null;
            state.loggedIn = false;
        })
    }
})

export const {clearUser, setUser} = userSlice.actions;
export const userSliceReducer = userSlice.reducer; 

export const isLoggedIn = (state) => state.userSliceReducer.loggedIn;
export const userId = (state) => state.userSliceReducer.user;