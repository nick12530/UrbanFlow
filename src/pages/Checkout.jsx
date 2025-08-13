import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiCreditCard, FiHome, FiPhone, FiMail, FiClock, FiDollarSign } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const Checkout = ({ cartItems, onClose, restaurant }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryInstructions: '',
    paymentMethod: 'mobile_money' // Default to M-Pesa
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = restaurant ? parseInt(restaurant.deliveryFee.replace(/\D/g, '')) : 300;
  const total = subtotal + deliveryFee;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pesapal iframe state
  const [pesapalUrl, setPesapalUrl] = useState('');
  const [orderTrackingId, setOrderTrackingId] = useState('');

  // Determine API base (use same-origin by default, override in local dev with VITE_API_BASE_URL)
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { data } = await axios.post(`${apiBase}/api/pesapal/order`, {
        amount: total,
        currency: 'KES',
        description: `Payment for order from ${restaurant?.name || 'market'}`,
        restaurantName: restaurant?.name,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
      });
      if (data.redirect_url) {
        setPesapalUrl(data.redirect_url);
        setOrderTrackingId(data.order_tracking_id || '');
      } else {
        alert('Failed to start payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed to initialize. Check server logs.');
    }
  };

  // Poll for Pesapal status if we have a tracking id
  useEffect(() => {
    if (!orderTrackingId) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${apiBase}/api/pesapal/status/${orderTrackingId}`);
        if (data.payment_status_description === 'COMPLETED' || data.status_code === 1) {
          clearInterval(interval);
          alert('Payment successful! Your order is being processed.');
          onClose();
        }
        if (data.payment_status_description === 'FAILED') {
          clearInterval(interval);
          alert('Payment failed.');
        }
      } catch (e) {
        // ignore intermittent errors while polling
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderTrackingId]);

  return (
    <div style={styles.overlay}>
      <div style={styles.checkoutContainer}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Checkout</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressSteps}>
          <div style={styles.step}>
            <div style={{...styles.stepNumber, ...styles.activeStep}}>1</div>
            <div style={styles.stepText}>Order Details</div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepText}>Delivery Info</div>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepText}>Payment</div>
          </div>
        </div>

        <div style={styles.content}>
          {/* Left Column - Order Summary */}
          <div style={styles.orderSummary}>
            <h3 style={styles.sectionTitle}>
              <FiShoppingCart style={styles.icon} /> Order Summary
            </h3>

            {restaurant && (
              <div style={styles.restaurantInfo}>
                <h4 style={styles.restaurantName}>{restaurant.name}</h4>
                <div style={styles.restaurantDetails}>
                  <span style={styles.detailItem}>
                    <FiClock /> {restaurant.deliveryTime}
                  </span>
                  <span style={styles.detailItem}>
                    <FiDollarSign /> {restaurant.deliveryFee} delivery
                  </span>
                </div>
              </div>
            )}

            <div style={styles.itemsList}>
              {cartItems.map((item, index) => (
                <div key={index} style={styles.cartItem}>
                  <div style={styles.itemInfo}>
                    <span style={styles.itemQuantity}>{item.quantity}x</span>
                    <span style={styles.itemName}>{item.name}</span>
                  </div>
                  <div style={styles.itemPrice}>
                    Ksh {item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span>Subtotal:</span>
                <span>Ksh {subtotal}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Delivery Fee:</span>
                <span>Ksh {deliveryFee}</span>
              </div>
              <div style={{...styles.totalRow, ...styles.grandTotal}}>
                <span>Total:</span>
                <span>Ksh {total}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Delivery and Payment */}
          <div style={styles.deliveryForm}>
            <form onSubmit={handlePayment}>
              <h3 style={styles.sectionTitle}>
                <FiUser style={styles.icon} /> Delivery Information
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="e.g. 0712345678"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="House number, street, area"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Delivery Instructions</label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  placeholder="Gate code, landmarks, etc."
                  rows="3"
                />
              </div>

              <h3 style={styles.sectionTitle}>
                <FiCreditCard style={styles.icon} /> Payment Method
              </h3>

              <div style={styles.paymentMethods}>
                <label style={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile_money"
                    checked={formData.paymentMethod === 'mobile_money'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <div style={styles.paymentContent}>
                    <div style={styles.paymentTitle}>Mobile Money (M-Pesa)</div>
                    <div style={styles.paymentDescription}>
                      Pay via M-Pesa. You'll receive a payment request.
                    </div>
                  </div>
                </label>

                <label style={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <div style={styles.paymentContent}>
                    <div style={styles.paymentTitle}>Credit/Debit Card</div>
                    <div style={styles.paymentDescription}>
                      Pay with Visa, Mastercard or American Express
                    </div>
                  </div>
                </label>
              </div>

              <button type="submit" style={styles.payButton}>
                Pay Ksh {total}
              </button>

              {pesapalUrl && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Complete Payment</h4>
                  <iframe
                    title="Pesapal Payment"
                    src={pesapalUrl}
                    style={{ width: '100%', height: '520px', border: '1px solid #eee', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div style={styles.contactInfo}>
                <p style={styles.contactText}>
                  Need help? Contact us:
                </p>
                <div style={styles.contactLinks}>
                  <a href={`tel:+254700000000`} style={styles.contactLink}>
                    <FiPhone /> 0700 000 000
                  </a>
                  <a href={`https://wa.me/254700000000`} style={styles.contactLink}>
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a href="mailto:help@nairobibites.com" style={styles.contactLink}>
                    <FiMail /> help@nairobibites.com
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  checkoutContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px',
    ':hover': {
      color: '#333',
    },
  },
  progressSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5px',
    color: '#666',
    fontWeight: '600',
  },
  activeStep: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  stepText: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: ['column', 'row'],
    padding: '20px',
  },
  orderSummary: {
    flex: 1,
    padding: '20px',
    borderRight: ['none', '1px solid #eee'],
    borderBottom: ['1px solid #eee', 'none'],
    marginBottom: ['20px', '0'],
  },
  deliveryForm: {
    flex: 1,
    padding: '20px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    marginTop: '0',
    marginBottom: '20px',
    color: '#333',
  },
  icon: {
    marginRight: '10px',
    color: '#ff6b6b',
  },
  restaurantInfo: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee',
  },
  restaurantName: {
    margin: '0 0 10px 0',
    fontSize: '16px',
  },
  restaurantDetails: {
    display: 'flex',
    gap: '15px',
    fontSize: '14px',
    color: '#666',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  itemsList: {
    marginBottom: '20px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  itemInfo: {
    display: 'flex',
    gap: '10px',
  },
  itemQuantity: {
    color: '#666',
  },
  itemName: {
    fontWeight: '500',
  },
  itemPrice: {
    fontWeight: '600',
  },
  totals: {
    marginTop: '20px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  grandTotal: {
    fontWeight: '600',
    fontSize: '18px',
    padding: '15px 0',
    borderBottom: 'none',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    ':focus': {
      outline: 'none',
      borderColor: '#ff6b6b',
    },
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
  },
  paymentMethods: {
    marginBottom: '30px',
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    ':hover': {
      borderColor: '#ff6b6b',
    },
  },
  radioInput: {
    marginRight: '15px',
    accentColor: '#ff6b6b',
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontWeight: '600',
    marginBottom: '5px',
  },
  paymentDescription: {
    fontSize: '13px',
    color: '#666',
  },
  payButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#e63946',
    },
  },
  contactInfo: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  contactText: {
    marginBottom: '10px',
    color: '#666',
  },
  contactLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  contactLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#ff6b6b',
    textDecoration: 'none',
    fontSize: '14px',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default Checkout;