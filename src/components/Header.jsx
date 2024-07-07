import { useContext, useRef } from "react";
import logo from "../assets/logo.jpg";
import { FoodAppContext } from "../store/food-app-context";
import CartModal from "./CartModal";

export default function Header() {
  const { cartList } = useContext(FoodAppContext);
  const cartModelRef = useRef();

  const totalCartItems = cartList.reduce(
    (totalNumberOfItems, item) => totalNumberOfItems + item.quantity,
    0
  );
  return (
    <>
      <header id="main-header">
        <div id="title">
          <img src={logo} />
          <h1>PRADEEP's FOOD APP</h1>
        </div>
        <button
          className="text-button"
          onClick={() => cartModelRef.current.openModal()}
        >
          Cart {totalCartItems > 0 && "(" + totalCartItems + ")"}
        </button>
      </header>
      <CartModal ref={cartModelRef} />
    </>
  );
}
