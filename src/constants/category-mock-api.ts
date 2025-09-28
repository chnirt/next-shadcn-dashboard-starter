////////////////////////////////////////////////////////////////////////////////
// 🛑 Category Mock API - Simulates backend for category management
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';
import { Category } from './category-data';

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock category data store
export const fakeCategories = {
  records: [] as Category[],

  // Initialize with sample category data
  initialize() {
    const sampleCategories: Category[] = [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        color: '#3B82F6', // Blue
        icon: 'smartphone',
        is_active: true,
        product_count: 15,
        created_at: '2023-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'Furniture',
        description: 'Home and office furniture',
        color: '#10B981', // Green
        icon: 'sofa',
        is_active: true,
        product_count: 8,
        created_at: '2023-02-20T14:15:00Z',
        updated_at: '2024-01-10T14:15:00Z'
      },
      {
        id: 3,
        name: 'Clothing',
        description: 'Fashion and apparel',
        color: '#F59E0B', // Amber
        icon: 'shirt',
        is_active: true,
        product_count: 25,
        created_at: '2023-03-10T09:45:00Z',
        updated_at: '2024-01-05T09:45:00Z'
      },
      {
        id: 4,
        name: 'Books',
        description: 'Books and educational materials',
        color: '#8B5CF6', // Purple
        icon: 'book',
        is_active: true,
        product_count: 12,
        created_at: '2023-04-05T16:20:00Z',
        updated_at: '2024-01-12T16:20:00Z'
      },
      {
        id: 5,
        name: 'Beauty Products',
        description: 'Cosmetics and personal care',
        color: '#EC4899', // Pink
        icon: 'sparkles',
        is_active: false,
        product_count: 0,
        created_at: '2023-05-12T11:30:00Z',
        updated_at: '2023-12-01T11:30:00Z'
      }
    ];

    this.records = sampleCategories;
  },

  // Get all categories with optional filtering and search
  async getAll({
    isActive,
    search
  }: {
    isActive?: boolean;
    search?: string;
  } = {}) {
    let categories = [...this.records];

    // Filter by active status
    if (isActive !== undefined) {
      categories = categories.filter(
        (category) => category.is_active === isActive
      );
    }

    // Search functionality
    if (search) {
      categories = matchSorter(categories, search, {
        keys: ['name', 'description']
      });
    }

    return categories;
  },

  // Get paginated results with optional filtering and search
  async getCategories({
    page = 1,
    limit = 10,
    isActive,
    search
  }: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  } = {}) {
    await delay(800); // Simulate API delay

    const allCategories = await this.getAll({ isActive, search });
    const totalCategories = allCategories.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedCategories = allCategories.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Categories retrieved successfully',
      total_categories: totalCategories,
      offset,
      limit,
      categories: paginatedCategories
    };
  },

  // Get a specific category by ID
  async getCategoryById(id: number) {
    await delay(500);

    const category = this.records.find((cat) => cat.id === id);

    if (!category) {
      return {
        success: false,
        message: `Category with ID ${id} not found`
      };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Category with ID ${id} found`,
      category
    };
  },

  // Create a new category
  async createCategory(
    categoryData: Omit<
      Category,
      'id' | 'created_at' | 'updated_at' | 'product_count'
    >
  ) {
    await delay(1000);

    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...this.records.map((c) => c.id)) + 1,
      product_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.records.push(newCategory);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Category created successfully',
      category: newCategory
    };
  },

  // Update an existing category
  async updateCategory(
    id: number,
    updateData: Partial<Omit<Category, 'id' | 'created_at' | 'product_count'>>
  ) {
    await delay(1000);

    const categoryIndex = this.records.findIndex((cat) => cat.id === id);

    if (categoryIndex === -1) {
      return {
        success: false,
        message: `Category with ID ${id} not found`
      };
    }

    const updatedCategory = {
      ...this.records[categoryIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    this.records[categoryIndex] = updatedCategory;

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Category updated successfully',
      category: updatedCategory
    };
  },

  // Delete a category
  async deleteCategory(id: number) {
    await delay(1000);

    const categoryIndex = this.records.findIndex((cat) => cat.id === id);

    if (categoryIndex === -1) {
      return {
        success: false,
        message: `Category with ID ${id} not found`
      };
    }

    const deletedCategory = this.records[categoryIndex];
    this.records.splice(categoryIndex, 1);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Category deleted successfully',
      category: deletedCategory
    };
  }
};

// Initialize sample categories
fakeCategories.initialize();
