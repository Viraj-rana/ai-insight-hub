import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { BlogPost } from '@/types/blog';

export type Language = 'en' | 'ru';

type TranslationKey =
  | 'blog'
  | 'newPost'
  | 'signIn'
  | 'signOut'
  | 'latestPosts'
  | 'loadingPosts'
  | 'loadPostsError'
  | 'heroSubtitle'
  | 'footerText'
  | 'aboutMe'
  | 'aboutIntro'
  | 'aboutOutro'
  | 'readMore'
  | 'backToBlog'
  | 'loadingPost'
  | 'loadPostError'
  | 'postNotFound'
  | 'like'
  | 'save'
  | 'saved'
  | 'share'
  | 'signInToInteract'
  | 'comments'
  | 'shareThoughts'
  | 'comment'
  | 'signInToComment'
  | 'noComments'
  | 'createAccount'
  | 'welcomeBack'
  | 'joinCommunity'
  | 'signInToLikeSaveComment'
  | 'name'
  | 'email'
  | 'password'
  | 'loading'
  | 'signUp'
  | 'alreadyHaveAccount'
  | 'dontHaveAccount'
  | 'writerOnlyArea'
  | 'createNewBlogPost'
  | 'postTitle'
  | 'shortSummary'
  | 'writePostContent'
  | 'readTime'
  | 'tagsComma'
  | 'coverEmoji'
  | 'addUpTo10Photos'
  | 'publishing'
  | 'publishPost'
  | 'oopsPageNotFound'
  | 'returnHome'
  | 'accountCreatedWelcome'
  | 'emailRateLimited'
  | 'genericError'
  | 'invalidEmail'
  | 'passwordTooShort'
  | 'passwordHintMin'
  | 'nameRequiredSignUp'
  | 'cannotReachSupabase'
  | 'emailConfirmRequiredHint'
  | 'forgotPassword'
  | 'resetEmailSent'
  | 'newPassword'
  | 'confirmPassword'
  | 'passwordMismatch'
  | 'passwordUpdatedSuccess'
  | 'signInToContinueTitle'
  | 'signInToContinueDescription'
  | 'cancel'
  | 'backToLogin'
  | 'sendResetLink'
  | 'updatePasswordSubmit'
  | 'writeCommentGuest'
  | 'forgotPasswordHelp'
  | 'emailDisposable'
  | 'emailDnsInvalid'
  | 'emailNotAcceptable';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  localizePost: (post: BlogPost) => BlogPost;
};

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    blog: 'Blog',
    newPost: 'New Post',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    latestPosts: 'Latest Posts',
    loadingPosts: 'Loading posts...',
    loadPostsError: 'Could not load posts. Please try again.',
    heroSubtitle: 'Deep dives into artificial intelligence, machine learning, and the engineering behind modern AI systems.',
    footerText: '© 2026 AI Insider. Built with passion for AI & ML.',
    aboutMe: 'About Me',
    aboutIntro: 'Software Engineer & AI/ML Specialist with 5+ years of experience building intelligent systems at scale.',
    aboutOutro: 'I write about the intersection of AI research and practical engineering — transformers, RAG systems, voice AI, and everything in between.',
    readMore: 'Read more',
    backToBlog: 'Back to blog',
    loadingPost: 'Loading post...',
    loadPostError: 'Could not load post',
    postNotFound: 'Post not found',
    like: 'Like',
    save: 'Save',
    saved: 'Saved',
    share: 'Share',
    signInToInteract: 'Sign in to like, save, and share',
    comments: 'Comments',
    shareThoughts: 'Share your thoughts...',
    comment: 'Comment',
    signInToComment: 'Sign in to leave a comment',
    noComments: 'No comments yet. Be the first!',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome Back',
    joinCommunity: 'Join the AI Insider community',
    signInToLikeSaveComment: 'Sign in to like, save & comment',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    loading: 'Loading...',
    signUp: 'Sign Up',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    writerOnlyArea: 'Writer-only area. Sign in with the writer account to publish posts.',
    createNewBlogPost: 'Create New Blog Post',
    postTitle: 'Post title',
    shortSummary: 'Short summary',
    writePostContent: 'Write your full post content here...',
    readTime: 'Read time',
    tagsComma: 'Tags (comma separated)',
    coverEmoji: 'Cover emoji',
    addUpTo10Photos: 'Add up to 10 photos. These images will appear in the blog post.',
    publishing: 'Publishing...',
    publishPost: 'Publish Post',
    oopsPageNotFound: 'Oops! Page not found',
    returnHome: 'Return to Home',
    accountCreatedWelcome: "Welcome! You're signed in.",
    emailRateLimited:
      'Too many attempts. Wait a few minutes before trying again.',
    genericError: 'Something went wrong. Please try again.',
    invalidEmail: 'Enter a valid email address (example@domain.com).',
    passwordTooShort: 'Use at least 6 characters for your password.',
    passwordHintMin: 'At least 6 characters.',
    nameRequiredSignUp: 'Please enter your name.',
    cannotReachSupabase:
      'Could not reach Supabase (Failed to fetch). Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, your internet, and that the URL uses https and has no typo.',
    emailConfirmRequiredHint:
      'Email confirmation is still on in Supabase. Turn it off: Authentication → Providers → Email → disable “Confirm email”, then sign up or sign in again.',
    forgotPassword: 'Forgot password?',
    resetEmailSent: 'Check your email for a reset link.',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
    passwordMismatch: 'Passwords do not match.',
    passwordUpdatedSuccess: 'Your password was updated. You are signed in.',
    signInToContinueTitle: 'Sign in to continue?',
    signInToContinueDescription:
      'Create an account or sign in to like, save, share, and comment on posts.',
    cancel: 'Cancel',
    backToLogin: 'Back to sign in',
    sendResetLink: 'Send reset link',
    updatePasswordSubmit: 'Update password',
    writeCommentGuest: 'Write a comment',
    forgotPasswordHelp: 'Enter your email and we will send you a link to reset your password.',
    emailDisposable: 'That email uses a temporary or disposable provider. Use a regular email address.',
    emailDnsInvalid:
      'That email domain cannot receive mail (no valid mail servers). Check the spelling or use another address.',
    emailNotAcceptable: 'This email address cannot be used. Please try a different one.',
  },
  ru: {
    blog: 'Блог',
    newPost: 'Новый пост',
    signIn: 'Войти',
    signOut: 'Выйти',
    latestPosts: 'Последние посты',
    loadingPosts: 'Загрузка постов...',
    loadPostsError: 'Не удалось загрузить посты. Попробуйте снова.',
    heroSubtitle: 'Глубокие разборы искусственного интеллекта, машинного обучения и инженерии современных AI-систем.',
    footerText: '© 2026 AI Insider. Создано с любовью к AI и ML.',
    aboutMe: 'Обо мне',
    aboutIntro: 'Инженер-программист и AI/ML специалист с опытом более 5 лет в создании интеллектуальных систем.',
    aboutOutro: 'Я пишу о пересечении AI-исследований и практической инженерии — трансформеры, RAG-системы, голосовой AI и многое другое.',
    readMore: 'Читать далее',
    backToBlog: 'Назад к блогу',
    loadingPost: 'Загрузка поста...',
    loadPostError: 'Не удалось загрузить пост',
    postNotFound: 'Пост не найден',
    like: 'Лайк',
    save: 'Сохранить',
    saved: 'Сохранено',
    share: 'Поделиться',
    signInToInteract: 'Войдите, чтобы лайкать, сохранять и делиться',
    comments: 'Комментарии',
    shareThoughts: 'Поделитесь мыслями...',
    comment: 'Комментировать',
    signInToComment: 'Войдите, чтобы оставить комментарий',
    noComments: 'Комментариев пока нет. Будьте первым!',
    createAccount: 'Создать аккаунт',
    welcomeBack: 'С возвращением',
    joinCommunity: 'Присоединяйтесь к сообществу AI Insider',
    signInToLikeSaveComment: 'Войдите, чтобы лайкать, сохранять и комментировать',
    name: 'Имя',
    email: 'Почта',
    password: 'Пароль',
    loading: 'Загрузка...',
    signUp: 'Регистрация',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    writerOnlyArea: 'Раздел только для автора. Войдите в аккаунт автора, чтобы публиковать посты.',
    createNewBlogPost: 'Создать новый пост',
    postTitle: 'Заголовок поста',
    shortSummary: 'Краткое описание',
    writePostContent: 'Напишите полный текст поста...',
    readTime: 'Время чтения',
    tagsComma: 'Теги (через запятую)',
    coverEmoji: 'Эмодзи обложки',
    addUpTo10Photos: 'Добавьте до 10 фото. Они будут показаны в посте.',
    publishing: 'Публикация...',
    publishPost: 'Опубликовать',
    oopsPageNotFound: 'Упс! Страница не найдена',
    returnHome: 'Вернуться на главную',
    accountCreatedWelcome: 'Добро пожаловать! Вы вошли в аккаунт.',
    emailRateLimited:
      'Слишком много попыток. Подождите несколько минут перед повтором.',
    genericError: 'Что-то пошло не так. Попробуйте снова.',
    invalidEmail: 'Введите корректный email (пример@домен.com).',
    passwordTooShort: 'Пароль не короче 6 символов.',
    passwordHintMin: 'Не менее 6 символов.',
    nameRequiredSignUp: 'Укажите имя.',
    cannotReachSupabase:
      'Нет связи с Supabase (Failed to fetch). Проверьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env, интернет и что URL с https без опечаток.',
    emailConfirmRequiredHint:
      'В Supabase включено подтверждение почты. Отключите: Authentication → Providers → Email → «Confirm email», затем войдите снова.',
    forgotPassword: 'Забыли пароль?',
    resetEmailSent: 'Проверьте почту — мы отправили ссылку для сброса.',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите пароль',
    passwordMismatch: 'Пароли не совпадают.',
    passwordUpdatedSuccess: 'Пароль обновлён. Вы вошли в аккаунт.',
    signInToContinueTitle: 'Войти, чтобы продолжить?',
    signInToContinueDescription:
      'Создайте аккаунт или войдите, чтобы лайкать, сохранять, делиться и комментировать.',
    cancel: 'Отмена',
    backToLogin: 'Назад ко входу',
    sendResetLink: 'Отправить ссылку',
    updatePasswordSubmit: 'Обновить пароль',
    writeCommentGuest: 'Написать комментарий',
    forgotPasswordHelp: 'Укажите email — мы отправим ссылку для сброса пароля.',
    emailDisposable: 'Это временный или одноразовый email. Укажите обычную почту.',
    emailDnsInvalid:
      'Домен не принимает почту (нет почтовых серверов). Проверьте написание или укажите другой адрес.',
    emailNotAcceptable: 'Этот адрес нельзя использовать. Попробуйте другой.',
  },
};

