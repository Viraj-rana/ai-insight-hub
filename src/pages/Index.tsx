import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/data/blogPosts';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-block text-5xl">🔥</span>
          <h1 className="font-heading text-5xl font-bold text-foreground md:text-6xl">
            AI <span className="text-gradient">Insider</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Deep dives into artificial intelligence, machine learning, and the engineering behind modern AI systems.
          </p>
        </div>
      </header>

      {/* About */}
      <AboutSection />

      {/* Blog Posts */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
            Latest Posts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          © 2026 AI Insider. Built with passion for AI & ML.
        </div>
      </footer>
    </div>
  );
};

export default Index;
