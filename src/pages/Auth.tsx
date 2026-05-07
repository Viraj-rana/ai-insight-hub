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
import { validateEmailRemote } from '@/lib/emailValidation';

const MIN_PASSWORD_LEN = 6;

const isValidEmailFormat = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type Mode = 'login' | 'signup' | 'forgot' | 'updatePassword';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('mode') === 'signup' ? 'signup' : 'login';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const {
    signUpWithEmail,
    signInWithEmail,
    requestPasswordReset,
    updatePassword,
  } = useAuth();
  const navigate = useNavigate();

  const redirectTarget = getSafeRedirectPath(searchParams.get('redirect')) ?? '/';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'signup') {
      setMode((m) => (m === 'updatePassword' ? m : 'signup'));
    }
  }, [location.search]);

  const navigateAfterAuth = () => {
    navigate(redirectTarget, { replace: true });
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('updatePassword');
        setPassword('');
        setConfirmPassword('');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const formatAuthError = (err: { message?: string }) => {
    if (err?.message === 'EMAIL_RATE_LIMIT') return t('emailRateLimited');
    if (err?.message === 'NETWORK_AUTH_FAILED') return t('cannotReachSupabase');
    return err?.message || t('genericError');
  };

  const validateEmail = () => {
    if (!email.trim() || !isValidEmailFormat(email)) {
      toast.error(t('invalidEmail'));
      return false;
    }
    return true;
  };

  const toastIfEmailRejectedRemotely = async (): Promise<boolean> => {
    const remote = await validateEmailRemote(email);
    if (remote.valid) return true;
    switch (remote.reason) {
      case 'disposable_domain':
        toast.error(t('emailDisposable'));
        break;
      case 'no_mx':
      case 'dns_failed':
      case 'dns_error':
      case 'dns_timeout':
        toast.error(t('emailDnsInvalid'));
        break;
      case 'invalid_format':
      case 'empty':
        toast.error(t('invalidEmail'));
        break;
      default:
        toast.error(remote.detail?.trim() || t('emailNotAcceptable'));
    }
    return false;
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
    if (!fullName.trim()) {
      toast.error(t('nameRequiredSignUp'));
      return;
    }
    if (password.length < MIN_PASSWORD_LEN) {
      toast.error(t('passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      if (!(await toastIfEmailRejectedRemotely())) return;
      const { data } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      
      if (data?.user && !data.session) {
        toast.success(t('emailConfirmRequiredHint'));
        setMode('login');
      } else {
        toast.success(t('accountCreatedWelcome'));
        navigateAfterAuth();
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || '';
      if (msg.includes('Email not confirmed') || msg.toLowerCase().includes('confirm')) {
        toast.error(t('emailConfirmRequiredHint'));
      } else {
        toast.error(formatAuthError(err as { message?: string }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    try {
      if (!(await toastIfEmailRejectedRemotely())) return;
      await requestPasswordReset(email);
      toast.success(t('resetEmailSent'));
    } catch (err: unknown) {
      toast.error(formatAuthError(err as { message?: string }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD_LEN) {
      toast.error(t('passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success(t('passwordUpdatedSuccess'));
      navigateAfterAuth();
    } catch (err: unknown) {
      toast.error(formatAuthError(err as { message?: string }));
    } finally {
      setLoading(false);
    }
  };

  const headerTitle =
    mode === 'login'
      ? t('welcomeBack')
      : mode === 'signup'
        ? t('createAccount')
        : mode === 'forgot'
          ? t('forgotPassword')
          : t('updatePasswordSubmit');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <span className="text-4xl">🔥</span>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-2">{headerTitle}</h1>
            {mode !== 'updatePassword' && mode !== 'forgot' && (
              <p className="text-sm text-muted-foreground mt-1">{t('joinCommunity')}</p>
            )}
            {mode === 'forgot' && (
              <p className="text-sm text-muted-foreground mt-1">{t('forgotPasswordHelp')}</p>
            )}
          </div>

          {mode === 'updatePassword' ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="np">{t('newPassword')}</Label>
                <Input
                  id="np"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('newPassword')}
                  required
                  minLength={MIN_PASSWORD_LEN}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-muted-foreground">{t('passwordHintMin')}</p>
              </div>
              <div>
                <Label htmlFor="npc">{t('confirmPassword')}</Label>
                <Input
                  id="npc"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('confirmPassword')}
                  required
                  minLength={MIN_PASSWORD_LEN}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full bg-hero-gradient font-medium" disabled={loading}>
                {loading ? t('loading') : t('updatePasswordSubmit')}
              </Button>
            </form>
          ) : mode === 'forgot' ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Label htmlFor="fp-email">{t('email')}</Label>
                <Input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email')}
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full bg-hero-gradient font-medium" disabled={loading}>
                {loading ? t('loading') : t('sendResetLink')}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline font-medium"
                  onClick={() => {
                    setMode('login');
                  }}
                >
                  {t('backToLogin')}
                </button>
              </p>
            </form>
          ) : mode === 'login' ? (
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
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <button
                    type="button"
                    className="text-xs text-primary underline-offset-4 hover:underline font-medium"
                    onClick={() => setMode('forgot')}
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
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
                <Label htmlFor="su-name">{t('name')}</Label>
                <Input
                  id="su-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('name')}
                  required
                  autoComplete="name"
                />
              </div>
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
                    setFullName('');
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
