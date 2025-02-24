import BlogViewPage from '@/components/pages/blog/blog-view-page';
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { getBlogById } from '@/lib/actions/blog';
import { Suspense } from 'react';
import { get } from 'react-hook-form';
import { getAllAuthors } from '@/lib/actions/author';
import { getAllCategories } from '@/lib/actions/category';

export const metadata = {
  title: 'Dashboard : Blog View',
};

const getBlogData = async (blogId) => {
  const data = await getBlogById({
    documentId: blogId,
    fields: "title,slug,excerpt,free_content,content,featured_image,seo_meta_title,seo_meta_description,blog_status",

  });
  return data;
}

const getAuthors = async () => {
  const fields = "username"; // Fetch relevant fields
  const filters = [
    { field: "author_status", operator: "$eq", value: 1 },  // Filtering only active authors
  ];

  const data = await getAllAuthors({ fields, filters, sort: "username:asc", revalidate: 60 * 60 * 24 * 365, tags: ["authors"] });
  return data;
}

const getCategories = async () => {
  const fields = "name"; // Fetch relevant fields
  const data = await getAllCategories({ fields, sort: "name:asc", revalidate: 60 * 60 * 24 * 365, tags: ["categories"] });
  return data;
}

export default async function Page({ params }) {
  const { blogId } = await params;

  let blogData = null;

  if (blogId !== "add") {

    blogData = await getBlogData(blogId);

    if (!blogData || blogData?.error) {
      return <p className='text-center mt-5 font-normal'>Blog Not Found</p>;
    }

  }

  console.log({ blogData });

  const authors = await getAuthors();
  if (authors?.error) return <ServerError message="An error occurred. Please try again later." />;

  const categories = await getCategories();
  if (categories?.error) return <ServerError message="An error occurred. Please try again later." />;

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <BlogViewPage blogData={blogData} authors={authors.data} categories={categories.data} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
