import axios from 'axios';
import { fetchPesapalToken, getPesapalConfig, bearer } from './_utils.js';

export default async function handler(req, res) {
  try {
    const { PESAPAL_BASE_URL } = getPesapalConfig();
    const queryOrderId = req.query?.orderTrackingId || req.query?.OrderTrackingId;
    const bodyOrderId = req.body?.orderTrackingId || req.body?.OrderTrackingId;
    const orderTrackingId = queryOrderId || bodyOrderId || '';

    if (orderTrackingId) {
      try {
        const token = await fetchPesapalToken();
        const url = `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;
        const { data } = await axios.get(url, { headers: bearer(token) });
        console.log('IPN status for', orderTrackingId, data?.payment_status_description || data);
        // TODO: Update your database here based on status
      } catch (innerErr) {
        console.warn('Failed to confirm status from IPN for', orderTrackingId, innerErr.response?.data || innerErr.message);
      }
    } else {
      console.log('Received IPN without orderTrackingId');
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error('IPN handler error', err.message);
    return res.status(200).send('OK');
  }
}


