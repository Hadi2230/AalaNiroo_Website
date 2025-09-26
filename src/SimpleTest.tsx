import React from 'react';

function SimpleTest() {
  return React.createElement('div', { style: { padding: '20px', color: 'green' } },
    React.createElement('h1', {}, '✅ تست ساده React'),
    React.createElement('p', {}, 'اگر این صفحه را می‌بینید، React کار می‌کند!')
  );
}

export default SimpleTest;
