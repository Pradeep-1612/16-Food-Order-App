import Header from "./components/Header.jsx";
import Meals from "./components/Meals.jsx";
import FoodAppContextProvider from "./store/food-app-context.jsx";

function App() {
  return (
    <>
      <FoodAppContextProvider>
        <Header />
        <Meals />
      </FoodAppContextProvider>
    </>
  );
}

export default App;
