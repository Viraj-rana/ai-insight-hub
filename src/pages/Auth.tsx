import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getSafeRedirectPath } from '@/lib/authRedirect';

const MIN_PASSWORD_LEN = 6;

const isValidEmailFormat = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type Mode = 'login' | 'signup';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('mode') === 'signup' ? 'signup' : 'login';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { signUpWithEmail, signInWithEmail } = useAuth();
  const navigate = useNavigate();

  const redirectTarget = getSafeRedirectPath(searchParams.get('redirect')) ?? '/';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setMode('signup');
    }
  }, [location.search]);

  const navigateAfterAuth = () => {
    navigate(redirectTarget, { replace: true });
  };

  const formatAuthError = (err: { message?: string }) => {
    if (err?.message === 'EMAIL_RATE_LIMIT') return t('emailRateLimited');
    if (err?.message === 'NETWORK_AUTH_FAILED') return t('cannotReachSupabase');
    if (err?.message === 'EMAIL_CONFIRMATION_ENABLED') return t('emailConfirmRequiredHint');
    return err?.message || t('genericError');
  };

  const validateEmail = () => {
    if (!email.trim() || !isValidEmailFormat(email)) {
      toast.error(t('invalidEmail'));
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    if (password.length < MIN_PASSWORD_LEN) {
      toast.error(t('passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success(t('welcomeBack'));
      navigateAfterAuth();
    } catch (err: unknown) {
      toast.error(formatAuthError(err as { message?: string }));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    if (password.length < MIN_PASSWORD_LEN) {
      toast.error(t('passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      toast.success(t('accountCreatedWelcome'));
      navigateAfterAuth();
    } catch (err: unknown) {
      toast.error(formatAuthError(err as { message?: string }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate(redirectTarget, { replace: true });
    });
  }, [navigate, redirectTarget]);

  const headerTitle = mode === 'login' ? t('welcomeBack') : t('createAccount');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="text-4xl">🔥</span>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-2">{headerTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('joinCommunity')}</p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email')}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  required
                  minLength={MIN_PASSWORD_LEN}
                  autoComplete="current-password"
                />
                <p className="mt-1 text-xs text-muted-foreground">{t('passwordHintMin')}</p>
              </div>
              <Button type="submit" className="w-full bg-hero-gradient font-medium" disabled={loading}>
                {loading ? t('loading') : t('signIn')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline font-medium"
                  onClick={() => {
                    setMode('signup');
                    setPassword('');
                  }}
                >
                  {t('signUp')}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="su-email">{t('email')}</Label>
                <Input
                  id="su-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email')}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="su-password">{t('password')}</Label>
                <Input
                  id="su-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  required
                  minLength={MIN_PASSWORD_LEN}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-muted-foreground">{t('passwordHintMin')}</p>
              </div>
              <Button type="submit" className="w-full bg-hero-gradient font-medium" disabled={loading}>
                {loading ? t('loading') : t('signUp')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline font-medium"
                  onClick={() => {
                    setMode('login');
                    setPassword('');
                  }}
                >
                  {t('signIn')}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
