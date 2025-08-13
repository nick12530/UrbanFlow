import axios from 'axios';
import { fetchPesapalToken, getPesapalConfig, bearer } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = 'KES', description = 'Order Payment', customer = {}, restaurantName } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET, PESAPAL_BASE_URL, PESAPAL_CALLBACK_URL, PESAPAL_IPN_ID } = getPesapalConfig();

    if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
      return res.status(500).json({ error: 'Missing Pesapal credentials on server' });
    }
    if (!PESAPAL_IPN_ID) {
      return res.status(500).json({ error: 'Missing PESAPAL_IPN_ID. Register your IPN URL and set its ID.' });
    }

    const token = await fetchPesapalToken();

    const fullName = String(customer.name || 'Guest').trim();
    const [first_name, ...rest] = fullName.split(' ');
    const last_name = rest.join(' ') || first_name;

    const orderPayload = {
      id: `UF-${Date.now()}`,
      currency,
      amount: Number(amount),
      description: description || `Payment for ${restaurantName || 'UrbanFlow'} order`,
      callback_url: PESAPAL_CALLBACK_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`,
      cancellation_url: PESAPAL_CALLBACK_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`,
      notification_id: PESAPAL_IPN_ID,
      billing_address: {
        email_address: customer.email || 'customer@example.com',
        phone_number: customer.phone || '',
        country_code: 'KE',
        first_name,
        middle_name: '',
        last_name,
        line_1: customer.address || '',
        city: 'Nairobi',
        state: '',
        postal_code: '',
        zip_code: '',
      },
    };

    const url = `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`;
    const { data } = await axios.post(url, orderPayload, {
      headers: { ...bearer(token), 'Content-Type': 'application/json' },
    });

    return res.json({ redirect_url: data.redirect_url, order_tracking_id: data.order_tracking_id });
  } catch (err) {
    console.error('Pesapal order error', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to create Pesapal order', details: err.response?.data || err.message });
  }
}


