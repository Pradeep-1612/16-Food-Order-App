import { getMeals } from "../services/http";
import { FoodAppContext } from "../store/food-app-context";
import MealItem from "./MealItem";
import { useContext, useEffect, useState } from "react";

export default function Meals() {
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  // const [availableMeals, setAvailableMeals] = useState([]);
  const { availableMeals, setAvailableMeals } = useContext(FoodAppContext);
  useEffect(() => {
    setIsLoading(true);
    async function fetchMeals() {
      try {
        setAvailableMeals(await getMeals());
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError({
          message:
            error.message ||
            "Unable to fetch available meals at the moment. Please try after sometime.",
        });
      }
    }
    fetchMeals();
  }, []);
  return (
    <>
      {isLoading && !error && (
        <p className="text-center">Fetching available meals...</p>
      )}
      {!isLoading && error && (
        <p className="text-center error">{error.message}</p>
      )}
      {!isLoading && !error && (
        <section id="meals">
          {availableMeals &&
            availableMeals.map((mealItem) => {
              return (
                <MealItem
                  key={mealItem.id}
                  id={mealItem.id}
                  image={mealItem.image}
                  name={mealItem.name}
                  price={mealItem.price}
                  description={mealItem.description}
                />
              );
            })}
        </section>
      )}
    </>
  );
}
