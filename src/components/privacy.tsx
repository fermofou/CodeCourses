import React from "react";
import { ShieldCheck } from "lucide-react";

const PrivacyPolicy = () => (
  <div className="container mx-auto px-4 py-8 max-w-2xl">
    <div className="flex items-center mb-6 space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        <ShieldCheck className="text-blue-600 w-6 h-6" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: May 27, 2025</p>
      </div>
    </div>

    <p className="mb-6 text-gray-600">
      Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights.
    </p>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">1. Information Collection</h2>
      <p>
        We collect personal information at the time of registration (name, institutional email address) and usage data (activity within the platform, solved problems, progress, earned rewards, etc.).
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
      <ul className="list-disc pl-6">
        <li>Create and manage your account.</li>
        <li>Evaluate your code submissions.</li>
        <li>Generate internal statistics.</li>
        <li>Improve user experience.</li>
      </ul>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
      <p>
        We do not share your personal information with third parties, except for integrated services such as:
      </p>
      <ul className="list-disc pl-6">
        <li>Judge0 API for code evaluation.</li>
        <li>SonarQube (or other services) for code quality analysis.</li>
        <li>Hosting or technical infrastructure providers.</li>
      </ul>
      <p>
        All external services are subject to their own privacy policies.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">4. Security</h2>
      <p>
        We implement technical and organizational measures to protect your information, including encryption, input validation, and secure authentication.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">5. User Rights</h2>
      <p>
        You may request the correction or deletion of your data at any time by contacting us or through your user profile.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">6. Cookies and Technologies</h2>
      <p>
        The platform may use cookies to authenticate sessions, remember preferences, and collect anonymous usage statistics.
      </p>
    </section>

    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">7. Changes to this Policy</h2>
      <p>
        We reserve the right to modify this policy. You will be notified through the platform in case of significant changes.
      </p>
    </section>
  </div>
);

export default PrivacyPolicy;