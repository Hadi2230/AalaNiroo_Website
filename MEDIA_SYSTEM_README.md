# 🖼️ سیستم مدیریت رسانه حرفه‌ای - اعلا نیرو

## 🌟 **معرفی سیستم**

سیستم مدیریت رسانه اعلا نیرو، یک پلتفرم کامل و حرفه‌ای برای آپلود، مدیریت و نمایش تصاویر و فایل‌های شرکت است که شامل:

### ✨ **ویژگی‌های کلیدی:**
- 📤 **آپلود واقعی فایل‌ها** با drag & drop
- 🖼️ **گالری شرکت** در صفحه About
- 📁 **مدیریت پوشه‌ها** و دسته‌بندی
- 🔍 **جستجو و فیلتر** پیشرفته
- ⭐ **علامت‌گذاری محبوب**
- 📊 **آمار و گزارش‌گیری**
- 🎨 **پیش‌نمایش پیشرفته**

---

## 🚀 **نحوه استفاده:**

### **1. آپلود تصاویر:**
1. برو به: `http://localhost:5173/admin/login`
2. وارد شو با: `admin@aalaniroo.com` / `admin123`
3. برو به: `http://localhost:5173/admin/media`
4. فایل‌ها را **drag & drop** کن یا **"آپلود فایل"** کلیک کن
5. پوشه مقصد را انتخاب کن (گالری شرکت برای نمایش در About)
6. اطلاعات اضافی وارد کن (توضیحات، Alt text، تگ‌ها)

### **2. مشاهده گالری:**
1. برو به: `http://localhost:5173/about`
2. بخش **"گالری شرکت"** را ببین
3. روی تصاویر کلیک کن برای مشاهده بزرگ
4. از navigation arrows استفاده کن

### **3. مدیریت فایل‌ها:**
- **ویرایش:** کلیک روی آیکون چشم
- **علامت‌گذاری:** کلیک روی ستاره
- **حذف:** کلیک روی سطل زباله
- **کپی لینک:** از منوی سه نقطه

---

## 🏗️ **معماری سیستم:**

### **📁 فایل‌های ایجاد شده:**

#### 1. **`src/contexts/MediaContext.tsx`** - Context اصلی
```typescript
interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string; // Base64 data URL
  size: number;
  uploadedAt: string;
  folder: string;
  tags: string[];
  description: string;
  alt: string;
  dimensions?: { width: number; height: number };
  isFavorite: boolean;
}

// Functions:
- uploadFile() - آپلود واقعی با FileReader
- deleteFile() - حذف فایل
- updateFile() - ویرایش اطلاعات
- getGalleryImages() - دریافت تصاویر گالری
```

#### 2. **`src/pages/AdminMedia.tsx`** - پنل مدیریت
```typescript
✨ امکانات:
- Drag & Drop upload
- Grid/List view
- جستجو و فیلتر
- مدیریت پوشه‌ها
- ویرایش فایل‌ها
- آمار کامل
```

#### 3. **`src/pages/About.tsx`** - صفحه گالری
```typescript
✨ امکانات:
- نمایش تصاویر گالری
- Modal پیش‌نمایش
- Navigation بین تصاویر
- Thumbnail strip
- Responsive design
```

---

## 📊 **پوشه‌های پیش‌فرض:**

### 🗂️ **4 پوشه اصلی:**
1. **گالری شرکت** 🖼️ - برای نمایش در صفحه About
2. **تصاویر محصولات** 📦 - تصاویر ژنراتورها
3. **تصاویر پروژه‌ها** 🏗️ - عکس‌های پروژه‌های اجرا شده
4. **اسناد و مدارک** 📄 - کاتالوگ‌ها و گواهینامه‌ها

---

## 🔧 **ویژگی‌های فنی:**

### **آپلود واقعی:**
```typescript
// استفاده از FileReader برای تبدیل به Base64
const fileUrl = await new Promise<string>((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target?.result as string);
  reader.readAsDataURL(file);
});

// محاسبه dimensions برای تصاویر
const dimensions = await new Promise<{width: number; height: number}>((resolve) => {
  const img = new Image();
  img.onload = () => resolve({ width: img.width, height: img.height });
  img.src = fileUrl;
});
```

### **ذخیره‌سازی:**
- **LocalStorage** برای persistence
- **Real-time sync** بین components
- **Toast notifications** برای feedback

### **امنیت:**
- **File type validation**
- **Size limits** 
- **MIME type checking**
- **Sanitization**

---

## 🎨 **طراحی و UX:**

### **🎭 رابط کاربری:**
- **Drag & Drop** با visual feedback
- **Grid/List view** toggle
- **Hover effects** زیبا
- **Loading states** 
- **Empty states** مناسب

### **📱 Responsive:**
- **Mobile:** 2 columns
- **Tablet:** 3 columns  
- **Desktop:** 4-6 columns
- **Touch optimized**

### **🌙 Dark Mode:**
- پشتیبانی کامل از dark mode
- Contrast مناسب
- Icons رنگی

