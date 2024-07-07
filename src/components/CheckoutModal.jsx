import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Input from "./Input";
import { submitOrder } from "../services/http";
import useInput from "../hooks/useInput";
import { FoodAppContext } from "../store/food-app-context";
import { currencyFormatter } from "../util/formatter";
import { createPortal } from "react-dom";

export function isEmail(value) {
  return value.includes("@");
}

export function isNotEmpty(value) {
  return value && value.trim() !== "";
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

const CheckoutModal = forwardRef(function CheckoutModal(
  { items, totalPrice, cartModalRef },
  dialogRef
) {
  const dialogModalRef = useRef();
  const {
    value: name,
    hasError: hasNameError,
    handleUserInput: handleNameInput,
  } = useInput(undefined, (value) => isNotEmpty(value));
  const {
    value: email,
    hasError: hasEmailError,
    handleUserInput: handleEmailInput,
  } = useInput(undefined, (value) => isNotEmpty(value) && isEmail(value));
  const {
    value: street,
    hasError: hasStreetError,
    handleUserInput: handleStreetInput,
  } = useInput(undefined, (value) => isNotEmpty(value));
  const {
    value: postalCode,
    hasError: hasPostalCodeError,
    handleUserInput: handlePostalCodeInput,
  } = useInput(
    undefined,
    (value) => isNotEmpty(value) && hasMinLength(value, 6)
  );
  const {
    value: city,
    hasError: hasCityError,
    handleUserInput: handleCityInput,
  } = useInput(undefined, (value) => isNotEmpty(value));
  const [submitError, setSubmitError] = useState();
  const [submitCompleted, setSubmitCompleted] = useState(false);
  const { orderCompleted } = useContext(FoodAppContext);

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

  async function checkoutOrder() {
    const userData = {
      name,
      email,
      street,
      "postal-code": postalCode,
      city,
    };

    const orderData = {
      order: {
        items,
        customer: userData,
      },
    };
    try {
      const response = await submitOrder(orderData);
      console.log(response);
      setSubmitError(undefined);
      setSubmitCompleted(true);
      cartModalRef.current.closeModal();
    } catch (error) {
      setSubmitError(
        "We cannot process your order at the moment. Please try later."
      );
    }
  }

  return createPortal(
    <dialog className="modal" ref={dialogModalRef}>
      <h2>Checkout</h2>
      <p>
        Total amount: <strong>{currencyFormatter.format(totalPrice)}</strong>
      </p>
      {submitError && <p className="error">{submitError}</p>}
      {submitCompleted && (
        <p className="success">You have successfully placed an order.</p>
      )}
      {!submitCompleted && (
        <>
          <Input
            label="Full name"
            error={hasNameError}
            onChange={($event) => handleNameInput($event.target.value)}
          />
          <Input
            label="Email address"
            type="email"
            error={hasEmailError}
            onChange={($event) => handleEmailInput($event.target.value)}
          />
          <Input
            label="Street"
            error={hasStreetError}
            onChange={($event) => handleStreetInput($event.target.value)}
          />
          <div className="control-row">
            <Input
              label="Postal code"
              type="number"
              error={hasPostalCodeError}
              onChange={($event) => handlePostalCodeInput($event.target.value)}
            />
            <Input
              label="City"
              error={hasCityError}
              onChange={($event) => handleCityInput($event.target.value)}
            />
          </div>
        </>
      )}
      <br></br>
      <div className="modal-actions">
        <button
          className="text-button"
          onClick={() => {
            dialogRef.current.closeModal();
            setSubmitError(undefined);
            setSubmitCompleted(false);
            if (submitCompleted) {
              dialogRef.current.closeModal();
              orderCompleted();
            }
          }}
        >
          Close
        </button>
        {!submitCompleted && (
          <button
            className="button"
            onClick={() => checkoutOrder()}
            disabled={
              !name ||
              hasNameError ||
              !email ||
              hasEmailError ||
              !street ||
              hasStreetError ||
              !postalCode ||
              hasPostalCodeError ||
              !city ||
              hasCityError
            }
          >
            Submit order
          </button>
        )}
      </div>
    </dialog>,
    document.getElementById("modal")
  );
});

export default CheckoutModal;
