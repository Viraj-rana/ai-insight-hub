import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, PenLine } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-heading text-xl font-bold text-foreground">
            AI <span className="text-primary">Insider</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-secondary-foreground">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-hero-gradient font-medium">
                <PenLine className="mr-1 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
