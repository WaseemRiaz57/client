'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Here you would typically send the data to your backend
    console.log('Contact form data:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary py-24 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-6 font-heading text-5xl font-bold md:text-6xl">
            Contact Us
          </h1>
          <p className="font-body text-xl leading-relaxed text-white/90">
            We're here to help with any questions about our luxury timepieces
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="mb-6 font-heading text-3xl font-bold text-primary">
              Get in Touch
            </h2>
            <p className="mb-8 font-body leading-relaxed text-gray-700">
              Have a question about a specific watch? Need assistance with your order? Our
              team of watch experts is here to help you find the perfect timepiece.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg
                    className="h-6 w-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-body font-semibold text-gray-900">Email</h3>
                  <p className="font-body text-gray-600">support@luxwatch.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg
                    className="h-6 w-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-body font-semibold text-gray-900">Phone</h3>
                  <p className="font-body text-gray-600">+1 (555) 123-4567</p>
                  <p className="font-body text-sm text-gray-500">Mon-Fri 9am-6pm EST</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <svg
                    className="h-6 w-6 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-body font-semibold text-gray-900">
                    Showroom
                  </h3>
                  <p className="font-body text-gray-600">
                    123 Luxury Lane
                    <br />
                    New York, NY 10001
                  </p>
                  <p className="mt-1 font-body text-sm text-gray-500">
                    By appointment only
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8 rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                Business Hours
              </h3>
              <div className="space-y-2 font-body text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="mb-6 font-heading text-2xl font-bold text-primary">
                Send us a Message
              </h2>

              {submitted && (
                <div className="mb-6 rounded-lg bg-green-50 p-4">
                  <p className="font-body text-sm text-green-600">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 font-body text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 font-body text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                    Subject *
                  </label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    type="text"
                    className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="mt-1 font-body text-xs text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-gray-700">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full border border-gray-300 px-4 py-3 font-body focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Tell us about your inquiry..."
                  />
                  {errors.message && (
                    <p className="mt-1 font-body text-xs text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-primary py-3 font-body text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-gray-800"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
