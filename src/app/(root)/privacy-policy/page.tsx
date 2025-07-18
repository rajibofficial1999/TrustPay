import React from "react";
import ListHeader from "./_partials/list-header";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Our Platform";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

const PrivacyPage = () => {
  return (
    <div className="container">
      <div className="py-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-6 sm:px-10 text-foreground/80 mt-10">
        <h1 className="text-3xl sm:text-5xl font-bold text-center">
          Privacy Policy
        </h1>

        <p className="mt-10">
          At {appName}, we take your privacy seriously. This Privacy Policy
          outlines how we collect, use, store, and protect your personal
          information when you use our platform.
        </p>

        {/* 1. Information We Collect */}
        <div className="mt-10">
          <ListHeader>1. Information We Collect</ListHeader>
          <p className="mt-1">We collect the following types of information:</p>

          <h3 className="font-semibold text-lg mt-2">
            a. Personal Information
          </h3>
          <ul className="list-disc list-inside ml-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Government-issued ID (for verification, if required)</li>
            <li>Payment information (PayPal email, bank details, etc.)</li>
          </ul>

          <h3 className="font-semibold text-lg mt-2">b. Payment Details</h3>
          <ul className="list-disc list-inside ml-2">
            <li>Amount sent or received</li>
            <li>Purpose of payment</li>
            <li>Payment history</li>
            <li>Delivery confirmation status</li>
          </ul>

          <h3 className="font-semibold text-lg mt-2">c. Usage Data</h3>
          <ul className="list-disc list-inside ml-2">
            <li>IP address</li>
            <li>Device information</li>
            <li>Browser type</li>
            <li>Pages visited</li>
            <li>Timestamps of access</li>
          </ul>
        </div>

        {/* 2. How We Use Your Information */}
        <div className="mt-10">
          <ListHeader>2. How We Use Your Information</ListHeader>
          <ul className="list-disc list-inside ml-2">
            <li>To process and manage secure payments</li>
            <li>To verify user identities</li>
            <li>To communicate important updates</li>
            <li>To prevent fraud and suspicious activities</li>
            <li>To resolve disputes between users</li>
            <li>To improve the performance and security of our platform</li>
          </ul>
        </div>

        {/* 3. Sharing of Information */}
        <div className="mt-10">
          <ListHeader>3. Sharing of Information</ListHeader>
          <p>
            We do <strong>not</strong> sell or rent your personal information to
            third parties. We only share data:
          </p>
          <ul className="list-disc list-inside ml-2">
            <li>With payment processors to complete payments</li>
            <li>With law enforcement when legally required</li>
            <li>With service providers who help run our platform securely</li>
          </ul>
        </div>

        {/* 4. Data Security */}
        <div className="mt-10">
          <ListHeader>4. Data Security</ListHeader>
          <p>
            We use technical, administrative, and physical safeguards to protect
            your information. However, no method is 100% secure, so we advise
            using strong passwords and protecting your credentials.
          </p>
        </div>

        {/* 5. Your Rights and Choices */}
        <div className="mt-10">
          <ListHeader>5. Your Rights and Choices</ListHeader>
          <ul className="list-disc list-inside ml-2">
            <li>Access or update your personal information</li>
            <li>Delete your account and data</li>
            <li>Request a copy of your stored information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
          <p className="mt-2">
            To exercise your rights, contact us at support@yourwebsite.com
          </p>
        </div>

        {/* 6. Cookies */}
        <div className="mt-10">
          <ListHeader>6. Cookies</ListHeader>
          <p>
            We use cookies and similar tools to keep you logged in, store
            preferences, and monitor usage. You can disable cookies in your
            browser settings at any time.
          </p>
        </div>

        {/* 7. Children’s Privacy */}
        <div className="mt-10">
          <ListHeader>7. Children’s Privacy</ListHeader>
          <p>
            Our services are not intended for children under 13. We do not
            knowingly collect personal information from anyone under 13.
          </p>
        </div>

        {/* 8. Changes to This Policy */}
        <div className="mt-10">
          <ListHeader>8. Changes to This Policy</ListHeader>
          <p>
            We may update this Privacy Policy from time to time. We’ll notify
            you of significant changes via email or on our website.
          </p>
        </div>

        {/* 9. Contact Us */}
        <div className="mt-10">
          <ListHeader>9. Contact Us</ListHeader>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us:
          </p>
          <ul className="list-disc list-inside ml-2">
            <li>Email: {supportEmail}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
