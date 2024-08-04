import { useDispatch, useSelector } from "react-redux";
import { Cards } from "../../components/cards/cards";
import { Price } from "../../components/price/price";
// import { useValue } from "../../productContext"
import styles from '../Home/Home.module.css';
import style from './cart.module.css';
import { cartSelector, fetchCartAsync } from "../../redux/reducers/cartReducer";
import { useEffect } from "react";
import { userId } from "../../redux/reducers/userReducer";


export const Cart = () =>{

    const cart = useSelector(cartSelector);
    const user = useSelector(userId);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchCartAsync(user));
    },[dispatch, user]);

    return (
    <div className={style.cartContainer}>
    {cart==null ? <span className={style.noItems}>No Cart Items</span>: 
        <>
    <Price/>
    <div className={styles.cardsContainer}>
       {
      cart.map((prod, i)=>(
          <Cards d={prod} key={i} cartPage={true}/>
       )
      )}
      
    </div>
      </>
      }
    </div>
    )
}