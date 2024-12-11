const paypal = require('@paypal/checkout-server-sdk');

// Configure the PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Controller to create a PayPal order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount should be provided in the request body
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required to create an order.' });
    }

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
    res.status(201).json({
      orderId: response.result.id,
      status: response.result.status,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    res.status(500).json({ message: 'Error creating PayPal order', error: error.message });
  }
};

// Controller to capture a PayPal order
exports.captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body; // Order ID should be provided in the request body
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required to capture an order.' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({}); // No additional data needed for capture

    const response = await client.execute(request);
    res.status(200).json(response.result);
  } catch (error) {
    console.error('Error capturing PayPal order:', error.message);
    res.status(500).json({ message: 'Error capturing PayPal order', error: error.message });
  }
};

// Controller to get details of a PayPal order
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.query; // Order ID should be provided as a query parameter
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required to get order details.' });
    }

    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await client.execute(request);
    res.status(200).json(response.result);
  } catch (error) {
    console.error('Error fetching PayPal order details:', error.message);
    res.status(500).json({ message: 'Error fetching PayPal order details', error: error.message });
  }
};
