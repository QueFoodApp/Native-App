import API_BASE_URL from '../../config'; // Ensure this path is correct

export async function createOrGetCart(userPhoneNumber, restaurantId) {
  // Creates or returns an existing cart (status="cart")
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number: userPhoneNumber, restaurant_id: restaurantId }),
  });
  if (!response.ok) {
    throw new Error(`createOrGetCart failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function getCart(userPhoneNumber, restaurantId) {
  // Retrieve a cart by customer phone number and restaurant ID
  const response = await fetch(`${API_BASE_URL}/api/cart/customer/${userPhoneNumber}/${restaurantId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`getCartByCustomerAndRestaurant failed: ${response.statusText} - ${errorText}`);
  }
  return await response.json();
}

export async function addItemToCart(orderNumber, foodItem) {
  // Add an item to the cart
  const response = await fetch(`${API_BASE_URL}/api/cart/${orderNumber}/items`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu_id: foodItem.menu_id,
      food_name: foodItem.food_name,
      quantity: foodItem.quantity, // Add quantity here
    }),
  });
  if (!response.ok) {
    throw new Error(`addItemToCart failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function removeItemFromCart(orderNumber, menuId) {
  // Remove an item from the cart by menu_id
  const response = await fetch(`${API_BASE_URL}/api/cart/${orderNumber}/items/${menuId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`removeItemFromCart failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function checkoutCart(orderNumber) {
  // Checkout the cart (status="new" or similar)
  const response = await fetch(`${API_BASE_URL}/api/cart/${orderNumber}/checkout`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`checkoutCart failed: ${response.statusText}`);
  }
  return await response.json();
}
