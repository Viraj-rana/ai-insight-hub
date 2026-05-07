import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type SignInPromptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectPath: string;
};

const SignInPromptDialog = ({ open, onOpenChange, redirectPath }: SignInPromptDialogProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goToAuth = () => {
    onOpenChange(false);
    navigate(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('signInToContinueTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('signInToContinueDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <Button type="button" className="bg-hero-gradient font-medium" onClick={goToAuth}>
            {t('signIn')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignInPromptDialog;
