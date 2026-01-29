'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const brands = [
  'Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 
  'Cartier', 'TAG Heuer', 'Breitling', 'IWC'
];

const features = [
  {
    icon: (
      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Certified Authentic',
    description: 'Every watch verified by master horologists with certificate of authenticity'
  },
  {
    icon: (
      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
      </svg>
    ),
    title: 'Free Insured Shipping',
    description: 'Complimentary worldwide delivery with full insurance coverage'
  },
  {
    icon: (
      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
      </svg>
    ),
    title: '2-Year Warranty',
    description: 'Comprehensive protection for your investment with expert service'
  },
  {
    icon: (
      <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    ),
    title: '30-Day Returns',
    description: 'Shop with confidence knowing you have a full month to decide'
  }
];

const testimonials = [
  {
    name: 'James Mitchell',
    role: 'Watch Collector',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    content: 'Exceptional service and authenticity. My Rolex Submariner arrived in pristine condition with all documentation. Truly a luxury experience.'
  },
  {
    name: 'Sarah Chen',
    role: 'Business Executive',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content: 'LuxWatch made purchasing my first Patek Philippe effortless. Their expertise and attention to detail is unmatched in the industry.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    content: 'The authentication process gave me complete confidence. My Audemars Piguet is exactly as described. Will definitely buy again.'
  }
];

const stats = [
  { value: '15K+', label: 'Happy Clients' },
  { value: '50K+', label: 'Watches Sold' },
  { value: '200+', label: 'Luxury Brands' },
  { value: '99.8%', label: 'Satisfaction Rate' }
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-heading text-4xl font-bold text-primary md:text-5xl"
          >
            Why Choose LuxWatch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg text-gray-600"
          >
            Experience the pinnacle of luxury watch retail
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold/10 text-gold">
                {feature.icon}
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                {feature.title}
              </h3>
              <p className="font-body text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandsSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary">
            Featuring Prestigious Brands
          </h2>
          <p className="font-body text-gray-600">
            Curated collection from the world's finest watchmakers
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="font-heading text-sm font-semibold text-gray-700">
                {brand}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-2 font-heading text-5xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="font-body text-lg text-white/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-heading text-4xl font-bold text-primary md:text-5xl"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg text-gray-600"
          >
            Trusted by collectors and enthusiasts worldwide
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-6 font-body leading-relaxed text-gray-700">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-body font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="font-body text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 font-heading text-4xl font-bold text-primary md:text-5xl">
            Ready to Find Your Perfect Timepiece?
          </h2>
          <p className="mb-8 font-body text-lg leading-relaxed text-gray-600">
            Explore our curated collection of luxury watches from the world's most prestigious brands.
            Each piece is authenticated and backed by our guarantee of excellence.
          </p>
          <Link
            href="/products"
            className="inline-block bg-primary px-10 py-4 font-body text-lg font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800"
          >
            Browse Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Stay Updated
          </h2>
          <p className="mb-8 font-body text-white/80">
            Subscribe to receive exclusive offers and the latest collection updates
          </p>
          <form className="mx-auto flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-white/20 bg-white/10 px-6 py-3 font-body text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              className="bg-gold px-8 py-3 font-body font-bold uppercase tracking-wider text-black transition-all hover:bg-white"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export { FeaturesSection, BrandsSection, StatsSection, TestimonialsSection, CTASection, Newsletter };
