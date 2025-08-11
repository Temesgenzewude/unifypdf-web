export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-sm text-foreground/70">
        UnifyPDF is designed for privacy. We do not store uploaded PDFs or merged results on our servers.
        Files are processed in-memory solely to fulfill your request, and are discarded immediately afterward.
      </p>

      <div className="mt-8 space-y-6 text-sm text-foreground/80">
        <section>
          <h2 className="font-medium">What we collect</h2>
          <p className="mt-2">We do not collect or store file contents. Basic operational logs may include timestamps and request sizes for reliability and abuse prevention.</p>
        </section>
        <section>
          <h2 className="font-medium">How processing works</h2>
          <p className="mt-2">Files are sent over HTTPS to our API only for the duration of the merge and returned immediately. No persistent storage is used server-side.</p>
        </section>
        <section>
          <h2 className="font-medium">Third-party services</h2>
          <p className="mt-2">If analytics are enabled, they are configured without file contents. We do not sell personal data.</p>
        </section>
        <section>
          <h2 className="font-medium">Contact</h2>
          <p className="mt-2">Questions? Contact us via the repository issue tracker.</p>
        </section>
      </div>
    </div>
  );
}

