import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import Navbar from '@/components/Navbar';
import CommentSection from '@/components/CommentSection';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Clock, Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const BlogPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const post = blogPosts.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">Post not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!user) return;
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleSave = () => {
    if (!user) return;
    setSaved(!saved);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* Emoji cover */}
        <div className="mb-10 flex h-48 items-center justify-center rounded-xl bg-secondary">
          <span className="text-8xl">{post.coverEmoji}</span>
        </div>

        {/* Actions */}
        <div className="mb-8 flex items-center gap-3">
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={!user}
            className={liked ? "bg-hero-gradient" : ""}
          >
            <Heart className={`mr-1 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          <Button
            variant={saved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={!user}
            className={saved ? "bg-hero-gradient" : ""}
          >
            <Bookmark className={`mr-1 h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
          {!user && (
            <span className="text-xs text-muted-foreground">
              <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to like & save
            </span>
          )}
        </div>

        {/* Content */}
        <div className="prose-custom">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={i} className="font-heading text-2xl font-bold text-foreground mt-10 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={i} className="font-heading text-xl font-semibold text-foreground mt-8 mb-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <p key={i} className="text-base font-semibold text-foreground mb-4">
                  {paragraph.replace(/\*\*/g, '')}
                </p>
              );
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={i} className="mb-4 space-y-1.5 pl-5 list-disc">
                  {items.map((item, j) => (
                    <li key={j} className="text-base text-muted-foreground leading-relaxed">
                      {item.replace(/^[-\d.]\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-base text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Comments */}
        <CommentSection postId={post.id} />
      </article>
    </div>
  );
};

export default BlogPost;
