import React from 'react';

export default function VerySimpleTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ تست خیلی ساده React</h1>
      <p style={{ color: 'blue' }}>اگر این متن را می‌بینید، React کار می‌کند!</p>
      <p>زمان: {new Date().toLocaleString('fa-IR')}</p>
      <div style={{ margin: '10px 0', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <strong>اطلاعات تست:</strong>
        <ul>
          <li>React: در حال اجرا</li>
          <li>JavaScript: فعال</li>
          <li>Component: بارگذاری شده</li>
        </ul>
      </div>
    </div>
  );
}
