import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/nav/nav';
import { Home } from './pages/Home/Home';
import CustomProductProvider from './productContext';
import { SignIn } from './pages/SignIn/signIn';
import { Register } from './pages/register/register';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Cart } from './pages/cart/cart';
import { Orders } from './pages/orders/orders';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { InitializeAuth } from './redux/intializeAuth';
// import { useEffect } from 'react';

function App() {

  const router = createBrowserRouter([
     {
      path: '/',
      element: <NavBar/>,
      children: [
        {
          index : true, element: <Home/>
        },
        {
          path: '/signin',
          element: <SignIn/>
         }, 
         {
          path: '/register',
          element : <Register/>
         },{
          path: '/cart',
          element : <Cart/>
         },
         {
          path : '/myorders',
          element: <Orders/>
         }
      ]
     }
  ])


    InitializeAuth();
  
  return (
    // <CustomProductProvider>
    //       <ToastContainer/>
    // <RouterProvider router={router}/>
    // </CustomProductProvider>
     <CustomProductProvider>
    <Provider store={store}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
     </CustomProductProvider>
  );
}

export default App;
