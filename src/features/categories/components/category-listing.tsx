import { Category } from '@/constants/category-data';
import { fakeCategories } from '@/constants/category-mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { CategoryTable } from './category-tables';
import { columns } from './category-tables/columns';

type CategoryListingPage = {};

export default async function CategoryListingPage({}: CategoryListingPage) {
  // Get search parameters from URL
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const isActive = searchParamsCache.get('is_active');

  // Build filters object
  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(isActive !== undefined && { isActive: isActive === 'true' })
  };

  // Fetch categories data
  const data = await fakeCategories.getCategories(filters);
  const totalCategories = data.total_categories;
  const categories: Category[] = data.categories;

  return (
    <CategoryTable
      data={categories}
      totalItems={totalCategories}
      columns={columns}
    />
  );
}
