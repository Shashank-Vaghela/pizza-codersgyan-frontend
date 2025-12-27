const AboutUs = () => {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Delivering happiness, one pizza at a time
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2020, Pizza Corner started with a simple mission: to
              deliver the most delicious, freshly-made pizzas to your doorstep
              in just 45 minutes. What began as a small pizzeria has grown into
              a beloved brand known for quality, speed, and exceptional taste.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe that great pizza brings people together. That's why we
              use only the finest ingredients, traditional recipes, and
              innovative techniques to create pizzas that delight every palate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Promise
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🍕 Fresh Ingredients
                </h3>
                <p className="text-sm text-gray-600">
                  We source the freshest vegetables, premium meats, and
                  authentic Italian cheese for every pizza.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ⚡ Fast Delivery
                </h3>
                <p className="text-sm text-gray-600">
                  Your pizza arrives hot and fresh in 45 minutes or less, or
                  it's free!
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  👨‍🍳 Expert Chefs
                </h3>
                <p className="text-sm text-gray-600">
                  Our trained pizza chefs craft each pizza with care and
                  attention to detail.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  💯 Quality Guaranteed
                </h3>
                <p className="text-sm text-gray-600">
                  Not satisfied? We'll make it right or give you a full refund,
                  no questions asked.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <p className="text-gray-600">
                  <strong>Quality First:</strong> We never compromise on
                  ingredients or preparation.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <p className="text-gray-600">
                  <strong>Customer Satisfaction:</strong> Your happiness is our
                  top priority.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <p className="text-gray-600">
                  <strong>Innovation:</strong> We constantly improve our recipes
                  and service.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <p className="text-gray-600">
                  <strong>Community:</strong> We're proud to serve and support
                  our local community.
                </p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
