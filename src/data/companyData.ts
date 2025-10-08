// Aalaniroo Company Data - Bilingual Support
export const companyInfo = {
  fa: {
    name: "شرکت اعلا نیرو",
    tagline: "پیشرو در تولید و تامین ژنراتورهای صنعتی",
    description: "با بیش از 33 سال تجربه در صنعت ژنراتور، نماینده رسمی برندهای معتبر جهانی",
    phone: "021-58635",
    whatsapp: "+989121234567",
    address: "تهران، بزرگراه مدرس، نرسیده به میدان هفت تیر، مقابل خیابان زهره",
    email: "info@aalaniroo.com",
    quoteMessage: "درخواست پیش‌فاکتور شما ثبت شد. همکاران ما به‌زودی با شما تماس می‌گیرند.",
    contactMessage: "برای ارتباط سریع با ما، با شماره 021-58635 تماس بگیرید یا در واتس‌اپ پیام دهید.",
    addressMessage: "آدرس شرکت: تهران، بزرگراه مدرس، نرسیده به میدان هفت تیر، مقابل خیابان زهره"
  },
  en: {
    name: "Aalaniroo Power Company",
    tagline: "Leading Industrial Generator Manufacturer & Supplier",
    description: "Over 33 years of experience in generator industry, official representative of global trusted brands",
    phone: "+98-21-58635",
    whatsapp: "+989121234567",
    address: "Tehran, Modarres Highway, Before Haft Tir Square, Opposite Zohreh Street",
    email: "info@aalaniroo.com",
    quoteMessage: "Your quote request has been received. We will contact you shortly.",
    contactMessage: "Contact us at +98-21-58635 or send a WhatsApp message.",
    addressMessage: "Company Address: Tehran, Modarres Hwy, Before Haft Tir Sq., Opposite Zohreh St."
  }
};

