import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTruck, FiAward, FiShield, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { PRODUCTS, slugifyProduct } from '../common/products';
import { FaLeaf, FaIndustry, FaBoxes, FaHandshake } from 'react-icons/fa';

const Home = () => {
  useEffect(() => {
    document.title = 'The Planner Herbal International (TPH Int.)';
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Get featured products (first 3 from each category)
  const featuredProducts = [
    ...PRODUCTS.men.slice(2, 3), // Sultan Shahi Gold Majoon (3rd product)
    ...PRODUCTS.women.slice(2, 3), // BustMax Breast Oil (3rd product)
    ...PRODUCTS['weight-lose'].slice(1, 2) // Slim n Shape Fit Booster (2nd product)
  ].map(product => ({
    ...product,
    slug: slugifyProduct(product.name)
  }));

  const categories = [
    { 
      name: "Men's Wellness", 
      slug: "men", 
      image: "/images/MEN.png",
      description: 'Premium herbal supplements for men\'s health and vitality'
    },
    { 
      name: "Women's Wellness", 
      slug: "women", 
      image: "/images/WOMEN.png",
      description: 'Natural wellness products for women\'s health'
    },
    { 
      name: "Weight Management", 
      slug: "weight-lose", 
      image: "/images/WEIGHT LOSE.png",
      description: 'Herbal solutions for healthy weight management'
    }
  ];

  const features = [
    { image: "https://i.ibb.co/jvNGRNQb/Premium-Quality-Ingredients.jpg", title: "Premium Quality Ingredients" },
    { image: "https://i.ibb.co/xSzPWJPD/GMP-Certified-Facility.jpg", title: "GMP Certified Facility" },
    { image: "https://i.ibb.co/bj7h4cZX/Custom-Packaging-Private-Label.jpg", title: "Custom Packaging & Private Label" },
    { image: "https://i.ibb.co/kgDfgnP4/OEM-Services-for-Businesses.jpg", title: "OEM Services for Businesses" }
  ];

  return (
    <div className="bg-white">
      {/* 1️⃣ Hero Section */}
      <section className="relative bg-gradient-to-r from-red-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co/V0HyJDjG/Home-Page-Hero-Section-Banner.jpg')] bg-cover bg-center mix-blend-overlay opacity-5"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              {/* Animated Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['100% Natural', 'GMP Certified', 'Herbal Remedies'].map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="inline-block px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-full shadow-md"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Natural Health &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Nutritional Products</span><br />
                <span className="text-2xl md:text-3xl text-gray-600 font-medium">Since 2002</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Premium herbal supplements trusted by thousands across Pakistan. Experience the power of nature with our scientifically-backed formulations for men's wellness, women's health, and weight management.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/shop" 
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Shop Now
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-2xl transform rotate-3 -z-10 blur-xl opacity-70"></div>
                <img 
                  src="https://i.ibb.co/KxZ5fYzt/Why-Choose-TPH-Int.jpg" 
                  alt="Herbal Products" 
                  className="w-full h-auto rounded-2xl shadow-2xl border-8 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Herbal+Products';
                  }}
                />
                
                {/* Floating Badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -5 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-xl shadow-xl border border-gray-200 flex items-center gap-3"
                >
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Trusted Since</p>
                    <p className="font-bold text-2xl text-gray-900">2002</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero Bottom CTA */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: <FiTruck className="w-6 h-6" />, text: "Free Delivery", desc: "Across Pakistan" },
              { icon: <FaLeaf className="w-6 h-6" />, text: "100% Natural", desc: "Herbal Ingredients" },
              { icon: <FiShield className="w-6 h-6" />, text: "GMP Certified", desc: "Quality Assured" },
              { icon: <FiAward className="w-6 h-6" />, text: "Trusted Brand", desc: "20+ Years" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-white p-4 rounded-xl shadow-sm border border-red-100 min-w-[200px]"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full text-white">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.text}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2️⃣ Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Best Sellers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Discover our most popular herbal products trusted by thousands of customers
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100"
              >
                <div className="h-64 overflow-hidden bg-white flex items-center justify-center p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/600x600?text=${product.name.replace(/\s+/g, '+')}`;
                    }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {product.description?.split('\n')[0] || 'Premium herbal supplement for optimal health'}
                  </p>
                  <div className="mt-auto">
                    <p className="text-red-600 font-bold text-xl mb-4">PKR {product.price.toLocaleString()}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/product/${product.slug}`}
                        className="flex-1 text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </Link>
                      <a 
                        href={`https://wa.me/923328888935?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaWhatsapp className="text-lg" />
                        Order
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              View All Products
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3️⃣ Why Choose TPH Int. - Dark Theme Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TPH Int.</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              We're committed to providing premium quality herbal products with unmatched standards
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 group"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4️⃣ About TPH Int. */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-red-700 opacity-20"></div>
                <img 
                  src="https://i.ibb.co/KxZ5fYzt/Why-Choose-TPH-Int.jpg" 
                  alt="TPH International" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=TPH+International';
                  }}
                />
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About TPH International</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Since 2002, The Planner Herbal International has been at the forefront of producing premium herbal health products. 
                We cater not only to individual wellness needs but also provide comprehensive OEM solutions for businesses 
                looking to launch their own line of herbal supplements.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: <FaIndustry className="text-red-500" />, title: "Manufacturing", desc: "GMP Certified Facility" },
                  { icon: <FaBoxes className="text-red-500" />, title: "Packaging", desc: "Custom Solutions" },
                  { icon: <FaHandshake className="text-red-500" />, title: "Partnership", desc: "OEM Services" },
                  { icon: <FiAward className="text-red-500" />, title: "Quality", desc: "20+ Years Experience" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 text-xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/about" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Learn More About Us
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5️⃣ Product Categories - Dark Theme Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Product Categories</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Explore our range of premium herbal products designed for your specific wellness needs
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
              >
                <div className="h-64 overflow-hidden bg-gradient-to-br from-red-900/20 to-gray-800 flex items-center justify-center p-8">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/600x400?text=${category.name.replace(/\s+/g, '+')}`;
                    }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                  <Link 
                    to={`/shop/${category.slug}`}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-md hover:shadow-lg"
                  >
                    Explore {category.name.split(' ')[0]}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Quality Assurance */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
              <FiShield className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Quality You Can Trust</h2>
            <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
              "We follow strict quality standards at every step – from ingredient sourcing to final packaging."
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['GMP Certified', '100% Natural', 'Clinically Tested', 'No Side Effects'].map((item, index) => (
                <span key={index} className="px-4 py-2 bg-white text-green-700 font-medium rounded-full shadow-sm border border-green-200">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7️⃣ CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the TPH Difference?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Whether you're looking for premium herbal supplements or want to start your own brand, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="mr-2" />
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="mr-2" />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;