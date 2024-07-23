

// export const saveCartToFirestore = async (cart, id) => {
//     const userCartRef = doc(db, 'cart', id);
//     await setDoc(userCartRef, { cart });
//   };
  
//   // Function to retrieve cart from Firestore
// export  const getCartFromFirestore = async (id) => {
//     const userCartRef = doc(db, 'cart', id);
//     const cartSnapshot = await getDoc(userCartRef);
  
//     if (cartSnapshot.exists()) {
//       return cartSnapshot.data().cart;
//     } else {
//       return [];
//     }
//   };