const postTranslationsRu: Record<string, Partial<BlogPost>> = {
  'transformer-architecture-deep-dive': {
    title: 'Архитектура Transformer: глубокий разбор механизмов внимания',
    excerpt: 'Понимание архитектуры, стоящей за GPT, BERT и современными LLM. Как self-attention изменил NLP.',
    tags: ['Трансформеры', 'NLP', 'Глубокое обучение'],
  },
  'building-rag-systems-production': {
    title: 'Построение RAG-систем в продакшене: практические уроки',
    excerpt: 'Практические выводы о создании масштабируемых RAG-систем: чанкинг, эмбеддинги и оценка качества.',
    tags: ['RAG', 'LLM', 'Продакшен ML'],
  },
  'voice-ai-alexa-experience': {
    title: 'Чему я научился, создавая голосовой AI в Amazon Alexa',
    excerpt: 'Опыт работы над NLU-пайплайном Alexa: задержки, неоднозначность и масштаб миллионов пользователей.',
    tags: ['Голосовой AI', 'Alexa', 'NLU'],
  },
  'fine-tuning-llms-practical-guide': {
    title: 'Практическое руководство по дообучению LLM в 2026',
    excerpt: 'Когда выбирать fine-tuning, а когда prompt engineering. LoRA, QLoRA и полный fine-tuning.',
    tags: ['Дообучение', 'LLM', 'LoRA'],
  },
  'ml-system-design-interviews': {
    title: 'Как проходить собеседования по ML System Design: мой подход',
    excerpt: 'Структурированный подход к вопросам по ML System Design на основе практики в топ-компаниях.',
    tags: ['System Design', 'Собеседования', 'Карьера'],
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((current) => (current === 'en' ? 'ru' : 'en')),
      t: (key) => translations[language][key] ?? translations.en[key],
      localizePost: (post) => {
        if (language === 'en') return post;
        const ru = postTranslationsRu[post.id];
        return ru ? { ...post, ...ru } : post;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
