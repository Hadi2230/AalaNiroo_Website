export default function SimpleApp() {
  return `
    <div style="font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white; padding: 20px;">
      <div style="background: rgba(255, 255, 255, 0.1); padding: 40px; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);">
        <h1 style="font-size: 32px; margin-bottom: 20px; color: #4CAF50;">
          ✅ پروژه اعلا نیرو - تکمیل شده
        </h1>
        <p style="font-size: 18px; margin-bottom: 30px;">
          سیستم مدیریت فروش و چت آنلاین
        </p>
        <div style="margin: 30px 0;">
          <a href="/admin/login" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block; margin: 0 10px;">
            ورود به پنل مدیریت
          </a>
        </div>
        <p style="font-size: 14px; opacity: 0.8;">
          زمان بارگذاری: ${new Date().toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  `;
}
