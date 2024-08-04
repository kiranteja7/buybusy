import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebaseInit"
import { clearUser, setUser } from "./reducers/userReducer";
import { store } from "./store";
import { emptyCart, fetchCartAsync } from "./reducers/cartReducer";
import { fetchOrderCart, setOrdersEmpty } from "./reducers/orderReducer";


export const InitializeAuth = () =>{

    onAuthStateChanged(auth, (user)=>{
        if(user){
            const userUid = user.uid;
            store.dispatch(setUser({userUid, loggedIn: true}))
            store.dispatch(fetchCartAsync(userUid));
            store.dispatch(fetchOrderCart(userUid));
        }else{
            clearUser();
            emptyCart();
            setOrdersEmpty();
        }
    })
}