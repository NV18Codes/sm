// src/components/HoldingsTable.js

import React from 'react';

const HoldingsTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2em', color: '#6c757d' }}>No holdings found.</div>;
  }
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e0e0e0', background: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Symbol</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Qty</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Avg. Price</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>LTP</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Invested</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Current Value</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>P&L (%)</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Day Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>{holding.symbol}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>{holding.quantity}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{holding.avgPrice.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{holding.ltp.toFixed(2)}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{(holding.quantity * holding.avgPrice).toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px', textAlign: 'right' }}>₹{holding.currentValue.toLocaleString('en-IN')}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: holding.pnl >= 0 ? '#28a745' : '#dc3545' }}>
                ₹{holding.pnl.toFixed(2)} ({holding.pnlPercentage.toFixed(2)}%)
              </td>
              <td style={{ padding: '12px', textAlign: 'right', color: holding.dayChange >= 0 ? '#28a745' : '#dc3545' }}>
                {holding.dayChange.toFixed(2)} ({holding.dayChangePercentage.toFixed(2)}%)
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;