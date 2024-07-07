export async function getMeals() {
  const response = await fetch("http://localhost:3000/meals");
  if (!response.ok) {
    throw new Error("Unable to fetch available meals!");
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function submitOrder(orderData) {
  const response = await fetch("http://localhost:3000/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Unable to submit the order!");
  }
  const jsonResponse = response.json();
  return jsonResponse;
}
