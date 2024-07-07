import { useState } from "react";

export default function useInput(defaultValue, validationFn) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  function handleUserInput(value) {
    setEnteredValue(value);
    setDidEdit(true);
  }
  return {
    value: enteredValue,
    hasError: didEdit && !validationFn(enteredValue),
    handleUserInput,
  };
}
