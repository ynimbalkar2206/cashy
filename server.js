require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const BASE_URL = 'https://sandbox.cashfree.com/pg'; // PG V2 URL
const headers = {
  'Content-Type': 'application/json',
  'x-api-version': '2022-09-01',
  'x-client-id': APP_ID,
  'x-client-secret': SECRET_KEY
};

// Create Order API (called by frontend)
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const orderId = 'order_' + Date.now();
  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: 'cust_' + Date.now(),
      customer_email: 'test@example.com',
      customer_phone: '9876543210'
    }
  };

  try {
    const response = await axios.post(`${BASE_URL}/orders`, payload, { headers });
    const orderToken = response.data.order_token;
    res.json({ orderToken });
  } catch (error) {
    console.error('Cashfree error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate order' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
