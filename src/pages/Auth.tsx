import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success('Account created! Check your email to verify.');
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="text-4xl">🔥</span>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-2">
              {isSignUp ? t('createAccount') : t('welcomeBack')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? t('joinCommunity') : t('signInToLikeSaveComment')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('name')}
                  required={isSignUp}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full bg-hero-gradient font-medium" disabled={loading}>
              {loading ? t('loading') : isSignUp ? t('signUp') : t('signIn')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? t('signIn') : t('signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
