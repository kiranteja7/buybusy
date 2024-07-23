import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import data from './products.json';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseInit";
import { toast } from "react-toastify";
import { addDoc, collection, getDoc, setDoc , doc, updateDoc, query, where, getDocs} from "firebase/firestore";
import { onAuthStateChanged, signOut } from 'firebase/auth';


const productContext = createContext();


const useValue = () =>{
    const value = useContext(productContext);
    return value;
}


const CustomProductProvider = ({children}) => {

    //INPUT FOR SEARCH RESULT
    const [input, setInput] = useState("");

    //STORING THE PRODUCT DATA ON FILTER
    const [productData, setProductData] = useState([]);
    
    //FOR THE PRICE FILTER BAR
    const [filterValue, setFilterValue] = useState(50000);

    //FOR THE CATEGORY FILTER 
    const [categoryFilter, setCategoryFilter] = useState("");

    //TOGGLE THE FILTER
    const [toggle, setToggle] = useState(true);

    //USER DATA
    const [user, setUser] = useState({email: "", password: "", name: ""});

    //STORING USER LOGGED IN OR NOT BY UID
    const [loggedIn, setLoggedIn] = useState("");

   //STORING THE CART WHICH WAS ADDED BY THE CURRENT USER
    const [cart, setCart] = useState([]);

    //SETTING THE CURRENT USER FOR RETRIEVAL OF ORDERS/ CART WHICH WAS ADDED/PLACED BY CURRENT USER
    const [currentUser, setCurrentUser] = useState("");

    //STORING THE ORDERS WHICH WAS PLACED BY THE CURRENT USER
    const [showOrders, setShowOrders] = useState([]);

    //ADDING A PRODUCT TO THE CART
    const addToCart = async(prod) =>{
        
        if (!currentUser) {
            toast.error("Please sign in to add to cart");
            return;
        }
    
        const userCartRef = doc(db, "cart", currentUser);
        const userCartSnap = await getDoc(userCartRef);
    
        if (userCartSnap.exists()) {
            // User cart exists, update the orders array
            const userCart = userCartSnap.data();
            const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);
    
            if (existingProductIndex !== -1) {
                // Product exists in cart, increase quantity
                userCart.orders[existingProductIndex].qty += 1;
                await updateDoc(userCartRef, { orders: userCart.orders});
                toast.success("Item quantity is increased successfully!");
            } else {
                // Product does not exist in cart, add new product
                const updatedOrders = [...userCart.orders, { ...prod, qty: 1}];
                await updateDoc(userCartRef, { orders: updatedOrders });
                toast.success("Item added to the cart successfully!");
            }
        } else {
            // User cart does not exist, create a new cart document
            await setDoc(userCartRef, {
                userId: currentUser,
                orders: [{ ...prod, qty: 1 }]
            });
            toast.success("Item added to the cart successfully!");
        }
        await fetchUserCart(currentUser);
    }

    // INCREASE THE PRODUCT QUANTITY BY CLICKING ON PLUS ICON ON THE CART
    const incProdCount = async (prod) => {
        if (!currentUser) return;
      
        const userCartRef = doc(db, "cart", currentUser);
        const userCartSnap = await getDoc(userCartRef);
      
        if (userCartSnap.exists()) {
          const userCart = userCartSnap.data();
          const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);
      
          if (existingProductIndex !== -1) {
            // Product exists in cart, increase quantity
            userCart.orders[existingProductIndex].qty += 1;
            toast.success("Item quantity is increased");
            await updateDoc(userCartRef, { orders: userCart.orders });
      
            // Update local cart state
            setCart(prevCart => {
              const updatedCart = [...prevCart];
              const cartIndex = updatedCart.findIndex(cartItem => cartItem.userId === currentUser);
              if (cartIndex !== -1) {
                updatedCart[cartIndex].orders = userCart.orders;
              }
              return updatedCart;
            });
          }
        }
      };

       // DECREASING THE PRODUCT QUANTITY BY CLICKING ON MINUS ICON ON THE CART    
      const decProdCount = async (prod) => {
        if (!currentUser) return;
      
        const userCartRef = doc(db, "cart", currentUser);
        const userCartSnap = await getDoc(userCartRef);
      
        if (userCartSnap.exists()) {
          const userCart = userCartSnap.data();
          const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);
      
          if (existingProductIndex !== -1 && userCart.orders[existingProductIndex].qty > 1) {
            // Product exists in cart, decrease quantity if greater than 1
            userCart.orders[existingProductIndex].qty -= 1;
            toast.success("Item quantity is decreased");
            await updateDoc(userCartRef, { orders: userCart.orders });
      
            // Update local cart state
            setCart(prevCart => {
              const updatedCart = [...prevCart];
              const cartIndex = updatedCart.findIndex(cartItem => cartItem.userId === currentUser);
              if (cartIndex !== -1) {
                updatedCart[cartIndex].orders = userCart.orders;
              }
              return updatedCart;
            });
          }
        }
    }

     // REMOVING THE PRODUCT BY CLICKING ON "REMOVE FROM THE CART" BUTTON ON THE CART 
    const removeCart = async(prod) =>{
        const userCartRef = doc(db, "cart", currentUser);
        const userCartSnap = await getDoc(userCartRef);
      
        if (userCartSnap.exists()) {
          const userCart = userCartSnap.data();
          const existingProductIndex = userCart.orders.findIndex(order => order.id === prod.id);

          if (existingProductIndex !== -1){
             userCart.orders.splice(existingProductIndex, 1);
             toast.error("Item is removed successfully!");
             await updateDoc(userCartRef, { orders: userCart.orders });
          }

          setCart(prevCart => {
            const updatedCart = [...prevCart];
            const cartIndex = updatedCart.findIndex(cartItem => cartItem.userId === currentUser);
            if (cartIndex !== -1) {
              updatedCart[cartIndex].orders = userCart.orders;
            }
            return updatedCart;
          });
        }
    }

    // CHECKOUT PROCESS BY CLICKING ON PURCHASE BUTTON
    const checkout = async () => {
        toast.success("Thanks for purchasing our orders!");
        const userCartRef = doc(db, "cart", currentUser);
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
            userId: currentUser,
            orders: updatedOrders
          });

         // Update Firestore to clear the cart
         await setDoc(userCartRef, { ...userCart, orders: [] });
      
          // Update local state
          setCart([]);

          await fetchOrderCart(currentUser);
        }
      };
        
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
       await createUserWithEmailAndPassword(auth, user.email, user.password, user.name);
         toast.success("User Registered successfully");
        setUser({email: "", password: "", name: ""});
        } catch (error) {
            setUser({email: "", password: "", name: ""});
        if (error.code === 'auth/email-already-in-use') {
            toast.error("User Already Exists");
        }
     }
    }

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
        await signInWithEmailAndPassword(auth, user.email, user.password);
         setUser({email: "", password: ""});  
        toast.success("User Signed In successfully");
        } catch (error) {
            setUser({email: "", password: ""});
            if (error.code === 'auth/user-not-found') {
                toast.error("User not Found!");
            } 
        }
    };

    // BASE CASE RETREIVAL
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
          if (user) {
            setLoggedIn(true);
            setCurrentUser(user.uid);
            await fetchUserCart(user.uid);
            await fetchOrderCart(user.uid);
          } else {
            setLoggedIn(false);
            setCurrentUser(null);
            setCart([]);
            setShowOrders([]);
          }
        });
    
        return () => unsubscribe();
      }, []);


     // FETCHING THE ORDERS THAT WAS PLACED BY THE CURRENT USER/ LOGGED IN USER
      const fetchOrderCart = async (userUid) => {
        const q = query(collection(db, "orders"), where('userId', '==', userUid));
        const querySnapshot = await getDocs(q);
      
        if (querySnapshot.empty) {
          setShowOrders([]);
        } else {
          // Aggregate all orders into a single array
          const userOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          // Flatten the orders to show all items across multiple documents
          const allOrders = userOrders.flatMap(orderDoc => orderDoc.orders);
          setShowOrders(allOrders);
        }
      };

          // FETCHING THE CART BASED ON THE CURRENT USER/ LOGGED IN USER
      const fetchUserCart = async (userUid) => {
        const q = query(collection(db, "cart"), where("userId", "==", userUid));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
          setCart([]);
        } else {
          const userCart = querySnapshot.docs.map((doc) => (
            {
            id: doc.id,
            ...doc.data()
          }));
          setCart(userCart);
        }
      };
    
      //HANDLING LOGOUT BY CLICKING LOGOUT BUTTON
      const handleLogout = async () => {
        try {
          await signOut(auth);
          setLoggedIn(false);
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      };

      //HANDLING SEARCH RESULT BY SEARCHING A PRODUCT IN THE SEARCH ICON
    const renderDataOnSearch = (value) =>{
        setInput(value);
       if(input !== ''){
       const filteredData = data.filter((d)=> d.product.toLowerCase().includes(input.toLowerCase()));
       setProductData(filteredData);
       }
    }

     useEffect(()=>{
        const filteredData = data.filter((d)=> Number(d.price) >= Number(filterValue));
        setProductData(filteredData);
     }, [filterValue]);

     // FILTERING THE PRODUCTS BASED ON THE PRODUCT TAGS AND TOGGLING THE PRODUCTS BASED ON TOGGLE
     const filterFunctionality= (value) =>{
        toggle ? setToggle(false) : setToggle(true);
        if(toggle){
         setCategoryFilter(value);
        }else{
         setProductData(data);
        }
     }
     
     useEffect(()=> {
        const filteredData = data.filter((d)=> d.category === categoryFilter);
        setProductData(filteredData);
     }, [categoryFilter]);

     // FETCHING THE PRODUCTS ON MOUNT
     useEffect(()=>{
        setProductData(data);
    }, []);

    return (
        <productContext.Provider value={{input, 
        setInput, productData, renderDataOnSearch, filterValue, 
        setFilterValue, setCategoryFilter, filterFunctionality, user, setUser, handleSignIn, handleSignUp,
        loggedIn, addToCart, cart, incProdCount, decProdCount, handleLogout, removeCart, checkout, showOrders}}>
            {children}
        </productContext.Provider>
    )

  } 

export {productContext, useValue};
export default CustomProductProvider;