import React from "react";
import ListHeader from "./_partials/list-header";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Our Platform";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

const TermsPage = () => {
  return (
    <div className="container">
      <div className="py-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-6 sm:px-10 text-foreground/80 mt-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center">
          Terms & Conditions
        </h1>

        <p className="mt-10">
          These Terms and Conditions ("Terms") govern your access to and use of{" "}
          {appName}. By accessing or using the platform, you agree to be bound
          by these Terms.
        </p>

        {/* 1. Use of Service */}
        <div className="mt-10">
          <ListHeader>1. Use of Our Services</ListHeader>
          <p>
            You agree to use our platform only for lawful purposes. You must not
            use the site for any illegal, unauthorized, or fraudulent activity.
          </p>
        </div>

        {/* 2. Account Registration */}
        <div className="mt-10">
          <ListHeader>2. Account Registration</ListHeader>
          <p>
            You must provide accurate and complete information when creating an
            account. You are responsible for safeguarding your login credentials
            and all activities that occur under your account.
          </p>
        </div>

        {/* 3. Payment and Escrow */}
        <div className="mt-10">
          <ListHeader>3. Payment & Escrow</ListHeader>
          <p>
            All payments made on {appName} are held in escrow until both the
            buyer and seller confirm the transaction. Funds will not be released
            without buyer approval, ensuring a secure exchange for both parties.
          </p>
        </div>

        {/* 4. Prohibited Activities */}
        <div className="mt-10">
          <ListHeader>4. Prohibited Activities</ListHeader>
          <ul className="list-disc list-inside ml-2">
            <li>Engaging in scams or fraudulent transactions</li>
            <li>Impersonating any person or entity</li>
            <li>Using the platform for illegal goods or services</li>
            <li>Violating any laws or third-party rights</li>
          </ul>
        </div>

        {/* 5. Dispute Resolution */}
        <div className="mt-10">
          <ListHeader>5. Dispute Resolution</ListHeader>
          <p>
            In the event of a dispute between buyer and seller, {appName} will
            review evidence submitted by both parties and make a final decision
            regarding the release or refund of funds.
          </p>
        </div>

        {/* 6. Termination */}
        <div className="mt-10">
          <ListHeader>6. Termination</ListHeader>
          <p>
            We reserve the right to suspend or terminate your account at our
            discretion, especially if you violate our Terms or engage in
            suspicious activity.
          </p>
        </div>

        {/* 7. Limitation of Liability */}
        <div className="mt-10">
          <ListHeader>7. Limitation of Liability</ListHeader>
          <p>
            {appName} is not liable for indirect, incidental, or consequential
            damages that may result from the use of our platform.
          </p>
        </div>

        {/* 8. Changes to Terms */}
        <div className="mt-10">
          <ListHeader>8. Changes to These Terms</ListHeader>
          <p>
            We may update these Terms at any time. Continued use of the platform
            after changes means you accept the updated Terms.
          </p>
        </div>

        {/* 9. Contact Us */}
        <div className="mt-10">
          <ListHeader>9. Contact Us</ListHeader>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us:
          </p>
          <ul className="list-disc list-inside ml-2">
            <li>Email: {supportEmail}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
