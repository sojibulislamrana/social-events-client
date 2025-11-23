const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // No real backend, just a placeholder
    // You can hook this up later if needed
  };

  return (
    <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-[1.2fr,1fr]">
      <section className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-sm md:text-base text-base-content/70">
          Have questions, feedback, or ideas for new features? Send us a message
          and we’ll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-base-200 rounded-2xl p-5 md:p-6"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-medium">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered rounded-xl h-11"
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-medium">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered rounded-xl h-11"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm font-medium">Message</span>
            </label>
            <textarea
              className="textarea textarea-bordered rounded-xl min-h-[120px]"
              placeholder="How can we help you?"
              required
            />
          </div>

          <button className="btn btn-primary w-full rounded-xl">
            Send Message
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="bg-base-200 rounded-2xl p-5 md:p-6 space-y-2">
          <h2 className="text-lg md:text-xl font-semibold">
            Support &amp; Help
          </h2>
          <p className="text-sm md:text-base text-base-content/70">
            For technical issues, bug reports, or feature requests, please reach
            out through this contact form.
          </p>
        </div>
        <div className="bg-base-200 rounded-2xl p-5 md:p-6 space-y-2">
          <h2 className="text-lg md:text-xl font-semibold">General Info</h2>
          <p className="text-sm md:text-base text-base-content/70">
            This project is a social development events platform demonstration.
            You can adapt the contact details for your own deployment.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
