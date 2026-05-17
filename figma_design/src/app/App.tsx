import { motion } from "motion/react";
import { Zap, Package, Wrench, Shield, Clock, MapPin, Star, ChevronRight, CheckCircle2, Laptop, Smartphone, Headphones, Monitor, Phone, Mail, MapPinned } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0F1115]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1115]/80 backdrop-blur-xl border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0F6B53] to-[#D4AF37] rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-2xl text-white tracking-tight">EAZY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#F5F7FA]/70">
            <a href="#products" className="hover:text-[#D4AF37] transition-colors">Products</a>
            <a href="#services" className="hover:text-[#D4AF37] transition-colors">Repair Services</a>
            <a href="#coverage" className="hover:text-[#D4AF37] transition-colors">Coverage</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </div>
          <button className="px-6 py-2.5 bg-[#0F6B53] text-white rounded-lg hover:bg-[#0F6B53]/90 transition-all hover:shadow-[0_0_20px_rgba(15,107,83,0.5)]">
            Order Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2B] via-[#0F1115] to-[#0F1115]" />
        <div className="absolute top-20 right-0 w-1/2 h-1/2 bg-[#0F6B53]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#D4AF37]/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F6B53]/20 border border-[#0F6B53]/30 rounded-full mb-6 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-[#F5F7FA]/90">4-Hour Promise Across Pune</span>
            </motion.div>

            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-6xl lg:text-7xl text-white mb-6 leading-[1.1]">
              Premium Tech.
              <br />
              <span className="bg-gradient-to-r from-[#0F6B53] to-[#D4AF37] bg-clip-text text-transparent">
                Lightning Fast.
              </span>
            </h1>

            <p className="text-xl text-[#F5F7FA]/70 mb-8 max-w-xl">
              New and refurbished electronics delivered or repaired within 4 hours across Pune district.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#0F6B53] text-white rounded-xl flex items-center gap-2 shadow-[0_0_30px_rgba(15,107,83,0.4)] hover:shadow-[0_0_40px_rgba(15,107,83,0.6)] transition-all"
              >
                Shop Products
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
              >
                Book Repair
              </motion.button>
            </div>

            <div className="flex gap-8">
              <div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>4hrs</div>
                <div className="text-sm text-[#F5F7FA]/60">Delivery Time</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>24/7</div>
                <div className="text-sm text-[#F5F7FA]/60">Support</div>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>100%</div>
                <div className="text-sm text-[#F5F7FA]/60">Warranty</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1773418517695-c3d0c21b7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbGFwdG9wJTIwbWFjYm9vayUyMHNsZWVrJTIwbW9kZXJufGVufDF8fHx8MTc3NTcyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Premium laptop"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent" />
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(15,107,83,0.3)',
                  '0 0 40px rgba(15,107,83,0.5)',
                  '0 0 20px rgba(15,107,83,0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 px-6 py-4 bg-[#1A1F2B]/90 backdrop-blur-xl border border-[#0F6B53]/30 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#0F6B53] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm">Next delivery in</div>
                  <div className="text-[#D4AF37] text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>3h 42min</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
              How It Works
            </h2>
            <p className="text-[#F5F7FA]/70 text-lg">Simple process, instant results</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Smartphone, title: "Browse & Order", desc: "Select from our premium catalog", step: "01" },
              { icon: CheckCircle2, title: "Instant Confirmation", desc: "Real-time availability check", step: "02" },
              { icon: Zap, title: "Express Processing", desc: "Prepared within 30 minutes", step: "03" },
              { icon: Package, title: "4-Hour Delivery", desc: "Delivered to your doorstep", step: "04" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="p-8 bg-gradient-to-b from-[#1A1F2B] to-[#1A1F2B]/50 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-[#0F6B53]/50 transition-all">
                  <div className="absolute top-6 right-6 text-6xl text-white/5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0F6B53] to-[#D4AF37] rounded-xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(15,107,83,0.5)] transition-all">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-[#F5F7FA]/60">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
              Product Categories
            </h2>
            <p className="text-[#F5F7FA]/70 text-lg">Premium tech for every need</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Laptop,
                title: "Laptops & Computers",
                count: "150+",
                image: "https://images.unsplash.com/photo-1758979919845-9d688cceb7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbGFwdG9wJTIwbWFjYm9vayUyMHNsZWVrJTIwbW9kZXJufGVufDF8fHx8MTc3NTcyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              },
              {
                icon: Smartphone,
                title: "Smartphones",
                count: "200+",
                image: "https://images.unsplash.com/photo-1758348844351-48e1ec64cd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwaXBob25lJTIwdGVjaG5vbG9neSUyMHByZW1pdW18ZW58MXx8fHwxNzc1NzIzNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
              },
              {
                icon: Headphones,
                title: "Accessories",
                count: "300+",
                image: "https://images.unsplash.com/photo-1756576501784-3c3474212d44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBoZWFkcGhvbmVzJTIwd2lyZWxlc3N8ZW58MXx8fHwxNzc1NzIzNzc4fDA&ixlib=rb-4.1.0&q=80&w=1080"
              },
              {
                icon: Monitor,
                title: "Refurbished",
                count: "100+",
                image: "https://images.unsplash.com/photo-1760597371632-bbd930d6b844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwbGFwdG9wJTIwbWFjYm9vayUyMHNsZWVrJTIwbW9kZXJufGVufDF8fHx8MTc3NTcyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              }
            ].map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#1A1F2B] border border-white/5 hover:border-[#0F6B53]/50 transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#0F6B53]/90 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-[#0F6B53] transition-colors">
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs">
                        {category.count} items
                      </span>
                    </div>
                    <h3 className="text-xl text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {category.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Repair Services */}
      <section id="services" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F6B53]/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
              Repair Services
            </h2>
            <p className="text-[#F5F7FA]/70 text-lg">Expert repairs within 4 hours</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Laptop,
                title: "Laptop Repair",
                services: ["Screen Replacement", "Battery Upgrade", "Performance Boost", "Data Recovery"],
                price: "Starting ₹499"
              },
              {
                icon: Smartphone,
                title: "Mobile Repair",
                services: ["Screen Fix", "Battery Replacement", "Water Damage", "Software Update"],
                price: "Starting ₹299"
              },
              {
                icon: Monitor,
                title: "Computer Repair",
                services: ["Hardware Upgrade", "Virus Removal", "OS Installation", "Network Setup"],
                price: "Starting ₹599"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="p-8 bg-gradient-to-br from-[#1A1F2B]/80 to-[#1A1F2B]/40 backdrop-blur-2xl border border-white/10 rounded-2xl hover:border-[#0F6B53]/50 transition-all hover:shadow-[0_0_40px_rgba(15,107,83,0.2)]">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0F6B53] to-[#0F6B53]/70 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(15,107,83,0.5)] transition-all">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {service.title}
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {service.services.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#F5F7FA]/70">
                        <CheckCircle2 className="w-5 h-5 text-[#0F6B53] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-white/10">
                    <div className="text-[#D4AF37] mb-4">{service.price}</div>
                    <button className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-[#0F6B53] hover:border-[#0F6B53] transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
              Why Choose EAZY
            </h2>
            <p className="text-[#F5F7FA]/70 text-lg">Trust built on speed and quality</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "4-Hour Guarantee", desc: "Delivery or repair within 4 hours, or it's free" },
              { icon: Shield, title: "100% Warranty", desc: "All products and repairs backed by warranty" },
              { icon: Zap, title: "Expert Technicians", desc: "Certified professionals with 10+ years experience" },
              { icon: Star, title: "Premium Quality", desc: "Only authentic products and certified parts" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 text-center bg-[#1A1F2B]/30 border border-white/5 rounded-2xl hover:bg-[#1A1F2B]/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#D4AF37]/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-[#0F1115]" />
                </div>
                <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-[#F5F7FA]/60">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pune Coverage */}
      <section id="coverage" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F6B53]/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-6">
                Complete Pune District Coverage
              </h2>
              <p className="text-[#F5F7FA]/70 text-lg mb-8">
                From Pimpri-Chinchwad to Hadapsar, we cover every corner of Pune with our 4-hour service promise.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Pimpri-Chinchwad",
                  "Kothrud & Warje",
                  "Hadapsar & Magarpatta",
                  "Shivajinagar & Camp",
                  "Aundh & Baner",
                  "Wakad & Hinjewadi"
                ].map((area, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <MapPin className="w-5 h-5 text-[#0F6B53]" />
                    <span className="text-[#F5F7FA]/80">{area}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-6 bg-[#0F6B53]/10 border border-[#0F6B53]/30 rounded-2xl backdrop-blur-sm">
                <MapPinned className="w-12 h-12 text-[#0F6B53]" />
                <div>
                  <div className="text-white mb-1">Check Your Area</div>
                  <div className="text-[#F5F7FA]/60 text-sm">Enter pincode to verify 4-hour delivery</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-[#1A1F2B] to-[#0F1115] rounded-2xl border border-[#0F6B53]/30 p-12 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-24 h-24 text-[#0F6B53] mx-auto mb-6" />
                  <div className="text-6xl text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    100%
                  </div>
                  <div className="text-[#F5F7FA]/70 text-xl">Pune District Coverage</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#0F6B53]/20 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
                Hot Deals
              </h2>
              <p className="text-[#F5F7FA]/70 text-lg">Limited time offers on premium tech</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#0F6B53] hover:text-[#D4AF37] transition-colors">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "MacBook Air M2",
                price: "₹84,999",
                original: "₹94,999",
                image: "https://images.unsplash.com/photo-1773418517695-c3d0c21b7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbGFwdG9wJTIwbWFjYm9vayUyMHNsZWVrJTIwbW9kZXJufGVufDF8fHx8MTc3NTcyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
                badge: "Save ₹10,000"
              },
              {
                name: "iPhone 15 Pro",
                price: "₹1,24,999",
                original: "₹1,34,999",
                image: "https://images.unsplash.com/photo-1758348844351-48e1ec64cd96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwaXBob25lJTIwdGVjaG5vbG9neSUyMHByZW1pdW18ZW58MXx8fHwxNzc1NzIzNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
                badge: "Bestseller"
              },
              {
                name: "Sony WH-1000XM5",
                price: "₹26,999",
                original: "₹31,999",
                image: "https://images.unsplash.com/photo-1760264374483-ec214bec6c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXMlMjBoZWFkcGhvbmVzJTIwd2lyZWxlc3N8ZW58MXx8fHwxNzc1NzIzNzc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
                badge: "New Arrival"
              }
            ].map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="bg-[#1A1F2B] border border-white/5 rounded-2xl overflow-hidden hover:border-[#0F6B53]/50 transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-[#D4AF37] text-[#0F1115] text-xs rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-2xl text-[#0F6B53]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {product.price}
                      </span>
                      <span className="text-[#F5F7FA]/40 line-through">
                        {product.original}
                      </span>
                    </div>
                    <button className="w-full px-6 py-3 bg-[#0F6B53] text-white rounded-xl hover:bg-[#0F6B53]/90 transition-all hover:shadow-[0_0_20px_rgba(15,107,83,0.5)]">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-5xl text-white mb-4">
              Customer Stories
            </h2>
            <p className="text-[#F5F7FA]/70 text-lg">Trusted by 10,000+ customers across Pune</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "Software Engineer", review: "Got my MacBook screen repaired in just 3 hours! The service quality is exceptional and the pricing is transparent.", rating: 5 },
              { name: "Rajesh Patil", role: "Business Owner", review: "Ordered a laptop at 2 PM, delivered by 5:30 PM. The 4-hour promise is real. Highly recommend EAZY Store!", rating: 5 },
              { name: "Anita Deshmukh", role: "Designer", review: "Premium quality refurbished iPhone at an amazing price. Works like new and saved me 30%. Customer service is top-notch!", rating: 5 }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gradient-to-br from-[#1A1F2B]/60 to-[#1A1F2B]/30 backdrop-blur-xl border border-white/10 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-[#F5F7FA]/80 mb-6 leading-relaxed">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0F6B53] to-[#D4AF37] rounded-full" />
                  <div>
                    <div className="text-white">{testimonial.name}</div>
                    <div className="text-[#F5F7FA]/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F6B53] to-[#0F6B53]/80 p-12 md:p-16"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4AF37]/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-white">Urgent Service Available</span>
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-4xl md:text-5xl text-white mb-6 leading-tight">
                Need Urgent Repair or Delivery?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl">
                Our expert technicians are ready to help. Get your device repaired or delivered within 4 hours, anywhere in Pune.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[#0F6B53] rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <Phone className="w-5 h-5" />
                  Call Now: 1800-EAZY-000
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                >
                  Schedule Pickup
                </motion.button>
              </div>
            </div>
            <div className="absolute bottom-0 right-12 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1768633647910-7e6fb53e5b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHJlcGFpciUyMGVsZWN0cm9uaWNzJTIwdGVjaG5pY2lhbnxlbnwxfHx8fDE3NzU3MjM3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Repair service"
                className="w-64 h-64 object-cover rounded-2xl opacity-20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0F6B53] to-[#D4AF37] rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif' }} className="text-2xl text-white">EAZY</span>
              </div>
              <p className="text-[#F5F7FA]/60 mb-6">
                Premium tech delivered and repaired within 4 hours across Pune.
              </p>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'Instagram'].map((social, idx) => (
                  <div key={idx} className="w-10 h-10 bg-white/5 hover:bg-[#0F6B53] rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-white text-xs">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Products</h4>
              <ul className="space-y-3 text-[#F5F7FA]/60">
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Laptops</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Smartphones</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Accessories</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Refurbished</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Services</h4>
              <ul className="space-y-3 text-[#F5F7FA]/60">
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Laptop Repair</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Mobile Repair</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Computer Repair</li>
                <li className="hover:text-[#0F6B53] cursor-pointer transition-colors">Express Delivery</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Contact</h4>
              <ul className="space-y-3 text-[#F5F7FA]/60">
                <li className="flex items-start gap-2">
                  <Phone className="w-5 h-5 text-[#0F6B53] flex-shrink-0 mt-0.5" />
                  <span>1800-EAZY-000</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-[#0F6B53] flex-shrink-0 mt-0.5" />
                  <span>support@eazystore.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-[#0F6B53] flex-shrink-0 mt-0.5" />
                  <span>Pune, Maharashtra, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#F5F7FA]/60 text-sm">
              © 2026 EAZY Store. All rights reserved.
            </div>
            <div className="flex gap-6 text-[#F5F7FA]/60 text-sm">
              <a href="#" className="hover:text-[#0F6B53] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0F6B53] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#0F6B53] transition-colors">Warranty Info</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}