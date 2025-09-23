export const products = [
  {
    id: 1,
    name: "ژنراتور دیزلی صنعتی DG-500",
    category: "diesel-generators",
    power: "500 کیلووات",
    image: "/api/placeholder/400/300",
    description: "ژنراتور دیزلی با قدرت بالا مناسب برای کاربردهای صنعتی و تجاری",
    features: ["مصرف سوخت بهینه", "سیستم خنک‌کننده پیشرفته", "کنترل اتوماتیک"],
    price: "درخواست قیمت"
  },
  {
    id: 2,
    name: "مولد گازی طبیعی NG-300",
    category: "gas-generators",
    power: "300 کیلووات",
    image: "/api/placeholder/400/300",
    description: "مولد گاز طبیعی سازگار با محیط زیست",
    features: ["انتشار آلاینده کم", "راندمان بالا", "نگهداری آسان"],
    price: "درخواست قیمت"
  },
  {
    id: 3,
    name: "سیستم انرژی خورشیدی SP-100",
    category: "solar-systems",
    power: "100 کیلووات",
    image: "/api/placeholder/400/300",
    description: "سیستم انرژی خورشیدی کامل با باتری ذخیره",
    features: ["پنل‌های مونوکریستال", "اینورتر هوشمند", "سیستم نظارت آنلاین"],
    price: "درخواست قیمت"
  },
  {
    id: 4,
    name: "ژنراتور بادی WT-50",
    category: "wind-turbines",
    power: "50 کیلووات",
    image: "/api/placeholder/400/300",
    description: "توربین بادی مناسب برای مناطق پرباد",
    features: ["مقاوم در برابر طوفان", "تولید انرژی پایدار", "نصب آسان"],
    price: "درخواست قیمت"
  }
];

export const projects = [
  {
    id: 1,
    title: "پروژه تامین برق بیمارستان امام خمینی",
    location: "تهران، ایران",
    capacity: "2 مگاوات",
    year: "2023",
    image: "/api/placeholder/600/400",
    description: "نصب و راه‌اندازی سیستم تامین برق اضطراری برای بیمارستان",
    client: "وزارت بهداشت"
  },
  {
    id: 2,
    title: "مجتمع صنعتی پتروشیمی پارس",
    location: "عسلویه، بوشهر",
    capacity: "5 مگاوات",
    year: "2023",
    image: "/api/placeholder/600/400",
    description: "طراحی و اجرای سیستم تولید برق مستقل",
    client: "شرکت پتروشیمی پارس"
  },
  {
    id: 3,
    title: "نیروگاه خورشیدی شهرک صنعتی",
    location: "اصفهان، ایران",
    capacity: "1 مگاوات",
    year: "2022",
    image: "/api/placeholder/600/400",
    description: "احداث نیروگاه خورشیدی برای تامین برق شهرک صنعتی",
    client: "شرکت شهرک‌های صنعتی"
  }
];

export const services = [
  {
    id: 1,
    title: "نگهداری و تعمیرات",
    icon: "🔧",
    description: "خدمات نگهداری دوره‌ای و تعمیرات تخصصی تجهیزات",
    features: ["سرویس 24/7", "قطعات اصلی", "تکنسین‌های مجرب"]
  },
  {
    id: 2,
    title: "پشتیبانی فنی",
    icon: "📞",
    description: "پشتیبانی فنی و مشاوره تخصصی در تمام ساعات شبانه‌روز",
    features: ["مشاوره رایگان", "پاسخ سریع", "راهنمایی از راه دور"]
  },
  {
    id: 3,
    title: "آموزش و مشاوره",
    icon: "🎓",
    description: "دوره‌های آموزشی و مشاوره برای بهره‌برداری بهینه",
    features: ["آموزش عملی", "مدرک معتبر", "مشاوره تخصصی"]
  },
  {
    id: 4,
    title: "قرارداد نگهداری",
    icon: "📋",
    description: "قراردادهای نگهداری بلندمدت با تضمین عملکرد",
    features: ["تضمین عملکرد", "قیمت ثابت", "اولویت سرویس"]
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "آینده انرژی‌های تجدیدپذیر در ایران",
    excerpt: "بررسی پتانسیل‌ها و چالش‌های توسعه انرژی‌های تجدیدپذیر در کشور",
    date: "1402/12/15",
    author: "مهندس احمد محمدی",
    category: "انرژی تجدیدپذیر",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "نکات مهم در انتخاب ژنراتور مناسب",
    excerpt: "راهنمای جامع برای انتخاب ژنراتور متناسب با نیاز شما",
    date: "1402/12/10",
    author: "مهندس فاطمه کریمی",
    category: "ژنراتور",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "صرفه‌جویی در مصرف انرژی صنایع",
    excerpt: "روش‌های نوین کاهش مصرف انرژی در بخش صنعت",
    date: "1402/12/05",
    author: "مهندس علی رضایی",
    category: "بهینه‌سازی انرژی",
    image: "/api/placeholder/400/250"
  }
];

export const categories = [
  { id: "all", name: "همه محصولات" },
  { id: "diesel-generators", name: "ژنراتور دیزلی" },
  { id: "gas-generators", name: "ژنراتور گازی" },
  { id: "solar-systems", name: "سیستم خورشیدی" },
  { id: "wind-turbines", name: "توربین بادی" }
];