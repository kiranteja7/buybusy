import styles from '../nav/nav.module.css';
import home from '../../assets/home.png'
import orders from '../../assets/orders.png'
import cart from '../../assets/cart.png';
import door from '../../assets/door.png';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { handleUserSignOut, isLoggedIn } from '../../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const NavBar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector(isLoggedIn);
  
  const redirectToHome = () =>{
      navigate('/');
  }

  const signOut = async() =>{
     await dispatch(handleUserSignOut()).unwrap();
     navigate("/");
     toast.success("User signed out successfully!");
  }

   return (
     <>
      <div className={styles.navContainer}>
      <Link to={`/`}><span className={styles.brandName}>BuyBusy</span></Link>
        <div className={styles.elementsDiv}>
          <div className={styles.item}>
             <img src={home} alt="home-icon" className={styles.icons} />
             <Link to={`/`}><span className={styles.navElements}>Home</span></Link>
           </div>
           {loggedIn ? 
           <>
           <div className={styles.item}>
           <img src={orders} alt="orders-icon" className={styles.icons} />
           <Link to={`/myorders`}><span className={styles.navElements}>My orders</span></Link>
        </div>
        <div className={styles.item}>
            <img src={cart} alt="cart-icon" className={styles.icons} />
            <Link to={`/cart`}><span className={styles.navElements}>Cart</span></Link>
        </div>
        </>
           : null}
          
          <div className={styles.item}>
              <img src={door} alt="register-login" className={styles.icons} />
              <Link to={loggedIn ? `/` : `/signin`}>
              <span className={styles.navElements} onClick={loggedIn ?
               signOut  : redirectToHome
              }>{loggedIn ? 'Logout': 'Login'}</span></Link>
          </div>
      </div>
    </div>
    <Outlet/>
     </>
   )
}