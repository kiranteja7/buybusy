import { useDispatch, useSelector } from 'react-redux';

import styles from './orders.module.css';
import { ordersSelector, fetchOrderCart } from '../../redux/reducers/orderReducer';
import { userId } from '../../redux/reducers/userReducer';
import { useEffect } from 'react';


export const Order = () =>{

  const dispatch = useDispatch();

  const user = useSelector(userId);

  useEffect(()=>{
    dispatch(fetchOrderCart(user));
 }, [dispatch, user]);


  const showOrders = useSelector(ordersSelector);



  if (!showOrders || showOrders.length === 0) {
    return <div>No Orders Available</div>;
  }

  const total = showOrders.reduce((total, order) => {
    return total + parseInt(order.price, 10) * parseInt(order.qty, 10);
  }, 0);

  return (
    <div className={styles.container}>
      <div className={styles.orderContainer}>
        <h2>Your Orders</h2>
        {showOrders.map((order, index) => (
          <div key={index}>
            <span className={styles.span}>Ordered On: {convertDateToFormat(order.purchasedOn)}</span>
            <table className={styles.orderTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr key={order.id}>
                  <td>{order.product}</td>
                  <td>₹ {order.price}</td>
                  <td>{order.qty}</td>
                  <td>₹ {order.price * order.qty}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        <div className={styles.orderTotal}>
          Total: ₹ {total}/-
        </div>
      </div>
    </div>
  );
}


function convertDateToFormat(dateString) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();

  // Format the day and month to ensure two digits
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Return the formatted date string
  return `${formattedDay}/${formattedMonth}/${year}`;
}