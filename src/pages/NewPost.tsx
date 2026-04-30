import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const NewPost = () => {
  const { user, isWriter } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [tags, setTags] = useState('');
  const [coverEmoji, setCoverEmoji] = useState('📝');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotosChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 10) {
      toast.error('You can upload up to 10 photos per post');
      setPhotos(files.slice(0, 10));
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !isWriter) {
      toast.error('Only the blog owner can publish posts');
      navigate('/auth');
      return;
    }

    const id = slugify(title);
    if (!id) {
      toast.error('Please enter a valid title');
      return;
    }

    setIsSubmitting(true);
    const uploadedPhotoUrls: string[] = [];

    if (photos.length > 0) {
      for (const file of photos) {
        const extension = file.name.split('.').pop() || 'jpg';
        const safeName = `${crypto.randomUUID()}.${extension}`;
        const storagePath = `${id}/${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(storagePath, file, { upsert: false });

        if (uploadError) {
          setIsSubmitting(false);
          toast.error(uploadError.message || 'Failed to upload one of the photos');
          return;
        }

        const { data } = supabase.storage.from('post-images').getPublicUrl(storagePath);
        if (data?.publicUrl) {
          uploadedPhotoUrls.push(data.publicUrl);
        }
      }
    }

    const { error } = await supabase.from('posts').insert({
      id,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      date: new Date().toISOString().slice(0, 10),
      read_time: readTime.trim(),
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      cover_emoji: coverEmoji.trim() || '📝',
      photo_urls: uploadedPhotoUrls,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message || 'Could not create post');
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast.success('Post published successfully');
    navigate(`/blog/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {!isWriter && (
          <p className="mb-4 rounded-md border border-border bg-secondary p-3 text-sm text-muted-foreground">
            {t('writerOnlyArea')}
          </p>
        )}
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">{t('createNewBlogPost')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('postTitle')} required />
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder={t('shortSummary')}
            required
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('writePostContent')}
            className="min-h-56"
            required
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder={t('readTime')} required />
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t('tagsComma')} />
            <Input value={coverEmoji} onChange={(e) => setCoverEmoji(e.target.value)} placeholder={t('coverEmoji')} />
          </div>
          <div className="space-y-2">
            <Input type="file" accept="image/*" multiple onChange={handlePhotosChange} />
            <p className="text-xs text-muted-foreground">
              {t('addUpTo10Photos')}
            </p>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {photos.map((file) => (
                  <div key={file.name} className="rounded-md border border-border p-1 text-xs text-muted-foreground">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="bg-hero-gradient">
            {isSubmitting ? t('publishing') : t('publishPost')}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default NewPost;
