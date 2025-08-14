import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory (project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || '';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || '';
// Default to LIVE base URL; override with env if needed
const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';
const PESAPAL_CALLBACK_URL = process.env.PESAPAL_CALLBACK_URL || 'http://localhost:5173/success';
const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID || '';
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Initialize Gemini client if key is present
let genAI = null;
if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  } catch (e) {
    console.warn('Failed to initialize GoogleGenerativeAI:', e.message);
  }
}

let cachedToken = null;
let cachedTokenExpiry = 0;

async function fetchPesapalToken() {
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry - 60_000) {
    return cachedToken;
  }
  const url = `${PESAPAL_BASE_URL}/api/Auth/RequestToken`;
  const { data } = await axios.post(url, {
    consumer_key: PESAPAL_CONSUMER_KEY,
    consumer_secret: PESAPAL_CONSUMER_SECRET,
  }, { headers: { 'Content-Type': 'application/json' } });
  cachedToken = data.token;
  // expiry is an ISO date string; set 5 min safety margin
  cachedTokenExpiry = new Date(data.expires_in).getTime() || (now + 25 * 60 * 1000);
  return cachedToken;
}

app.post('/api/pesapal/order', async (req, res) => {
  try {
    const { amount, currency = 'KES', description = 'Order Payment', customer = {}, restaurantName } = req.body || {};
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
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
      callback_url: PESAPAL_CALLBACK_URL,
      cancellation_url: PESAPAL_CALLBACK_URL,
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
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return res.json({ redirect_url: data.redirect_url, order_tracking_id: data.order_tracking_id });
  } catch (err) {
    console.error('Pesapal order error', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to create Pesapal order', details: err.response?.data || err.message });
  }
});

app.get('/api/pesapal/status/:orderTrackingId', async (req, res) => {
  try {
    const { orderTrackingId } = req.params;
    const token = await fetchPesapalToken();
    const url = `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json(data);
  } catch (err) {
    console.error('Pesapal status error', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to fetch status', details: err.response?.data || err.message });
  }
});

// IPN endpoint for Pesapal (configure this public URL in your dashboard)
// Accept both GET and POST notifications
app.all('/api/pesapal/ipn', async (req, res) => {
  try {
    const orderTrackingId = req.query.orderTrackingId || req.body?.orderTrackingId || req.query.OrderTrackingId || '';
    // Optional: immediately confirm the transaction status and update your DB
    if (orderTrackingId) {
      try {
        const token = await fetchPesapalToken();
        const url = `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
        const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        console.log('IPN status for', orderTrackingId, data?.payment_status_description || data);
      } catch (innerErr) {
        console.warn('Failed to confirm status from IPN for', orderTrackingId, innerErr.response?.data || innerErr.message);
      }
    } else {
      console.log('Received IPN without orderTrackingId');
    }
    // Always acknowledge with 200 to stop retries
    return res.status(200).send('OK');
  } catch (err) {
    // Acknowledge anyway to avoid repeated retries; log error
    console.error('IPN handler error', err.message);
    return res.status(200).send('OK');
  }
});

// Gemini chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!GEMINI_API_KEY || !genAI) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }
    const { prompt, history = [], model = 'gemini-1.5-flash', systemInstruction } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const generativeModel = genAI.getGenerativeModel({
      model,
      ...(systemInstruction ? { systemInstruction } : {}),
    });

    // Map history to Gemini chat format
    const mappedHistory = Array.isArray(history)
      ? history
          .filter(m => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'model'))
          .map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
      : [];

    const chat = generativeModel.startChat({ history: mappedHistory });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ text });
  } catch (err) {
    console.error('Gemini chat error', err.message, err.response?.data || '');
    return res.status(500).json({ error: 'Failed to generate response', details: err.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Pesapal server running on http://localhost:${PORT}`);
});


