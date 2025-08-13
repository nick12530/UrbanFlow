import axios from 'axios';
import 'dotenv/config';

// Cache token across invocations when possible
let cachedToken = null;
let cachedTokenExpiry = 0;

export function getPesapalConfig() {
  const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || '';
  const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || '';
  const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || 'https://pay.pesapal.com/v3';
  const PESAPAL_CALLBACK_URL = process.env.PESAPAL_CALLBACK_URL || '';
  const PESAPAL_IPN_ID = process.env.PESAPAL_IPN_ID || '';
  return { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET, PESAPAL_BASE_URL, PESAPAL_CALLBACK_URL, PESAPAL_IPN_ID };
}

export async function fetchPesapalToken() {
  const { PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET, PESAPAL_BASE_URL } = getPesapalConfig();
  const now = Date.now();
  if (cachedToken && now < cachedTokenExpiry - 60_000) {
    return cachedToken;
  }
  const url = `${PESAPAL_BASE_URL}/api/Auth/RequestToken`;
  const { data } = await axios.post(
    url,
    { consumer_key: PESAPAL_CONSUMER_KEY, consumer_secret: PESAPAL_CONSUMER_SECRET },
    { headers: { 'Content-Type': 'application/json' } }
  );
  cachedToken = data.token;
  cachedTokenExpiry = new Date(data.expires_in).getTime() || (now + 25 * 60 * 1000);
  return cachedToken;
}

export function bearer(token) {
  return { Authorization: `Bearer ${token}` };
}


