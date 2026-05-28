import Navbar from '@/components/Navbar';
import AboutSection from '@/components/AboutSection';
import BlogCard from '@/components/BlogCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePosts } from '@/hooks/usePosts';

const Index = () => {
  const { t } = useLanguage();
  const { data: blogPosts = [], isLoading, isError } = usePosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden py-20 px-4">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/Video%20Project%2011.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.12]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="mb-4 inline-block text-5xl">🔥</span>
          <h1 className="font-heading text-5xl font-bold text-foreground md:text-6xl">
            AI <span className="text-gradient">Insider</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white">
            {t('heroSubtitle')}
          </p>
        </div>
      </header>

      {/* About */}
      <AboutSection />

      {/* Blog Posts */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">
            {t('latestPosts')}
          </h2>
          {isLoading && blogPosts.length === 0 && (
            <p className="text-muted-foreground">{t('loadingPosts')}</p>
          )}
          {isError && blogPosts.length === 0 && (
            <p className="text-destructive">{t('loadPostsError')}</p>
          )}
          {blogPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          {t('footerText')}
        </div>
      </footer>
    </div>
  );
};

export default Index;
