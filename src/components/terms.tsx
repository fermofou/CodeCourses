import React from "react";
import { ShieldCheck } from "lucide-react";

const Terms = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center mb-6 space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <ShieldCheck className="text-blue-600 w-6 h-6" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Terms and conditions</h1>
        <p className="text-gray-500 text-sm">Last updated: May 27, 2025</p>
      </div>
    </div>

    <p className="mb-6 text-gray-600">
      These terms and conditions govern your use of our platform. By accessing or using the service, you agree to comply with them. Please read them carefully to understand your rights and responsibilities.
    </p>


    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p>
        By accessing and using this platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part, you should not use the platform.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. Use of the Platform</h2>
      <p>
        This platform is designed for educational purposes, specifically for programming practice and learning. You agree not to use the platform for any illegal, abusive, or malicious activities, including but not limited to:
      </p>
      <ul className="list-disc pl-6">
        <li>Posting or sharing offensive or harmful content.</li>
        <li>Attempting to exploit or damage the platform’s functionality.</li>
        <li>Impersonating others or providing false information.</li>
      </ul>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
      <p>
        All content on this platform, including problems, code, visual elements, and design, is the property of the platform or its respective owners. Reproduction or distribution without prior authorization is strictly prohibited.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. Any misuse of your account is your responsibility. We reserve the right to suspend or delete accounts that violate these terms.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">5. Modifications to the Service</h2>
      <p>
        We reserve the right to modify, suspend, or discontinue any part of the platform at any time without prior notice. This includes features, functionality, or availability of the service.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
      <p>
        The use of this platform is at your own risk. We do not guarantee uninterrupted or error-free service. We are not liable for any losses or damages resulting from the use or inability to use the platform.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">7. Changes to These Terms</h2>
      <p>
        We may update these Terms and Conditions at any time. Continued use of the platform after such changes implies your acceptance of the new terms. Please review this page periodically.
      </p>
    </section>
  </div>
);

export default Terms;