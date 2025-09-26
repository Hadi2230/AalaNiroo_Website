import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>✅ صفحه تست React</h1>
      <p>اگر این صفحه را می‌بینید، React کار می‌کند!</p>
      <div style={{ margin: '20px 0' }}>
        <h2 style={{ color: 'blue' }}>اطلاعات دیباگ:</h2>
        <ul>
          <li>زمان: {new Date().toLocaleString('fa-IR')}</li>
          <li>Environment: Development</li>
          <li>React Version: 19</li>
        </ul>
      </div>
    </div>
  );
}
