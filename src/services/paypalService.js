const paypalClient = require('../utils/paypalClient');

exports.createOrder = async (amount) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount, // Dynamically set the amount
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);
    return order.result;
  } catch (error) {
    throw new Error('Error creating PayPal order: ' + error.message);
  }
};