export const products = {
  fa: [
    {
      id: 1,
      name: "دیزل ژنراتور FG Wilson",
      category: "diesel-generators",
      power: "10-2500 کیلووات",
      cylinders: "3-16 سیلندر",
      fuel: "دیزل",
      brand: "FG Wilson",
      image: "/api/placeholder/600/400",
      description: "ژنراتورهای دیزلی FG Wilson با کیفیت برتر و قابلیت اطمینان بالا",
      features: [
        "موتور Perkins اصلی انگلستان",
        "آلترناتور Stamford",
        "سیستم کنترل دیجیتال",
        "تانک سوخت داخلی",
        "سیستم خنک‌کاری رادیاتور"
      ],
      applications: ["صنعتی", "بیمارستانی", "مخابراتی", "ساختمانی"],
      warranty: "2 سال یا 2000 ساعت کار",
      pdf: "/catalogs/fg-wilson-fa.pdf"
    },
    {
      id: 2,
      name: "مولد گازسوز Cummins",
      category: "gas-generators", 
      power: "20-1000 کیلووات",
      cylinders: "4-12 سیلندر",
      fuel: "گاز طبیعی",
      brand: "Cummins",
      image: "/api/placeholder/600/400",
      description: "مولدهای گازسوز Cummins برای تولید برق پایدار و اقتصادی",
      features: [
        "موتور Cummins گازسوز",
        "مصرف سوخت بهینه",
        "انتشار آلاینده کم",
        "عملکرد مداوم 24/7",
        "سیستم کنترل هوشمند"
      ],
      applications: ["نیروگاهی", "صنعتی", "CHP", "تولید پراکنده"],
      warranty: "3 سال یا 3000 ساعت کار",
      pdf: "/catalogs/cummins-gas-fa.pdf"
    },
    {
      id: 3,
      name: "موتور برق کوچک",
      category: "portable-generators",
      power: "1-15 کیلووات", 
      cylinders: "1-2 سیلندر",
      fuel: "بنزین/دیزل",
      brand: "Honda/Yamaha",
      image: "/api/placeholder/600/400",
      description: "موتورهای برق قابل حمل برای مصارف خانگی و کوچک",
      features: [
        "طراحی کامپکت و سبک",
        "راه‌اندازی آسان",
        "مصرف سوخت کم",
        "سطح صدای پایین",
        "قابلیت حمل بالا"
      ],
      applications: ["خانگی", "کمپینگ", "ابزار برقی", "اضطراری"],
      warranty: "1 سال",
      pdf: "/catalogs/portable-generators-fa.pdf"
    }
  ],
  en: [
    {
      id: 1,
      name: "FG Wilson Diesel Generator",
      category: "diesel-generators",
      power: "10-2500 kW",
      cylinders: "3-16 Cylinders",
      fuel: "Diesel",
      brand: "FG Wilson",
      image: "/api/placeholder/600/400",
      description: "FG Wilson diesel generators with superior quality and high reliability",
      features: [
        "Original Perkins Engine from UK",
        "Stamford Alternator", 
        "Digital Control System",
        "Internal Fuel Tank",
        "Radiator Cooling System"
      ],
      applications: ["Industrial", "Hospital", "Telecom", "Commercial"],
      warranty: "2 years or 2000 hours",
      pdf: "/catalogs/fg-wilson-en.pdf"
    },
    {
      id: 2,
      name: "Cummins Gas Generator",
      category: "gas-generators",
      power: "20-1000 kW", 
      cylinders: "4-12 Cylinders",
      fuel: "Natural Gas",
      brand: "Cummins",
      image: "/api/placeholder/600/400",
      description: "Cummins gas generators for sustainable and economical power generation",
      features: [
        "Cummins Gas Engine",
        "Optimized Fuel Consumption",
        "Low Emissions",
        "24/7 Continuous Operation",
        "Smart Control System"
      ],
      applications: ["Power Plant", "Industrial", "CHP", "Distributed Generation"],
      warranty: "3 years or 3000 hours",
      pdf: "/catalogs/cummins-gas-en.pdf"
    },
    {
      id: 3,
      name: "Portable Generator",
      category: "portable-generators",
      power: "1-15 kW",
      cylinders: "1-2 Cylinders", 
      fuel: "Gasoline/Diesel",
      brand: "Honda/Yamaha",
      image: "/api/placeholder/600/400",
      description: "Portable generators for residential and small applications",
      features: [
        "Compact & Lightweight Design",
        "Easy Start-up",
        "Low Fuel Consumption",
        "Low Noise Level",
        "High Portability"
      ],
      applications: ["Residential", "Camping", "Power Tools", "Emergency"],
      warranty: "1 year",
      pdf: "/catalogs/portable-generators-en.pdf"
    }
  ]
};

export const projects = {
  fa: [
    {
      id: 1,
      title: "نیروگاه 50 مگاواتی پارس جنوبی",
      location: "عسلویه، بوشهر",
      capacity: "50 مگاوات",
      year: "2023",
      client: "شرکت پتروشیمی پارس",
      description: "طراحی، تامین و نصب 20 دستگاه ژنراتور گازسوز Cummins",
      image: "/api/placeholder/800/500",
      gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      status: "تکمیل شده",
      duration: "18 ماه"
    },
    {
      id: 2,
      title: "بیمارستان امام خمینی تهران",
      location: "تهران",
      capacity: "2 مگاوات",
      year: "2023",
      client: "دانشگاه علوم پزشکی تهران",
      description: "سیستم برق اضطراری با 4 دستگاه ژنراتور FG Wilson",
      image: "/api/placeholder/800/500",
      gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      status: "در حال بهره‌برداری",
      duration: "8 ماه"
    }
  ],
  en: [
    {
      id: 1,
      title: "50MW Pars South Power Plant",
      location: "Asaluyeh, Bushehr",
      capacity: "50 MW",
      year: "2023", 
      client: "Pars Petrochemical Company",
      description: "Design, supply and installation of 20 Cummins gas generators",
      image: "/api/placeholder/800/500",
      gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      status: "Completed",
      duration: "18 months"
    },
    {
      id: 2,
      title: "Imam Khomeini Hospital Tehran",
      location: "Tehran",
      capacity: "2 MW",
      year: "2023",
      client: "Tehran University of Medical Sciences", 
      description: "Emergency power system with 4 FG Wilson generators",
      image: "/api/placeholder/800/500",
      gallery: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      status: "In Operation",
      duration: "8 months"
    }
  ]
};

