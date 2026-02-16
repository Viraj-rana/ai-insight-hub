import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'ML Enthusiast',
      text: 'Great article! The section on attention mechanisms was really clear.',
      date: '2026-02-12',
    },
    {
      id: '2',
      author: 'Data Scientist',
      text: 'Would love to see a follow-up on multi-modal transformers!',
      date: '2026-02-11',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim() || !user) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      text: newComment,
      date: new Date().toISOString().split('T')[0],
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-primary" />
        Comments ({comments.length})
      </h3>

      {user ? (
        <div className="mb-8 flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 min-h-[80px] resize-none"
            />
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="bg-hero-gradient"
            >
              <Send className="mr-1 h-3.5 w-3.5" />
              Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-border bg-secondary/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="font-medium text-primary hover:underline">
              Sign in
            </Link>{' '}
            to leave a comment
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
