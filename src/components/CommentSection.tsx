import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useComments, useAddComment } from '@/hooks/useBlogData';
import type { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import SignInPromptDialog from '@/components/SignInPromptDialog';

interface CommentSectionProps {
  postId: string;
  redirectPath: string;
  sourcePost: BlogPost;
}

const CommentSection = ({ postId, redirectPath, sourcePost }: CommentSectionProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(postId);
  const addComment = useAddComment(postId, sourcePost);
  const [newComment, setNewComment] = useState('');
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (!newComment.trim() || !user) return;
    addComment.mutate(newComment, {
      onSuccess: () => {
        setNewComment('');
        toast.success('Comment posted!');
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to post comment');
      },
    });
  };

  return (
    <div className="mt-12 border-t border-border pt-8">
      <SignInPromptDialog
        open={signInDialogOpen}
        onOpenChange={setSignInDialogOpen}
        redirectPath={redirectPath}
      />
      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        {t('comments')} {comments ? `(${comments.length})` : ''}
      </h3>

      {user ? (
        <div className="mb-8 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <Textarea
              placeholder={t('shareThoughts')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 min-h-[80px] resize-none"
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim() || addComment.isPending}
              className="bg-hero-gradient"
            >
              {addComment.isPending ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="mr-1 h-3.5 w-3.5" />
              )}
              {t('comment')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-border bg-secondary/50 p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">{t('signInToComment')}</p>
          <Button type="button" size="sm" className="bg-hero-gradient font-medium" onClick={() => setSignInDialogOpen(true)}>
            {t('writeCommentGuest')}
          </Button>
          <p className="text-xs text-muted-foreground">
            <Link
              to={`/auth?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-medium text-primary hover:underline"
            >
              {t('signIn')}
            </Link>
            {' · '}
            <Link
              to={`/auth?mode=signup&redirect=${encodeURIComponent(redirectPath)}`}
              className="font-medium text-primary hover:underline"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment: any) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">{t('noComments')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
