import axios from 'axios';
import { fetchPesapalToken, getPesapalConfig, bearer } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderTrackingId } = req.query;
    const { PESAPAL_BASE_URL } = getPesapalConfig();
    const token = await fetchPesapalToken();
    const url = `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
    const { data } = await axios.get(url, { headers: bearer(token) });
    return res.json(data);
  } catch (err) {
    console.error('Pesapal status error', err.response?.data || err.message);
    return res.status(500).json({ error: 'Failed to fetch status', details: err.response?.data || err.message });
  }
}


