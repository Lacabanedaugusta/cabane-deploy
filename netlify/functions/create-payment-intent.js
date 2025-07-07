const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount, // Montant en centimes
      currency: 'eur',
      payment_method_types: ['card'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
