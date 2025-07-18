import React from "react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Our Platform";

const AboutPage = () => {
  return (
    <div className="container">
      <div className="py-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-6 sm:px-10 text-foreground/80 mt-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center">
          About {appName}
        </h1>

        <p className="mt-10">
          Welcome to {appName}, a trusted escrow-based payment platform designed
          to protect buyers and sellers in online payments. In a world where
          digital scams are increasingly common, {appName} acts as a secure
          middleman to ensure that your money and goods are always safe.
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p>
            Our mission is to provide a reliable and transparent way for
            individuals to buy and sell products or services online without the
            fear of fraud. We help both parties complete the payment with
            confidence by holding funds in escrow until the payment is
            fulfilled.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">How It Works</h2>
          <ol className="list-decimal list-inside ml-2">
            <li>The buyer sends the agreed payment to {appName}.</li>
            <li>We hold the payment securely in escrow.</li>
            <li>The seller delivers the product or service to the buyer.</li>
            <li>
              Once the buyer confirms they have received what was promised, we
              release the funds to the seller.
            </li>
          </ol>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Why Choose Us</h2>
          <ul className="list-disc list-inside ml-2">
            <li>Secure and transparent payments</li>
            <li>Dispute resolution and buyer protection</li>
            <li>Trusted by thousands of users</li>
            <li>Fast and easy-to-use interface</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p>
            We envision a digital economy where every online payment can be done
            safely, confidently, and without the fear of being scammed.{" "}
            {appName} is here to make that vision a reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
