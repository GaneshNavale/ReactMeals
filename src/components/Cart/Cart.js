import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const hasItems = cartCtx.items.length > 0;

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({
      ...item,
      amount: 1,
    });
  };

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const onSubmitCartHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch(
      "https://reactmeals-14985-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({ user: userData, orderedItems: cartCtx.items }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );
  const modalActons = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onCloseCart}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{`$${cartCtx.totalAmount.toFixed(2)}`}</span>
      </div>
      {isCheckout && (
        <Checkout
          onCancel={props.onCloseCart}
          submitCart={onSubmitCartHandler}
        ></Checkout>
      )}
      {!isCheckout && modalActons}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending Order Data.....</p>;
  const didSubmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onCloseCart}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  return (
    <Modal onCloseCart={props.onCloseCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
