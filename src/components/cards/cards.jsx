import styles from './cards.module.css';
import plus from '../../assets/plus.png';
import minus from '../../assets/minus.png';
import { useDispatch } from 'react-redux';
import { addToCart, decProdCountasync, incProdCountAsync, removeCartAsync } from '../../redux/reducers/cartReducer';
import { toast } from 'react-toastify';

export const Cards = ({ d, cartPage }) => {
  const dispatch = useDispatch();


  // Function to remove the item from the cart
  const handleRemoveFromCart = () => {
    dispatch(removeCartAsync(d)); // Dispatch removeCartAsync action
    toast.error("Item removed from the cart!");
  };

  // Function to add the item to the cart
  const handleAddToCart = () => {
    dispatch(addToCart(d)); // Dispatch addToCart action
    toast.success("Item added to the cart!");
  };

  // Function to decrease product quantity in the cart
  const handleDecreaseQuantity = () => {
    dispatch(decProdCountasync(d)); // Dispatch decProdCountAsync action
    toast.error("Item quantity is decreased");
  };

  // Function to increase product quantity in the cart
  const handleIncreaseQuantity = () => {
    dispatch(incProdCountAsync(d)); // Dispatch incProdCountAsync action
    toast.success("Item quantity is increased");
  };


  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.cards}>
          <img src={d.img} alt={d.product} className={styles.images} />
          <span>{d.product}</span>
          <span>{d.price}</span>
          {cartPage && ( // Only render quantity controls if on cart page
            <div className={styles.quantityContainer}>
              <img
                src={minus}
                alt="minus-icon"
                className={styles.minus}
                onClick={handleDecreaseQuantity} // Decrease quantity on click
              />
              <span className={styles.quantity}>{d.qty}</span>
              <img
                src={plus}
                alt="plus-icon"
                className={styles.plus}
                onClick={handleIncreaseQuantity} // Increase quantity on click
              />
            </div>
          )}
          <button
            className={cartPage ? styles.removeCart : null}
            onClick={cartPage ? handleRemoveFromCart : handleAddToCart} // Toggle action based on cartPage
          >
            {cartPage ? 'Remove From Cart' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </>
  );
};