
import { useNavigate } from 'react-router-dom';
import { useValue } from '../../productContext';
import styles from './price.module.css';
import style from '../../pages/cart/cart.module.css'

export const Price = () =>{

    const {cart, checkout} = useValue();
    const navigate = useNavigate();

    let length = cart.map((cartItems)=> cartItems.orders.length);
    [length] = length;
    if(length === 0){
      return <span className={style.noItems}>No Cart Items</span>
    }

    let total = cart.reduce((total, cartItem)=> {
       let itemTotal = cartItem.orders.reduce((tot, order)=>{
          return parseInt(tot) + parseInt(order.price * order.qty)
       }, 0)
       return itemTotal + Number(total)
    } , 0);

    return (
    <div className={styles.priceContainer}>
      <span className={styles.totalPrice}>TotalPrice : {total.toString()}/-</span>
      <button onClick={()=> {checkout(); navigate('/myorders')}}>Purchase</button>
    </div>
    )
}