import { useState } from "react";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Orders & Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "We deliver your order within 45 minutes or less. If we exceed this time, your order is free!",
        },
        {
          q: "What are the delivery charges?",
          a: "Delivery is free for orders above ₹299. For orders below ₹299, a delivery charge of ₹40 applies.",
        },
        {
          q: "Can I track my order?",
          a: "Yes! Once your order is placed, you can track it in real-time from the Orders page. You will receive updates at every stage.",
        },
        {
          q: "What is your delivery area?",
          a: "We currently deliver within a 10 km radius of our store. Enter your address at checkout to check if we deliver to your location.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery.",
        },
        {
          q: "Is online payment secure?",
          a: "Absolutely! We use industry-standard encryption and secure payment gateways to protect your information.",
        },
        {
          q: "Can I use multiple promo codes?",
          a: "No, only one promo code can be applied per order. Choose the one that gives you the best discount!",
        },
        {
          q: "Do you offer any discounts?",
          a: "Yes! We regularly offer discounts and promo codes. Check our website or app for current offers.",
        },
      ],
    },
    {
      category: "Menu & Customization",
      questions: [
        {
          q: "Can I customize my pizza?",
          a: "Yes! You can choose your pizza size, crust type, and spice level. We offer regular, thin, and cheese burst crusts.",
        },
        {
          q: "Do you have vegetarian options?",
          a: "Yes, we have a wide variety of vegetarian pizzas made with fresh vegetables and premium cheese.",
        },
        {
          q: "Are your ingredients fresh?",
          a: "We use only the freshest ingredients sourced daily. Our vegetables, meats, and cheese are of the highest quality.",
        },
        {
          q: "Do you cater to dietary restrictions?",
          a: "Please contact us for specific dietary requirements. We will do our best to accommodate your needs.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          q: "What is your refund policy?",
          a: "If you are not satisfied with your order, contact us within 30 minutes of delivery. We will either replace it or provide a full refund.",
        },
        {
          q: "How do I report an issue with my order?",
          a: "You can contact our customer support at +91 9800-088-939 or email us at support@pizza.com with your order details.",
        },
        {
          q: "How long does it take to process a refund?",
          a: "Refunds are processed within 5-7 business days and will be credited to your original payment method.",
        },
      ],
    },
    {
      category: "Account & Profile",
      questions: [
        {
          q: "Do I need to create an account to order?",
          a: "While you can order as a guest, creating an account allows you to track orders, save addresses, and access exclusive offers.",
        },
        {
          q: "How do I reset my password?",
          a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your registered email.',
        },
        {
          q: "Can I save multiple delivery addresses?",
          a: "Yes! You can save multiple addresses in your account for faster checkout.",
        },
      ],
    },
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our service
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full flex items-center justify-between text-left py-2 hover:text-orange-500 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <svg
                          className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="mt-2 text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-orange-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Please contact our
            customer support team.
          </p>
          <a
            href="/contact-us"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
