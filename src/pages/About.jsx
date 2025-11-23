const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">About SocialEvents</h1>
        <p className="text-sm md:text-base text-base-content/70">
          SocialEvents is a community-driven platform that helps people
          discover, create, and join social development events such as clean-up
          drives, tree plantation programs, donation campaigns, and awareness
          events.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="bg-base-200 rounded-2xl p-4 md:p-5 space-y-1">
          <h2 className="font-semibold text-base">Our Mission</h2>
          <p className="text-sm text-base-content/70">
            To make it easy for anyone to contribute to their local community by
            organizing and participating in meaningful social activities.
          </p>
        </div>
        <div className="bg-base-200 rounded-2xl p-4 md:p-5 space-y-1">
          <h2 className="font-semibold text-base">What We Offer</h2>
          <p className="text-sm text-base-content/70">
            Create events, manage participants, track joined events, and promote
            social impact projects in a single place.
          </p>
        </div>
        <div className="bg-base-200 rounded-2xl p-4 md:p-5 space-y-1">
          <h2 className="font-semibold text-base">Who It’s For</h2>
          <p className="text-sm text-base-content/70">
            Volunteers, students, NGOs, community leaders, and anyone who cares
            about social development.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">How it Works</h2>
        <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-base-content/70">
          <li>Create an account using your email and password.</li>
          <li>Browse upcoming social events in your area.</li>
          <li>Create your own events with date, location, and event type.</li>
          <li>
            Join events that match your interests and track your activity.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default About;
