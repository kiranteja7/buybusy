
import { useNavigate } from 'react-router-dom';
import styles from './price.module.css';
import style from '../../pages/cart/cart.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { cartSelector } from '../../redux/reducers/cartReducer';
import { checkoutAsync } from '../../redux/reducers/orderReducer';
import { toast } from 'react-toastify';

export const Price = () =>{

    const navigate = useNavigate();
    const cart = useSelector(cartSelector);
    const dispatch = useDispatch();

    const checkOut = () =>{
      dispatch(checkoutAsync());
      toast.success("Thanks for purchasing in buybusy!");
    }

    if(cart.length === 0){
      return <span className={style.noItems}>No Cart Items</span>
    }

    let total = cart.reduce((total, order)=>{
        return parseInt(total) + parseInt(order.price * order.qty); 
    }, 0)

    return (
    <div className={styles.priceContainer}>
      <span className={styles.totalPrice}>TotalPrice : {total.toString()}/-</span>
      <button onClick={()=> {checkOut(); navigate('/myorders')}}>Purchase</button>
    </div>
    )
}