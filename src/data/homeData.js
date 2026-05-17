import { imageUrls } from '../assets/images/imageUrls';

export const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/repair-services', label: 'Repair Services' },
  { href: '#coverage', label: 'Coverage' },
  { href: '/contact', label: 'Contact' },
];

export const howItWorks = [
  { icon: 'smartphone', title: 'Browse & Order', desc: 'Select from our premium catalog', step: '01' },
  { icon: 'check', title: 'Instant Confirmation', desc: 'Real-time availability check', step: '02' },
  { icon: 'zap', title: 'Express Processing', desc: 'Prepared within 30 minutes', step: '03' },
  { icon: 'package', title: '4-Hour Delivery', desc: 'Delivered to your doorstep', step: '04' },
];

export const categories = [
  {
    icon: 'laptop',
    title: 'Laptops & Computers',
    count: '150+',
    image: imageUrls.categoryLaptop,
  },
  {
    icon: 'smartphone',
    title: 'Smartphones',
    count: '200+',
    image: imageUrls.categorySmartphone,
  },
  {
    icon: 'headphones',
    title: 'Accessories',
    count: '300+',
    image: imageUrls.categoryAccessories,
  },
  {
    icon: 'monitor',
    title: 'Refurbished',
    count: '100+',
    image: imageUrls.categoryRefurbished,
  },
];

export const services = [
  {
    icon: 'laptop',
    title: 'Laptop Repair',
    services: ['Screen Replacement', 'Battery Upgrade', 'Performance Boost', 'Data Recovery'],
    price: 'Starting Rs 499',
  },
  {
    icon: 'smartphone',
    title: 'Mobile Repair',
    services: ['Screen Fix', 'Battery Replacement', 'Water Damage', 'Software Update'],
    price: 'Starting Rs 299',
  },
  {
    icon: 'wrench',
    title: 'Computer Repair',
    services: ['Hardware Upgrade', 'Virus Removal', 'OS Installation', 'Network Setup'],
    price: 'Starting Rs 599',
  },
];

export const whyChoose = [
  { icon: 'clock', title: '4-Hour Guarantee', desc: "Delivery or repair within 4 hours, or it's free" },
  { icon: 'shield', title: '100% Warranty', desc: 'All products and repairs backed by warranty' },
  { icon: 'zap', title: 'Expert Technicians', desc: 'Certified professionals with 10+ years experience' },
  { icon: 'star', title: 'Premium Quality', desc: 'Only authentic products and certified parts' },
];

export const coverageAreas = [
  'Pimpri-Chinchwad',
  'Kothrud & Warje',
  'Hadapsar & Magarpatta',
  'Shivajinagar & Camp',
  'Aundh & Baner',
  'Wakad & Hinjewadi',
];

export const deals = [
  {
    name: 'MacBook Air M2',
    price: 'Rs 84,999',
    original: 'Rs 94,999',
    image: imageUrls.dealMacbook,
    badge: 'Save Rs 10,000',
  },
  {
    name: 'iPhone 15 Pro',
    price: 'Rs 1,24,999',
    original: 'Rs 1,34,999',
    image: imageUrls.dealIphone,
    badge: 'Bestseller',
  },
  {
    name: 'Sony WH-1000XM5',
    price: 'Rs 26,999',
    original: 'Rs 31,999',
    image: imageUrls.dealHeadphones,
    badge: 'New Arrival',
  },
];

export const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    review:
      'Got my MacBook screen repaired in just 3 hours! The service quality is exceptional and the pricing is transparent.',
  },
  {
    name: 'Rajesh Patil',
    role: 'Business Owner',
    review:
      'Ordered a laptop at 2 PM, delivered by 5:30 PM. The 4-hour promise is real. Highly recommend EAXY STORE!',
  },
  {
    name: 'Anita Deshmukh',
    role: 'Designer',
    review:
      'Premium quality refurbished iPhone at an amazing price. Works like new and saved me 30%. Customer service is top-notch!',
  },
];
