export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary py-24 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-6 font-heading text-5xl font-bold md:text-6xl">
            About LuxWatch
          </h1>
          <p className="font-body text-xl leading-relaxed text-white/90">
            Curating the finest luxury timepieces since 2020
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="mb-6 font-heading text-3xl font-bold text-primary">
            Our Story
          </h2>
          <div className="space-y-4 font-body leading-relaxed text-gray-700">
            <p>
              LuxWatch was founded with a singular vision: to make the world's most
              prestigious timepieces accessible to discerning collectors and enthusiasts
              worldwide. What began as a passion for horology has evolved into a trusted
              platform connecting watch lovers with their dream timepieces.
            </p>
            <p>
              We understand that a luxury watch is more than just a tool to tell time—it's
              a statement of style, a symbol of achievement, and often, a cherished heirloom
              passed down through generations. That's why we meticulously curate our
              collection, ensuring every piece meets our exacting standards of authenticity,
              quality, and craftsmanship.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="mb-8 font-heading text-3xl font-bold text-primary">
            Our Values
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <svg
                  className="h-6 w-6 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                Authenticity
              </h3>
              <p className="font-body text-gray-600">
                Every watch is verified by certified horologists and comes with a certificate
                of authenticity.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <svg
                  className="h-6 w-6 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                Trust
              </h3>
              <p className="font-body text-gray-600">
                Our reputation is built on transparency, honest descriptions, and
                exceptional customer service.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <svg
                  className="h-6 w-6 text-gold"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                Passion
              </h3>
              <p className="font-body text-gray-600">
                We're watch enthusiasts first, business people second. Our love for
                horology drives everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="rounded-lg bg-gray-50 p-8">
          <h2 className="mb-6 font-heading text-3xl font-bold text-primary">
            Why Choose LuxWatch
          </h2>
          <ul className="space-y-4 font-body text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-gold">✓</span>
              <span>
                <strong>Curated Selection:</strong> Only watches that pass our rigorous
                quality standards make it to our catalog
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-gold">✓</span>
              <span>
                <strong>Expert Authentication:</strong> Every piece inspected by certified
                watchmakers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-gold">✓</span>
              <span>
                <strong>2-Year Warranty:</strong> Comprehensive coverage on all purchases
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-gold">✓</span>
              <span>
                <strong>White Glove Service:</strong> Insured shipping, elegant packaging,
                and personalized support
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-gold">✓</span>
              <span>
                <strong>30-Day Returns:</strong> Shop with confidence knowing you can return
                any watch within 30 days
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
