import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "After your order is shipped, you will receive a tracking number via email or SMS. You can use this number to track your package on the courier's website.",
  },
  {
    question: " What is your return and refund policy?",
    answer:
      "We accept returns and refunds for defective or incorrect items within 7 days of receiving your order. Please provide an unboxing video and photos as proof, and contact our customer service for assistance.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Delivery times depend on your location. Domestic shipping: 2-5 business days, International shipping: 7-14 business days Delays may occur due to public holidays or high order volumes.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Credit/Debit Cards (Visa, MasterCard), PayPal, Bank Transfer and Digital Wallets (GPay, Apple Pay, etc.)",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Orders can only be modified or canceled within 1 hour after purchase. Once processed, we cannot make changes. Please double-check your order details before checkout.",
  },
];

export default function FAQS() {
  return (
    <div className="px-4">
      <div className="w-full">
        <div className="py-6">
          <h1 className="font-bold text-2xl">FAQs</h1>
        </div>
        <div className="mx-auto w-full border border-foreground/20 divide-y divide-foreground/10 rounded-xl">
          {faqs.map((faq, i) => (
            <Disclosure
              key={i}
              as="div"
              className="p-6 transition-all ease-in duration-200"
              defaultOpen={false}
            >
              <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-sm/6 font-medium">{faq.question}</span>
                <svg
                  className="group-data-[open]:rotate-180"
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5306 1.53061L6.5306 6.53061C6.46092 6.60053 6.37813 6.65601 6.28696 6.69386C6.1958 6.73172 6.09806 6.7512 5.99935 6.7512C5.90064 6.7512 5.8029 6.73172 5.71173 6.69386C5.62057 6.65601 5.53778 6.60053 5.4681 6.53061L0.468098 1.53061C0.327202 1.38972 0.248047 1.19862 0.248047 0.999362C0.248047 0.800105 0.327202 0.609009 0.468098 0.468112C0.608994 0.327216 0.800091 0.248062 0.999348 0.248062C1.19861 0.248062 1.3897 0.327216 1.5306 0.468112L5.99997 4.93749L10.4693 0.467488C10.6102 0.326592 10.8013 0.247437 11.0006 0.247437C11.1999 0.247437 11.391 0.326592 11.5318 0.467488C11.6727 0.608384 11.7519 0.79948 11.7519 0.998738C11.7519 1.198 11.6727 1.38909 11.5318 1.52999L11.5306 1.53061Z"
                    fill="black"
                  />
                </svg>
              </DisclosureButton>
              <DisclosurePanel
                transition
                className="mt-2 origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
              >
                {faq.answer}
              </DisclosurePanel>
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
}
