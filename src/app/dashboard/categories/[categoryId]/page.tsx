import { notFound } from 'next/navigation';
import { fakeCategories } from '@/constants/category-mock-api';
import { Category } from '@/constants/category-data';
import CategoryForm from '@/features/categories/components/category-form';

type CategoryViewPageProps = { params: Promise<{ categoryId: string }> };

export default async function CategoryViewPage(props: CategoryViewPageProps) {
  const params = await props.params;
  const categoryId = params.categoryId;
  let category: Category | null = null;
  let pageTitle = 'Create New Category';

  if (categoryId !== 'new') {
    const data = await fakeCategories.getCategoryById(Number(categoryId));

    if (!data.success) {
      notFound();
    }

    category = data.category as Category;
    pageTitle = `Edit Category: ${category.name}`;
  }

  return <CategoryForm initialData={category} pageTitle={pageTitle} />;
}
