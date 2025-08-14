import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, data: null, error: '' });

  const apiBase = import.meta.env?.VITE_API_BASE_URL || '';

  const orderTrackingId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    // Pesapal can send either of these keys
    return (
      params.get('orderTrackingId') ||
      params.get('OrderTrackingId') ||
      ''
    );
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      if (!orderTrackingId) {
        if (isMounted) setStatus({ loading: false, data: null, error: 'Missing orderTrackingId in URL' });
        return;
      }
      try {
        const { data } = await axios.get(`${apiBase}/api/pesapal/status/${orderTrackingId}`);
        if (!isMounted) return;
        setStatus({ loading: false, data, error: '' });
      } catch (err) {
        if (!isMounted) return;
        setStatus({ loading: false, data: null, error: err.response?.data?.error || err.message || 'Failed to confirm payment status' });
      }
    }
    fetchStatus();
    return () => { isMounted = false; };
  }, [orderTrackingId, apiBase]);

  const isCompleted = status.data?.payment_status_description === 'COMPLETED' || status.data?.status_code === 1;
  const isFailed = status.data?.payment_status_description === 'FAILED' || status.data?.status_code === 2;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {status.loading && (
          <>
            <div style={styles.icon}>⏳</div>
            <h2 style={styles.title}>Confirming your payment…</h2>
            <p style={styles.text}>Please wait while we verify your transaction.</p>
          </>
        )}

        {!status.loading && status.error && (
          <>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>We couldn't confirm your payment</h2>
            <p style={styles.text}>{status.error}</p>
            <div style={styles.actions}>
              <button style={styles.button} onClick={() => navigate('/')}>Go Home</button>
            </div>
          </>
        )}

        {!status.loading && !status.error && isCompleted && (
          <>
            <div style={styles.icon}>✅</div>
            <h2 style={styles.title}>Payment Successful</h2>
            <p style={styles.text}>Thank you! Your order is being processed.</p>
            <p style={{ ...styles.text, color: '#64748b' }}>Order Tracking ID: {orderTrackingId}</p>
            <div style={styles.actions}>
              <button style={styles.button} onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </>
        )}

        {!status.loading && !status.error && !isCompleted && !isFailed && (
          <>
            <div style={styles.icon}>ℹ️</div>
            <h2 style={styles.title}>Payment Pending</h2>
            <p style={styles.text}>We are still waiting for confirmation. Refresh this page in a moment.</p>
            <p style={{ ...styles.text, color: '#64748b' }}>Order Tracking ID: {orderTrackingId}</p>
            <div style={styles.actions}>
              <button style={styles.button} onClick={() => window.location.reload()}>Refresh</button>
              <button style={{ ...styles.button, backgroundColor: '#475569' }} onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </>
        )}

        {!status.loading && !status.error && isFailed && (
          <>
            <div style={styles.icon}>❌</div>
            <h2 style={styles.title}>Payment Failed</h2>
            <p style={styles.text}>Your payment was not completed. Please try again.</p>
            <div style={styles.actions}>
              <button style={styles.button} onClick={() => navigate('/food')}>Try Again</button>
              <button style={{ ...styles.button, backgroundColor: '#475569' }} onClick={() => navigate('/')}>Back to Home</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '560px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    padding: '32px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
  },
  text: {
    margin: '0 0 16px 0',
    color: '#334155',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '12px',
  },
  button: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};


