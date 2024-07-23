import { useValue } from '../../productContext';
// import data from '../../products.json';
import styles from './cards.module.css';
import plus from '../../assets/plus.png';
import minus from '../../assets/minus.png';

export const Cards = ({d, cartPage}) =>{

    const {addToCart, incProdCount, decProdCount, removeCart} = useValue();

   return (
    <>
       <div className={styles.cardContainer}>
        <div className={styles.cards} >
        <img src={d.img} alt={d.product} className={styles.images}/>
        <span>{d.product}</span>
        <span>{d.price}</span>
        {cartPage ?
        <div className={styles.quantityContainer}>
          <img src={minus} alt="minus-icon" className={styles.minus} onClick={()=> decProdCount(d)}/>
           <span className={styles.quantity}>{d.qty}</span>
          <img src={plus} alt="plus-icon" className={styles.plus} onClick={()=> incProdCount(d)}/>
        </div> : null
          }
        <button className={cartPage ? styles.removeCart : null} 
        onClick={cartPage ? ()=> removeCart(d) : ()=> addToCart(d)}>{ cartPage ? 'Remove From Cart' : 'Add To Cart'}</button>
       </div>
       </div>
    </>
   )
}