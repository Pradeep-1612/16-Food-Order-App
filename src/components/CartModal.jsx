import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { FoodAppContext } from "../store/food-app-context";
import CheckoutModal from "./CheckoutModal";
import { currencyFormatter } from "../util/formatter";
import { createPortal } from "react-dom";

const CartModal = forwardRef(function CartModal({}, dialogRef) {
  const dialogModalRef = useRef();
  const checkoutModalRef = useRef();

  const { availableMeals, cartList, addToCartList, removeFromCartList } =
    useContext(FoodAppContext);
  const transformedCartList = [];
  let totalPrice = 0;
  cartList.forEach((cartItem) => {
    availableMeals.forEach((mealItem) => {
      if (cartItem.id === mealItem.id) {
        transformedCartList.push({
          id: mealItem.id,
          name: mealItem.name,
          price: mealItem.price,
          selectedQuantity: cartItem.quantity,
        });

        totalPrice = parseFloat(
          (totalPrice + mealItem.price * cartItem.quantity).toFixed(2)
        );
      }
    });
  });

  useImperativeHandle(dialogRef, () => {
    return {
      openModal() {
        dialogModalRef.current.showModal();
      },
      closeModal() {
        dialogModalRef.current.close();
      },
    };
  });
  return createPortal(
    <>
      <dialog className="cart modal" ref={dialogModalRef}>
        <h2>Your cart</h2>
        {transformedCartList.length === 0 && (
          <p className="text-center">No items added to the cart.</p>
        )}
        {transformedCartList.map((item) => {
          return (
            <ul key={item.id}>
              <div className="cart-item">
                <p>
                  <strong>{item.name}</strong> ~ {item.selectedQuantity} x
                  {currencyFormatter.format(item.price)}
                </p>
                <div className="cart-item-actions">
                  <button onClick={() => removeFromCartList(item.id)}>-</button>
                  {item.selectedQuantity}
                  <button onClick={() => addToCartList(item.id)}>+</button>
                </div>
              </div>
            </ul>
          );
        })}
        <div className="cart-total">
          {transformedCartList.length > 0 &&
            currencyFormatter.format(totalPrice)}
        </div>
        <div className="modal-actions">
          <button
            className="text-button"
            onClick={() => dialogRef.current.closeModal()}
          >
            Close
          </button>
          {transformedCartList.length > 0 && (
            <button
              className="button"
              onClick={() => checkoutModalRef.current.openModal()}
            >
              Go to checkout
            </button>
          )}
        </div>
      </dialog>
      <CheckoutModal
        ref={checkoutModalRef}
        cartModalRef={dialogRef}
        items={transformedCartList}
        totalPrice={totalPrice}
      ></CheckoutModal>
    </>,
    document.getElementById("modal")
  );
});
export default CartModal;
