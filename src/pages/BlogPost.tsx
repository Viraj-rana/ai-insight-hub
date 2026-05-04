import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CommentSection from '@/components/CommentSection';
import SignInPromptDialog from '@/components/SignInPromptDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLikes, useToggleLike, useSaves, useToggleSave } from '@/hooks/useBlogData';
import { usePost } from '@/hooks/usePosts';
import { ArrowLeft, Clock, Heart, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getFormattedPostDate, getRelativePostTime } from '@/lib/postTime';

const BlogPost = () => {
  const { id } = useParams();
  const location = useLocation();
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const { user } = useAuth();
  const { t, localizePost } = useLanguage();
  const redirectPath = `${location.pathname}${location.search}`;
  const { data: post, isLoading, isError } = usePost(id || '');

  const { count: likeCount, userLiked } = useLikes(id || '');
  const toggleLike = useToggleLike(id || '', post ?? null);
  const { data: userSaved } = useSaves(id || '');
  const toggleSave = useToggleSave(id || '', post ?? null);

  const handleShare = async () => {
    if (!user) {
      setSignInDialogOpen(true);
      return;
    }

    if (!post) return;

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: localizePost(post).title,
          text: localizePost(post).excerpt,
          url: shareUrl,
        });
        toast.success('Post shared!');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied. Share it anywhere!');
    } catch {
      toast.error('Could not share this post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl py-20 text-center text-muted-foreground">
          {t('loadingPost')}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">{t('loadPostError')}</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← {t('backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="font-heading text-2xl font-bold">{t('postNotFound')}</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← {t('backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!user) {
      setSignInDialogOpen(true);
      return;
    }
    toggleLike.mutate(userLiked);
  };

  const handleSave = () => {
    if (!user) {
      setSignInDialogOpen(true);
      return;
    }
    toggleSave.mutate(userSaved ?? false, {
      onSuccess: () => toast.success(userSaved ? 'Removed from saved' : 'Post saved!'),
    });
  };

  const localizedPost = localizePost(post);
  const relativeTime = getRelativePostTime(localizedPost.date);
  const formattedDate = getFormattedPostDate(localizedPost.date);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SignInPromptDialog
        open={signInDialogOpen}
        onOpenChange={setSignInDialogOpen}
        redirectPath={redirectPath}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToBlog')}
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {localizedPost.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground leading-tight mb-4">
            {localizedPost.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {relativeTime}
            </span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {localizedPost.photoUrls && localizedPost.photoUrls.length > 0 ? (
          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            {localizedPost.photoUrls.map((url, index) => (
              <img
                key={`${post.id}-photo-${index}`}
                src={url}
                alt={`${localizedPost.title} image ${index + 1}`}
                className="h-56 w-full rounded-xl border border-border object-cover"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="mb-10 flex h-48 items-center justify-center rounded-xl bg-secondary">
            <span className="text-8xl">{post.coverEmoji}</span>
          </div>
        )}

        <div className="mb-8 flex items-center gap-3">
          <Button
            variant={userLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className={userLiked ? "bg-hero-gradient" : ""}
          >
            <Heart className={`mr-1 h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
          <Button
            variant={userSaved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={toggleSave.isPending}
            className={userSaved ? "bg-hero-gradient" : ""}
          >
            <Bookmark className={`mr-1 h-4 w-4 ${userSaved ? 'fill-current' : ''}`} />
            {userSaved ? t('saved') : t('save')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            {t('share')}
          </Button>
          {!user && (
            <span className="text-xs text-muted-foreground">
              {t('signInToInteract')}
            </span>
          )}
        </div>

        <div className="prose-custom">
          {localizedPost.content.split('\n\n').map((paragraph, i) => {
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

        <CommentSection postId={post.id} redirectPath={redirectPath} sourcePost={post} />
      </article>
    </div>
  );
};

export default BlogPost;
