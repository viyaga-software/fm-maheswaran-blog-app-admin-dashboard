"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { addBlog, updateBlog } from '@/lib/actions/blog';
import RichTextEditor from './rich-text-editor';
import { capitalize, generateSlug } from '@/lib/utils';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { sub } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  subtitle: z.string().optional(),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  excerpt: z.string().optional(),
  free_content: z.string().min(1, { message: 'Content is required.' }),
  content: z.string().optional(),
  featured_image: z.string().url({ message: 'Please enter a valid image URL.' }).optional(),
  blog_status: z.enum(['draft', 'published'], { message: 'Please select a status.' }),
  author: z.string().min(1, { message: 'Author is required.' }),
  categories: z.array().optional(),
  seo_meta_title: z.string().min(1, { message: 'SEO Meta title is required.' }),
  seo_meta_description: z.string().min(1, { message: 'SEO Meta description is required.' }),
  is_featured: z.boolean().optional(),
});

export default function BlogForm({ blogData, authors, categories }) {
  const defaultCategories = (blogData?.categories?.length > 1) ? blogData.categories.map((cat) => cat.id) : [];
  const [selectedCategories, setSelectedCategories] = React.useState(defaultCategories);

  const router = useRouter();

  let defaultValues = {
    title: '',
    subtitle: '',
    slug: '',
    excerpt: '',
    free_content: '',
    content: '',
    featured_image: '',
    blog_status: 'draft',
    author: "",
    seo_meta_title: '',
    seo_meta_description: '',
    is_featured: false,
  };

  if (blogData?.documentId) {
    const {
      title,
      subtitle,
      slug,
      excerpt,
      free_content,
      content,
      featured_image,
      blog_status,
      author,
      seo_meta_title,
      seo_meta_description,
      is_featured
    } = blogData;

    defaultValues = {
      title,
      subtitle: subtitle || '',
      slug,
      excerpt: excerpt || '',
      free_content: free_content || '',
      content: content || '',
      featured_image: featured_image || '',
      blog_status: blog_status || '',
      author: author?.id?.toString() || '',
      seo_meta_title: seo_meta_title || '',
      seo_meta_description: seo_meta_description || '',
      is_featured: is_featured || false
    };
  }

  const form = useForm({ resolver: zodResolver(formSchema), defaultValues });
  console.log("categories", form.watch("categories"));

  const onSubmit = async (values) => {
    if (selectedCategories.length < 1) return form.setError("categories", { message: "At least one category is requird" })
    const data = { ...values, categories: selectedCategories };

    if (blogData?.documentId) {
      const updatedBlog = await updateBlog({ documentId: blogData.documentId, blogData: data, defaultValues });
      if (updatedBlog?.error) return toast.error(updatedBlog.error);

      toast.success(updatedBlog?.message);
      return router.push('/dashboard/blogs');
    }

    const newBlog = await addBlog(data);

    if (newBlog?.error) return toast.error(newBlog.error);

    toast.success(newBlog.message);
    form.reset();
    router.push('/dashboard/blogs');
  };

  return (
    <Card className="mx-auto w-full max-w-[90vw]">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {blogData ? 'Edit Blog' : 'Add New Blog'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog title"
                        {...field}
                        onChange={(e) => {
                          form.setValue('title', e.target.value);
                          form.setValue('slug', generateSlug(e.target.value));
                          form.setValue('seo_meta_title', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="subtitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter subtitle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter featured image URL"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authors?.map((author) => (
                          <SelectItem key={author.documentId} value={author.id?.toString()}>
                            {author.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          // Prevent duplicates
                          if (!selectedCategories.includes(+value)) {             // + to convert string to number
                            form.setValue('categories', []);
                            setSelectedCategories([...selectedCategories, +value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add category">Add category</SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            .filter((category) => !selectedCategories.includes(category.id))
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Display selected categories */}

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.length > 0 &&
                    selectedCategories.map((categoryId) => {
                      const category = categories.find((c) => c.id === categoryId);

                      return (
                        <Badge
                          key={categoryId}
                          variant="secondary" // Uses shadcn's built-in badge styling
                          className="flex items-center gap-1 px-3 py-1 rounded-full"
                        >
                          {category?.name}
                          <button
                            type="button"
                            className="ml-1 text-destructive hover:text-destructive/80" // shadcn's color system
                            onClick={() => {
                              setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
                            }}
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      );
                    })}
                </div>
              </div>
              <FormField
                control={form.control}
                name="blog_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={(value) => {
                      form.setValue('blog_status', value);
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="is_featured" render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col justify-center gap-5">
                  <FormLabel>Featured</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a short excerpt for the blog"
                      onChange={(e) => {
                        form.setValue('excerpt', e.target.value);
                        form.setValue('seo_meta_description', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="free_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="seo_meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Meta Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter SEO Meta title"
                        {...field}
                        onChange={(e) => {
                          form.setValue('title', e.target.value);
                          const slug = generateSlug(e.target.value);
                          form.setValue('slug', slug);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Recommended max 60 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seo_meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO Meta Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SEO Meta Description" {...field} />
                    </FormControl>
                    <FormDescription>Recommended max 160 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              <Button type="submit" className="flex justify-end">
                {blogData ? 'Update Blog' : 'Add Blog'}
              </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
