import { Cards } from "../../components/cards/cards";
import { Price } from "../../components/price/price";
import { useValue } from "../../productContext"
import styles from '../Home/Home.module.css';
import style from './cart.module.css';


export const Cart = () =>{
  
    const {cart} = useValue();

    return (
    <div className={style.cartContainer}>
    {cart.length === 0 ? <span className={style.noItems}>No Cart Items</span>: 
        <>
    <Price/>
    <div className={styles.cardsContainer}>
       {
      cart.map((cartItem)=>(
        cartItem.orders.map((prod, i)=>(
          <Cards d={prod} key={i} cartPage={true}/>
        ))
       )
      )}
      
    </div>
      </>
      }
    </div>
    )
}