import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { query, collection, where, getDocs, getDoc, setDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../firebaseInit";

let user = null;

// Fetch Order Cart Thunk
export const fetchOrderCart = createAsyncThunk('/orders/fetch', async (userUid) => {
  user = userUid;
  const q = query(collection(db, "orders"), where('userId', '==', userUid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  } else {
    // Aggregate all orders into a single array
    const userOrders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Flatten the orders to show all items across multiple documents
    return userOrders.flatMap(orderDoc => orderDoc.orders);
  }
});

// Checkout Cart Thunk
export const checkoutAsync = createAsyncThunk('/orders/checkout', async () => {
  if (!user) return [];
  const userCartRef = doc(db, "cart", user);
  const userCartSnap = await getDoc(userCartRef);

  if (userCartSnap.exists()) {
    const userCart = userCartSnap.data();

    const updatedOrders = userCart.orders.map(order => ({
      ...order,
      purchase: true,
      purchasedOn: new Date().toDateString()
    }));

    // Add updated orders to the 'orders' collection
    const userOrdersRef = collection(db, "orders");
    await addDoc(userOrdersRef, {
      userId: user,
      orders: updatedOrders
    });

    // Update Firestore to clear the cart
    await setDoc(userCartRef, { ...userCart, orders: [] });

    return updatedOrders; // Return the updated orders to update state
  }
});

// Initial State
const INITIAL_STATE = {
  orders: []
}

// Order Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState: INITIAL_STATE,
  reducers: {
    setOrdersEmpty: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderCart.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
    builder.addCase(checkoutAsync.fulfilled, (state, action) => {
      state.orders = [...state.orders, ...action.payload];
    });
  }
})

// Export Reducer
export const orderReducer = orderSlice.reducer;

// Export Actions
export const { setOrdersEmpty } = orderSlice.actions;

// Export Selector
export const ordersSelector = (state) => state.orderReducer.orders;