import profilePhoto from '@/assets/profile-photo.jpg';

const AboutSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-card">
          <div className="absolute inset-0 bg-hero-gradient opacity-5" />
          <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
            {/* Photo */}
            <div className="shrink-0">
              <img
                src={profilePhoto}
                alt="Profile photo"
                className="h-56 w-44 rounded-xl object-cover"
              />
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                About Me
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Software Engineer & AI/ML Specialist with <span className="font-semibold text-primary">5+ years</span> of experience building intelligent systems at scale.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  🏢 Ex-Amazon Alexa
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  👥 5,000+ Contacts
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  🏆 LeetCode Rank #234
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  🤖 AI/ML Specialist
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                I write about the intersection of AI research and practical engineering — transformers, RAG systems, voice AI, and everything in between.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
