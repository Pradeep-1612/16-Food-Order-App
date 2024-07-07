import { useContext } from "react";
import { FoodAppContext } from "../store/food-app-context";
import { currencyFormatter } from "../util/formatter";

export default function MealItem({ id, image, name, price, description }) {
  const { addToCartList } = useContext(FoodAppContext);
  return (
    <>
      <li className="meal-item">
        <article>
          <img src={`http://localhost:3000/${image}`} />
          <div>
            <h3>{name}</h3>
            <p className="meal-item-price">{currencyFormatter.format(price)}</p>
            <p className="meal-item-description">{description}</p>
          </div>
          <div className="meal-item-actions">
            <button className="button" onClick={() => addToCartList(id)}>
              Add to cart
            </button>
          </div>
        </article>
      </li>
    </>
  );
}
