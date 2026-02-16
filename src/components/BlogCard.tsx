import { Link } from 'react-router-dom';
import { BlogPost } from '@/data/blogPosts';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <article className="animate-fade-in h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
        {/* Emoji cover */}
        <div className="flex h-36 items-center justify-center bg-secondary">
          <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
            {post.coverEmoji}
          </span>
        </div>

        <div className="p-5">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime}</span>
            </div>
            <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Read more <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
