import { useState } from 'react';
import { getNotifications } from '../api';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('');
  const [data, setData] = useState<any>(null);

  const testApi = async () => {
    try {
      setStatus('Testing API connection...');
      const result = await getNotifications('user123', false);
      setData(result);
      setStatus('API connection successful!');
    } catch (error: any) {
      setStatus(`API Error: ${error.message}`);
      console.error('API Test Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#1f2937', borderRadius: '8px', margin: '20px 0' }}>
      <h3>API Connection Test</h3>
      <button onClick={testApi} style={{ marginBottom: '10px' }}>
        Test API Connection
      </button>
      <div style={{ marginTop: '10px' }}>
        <strong>Status:</strong> {status}
      </div>
      {data && (
        <div style={{ marginTop: '10px' }}>
          <strong>Data:</strong>
          <pre style={{ background: '#374151', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
