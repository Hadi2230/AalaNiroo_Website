import React from 'react';

function SimpleApp() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#4CAF50' }}>
          ✅ پروژه اعلا نیرو - تکمیل شده
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          سیستم مدیریت فروش و چت آنلاین
        </p>
        <div style={{ margin: '30px 0' }}>
          <a href="/admin/login" style={{
            background: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            display: 'inline-block',
            margin: '0 10px'
          }}>
            ورود به پنل مدیریت
          </a>
        </div>
        <p style={{ fontSize: '14px', opacity: '0.8' }}>
          زمان بارگذاری: {new Date().toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  );
}

export default SimpleApp;
