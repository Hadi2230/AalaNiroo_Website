export default function AbsoluteSimpleTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
        ✅ تست مطلق React
      </h1>
      <p style={{ color: 'blue', fontSize: '16px', lineHeight: '1.6' }}>
        اگر این صفحه را می‌بینید، React کاملاً کار می‌کند!
      </p>
      <div style={{ 
        margin: '20px 0', 
        padding: '15px', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        borderLeft: '4px solid #4CAF50'
      }}>
        <h3 style={{ color: '#333', margin: '0 0 10px 0' }}>اطلاعات سیستم:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>✅ React: در حال اجرا</li>
          <li>✅ JavaScript: فعال</li>
          <li>✅ Component: بارگذاری شده</li>
          <li>✅ Styling: اعمال شده</li>
        </ul>
      </div>
      <p style={{ fontSize: '14px', color: '#666' }}>
        زمان بارگذاری: {new Date().toLocaleString('fa-IR')}
      </p>
    </div>
  );
}
