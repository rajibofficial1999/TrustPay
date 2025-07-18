const appEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

const HelpCenterPage = () => {
  return (
    <div className="container">
      <div className="py-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-6 sm:px-10 text-foreground/80 mt-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center">
          Help Center
        </h1>

        <p className="mt-10 text-center">
          Welcome to the Help Center. Here you’ll find answers to the most
          frequently asked questions and resources to guide you through using
          our platform safely and effectively.
        </p>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              1. How do I make a payment?
            </h2>
            <p>
              To make a payment, log in to your account, choose the recipient,
              enter the amount, and follow the secure payment steps. Your funds
              will be held in escrow until the payment is confirmed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              2. How does the escrow system work?
            </h2>
            <p>
              When a buyer sends money, it is held securely by our platform. The
              seller delivers the product or service, and only after the buyer
              confirms receipt do we release the funds to the seller.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              3. What if there is a dispute?
            </h2>
            <p>
              If there's a disagreement, both parties can submit evidence. Our
              support team will review the case and make a fair decision on
              whether to release or refund the funds.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              4. How can I contact support?
            </h2>
            <p>
              You can reach our support team by emailing{" "}
              <strong>{appEmail}</strong>. We respond within 24 hours on
              business days.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              5. Is my information secure?
            </h2>
            <p>
              Absolutely. We use industry-standard encryption and security
              protocols to protect your data and payments.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              6. Can I cancel a payment?
            </h2>
            <p>
              If the payment hasn’t been confirmed yet, you can request a
              cancellation. The funds will only be refunded if the seller hasn’t
              fulfilled their part of the agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
