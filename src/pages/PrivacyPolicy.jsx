const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-sm md:text-base text-base-content/70">
          This Privacy Policy explains how SocialEvents collects, uses, and
          protects your personal information when you use our platform.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">
          Information We Collect
        </h2>
        <p className="text-sm md:text-base text-base-content/70">
          We collect basic information such as your name, email address, and
          profile photo when you register. We also store event-related data that
          you create or join, such as event titles, locations, and dates.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">
          How We Use Your Information
        </h2>
        <p className="text-sm md:text-base text-base-content/70">
          Your information is used to:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base text-base-content/70 space-y-1">
          <li>Create and manage your account.</li>
          <li>Display events you create or join.</li>
          <li>Improve the user experience of the platform.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">Data Sharing</h2>
        <p className="text-sm md:text-base text-base-content/70">
          We do not sell your personal information. Limited data such as your
          name or email may be visible to other users in the context of events
          you create or join.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">Security</h2>
        <p className="text-sm md:text-base text-base-content/70">
          We use reasonable technical measures to protect your data. However, no
          method of transmission over the internet is 100% secure, so we cannot
          guarantee absolute security.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg md:text-xl font-semibold">Contact</h2>
        <p className="text-sm md:text-base text-base-content/70">
          If you have any questions about this Privacy Policy, please contact us
          through the Contact page.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
