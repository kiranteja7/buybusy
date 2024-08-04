import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { query, collection, where, getDocs, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseInit";

let user = null;

export const fetchCartAsync = createAsyncThunk('/cart/fetchCart', async(userUid)=>{
    user = userUid;
    const q = query(collection(db, "cart"), where("userId", "==", userUid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
})

export const addToCart = createAsyncThunk('/add/cart', async(item)=>{
    if(!user) return;
    const userCartRef = doc(db, "cart", user);
    const userCartSnap = await getDoc(userCartRef);

    if(userCartSnap.exists()){
        const userCart = userCartSnap.data();
        const existingProductIndex = userCart.orders.findIndex(order => order.id === item.id);

        if (existingProductIndex !== -1) {
            // Product exists in cart, increase quantity
            userCart.orders[existingProductIndex].qty += 1;
           return  await updateDoc(userCartRef, { orders: userCart.orders});
        } else {
            // Product does not exist in cart, add new product
            const updatedOrders = [...userCart.orders, { ...item, qty: 1}];
           return await updateDoc(userCartRef, { orders: updatedOrders });
        }
    }else {
        // User cart does not exist, create a new cart document
         return await setDoc(userCartRef, {
            userId: user,
            orders: [{ ...item, qty: 1 }]
        });
    }
})

export const incProdCountAsync = createAsyncThunk('/cart/increase', async(prod)=>{

        if(!user) return
        const userCartRef = doc(db, "cart", user);
        const userCartSnap = await getDoc(userCartRef);
      
        if (userCartSnap.exists()) {
          const userCart = userCartSnap.data();
          const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);
      
          if (existingProductIndex !== -1) {
            // Product exists in cart, increase quantity
            userCart.orders[existingProductIndex].qty += 1;
             await updateDoc(userCartRef, { orders: userCart.orders });
          }
        }
         const updatedSnap= await getDoc(userCartRef);
         return updatedSnap.data().orders;
});

   // DECREASING THE PRODUCT QUANTITY BY CLICKING ON MINUS ICON ON THE CART    
export  const decProdCountasync = createAsyncThunk('/cart/decrease', async (prod) => {
  
    if(!user) return;
    const userCartRef = doc(db, "cart", user);
    const userCartSnap = await getDoc(userCartRef);
  
    if (userCartSnap.exists()) {
      const userCart = userCartSnap.data();
      const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);
  
      if (existingProductIndex !== -1 && userCart.orders[existingProductIndex].qty > 1) {
        // Product exists in cart, decrease quantity if greater than 1
        userCart.orders[existingProductIndex].qty -= 1;
         await updateDoc(userCartRef, { orders: userCart.orders });
      }
    }
    const updatedSnap= await getDoc(userCartRef);
     return updatedSnap.data().orders;
}) 

export const removeCartAsync = createAsyncThunk('/cart/remove', async(prod) =>{

    if(!user) return;
    const userCartRef = doc(db, "cart", user);
    const userCartSnap = await getDoc(userCartRef);
  
    if (userCartSnap.exists()) {
      const userCart = userCartSnap.data();
      const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);

      if (existingProductIndex !== -1){
         userCart.orders.splice(existingProductIndex, 1);
          await updateDoc(userCartRef, { orders: userCart.orders });
          return userCart.orders;
      }
    }

})

const INITIAL_STATE = {
    cart : [],
};

const cartSlice = createSlice({
    name : "cart",
    initialState : INITIAL_STATE,
    reducers : {
         emptyCart : (state) =>{
            state.cart = [];
         }
    },

    extraReducers : (builder) =>{
        builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
            state.cart = action.payload.flatMap((cartItem) => cartItem.orders);  // Assign directly instead of pushing
        });
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.cart = action.payload; // Update cart state with new orders
        });
        builder.addCase(incProdCountAsync.fulfilled, (state, action)=>{
           state.cart = action.payload //Update cart state with increased quantity
        })
        builder.addCase(decProdCountasync.fulfilled, (state, action)=>{
            state.cart = action.payload; //Update cart state with decreased quantity
        })
        builder.addCase(removeCartAsync.fulfilled, (state, action)=>{
             state.cart = action.payload; //Update cart state with removing product
        })
    }
})


export const cartReducer = cartSlice.reducer;

export const {emptyCart} = cartSlice.actions;

export const cartSelector = (state) => state.cartReducer.cart;