export const services = {
  fa: [
    {
      id: 1,
      title: "مشاوره و مهندسی فروش",
      icon: "🔧",
      description: "ارائه مشاوره تخصصی برای انتخاب بهترین ژنراتور",
      features: [
        "بررسی نیاز مشتری",
        "محاسبه بار الکتریکی",
        "انتخاب مدل مناسب",
        "ارائه پیش‌فاکتور"
      ]
    },
    {
      id: 2,
      title: "نصب و راه‌اندازی",
      icon: "⚙️",
      description: "نصب حرفه‌ای و راه‌اندازی تجهیزات توسط تیم متخصص",
      features: [
        "نظارت بر نصب",
        "تست و راه‌اندازی",
        "آموزش بهره‌بردار",
        "تحویل به مشتری"
      ]
    },
    {
      id: 3,
      title: "خدمات پس از فروش",
      icon: "🛠️",
      description: "پشتیبانی کامل و خدمات نگهداری دوره‌ای",
      features: [
        "سرویس دوره‌ای",
        "تعمیرات اساسی",
        "تامین قطعات یدکی",
        "پشتیبانی 24/7"
      ]
    }
  ],
  en: [
    {
      id: 1,
      title: "Consultation & Sales Engineering",
      icon: "🔧",
      description: "Professional consultation for selecting the best generator",
      features: [
        "Customer Needs Analysis",
        "Load Calculation",
        "Model Selection",
        "Quotation Preparation"
      ]
    },
    {
      id: 2,
      title: "Installation & Commissioning",
      icon: "⚙️", 
      description: "Professional installation and commissioning by expert team",
      features: [
        "Installation Supervision",
        "Testing & Commissioning",
        "Operator Training",
        "Customer Handover"
      ]
    },
    {
      id: 3,
      title: "After Sales Service",
      icon: "🛠️",
      description: "Complete support and periodic maintenance services",
      features: [
        "Periodic Service",
        "Major Repairs",
        "Spare Parts Supply",
        "24/7 Support"
      ]
    }
  ]
};

export const categories = {
  fa: [
    { id: "all", name: "همه محصولات" },
    { id: "diesel-generators", name: "دیزل ژنراتور" },
    { id: "gas-generators", name: "مولد گازسوز" },
    { id: "portable-generators", name: "موتور برق قابل حمل" },
    { id: "accessories", name: "متعلقات و لوازم جانبی" }
  ],
  en: [
    { id: "all", name: "All Products" },
    { id: "diesel-generators", name: "Diesel Generators" },
    { id: "gas-generators", name: "Gas Generators" },
    { id: "portable-generators", name: "Portable Generators" },
    { id: "accessories", name: "Accessories & Parts" }
  ]
};

export const blogPosts = {
  fa: [
    {
      id: 1,
      title: "راهنمای انتخاب ژنراتور مناسب برای صنایع",
      excerpt: "نکات کلیدی برای انتخاب بهترین ژنراتور متناسب با نیاز صنعتی شما",
      date: "1403/01/15",
      author: "مهندس احمد محمدی",
      category: "راهنما",
      image: "/api/placeholder/400/250",
      readTime: "5 دقیقه"
    },
    {
      id: 2,
      title: "نگهداری دوره‌ای ژنراتور: کلید طول عمر بیشتر",
      excerpt: "اهمیت سرویس منظم و نحوه انجام نگهداری صحیح ژنراتور",
      date: "1403/01/10", 
      author: "مهندس فاطمه کریمی",
      category: "نگهداری",
      image: "/api/placeholder/400/250",
      readTime: "7 دقیقه"
    }
  ],
  en: [
    {
      id: 1,
      title: "Guide to Selecting the Right Generator for Industries",
      excerpt: "Key points for choosing the best generator suitable for your industrial needs",
      date: "2024-04-04",
      author: "Eng. Ahmad Mohammadi", 
      category: "Guide",
      image: "/api/placeholder/400/250",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Periodic Generator Maintenance: Key to Longer Life",
      excerpt: "Importance of regular service and proper generator maintenance procedures",
      date: "2024-03-30",
      author: "Eng. Fatemeh Karimi",
      category: "Maintenance", 
      image: "/api/placeholder/400/250",
      readTime: "7 min read"
    }
  ]
};
