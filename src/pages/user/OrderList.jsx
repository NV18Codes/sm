import React, { useEffect, useState } from 'react';
import { getOrderHistory } from '../../api/trading';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getOrderHistory();
        console.log("API Response:", res); // Keep this for debugging

        // Correctly access the nested array of orders at `res.data.data`
        if (res && res.success && res.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
          if (res.data.data.length === 0) {
            setError('No orders found.');
          }
        } else {
          // Handle cases where the structure is not as expected or the API call was not successful
          setOrders([]);
          setError(res.message || 'No orders found or invalid response format.');
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError('Failed to fetch orders. Please check the console for details.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper function to format status for better readability
  const formatStatus = (status) => {
    if (!status) return '-';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', padding: 'clamp(1em, 3vw, 1.5em)' }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '1em', fontSize: 'clamp(1em, 3vw, 1.2em)' }}>Order History</h3>
      {loading ? (
        <div>Loading orders...</div>
      ) : error && orders.length === 0 ? (
        <div style={{ color: '#dc3545' }}>{error}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(11px, 2.5vw, 13px)', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
                {/* Updated table headers to reflect available data */}
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Date & Time</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Transaction Type</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Quantity</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Avg. Price</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  {/* Map the correct fields from the API response to the table cells */}
                  <td style={{ padding: '8px 12px' }}>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</td>
                  <td style={{ padding: '8px 12px' }}>{order.transaction_type || '-'}</td>
                  <td style={{ padding: '8px 12px' }}>{order.product_type || '-'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{order.quantity ?? '-'}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{order.average_fill_price ?? '-'}</td>
                  <td style={{ padding: '8px 12px', color: order.order_status?.includes('FAIL') ? '#dc3545' : '#28a745' }}>
                    {formatStatus(order.order_status)}
                  </td>
                  <td style={{ padding: '8px 12px' }}>{order.broker_status_message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;