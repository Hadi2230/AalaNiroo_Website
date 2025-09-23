Energy Company Website - MVP Implementation Plan
Project Overview
Modern corporate website for energy engineering company specializing in generators, power equipment, and sustainable energy solutions.

Color Scheme
Primary: Blue (#1e40af, #3b82f6)
Secondary: Gray (#6b7280, #374151)
Accent: Light blue (#dbeafe)
Pages & Components to Create
1. Main Layout Components
Header.tsx - Navigation with logo, menu items, language selector
Footer.tsx - Company info, quick links, contact details
ChatWidget.tsx - Online chat support widget
2. Pages (7 main pages)
Index.tsx - Homepage with hero section, company intro, CTA
About.tsx - Company history, mission, values, team
Products.tsx - Products catalog with filtering and categories
Projects.tsx - Portfolio of completed projects
Services.tsx - After-sales services, maintenance, support
Contact.tsx - Contact form, Google map, contact information
Blog.tsx - News and technical articles section
3. Reusable Components
HeroSection.tsx - Large hero banner with CTA
ProductCard.tsx - Product display cards
ProjectCard.tsx - Project showcase cards
ServiceCard.tsx - Service offering cards
ContactForm.tsx - Contact/consultation request form
File Structure
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ChatWidget.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ServiceCard.tsx
│   │   └── ContactForm.tsx
├── pages/
│   ├── Index.tsx (Homepage)
│   ├── About.tsx
│   ├── Products.tsx
│   ├── Projects.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   └── Blog.tsx
└── data/
    └── mockData.ts (sample data for products, projects, etc.)
Key Features
Responsive design (mobile-friendly)
Modern blue/gray color scheme
Professional corporate look
Interactive elements and animations
Contact forms and CTAs
Product filtering capabilities
Project portfolio showcase
Online chat widget
Clean typography and layout
Implementation Priority
Layout components (Header, Footer)
Homepage with hero section
Products page with filtering
Projects showcase
About and Services pages
Contact page with form
Blog section
Chat widget integration