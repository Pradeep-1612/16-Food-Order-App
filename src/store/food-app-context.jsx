import { createContext, useReducer } from "react";

export const FoodAppContext = createContext({
  availableMeals: [],
  setAvailableMeals: () => {},
  cartList: [],
  addToCartList: () => {},
  removeFromCartList: () => {},
  orderCompleted: () => {},
});

function reducer(state, action) {
  switch (action.type) {
    case "SET_AVAILABLE_MEALS": {
      return {
        ...state,
        availableMeals: action.data,
      };
    }
    case "ADD_TO_CART_LIST": {
      const existingItemIndex = state.cartList.findIndex(
        (item) => item.id === action.id
      );
      const updatedItems = [...state.cartList];
      if (existingItemIndex > -1) {
        const existingItem = state.cartList[existingItemIndex];
        updatedItems[existingItemIndex] = {
          id: existingItem.id,
          quantity: existingItem.quantity + 1,
        };
      } else {
        updatedItems.push({ id: action.id, quantity: 1 });
      }
      // if (state.cartList.length === 0) {
      //   selectedItems.push({ id: action.id, quantity: 1 });
      // } else {
      //   let isItemAvailable = false;
      //   state.cartList.forEach((item) => {
      //     if (item.id === action.id) {
      //       isItemAvailable = true;
      //       selectedItems.push({
      //         id: action.id,
      //         quantity: item.quantity + 1,
      //       });
      //     } else {
      //       selectedItems.push(item);
      //     }
      //   });
      //   if (!isItemAvailable) {
      //     selectedItems.push({ id: action.id, quantity: 1 });
      //   }
      // }

      return {
        ...state,
        cartList: updatedItems,
      };
    }

    case "REMOVE_FROM_CART_LIST": {
      const existingItemIndex = state.cartList.findIndex(
        (item) => item.id === action.id
      );
      const updatedItems = [...state.cartList];
      if (existingItemIndex > -1) {
        const existingItem = state.cartList[existingItemIndex];
        if (existingItem.quantity === 1) {
          updatedItems.splice(existingItemIndex, 1);
        } else {
          updatedItems[existingItemIndex] = {
            id: existingItem.id,
            quantity: existingItem.quantity - 1,
          };
        }
      }
      // const updatedCartList = [];
      // state.cartList.forEach((item) => {
      //   if (item.id === action.id) {
      //     const itemQuantity = item.quantity - 1;
      //     if (itemQuantity > 0) {
      //       updatedCartList.push({
      //         id: action.id,
      //         quantity: itemQuantity,
      //       });
      //     }
      //   } else {
      //     updatedCartList.push(item);
      //   }
      // });
      return {
        ...state,
        cartList: updatedItems,
      };
    }

    case "ORDER_COMPLETED": {
      return {
        ...state,
        cartList: [],
      };
    }
  }

  return state;
}

export default function FoodAppContextProvider({ children }) {
  const [foodAppState, foodAppActionDispatch] = useReducer(reducer, {
    availableMeals: [],
    cartList: [],
  });

  const contextValue = {
    availableMeals: foodAppState.availableMeals,
    setAvailableMeals: (data) => {
      foodAppActionDispatch({
        type: "SET_AVAILABLE_MEALS",
        data,
      });
    },
    cartList: foodAppState.cartList,
    addToCartList: (id) => {
      foodAppActionDispatch({
        type: "ADD_TO_CART_LIST",
        id,
      });
    },
    removeFromCartList: (id) => {
      foodAppActionDispatch({
        type: "REMOVE_FROM_CART_LIST",
        id,
      });
    },
    orderCompleted: () => {
      foodAppActionDispatch({
        type: "ORDER_COMPLETED",
      });
    },
  };

  return (
    <FoodAppContext.Provider value={contextValue}>
      {children}
    </FoodAppContext.Provider>
  );
}
