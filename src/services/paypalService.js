const paypal = require('@paypal/checkout-server-sdk');

// Configure the PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

/**
 * Create a PayPal order.
 * @param {Number} amount - The amount to charge.
 * @returns {Object} - The created order details.
 */
exports.createOrder = async (amount) => {
  try {
    console.log('Creating PayPal order with amount:', amount);
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString(),
          },
        },
      ],
    });

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    throw new Error('Error creating PayPal order: ' + error.message);
  }
};

/**
 * Capture a PayPal order.
 * @param {String} orderId - The PayPal order ID.
 * @returns {Object} - The captured order details.
 */
exports.captureOrder = async (orderId) => {
  try {
    console.log('Capturing PayPal order with ID:', orderId);
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({}); // No additional data needed for capture

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('Error capturing PayPal order:', error.message);
    throw new Error('Error capturing PayPal order: ' + error.message);
  }
};

/**
 * Get PayPal order details.
 * @param {String} orderId - The PayPal order ID.
 * @returns {Object} - The PayPal order details.
 */
exports.getOrderDetails = async (orderId) => {
  try {
    console.log('Fetching details for PayPal order with ID:', orderId);
    const request = new paypal.orders.OrdersGetRequest(orderId);

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    console.error('Error fetching PayPal order details:', error.message);
    throw new Error('Error fetching PayPal order details: ' + error.message);
  }
};