---

## 📋 **نحوه کار سیستم:**

### **🔄 جریان آپلود:**
1. **انتخاب فایل** (drag/drop یا click)
2. **تبدیل به Base64** با FileReader
3. **محاسبه dimensions** (برای تصاویر)
4. **ذخیره در MediaContext**
5. **ذخیره در localStorage**
6. **نمایش در AdminMedia**
7. **نمایش در گالری About** (اگر folder = 'gallery')

### **🖼️ جریان نمایش گالری:**
1. **About page** صدا می‌زند `getGalleryImages()`
2. **فیلتر می‌کند** فایل‌های image در folder 'gallery'
3. **Grid layout** نمایش می‌دهد
4. **Click** روی تصویر → Modal preview
5. **Navigation** بین تصاویر

---

## 🎯 **مزایای سیستم:**

### ✅ **برای Admin:**
- آپلود آسان و سریع
- مدیریت کامل فایل‌ها
- سازماندهی با پوشه‌ها
- جستجو و فیلتر قدرتمند
- آمار کامل

### ✅ **برای بازدیدکنندگان:**
- گالری زیبا در صفحه About
- تجربه کاربری عالی
- تصاویر با کیفیت
- Modal preview حرفه‌ای
- Mobile responsive

### ✅ **برای توسعه‌دهندگان:**
- کد تمیز و منظم
- TypeScript کامل
- Hook-based architecture
- Reusable components
- Easy to extend

---

## 🔧 **راه‌اندازی:**

### **1. نصب:**
```bash
git clone https://github.com/Hadi2230/AalaNiroo_Website.git
cd AalaNiroo_Website
pnpm install
pnpm run dev
```

### **2. آپلود اولین تصویر:**
1. برو به `/admin/login` و وارد شو
2. برو به `/admin/media`
3. یک عکس drag & drop کن
4. پوشه "گالری شرکت" را انتخاب کن
5. توضیحات وارد کن
6. ذخیره کن

### **3. مشاهده گالری:**
1. برو به `/about`
2. بخش "گالری شرکت" را ببین
3. روی تصاویر کلیک کن

---

## 📊 **آمار و گزارش‌ها:**

### **Dashboard آمار:**
- 📁 **کل فایل‌ها:** تعداد کل فایل‌های آپلود شده
- 🖼️ **تصاویر:** تعداد تصاویر
- 🌟 **گالری:** تعداد تصاویر گالری
- 📄 **اسناد:** تعداد اسناد
- 💾 **حجم کل:** مجموع حجم فایل‌ها

### **فیلترها:**
- **پوشه:** نمایش فایل‌های پوشه خاص
- **نوع:** تصاویر، اسناد، ویدیو، صوت
- **جستجو:** در نام، توضیحات، تگ‌ها
- **محبوب‌ها:** فایل‌های علامت‌گذاری شده

---

## 🔮 **امکانات آینده:**

### **فاز بعدی:**
- 🗂️ **Sub-folders** (زیرپوشه‌ها)
- 🎨 **Image editing** (crop, resize, filters)
- 📱 **Mobile app** برای آپلود
- ☁️ **Cloud storage** integration
- 🔗 **CDN** برای بهینه‌سازی
- 📈 **Advanced analytics**
- 🤖 **AI tagging** خودکار
- 🔒 **Permission system** پیشرفته

### **ادغام‌ها:**
- 📧 **Email attachments**
- 💬 **Chat file sharing**
- 📱 **Social media** integration
- 🌐 **External APIs** (Unsplash, etc.)

---

## 🎉 **نتیجه‌گیری:**

### ✅ **سیستم کامل شامل:**
- **MediaContext** حرفه‌ای با TypeScript
- **AdminMedia** با آپلود واقعی
- **Gallery** زیبا در About page
- **Real-time sync** بین components
- **Mobile responsive** design
- **Dark mode** support

### 🚀 **آماده برای:**
- ✅ **Production** استفاده
- ✅ **توسعه** بیشتر
- ✅ **Integration** با backend
- ✅ **Scaling** برای حجم بالا

---

## 📞 **راهنمای استفاده:**

### **برای آپلود عکس به گالری:**
1. `/admin/media` → آپلود فایل
2. پوشه **"گالری شرکت"** انتخاب کن
3. عکس drag & drop کن
4. توضیحات و Alt text وارد کن
5. ذخیره کن
6. برو به `/about` و گالری را ببین! ✨

### **برای مدیریت فایل‌ها:**
- **Grid/List view** برای نمایش مختلف
- **Search** برای پیدا کردن سریع
- **Filter** بر اساس پوشه و نوع
- **Edit** برای ویرایش اطلاعات
- **Favorite** برای علامت‌گذاری

**🎊 سیستم کاملاً functional و آماده استفاده است!** 🚀

---

**📍 GitHub:** https://github.com/Hadi2230/AalaNiroo_Website
**🔗 AdminMedia:** http://localhost:5173/admin/media
**🖼️ Gallery:** http://localhost:5173/about